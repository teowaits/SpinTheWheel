/* ============================================================
   Variant C — Cover-Forward
   The slices ARE the journal covers. Editorial typographic
   overlay; quiet warm canvas frames the wheel. Mystery slice
   stands out as bright green.
   ============================================================ */

function VariantCovers() {
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [winner, setWinner] = React.useState(null);
  const [confettiTrigger, setConfettiTrigger] = React.useState(0);
  const [history, setHistory] = React.useState([]); // last few picks

  function handleLanded(journalKey) {
    const list = ARTICLES[journalKey];
    const pick = list[Math.floor(Math.random() * list.length)];
    setWinner({ journalKey, article: pick });
    setPopupOpen(true);
    setConfettiTrigger((c) => c + 1);
    setHistory((h) => [{ journalKey, ts: Date.now() }, ...h].slice(0, 5));
  }

  const palette = {
    ring: '#001E22',
    divider: 'rgba(255,255,255,0.35)',
    hub: '#FFFFFF',
    hubStroke: 'rgba(0,30,34,0.18)',
    pointer: '#001E22',
    btnBg: '#00D875',
    btnFg: '#001E22',
    sliceFill: (i, key, isMystery) => {
      if (isMystery) return '#00D875';
      return '#003B44'; // overridden by cover pattern
    },
    sliceText: (i, key, isMystery) => '#FFFFFF',
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#F8F8F5',
      color: '#001E22',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px',
        borderBottom: '1px solid #E5E4E0',
        background: '#FFFFFF',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{
            width: 96, height: 22, background: '#003B44',
            mask: 'url(assets/wordmark-light.svg) center/contain no-repeat',
            WebkitMask: 'url(assets/wordmark-light.svg) center/contain no-repeat',
          }} />
          <span style={{
            font: '500 11px "IBM Plex Mono", monospace',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#9747FF',
          }}>·  The Cover Wheel</span>
        </div>
        <div style={{
          font: '400 11px "IBM Plex Mono", monospace',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: '#5D5E5C',
          display: 'flex', gap: 28, alignItems: 'center',
        }}>
          <span>This week's covers</span>
          <span style={{
            display: 'inline-flex', gap: 6,
          }}>
            {Object.values(JOURNALS).map(j => (
              <span key={j.key} style={{
                width: 8, height: 11, background: '#003B44',
                display: 'inline-block',
              }} />
            ))}
          </span>
        </div>
      </header>

      {/* Hero band */}
      <div style={{
        padding: '36px 48px 12px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        gap: 40,
      }}>
        <div>
          <div style={{
            font: '500 12px "IBM Plex Mono", monospace',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#005E3A',
            marginBottom: 14,
          }}>
            Issue 24 · Wiley Open Access
          </div>
          <h1 style={{
            margin: 0,
            font: '300 56px Inter, sans-serif',
            letterSpacing: '-0.035em',
            lineHeight: 0.98, color: '#001E22',
            maxWidth: '13ch',
          }}>
            Land on a cover.<br/>
            <em style={{ fontStyle: 'normal', color: '#9747FF' }}>Read what it hides.</em>
          </h1>
        </div>
        <div style={{ maxWidth: 360, textAlign: 'right' }}>
          <p style={{
            margin: 0,
            font: '400 15px Inter, sans-serif',
            color: '#302F2F', lineHeight: 1.55,
          }}>
            Each slice is a real cover image from a current issue. Spin to land on a journal &mdash; we'll surface a paper you might have missed.
          </p>
        </div>
      </div>

      {/* Wheel area */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr 260px',
        gap: 32, alignItems: 'center',
        padding: '20px 48px',
        height: 'calc(100% - 240px)',
      }}>
        {/* Left — legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            font: '500 11px "IBM Plex Mono", monospace',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#5D5E5C',
          }}>Legend</div>
          {Object.values(JOURNALS).map(j => (
            <div key={j.key} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '8px 0',
              borderBottom: '1px solid #E5E4E0',
            }}>
              <img src={j.cover}
                style={{
                  width: 40, height: 52, objectFit: 'cover',
                  borderRadius: 2, flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(0,30,34,0.15)',
                }} />
              <div style={{
                font: '500 13px Inter, sans-serif',
                color: '#001E22', letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}>{j.name}<br/>
                <span style={{
                  font: '400 11px "IBM Plex Mono", monospace',
                  color: '#5D5E5C', letterSpacing: '0.06em',
                  textTransform: 'none',
                }}>2 of 7 slices</span>
              </div>
            </div>
          ))}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '8px 0',
          }}>
            <div style={{
              width: 40, height: 52, background: '#00D875', borderRadius: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              font: '700 26px Inter, sans-serif', color: '#001E22',
            }}>?</div>
            <div style={{
              font: '500 13px Inter, sans-serif',
              color: '#001E22', letterSpacing: '-0.01em',
            }}>Mystery slice<br/>
              <span style={{
                font: '400 11px "IBM Plex Mono", monospace',
                color: '#005E3A', letterSpacing: '0.06em',
              }}>1 of 7 · rotates</span>
            </div>
          </div>
        </div>

        {/* Wheel center */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          position: 'relative',
        }}>
          <Wheel
            size={500}
            palette={palette}
            labelStyle="covers"
            coverImages={true}
            onLanded={handleLanded}
            soundEnabled={true}
            spinLabel="Spin"
          />
        </div>

        {/* Right — recent picks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            font: '500 11px "IBM Plex Mono", monospace',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#5D5E5C',
          }}>Recent spins</div>
          {history.length === 0 && (
            <div style={{
              font: '400 13px Inter, sans-serif',
              color: '#8C8B89', fontStyle: 'italic',
              padding: '12px 0',
            }}>No spins yet &mdash; give the wheel a push.</div>
          )}
          {history.map((h, i) => {
            const j = h.journalKey === 'mystery' ? null : JOURNALS[h.journalKey];
            const sec = Math.floor((Date.now() - h.ts) / 1000);
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                paddingBottom: 10,
                borderBottom: i < history.length - 1 ? '1px dashed #E5E4E0' : 'none',
              }}>
                <div style={{
                  width: 6, height: 36,
                  background: h.journalKey === 'mystery' ? '#00D875' : '#003B44',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    font: '500 12px Inter, sans-serif',
                    color: '#001E22', letterSpacing: '-0.005em',
                    lineHeight: 1.2,
                  }}>{j ? j.short : 'Mystery pick'}</div>
                  <div style={{
                    font: '400 10px "IBM Plex Mono", monospace',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: '#8C8B89', marginTop: 4,
                  }}>{sec < 5 ? 'Just now' : `${sec}s ago`}</div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <ArticlePopup
        open={popupOpen}
        journalKey={winner && winner.journalKey}
        article={winner && winner.article}
        onClose={() => setPopupOpen(false)}
        onSpinAgain={() => setPopupOpen(false)}
        theme="covers"
      />
      <Confetti trigger={confettiTrigger} tone="bright" />
    </div>
  );
}

window.VariantCovers = VariantCovers;
