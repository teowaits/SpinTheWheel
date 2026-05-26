/* ============================================================
   Shared wheel engine + article data for all 3 variants.
   ============================================================ */

/* Journals, articles, and slice order are defined in content.js — edit
   that file to swap covers, DOIs, or rotate the mystery journal. */
const JOURNALS = window.JOURNALS;
const ARTICLES = window.ARTICLES;
const SLICE_ORDER = window.SLICE_ORDER;

/* ------------------------------------------------------------
   Ticker click — single short blip via WebAudio. Cheap to spam.
   ------------------------------------------------------------ */
let _audioCtx = null;
function tick(volume = 0.06) {
  try {
    if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = _audioCtx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 1100;
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  } catch (e) { /* silent */ }
}
function ding() {
  try {
    if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = _audioCtx;
    const t = ctx.currentTime;
    [880, 1320].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.08, t + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.08 + 0.6);
      o.connect(g).connect(ctx.destination);
      o.start(t + i * 0.08);
      o.stop(t + i * 0.08 + 0.65);
    });
  } catch (e) {}
}

/* ------------------------------------------------------------
   The Wheel.
   ------------------------------------------------------------ */
function Wheel({
  size = 460,
  onLanded,
  palette,            // { sliceFill(i, journalKey, isMystery) -> color,
                      //   sliceText(i, journalKey, isMystery) -> color,
                      //   ring, hub, hubText, pointer }
  labelStyle = 'editorial', // 'editorial' | 'minimal' | 'covers'
  coverImages = false,
  soundEnabled = true,
  spinLabel = 'Spin',
  buttonStyle = 'hub', // 'hub' | 'below' | 'none'
  externalSpinSignal = 0,
  onSpinStart,
}) {
  const N = SLICE_ORDER.length;
  const sliceDeg = 360 / N;
  const [rotation, setRotation] = React.useState(-sliceDeg / 2 + 0.001);
  const [spinning, setSpinning] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const wheelRef = React.useRef(null);
  const lastTickedSlice = React.useRef(0);
  const tickRaf = React.useRef(null);
  const lastSig = React.useRef(externalSpinSignal);

  // Slice geometry helpers
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const innerR = size * 0.13; // hub radius

  function polar(angleDeg, radius) {
    const a = (angleDeg - 90) * Math.PI / 180;
    return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
  }

  function slicePath(i) {
    const a1 = i * sliceDeg;
    const a2 = (i + 1) * sliceDeg;
    const [x1, y1] = polar(a1, r);
    const [x2, y2] = polar(a2, r);
    const [ix1, iy1] = polar(a1, innerR);
    const [ix2, iy2] = polar(a2, innerR);
    const large = sliceDeg > 180 ? 1 : 0;
    return [
      `M ${ix1} ${iy1}`,
      `L ${x1} ${y1}`,
      `A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${ix1} ${iy1}`,
      'Z',
    ].join(' ');
  }

  function sliceCenterPos(i, radius) {
    const a = i * sliceDeg + sliceDeg / 2;
    return polar(a, radius);
  }

  // Current slice under the pointer at any rotation
  function currentSliceAt(rotDeg) {
    // Pointer at top (angle 0). Slice i originally occupies [i*sliceDeg, (i+1)*sliceDeg].
    // After rotating the wheel by `rotDeg` (CW positive), the slice now under the pointer is:
    let local = ((-rotDeg) % 360 + 360) % 360;
    return Math.floor(local / sliceDeg) % N;
  }

  function spin() {
    if (spinning) return;
    if (onSpinStart) onSpinStart();
    const targetIdx = Math.floor(Math.random() * N);
    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5–7
    const jitter = (Math.random() - 0.5) * sliceDeg * 0.7;
    const desiredFinal = -(targetIdx * sliceDeg + sliceDeg / 2) + jitter;
    const currentMod = ((rotation % 360) + 360) % 360;
    const desiredMod = ((desiredFinal % 360) + 360) % 360;
    // CW rotation -> negative direction. We want final rotation < current.
    let delta = desiredMod - currentMod;
    if (delta > 0) delta -= 360;
    const total = rotation + delta - fullSpins * 360;
    const dur = 4.8 + Math.random() * 1.2;
    setDuration(dur);
    setRotation(total);
    setSpinning(true);

    lastTickedSlice.current = currentSliceAt(rotation);

    // Estimated ticker — interpolate rotation in JS via rAF reading element transform
    const startTs = performance.now();
    const startRot = rotation;
    const tickLoop = () => {
      const now = performance.now();
      const t = Math.min(1, (now - startTs) / (dur * 1000));
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = startRot + (total - startRot) * eased;
      const idx = currentSliceAt(cur);
      if (idx !== lastTickedSlice.current) {
        lastTickedSlice.current = idx;
        if (soundEnabled) tick();
      }
      if (t < 1) tickRaf.current = requestAnimationFrame(tickLoop);
    };
    tickRaf.current = requestAnimationFrame(tickLoop);

    window.setTimeout(() => {
      setSpinning(false);
      cancelAnimationFrame(tickRaf.current);
      const idx = currentSliceAt(total);
      if (soundEnabled) ding();
      if (onLanded) onLanded(SLICE_ORDER[idx], idx);
    }, dur * 1000 + 50);
  }

  // External spin trigger (e.g. button below)
  React.useEffect(() => {
    if (externalSpinSignal !== lastSig.current) {
      lastSig.current = externalSpinSignal;
      spin();
    }
  }, [externalSpinSignal]);

  // SVG defs for cover image patterns (variant C)
  const coverPatternId = (key, i) => `cover-${key}-${i}`;

  return (
    <div className="wheel-root" style={{ width: size, position: 'relative' }}>
      {/* Pointer */}
      <div className="wheel-pointer" style={{
        position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
        zIndex: 5, pointerEvents: 'none',
      }}>
        <svg width="36" height="44" viewBox="0 0 36 44">
          <path d="M18 40 L4 8 Q18 -2 32 8 Z"
            fill={palette.pointer || '#003B44'} stroke="#fff" strokeWidth="2"
            strokeLinejoin="round" />
          <circle cx="18" cy="14" r="3" fill="#fff" opacity="0.85" />
        </svg>
      </div>

      <svg
        ref={wheelRef}
        width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{
          display: 'block',
          filter: 'drop-shadow(0 16px 32px rgba(0,30,34,0.18))',
        }}
      >
        <defs>
          {coverImages && SLICE_ORDER.map((key, i) => {
            if (key === 'mystery') return null;
            const j = JOURNALS[key];
            return (
              <pattern key={i} id={coverPatternId(key, i)}
                patternUnits="userSpaceOnUse"
                x="0" y="0" width={size} height={size}
                patternTransform={`rotate(${i * sliceDeg + sliceDeg / 2} ${cx} ${cy})`}>
                <image href={j.cover}
                  x={cx - size * 0.7} y={cy - size * 0.85}
                  width={size * 1.4} height={size * 1.7}
                  preserveAspectRatio="xMidYMid slice" />
                <rect x="0" y="0" width={size} height={size}
                  fill="rgba(0,30,34,0.35)" />
              </pattern>
            );
          })}
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
            <stop offset="80%" stopColor="rgba(0,0,0,0.0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
          </radialGradient>
        </defs>

        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={r + 2}
          fill={palette.ring || '#003B44'} />

        {/* Rotating slice group */}
        <g
          style={{
            transform: `rotate(${rotation}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: spinning
              ? `transform ${duration}s cubic-bezier(0.16, 0.84, 0.18, 1)`
              : 'none',
          }}
        >
          {SLICE_ORDER.map((key, i) => {
            const isMystery = key === 'mystery';
            const j = isMystery ? null : JOURNALS[key];
            const fill = coverImages && !isMystery
              ? `url(#${coverPatternId(key, i)})`
              : palette.sliceFill(i, key, isMystery);
            return (
              <g key={i}>
                <path d={slicePath(i)} fill={fill}
                  stroke={palette.divider || 'rgba(255,255,255,0.18)'}
                  strokeWidth="1.5" />
              </g>
            );
          })}

          {/* Labels - drawn AFTER all slices so they're on top */}
          {SLICE_ORDER.map((key, i) => {
            const isMystery = key === 'mystery';
            const j = isMystery ? null : JOURNALS[key];
            const angle = i * sliceDeg + sliceDeg / 2;
            const txtColor = palette.sliceText(i, key, isMystery);
            const [tx, ty] = sliceCenterPos(i, r * 0.62);

            if (isMystery) {
              return (
                <g key={`m${i}`}
                  transform={`rotate(${angle} ${cx} ${cy}) translate(${cx} ${cy - r * 0.62})`}>
                  <text x="0" y="0"
                    textAnchor="middle" dominantBaseline="central"
                    style={{
                      font: '700 56px Inter, sans-serif',
                      fill: txtColor,
                      letterSpacing: '-0.04em',
                    }}>?</text>
                  <text x="0" y="32"
                    textAnchor="middle" dominantBaseline="central"
                    style={{
                      font: '500 10px "IBM Plex Mono", monospace',
                      fill: txtColor,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      opacity: 0.85,
                    }}>Mystery pick</text>
                </g>
              );
            }

            // Editorial: stack the two words of the journal
            const lines = j.name.split(' '); // 2 or 3 words
            const isCovers = labelStyle === 'covers' || coverImages;
            const fontSize = isCovers ? 13 : (lines.length === 3 ? 16 : 19);
            const lineH = fontSize * 1.05;

            return (
              <g key={`l${i}`}
                transform={`rotate(${angle} ${cx} ${cy}) translate(${cx} ${cy - r * 0.62})`}>
                {lines.map((w, li) => (
                  <text key={li}
                    x="0" y={(li - (lines.length - 1) / 2) * lineH}
                    textAnchor="middle" dominantBaseline="central"
                    style={{
                      font: `${labelStyle === 'editorial' ? 600 : 500} ${fontSize}px Inter, sans-serif`,
                      fill: txtColor,
                      letterSpacing: '-0.02em',
                      textTransform: labelStyle === 'minimal' ? 'none' : 'uppercase',
                    }}>{w}</text>
                ))}
                {/* small dot accent below */}
                <circle cx="0" cy={lines.length * lineH * 0.55 + 8}
                  r="2.5" fill={txtColor} opacity="0.7" />
              </g>
            );
          })}
        </g>

        {/* Hub overlay (non-rotating). Drawn over rotating group. */}
        <circle cx={cx} cy={cy} r={innerR + 2}
          fill={palette.hub || '#FFFFFF'}
          stroke={palette.hubStroke || 'rgba(0,30,34,0.12)'}
          strokeWidth="1" />
        <circle cx={cx} cy={cy} r={r + 2}
          fill="url(#hubGlow)" pointerEvents="none" />
      </svg>

      {/* Center spin button */}
      {buttonStyle === 'hub' && (
        <button
          className="wheel-spin-btn"
          onClick={spin}
          disabled={spinning}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: innerR * 2 - 4, height: innerR * 2 - 4,
            borderRadius: '50%',
            border: 'none',
            background: spinning ? '#8C8B89' : (palette.btnBg || '#00D875'),
            color: palette.btnFg || '#001E22',
            font: '500 12px "IBM Plex Mono", monospace',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: spinning ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 16px rgba(0,30,34,0.25), inset 0 -3px 0 rgba(0,0,0,0.08)',
            transition: 'transform 120ms ease, background 200ms ease',
            zIndex: 4,
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(0.96)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
        >
          {spinning ? '...' : spinLabel}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------
   Confetti — fires once when `trigger` increments.
   Uses two color modes (bright vs muted) via `tone` prop.
   ------------------------------------------------------------ */
function Confetti({ trigger, tone = 'bright' }) {
  const [pieces, setPieces] = React.useState([]);
  const seenTrigger = React.useRef(trigger);

  React.useEffect(() => {
    if (trigger === seenTrigger.current) return;
    seenTrigger.current = trigger;
    const colors = tone === 'bright'
      ? ['#00D875', '#BFF5DD', '#003B44', '#9747FF', '#FFC857', '#60E7A9']
      : ['#003B44', '#005965', '#00D875', '#BFF5DD', '#E5E4E0'];
    const next = [];
    for (let i = 0; i < 80; i++) {
      next.push({
        id: Date.now() + i,
        x: 50 + (Math.random() - 0.5) * 30, // % across center
        delay: Math.random() * 0.2,
        dur: 1.6 + Math.random() * 1.4,
        spread: (Math.random() - 0.5) * 600,
        rise: 240 + Math.random() * 320,
        rot: Math.random() * 720 - 360,
        color: colors[i % colors.length],
        size: 6 + Math.random() * 8,
        shape: Math.random() < 0.5 ? 'rect' : 'circle',
      });
    }
    setPieces(next);
    const t = setTimeout(() => setPieces([]), 3500);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50,
      overflow: 'hidden',
    }}>
      {pieces.map(p => (
        <span key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`, top: '55%',
            width: p.size, height: p.shape === 'rect' ? p.size * 0.4 : p.size,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '1px',
            animation: `confetti-fly ${p.dur}s cubic-bezier(0.16, 1.0, 0.3, 1.0) ${p.delay}s both`,
            ['--dx']: `${p.spread}px`,
            ['--dy']: `-${p.rise}px`,
            ['--rot']: `${p.rot}deg`,
          }}
        />
      ))}
    </div>
  );
}

window.Wheel = Wheel;
window.Confetti = Confetti;
window.tick = tick;
window.ding = ding;
