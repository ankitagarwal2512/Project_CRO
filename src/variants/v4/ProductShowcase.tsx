import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import hrIcon from "@/imports/HRICON.svg";
import dashboard from "@/imports/v4/dashboard.webp";

/* v4 — same stage as v3, but the product is a raster rather than a mock built here.

   It used to be the employee home screen ("Hello, Pranav!") exported from Figma (file
   Project_CRO_Designdev, node 1511:21845). It is now the payroll dashboard, to match the
   root/v1 variation — rendered from v1's own JSX at its native 880px design width and 3x
   DPR, with v1's browser chrome clipped off the top because the stage below draws its own.

   Re-exporting it: run the page at /v1 with prefers-reduced-motion (which settles the
   reveal at p=1), clear the mock's settled 0.88 transform so it paints at 880px, hide the
   floating gutter cards, then clip the frame's first child (the chrome) off the capture.
   Keep IMAGE_W as it is and recompute IMAGE_H from the new aspect — the stage's width is
   tuned against the hero above it. */

/* ---------- the stage ---------- */

const clamp = (v: number, a = -1, b = 1) => (Number.isFinite(v) ? Math.min(b, Math.max(a, v)) : 0);

/* Ceiling on how far the screenshot lags the page. The realised travel is whatever the
   panel's own geometry allows (see `travel` below) — this is only the upper bound, past
   which the drift stops reading as depth and starts reading as a slide. */
const MAX_TRAVEL = 70;

/* The measured element must not be the element that moves: a transform changes the next
   frame's getBoundingClientRect, so measuring the moved node feeds each frame back into
   the following one and the drift compounds until the product walks off the panel. The
   ref therefore sits on the panel and the transform goes on the product inside it. */
function useParallax(panel: RefObject<HTMLDivElement | null>, travel: number) {
  const [y, setY] = useState(0);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const docTop = r.top + window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - vh;

      /* The panel's journey across the viewport at a given scroll position: 0 as its top
         edge reaches the bottom of the screen, 1 as its bottom leaves the top. */
      const journey = (scroll: number) => (vh - (docTop - scroll)) / (vh + r.height);

      /* Only part of that journey is reachable — this page is barely two screens tall, so
         the panel enters already mostly visible and never travels far past centre. Measured
         against the whole journey the drift came to 39px across the entire scroll, which is
         not visible; normalised against the journey the page can actually perform, the full
         travel is spent on the scroll that exists. */
      const from = journey(0);
      const span = journey(maxScroll) - from;
      const t = span > 0 ? clamp((journey(window.scrollY) - from) / span, 0, 1) : 0;

      /* One way only, from zero. A drift centred on the panel's midpoint is at its maximum
         downward displacement at scroll 0 — it pushed the product ~40px further down the
         page exactly where the fold is tightest, for no visible benefit. Starting at rest
         means the product sits where it is laid out when the page loads and rises from
         there, and the whole travel is still spent. */
      setY(-t * travel);
    };
    /* scroll fires far faster than the compositor paints, so coalesce to one rAF */
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [panel, travel]);

  return y;
}

/* The flowing ribbon band from go.hrone.cloud — their 614x191 artwork. It used to sit
   behind the headline on the cream; on the dark panel it does more, because the product is
   opaque and the curves read as the surface the screenshot rests on.

   Its own 3.2:1 ratio is kept. Stretching it to the panel's height (preserveAspectRatio
   "none") crushed the curves into steep, squeezed ramps that read as banding rather than as
   artwork — so instead it is simply drawn far wider than the panel and allowed to run off
   both sides, which gives the sweeps real amplitude at their true shape. It is anchored low
   and faded at the top so it rises out of the bottom edge rather than stopping dead. */
