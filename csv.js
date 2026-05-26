/* =====================================================================
   csv.js — tiny CSV parser + article import logic.
   Handles quoted fields, embedded commas, escaped quotes ("").
   ===================================================================== */
(function () {

  function parseCSV(text) {
    // Strip BOM
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;
    let i = 0;

    while (i < text.length) {
      const ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        field += ch; i++; continue;
      }
      // not in quotes
      if (ch === '"') { inQuotes = true; i++; continue; }
      if (ch === ',') { row.push(field); field = ''; i++; continue; }
      if (ch === '\r') { i++; continue; }
      if (ch === '\n') {
        row.push(field); rows.push(row);
        row = []; field = ''; i++; continue;
      }
      field += ch; i++;
    }
    // trailing field/row
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
    return rows.filter(r => r.some(c => c.trim() !== ''));
  }

  // Map a "Journal" column value to one of our slice keys.
  // Unrecognized names route to the Mystery slot — that's how the
  // monthly featured journal is delivered: just put its real name in
  // the Journal column.
  function mapJournalKey(rawName) {
    const n = (rawName || '').toLowerCase().trim();
    if (!n) return null;
    if (n.includes('intelligent system')) return 'adv-intelligent-systems';
    if (n.includes('intelligent discovery')) return 'adv-intelligent-discovery';
    if (n.includes('advanced science') || /^advs\b/.test(n)) return 'adv-science';
    if (n === 'aisy') return 'adv-intelligent-systems';
    if (n === 'aidi' || n === 'aid') return 'adv-intelligent-discovery';
    if (n === 'as')   return 'adv-science';
    return 'mystery';
  }

  function findColumn(headers, candidates) {
    const norm = headers.map(h => (h || '').toLowerCase().trim());
    for (const c of candidates) {
      const idx = norm.indexOf(c);
      if (idx !== -1) return idx;
    }
    return -1;
  }

  // Build an ARTICLES map from parsed CSV rows.
  // Expected columns (case-insensitive, in any order):
  //   Journal | Title | Authors | Keywords | DOI | Year
  function buildArticlesFromCSV(rows) {
    if (!rows.length) throw new Error('CSV is empty.');
    const headers = rows[0].map(h => (h || '').trim());
    const ix = {
      journal: findColumn(headers, ['journal']),
      title:   findColumn(headers, ['title']),
      authors: findColumn(headers, ['authors', 'author']),
      keywords:findColumn(headers, ['keywords', 'tags', 'topics']),
      doi:     findColumn(headers, ['doi']),
      year:    findColumn(headers, ['year']),
    };
    const missing = ['journal','title','doi']
      .filter(k => ix[k] === -1);
    if (missing.length) {
      throw new Error('CSV is missing required column(s): ' + missing.join(', ') +
        '. Expected header row: Journal, Title, Authors, Keywords, DOI, Year');
    }

    const out = {
      'adv-science': [],
      'adv-intelligent-systems': [],
      'adv-intelligent-discovery': [],
      'mystery': [],
    };
    const mysteryLabels = new Set();

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const rawJournal = (row[ix.journal] || '').trim();
      const key = mapJournalKey(rawJournal);
      if (!key) continue;
      const doi = (row[ix.doi] || '').trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
      if (!doi) continue;

      const keywords = ix.keywords === -1 ? '' : (row[ix.keywords] || '').trim();
      const tags = keywords
        ? keywords.split(/[;,|]/).map(s => s.trim()).filter(Boolean).slice(0, 4)
        : [];
      const year = ix.year === -1 ? '' : (row[ix.year] || '').trim();

      const article = {
        title:   (row[ix.title] || '').trim() || 'Untitled',
        authors: (row[ix.authors] || '').trim() || '—',
        type:    year ? `Article · ${year}` : 'Article',
        doi:     doi,
        tags:    tags,
        journalLabel: rawJournal,  // shown in popup for mystery picks
      };
      out[key].push(article);
      if (key === 'mystery' && rawJournal) mysteryLabels.add(rawJournal);
    }

    return {
      articles: out,
      mysteryLabels: Array.from(mysteryLabels),
      counts: {
        'adv-science': out['adv-science'].length,
        'adv-intelligent-systems': out['adv-intelligent-systems'].length,
        'adv-intelligent-discovery': out['adv-intelligent-discovery'].length,
        'mystery': out['mystery'].length,
      },
    };
  }

  // CSV template the user can download as a starter.
  const CSV_TEMPLATE =
'Journal,Title,Authors,Keywords,DOI,Year\n' +
'Advanced Science,"Engineering organoid heterogeneity through programmable mechanical confinement","L. Marin, R. Okafor, S. Yamada","Biomaterials; Organoids",10.1002/advs.202604812,2026\n' +
'Advanced Intelligent Systems,"Foundation models for closed-loop control of soft bipedal robots","H. Wei, J. Patel, S. Tanaka","Robotics; Foundation Models",10.1002/aisy.202600118,2026\n' +
'Advanced Intelligent Discovery,"Active-learning loops cut MOF synthesis to 40% of conventional time","M. Khanna, F. Rosso, D. Park","Materials Discovery; Active Learning",10.1002/aidi.202600042,2026\n' +
'Nature Reviews Physics,"This month\'s mystery pick — a deep dive on autonomous laboratories","A. Lab Curator","Cross-journal; Featured",10.1038/s42254-026-00999-x,2026\n';

  // Load + persist
  const LS_KEY = 'wiley-wheel-articles-v1';
  const LS_MYSTERY = 'wiley-wheel-mystery-label-v1';

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }
  function saveToStorage(payload) {
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  }
  function clearStorage() {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(LS_MYSTERY);
  }
  function setMysteryLabel(label) {
    if (label) localStorage.setItem(LS_MYSTERY, label);
    else localStorage.removeItem(LS_MYSTERY);
  }
  function getMysteryLabel() {
    return localStorage.getItem(LS_MYSTERY) || '';
  }

  // Apply stored CSV articles to window.ARTICLES at boot (called from HTML
  // BEFORE the React app mounts, so the wheel sees the latest data).
  function applyStoredArticles() {
    const stored = loadFromStorage();
    if (!stored || !stored.articles) return;
    // REPLACE — the uploaded CSV is the source of truth.
    // Any journal missing from the upload becomes an empty list, and
    // the UI will surface a clear "no articles" popup if the wheel lands there.
    for (const k of Object.keys(window.ARTICLES)) {
      window.ARTICLES[k] = stored.articles[k] || [];
    }
    // Reflect mystery label in JOURNALS for the popup masthead.
    const label = getMysteryLabel();
    if (label && window.JOURNALS && window.JOURNALS.mystery) {
      window.JOURNALS.mystery.name = label;
      window.JOURNALS.mystery.short = label;
    }
  }

  window.WheelCSV = {
    parseCSV,
    buildArticlesFromCSV,
    loadFromStorage,
    saveToStorage,
    clearStorage,
    setMysteryLabel,
    getMysteryLabel,
    applyStoredArticles,
    CSV_TEMPLATE,
  };

})();
