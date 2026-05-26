/* ============================================================
   Variant A — Editorial Paper
   Quiet, restrained, warm paper background. Wheel in deep teal,
   mint, and ink. Big editorial type on slices.
   ============================================================ */

function VariantEditorial() {
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [winner, setWinner] = React.useState(null);
  const [confettiTrigger, setConfettiTrigger] = React.useState(0);
  const [spinCount, setSpinCount] = React.useState(0);

  function handleLanded(journalKey, idx) {
    const list = ARTICLES[journalKey];
    const pick = list[Math.floor(Math.random() * list.length)];
    setWinner({ journalKey, article: pick });
    setPopupOpen(true);
    setConfettiTrigger((c) => c + 1);
  }

  const palette = {
    ring: '#001E22',
    divider: 'rgba(0,30,34,0.18)',
    hub: '#F2F2EB',
    hubStroke: 'rgba(0,30,34,0.18)',
    pointer: '#001E22',
    btnBg: '#00D875',
    btnFg: '#001E22',
    sliceFill: (i, key, isMystery) => {
      if (isMystery) return '#00D875';
      if (key === 'adv-science') return '#003B44';            // deep teal
      if (key === 'adv-intelligent-systems') return '#BFF5DD'; // mint
      if (key === 'adv-intelligent-discovery') return '#302F2F'; // ink
      return '#003B44';
    },
    sliceText: (i, key, isMystery) => {
      if (isMystery) return '#001E22';
      if (key === 'adv-intelligent-systems') return '#003B44';
      return '#F2F2EB';
    },
  };

  return (
    <div className="variant-editorial" style={{
      width: '100%', height: '100%', background: '#F2F2EB', color: '#302F2F',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 48px',
        borderBottom: '1px solid #E5E4E0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{
            width: 96, height: 22,
            background: '#003B44',
            mask: 'url(assets/wordmark-light.svg) center/contain no-repeat',
            WebkitMask: 'url(assets/wordmark-light.svg) center/contain no-repeat',
          }} />
          <nav style={{
            display: 'flex', gap: 28,
            font: '500 13px Inter, sans-serif',
          }}>
            <a style={{ color: '#003B44', textDecoration: 'none', borderBottom: '2px solid #00D875', paddingBottom: 4 }}>Spin & read</a>
            <a style={{ color: '#302F2F', textDecoration: 'none' }}>Journals</a>
            <a style={{ color: '#302F2F', textDecoration: 'none' }}>Open Access</a>
            <a style={{ color: '#302F2F', textDecoration: 'none' }}>About</a>
          </nav>
        </div>
        <div style={{
          font: '500 11px "IBM Plex Mono", monospace',
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: '#5D5E5C',
        }}>
          Spins today · <span style={{ color: '#003B44' }}>{String(2483 + spinCount).padStart(4, '0')}</span>
        </div>
      </header>

      {/* Hero */}
      <main style={{
        padding: '48px 48px 0',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: 48,
        alignItems: 'center',
        minHeight: 'calc(100% - 80px)',
      }}>
        {/* Left column */}
        <div style={{ maxWidth: 420 }}>
          <div style={{
            font: '500 12px "IBM Plex Mono", monospace',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#005E3A',
            marginBottom: 16,
          }}>
            <span style={{
              display: 'inline-block', width: 8, height: 8,
              background: '#00D875', borderRadius: '50%',
              verticalAlign: 'middle', marginRight: 10,
            }} />
            Three journals · One random read
          </div>
          <h1 style={{
            margin: '0 0 20px',
            font: '300 56px Inter, sans-serif',
            letterSpacing: '-0.035em',
            lineHeight: 1.0,
            color: '#001E22',
          }}>
            Stop scrolling.<br/>
            <em style={{ fontStyle: 'normal', color: '#005E3A', fontWeight: 400 }}>Spin a paper.</em>
          </h1>
          <p style={{
            font: '400 17px Inter, sans-serif',
            lineHeight: 1.55, color: '#302F2F',
            maxWidth: '38ch', margin: 0,
          }}>
            A weekly editorial roulette across <em>Advanced Science</em>, <em>Advanced Intelligent Systems</em>, and <em>Advanced Intelligent Discovery</em>. One spin, one open-access paper.
          </p>

          <div style={{ marginTop: 36, display: 'flex', gap: 24,
            paddingTop: 24, borderTop: '1px solid #E5E4E0' }}>
            {Object.values(JOURNALS).map(j => (
              <div key={j.key} style={{ flex: 1 }}>
                <div style={{
                  font: '500 11px "IBM Plex Mono", monospace',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: '#5D5E5C', marginBottom: 6,
                }}>{j.short}</div>
                <div style={{
                  font: '500 13px Inter, sans-serif',
                  color: '#003B44', lineHeight: 1.4,
                }}>
                  {ARTICLES[j.key].length} curated · open access
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wheel center */}
        <div style={{ position: 'relative' }}>
          <Wheel
            size={460}
            palette={palette}
            labelStyle="editorial"
            onLanded={handleLanded}
            soundEnabled={true}
            onSpinStart={() => setSpinCount((c) => c + 1)}
            spinLabel="Spin"
          />
        </div>

        {/* Right column - editor's note */}
        <div style={{ maxWidth: 320, justifySelf: 'end', textAlign: 'left' }}>
          <div style={{
            border: '1px solid #E5E4E0',
            borderRadius: 8,
            padding: 24,
            background: '#FFFFFF',
          }}>
            <div style={{
              font: '500 11px "IBM Plex Mono", monospace',
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: '#9747FF', marginBottom: 12,
            }}>Editor's note</div>
            <p style={{
              margin: 0,
              font: '400 14px Inter, sans-serif',
              color: '#302F2F', lineHeight: 1.55,
            }}>
              The seventh slice is a <strong style={{ color: '#005E3A' }}>mystery</strong>. It rotates monthly &mdash; sometimes a review, sometimes a brand-new preprint we've green-lit early.
            </p>
            <div style={{
              marginTop: 16, paddingTop: 16,
              borderTop: '1px dashed #E5E4E0',
              font: '400 12px "IBM Plex Mono", monospace',
              color: '#8C8B89',
              letterSpacing: '0.06em',
            }}>
              Updated weekly &middot; May 2026
            </div>
          </div>
        </div>
      </main>

      {/* Footer strip */}
      <footer style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '16px 48px',
        borderTop: '1px solid #E5E4E0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        font: '400 11px "IBM Plex Mono", monospace',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: '#5D5E5C',
        background: '#F2F2EB',
      }}>
        <span>© 2026 John Wiley &amp; Sons, Inc.</span>
        <span style={{ display: 'flex', gap: 24 }}>
          <span>Privacy</span><span>Terms</span><span>Accessibility</span>
        </span>
      </footer>

      <ArticlePopup
        open={popupOpen}
        journalKey={winner && winner.journalKey}
        article={winner && winner.article}
        onClose={() => setPopupOpen(false)}
        onSpinAgain={() => setPopupOpen(false)}
        theme="editorial"
      />
      <Confetti trigger={confettiTrigger} tone="bright" />
    </div>
  );
}

window.VariantEditorial = VariantEditorial;