function Ribbon({ y }: { y: number }) {
  const fade = "linear-gradient(to bottom, transparent, #000 22%)";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-[-10%] left-1/2 w-[168%] opacity-[0.22]"
      style={{ maskImage: fade, WebkitMaskImage: fade, transform: `translate3d(-50%, ${y}px, 0)` }}
    >
      <svg viewBox="0 0 614 191" width="100%" className="h-auto" fill="none">
        <path d="M5.97161 190.157L6.75813e-06 48.5474L130.67 4.94636C153.322 -2.59602 178.276 -1.48774 199.99 8.09947L275.313 41.3533C297.086 50.94 322.001 52.1046 344.693 44.5059L423.896 17.9871C446.608 10.3882 471.502 11.553 493.275 21.1397L613.753 74.3537L576.915 87.8855L495.706 52.02C471.582 41.3551 443.697 41.1882 419.43 51.506L336.847 86.5423C317.103 94.9152 294.753 96.3935 273.997 90.7697L191.174 68.2729C171.521 62.9558 150.507 63.9739 131.572 71.1829L2.92563 119.334L86.7683 92.7532C109.421 85.2108 134.375 86.3191 156.088 95.9063L231.412 129.16C253.185 138.747 278.1 139.911 300.792 132.313L379.994 105.794C402.706 98.1951 427.601 99.3598 449.394 108.946L569.872 162.16L533.034 175.692L451.825 139.827C427.701 129.162 399.815 128.995 375.549 139.313L292.966 174.349C273.221 182.722 250.872 184.256 230.116 178.576L147.292 156.079C127.639 150.762 106.626 151.781 87.6908 158.99L5.87146 190.139L5.97161 190.157Z" fill="#3ddc97" />
      </svg>
    </div>
  );
}

/* The window carries rounded-2xl, the same class the other variations put on their mock.
   v4's export is wider than their 880px mock but scales by the same 1.2, so 16px local lands
   at the same rendered radius — the windows match across variations rather than merely
   sharing a number.

   The Figma screen keeps its own browser header, which v4 does not use — the window chrome
   is the one the other variations draw, so the export is cut below that header and the
   coded chrome sits above it instead.

   Getting that cut right needed the card's true top edge, and the bleed Figma adds for the
   drop shadow is NOT split evenly: the shadow is offset downwards, so the top gets half the
   bleed LESS the offset, not half of (bleed less the offset). The wrong one puts the cut
   ~10px inside the card, which slices through the top corners and crowds the traffic lights
   against the edge. Confirmed against the export: the header's gradient runs 33 design px
   from the corrected top, exactly its stated height. */
const IMAGE_W = 990.3333333333334;
const IMAGE_H = 598.7015151515152; // 2640x1596 export, held to IMAGE_W's aspect

function Dashboard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white">
      {/* browser chrome — tab strip over a toolbar, the way a real window reads */}
      <div className="shrink-0 bg-[var(--cream-2)]">
        {/* tab strip */}
        <div className="flex items-end gap-1 px-3 pt-2.5">
          <div className="flex shrink-0 gap-1.5 pb-[8px] pr-2">
            <span className="h-[11px] w-[11px] rounded-full bg-[#ec6a5f]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#f5bf4f]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#61c554]" />
          </div>

          {/* active tab — merges into the white toolbar below it */}
          <div className="flex min-w-0 max-w-[186px] flex-1 items-center gap-1.5 rounded-t-[9px] bg-white px-2.5 py-[7px]">
            <img src={hrIcon} alt="" aria-hidden className="h-[11px] w-[11px] shrink-0 object-contain" />
            <span className="truncate text-[10.5px] font-medium text-[var(--ink)]">HROne — Dashboard</span>
            <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden className="ml-auto shrink-0 text-[var(--muted)]">
              <path d="M1.2 1.2l7.6 7.6M8.8 1.2L1.2 8.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>


          <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden className="mb-[9px] ml-1 shrink-0 text-[var(--muted)]">
            <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>

        {/* toolbar */}
        <div className="flex items-center gap-2 border-b border-[var(--border)] bg-white px-3 py-[6px]">
          <div className="flex shrink-0 items-center gap-2 text-[var(--muted)]">
            <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden>
              <path d="M8.6 3.2L4.8 7l3.8 3.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden className="opacity-40">
              <path d="M5.4 3.2L9.2 7l-3.8 3.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg
              width="13"
              height="13"
              viewBox="0 0 14 14"
              aria-hidden
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* arc sweeps up and terminates exactly where the arrowhead corner sits */}
              <path d="M11.95 8.75a5.25 5.25 0 1 1-1.24-5.46l2.71 2.54" />
              <path d="M13.42 2.33v3.5H9.92" />
            </svg>
          </div>

          {/* address bar */}
          <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-[var(--cream)] px-2.5 py-[3px] ring-1 ring-[var(--border)]">
            <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden className="shrink-0 text-[var(--green)]">
              <rect x="1.6" y="4.3" width="6.8" height="4.5" rx="1" fill="currentColor" />
              <path d="M3.3 4.3V3.1a1.7 1.7 0 0 1 3.4 0v1.2" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            <span className="truncate font-mono text-[9.5px] text-[var(--muted)]">
              app.hrone.cloud<span className="text-[var(--ink)]">/dashboard</span>
            </span>
          </div>

        </div>
      </div>
      <img
        src={dashboard}
        alt="The HROne payroll dashboard: effective CTC, net paid, contributions, deductions and reimbursement across 2,040 employees, over a yearly salary distribution chart."
        className="block w-full"
        width={IMAGE_W}
        height={IMAGE_H}
        draggable={false}
      />
    </div>
  );
}
const MOCK_W = IMAGE_W;
/* the coded chrome's own height, measured once at this width, plus the screenshot below it */
const CHROME_H = 73;
const MOCK_H = CHROME_H + IMAGE_H;
const MAX_ZOOM = 1.2;

