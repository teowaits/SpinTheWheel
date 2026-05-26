/* ============================================================
   Shared ArticlePopup — modal that appears when wheel lands.
   `theme` controls visual treatment per variant.
   ============================================================ */

function ArticlePopup({ open, journalKey, article, onClose, onSpinAgain, theme = 'editorial' }) {
  if (!open || !journalKey || !article) return null;
  const isMystery = journalKey === 'mystery';
  const j = isMystery ? null : JOURNALS[journalKey];
  const isEmpty = !!article.empty;

  const isDark = theme === 'marketing' || theme === 'covers';

  return (
    <div
      className="popup-backdrop"
      style={{
        position: 'absolute',
        inset: 0,
        background: isDark ? 'rgba(0, 14, 17, 0.62)' : 'rgba(7, 24, 27, 0.42)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'popup-fade 0.32s ease-out both',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(640px, 90%)',
          background: '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 32px 64px -8px rgba(0,0,0,0.35), 0 0 0 1px rgba(229,228,224,0.6)',
          overflow: 'hidden',
          animation: 'popup-rise 0.5s cubic-bezier(0.16, 1.0, 0.3, 1.0) both',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button onClick={onClose} aria-label="Close"
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 2,
            width: 36, height: 36, borderRadius: '50%',
            border: '1px solid #E5E4E0',
            background: 'rgba(255,255,255,0.9)',
            color: '#302F2F', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, lineHeight: 1,
          }}>×</button>

        {/* Top band */}
        <div style={{
          padding: '32px 40px 24px',
          background: isMystery ? '#001E22'
            : (j.key === 'adv-science' ? '#0a0a0a'
              : j.key === 'adv-intelligent-systems' ? '#0F2740'
              : '#2C1B4F'),
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {!isMystery && (
            <img src={j.cover}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', opacity: 0.5,
                filter: 'saturate(1.05)',
              }}
              alt="" />
          )}
          {isMystery && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at 30% 20%, rgba(0,216,117,0.35), transparent 60%), radial-gradient(circle at 75% 80%, rgba(151,71,255,0.25), transparent 60%)',
            }} />
          )}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.55))',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              font: '500 11px "IBM Plex Mono", monospace',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: isMystery ? '#00D875' : '#BFF5DD',
              marginBottom: 6,
            }}>
              {isMystery ? '★ Mystery top article' : 'You landed on'}
            </div>
            <h2 style={{
              margin: 0,
              font: '300 32px Inter, sans-serif',
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
            }}>
              {isMystery
                ? (article && article.journalLabel ? article.journalLabel : 'A curated cross-journal pick')
                : j.name}
            </h2>
            {!isMystery && (
              <div style={{
                font: '400 12px "IBM Plex Mono", monospace',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.78)',
                marginTop: 10,
              }}>
                {j.issue}
              </div>
            )}
            {isMystery && article && article.journalLabel && (
              <div style={{
                font: '400 12px "IBM Plex Mono", monospace',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.78)',
                marginTop: 10,
              }}>
                This month's mystery journal
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 40px 8px' }}>
          {isEmpty ? (
            <React.Fragment>
              <div style={{
                font: '500 11px "IBM Plex Mono", monospace',
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: '#B8782C', marginBottom: 12,
              }}>
                <span style={{
                  background: '#FFF3E0', color: '#B8782C',
                  padding: '4px 10px', borderRadius: 999,
                  letterSpacing: '0.12em',
                }}>No articles loaded</span>
              </div>
              <h3 style={{
                margin: '4px 0 16px',
                font: '500 24px Inter, sans-serif',
                color: '#001E22', letterSpacing: '-0.015em',
                lineHeight: 1.22, textWrap: 'pretty',
              }}>This slice has no articles in your current upload.</h3>
              <div style={{
                font: '400 14px Inter, sans-serif', color: '#5D5E5C',
                marginBottom: 16, lineHeight: 1.55,
              }}>
                Try again — or contact the editorial team to add an article for <strong style={{ color: '#003B44' }}>{isMystery ? 'the mystery journal' : (j ? j.name : journalKey)}</strong> in the next update.
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
          <div style={{
            font: '500 11px "IBM Plex Mono", monospace',
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: '#5D5E5C', marginBottom: 12,
            display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap',
          }}>
            <span style={{
              background: '#BFF5DD', color: '#001E22',
              padding: '4px 10px', borderRadius: 999,
              letterSpacing: '0.12em',
            }}>{article.type}</span>
            {article.tags && article.tags.map(t => (
              <span key={t} style={{ color: '#5D5E5C' }}>{t}</span>
            ))}
          </div>
          <h3 style={{
            margin: '4px 0 16px',
            font: '500 26px Inter, sans-serif',
            color: '#001E22', letterSpacing: '-0.015em',
            lineHeight: 1.22, textWrap: 'pretty',
          }}>{article.title}</h3>
          <div style={{
            font: '400 14px Inter, sans-serif', color: '#5D5E5C',
            marginBottom: 16,
          }}>{article.authors}</div>
          <div style={{
            font: '400 12px "IBM Plex Mono", monospace',
            color: '#5D5E5C', letterSpacing: '0.04em',
            paddingBottom: 20,
            borderBottom: '1px solid #E5E4E0',
          }}>DOI · {article.doi}</div>
            </React.Fragment>
          )}
        </div>

        {/* Actions */}
        <div style={{
          padding: '20px 40px 32px',
          display: 'flex', gap: 12, alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          {!isEmpty && (
            <a
              href={`https://doi.org/${article.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                height: 48, padding: '0 24px', borderRadius: 8,
                background: '#00D875', color: '#001E22',
                font: '500 13px "IBM Plex Mono", monospace',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                textDecoration: 'none',
              }}>
              Read the article
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </a>
          )}
          <button onClick={onSpinAgain}
            style={{
              height: 48, padding: '0 22px', borderRadius: 8,
              background: isEmpty ? '#00D875' : 'transparent',
              border: isEmpty ? 'none' : '1px solid #003B44',
              color: isEmpty ? '#001E22' : '#003B44',
              font: '500 13px "IBM Plex Mono", monospace',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer',
            }}>
            Spin again
          </button>
          {!isMystery && !isEmpty && (
            <div style={{ marginLeft: 'auto',
              font: '400 12px Inter, sans-serif', color: '#8C8B89' }}>
              {j.site}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

window.ArticlePopup = ArticlePopup;
