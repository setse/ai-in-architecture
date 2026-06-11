import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, X, FileText, Image as ImageIcon, Link as LinkIcon,
  File, Trash2, Calendar, Tag, ArrowLeft, Download, Loader2, ExternalLink,
} from 'lucide-react';
import { getAllProjects, saveProject, deleteProject } from '../lib/projectStore';
import { summarize, extractKeywords } from '../lib/summarize';
import {
  extractPdf, extractDocx, extractPlainText, imageThumbnail, fetchUrlText, classifyFile,
} from '../lib/extractContent';
import './ProjectLibrary.css';

const TYPE_ICONS = { pdf: FileText, image: ImageIcon, docx: File, text: File, other: File };

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function AttachmentChip({ att }) {
  const Icon = TYPE_ICONS[att.kind] || File;
  if (att.kind === 'url') {
    return (
      <a className="pl-attachment" href={att.url} target="_blank" rel="noreferrer">
        <LinkIcon size={15} /> <span>{att.name || att.url}</span> <ExternalLink size={13} />
      </a>
    );
  }
  const download = () => {
    const url = URL.createObjectURL(att.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = att.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };
  return (
    <button className="pl-attachment" onClick={download} title="Download">
      <Icon size={15} /> <span>{att.name}</span> <Download size={13} />
    </button>
  );
}

function AddProjectModal({ onClose, onSaved }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');
  const [customTags, setCustomTags] = useState('');
  const [files, setFiles] = useState([]);
  const [urlInput, setUrlInput] = useState('');
  const [urls, setUrls] = useState([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const addFiles = (list) => setFiles((prev) => [...prev, ...Array.from(list)]);

  const addUrl = () => {
    let u = urlInput.trim();
    if (!u) return;
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    try {
      new URL(u);
      setUrls((prev) => [...prev, u]);
      setUrlInput('');
      setError('');
    } catch {
      setError('That doesn’t look like a valid URL.');
    }
  };

  const handleSave = async () => {
    if (files.length === 0 && urls.length === 0 && !notes.trim()) {
      setError('Add at least one file, URL or note.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const attachments = [];
      let combinedText = notes.trim() ? notes.trim() + '\n' : '';
      let thumbnail = null;
      let derivedTitle = '';

      for (const file of files) {
        const kind = classifyFile(file);
        setProgress(`Reading ${file.name}…`);
        try {
          if (kind === 'pdf') {
            const { text, thumbnail: thumb } = await extractPdf(file);
            combinedText += text + '\n';
            if (!thumbnail) thumbnail = thumb;
          } else if (kind === 'image') {
            const thumb = await imageThumbnail(file);
            if (thumb && !thumbnail) thumbnail = thumb;
          } else if (kind === 'docx') {
            combinedText += (await extractDocx(file)) + '\n';
          } else if (kind === 'text') {
            combinedText += (await extractPlainText(file)) + '\n';
          }
        } catch (e) {
          console.warn(`Could not extract content from ${file.name}`, e);
        }
        attachments.push({ kind, name: file.name, blob: file });
      }

      for (const url of urls) {
        setProgress(`Fetching ${url}…`);
        const { title: pageTitle, text } = await fetchUrlText(url);
        combinedText += text + '\n';
        if (pageTitle && !derivedTitle) derivedTitle = pageTitle;
        attachments.push({ kind: 'url', name: pageTitle || url, url });
      }

      setProgress('Summarising…');
      const summary = summarize(combinedText) || notes.trim();
      const keywords = extractKeywords(combinedText);
      const userTags = customTags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
      const tags = [...new Set([...userTags, ...keywords])];

      const project = {
        id: crypto.randomUUID(),
        title: title.trim() || derivedTitle || files[0]?.name?.replace(/\.[^.]+$/, '') || urls[0] || 'Untitled project',
        date,
        createdAt: Date.now(),
        notes: notes.trim(),
        summary,
        tags,
        thumbnail,
        attachments,
      };
      await saveProject(project);
      onSaved(project);
    } catch (e) {
      console.error(e);
      setError('Something went wrong while processing. Please try again.');
      setBusy(false);
      setProgress('');
    }
  };

  return (
    <div className="pl-modal-backdrop" onClick={busy ? undefined : onClose}>
      <Motion.div
        className="pl-modal"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pl-modal-header">
          <h2>Add Project</h2>
          <button className="pl-icon-btn" onClick={onClose} disabled={busy}><X size={20} /></button>
        </div>

        <label className="pl-label">Title <span className="pl-optional">(optional — derived from content if left blank)</span></label>
        <input className="pl-input" value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Therme Vals — Peter Zumthor" disabled={busy} />

        <div className="pl-row">
          <div style={{ flex: 1 }}>
            <label className="pl-label">Date</label>
            <input className="pl-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={busy} />
          </div>
          <div style={{ flex: 2 }}>
            <label className="pl-label">Your tags <span className="pl-optional">(comma separated)</span></label>
            <input className="pl-input" value={customTags} onChange={(e) => setCustomTags(e.target.value)}
              placeholder="thermal baths, stone, atmosphere" disabled={busy} />
          </div>
        </div>

        <label className="pl-label">Files — PDFs, images, docs</label>
        <div
          className={'pl-dropzone' + (dragOver ? ' drag-over' : '')}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (!busy) addFiles(e.dataTransfer.files); }}
          onClick={() => !busy && fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" multiple hidden
            accept=".pdf,.docx,.txt,.md,.csv,image/*"
            onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
          Drop files here or click to browse
        </div>
        {files.length > 0 && (
          <ul className="pl-file-list">
            {files.map((f, i) => (
              <li key={i}>
                <span>{f.name}</span>
                <button className="pl-icon-btn" disabled={busy}
                  onClick={() => setFiles(files.filter((_, j) => j !== i))}><X size={14} /></button>
              </li>
            ))}
          </ul>
        )}

        <label className="pl-label">Links</label>
        <div className="pl-row">
          <input className="pl-input" style={{ flex: 1 }} value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addUrl()}
            placeholder="https://www.archdaily.com/…" disabled={busy} />
          <button className="pl-btn secondary" onClick={addUrl} disabled={busy}>Add link</button>
        </div>
        {urls.length > 0 && (
          <ul className="pl-file-list">
            {urls.map((u, i) => (
              <li key={i}>
                <span>{u}</span>
                <button className="pl-icon-btn" disabled={busy}
                  onClick={() => setUrls(urls.filter((_, j) => j !== i))}><X size={14} /></button>
              </li>
            ))}
          </ul>
        )}

        <label className="pl-label">Notes <span className="pl-optional">(included in the summary)</span></label>
        <textarea className="pl-input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Why does this project inspire you?" disabled={busy} />

        {error && <p className="pl-error">{error}</p>}

        <div className="pl-modal-footer">
          {busy && <span className="pl-progress"><Loader2 size={16} className="pl-spin" /> {progress}</span>}
          <button className="pl-btn" onClick={handleSave} disabled={busy}>
            {busy ? 'Processing…' : 'Save & summarise'}
          </button>
        </div>
      </Motion.div>
    </div>
  );
}

function ProjectDetail({ project, onClose, onDelete }) {
  return (
    <div className="pl-modal-backdrop" onClick={onClose}>
      <Motion.div className="pl-modal pl-detail"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}>
        <div className="pl-modal-header">
          <h2>{project.title}</h2>
          <button className="pl-icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {project.thumbnail && <img className="pl-detail-thumb" src={project.thumbnail} alt={project.title} />}

        <p className="pl-meta"><Calendar size={15} /> {formatDate(project.date)}</p>

        {project.summary && (
          <>
            <h3 className="pl-subhead">Summary</h3>
            <p className="pl-summary-full">{project.summary}</p>
          </>
        )}

        {project.tags.length > 0 && (
          <div className="pl-tags">
            {project.tags.map((t) => <span key={t} className="pl-tag"><Tag size={12} /> {t}</span>)}
          </div>
        )}

        {project.notes && (
          <>
            <h3 className="pl-subhead">Notes</h3>
            <p>{project.notes}</p>
          </>
        )}

        {project.attachments.length > 0 && (
          <>
            <h3 className="pl-subhead">Sources</h3>
            <div className="pl-attachments">
              {project.attachments.map((att, i) => <AttachmentChip key={i} att={att} />)}
            </div>
          </>
        )}

        <div className="pl-modal-footer">
          <button className="pl-btn danger" onClick={() => {
            if (window.confirm(`Delete “${project.title}”? This cannot be undone.`)) onDelete(project.id);
          }}>
            <Trash2 size={16} /> Delete project
          </button>
        </div>
      </Motion.div>
    </div>
  );
}

export default function ProjectLibrary({ onBack }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState(null);
  const [sortDesc, setSortDesc] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getAllProjects()
      .then(setProjects)
      .catch((e) => console.error('Failed to load library', e))
      .finally(() => setLoading(false));
  }, []);

  const allTags = useMemo(() => {
    const counts = new Map();
    for (const p of projects) for (const t of p.tags) counts.set(t, (counts.get(t) || 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20).map(([t]) => t);
  }, [projects]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) => !activeTag || p.tags.includes(activeTag))
      .filter((p) => !q
        || p.title.toLowerCase().includes(q)
        || p.summary.toLowerCase().includes(q)
        || p.tags.some((t) => t.includes(q)))
      .sort((a, b) => (sortDesc ? 1 : -1) * ((b.date || '').localeCompare(a.date || '') || b.createdAt - a.createdAt));
  }, [projects, query, activeTag, sortDesc]);

  const handleDelete = async (id) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setSelected(null);
  };

  return (
    <div className="pl-page">
      <div className="container">
        <div className="pl-header">
          <div>
            {onBack && (
              <button className="pl-back" onClick={onBack}><ArrowLeft size={16} /> Back to site</button>
            )}
            <h1>Project <span className="gradient-text">Library</span></h1>
            <p className="pl-tagline">
              Your personal archive of architectural inspiration — drop in PDFs, images, docs and
              links, and get automatic summaries and keyword tags.
            </p>
          </div>
          <button className="pl-btn" onClick={() => setShowAdd(true)}><Plus size={18} /> Add project</button>
        </div>

        <div className="pl-toolbar">
          <div className="pl-search">
            <Search size={17} />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles, summaries, tags…" />
          </div>
          <button className="pl-btn secondary" onClick={() => setSortDesc(!sortDesc)}>
            <Calendar size={15} /> {sortDesc ? 'Newest first' : 'Oldest first'}
          </button>
        </div>

        {allTags.length > 0 && (
          <div className="pl-tagbar">
            {allTags.map((t) => (
              <button key={t}
                className={'pl-tag clickable' + (activeTag === t ? ' active' : '')}
                onClick={() => setActiveTag(activeTag === t ? null : t)}>
                {t}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="pl-empty"><Loader2 size={18} className="pl-spin" /> Loading library…</p>
        ) : visible.length === 0 ? (
          <div className="pl-empty">
            {projects.length === 0
              ? 'Your library is empty. Add your first project to start collecting inspiration.'
              : 'No projects match your search.'}
          </div>
        ) : (
          <div className="pl-grid">
            {visible.map((p) => (
              <Motion.article key={p.id} className="pl-card" layout
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelected(p)}>
                {p.thumbnail ? (
                  <img className="pl-card-thumb" src={p.thumbnail} alt="" loading="lazy" />
                ) : (
                  <div className="pl-card-thumb placeholder">
                    {p.attachments.some((a) => a.kind === 'url') ? <LinkIcon size={36} /> : <FileText size={36} />}
                  </div>
                )}
                <div className="pl-card-body">
                  <p className="pl-meta"><Calendar size={13} /> {formatDate(p.date)}</p>
                  <h3>{p.title}</h3>
                  {p.summary && <p className="pl-card-summary">{p.summary}</p>}
                  <div className="pl-tags">
                    {p.tags.slice(0, 4).map((t) => <span key={t} className="pl-tag small">{t}</span>)}
                    {p.tags.length > 4 && <span className="pl-tag small">+{p.tags.length - 4}</span>}
                  </div>
                </div>
              </Motion.article>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <AddProjectModal
            onClose={() => setShowAdd(false)}
            onSaved={(project) => {
              setProjects((prev) => [project, ...prev]);
              setShowAdd(false);
            }}
          />
        )}
        {selected && (
          <ProjectDetail project={selected} onClose={() => setSelected(null)} onDelete={handleDelete} />
        )}
      </AnimatePresence>
    </div>
  );
}