export function ProductShowcase() {
  const panel = useRef<HTMLDivElement>(null);

  /* Every offset below is derived from the panel's own width, so the composition holds its
     proportions instead of breaking at a handful of breakpoints. */
  const [panelW, setPanelW] = useState(0);
  const [vh, setVh] = useState(0);
  /* Layout effect, not effect: the panel's height depends on this measurement, so measuring
     after paint would flash a collapsed panel and shove the Trust logos up the page. */
  useLayoutEffect(() => {
    const el = panel.current;
    if (!el) return;
    const measure = () => {
      setPanelW(el.clientWidth);
      setVh(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* Capped against the panel as well as against its own ceiling, so there is always a real
     margin of green either side for the artwork to show through rather than the product
     running the full width of the panel. */
  const productW = Math.min(MOCK_W * MAX_ZOOM, panelW * 0.88);
  const zoom = productW / MOCK_W;
  const productH = MOCK_H * zoom;
  /* Bounded by viewport height as well as panel width: on a short screen the gap above the
     product is space the fold cannot afford, and a panel that is wide but viewed on a 631px
     screen would otherwise reserve as much of it as a tall one. */
  const top = Math.max(56, Math.min(panelW * 0.075, vh * 0.095));
  /* Bounded by the gap above the product: the drift must never carry it into the panel's
     top edge, which is what caps it on a phone where that gap is smallest. */
  const travel = Math.min(MAX_TRAVEL, top - 22);
  const y = useParallax(panel, travel);
  /* How much of the product is cut off by the bottom edge. Never less than the parallax can
     travel plus a margin, or drifting up would pull the product's bottom into view and open
     a strip of bare green under it. */
  const overhang = Math.max(travel + 16, productH * 0.12);
  const panelH = top + productH - overhang;

  return (
    <section className="w-full px-4 sm:px-6 lg:px-10">
      <div
        ref={panel}
        className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[clamp(18px,2vw,30px)] bg-[#07351f]"
        style={{ height: panelH || undefined }}
      >
        {/* one gradient rather than the stack of glows, dots and grids v1/v2 layer up */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(110% 90% at 50% -18%, #10613c 0%, #07351f 62%)" }}
        />
        <Ribbon y={-y * 0.35} />

        {/* The product is positioned, not laid out in flow: it has to hang past the panel's
            bottom edge and be cut by it, so the screenshot reads as continuing below rather
            than as a card sitting on a slab. */}
        <div
          className="absolute"
          style={{
            left: (panelW - productW) / 2,
            top,
            width: productW,
            height: productH,
            transform: `translate3d(0, ${y}px, 0)`,
          }}
        >
          {/* The shadow lives out here, not on the mock: on the dark panel the mock's own
              green shadow is invisible, and a wide black one is what actually lifts a white
              window off a dark ground. */}
          <div
            className="origin-top-left rounded-2xl shadow-[0_60px_120px_-45px_rgba(0,0,0,0.85)]"
            style={{ width: MOCK_W, height: MOCK_H, transform: `scale(${zoom})` }}
          >
            <Dashboard />
          </div>
        </div>
      </div>
    </section>
  );
}
