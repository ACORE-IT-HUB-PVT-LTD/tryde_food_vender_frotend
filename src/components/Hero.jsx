import { useState, useEffect, useRef, useCallback } from "react";

const SLIDES = [
  {
    id: "01", cat: "Restaurants",
    word: "REGISTER",
    sub: "YOUR RESTAURANT",
    desc: "Join 12,000+ restaurants already thriving on the Tryde platform.",
    img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1400&auto=format&fit=crop&q=90",
    tiles: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "02", cat: "Vendors",
    word: "VENDOR",
    sub: "PLATFORM",
    desc: "Get your storefront live in under 10 minutes. Zero hassle.",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&auto=format&fit=crop&q=90",
    tiles: [
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=400&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "03", cat: "Our Story",
    word: "PASSION",
    sub: "BUILT WITH",
    desc: "A dedicated team crafting the future of modern food service.",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&auto=format&fit=crop&q=90",
    tiles: [
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=400&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "04", cat: "Growth",
    word: "REVENUE",
    sub: "GROW YOUR",
    desc: "Powerful analytics and tools to accelerate your business.",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&auto=format&fit=crop&q=90",
    tiles: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "05", cat: "Community",
    word: "THOUSANDS",
    sub: "LOVED BY",
    desc: "A thriving community of vendors who chose Tryde and stay.",
    img: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=1400&auto=format&fit=crop&q=90",
    tiles: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&auto=format&fit=crop&q=80",
    ],
  },
];

const R = "#ff0000";
const TICK = 6000;

export default function Hero() {
  const [cur, setCur]     = useState(0);
  const [key, setKey]     = useState(0);
  const [phase, setPhase] = useState("idle");
  const [prog, setProg]   = useState(0);
  const timerRef = useRef(null);
  const progRef  = useRef(null);
  const startRef = useRef(null);

  const startProg = useCallback(() => {
    setProg(0); clearInterval(progRef.current);
    startRef.current = Date.now();
    progRef.current = setInterval(() => {
      setProg(Math.min(((Date.now() - startRef.current) / TICK) * 100, 100));
    }, 25);
  }, []);

  const go = useCallback((next) => {
    if (phase !== "idle" || next === cur) return;
    clearTimeout(timerRef.current); clearInterval(progRef.current);
    setPhase("out");
    setTimeout(() => {
      setCur(next); setKey(k => k + 1);
      setPhase("in"); startProg();
      setTimeout(() => {
        setPhase("idle");
        timerRef.current = setTimeout(() => go((next + 1) % SLIDES.length), TICK);
      }, 800);
    }, 500);
  }, [cur, phase, startProg]);

  useEffect(() => {
    startProg();
    timerRef.current = setTimeout(() => go(1), TICK);
    return () => { clearTimeout(timerRef.current); clearInterval(progRef.current); };
  }, []);

  const s = SLIDES[cur];
  const isOut = phase === "out";

  return (
    <div id="th7">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Poppins:wght@300;400;500;600&display=swap');

        #th7, #th7 * { box-sizing: border-box; }
        #th7 button { border: none; background: none; padding: 0; cursor: pointer; font-family: 'Poppins', sans-serif; }

        /* ── ROOT ── */
        #th7 {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 620px;
          background: #080808;
          overflow: hidden;
          font-family: 'Poppins', sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* ── FULL BG (very dark) ── */
        #th7 .bg {
          position: absolute; inset: 0; z-index: 0;
        }
        #th7 .bg img {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(.08) saturate(.5);
          transform: scale(1.04);
          transition: transform 8s ease;
        }
        #th7 .bg img.z { transform: scale(1); }

        /* noise */
        #th7 .noise {
          position: absolute; inset: 0; z-index: 1;
          opacity: .04; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        /* ── TOP BAR ── */
        #th7 .topbar {
          position: relative; z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: clamp(1.5rem,3vh,2.5rem) clamp(2rem,4vw,4.5rem) 0;
          flex-shrink: 0;
        }
        #th7 .logo {
          font-family: 'Oswald', sans-serif;
          font-size: clamp(1rem,1.8vw,1.3rem);
          letter-spacing: .3em;
          font-weight: 700;
          color: #fff;
          display: flex; align-items: center; gap: .5rem;
        }
        #th7 .logo-r { color: ${R}; }
        #th7 .topbar-right {
          display: flex; align-items: center; gap: 1.5rem;
        }
        #th7 .tb-cat {
          font-size: .6rem; font-weight: 600;
          letter-spacing: .2em; text-transform: uppercase;
          color: rgba(255,255,255,.3);
          display: flex; align-items: center; gap: .5rem;
        }
        #th7 .tb-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: ${R};
          animation: th7-blink 1.8s ease infinite;
        }

        /* ── CENTRE: text mask + tiles ── */
        #th7 .centre {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          padding: 0 clamp(1.5rem,4vw,4rem);
        }

        /* GIANT MASKED TEXT — image shows through letters */
        #th7 .mask-word {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: clamp(5.5rem,16vw,18rem);
          text-transform: uppercase;
          letter-spacing: -.01em;
          line-height: 1;
          text-align: center;
          /* image mask trick */
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          position: relative;
          z-index: 3;
          user-select: none;
          transition: background-image .01s;
          /* fallback color if clip not supported */
          color: #fff;
        }

        #th7 .sub-word {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: clamp(1.5rem,3.5vw,4rem);
          text-transform: uppercase;
          letter-spacing: .08em;
          color: rgba(255,255,255,.18);
          text-align: center;
          margin-bottom: .3rem;
          display: block;
        }

        #th7 .text-stack {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 3;
        }

        /* red underline bar */
        #th7 .red-bar {
          width: clamp(40px, 8vw, 80px);
          height: 3px;
          background: ${R};
          margin: .6rem auto 0;
          box-shadow: 0 0 16px rgba(255,0,0,.6);
        }

        /* ── TILES STRIP ── */
        #th7 .tiles {
          position: absolute;
          right: clamp(1.5rem,4vw,4rem);
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: .75rem;
          z-index: 5;
        }
        #th7 .tile {
          width: clamp(70px,9vw,110px);
          height: clamp(52px,6.5vw,80px);
          overflow: hidden;
          position: relative;
          cursor: pointer;
          border: 2px solid transparent;
          transition: border-color .3s, transform .3s;
        }
        #th7 .tile.active { border-color: ${R}; box-shadow: 0 0 16px rgba(255,0,0,.4); }
        #th7 .tile:hover { transform: scale(1.06); }
        #th7 .tile img {
          width: 100%; height: 100%;
          object-fit: cover;
          filter: brightness(.5) saturate(.6);
          transition: filter .3s;
        }
        #th7 .tile.active img, #th7 .tile:hover img {
          filter: brightness(.75) saturate(1);
        }
        #th7 .tile-num {
          position: absolute;
          bottom: 3px; right: 5px;
          font-family: 'Oswald', sans-serif;
          font-size: .55rem; font-weight: 700;
          color: rgba(255,255,255,.5);
          letter-spacing: .08em;
        }

        /* left info column */
        #th7 .info-col {
          position: absolute;
          left: clamp(1.5rem,4vw,4rem);
          top: 50%;
          transform: translateY(-50%);
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          max-width: 200px;
        }
        #th7 .ic-num {
          font-family: 'Oswald', sans-serif;
          font-size: clamp(3rem,5vw,5rem);
          font-weight: 700;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,.08);
          line-height: 1;
          letter-spacing: -.02em;
        }
        #th7 .ic-label {
          font-size: .6rem; font-weight: 500;
          letter-spacing: .18em; text-transform: uppercase;
          color: rgba(255,255,255,.25);
          border-left: 2px solid ${R};
          padding-left: .7rem;
          line-height: 1.4;
        }
        #th7 .ic-desc {
          font-size: clamp(.68rem,.95vw,.8rem);
          font-weight: 300;
          color: rgba(255,255,255,.32);
          line-height: 1.7;
        }

        /* ── BOTTOM BAR ── */
        #th7 .bottom {
          position: relative; z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 clamp(2rem,4vw,4.5rem) clamp(1.5rem,3vh,2.5rem);
          flex-shrink: 0;
          gap: 1rem;
        }

        /* CTA left */
        #th7 .cta-left {
          display: flex; align-items: center; gap: 1rem;
        }
        #th7 .btn-main {
          display: inline-flex; align-items: center; gap: .55rem;
          background: ${R};
          color: #fff;
          font-size: .65rem; font-weight: 600;
          letter-spacing: .16em; text-transform: uppercase;
          padding: .82rem 1.8rem;
          position: relative; overflow: hidden;
          transition: box-shadow .3s, transform .2s;
        }
        #th7 .btn-main::after {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,.13);
          transform: translateX(-110%) skewX(-15deg);
          transition: transform .45s;
        }
        #th7 .btn-main:hover::after { transform: translateX(120%) skewX(-15deg); }
        #th7 .btn-main:hover { box-shadow: 0 8px 28px rgba(255,0,0,.5); transform: translateY(-2px); }
        #th7 .btn-ghost {
          font-size: .62rem; font-weight: 400;
          letter-spacing: .12em; text-transform: uppercase;
          color: rgba(255,255,255,.25);
          border-bottom: 1px solid rgba(255,255,255,.1);
          padding-bottom: 2px;
          transition: color .25s, border-color .25s;
        }
        #th7 .btn-ghost:hover { color: #fff; border-color: rgba(255,255,255,.5); }

        /* dots center */
        #th7 .dots-wrap {
          display: flex; flex-direction: column; align-items: center; gap: .5rem;
        }
        #th7 .dots {
          display: flex; gap: .5rem;
        }
        #th7 .dot {
          height: 3px; border-radius: 2px;
          transition: all .4s cubic-bezier(.22,1,.36,1);
          cursor: pointer;
        }
        #th7 .prog-bar {
          width: 100px; height: 1px;
          background: rgba(255,255,255,.08);
          position: relative; overflow: hidden;
        }
        #th7 .prog-fill {
          position: absolute; inset: 0 auto 0 0;
          background: ${R}; box-shadow: 0 0 6px ${R};
          transition: width .025s linear;
        }

        /* arrows right */
        #th7 .arrows { display: flex; gap: .5rem; }
        #th7 .arr {
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.1) !important;
          color: rgba(255,255,255,.35);
          display: flex; align-items: center; justify-content: center;
          font-size: .9rem;
          transition: all .25s;
        }
        #th7 .arr:hover { background: ${R}; border-color: ${R} !important; color: #fff; }

        /* ── KEYFRAMES ── */
        @keyframes th7-blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes th7-wordIn {
          from { opacity: 0; transform: scale(.92); filter: blur(8px); }
          to   { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        @keyframes th7-wordOut {
          from { opacity: 1; transform: scale(1); filter: blur(0); }
          to   { opacity: 0; transform: scale(1.06); filter: blur(8px); }
        }
        @keyframes th7-subIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes th7-tileIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes th7-infoIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes th7-barGrow {
          from { width: 0; }
          to   { width: clamp(40px, 8vw, 80px); }
        }

        #th7 .word-in  { animation: th7-wordIn  .7s cubic-bezier(.22,1,.36,1) .0s both; }
        #th7 .word-out { animation: th7-wordOut .4s ease both; }
        #th7 .sub-in   { animation: th7-subIn   .6s ease .08s both; }
        #th7 .bar-in   { animation: th7-barGrow .7s cubic-bezier(.22,1,.36,1) .2s both; }
        #th7 .tile-in0 { animation: th7-tileIn  .5s ease .1s both; }
        #th7 .tile-in1 { animation: th7-tileIn  .5s ease .2s both; }
        #th7 .tile-in2 { animation: th7-tileIn  .5s ease .3s both; }
        #th7 .info-in  { animation: th7-infoIn  .6s ease .15s both; }
        #th7 .btn-in   { animation: th7-subIn   .5s ease .3s both; }

        /* ── RESPONSIVE ── */
        @media (max-width: 820px) {
          #th7 .tiles { display: none; }
          #th7 .info-col { display: none; }
          #th7 .mask-word { font-size: clamp(4rem,18vw,9rem); }
          #th7 .sub-word { font-size: clamp(1.2rem,5vw,2.5rem); }
        }
        @media (max-width: 480px) {
          #th7 .topbar { padding: 1.2rem 1.2rem 0; }
          #th7 .bottom { padding: 0 1.2rem 1.2rem; }
          #th7 .mask-word { font-size: clamp(3rem,18vw,7rem); }
          #th7 .prog-bar { display: none; }
          #th7 .btn-ghost { display: none; }
        }
      `}</style>

      {/* BG */}
      <div className="bg">
        <img key={`bg-${key}`} src={s.img} alt="" className={phase === "idle" ? "z" : ""} />
      </div>
      <div className="noise" />

      {/* TOP BAR */}
      <div className="topbar">
       
        <div className="topbar-right">
          <div className="tb-cat" key={`tc-${key}`}>
            <div className="tb-dot" />
            {s.cat}
          </div>
        </div>
      </div>

      {/* CENTRE */}
      <div className="centre">

        {/* LEFT INFO */}
        <div className="info-col info-in" key={`ic-${key}`}>
          <div className="ic-num">{s.id}</div>
          <div className="ic-label">{s.cat}</div>
          <p className="ic-desc">{s.desc}</p>
        </div>

        {/* TEXT MASK */}
        <div className="text-stack">
          <span className="sub-word sub-in" key={`sw-${key}`}>{s.sub}</span>
          <div
            className={`mask-word ${isOut ? "word-out" : "word-in"}`}
            key={`mw-${key}`}
            style={{ backgroundImage: `url(${s.img})` }}
          >
            {s.word}
          </div>
          <div className="red-bar bar-in" key={`rb-${key}`} />
        </div>

        {/* RIGHT TILES */}
        <div className="tiles" key={`tl-${key}`}>
          {s.tiles.map((t, i) => (
            <div
              key={i}
              className={`tile tile-in${i} ${i === 0 ? "active" : ""}`}
              onClick={() => go((cur + i + 1) % SLIDES.length)}
            >
              <img src={t} alt="" />
              <span className="tile-num">0{(cur + i + 1) % SLIDES.length + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="bottom">
      

        <div className="dots-wrap">
          <div className="dots">
            {SLIDES.map((_, i) => (
              <button key={i} className="dot" onClick={() => go(i)}
                style={{
                  width: i === cur ? "2rem" : ".45rem",
                  background: i === cur ? R : "rgba(255,255,255,.22)",
                }}
              />
            ))}
          </div>
          <div className="prog-bar">
            <div className="prog-fill" style={{ width: `${prog}%` }} />
          </div>
        </div>

        <div className="arrows">
          <button className="arr" onClick={() => go((cur - 1 + SLIDES.length) % SLIDES.length)}>←</button>
          <button className="arr" onClick={() => go((cur + 1) % SLIDES.length)}>→</button>
        </div>
      </div>
    </div>
  );
}