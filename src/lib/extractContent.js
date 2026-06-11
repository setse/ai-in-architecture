// Content extraction for library attachments: PDF and DOCX text, plain
// text files, image thumbnails, and readable text from URLs.
// Heavy parsers (pdfjs, mammoth) are loaded lazily so they don't bloat
// the initial bundle.

const MAX_TEXT_CHARS = 30000;
const MAX_PDF_PAGES = 20;
const THUMB_WIDTH = 480;

export async function extractPdf(file) {
  const pdfjs = await import('pdfjs-dist');
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;

  let text = '';
  const pages = Math.min(pdf.numPages, MAX_PDF_PAGES);
  for (let i = 1; i <= pages && text.length < MAX_TEXT_CHARS; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(' ') + '\n';
  }

  // First page rendered as the card thumbnail.
  let thumbnail = null;
  try {
    const page = await pdf.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: THUMB_WIDTH / base.width });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvas, canvasContext: canvas.getContext('2d'), viewport }).promise;
    thumbnail = canvas.toDataURL('image/jpeg', 0.75);
  } catch {
    thumbnail = null;
  }

  return { text: text.slice(0, MAX_TEXT_CHARS), thumbnail };
}

export async function extractDocx(file) {
  const mammoth = (await import('mammoth/mammoth.browser')).default;
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.slice(0, MAX_TEXT_CHARS);
}

export async function extractPlainText(file) {
  const text = await file.text();
  return text.slice(0, MAX_TEXT_CHARS);
}

export function imageThumbnail(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, THUMB_WIDTH / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script, style, nav, footer, header, noscript, svg').forEach((el) => el.remove());
  const title = doc.querySelector('title')?.textContent?.trim() || '';
  const text = (doc.body?.textContent || '').replace(/\s+/g, ' ').trim();
  return { title, text };
}

/**
 * Fetch readable text from a URL. Direct cross-origin fetches are blocked
 * by CORS for most sites, so this goes through public read-through
 * proxies and degrades gracefully: if everything fails the project is
 * still saved with the bare link.
 */
export async function fetchUrlText(url) {
  // r.jina.ai returns a markdown rendering of the page with CORS enabled.
  try {
    const res = await fetch('https://r.jina.ai/' + url, { signal: AbortSignal.timeout(15000) });
    if (res.ok) {
      const md = await res.text();
      const title = md.match(/^Title:\s*(.+)$/m)?.[1]?.trim() || '';
      const text = md.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
      if (text.length > 100) return { title, text: text.slice(0, MAX_TEXT_CHARS) };
    }
  } catch { /* fall through to next proxy */ }

  try {
    const res = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(url), {
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok) {
      const { title, text } = stripHtml(await res.text());
      if (text.length > 100) return { title, text: text.slice(0, MAX_TEXT_CHARS) };
    }
  } catch { /* unreadable URL — caller keeps the bare link */ }

  return { title: '', text: '' };
}

export function classifyFile(file) {
  const name = file.name.toLowerCase();
  if (file.type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf';
  if (file.type.startsWith('image/')) return 'image';
  if (name.endsWith('.docx')) return 'docx';
  if (file.type.startsWith('text/') || /\.(txt|md|markdown|csv|rtf)$/.test(name)) return 'text';
  return 'other';
}
