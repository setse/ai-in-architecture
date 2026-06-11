// Lightweight extractive summarization + keyword tagging.
// Runs fully in the browser — no API keys or network calls required.

const STOPWORDS = new Set(`a about above after again against all am an and any are as at be because been
before being below between both but by can cannot could did do does doing down during each few for from
further had has have having he her here hers herself him himself his how i if in into is it its itself
just me more most my myself no nor not now of off on once only or other our ours ourselves out over own
same she should so some such than that the their theirs them themselves then there these they this those
through to too under until up very was we were what when where which while who whom why will with you
your yours yourself yourselves also one two three may might must shall upon via etc however therefore
thus within without among along across behind beyond toward towards onto would s t don re ve ll d m
new used using use uses based well like many much made make makes part page www http https com org html`
  .split(/\s+/));

// Domain vocabulary boosted during keyword scoring so tags skew toward
// architecturally meaningful terms instead of generic frequent words.
const ARCH_TERMS = new Set(`facade elevation section plan massing parametric generative tectonic timber
concrete steel glass brick stone bamboo masonry prefab modular pavilion museum housing residential tower
skyscraper landscape urbanism urban courtyard atrium cantilever vault arch dome truss lattice shell grid
sustainable sustainability passive solar daylight ventilation thermal biophilic adaptive reuse renovation
restoration brutalism brutalist modernism modernist minimalism minimalist bauhaus deconstructivism
vernacular contextual typology circulation threshold spatial interior exterior cladding louver pergola
canopy podium plinth mezzanine skylight courtyards porosity materiality ornament proportion symmetry
asymmetry rhythm void program zoning site context topography waterfront pavilions installation biennale
render rendering model maquette diagram axonometric perspective detail joinery formwork rammed earth
geometry algorithmic computational bim revit rhino grasshopper cad render lighting acoustics structure
structural span column beam slab core envelope insulation greenroof photovoltaic galleria plaza`
  .split(/\s+/));

function tokenize(text) {
  return (text.toLowerCase().match(/[a-zàáâäãéèêëíìîïóòôöõúùûüçñ][a-zàáâäãéèêëíìîïóòôöõúùûüçñ'-]+/g) || [])
    .map((w) => w.replace(/^'+|'+$/g, ''))
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function wordFrequencies(text) {
  const freq = new Map();
  for (const w of tokenize(text)) freq.set(w, (freq.get(w) || 0) + 1);
  return freq;
}

function splitSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30 && s.length < 500 && /[a-zA-Z]{3}/.test(s));
}

/**
 * Pick the most representative sentences (frequency-scored, with a small
 * bonus for sentences near the start of the document) and return them in
 * their original order.
 */
export function summarize(text, maxSentences = 3) {
  if (!text || !text.trim()) return '';
  const sentences = splitSentences(text);
  if (sentences.length === 0) return text.slice(0, 280);
  if (sentences.length <= maxSentences) return sentences.join(' ');

  const freq = wordFrequencies(text);
  const maxFreq = Math.max(...freq.values(), 1);

  const scored = sentences.map((sentence, i) => {
    const words = tokenize(sentence);
    if (words.length === 0) return { sentence, i, score: 0 };
    let score = 0;
    for (const w of words) {
      score += (freq.get(w) || 0) / maxFreq;
      if (ARCH_TERMS.has(w)) score += 0.3;
    }
    score /= words.length;
    // Lead sentences usually carry the project description.
    if (i < 3) score *= 1.25;
    return { sentence, i, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.i - b.i)
    .map((s) => s.sentence)
    .join(' ');
}

/** Top keywords by boosted term frequency, for use as tags. */
export function extractKeywords(text, max = 7) {
  if (!text || !text.trim()) return [];
  const freq = wordFrequencies(text);
  return [...freq.entries()]
    .map(([word, count]) => [word, count * (ARCH_TERMS.has(word) ? 2.5 : 1)])
    .filter(([, score]) => score > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([word]) => word);
}
