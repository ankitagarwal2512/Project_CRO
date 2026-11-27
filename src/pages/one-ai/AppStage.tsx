import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { NavBar, TopStripe } from "../salary-calculator/Chrome";
import HomeFooter from "../salary-calculator/HomeFooter";
import BackToTop from "../salary-calculator/BackToTop";
import "./oa2.css";
import agentsHtml from "./agents.html?raw";
import "./legacy.css";
import legacyHtml from "./legacy.html?raw";
import legacyFaqSchema from "./legacy-faq-schema.json";

/* One AI product page, served at /one-ai. Replaces the live hrone.cloud/one-ai page.

   Content: docs/one-ai-page-content.md, taken from the "Web Presentation live" sales deck.

   Look: Option D's One AI section ("Three agents", .oa2 in public/legacy/hrone-home). That
   section is reused as-is (agents.html + oa2.css, copied verbatim) and every other section
   is drawn in the same language: mint ground (#f0f5f2), white cards with a #dfe8e2 hairline
   and 14px radius, bold Public Sans heads with a light kicker line above, light app windows
   (cream chrome bar, #f7f7f4 canvas, grey user bubbles, mint AI bubbles), the gradient
   sparkle on a dark-green squircle as the only AI mark. No coral and no dark panels inside
   the mocks; coral is kept for the call-to-action buttons only.

   Identity: no One AI logo / wordmark. Same header, footer and trust pieces as the rest of
   the site, so One AI reads as part of HROne rather than a separate product. */

/* ───────────────────────── tokens (Option D .oa2) ───────────────────────── */

const MINT = "bg-[#f0f5f2]";
const CARD = "rounded-[14px] border border-[#dfe8e2] bg-white shadow-[0_1px_2px_rgba(11,74,46,.04)]";
const WIN = "overflow-hidden rounded-[12px] border border-[#e5e5e5] bg-white shadow-[0_18px_40px_-28px_rgba(11,74,46,.28)]";

/* ───────────────────────── shared bits ───────────────────────── */

