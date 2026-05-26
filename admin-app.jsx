/* =====================================================================
   admin-app.jsx — Editor tool for managing the wheel's article catalogue.
   Workflow: upload CSV → preview parsed list → download articles.json →
   hand the file to engineering / drop it on the server's hosting path.
   The visitor page (Spin The Wheel.html) fetches articles.json at boot.
   ===================================================================== */

const ADMIN_TYPE_DEFAULT = 'Article';

function AdminApp() {
  const [catalog, setCatalog] = React.useState(null); // {articles, mysteryLabel}
  const [source, setSource] = React.useState('loading'); // 'live' | 'upload' | 'defaults' | 'loading'
  const [status, setStatus] = React.useState(null);
  const [parseErrors, setParseErrors] = React.useState([]);
  const fileRef = React.useRef(null);
  const [mysteryLabel, setMysteryLabel] = React.useState('');

  // Boot: load whatever's currently live (articles.json), else fall back to defaults.
  React.useEffect(() => {
    function withTimeout(promise, ms) {
      return Promise.race([
        promise,
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)),
      ]);
    }
    (async () => {
      try {
        const r = await withTimeout(fetch('articles.json', { cache: 'no-cache' }), 1500);
        if (r.ok) {
          const data = await r.json();
          if (data && data.articles) {
            setCatalog({
              articles: normalizeArticles(data.articles),
              mysteryLabel: data.mysteryLabel || '',
            });
            setMysteryLabel(data.mysteryLabel || '');
            setSource('live');
            return;
          }
        }
      } catch (e) { /* fall through to defaults */ }
      setCatalog({
        articles: normalizeArticles(window.ARTICLES),
        mysteryLabel: '',
      });
      setSource('defaults');
    })();
  }, []);

  function normalizeArticles(obj) {
    const KEYS = ['adv-science', 'adv-intelligent-systems', 'adv-intelligent-discovery', 'mystery'];
    const out = {};
    for (const k of KEYS) out[k] = Array.isArray(obj && obj[k]) ? obj[k] : [];
    return out;
  }

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const rows = window.WheelCSV.parseCSV(text);
        const parsed = window.WheelCSV.buildArticlesFromCSV(rows);
        const total = Object.values(parsed.counts).reduce((a, b) => a + b, 0);
        if (total === 0) throw new Error('CSV parsed but produced 0 articles. Check that the Journal and DOI columns are filled in.');
        const newCatalog = {
          articles: normalizeArticles(parsed.articles),
          mysteryLabel: mysteryLabel || (parsed.mysteryLabels.length === 1 ? parsed.mysteryLabels[0] : ''),
        };
        setCatalog(newCatalog);
        setMysteryLabel(newCatalog.mysteryLabel);
        setSource('upload');
        setStatus({ kind: 'ok', msg: `Parsed ${total} article${total === 1 ? '' : 's'} from ${file.name}.` });
        setParseErrors([]);
      } catch (err) {
        setStatus({ kind: 'err', msg: err.message || String(err) });
      }
    };
    reader.onerror = () => setStatus({ kind: 'err', msg: 'Could not read the file.' });
    reader.readAsText(file);
  }

  function downloadTemplate() {
    triggerDownload(window.WheelCSV.CSV_TEMPLATE, 'wiley-wheel-articles-template.csv', 'text/csv');
  }

  function exportJSON() {
    const payload = {
      _comment: 'Article catalogue served to visitors. Generated ' + new Date().toISOString() + ' by admin.html.',
      mysteryLabel: mysteryLabel || '',
      articles: catalog.articles,
    };
    const json = JSON.stringify(payload, null, 2);
    triggerDownload(json, 'articles.json', 'application/json');
  }

  function triggerDownload(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  if (!catalog) {
    return <div className="admin-shell"><Loading /></div>;
  }

  const counts = {
    'adv-science': catalog.articles['adv-science'].length,
    'adv-intelligent-systems': catalog.articles['adv-intelligent-systems'].length,
    'adv-intelligent-discovery': catalog.articles['adv-intelligent-discovery'].length,
    'mystery': catalog.articles['mystery'].length,
  };
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const empties = Object.entries(counts).filter(([k, n]) => n === 0).map(([k]) => k);

  return (
    <div className="admin-shell">
      <Header source={source} total={total} />

      <Section
        eyebrow="1. Upload"
        title="Replace the catalogue with a CSV"
        body={
          <React.Fragment>
            <p style={pStyle}>
              The CSV header row must include <code style={codeStyle}>Journal</code>, <code style={codeStyle}>Title</code>, and <code style={codeStyle}>DOI</code>. Optional columns: <code style={codeStyle}>Authors</code>, <code style={codeStyle}>Keywords</code>, <code style={codeStyle}>Year</code>. List as many articles per journal as you like; the wheel picks one at random when it lands. Any journal name that isn't one of the three Advanced journals routes to <strong style={{color:'#005E3A'}}>Mystery</strong> — put the month's featured journal there.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
              <input ref={fileRef} type="file" accept=".csv,text/csv"
                onChange={(e) => handleFile(e.target.files && e.target.files[0])}
                style={{ display: 'none' }} />
              <button onClick={() => fileRef.current && fileRef.current.click()} style={btnPrimary}>Choose CSV file</button>
              <button onClick={downloadTemplate} style={btnGhost}>Download CSV template</button>
            </div>
            {status && (
              <div style={{
                marginTop: 16, padding: '10px 14px', borderRadius: 6,
                background: status.kind === 'ok' ? '#EFFDF6' : '#FBECEA',
                color: status.kind === 'ok' ? '#005E3A' : '#B3261E',
                border: `1px solid ${status.kind === 'ok' ? '#BFF5DD' : '#F5C7C2'}`,
                font: '400 13px Inter, sans-serif',
              }}>{status.msg}</div>
            )}
          </React.Fragment>
        }
      />

      <Section
        eyebrow="2. Review"
        title={`${total} article${total === 1 ? '' : 's'} loaded across 4 slices`}
        body={
          <React.Fragment>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12, marginBottom: 24,
            }}>
              {[
                ['adv-science', 'Advanced Science'],
                ['adv-intelligent-systems', 'Adv. Intel. Systems'],
                ['adv-intelligent-discovery', 'Adv. Intel. Discovery'],
                ['mystery', mysteryLabel || 'Mystery'],
              ].map(([k, label]) => (
                <div key={k} style={{
                  background: '#FFFFFF', padding: '16px',
                  border: `1px solid ${counts[k] === 0 ? '#F5C7C2' : '#E5E4E0'}`,
                  borderRadius: 6,
                }}>
                  <div style={{
                    font: '300 32px "IBM Plex Mono", monospace',
                    color: counts[k] === 0 ? '#B3261E' : '#001E22',
                    letterSpacing: '-0.03em', lineHeight: 1,
                  }}>{counts[k]}</div>
                  <div style={{
                    font: '500 11px "IBM Plex Mono", monospace',
                    letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: '#5D5E5C', marginTop: 8,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{label}</div>
                </div>
              ))}
            </div>

            {empties.length > 0 && (
              <div style={{
                background: '#FFF3E0', border: '1px solid #FFD89E',
                borderRadius: 6, padding: '12px 14px', marginBottom: 24,
                font: '400 13px Inter, sans-serif', color: '#8A5A1F',
                lineHeight: 1.5,
              }}>
                <strong>Heads up:</strong> {empties.length} slice{empties.length === 1 ? '' : 's'} {empties.length === 1 ? 'has' : 'have'} no articles. The wheel will land on {empties.length === 1 ? 'it' : 'them'} as usual but the popup will show an "No articles loaded" notice. Affected: {empties.map(k => labelFor(k, mysteryLabel)).join(', ')}.
              </div>
            )}

            {/* Mystery label */}
            <div style={{
              background: '#FFFFFF', border: '1px solid #E5E4E0',
              borderRadius: 6, padding: '16px 18px', marginBottom: 24,
            }}>
              <label style={{
                display: 'block',
                font: '500 11px "IBM Plex Mono", monospace',
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: '#5D5E5C', marginBottom: 6,
              }}>Mystery journal — display name</label>
              <input
                type="text"
                value={mysteryLabel}
                onChange={(e) => setMysteryLabel(e.target.value)}
                placeholder="e.g. Nature Reviews Physics"
                style={{
                  width: '100%', height: 44, padding: '0 14px', borderRadius: 6,
                  border: '1px solid #C9C7C2',
                  font: '400 14px Inter, sans-serif', color: '#302F2F',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = '#00D875'}
                onBlur={(e) => e.target.style.borderColor = '#C9C7C2'}
              />
              <p style={{ ...pStyle, marginTop: 10, marginBottom: 0 }}>
                Shown on the popup masthead when the wheel lands on the mystery slice. Leave blank to keep the default.
              </p>
            </div>

            {/* Article tables */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {Object.entries(catalog.articles).map(([k, list]) => (
                <JournalBlock
                  key={k}
                  journalKey={k}
                  label={labelFor(k, mysteryLabel)}
                  list={list}
                />
              ))}
            </div>
          </React.Fragment>
        }
      />

      <Section
        eyebrow="3. Publish"
        title="Download articles.json and replace the live file"
        body={
          <React.Fragment>
            <p style={pStyle}>
              Hit <em>Download</em>, then replace <code style={codeStyle}>articles.json</code> at the deployed path of the wheel. The visitor page fetches that file at every load. No browser caching is requested.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={exportJSON} style={btnPrimary}>Download articles.json</button>
            </div>
            <details style={{ marginTop: 24 }}>
              <summary style={{
                cursor: 'pointer',
                font: '500 12px "IBM Plex Mono", monospace',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#5D5E5C',
              }}>Preview JSON</summary>
              <pre style={{
                marginTop: 12,
                background: '#001E22', color: '#BFF5DD',
                padding: 16, borderRadius: 6,
                font: '400 12px "IBM Plex Mono", monospace',
                lineHeight: 1.6, overflow: 'auto', maxHeight: 360,
              }}>{JSON.stringify({
                _comment: 'Article catalogue served to visitors.',
                mysteryLabel: mysteryLabel || '',
                articles: catalog.articles,
              }, null, 2)}</pre>
            </details>
          </React.Fragment>
        }
      />

      <Footer />
    </div>
  );
}

function labelFor(k, mysteryLabel) {
  if (k === 'adv-science') return 'Advanced Science';
  if (k === 'adv-intelligent-systems') return 'Advanced Intelligent Systems';
  if (k === 'adv-intelligent-discovery') return 'Advanced Intelligent Discovery';
  if (k === 'mystery') return mysteryLabel ? `Mystery · ${mysteryLabel}` : 'Mystery journal';
  return k;
}

function Loading() {
  return (
    <div style={{
      padding: '120px 0', textAlign: 'center',
      font: '400 14px "IBM Plex Mono", monospace',
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color: '#5D5E5C',
    }}>Loading current catalogue…</div>
  );
}

function Header({ source, total }) {
  const sourceLabel = {
    live: 'Editing what is currently published (articles.json)',
    upload: 'Editing your most recent upload (not yet downloaded)',
    defaults: 'No articles.json found — editing built-in defaults',
    loading: '',
  }[source];
  const sourceColor = source === 'live' ? '#005E3A' : source === 'upload' ? '#9747FF' : '#B8782C';
  return (
    <header style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
        <div style={{
          width: 96, height: 22, background: '#003B44',
          mask: 'url(assets/wordmark-light.svg) center/contain no-repeat',
          WebkitMask: 'url(assets/wordmark-light.svg) center/contain no-repeat',
        }} />
        <span style={{
          font: '500 11px "IBM Plex Mono", monospace',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: '#9747FF',
          paddingLeft: 14, borderLeft: '1px solid #C9C7C2',
        }}>Editor tool</span>
        <span style={{ flex: 1 }} />
        <a href="Spin The Wheel.html" target="_blank" rel="noopener noreferrer"
          style={{
            font: '500 12px "IBM Plex Mono", monospace',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#003B44', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 14px', borderRadius: 6,
            border: '1px solid #003B44',
          }}>
          Open visitor page
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </a>
      </div>
      <h1 style={{
        margin: '0 0 12px',
        font: '300 44px Inter, sans-serif',
        letterSpacing: '-0.025em',
        lineHeight: 1.02,
        color: '#001E22',
      }}>Manage the Spin The Wheel catalogue.</h1>
      <p style={{
        margin: 0,
        font: '400 16px Inter, sans-serif',
        color: '#302F2F', lineHeight: 1.55, maxWidth: 720,
      }}>
        Upload a CSV of articles, set the month's mystery journal, and download <code style={codeStyle}>articles.json</code> for engineering to deploy. Visitors never see this page.
      </p>
      <div style={{
        marginTop: 20,
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '8px 14px', borderRadius: 999,
        background: '#FFFFFF', border: `1px solid ${sourceColor}`,
        font: '500 11px "IBM Plex Mono", monospace',
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: sourceColor,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: sourceColor }} />
        {sourceLabel} · {total} article{total === 1 ? '' : 's'}
      </div>
    </header>
  );
}

function Section({ eyebrow, title, body }) {
  return (
    <section style={{
      background: '#FFFFFF', border: '1px solid #E5E4E0',
      borderRadius: 8, padding: 32, marginBottom: 20,
    }}>
      <div style={{
        font: '500 11px "IBM Plex Mono", monospace',
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: '#9747FF', marginBottom: 6,
      }}>{eyebrow}</div>
      <h2 style={{
        margin: '0 0 16px',
        font: '500 22px Inter, sans-serif',
        letterSpacing: '-0.015em',
        color: '#001E22',
      }}>{title}</h2>
      {body}
    </section>
  );
}

function JournalBlock({ journalKey, label, list }) {
  const [open, setOpen] = React.useState(false);
  const accent = journalKey === 'mystery' ? '#00D875' : '#003B44';
  return (
    <div style={{
      border: '1px solid #E5E4E0', borderRadius: 6,
      background: '#F8F8F5',
    }}>
      <button onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{
            display: 'inline-block', width: 4, height: 24,
            background: accent,
          }} />
          <span style={{
            font: '500 15px Inter, sans-serif', color: '#001E22',
            letterSpacing: '-0.01em',
          }}>{label}</span>
          <span style={{
            font: '500 11px "IBM Plex Mono", monospace',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#5D5E5C',
          }}>{list.length} article{list.length === 1 ? '' : 's'}</span>
        </div>
        <span style={{
          font: '500 11px "IBM Plex Mono", monospace',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: '#003B44',
        }}>{open ? 'Hide' : 'Show'}</span>
      </button>
      {open && (
        <div style={{ borderTop: '1px solid #E5E4E0', padding: '4px 0' }}>
          {list.length === 0 ? (
            <div style={{
              padding: '16px 18px',
              font: '400 13px Inter, sans-serif', color: '#8C8B89', fontStyle: 'italic',
            }}>No articles for this journal in the current catalogue.</div>
          ) : list.map((a, i) => (
            <div key={i} style={{
              padding: '14px 18px',
              borderBottom: i < list.length - 1 ? '1px solid #EAE9E4' : 'none',
              display: 'grid', gridTemplateColumns: '1fr auto', gap: 16,
              alignItems: 'flex-start',
            }}>
              <div>
                <div style={{
                  font: '500 14px Inter, sans-serif', color: '#001E22',
                  letterSpacing: '-0.01em', lineHeight: 1.35,
                  textWrap: 'pretty',
                }}>{a.title}</div>
                <div style={{
                  marginTop: 4,
                  font: '400 12px Inter, sans-serif', color: '#5D5E5C',
                }}>{a.authors}</div>
                {a.tags && a.tags.length > 0 && (
                  <div style={{
                    marginTop: 6,
                    display: 'flex', gap: 6, flexWrap: 'wrap',
                  }}>
                    {a.tags.map(t => (
                      <span key={t} style={{
                        font: '500 10px "IBM Plex Mono", monospace',
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: '#5D5E5C', background: '#FFFFFF',
                        border: '1px solid #E5E4E0',
                        padding: '2px 7px', borderRadius: 3,
                      }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div style={{
                font: '400 11px "IBM Plex Mono", monospace',
                color: '#5D5E5C', letterSpacing: '0.04em',
                whiteSpace: 'nowrap', textAlign: 'right',
                paddingTop: 2,
              }}>{a.doi}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer style={{
      marginTop: 24, paddingTop: 20,
      borderTop: '1px solid #E5E4E0',
      font: '400 12px "IBM Plex Mono", monospace',
      letterSpacing: '0.06em', color: '#8C8B89',
      display: 'flex', justifyContent: 'space-between',
    }}>
      <span>Spin The Wheel · Editor tool · Wiley × AI</span>
      <span>Generated articles.json is the source of truth for visitors</span>
    </footer>
  );
}

/* shared styles */
const btnPrimary = {
  height: 44, padding: '0 22px', borderRadius: 6,
  background: '#00D875', color: '#001E22', border: 'none',
  font: '500 13px "IBM Plex Mono", monospace',
  letterSpacing: '0.14em', textTransform: 'uppercase',
  cursor: 'pointer',
};
const btnGhost = {
  height: 44, padding: '0 22px', borderRadius: 6,
  background: 'transparent', color: '#003B44',
  border: '1px solid #003B44',
  font: '500 13px "IBM Plex Mono", monospace',
  letterSpacing: '0.14em', textTransform: 'uppercase',
  cursor: 'pointer',
};
const pStyle = {
  margin: '0 0 16px',
  font: '400 14px Inter, sans-serif',
  color: '#302F2F', lineHeight: 1.6,
};
const codeStyle = {
  background: '#F2F2EB', padding: '2px 6px', borderRadius: 3,
  font: '500 12px "IBM Plex Mono", monospace',
  color: '#001E22',
};

window.AdminApp = AdminApp;
