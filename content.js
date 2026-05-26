/* =====================================================================
   content.js — the ONLY file you need to edit each month.
   ---------------------------------------------------------------------
   Update this and refresh the page. No code changes needed elsewhere.
   ===================================================================== */
(function () {

/* ---------------------------------------------------------------------
   1) THE FOUR JOURNALS
   ---------------------------------------------------------------------
   Each entry needs: cover image (path under /covers/), the journal's
   landing page URL, and the masthead info shown on slices + popup.

   The "mystery" entry rotates monthly — swap its cover, name, url, and
   the articles below whenever you change the featured journal.
   --------------------------------------------------------------------- */
window.JOURNALS = {

  'adv-science': {
    key: 'adv-science',
    name: 'Advanced Science',
    short: 'Adv. Science',
    cover: 'covers/adv-science.jpg',
    url: 'https://advanced.onlinelibrary.wiley.com/journal/21983844',
    issue: 'Vol. 13 · No. 28 · May 18 · 2026',
    site: 'advanced.onlinelibrary.wiley.com',
  },

  'adv-intelligent-systems': {
    key: 'adv-intelligent-systems',
    name: 'Advanced Intelligent Systems',
    short: 'Adv. Intel. Systems',
    cover: 'covers/adv-intelligent-systems.jpg',
    url: 'https://advanced.onlinelibrary.wiley.com/journal/26404567',
    issue: 'Vol. 8 · No. 5 · May · 2026',
    site: 'advanced.onlinelibrary.wiley.com',
  },

  'adv-intelligent-discovery': {
    key: 'adv-intelligent-discovery',
    name: 'Advanced Intelligent Discovery',
    short: 'Adv. Intel. Discovery',
    cover: 'covers/adv-intelligent-discovery.jpg',
    url: 'https://advanced.onlinelibrary.wiley.com/journal/29439981',
    issue: 'Vol. 2 · No. 2 · April · 2026',
    site: 'advanced.onlinelibrary.wiley.com',
  },

  /* ============ MYSTERY JOURNAL — REPLACE MONTHLY ============
     1. Drop a new cover image into /covers/ (e.g. covers/mystery-may.jpg)
     2. Update `cover`, `name`, `url`, `issue` below
     3. Update the `mystery` article list further down                  */
  'mystery': {
    key: 'mystery',
    name: 'Mystery journal',
    short: 'Mystery',
    cover: '',                  // optional — leave '' to keep the green "?" slice
    url: 'https://advanced.onlinelibrary.wiley.com/',
    issue: 'Rotates monthly',
    site: 'advanced.onlinelibrary.wiley.com',
  },
};

/* ---------------------------------------------------------------------
   2) ARTICLES PER JOURNAL
   ---------------------------------------------------------------------
   When the wheel lands on a journal, one of its articles is picked at
   random. Add as many as you like — minimum one per journal.

   Each article needs:
     title    — the paper's title
     authors  — display string for the byline
     type     — short tag (e.g. "Research Article", "Open Access", "Review")
     doi      — JUST the DOI, no "https://doi.org/" prefix
     tags     — optional list of topic chips shown in the popup
   --------------------------------------------------------------------- */
window.ARTICLES = {

  'adv-science': [
    {
      title: 'Engineering organoid heterogeneity through programmable mechanical confinement',
      authors: 'L. Marin, R. Okafor, S. Yamada · 14 authors',
      type: 'Research Article',
      doi: '10.1002/advs.202604812',
      tags: ['Biomaterials', 'Organoids'],
    },
    {
      title: 'Multiplexed fluorescence imaging of cytoskeletal dynamics in living spheroids',
      authors: 'P. Andersen, K. Liu, M. Carrera · 9 authors',
      type: 'Open Access',
      doi: '10.1002/advs.202604921',
      tags: ['Imaging', 'Cell Biology'],
    },
  ],

  'adv-intelligent-systems': [
    {
      title: 'Foundation models for closed-loop control of soft bipedal robots',
      authors: 'H. Wei, J. Patel, S. Tanaka · 7 authors',
      type: 'Research Article',
      doi: '10.1002/aisy.202600118',
      tags: ['Robotics', 'Foundation Models'],
    },
    {
      title: 'Self-supervised tactile representations for dexterous manipulation',
      authors: 'A. Romero, T. Becker, M. Nair · 11 authors',
      type: 'Open Access',
      doi: '10.1002/aisy.202600224',
      tags: ['Tactile Sensing', 'Embodied AI'],
    },
  ],

  'adv-intelligent-discovery': [
    {
      title: 'Active-learning loops cut MOF synthesis to 40% of conventional time',
      authors: 'M. Khanna, F. Rosso, D. Park · 8 authors',
      type: 'Featured',
      doi: '10.1002/aidi.202600042',
      tags: ['Materials Discovery', 'Active Learning'],
    },
    {
      title: 'Symbolic regression over reaction graphs surfaces unseen catalysts',
      authors: 'C. Brennan, V. Iyer, A. Lindqvist · 6 authors',
      type: 'Open Access',
      doi: '10.1002/aidi.202600067',
      tags: ['Catalysis', 'Symbolic ML'],
    },
  ],

  /* ============ MYSTERY JOURNAL ARTICLES — REPLACE MONTHLY ============ */
  'mystery': [
    {
      title: 'Editor\u2019s top pick: a cross-journal review on autonomous laboratories',
      authors: 'Selected by the editorial board',
      type: 'Editor\u2019s Pick',
      doi: '10.1002/wiley.editorspick.2026',
      tags: ['Cross-journal', 'Featured'],
    },
  ],
};

/* ---------------------------------------------------------------------
   3) WHEEL SLICE ORDER (advanced — usually no need to change)
   ---------------------------------------------------------------------
   Seven slices, clockwise from 12 o'clock. Each of the three real
   journals appears twice; the mystery slot once. Order is interleaved
   so no two same-journal slices are adjacent.
   --------------------------------------------------------------------- */
window.SLICE_ORDER = [
  'adv-science',
  'adv-intelligent-systems',
  'adv-intelligent-discovery',
  'adv-science',
  'adv-intelligent-systems',
  'adv-intelligent-discovery',
  'mystery',
];

})();