const Arrow = ({ size = 16 }: { size?: number }) => (
  <svg aria-hidden width={size} height={size} viewBox="0 0 16 16" fill="none" className="transition-transform duration-200 group-hover:translate-x-[3px]">
    <path d="M3 8h9.5M8.75 4.25 12.5 8l-3.75 3.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Tick = ({ className = "text-[#02563d]" }: { className?: string }) => (
  <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

/* Option D's coral CTA: 6px radius, soft coral shadow */
function Cta({ children, href = "#" }: { children: ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2.5 rounded-[6px] bg-[#e9614a] px-[26px] py-[13px] text-[17px] font-semibold tracking-[-0.005em] text-white shadow-[0_10px_24px_-10px_rgba(233,97,74,.55)] transition-[background,box-shadow] hover:bg-[#d9553e] hover:shadow-[0_14px_28px_-10px_rgba(233,97,74,.6)]"
    >
      {children} <Arrow size={18} />
    </a>
  );
}

function GhostCta({ children, href = "#" }: { children: ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 rounded-[6px] border border-[#cfe2d4] bg-white px-[22px] py-[12px] text-[17px] font-semibold text-[#02563d] transition-colors hover:border-[#02563d]"
    >
      {children}
    </a>
  );
}

/* the .oa2 heading pair: a light kicker line, then the bold title */
function Head({ kicker, title, sub, id }: { kicker: string; title: ReactNode; sub?: ReactNode; id?: string }) {
  return (
    <div className="mx-auto max-w-[820px] text-center">
      <p className="text-[clamp(20px,1.95vw,28px)] font-normal leading-[1.2] tracking-[-0.01em] text-[#16201a]">{kicker}</p>
      <h2 id={id} className="mt-1 text-balance text-[clamp(30px,3.0556vw,44px)] font-bold leading-[1.1] tracking-[-0.02em] text-[#0e1a14]">
        {title}
      </h2>
      {sub && <p className="mx-auto mt-4 max-w-[640px] text-[18px] leading-[1.45] text-[#5f6b65]">{sub}</p>}
    </div>
  );
}

/* the One AI sparkle (gradient stroke), as used throughout Option D's section */
const SPARK =
  "M13.3333 1.33333V4M14.6667 2.66667H12M7.34464 1.87597C7.3732 1.72304 7.45435 1.58491 7.57403 1.48551C7.69372 1.38612 7.84439 1.33171 7.99997 1.33171C8.15554 1.33171 8.30622 1.38612 8.4259 1.48551C8.54559 1.58491 8.62674 1.72304 8.6553 1.87597L9.35597 5.5813C9.40573 5.84473 9.53375 6.08705 9.72332 6.27662C9.91289 6.46618 10.1552 6.59421 10.4186 6.64397L14.124 7.34464C14.2769 7.3732 14.415 7.45435 14.5144 7.57403C14.6138 7.69372 14.6682 7.84439 14.6682 7.99997C14.6682 8.15554 14.6138 8.30622 14.5144 8.4259C14.415 8.54559 14.2769 8.62674 14.124 8.6553L10.4186 9.35597C10.1552 9.40573 9.91289 9.53375 9.72332 9.72332C9.53375 9.91289 9.40573 10.1552 9.35597 10.4186L8.6553 14.124C8.62674 14.2769 8.54559 14.415 8.4259 14.5144C8.30622 14.6138 8.15554 14.6682 7.99997 14.6682C7.84439 14.6682 7.69372 14.6138 7.57403 14.5144C7.45435 14.415 7.3732 14.2769 7.34464 14.124L6.64397 10.4186C6.59421 10.1552 6.46618 9.91289 6.27662 9.72332C6.08705 9.53375 5.84473 9.40573 5.5813 9.35597L1.87597 8.6553C1.72304 8.62674 1.58491 8.54559 1.48551 8.4259C1.38612 8.30622 1.33171 8.15554 1.33171 7.99997C1.33171 7.84439 1.38612 7.69372 1.48551 7.57403C1.58491 7.45435 1.72304 7.3732 1.87597 7.34464L5.5813 6.64397C5.84473 6.59421 6.08705 6.46618 6.27662 6.27662C6.46618 6.08705 6.59421 5.84473 6.64397 5.5813L7.34464 1.87597ZM4 13.3333C4 14.0697 3.40305 14.6667 2.66667 14.6667C1.93029 14.6667 1.33333 14.0697 1.33333 13.3333C1.33333 12.597 1.93029 12 2.66667 12C3.40305 12 4 12.597 4 13.3333Z";

let sparkId = 0;
function Spark({ size = 16, width = 1.2 }: { size?: number; width?: number }) {
  const [id] = useState(() => `oap-spark-${sparkId++}`);
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 16 16" fill="none">
      <defs>
        <linearGradient id={id} x1="1.33" y1="8" x2="14.67" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E07A6B" />
          <stop offset=".5" stopColor="#D9DB4A" />
          <stop offset="1" stopColor="#4CC46A" />
        </linearGradient>
      </defs>
      <path d={SPARK} stroke={`url(#${id})`} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* dark-green squircle carrying the sparkle: .oa2-app / .oa2p-ai */
function AiTile({ size = 20, radius = 6 }: { size?: number; radius?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center bg-[linear-gradient(160deg,#0f5b40_0%,#063f2d_55%,#032c20_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,.15)]"
      style={{ width: size, height: size, borderRadius: radius }}
    >
      <Spark size={Math.round(size * 0.58)} width={1.3} />
    </span>
  );
}

/* light app window: cream chrome bar with traffic lights, as .oa2-win */
function AppWindow({ title, children, className = "" }: { title?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`${WIN} ${className}`}>
      <div className="flex h-[30px] items-center gap-1.5 bg-[#f4ecdb] px-3.5">
        <i className="block h-[10px] w-[10px] rounded-full bg-[#ec6a5f]" />
        <i className="block h-[10px] w-[10px] rounded-full bg-[#f5bf4f]" />
        <i className="block h-[10px] w-[10px] rounded-full bg-[#61c554]" />
        {title && <span className="ml-3 text-[12px] font-semibold text-[#404040]">{title}</span>}
      </div>
      {children}
    </div>
  );
}

/* ───────────────────────── hero ───────────────────────── */


/* ── stage hero: one viewport, centred, a dot-matrix headline over the flowing green light ──
   Art direction: the dot-matrix face (Doto, OFL, Google Fonts) is the "machine" voice and is
   used only where it earns it: the headline and the stat pictograms. Everything else stays in
   Public Sans so the page still reads as HROne. One coral action; everything else recedes. */

/* 9×9 dot-matrix pictograms, in the headline's LED-dot language. "X" is a lit dot. */
const DOT_ICONS = {
  mic: ["...XXX...", "...XXX...", "...XXX...", "...XXX...", ".X.XXX.X.", ".X.....X.", "..XXXXX..", "....X....", "..XXXXX.."],
  clock: ["..XXXXX..", ".X.....X.", "X...X...X", "X...X...X", "X...XXX.X", "X.......X", "X.......X", ".X.....X.", "..XXXXX.."],
  speed: ["...XXXXXX", ".......XX", "......X.X", ".....X..X", "....X...X", "...X.....", "..X......", ".X.......", "X........"],
  bars: [".......XX", ".......XX", "....XX.XX", "....XX.XX", ".XX.XX.XX", ".XX.XX.XX", ".XX.XX.XX", ".........", "XXXXXXXXX"],
};

/* lit dots switch on in a quick scan once the row reveals; unlit dots stay as a faint grid */
function DotIcon({ name, delay }: { name: keyof typeof DOT_ICONS; delay: number }) {
  const rows = DOT_ICONS[name];
  let n = 0;
  return (
    <svg aria-hidden width="36" height="36" viewBox="0 0 36 36" className="overflow-visible">
      {rows.flatMap((row, y) =>
        [...row].map((ch, x) => {
          const lit = ch === "X";
          const i = lit ? n++ : 0;
          return (
            <circle
              key={`${x}-${y}`}
              cx={2 + x * 4}
              cy={2 + y * 4}
              r={lit ? 1.45 : 0.9}
              fill={lit ? "#6EE7A8" : "rgba(110,231,168,.14)"}
              className={lit ? "stg-dot" : undefined}
              style={lit ? { animationDelay: `${delay + i * 0.022}s` } : undefined}
            />
          );
        }),
      )}
    </svg>
  );
}

/* Proof points from the sales deck (docs/one-ai-page-content.md): what it does (20+ tasks),
   the outcome (92%, 3×) and the scale (5 Cr+ = 3 Cr+ a month on web and InboxforHR plus
   2 Cr+ on mobile). */
const STAGE_STATS: { icon: keyof typeof DOT_ICONS; to: number; suf: string; dec: number; label: string }[] = [
  { icon: "mic", to: 20, suf: "+", dec: 0, label: "HR tasks done by voice or text" },
  { icon: "clock", to: 92, suf: "%", dec: 0, label: "Less screening time per role" },
  { icon: "speed", to: 3, suf: "×", dec: 0, label: "Faster hiring, 18 → 6 days" },
  { icon: "bars", to: 5, suf: " Cr+", dec: 0, label: "HR tasks a month on HROne" },
];

function useDoto() {
  /* main.tsx already requests this font for /one-ai before the page code arrives; this is
     the fallback for any other route that renders the page. Same id, so it never loads twice.
     Only the one instance used (round dots, weight 900), not the whole variable font. */
  useEffect(() => {
    const id = "route-font";
    if (document.getElementById(id)) return;
    const l = document.createElement("link");
    l.id = id;
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Doto:ROND,wght@100,900&display=swap";
    document.head.appendChild(l);
  }, []);
}

function StageStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [vals, setVals] = useState(() => STAGE_STATS.map(() => 0));
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setVals(STAGE_STATS.map((s) => s.to));
    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const ease = (x: number) => 1 - Math.pow(1 - x, 3);
      const tick = (now: number) => {
        let done = true;
        const next = STAGE_STATS.map((s, i) => {
          const start = 480 + i * 90, dur = 1500 + i * 80;
          const k = Math.min(1, Math.max(0, (now - t0 - start) / dur));
          if (k < 1) done = false;
          return s.to * ease(k);
        });
        setVals(next);
        if (!done) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { run(); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={ref} className="mx-auto grid w-full max-w-[960px] grid-cols-2 gap-x-6 gap-y-8 pt-7 sm:grid-cols-4">
      {STAGE_STATS.map((s, i) => (
        <div key={s.label} className="stg-anim flex flex-col items-center text-center" style={{ ["--d" as string]: `${0.5 + i * 0.08}s` }}>
          <span className="drop-shadow-[0_0_8px_rgba(110,231,168,.35)]"><DotIcon name={s.icon} delay={0.7 + i * 0.08} /></span>
          <b className="mt-3.5 text-[clamp(24px,2.6vw,34px)] font-semibold leading-none tracking-[-0.03em] text-white tabular-nums">
            {vals[i].toFixed(s.dec)}{s.suf}
          </b>
          <span className="mt-2 max-w-[220px] text-[clamp(12px,1.1vw,13.5px)] leading-[1.4] text-white/80">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── stage background: dunes of light ──
   After the reference's dusk landscape, in HROne colours and drawn live (no video):
   a deep green sky with a mint glow at the horizon, faint dot-matrix characters drifting in
   the sky (the headline's voice), three rolling ridges lit at the rim (coral whisper at the
   back, mint in front), and a light film grain. The headline sits in the sky, the stats on
   the dark front ridge, so white text keeps its contrast. Static under reduced motion;
   paused off screen. */
function DuneStage() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1;

    /* film grain: one noise tile, nudged every frame */
    const grain = document.createElement("canvas");
    grain.width = grain.height = 160;
    const g = grain.getContext("2d")!;
    const gi = g.createImageData(160, 160);
    for (let i = 0; i < gi.data.length; i += 4) {
      const v = Math.random() * 255;
      gi.data[i] = gi.data[i + 1] = gi.data[i + 2] = v;
      gi.data[i + 3] = 255;
    }
    g.putImageData(gi, 0, 0);

    /* the sky's characters: a sparse grid on its own layer, a few cells re-rolled at ~8fps */
    const chars = document.createElement("canvas");
    const cx = chars.getContext("2d")!;
    const GLYPHS = "08S$#+*%·:";
    let cols = 0, rows = 0, cell = 18;
    let grid: string[] = [];
    const paintCell = (i: number) => {
      const c = i % cols, r = Math.floor(i / cols);
      cx.clearRect(c * cell, r * cell, cell, cell);
      if (grid[i] !== " ") cx.fillText(grid[i], c * cell + cell / 2, r * cell + cell / 2);
    };
    const roll = () => (Math.random() < 0.34 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : " ");

    const size = () => {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = Math.max(1, Math.round(r.width * dpr));
      H = Math.max(1, Math.round(r.height * dpr));
      cv.width = W; cv.height = H;
      cell = Math.round(17 * dpr);
      cols = Math.ceil(W / cell); rows = Math.ceil((H * 0.6) / cell);
      chars.width = cols * cell; chars.height = rows * cell;
      cx.font = `900 ${Math.round(cell * 0.8)}px Doto, monospace`;
      cx.textAlign = "center"; cx.textBaseline = "middle";
      cx.fillStyle = "#bff5d9";
      grid = Array.from({ length: cols * rows }, roll);
      for (let i = 0; i < grid.length; i++) paintCell(i);
      lowSize();
    };

    /* the characters fade out from the top edge to well above the headline */
    const masked = document.createElement("canvas");
    const mx = masked.getContext("2d")!;
    const remask = () => {
      masked.width = chars.width; masked.height = chars.height;
      mx.clearRect(0, 0, masked.width, masked.height);
      mx.drawImage(chars, 0, 0);
      mx.globalCompositeOperation = "destination-in";
      const m = mx.createLinearGradient(0, 0, 0, masked.height);
      m.addColorStop(0, "rgba(0,0,0,1)");
      m.addColorStop(0.55, "rgba(0,0,0,.35)");
      m.addColorStop(1, "rgba(0,0,0,0)");
      mx.fillStyle = m;
      mx.fillRect(0, 0, masked.width, masked.height);
      mx.globalCompositeOperation = "source-over";
    };

    /* The landscape is shaded per pixel into a small canvas and stretched up, so every edge
       comes out soft and out of focus, like the reference. Grain and characters go on top
       at full resolution so they stay crisp. */
    const LW = 220;
    const low = document.createElement("canvas");
    const lx = low.getContext("2d")!;
    let LH = 120, limg = lx.createImageData(LW, LH);
    const lowSize = () => {
      LH = Math.max(80, Math.min(240, Math.round((LW * H) / W)));
      low.width = LW; low.height = LH;
      limg = lx.createImageData(LW, LH);
    };
    type RGB = [number, number, number];
    const C = {
      skyTop: [8, 52, 36] as RGB, // deep green at the top edge
      skyLow: [44, 128, 90] as RGB, // lifting toward the horizon
      halo: [150, 228, 186] as RGB, // mint light spilling round the mound
      coral: [233, 120, 92] as RGB, // warm band at the horizon, the reference's sunset in our coral
      core: [3, 24, 16] as RGB, // the mound's dark heart
      rim: [46, 112, 82] as RGB, // the mound's lit shoulder
      face: [112, 196, 154] as RGB, // the front dune's lit face
      floor: [1, 16, 11] as RGB, // the ground under the stats
    };
    const ssm = (e0: number, e1: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
      return t * t * (3 - 2 * t);
    };
    const mixc = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

    const shade = (t: number) => {
      /* phones get their own layout: the hero is tall and narrow, so the mound widens and
         flattens, and the front dune rises to just under the button, leaving the stats on
         its dark body rather than under its lit face */
      const narrow = W / H < 0.9;
      const MW = narrow ? 0.62 : 0.42, MT = narrow ? 0.2 : 0.225, MS = narrow ? 0.22 : 0.3;
      const FB = narrow ? 0.585 : 0.72, FA = narrow ? 0.03 : 0.065;
      /* two waves travelling against each other, as in the reference: the mound's top sloshes
         left to right and rocks; the front dune's swell rolls right to left. ~9–12s cycles. */
      const W1 = (t * 2 * Math.PI) / 9000, W2 = (t * 2 * Math.PI) / 12000;
      const pulse = 0.85 + Math.sin(t * 0.0004) * 0.15;
      const d = limg.data;
      let o = 0;
      for (let j = 0; j < LH; j++) {
        const v = (j + 0.5) / LH;
        for (let i = 0; i < LW; i++) {
          const u = (i + 0.5) / LW;
          /* sky, lifting toward the horizon, with a coral band low down at the sides */
          let c = mixc(C.skyTop, C.skyLow, ssm(0, 0.62, v));
          const side = Math.min(1, Math.abs(u - 0.5) * 2.2);
          c = mixc(c, C.coral, 0.32 * ssm(0.42, 0.6, v) * (1 - ssm(0.6, 0.72, v)) * side);

          /* the mound: a wide mesa, flat-topped with rounded, steep shoulders */
          const x = Math.abs(u - 0.5) / MW;
          const ym =
            MT +
            MS * Math.pow(Math.min(x, 1.6), 4) +
            0.035 * Math.sin(u * Math.PI * 1.8 - W1) + // a wave running along the top, left to right
            0.03 * (u - 0.5) * Math.sin(W2); // and a slow rock, so the high point swaps sides
          const dm = v - ym; // > 0 inside the mound
          /* halo: light spilling round the mound's edge */
          if (dm < 0.03) c = mixc(c, C.halo, 0.5 * pulse * Math.exp(Math.min(0, dm) / 0.09) * (1 - side * 0.4));
          const inM = ssm(-0.025, 0.05, dm);
          if (inM > 0) {
            /* lit along the top edge and on the shoulders, falling into a dark heart */
            let body = mixc(C.rim, C.core, ssm(0, 0.2, dm));
            body = mixc(body, C.rim, 0.55 * ssm(0.55, 1.05, x) * (1 - ssm(0.1, 0.35, dm)));
            c = mixc(c, body, inM);
          }

          /* the front dune: a long S-curve, high at the left, dipping centre-left, rising right;
             its swell travels right to left, against the mound */
          const yf =
            FB +
            FA * Math.sin(u * Math.PI * 1.6 + 2.2 + W1 * 0.8) +
            0.02 * Math.sin(u * Math.PI * 3.4 + W2 * 1.3);
          const df = v - yf;
          const inF = ssm(narrow ? -0.01 : -0.02, narrow ? 0.018 : 0.035, df);
          if (inF > 0) {
            /* a lit top face (mint with a coral blush), then black beneath */
            const face = mixc(C.face, C.coral, 0.3);
            const lit = mixc(face, C.floor, ssm(0.005, narrow ? 0.055 : 0.13, df));
            c = mixc(c, lit, inF);
          }

          /* the very bottom settles into the floor colour, under the stats */
          c = mixc(c, C.floor, ssm(0.9, 1, v));
          d[o++] = c[0]; d[o++] = c[1]; d[o++] = c[2]; d[o++] = 255;
        }
      }
      lx.putImageData(limg, 0, 0);
    };

    let lastRoll = 0;
    const draw = (t: number) => {
      shade(t);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(low, 0, 0, W, H);

      /* characters: a faint band at the top, drifting up, a few re-rolled ~8 times a second */
      if (t - lastRoll > 120 || !lastRoll) {
        lastRoll = t || 1;
        for (let k = 0; k < Math.ceil(grid.length * 0.012); k++) {
          const i = Math.floor(Math.random() * grid.length);
          grid[i] = roll();
          paintCell(i);
        }
        remask();
      }
      ctx.globalAlpha = 0.16;
      ctx.drawImage(masked, 0, -((t * 0.006 * dpr) % cell));
      ctx.globalAlpha = 1;

      /* grain */
      ctx.save();
      ctx.globalAlpha = 0.14;
      ctx.globalCompositeOperation = "overlay";
      const pat = ctx.createPattern(grain, "repeat");
      if (pat) {
        ctx.translate((Math.random() * 160) | 0, (Math.random() * 160) | 0);
        ctx.fillStyle = pat;
        ctx.fillRect(-160, -160, W + 320, H + 320);
      }
      ctx.restore();
    };

    size();
    let raf = 0, visible = true;
    const ro = new ResizeObserver(() => { size(); if (still) draw(0); });
    ro.observe(cv);
    /* redraw the characters once the dot-matrix face has loaded */
    document.fonts?.load(`900 16px Doto`).then(() => { size(); if (still) draw(0); });
    if (still) { draw(0); return () => ro.disconnect(); }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(cv);
    function frame(now: number) {
      raf = 0;
      if (!visible) return;
      draw(now);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} aria-hidden className="absolute inset-0 -z-10 block h-full w-full" />;
}

function Hero() {
  useDoto();
  return (
    <section className="relative isolate flex min-h-[calc(100svh-122px)] flex-col overflow-hidden bg-[#01241a] text-white">
      <DuneStage />

      <style>{`
        .stg-anim{opacity:0;transform:translateY(22px) scale(.98);filter:blur(6px);animation:stg-reveal .85s cubic-bezier(.22,1,.36,1) forwards;animation-delay:var(--d,0s)}
        .stg-line{display:block;opacity:0;transform:translateY(14px);animation:stg-line .85s cubic-bezier(.22,1,.36,1) forwards;animation-delay:var(--d,0s)}
        .stg-cta{opacity:0;animation:stg-reveal .85s cubic-bezier(.22,1,.36,1) forwards,stg-pulse 1.6s .9s ease-out 1;animation-delay:var(--d,0s),1.25s}
        .stg-dot{opacity:.14;animation:stg-dot .35s ease-out forwards}
        @keyframes stg-dot{to{opacity:1}}
        @keyframes stg-reveal{to{opacity:1;transform:none;filter:none}}
        @keyframes stg-line{to{opacity:1;transform:none}}
        @keyframes stg-pulse{0%{box-shadow:0 0 0 0 rgba(233,97,74,.55),0 12px 32px -10px rgba(233,97,74,.7)}100%{box-shadow:0 0 0 18px rgba(233,97,74,0),0 12px 32px -10px rgba(233,97,74,.7)}}
        @media (prefers-reduced-motion:reduce){.stg-dot{opacity:1;animation:none}.stg-anim,.stg-line,.stg-cta{opacity:1;transform:none;filter:none;animation:none}}
      `}</style>

      <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 pb-8 pt-8">
        <nav aria-label="Breadcrumb" className="text-[13px] text-white/55">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li aria-hidden>›</li>
            <li><a href="#" className="hover:text-white">HR AI Agents</a></li>
            <li aria-hidden>›</li>
            <li aria-current="page" className="text-white/85">One AI</li>
          </ol>
        </nav>

        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center sm:py-12">
          {/* trust row: one glass pill. The One AI tag names the product, the line carries the proof. */}
          <div
            className="stg-anim group mb-8 inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/[.07] py-1 pl-1 pr-3 sm:gap-3 sm:py-[5px] sm:pl-[5px] sm:pr-4 shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_10px_30px_-12px_rgba(0,0,0,.5)] backdrop-blur-md"
            style={{ ["--d" as string]: "0.05s" }}
          >
            <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[rgba(110,231,168,.35)] bg-[#032c20] py-[5px] pl-2 pr-2.5 text-[12px] font-semibold text-white sm:text-[12.5px]">
              <Spark size={14} width={1.4} />
              One AI
            </span>
            <span className="whitespace-nowrap text-[12px] text-white/80 sm:text-[13.5px]">
              Trusted by <b className="font-semibold text-white">2,500+</b> companies
            </span>
          </div>

          <h1 id="page-title" tabIndex={-1} className="whitespace-nowrap font-['Doto',_'Public_Sans',monospace] text-[clamp(40px,10.5vw,92px)] lg:text-[clamp(40px,7vw,92px)] font-black leading-[1.08] tracking-[-0.04em] text-white outline-none max-[720px]:tracking-[-0.06em]" style={{ fontVariationSettings: '"ROND" 100', wordSpacing: "-0.28em" }}>
            <span className="stg-line" style={{ ["--d" as string]: "0.12s" }}>The AI that</span>
            {/* no full stop: in the dot-matrix face it renders as a five-dot cross and reads as "+" */}
            <span className="stg-line" style={{ ["--d" as string]: "0.3s" }}>gets HR done</span>
          </h1>

          <p className="stg-anim mt-6 max-w-[min(560px,92%)] text-[clamp(16px,1.45vw,19px)] leading-[1.6] text-white/85" style={{ ["--d" as string]: "0.28s" }}>
            <b className="font-semibold text-white">It doesn&apos;t tell you how. It does it.</b> Three agents, one brain, on web, mobile, WhatsApp and Teams.
          </p>

          <a href="#" className="stg-cta group mt-9 inline-flex items-center gap-2 rounded-full bg-[#e9614a] px-7 py-[13px] text-[15px] font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,.12),0_12px_32px_-10px_rgba(233,97,74,.7)] transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[#d9553e] hover:shadow-[0_0_0_1px_rgba(255,255,255,.2),0_16px_40px_-10px_rgba(233,97,74,.9)]" style={{ ["--d" as string]: "0.4s" }}>
            Book a demo <Arrow />
          </a>
        </div>

        <StageStats />
      </div>
    </section>
  );
}

/* ───────────────────────── three agents: Option D's section, verbatim ───────────────────────── */

function Agents() {
  const ref = useRef<HTMLDivElement>(null);
  /* "seen" lives in React, not only on the DOM: the section is injected HTML, and if it is
     ever re-injected (hot reload, remount) the .is-in class goes with it and the cards would
     sit at their hidden first frame. Re-apply it after every render instead. */
  const [seen, setSeen] = useState(false);
  useLayoutEffect(() => {
    if (seen) ref.current?.querySelector(".oa2")?.classList.add("is-in");
  });
  useEffect(() => {
    if (seen) return;
    /* start when the cards themselves are on screen, not when the heading first peeks in,
       or the sequence is over before anyone sees it */
    const grid = ref.current?.querySelector<HTMLElement>(".oa2-grid");
    if (!grid || !("IntersectionObserver" in window)) return setSeen(true);
    const io = new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && setSeen(true), { threshold: 0.6 });
    io.observe(grid);
    return () => io.disconnect();
  }, [seen]);
  /* agents.html is our own static markup copied from the homepage, not user input */
  return <div id="agents" ref={ref} className="oap-agents scroll-mt-28" dangerouslySetInnerHTML={{ __html: agentsHtml }} />;
}

/* AI Interviewer lives on its own site; the feature card links there */
const AII_URL = "https://aiinterviewer.hrone.cloud";

/* ───────────────────────── One AI in every module ───────────────────────── */

/* Content: deck slide 14 ("One AI · efficiency in every module").
   Styling: the "What we handle" card grid on the payroll outsourcing landing page
   (HROne Landing Page V2 / payroll-outsourcing-lp.html, .wg-*): a mint card (#EEF7F1,
   #E1EEE7 line, 20px radius, 8px inset), a 250px visual panel alternating deep green
   (#073F25 with a #0F6A41 top glow) and light mint (#CFEEDC with a white top glow), white
   mock cards with ghost cards stacked behind, deep-green round icons with #6EE7A8 ticks,
   then an 800-weight #073F25 title and a 14px line. */

const AVA_HR = "/legacy/hrone-home/assets/avatar-hr.png";
const AVA_EMP = "/legacy/hrone-home/assets/avatar-employee.png";

const PANEL_D = "radial-gradient(ellipse 90% 70% at 50% 0%, #0F6A41 0%, transparent 70%), #073F25";
const PANEL_L = "radial-gradient(ellipse 90% 70% at 50% 0%, #F2FBF5 0%, transparent 70%), #CFEEDC";

const TickSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="block h-full w-full">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* small round brand tick used in list rows (.wv-fnf i) */
const RowTick = () => (
  <i className="relative z-[1] block h-[18px] w-[18px] shrink-0 rounded-full bg-[#0B5C35] p-[4.5px] text-white shadow-[0_0_0_3px_#fff]">
    <TickSvg />
  </i>
);

/* each card tells its mock whether its panel is dark or light */
const PanelDark = createContext(false);

/* white card with two ghost cards peeking above it (.wg-stack) */
function Stack({ children, className = "" }: { children: ReactNode; className?: string }) {
  const dark = useContext(PanelDark);
  return (
    <div className={`relative w-[88%] max-w-[300px] ${className}`}>
      <div className={`absolute left-1/2 top-[-23px] h-10 w-[80%] -translate-x-1/2 rounded-[18px] ${dark ? "bg-white/[.18]" : "bg-white/45"}`} />
      <div className={`absolute left-1/2 top-[-12px] h-10 w-[90%] -translate-x-1/2 rounded-[18px] ${dark ? "bg-white/35" : "bg-white/70"}`} />
      <div className={`relative rounded-[18px] bg-white ${dark ? "shadow-[0_24px_48px_rgba(0,0,0,.28)]" : "shadow-[0_14px_34px_rgba(7,63,37,.14)]"}`}>{children}</div>
    </div>
  );
}

const Pill = ({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "mint" }) => (
  <em
    className={`shrink-0 rounded-full px-2 py-[3px] text-[10.5px] font-bold not-italic ${
      tone === "mint" ? "bg-[#6EE7A8] text-[#073F25]" : "bg-[#E6F4ED] text-[#0B5C35]"
    }`}
  >
    {children}
  </em>
);

/* ── mocks ── */

function Phone({ children }: { children: ReactNode }) {
  const dark = useContext(PanelDark);
  return (
    <div
      className={`relative mb-[-10px] flex h-[192px] w-[78%] max-w-[230px] flex-col self-end overflow-hidden rounded-t-[30px] border-[6px] border-b-0 border-[#0F1117] bg-white px-3 pt-3 ${
        dark ? "shadow-[0_0_0_2px_rgba(110,231,168,.35),0_20px_40px_rgba(0,0,0,.25)]" : "shadow-[0_20px_40px_rgba(7,63,37,.18)]"
      }`}
    >
      <span className="absolute left-1/2 top-[15px] h-[5px] w-9 -translate-x-1/2 rounded-full bg-[#E2E8E5]" />
      <div className="flex items-center justify-between px-1.5 pb-2">
        <b className="text-[10px] font-bold text-[#0F1117]">9:41</b>
        <span className="flex items-center gap-[5px]">
          <span className="flex items-end gap-[1.5px]">
            {[4, 6, 8].map((h) => (
              <i key={h} className="block w-[2.5px] rounded-[1px] bg-[#0F1117]" style={{ height: h }} />
            ))}
          </span>
          <span className="relative block h-2 w-4 rounded-[2.5px] border border-[#0F1117]/45">
            <span className="absolute bottom-px left-px top-px block w-[70%] rounded-[1px] bg-[#0F1117]" />
          </span>
        </span>
      </div>
      {children}
    </div>
  );
}

const PhoneTick = () => (
  <i className="block h-3 w-3 rounded-full bg-[#073F25] p-[2.5px] text-[#6EE7A8]">
    <TickSvg />
  </i>
);

/* Card mocks, after Lattice's feature tiles: one clean white card, secondary text as grey
   placeholder bars, and ONE highlighted element that says what the feature does at a glance.
   Each card uses a different pattern so the grid never repeats itself. */

const Bar = ({ w, className = "" }: { w: string; className?: string }) => (
  <span className={`block h-[7px] rounded-full bg-[#ECEFED] ${className}`} style={{ width: w }} />
);
const MockCard = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-[18px] bg-white shadow-[0_1px_2px_rgba(7,63,37,.06),0_14px_34px_rgba(7,63,37,.12)] ${className}`}>{children}</div>
);
const Face = ({ src, size, zoom = 1, className = "" }: { src: string; size: number; zoom?: number; className?: string }) => (
  <span className={`block shrink-0 overflow-hidden rounded-full ${className}`} style={{ width: size, height: size }}>
    <img loading="lazy" decoding="async" src={src} alt="" className="h-full w-full object-cover" style={{ objectPosition: "50% 25%", transform: `scale(${zoom})` }} />
  </span>
);
const FACE_B = "/one-ai/people/man-brown.jpg";
const FACE_C = "/one-ai/people/man-circle.png";

/* Resume Parser: a checklist of resumes, each turning into a profile, run by One AI */
function ResumeViz() {
  const rows: [boolean, string, number][] = [
    [true, AVA_EMP, 1],
    [true, FACE_B, 1.35],
    [false, FACE_C, 1.14],
  ];
  return (
    <MockCard className="w-[270px] p-3.5">
      {/* the agent bar leads: a switched-on toggle, like the reference's "AI Agent" row */}
      <div className="flex items-center gap-2 rounded-full bg-[#F3F6F4] p-1 pr-3">
        <span className="relative flex h-6 w-11 items-center rounded-full bg-[linear-gradient(90deg,#6EE7A8,#22A06B)] px-[3px]">
          <span className="ml-auto grid h-[18px] w-[18px] place-items-center rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.2)]">
            <Spark size={11} width={1.6} />
          </span>
        </span>
        <span className="flex-1 text-[11.5px] font-semibold text-[#0F1117]">Parsed by One AI</span>
        <span className="text-[10.5px] font-semibold tabular-nums text-[#0B5C35]">24/24</span>
      </div>
      <div className="mt-3 space-y-2 px-1">
        {rows.map(([done, src, zoom], i) => (
          <div key={i} className="flex items-center gap-2.5">
            <i className={`grid h-4 w-4 shrink-0 place-items-center rounded-[5px] ${done ? "bg-[#22A06B] text-white" : "border-[1.5px] border-[#D5DCD8]"}`}>
              {done && <span className="block h-2.5 w-2.5"><TickSvg /></span>}
            </i>
            <Bar w="100%" className="flex-1" />
            <Face src={src} size={26} zoom={zoom} className="ring-2 ring-white shadow-[0_2px_6px_rgba(0,0,0,.12)]" />
          </div>
        ))}
      </div>
    </MockCard>
  );
}

/* Relevancy Score: three applicants, the best fit lifted and lit */
function RelevancyViz() {
  return (
    <MockCard className="w-[270px] p-4">
      <b className="block text-[13.5px] text-[#0F1117]">Best fit for Sales Manager</b>
      <div className="mt-3 flex items-end justify-around rounded-[14px] bg-[#F5F8F6] px-3 pb-3 pt-4">
        <div className="flex flex-col items-center gap-2">
          <Face src={FACE_B} size={34} zoom={1.35} className="opacity-80" />
          <Bar w="34px" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Face src={AVA_EMP} size={56} className="ring-4 ring-[#6EE7A8]/60 shadow-[0_0_0_10px_rgba(110,231,168,.18),0_10px_24px_rgba(11,92,53,.25)]" />
          <span className="rounded-full bg-[#0B5C35] px-2 py-[2px] text-[11px] font-bold tabular-nums text-white">92%</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Face src={FACE_C} size={34} zoom={1.14} className="opacity-80" />
          <Bar w="34px" />
        </div>
      </div>
    </MockCard>
  );
}

/* JD Creation: the role goes in, a written job description comes back */
function JdViz() {
  return (
    <MockCard className="w-[270px] p-4">
      <div className="flex items-center gap-2 rounded-full bg-[#F3F6F4] py-1 pl-3 pr-1">
        <span className="flex-1 truncate text-[11px] text-[#5F6B65]">Sales Manager · Noida · 5–9 yrs</span>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#073F25]">
          <Spark size={12} width={1.6} />
        </span>
      </div>
      <div className="mt-3 rounded-[12px] bg-[#F5F8F6] p-3">
        <div className="flex items-center justify-between">
          <b className="text-[12.5px] text-[#0F1117]">Job description</b>
          <span className="rounded-[5px] bg-[#DDF3E7] px-1.5 py-[2px] text-[9px] font-bold tracking-[.06em] text-[#0B5C35]">WRITTEN</span>
        </div>
        <div className="mt-2.5 space-y-1.5">
          <Bar w="100%" className="bg-[#E3E9E5]" />
          <Bar w="86%" className="bg-[#E3E9E5]" />
          <Bar w="64%" className="bg-[#E3E9E5]" />
        </div>
      </div>
    </MockCard>
  );
}

function ExpensePhone() {
  return (
    <Phone>
      <div className="flex flex-col items-center pt-0 text-center">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F1F4F3] text-[#0F1117]">
          <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h14l-1.5-5.5A2 2 0 0015.6 10H8.4a2 2 0 00-1.9 1.5L5 17zM7 17v2M17 17v2M8 14h.01M16 14h.01" /></svg>
        </span>
        <small className="mt-2 text-[10.5px] font-semibold text-[#72767E]">City Cabs · 18 Nov</small>
        <b className="mt-0.5 text-[30px] font-extrabold leading-none tracking-[-0.05em] text-[#0F1117]">₹1,240</b>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#6EE7A8] py-[3px] pl-[3px] pr-2.5 text-[10px] font-bold text-[#073F25]">
          {/* a crisp white tick on solid green, readable at this size */}
          <i className="grid h-4 w-4 place-items-center rounded-full bg-[#0B5C35] text-white">
            <svg aria-hidden width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
          </i>
          Claim filled from receipt
        </span>
      </div>
    </Phone>
  );
}

/* Draft Announcement: drafts written for you, the chosen one lit and ticked */
function AnnouncementViz() {
  return (
    <div className="flex w-[250px] flex-col items-center gap-2.5">
      <div className="relative w-full rounded-full bg-white px-4 py-3 text-center text-[12.5px] font-semibold text-[#0F1117] shadow-[0_0_0_3px_rgba(110,231,168,.55),0_0_24px_rgba(110,231,168,.55),0_10px_24px_rgba(7,63,37,.12)]">
        Office closed on Friday, 2 Oct
        <i className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-[#22A06B] p-[7px] text-white shadow-[0_0_0_3px_#fff]"><TickSvg /></i>
      </div>
      <div className="w-[92%] rounded-full bg-white/70 px-4 py-2.5 text-center text-[11.5px] text-[#72767E] shadow-[0_6px_16px_rgba(7,63,37,.06)]">
        Long weekend: 2–4 October
      </div>
      <div className="flex w-[84%] justify-center rounded-full bg-white/60 px-4 py-3 shadow-[0_6px_16px_rgba(7,63,37,.05)]">
        <Bar w="60%" />
      </div>
    </div>
  );
}

function GoalPhone() {
  return (
    <Phone>
      <div className="flex flex-col gap-[7px]">
        <p className="self-end max-w-[92%] rounded-[11px_11px_3px_11px] bg-[#073F25] px-2.5 py-[7px] text-[10.5px] font-medium text-white">Suggest my Q3 goals as an Inside Sales Executive</p>
        <span className="flex items-center gap-1 text-[9.5px] font-semibold text-[#72767E]">
          <AiTile size={14} radius={4} /> One AI
        </span>
        <div className="rounded-[10px] border border-[#E4E6E9] bg-white p-2.5">
          {["Close ₹40L in new business", "Keep churn under 2%", "Ship 3 case studies"].map((g) => (
            <div key={g} className="flex items-center gap-1.5 py-[3px] text-[10.5px] text-[#3D4046]">
              <i className="block h-3 w-3 shrink-0 rounded-full bg-[#0B5C35] p-[2.5px] text-white">
                <TickSvg />
              </i>
              <span className="truncate">{g}</span>
            </div>
          ))}
          <span className="mt-2 block rounded-full bg-[#0B5C35] py-1.5 text-center text-[10px] font-semibold text-white">Add to my goals</span>
        </div>
      </div>
    </Phone>
  );
}

function KioskTablet() {
  /* static, like the other cards: shown on the "marked in" state */
  const ok = true;
  const corner = `absolute h-5 w-5 border-[2.5px] transition-colors duration-300 ${ok ? "border-[#5fd39a]" : "border-white"}`;
  return (
    <div className="flex flex-col items-center">
      {/* portrait tablet, like an entrance device */}
      <div className="relative h-[250px] w-[178px] overflow-hidden rounded-[14px] border border-[#cfe2d6] bg-white shadow-[0_6px_16px_rgba(0,0,0,.08)]">
        <span className="absolute left-1/2 top-[10px] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-[#1d2b25] shadow-[0_0_0_3px_#eef3f0]" />
        <div className="absolute inset-x-2 bottom-2 top-[26px] overflow-hidden rounded-[6px] bg-[#cfe3ea]">
          <img loading="lazy" decoding="async" src="/one-ai/face-cam-1.jpg" alt="" className="h-full w-full object-cover" style={{ objectPosition: "center 30%" }} />
          <div className="absolute left-1/2 top-[40%] h-[108px] w-[92px] -translate-x-1/2 -translate-y-1/2 overflow-hidden">
            <i className={`${corner} left-0 top-0 rounded-tl-[9px] border-b-0 border-r-0`} />
            <i className={`${corner} right-0 top-0 rounded-tr-[9px] border-b-0 border-l-0`} />
            <i className={`${corner} bottom-0 left-0 rounded-bl-[9px] border-r-0 border-t-0`} />
            <i className={`${corner} bottom-0 right-0 rounded-br-[9px] border-l-0 border-t-0`} />
          </div>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
          <p className="absolute inset-x-0 bottom-2.5 whitespace-nowrap text-center text-[11.5px] font-semibold text-white">
            {ok ? (
              <span className="inline-flex items-center gap-1.5">
                <b className="grid h-[18px] w-[18px] place-items-center rounded-full bg-[#22a06b] p-[3.5px] text-white">
                  <TickSvg />
                </b>
                Marked in · 09:42 AM
              </span>
            ) : (
              "Scanning face…"
            )}
          </p>
        </div>
      </div>
      {/* stand */}
      <span className="block h-6 w-[14px] bg-[#cfe2d6]" />
      <span className="block h-[7px] w-[70px] rounded-[4px] bg-[#cfe2d6]" />
    </div>
  );
}

function InterviewWindow() {
  return (
    <div className="w-[228px] overflow-hidden rounded-[12px] border border-[#ecdcd7] bg-white shadow-[0_18px_40px_-20px_rgba(120,40,20,.3)]">
      <div className="flex h-[24px] items-center gap-1.5 px-3">
        <i className="block h-2 w-2 rounded-full bg-[#ec6a5f]" />
        <i className="block h-2 w-2 rounded-full bg-[#f5bf4f]" />
        <i className="block h-2 w-2 rounded-full bg-[#61c554]" />
      </div>
      <div className="relative mx-1.5 mb-1.5 h-[176px] overflow-hidden rounded-[6px] bg-[linear-gradient(165deg,#1E3528_0%,#0D1A14_100%)]">
        {/* the card is static, so a 36 KB still of the interview replaces the 1.6 MB video */}
        <img src="/one-ai/interview-still.jpg" alt="" loading="lazy" decoding="async" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
        <div className="absolute right-1.5 top-1.5 w-[100px] rounded-[8px] bg-white p-1.5 shadow-[0_8px_20px_-8px_rgba(0,0,0,.35)]">
          <div className="mb-1.5 flex items-center gap-1">
            <img loading="lazy" decoding="async" src="/one-ai/logo-icon.svg" alt="" className="h-[11px] w-[11px] rounded-[2px]" />
            <span className="text-[8.5px] font-semibold text-[#171717]">AI Interviewer</span>
          </div>
          <p className="rounded-[5px] bg-[#f1f1f1] px-1.5 py-1 text-[8px] leading-[1.35] text-[#404040]">Can you walk me through a time you handled a difficult customer?</p>
          <p className="mt-1 flex items-center gap-1 text-[8px] text-[#737373]">
            Listening
            {[0, 1, 2].map((i) => (
              <span key={i} className="block h-[3px] w-[3px] rounded-full bg-[#4CC46A]" />
            ))}
          </p>
        </div>
        <div className="absolute bottom-2 right-2 flex gap-1.5">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white">
            <svg aria-hidden width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#404040" strokeWidth="2.4" strokeLinecap="round"><path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" /><path d="M19 10v1a7 7 0 01-14 0v-1" /></svg>
          </span>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-black/50">
            <svg aria-hidden width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M16 10.5l6-3.5v10l-6-3.5" /></svg>
          </span>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#DC2626]">
            <svg aria-hidden width="11" height="11" viewBox="0 0 24 24" fill="#fff" style={{ transform: "rotate(135deg)" }}><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
          </span>
        </div>
      </div>
    </div>
  );
}

type Crew = {
  name: string;
  line: ReactNode;
  dark: boolean;
  phone?: boolean;
  scale?: number;
  viz: ReactNode;
  /* hero cards only: left-text / right-visual */
  wide?: boolean;
  icon?: ReactNode;
  round?: boolean;
  attrs?: string[];
  action?: ReactNode;
};

/* three rows (2 / 3 / 3) on a six-column grid; panels alternate; the phones sit on a diagonal */
const CREW: Crew[] = [
  {
    name: "Facial Kiosk",
    line: "Your HR assistant. Always on.",
    dark: true,
    wide: true,
    round: true,
    scale: 0.78,
    icon: <img loading="lazy" decoding="async" src="/one-ai/kiosk-icon.png" alt="" className="h-[26px] w-auto" />,
    attrs: ["No proxy attendance", "Facial, multilingual", "Instant support", "Always available"],
    action: (
      <a href="#" className="group inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0B5C35]">
        See it in a demo <Arrow size={14} />
      </a>
    ),
    viz: <KioskTablet />,
  },
  {
    name: "AI Interviewer",
    line: "First rounds run themselves.",
    dark: false,
    wide: true,
    scale: 1,
    icon: <img loading="lazy" decoding="async" src="/one-ai/ai-interviewer-icon.svg" alt="" className="h-[20px] w-[20px]" />,
    attrs: ["AI-led interviews", "Voice analysis", "Bias free", "Score & insights"],
    action: (
      <a href={`${AII_URL}/signup`} className="group inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0B5C35]">
        Try it free · from ₹99 <Arrow size={14} />
      </a>
    ),
    viz: <InterviewWindow />,
  },
  { name: "Expense Bills Parser", line: "Snap a receipt and One AI fills in the claim for you.", dark: false, phone: true, viz: <ExpensePhone /> },
  { name: "Resume Parser", line: "Upload resumes in bulk and get candidate profiles in seconds.", dark: true, scale: 0.92, viz: <ResumeViz /> },
  { name: "Relevancy Score", line: "Every applicant ranked against the job, so you start with the best fit.", dark: false, scale: 0.92, viz: <RelevancyViz /> },
  { name: "JD Creation", line: "Give it a few inputs and AI writes the full job description.", dark: true, scale: 0.92, viz: <JdViz /> },
  { name: "Draft Announcement", line: "Company announcements written for you, ready to edit and publish.", dark: false, scale: 0.92, viz: <AnnouncementViz /> },
  { name: "Create Goal", line: "Ask for goals in plain words and One AI drafts them for the cycle.", dark: true, phone: true, viz: <GoalPhone /> },
];

const CARD_SHELL =
  "rounded-[20px] border border-[#E1EEE7] bg-[#EEF7F1] p-2 transition-[transform,box-shadow] duration-[400ms] [transition-timing-function:cubic-bezier(.2,.8,.2,1)] hover:-translate-y-[3px] hover:shadow-[0_1px_3px_rgba(0,0,0,.05),0_4px_16px_rgba(0,0,0,.04),0_12px_40px_rgba(11,92,53,.04)]";

function Panel({ c, className }: { c: Crew; className: string }) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-[14px] ${className}`} style={{ background: c.dark ? PANEL_D : PANEL_L }}>
      <PanelDark.Provider value={c.dark}>
        {/* phones stay full size and crop at the panel's foot; the rest scale to fit */}
        {c.phone ? c.viz : <div className="flex w-full justify-center" style={{ transform: `scale(${c.scale ?? 0.8})` }}>{c.viz}</div>}
      </PanelDark.Provider>
    </div>
  );
}

function CrewCard({ c }: { c: Crew }) {
  if (c.wide) {
    /* hero card: the story on the left, the product on its own panel on the right */
    return (
      <article className={`grid gap-4 !p-6 lg:col-span-3 sm:grid-cols-[1fr_auto] ${CARD_SHELL}`}>
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className={`grid h-11 w-11 shrink-0 place-items-center bg-[#0B5C35] ${c.round ? "rounded-full" : "rounded-[12px]"}`}>{c.icon}</span>
            <h3 className="text-[22px] font-extrabold leading-[1.1] tracking-[-0.035em] text-[#073F25]">{c.name}</h3>
          </div>
          <p className="mt-3 text-[14px] leading-[1.45] text-[#3D4046]">{c.line}</p>
          <ul className="mt-3.5 flex flex-wrap gap-1.5">
            {c.attrs?.map((a) => (
              <li key={a} className="inline-flex items-center gap-1.5 rounded-full bg-white py-1 pl-1 pr-2.5 text-[11.5px] font-semibold text-[#3D4046] ring-1 ring-[#E1EEE7]">
                <i className="block h-[15px] w-[15px] rounded-full bg-[#6EE7A8] p-[3.5px] text-[#073F25]">
                  <TickSvg />
                </i>
                {a}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-5">{c.action}</div>
        </div>
        {/* the product sits straight on the card, no panel behind it */}
        <div className="hidden h-[228px] w-[230px] items-center justify-end self-center sm:flex">
          <PanelDark.Provider value={false}>
            <div className="origin-right" style={{ transform: `scale(${c.scale ?? 0.8})` }}>{c.viz}</div>
          </PanelDark.Provider>
        </div>
      </article>
    );
  }
  return (
    <article className={`flex flex-col lg:col-span-2 ${CARD_SHELL}`}>
      <Panel c={c} className="h-[200px]" />
      <div className="px-4 pb-5 pt-4">
        <h3 className="mb-1.5 text-[19px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#073F25]">{c.name}</h3>
        <p className="text-[13.5px] leading-[1.5] text-[#3D4046]">{c.line}</p>
      </div>
    </article>
  );
}

function EveryModule() {
  return (
    <section id="modules" className="relative scroll-mt-28 overflow-hidden bg-white px-6 py-[72px]">
      {/* the landing page's faint dot grid behind the cards */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-45 [mask-image:radial-gradient(ellipse_90%_90%_at_50%_50%,black_20%,transparent_100%)]"
        style={{ backgroundImage: "radial-gradient(rgba(11,92,53,.12) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      <div className="relative mx-auto max-w-[1200px]">
        <Head
          kicker="Efficiency in every module"
          title="Hours of manual work, gone"
          sub="Nothing new to learn. Just the slow, manual parts of every module turned into minutes, on the One AI engine underneath."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {CREW.map((c) => (
            <CrewCard key={c.name} c={c} />
          ))}
        </div>

        {/* deck slide 14's closing bar */}
        <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-[20px] bg-[#073F25] px-6 py-4 text-center text-white sm:flex-row sm:gap-3">
          <Spark size={20} width={1.3} />
          <p className="text-[16.5px] font-medium">
            One AI engine underneath it all: intelligent, secure, and built for scale. <span className="text-[#6EE7A8]">Pay only for what you use.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── comparison ───────────────────────── */

const COMPARE: [string, string, string][] = [
  ["Does HR tasks, not just tells you how", "No", "Yes, 20+ tasks"],
  ["Works by voice", "Rarely", "Yes"],
  ["Answers from your own policies", "Generic answers", "Yes, and cites the policy"],
  ["MIS answers in plain language", "Needs a report builder", "Ask, and get the chart"],
  ["Training needed", "Yes", "Zero learning curve"],
  ["Available", "Office hours", "Always on: web, mobile, WhatsApp, Teams"],
];

/* ───────────────────────── the old page's sections, kept as they were ─────────────────────────
   the 30-second video with client logos, Customer Happiness and
   the FAQs: same content and design as the old hrone.cloud/one-ai (legacy.html + legacy.css,
   scoped under .oap-legacy). The old jQuery behaviour is redone here: video play/pause and the
   FAQ accordion. The FAQ structured data comes across unchanged for search. */
function Legacy() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const video = root.querySelector<HTMLVideoElement>("#myVideoai");
    const play = root.querySelector<HTMLElement>("#playBtn");
    const pause = root.querySelector<HTMLElement>("#pauseBtn");
    const showPlaying = (on: boolean) => {
      if (play) play.style.display = on ? "none" : "";
      if (pause) pause.style.display = on ? "block" : "none";
    };
    const onPlay = () => { video?.play(); showPlaying(true); };
    const onPause = () => { video?.pause(); showPlaying(false); };
    const onEnded = () => showPlaying(false);
    play?.addEventListener("click", onPlay);
    pause?.addEventListener("click", onPause);
    video?.addEventListener("ended", onEnded);

    const onFaq = (e: Event) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".faq-accordion");
      if (!btn || !root.contains(btn)) return;
      const panel = btn.nextElementSibling as HTMLElement | null;
      const open = !btn.classList.contains("open");
      btn.classList.toggle("open", open);
      panel?.classList.toggle("open", open);
      if (panel) panel.style.display = open ? "block" : "none";
    };
    root.addEventListener("click", onFaq);
    return () => {
      play?.removeEventListener("click", onPlay);
      pause?.removeEventListener("click", onPause);
      video?.removeEventListener("ended", onEnded);
      root.removeEventListener("click", onFaq);
    };
  }, []);
  return (
    <>
      {/* legacy.html is our own static copy of the old page's markup, not user input */}
      <div id="faqs" ref={ref} className="oap-legacy scroll-mt-28" dangerouslySetInnerHTML={{ __html: legacyHtml }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(legacyFaqSchema) }} />
    </>
  );
}

/* ───────────────────────── why One AI feels different ─────────────────────────
   The old page's three points, same words, in this page's design: one headline and three
   open columns split by hairlines, each led by a green icon tile. */
const DIFFERENT: { title: string; line: string; icon: string }[] = [
  {
    title: "It acts. It executes. It gets stuff done.",
    line: "Forget nudges and suggestions. This AI just takes over.",
    icon: "M13 2L4.5 13.5H11L10 22l8.5-11.5H12L13 2z", // bolt: it acts
  },
  {
    title: "It works across the HR spectrum.",
    line: "From hiring and onboarding to payroll and engagement.",
    icon: "M3 12h4l3-7 4 14 3-7h4", // a pulse across the whole cycle
  },
  {
    title: "It feels effortless, across the employee cycle.",
    line: "One message. One command. One second. Done.",
    icon: "M4 5h16a1 1 0 011 1v10a1 1 0 01-1 1H9l-5 4V6a1 1 0 011-1zM8 10h8M8 13h5", // one message
  },
];

function Different() {
  return (
    <section className="bg-white px-6 pb-[88px] pt-6">
      <div className="mx-auto max-w-[1200px]">
        <Head kicker="Not another chatbot" title="Why One AI feels different" />
        {/* no boxes: three columns split by hairlines, one icon colour */}
        <div className="mx-auto mt-14 grid max-w-[1080px] divide-y divide-[#E4ECE7] md:grid-cols-3 md:divide-x md:divide-y-0">
          {DIFFERENT.map((d) => (
            <div key={d.title} className="py-8 max-md:first:pt-0 max-md:last:pb-0 md:px-10 md:py-2 md:first:pl-0 md:last:pr-0">
              <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-[#E6F4ED] text-[#0B5C35]">
                <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d={d.icon} /></svg>
              </span>
              <h3 className="mt-6 text-[21px] font-bold leading-[1.25] tracking-[-0.02em] text-[#0e1a14]">{d.title}</h3>
              <p className="mt-2.5 text-[16px] leading-[1.5] text-[#5f6b65]">{d.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Compare() {
  return (
    <section className="bg-white px-6 py-[88px]">
      <div className="mx-auto max-w-[1200px]">
        <Head kicker="Tired of AI that only predicts?" title="Meet the one that delivers." />
        <div className={`${CARD} mx-auto mt-12 max-w-[980px] overflow-x-auto`}>
          <table className="w-full min-w-[620px] text-left text-[15.5px]">
            <thead>
              <tr className="border-b border-[#dfe8e2]">
                <th className="px-6 py-4 text-[13px] font-semibold text-[#737373]">What you need</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-[#737373]">Typical HR AI</th>
                <th className="bg-[#f1f7f3] px-6 py-4 text-[14px] font-bold text-[#0b4a2e]">
                  One AI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeeeee]">
              {COMPARE.map(([need, them, us]) => (
                <tr key={need}>
                  <td className="px-6 py-4 font-semibold text-[#10231b]">{need}</td>
                  <td className="px-6 py-4 text-[#8a8a8a]">{them}</td>
                  <td className="bg-[#f1f7f3] px-6 py-4 font-semibold text-[#0b4a2e]">
                    <span className="flex items-start gap-2">
                      <Tick className="mt-[3px] text-[#02563d]" />
                      {us}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── video ───────────────────────── */


/* ───────────────────────── closing CTA ───────────────────────── */

function Closing() {
  return (
    <section className="bg-white px-6 py-[88px] text-center">
      <Head kicker="Eliminate the admin headache." title="Let's make AI work for you." />
      <div className="mt-[30px] flex flex-wrap items-center justify-center gap-3">
        <Cta>Book a demo</Cta>
        <GhostCta href="https://aiinterviewer.hrone.cloud/signup">Try AI Interviewer free</GhostCta>
      </div>
    </section>
  );
}

/* ───────────────────────── page ───────────────────────── */

export default function OneAiPage() {
  useEffect(() => {
    document.title = "One AI";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "One AI by HROne: three HR AI agents (Analytics, Employee and Policy) that do HR tasks by text or voice on web, mobile, WhatsApp and Teams. Plus AI Interviewer at ₹99 per interview.";
  }, []);

  return (
    <div className="min-h-full">
      <style>{`
        @keyframes oap-speak { from { transform: scaleY(1) } to { transform: scaleY(.35) } }
        /* hero: the analytics answer assembles once on load, like the homepage card */
        @keyframes oap-up { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        @keyframes oap-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes oap-out { to { opacity: 0 } }
        @keyframes oap-draw { to { stroke-dashoffset: 0 } }
        .oap-rise { animation: oap-up .55s cubic-bezier(.2,.7,.2,1) both }
        .oap-wave { transform-origin: center; animation: oap-speak .45s ease-in-out 5 alternate }
        .oap-said { opacity: 0; animation: oap-fade .4s .85s ease both }
        .oap-run { animation: oap-out .25s 1.65s ease both }
        .oap-ok { opacity: 0; animation: oap-fade .25s 1.7s ease both }
        .oap-chart { opacity: 0; animation: oap-fade .35s 1.8s ease both }
        .oap-line { stroke-dasharray: 1; stroke-dashoffset: 1; animation: oap-draw 1.1s 1.9s cubic-bezier(.4,0,.2,1) both }
        .oap-area { opacity: 0; animation: oap-fade .6s 2.6s ease both }
        .oap-dot { opacity: 0; animation: oap-fade .25s ease both }
        .oap-tip { opacity: 0; animation: oap-up .35s 2.9s ease both }
        .oap-sum { opacity: 0; animation: oap-up .4s 3s ease both }
        .oap-kscan { animation: oap-kscan 1.2s ease-in-out infinite alternate }
        @keyframes oap-kscan { from { top: 4px } to { top: calc(100% - 6px) } }
        .oap-listen { animation: oap-blink 1.2s ease-in-out infinite }
        @keyframes oap-blink { 0%,100% { opacity: .25 } 50% { opacity: 1 } }
        @media (prefers-reduced-motion: reduce) {
          .oap-rise,.oap-ok,.oap-chart,.oap-area,.oap-dot,.oap-tip,.oap-sum,.oap-said,.oap-wave,.oap-kscan,.oap-listen { opacity: 1; animation: none !important }
          .oap-run { display: none } .oap-line { stroke-dashoffset: 0; animation: none !important }
        }
        @media (prefers-reduced-motion: reduce) { [style*="oap-"] { animation: none !important } }
        /* the copied .oa2 section sits on its own mint ground; nothing else needed */
        .oap-agents .oa2-prod { font-weight: 600 }
      `}</style>

      <header className="sticky top-0 z-50">
        <TopStripe />
        <NavBar />
      </header>

      <main>
        <Hero />
        <Agents />
        <EveryModule />
        <Compare />
        <Different />
        <Legacy />
        <Closing />
      </main>

      <div id="site-footer">
        <HomeFooter />
      </div>
      <BackToTop focusId="page-title" footerId="site-footer" />
    </div>
  );
}
