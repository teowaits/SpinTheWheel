/* ============================================================
   Variant B — Deep Teal Marketing
   Dark teal hero, luminous wheel, bigger display type. Mystery
   slice glows bright green as the brand action color.
   ============================================================ */

function CreditsLink() {
  const [open, setOpen] = React.useState(false);
  const timeoutRef = React.useRef(null);
  function show() { clearTimeout(timeoutRef.current); setOpen(true); }
  function hide() { timeoutRef.current = setTimeout(() => setOpen(false), 160); }
  return (
    <div
      onMouseEnter={show} onMouseLeave={hide}
      onFocus={show} onBlur={hide}
      style={{ position: 'relative' }}>
      <button
        type="button"
        aria-label="About The Wheel"
        aria-expanded={open}
        style={{
          background: 'transparent', border: 'none', padding: 0,
          font: 'inherit', color: 'inherit', cursor: 'help',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
        The wheel
        <span style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 16, height: 16, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.45)',
          font: '500 9px "IBM Plex Mono", monospace',
          color: 'rgba(255,255,255,0.7)',
          lineHeight: 1,
        }}>i</span>
      </button>
      <div
        role="tooltip"
        onMouseEnter={show} onMouseLeave={hide}
        style={{
          position: 'absolute', top: 'calc(100% + 14px)', right: -8,
          width: 280,
          background: '#FFFFFF', color: '#302F2F',
          border: '1px solid #E5E4E0', borderRadius: 8,
          boxShadow: '0 16px 32px -8px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,30,34,0.06)',
          padding: '18px 18px 16px',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-4px)',
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 160ms ease, transform 160ms ease',
          zIndex: 30,
        }}>
        <div style={{
          position: 'absolute', top: -6, right: 26,
          width: 12, height: 12,
          background: '#FFFFFF',
          borderTop: '1px solid #E5E4E0',
          borderLeft: '1px solid #E5E4E0',
          transform: 'rotate(45deg)',
        }} />
        <div style={{
          font: '500 10px "IBM Plex Mono", monospace',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: '#9747FF', marginBottom: 10,
        }}>Credits</div>
        <div style={{
          font: '400 13px Inter, sans-serif', lineHeight: 1.5,
          color: '#302F2F',
        }}>
          Designed by{' '}
          <a href="https://advanced.onlinelibrary.wiley.com/hub/journal/29439981/team/index"
             target="_blank" rel="noopener noreferrer"
             style={{
               color: '#003B44', fontWeight: 500, textDecoration: 'none',
               borderBottom: '1px solid #00D875',
             }}>Matteo Cavalleri</a>
          {' '}from an idea by{' '}
          <span style={{ color: '#001E22', fontWeight: 500 }}>Emma Louise Staines</span>.
        </div>
      </div>
    </div>
  );
}

