import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

/* The presentation is hrone.studio's, measured off the live page rather than eyeballed:
   a 1120px window on the page's own ground — no panel behind it — that grows from 1.05 to
   1.2 over the first 560px of scroll and then holds. 1120 x 1.2 is the 1344px the studio
   page settles at, so the product lands at the same size here.

   The growth is anchored `center bottom`, which is the whole effect: scaling about the
   centre would push the window down into the section below as hard as it pushes up, and
   scaling about the top would pin the header and slide the body away. Held at the bottom,
   the window rises into the space under the hero as it opens out. */
const BASE_W = 1120;
const START_SCALE = 1.05;
const END_SCALE = 1.2;
const GROW_DISTANCE = 560;

function useGrow() {
  const [growth, setGrowth] = useState(START_SCALE);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGrowth(END_SCALE);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      /* Studio spends the growth over a flat 560px because its page has 560px to give.
         This one is barely a screen and a half tall — 511px of scroll at 900px of
         viewport, 331px at 1080px — so a fixed distance would strand the product
         part-open and, on a tall screen, hardly open it at all. Normalising to the
         scroll the page can actually perform keeps studio's curve and its endpoints,
         and simply finishes where the page finishes. Growth spills out of the reserved
         box rather than reflowing it, so scrollHeight cannot feed back into this. */
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const distance = Math.max(1, Math.min(GROW_DISTANCE, maxScroll));
      const t = clamp(window.scrollY / distance, 0, 1);
      setGrowth(START_SCALE + (END_SCALE - START_SCALE) * t);
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
  }, []);

  return growth;
}

export function ProductShowcase() {
  const box = useRef<HTMLDivElement>(null);
  const growth = useGrow();

  /* The reserved box is fluid up to BASE_W, so its width has to be measured rather than
     assumed — the mock inside is laid out at its own fixed MOCK_W and scaled to fit, which
     keeps the coded chrome in proportion with the screenshot at every width. */
  const [boxW, setBoxW] = useState(0);
  /* Layout effect, not effect: the reserved height depends on this measurement, so
     measuring after paint would flash a collapsed box and shove the logos up the page. */
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setBoxW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fit = boxW ? boxW / MOCK_W : 0;
  /* Only the unscaled window is reserved in flow, exactly as the studio page does it: the
     growth spills out of this box rather than pushing the page around as it scrolls. */
  const reserveH = boxW * (MOCK_H / MOCK_W);

  return (
    /* 45px of air between the hero's rating row and the window. It sits on the section so
       it moves the reserved box itself: nudging the mock with a translate instead would
       fight the bottom-anchored growth, which holds that edge on purpose. */
    <section className="w-full px-6 pt-[45px] lg:px-8">
      <div className="mx-auto w-full max-w-[1280px]">
        <div ref={box} className="relative mx-auto w-full" style={{ maxWidth: BASE_W, height: reserveH || undefined }}>
          {boxW > 0 && (
            <div
              className="absolute bottom-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[0_25px_50px_-12px_rgba(15,42,28,0.28)]"
              style={{
                left: (boxW - MOCK_W) / 2,
                width: MOCK_W,
                height: MOCK_H,
                transform: `scale(${fit * growth})`,
                transformOrigin: "center bottom",
                willChange: "transform",
              }}
            >
              <Dashboard />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