function VariantMarketing() {
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [winner, setWinner] = React.useState(null);
  const [confettiTrigger, setConfettiTrigger] = React.useState(0);
  const [spinCount, setSpinCount] = React.useState(0);
  const [spinSig, setSpinSig] = React.useState(0);
  const [revealedMystery, setRevealedMystery] = React.useState(false);

  function handleLanded(journalKey) {
    const list = ARTICLES[journalKey] || [];
    const pick = list.length
      ? list[Math.floor(Math.random() * list.length)]
      : { empty: true, journalKey };
    setWinner({ journalKey, article: pick });
    setPopupOpen(true);
    if (!pick.empty) setConfettiTrigger((c) => c + 1);
    if (journalKey === 'mystery') setRevealedMystery(true);
  }

  const palette = {
    ring: '#00D875',
    divider: 'rgba(255,255,255,0.10)',
    hub: '#001E22',
    hubStroke: '#00D875',
    pointer: '#00D875',
    btnBg: '#00D875',
    btnFg: '#001E22',
    sliceFill: (i, key, isMystery) => {
      if (isMystery) return '#00D875';
      if (key === 'adv-science') return '#5A3DB0';            // violet
      if (key === 'adv-intelligent-systems') return '#005965'; // teal-600
      if (key === 'adv-intelligent-discovery') return '#003B44'; // teal-700 darker
      return '#003B44';
    },
    sliceText: (i, key, isMystery) => {
      if (isMystery) return '#001E22';
      return '#FFFFFF';
    },
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'radial-gradient(ellipse at 30% 0%, #005965 0%, #001E22 55%)',
      color: '#FFFFFF',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Soft green glow behind wheel */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 720, height: 720, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,216,117,0.18), transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Top strip */}
      <div style={{
        background: 'rgba(0, 30, 34, 0.6)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '10px 48px',
        font: '500 11px "IBM Plex Mono", monospace',
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.7)',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>Open Access · No Paywall · All Four Journals</span>
        <span style={{ color: '#00D875' }}>● Live</span>
      </div>

      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 48px',
        position: 'relative', zIndex: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{
            width: 96, height: 22, background: '#FFFFFF',
            mask: 'url(assets/wordmark-light.svg) center/contain no-repeat',
            WebkitMask: 'url(assets/wordmark-light.svg) center/contain no-repeat',
          }} />
          <span style={{
            font: '500 11px "IBM Plex Mono", monospace',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            paddingLeft: 16, marginLeft: 4,
            borderLeft: '1px solid rgba(255,255,255,0.2)',
          }}>Lucky Read</span>
        </div>
        <nav style={{
          display: 'flex', gap: 28,
          font: '500 13px Inter, sans-serif',
          color: 'rgba(255,255,255,0.85)',
          alignItems: 'center',
        }}>
          <CreditsLink />
          <a href="https://advanced.onlinelibrary.wiley.com/" target="_blank" rel="noopener noreferrer"
             style={{ color: 'inherit', textDecoration: 'none' }}>Journals</a>
          <a href="https://advanced.onlinelibrary.wiley.com/hub/author-guidelines" target="_blank" rel="noopener noreferrer"
             style={{ color: 'inherit', textDecoration: 'none' }}>For authors</a>
        </nav>
      </header>

      {/* Main row */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: 64, alignItems: 'center',
        padding: '24px 64px',
        height: 'calc(100% - 110px)',
        position: 'relative', zIndex: 2,
      }}>
        {/* Left */}
        <div>
          <div style={{
            font: '500 12px "IBM Plex Mono", monospace',
            letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#00D875', marginBottom: 16,
          }}>
            ◯ &nbsp;&nbsp;WILEY × AI
          </div>
          <h1 style={{
            margin: '0 0 24px',
            font: '200 68px Inter, sans-serif',
            letterSpacing: '-0.04em',
            lineHeight: 0.98,
          }}>
            Great <em style={{
              fontStyle: 'normal',
              color: '#00D875',
              fontWeight: 400,
              letterSpacing: '-0.035em',
            }}>AI×Science</em><br/>
            is a spin away.
          </h1>
          <p style={{
            font: '400 17px Inter, sans-serif',
            lineHeight: 1.55,
            color: 'rgba(255,255,255,0.82)',
            maxWidth: '46ch', margin: '0 0 32px',
          }}>
            A weekly editorial roulette across <em style={{ color: '#FFFFFF', fontStyle: 'normal', fontWeight: 500 }}>Advanced Science</em>, <em style={{ color: '#FFFFFF', fontStyle: 'normal', fontWeight: 500 }}>Advanced Intelligent Systems</em>, <em style={{ color: '#FFFFFF', fontStyle: 'normal', fontWeight: 500 }}>Advanced Intelligent Discovery</em> and a mystery journal. One spin, one AI scientific highlight.
          </p>

          <button onClick={() => setSpinSig((s) => s + 1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 12,
              height: 56, padding: '0 32px',
              background: '#00D875', color: '#001E22',
              border: 'none', borderRadius: 8, cursor: 'pointer',
              font: '500 14px "IBM Plex Mono", monospace',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              boxShadow: '0 12px 32px rgba(0,216,117,0.3)',
            }}>
            <span style={{
              width: 8, height: 8, background: '#001E22', borderRadius: '50%',
            }} />
            Spin the wheel
          </button>

          <div style={{
            marginTop: 40,
            display: 'flex', gap: 36,
            paddingTop: 28,
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}>
            {[
              ['7', 'slices'],
              ['4', 'journals'],
              ['100%', 'open access'],
              [String(spinCount).padStart(2, '0'), 'your spins'],
            ].map(([n, l]) => (
              <div key={l}>
                <div style={{
                  font: '300 36px "IBM Plex Mono", monospace',
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}>{n}</div>
                <div style={{
                  font: '500 11px "IBM Plex Mono", monospace',
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)',
                  marginTop: 6,
                }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wheel */}
        <div style={{ position: 'relative' }}>
          <Wheel
            size={500}
            palette={palette}
            labelStyle="editorial"
            onLanded={handleLanded}
            soundEnabled={true}
            externalSpinSignal={spinSig}
            onSpinStart={() => setSpinCount((c) => c + 1)}
            spinLabel="Spin"
          />
        </div>

        {/* Right - mini journal cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            font: '500 11px "IBM Plex Mono", monospace',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            marginBottom: 4,
          }}>In rotation</div>
          {Object.values(JOURNALS).filter(j => j.key !== 'mystery').map(j => (
            <a key={j.key}
              href={j.url || '#'} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', gap: 14, alignItems: 'center',
                padding: 12, borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                textDecoration: 'none',
                transition: 'background 200ms ease, border-color 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(0,216,117,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}>
              <img src={j.cover}
                style={{ width: 56, height: 72, objectFit: 'cover',
                  borderRadius: 3, boxShadow: '0 6px 16px rgba(0,0,0,0.3)' }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  font: '500 13px Inter, sans-serif',
                  color: '#FFFFFF', letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                }}>{j.name}</div>
                <div style={{
                  font: '400 11px "IBM Plex Mono", monospace',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)',
                  marginTop: 6,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {j.issue.split('·')[0].trim()}
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                    <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </a>
          ))}
          {revealedMystery && JOURNALS.mystery && JOURNALS.mystery.cover ? (
            /* Revealed — looks like the other journal cards */
            <a
              href={JOURNALS.mystery.url || '#'} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', gap: 14, alignItems: 'center',
                padding: 12, borderRadius: 8,
                background: 'rgba(0,216,117,0.10)',
                border: '1px solid rgba(0,216,117,0.45)',
                textDecoration: 'none',
                animation: 'mystery-reveal 0.7s cubic-bezier(0.16, 1.0, 0.3, 1.0) both',
                transition: 'background 200ms ease, border-color 200ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,216,117,0.18)';
                e.currentTarget.style.borderColor = 'rgba(0,216,117,0.7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,216,117,0.10)';
                e.currentTarget.style.borderColor = 'rgba(0,216,117,0.45)';
              }}>
              <img src={JOURNALS.mystery.cover}
                style={{ width: 56, height: 72, objectFit: 'cover',
                  borderRadius: 3, boxShadow: '0 6px 16px rgba(0,0,0,0.35)' }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  font: '500 10px "IBM Plex Mono", monospace',
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: '#00D875', marginBottom: 4,
                }}>This month's mystery</div>
                <div style={{
                  font: '500 13px Inter, sans-serif',
                  color: '#FFFFFF', letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                }}>{JOURNALS.mystery.name}</div>
                <div style={{
                  font: '400 11px "IBM Plex Mono", monospace',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: 6,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {(JOURNALS.mystery.issue || '').split('·')[0].trim() || 'Rotates monthly'}
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                    <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </a>
          ) : (
            /* Sealed placeholder */
            <div style={{
              display: 'flex', gap: 14, alignItems: 'center',
              padding: 12, borderRadius: 8,
              background: 'rgba(0,216,117,0.12)',
              border: '1px dashed rgba(0,216,117,0.5)',
            }}>
              <div style={{
                width: 56, height: 72, borderRadius: 3,
                background: '#00D875',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                font: '700 36px Inter, sans-serif',
                color: '#001E22',
              }}>?</div>
              <div>
                <div style={{
                  font: '500 13px Inter, sans-serif',
                  color: '#FFFFFF', letterSpacing: '-0.01em',
                }}>Mystery journal</div>
                <div style={{
                  font: '400 11px "IBM Plex Mono", monospace',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#00D875',
                  marginTop: 6,
                }}>Spin to reveal</div>
              </div>
            </div>
          )}
        </div>
      </main>

      <ArticlePopup
        open={popupOpen}
        journalKey={winner && winner.journalKey}
        article={winner && winner.article}
        onClose={() => setPopupOpen(false)}
        onSpinAgain={() => { setPopupOpen(false); setTimeout(() => setSpinSig((s) => s + 1), 300); }}
        theme="marketing"
      />
      <Confetti trigger={confettiTrigger} tone="bright" />
    </div>
  );
}

window.VariantMarketing = VariantMarketing;
