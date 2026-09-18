import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import hrIcon from "@/imports/HRICON.svg";
import avatarUser from "@/imports/AVATAR.png";
import avatarAnanya from "@/imports/ANANYA.png";
import avatarTopbar from "@/imports/aa-avatar.png";
/* Icons exported from the Figma node (1597:12442). They ship pre-coloured to the
   design's own tokens — #f0f5f2 on the rail, white in the topbar, and the One AI
   mark keeps its brand gradient — so they are rendered as assets, not redrawn. */
import navInbox from "@/imports/v1/nav/inbox.svg";
import navRequest from "@/imports/v1/nav/request.svg";
import navTeams from "@/imports/v1/nav/teams.svg";
import navProjects from "@/imports/v1/nav/projects.svg";
import navExternal from "@/imports/v1/nav/external.svg";
import navOneAi from "@/imports/v1/nav/oneai.svg";
import navMySpace from "@/imports/v1/nav/myspace.svg";
import navHrDesk from "@/imports/v1/nav/hrdesk.svg";
import navRecruitment from "@/imports/v1/nav/recruitment.svg";
import navWorkforce from "@/imports/v1/nav/workforce.svg";
import navTimeoffice from "@/imports/v1/nav/timeoffice.svg";
import navPayroll from "@/imports/v1/nav/payroll.svg";
import navPerformance from "@/imports/v1/nav/performance.svg";
import navAnalytics from "@/imports/v1/nav/analytics.svg";
import navSettings from "@/imports/v1/nav/settings.svg";
import navHome from "@/imports/v1/nav/home.svg";
import navSearch from "@/imports/v1/nav/search.svg";
import navOrgChart from "@/imports/v1/nav/orgchart.svg";
import navTopA from "@/imports/v1/nav/topbar-a.svg";
import navTopB from "@/imports/v1/nav/topbar-b.svg";
import navChevron from "@/imports/v1/nav/chevron-right.svg";
import navCollapse from "@/imports/v1/nav/arrows-from-line.svg";

/* ---------- scroll reveal ---------- */

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number, a = 0, b = 1) => (Number.isFinite(v) ? Math.min(b, Math.max(a, v)) : a);

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setP(1);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      /* Progress is measured in scrolled pixels, not in where the showcase happens to
         sit in the viewport. The hero copy above it is a fixed ~525px tall, while the
         old trigger line (62% of the viewport) moves with the window: at 768px tall it
         lands above the showcase so the reveal began at 0, but at 1080px tall it lands
         below it, so the page loaded already ~25% revealed and the product never got
         its full-size first view. Flooring the start at 0 keeps the "begins when the
         top reaches 62%" behaviour for a short window, and guarantees p=0 on load at
         every viewport height. */
      const docTop = rect.top + window.scrollY;
      const start = Math.max(0, docTop - 0.62 * vh);
      const raw = (window.scrollY - start) / (0.54 * vh);
      setP(clamp(raw));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { ref, p };
}

// staggered local progress within [start,end]
const win = (p: number, start: number, end: number) => easeOut(clamp((p - start) / (end - start)));

/* ---------- floating snippet wrapper ---------- */

/* No rotation. The cards used to settle at ±2deg, which reads as scattered snapshots
   rather than as one composition — and a page whose headline is "Simplest" should not have
   four things sitting crooked around the product. They rise straight and stop square. */
function Float({
  children,
  className = "",
  from,
  t,
}: {
  children: ReactNode;
  className?: string;
  from: [number, number];
  t: number;
}) {
  const k = 1 - t;
  const style: CSSProperties = {
    opacity: clamp(t * 1.6),
    transform: `translate3d(${from[0] * k}px, ${from[1] * k}px, 0) scale(${0.985 + 0.015 * t})`,
    willChange: "transform, opacity",
  };
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

/* ---------- tiny primitives ---------- */

const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div
    className={`rounded-[7px] border border-[var(--border)] bg-[var(--panel)]/95 p-4 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_10px_24px_-16px_rgba(11,74,46,0.2),0_2px_6px_-4px_rgba(11,74,46,0.1)] backdrop-blur-sm ${className}`}
  >
    {children}
  </div>
);

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="shrink-0">
    <circle cx="8" cy="8" r="8" fill="var(--green)" />
    <path d="M4.5 8.2l2.2 2.2 4.8-4.8" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Warn = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden className="mt-[1px] shrink-0">
    <path d="M8 2.7l5.5 9.9H2.5L8 2.7z" fill="currentColor" opacity="0.16" />
    <path d="M8 2.7l5.5 9.9H2.5L8 2.7z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M8 6.6v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="8" cy="11" r="0.75" fill="currentColor" />
  </svg>
);

/* ---------- the snippets ---------- */

function PayrollSummary() {
  /* One figure, its scope, and where it has got to — not a breakdown. The card this
     replaced listed three employer-contribution rows summing to ₹23,27,155, which only
     meant anything while the payroll dashboard sat behind it; with the inbox there now,
     it was three numbers with nothing to reconcile against.

     Net payout, not effective CTC: CTC is what the workforce costs on paper, payout is what
     the run actually moved. This card sits under a headline about operations, and a payroll
     card should state the thing payroll did. ₹3,06,06,678 is the "Net paid" figure from the
     payroll screen the other variation still shows.

     The period is September 2026, not the May the payroll screen used. Every request in the
     queue behind this card is dated September and the sign-off is days away; a payroll card
     four months stale next to them is the kind of thing that unravels on a second look.

     The status is deliberately not "verified and done": the queue behind this card carries
     "Payroll sign-off — Kavya Reddy, due in 8 days". A card claiming payroll was signed off
     while the inbox is still asking for the sign-off is the kind of contradiction a
     prospect notices in a demo. Inputs verified, sign-off outstanding, same eight days. */
  return (
    <Card className="w-[244px]">
      <div className="-mx-4 -mt-4 flex items-center gap-1.5 border-b border-[var(--border)] px-4 pb-2.5 pt-3">
        <span className="text-[12px] font-bold tracking-[-0.01em] text-[var(--ink)]">Payroll</span>
        <span className="text-[8.5px] text-[var(--muted)]">Sep 2026</span>
        <span className="grid h-[13px] w-[13px] shrink-0 place-items-center rounded-full bg-[var(--muted)]/30 text-[7.5px] font-bold leading-none text-white">
          ?
        </span>
      </div>

      <div className="pb-1 pt-3">
        <div className="text-[8.5px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
          Net payout
        </div>
        <div className="mt-[3px] text-[22px] font-bold leading-none tracking-[-0.03em] tabular-nums text-[var(--ink)]">
          ₹3,06,06,678
        </div>
        <div className="mt-[7px] text-[9.5px] leading-[13px] text-[var(--muted)]">
          <span className="font-semibold tabular-nums text-[var(--ink)]">2,040</span> employees ·{" "}
          <span className="font-semibold tabular-nums text-[var(--ink)]">14</span> locations
        </div>
      </div>

      <div className="-mx-4 -mb-4 mt-3 flex items-center justify-between gap-2 border-t border-[var(--border)] bg-[var(--green-soft)] px-4 py-[10px]">
        <span className="flex items-center gap-1.5 text-[9.5px] font-semibold text-[var(--green-deep)]">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
          Inputs verified
        </span>
        <span className="shrink-0 text-[8.5px] text-[var(--green-deep)]/75">Sign-off in 8 days</span>
      </div>
    </Card>
  );
}

/* Replaces the approval-workflow card, which showed a three-step chain ending in a green
   tick. The inbox behind it already demonstrates approvals — ten of them, across seven kinds
   of work — so the card was spending a gutter slot restating the centre screen's point.

   Shift rostering argues the other half of the headline instead. Two plants on different
   patterns (Pune runs three shifts, Chennai two) with overtime falling out of the configured
   rules is "automate the most complex operations" in a form a reader can check at a glance:
   the complexity is visible, and the outcome is one line.

   Pune and Chennai are not arbitrary — the Ask One AI card beside it answers "Which sites
   drive overtime?" with those two. The cards describe one tenant. */
function ShiftOvertime() {
  const sites: [string, string[]][] = [
    ["Pune", ["A", "B", "C"]],
    ["Chennai", ["A", "B"]],
  ];
  return (
    <Card className="w-[244px]">
      <div className="-mx-4 -mt-4 flex items-center gap-1.5 border-b border-[var(--border)] px-4 pb-2.5 pt-3">
        <span className="text-[12px] font-bold tracking-[-0.01em] text-[var(--ink)]">Shift roster</span>
        <span className="text-[8.5px] text-[var(--muted)]">This week</span>
        <span className="grid h-[13px] w-[13px] shrink-0 place-items-center rounded-full bg-[var(--muted)]/30 text-[7.5px] font-bold leading-none text-white">
          ?
        </span>
      </div>

      <div className="pt-2.5">
        {sites.map(([site, shifts]) => (
          <div key={site} className="mb-2 flex items-center justify-between gap-2 last:mb-0">
            <span className="flex min-w-0 items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 text-[var(--green)]">
                <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
                <circle cx="12" cy="10" r="2.4" />
              </svg>
              <span className="truncate text-[10.5px] font-semibold text-[var(--ink)]">{site}</span>
            </span>

            {/* all three letters always show; the ones this site does not run stay outlined,
                which is what makes "different patterns per location" readable at a glance */}
            <span className="flex shrink-0 gap-1">
              {["A", "B", "C"].map((sh) => {
                const on = shifts.includes(sh);
                return (
                  <span
                    key={sh}
                    className={`grid h-[18px] w-[18px] place-items-center rounded-[5px] font-mono text-[9px] font-semibold ${
                      on
                        ? "bg-[var(--green-soft)] text-[var(--green-deep)] ring-1 ring-[var(--green-line)]"
                        : "text-[var(--muted)]/55 ring-1 ring-[var(--border)]"
                    }`}
                  >
                    {sh}
                  </span>
                );
              })}
            </span>
          </div>
        ))}
      </div>

      <div className="-mx-4 -mb-4 mt-3 border-t border-[var(--border)] bg-[var(--green-soft)] px-4 py-[10px]">
        <div className="flex items-center gap-1.5">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 text-[var(--green-deep)]">
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
          <span className="text-[11px] font-bold tracking-[-0.01em] text-[var(--green-deep)]">
            Overtime calculated
          </span>
        </div>
        <div className="mt-[3px] pl-[17px] text-[8.5px] leading-[11px] text-[var(--green-deep)]/75">
          1,284 hrs across 5 shift rules · no manual entry
        </div>
      </div>
    </Card>
  );
}

/* One question carried all the way through: asked, worked, answered. The card used to
   rotate three question/answer pairs, which showed that One AI replies but not that it does
   anything to get there — and "reply" is the cheap half of the claim.

   The research steps are the shipped agent's own, condensed from eight to six: "Learning
   Rules Generator" and "Getting Columns Values" are internal names that mean nothing to a
   prospect and cost two rows each at this size. */
const ASK_PROMPT = "Monthly employee exits, past 12 months?";
const ASK_STEPS = [
  "Elaborate query",
  "Select tables",
  "Validate schema",
  "Select columns",
  "Generate steps",
  "Generate SQL query",
];
/* Twelve months, Oct 2025 to Sep 2026 — the question says "past 12 months", so the series
   has to be twelve and has to end on the month the rest of the mock is in. It ran Sep to May
   before: nine points, ending four months before the demo's own present.

   Counts, not percentages: "employee exits" is a number of people, and the axis, the title
   and the callout all state it the same way. The shape is the point — flat single digits
   through the winter, then the post-appraisal spike in Mar-Apr that every Indian HR team
   recognises, settling back through the monsoon. A smooth curve would read as invented. */
const ATTRITION: [string, number][] = [
  ["Oct", 9], ["Nov", 7], ["Dec", 9], ["Jan", 8], ["Feb", 11], ["Mar", 18],
  ["Apr", 24], ["May", 17], ["Jun", 13], ["Jul", 12], ["Aug", 10], ["Sep", 14],
];
const ASK_TOTAL = ASK_STEPS.length + 1; // steps, then the chart

const CHART_W = 196;
const CHART_H = 54;
const ATTR_MAX = 25;
/* Inset by the dot radius on every side. Plotted edge to edge, the Sep and May points sat
   exactly on the viewBox bounds and their markers were sliced in half, and the Apr peak's
   stroke ran off the top. */
const PAD_X = 3.5;
const PAD_Y = 6;
const ATTR_PTS = ATTRITION.map(([, v], i): [number, number] => [
  PAD_X + (i * (CHART_W - PAD_X * 2)) / (ATTRITION.length - 1),
  CHART_H - PAD_Y - (v / ATTR_MAX) * (CHART_H - PAD_Y * 2),
]);
const ATTR_LINE = ATTR_PTS.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

function useAskFlow() {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(ASK_TOTAL);
      return;
    }
    let id = 0;
    /* the question needs reading time, each step is a glance, the chart is the payoff */
    const dwell = (v: number) => (v === 0 ? 2500 : v <= ASK_STEPS.length ? 430 : 1700);
    const tick = (v: number) => {
      id = window.setTimeout(() => {
        const next = v >= ASK_TOTAL + 1 ? 0 : v + 1;
        setT(next);
        tick(next);
      }, dwell(v));
    };
    tick(0);
    return () => window.clearTimeout(id);
  }, []);
  return t;
}

function AskAI() {
  const t = useAskFlow();

  /* the prompt types itself only on the opening beat; every later beat shows it in full */
  const [typed, setTyped] = useState(ASK_PROMPT.length);
  useEffect(() => {
    if (t !== 0) {
      setTyped(ASK_PROMPT.length);
      return;
    }
    setTyped(0);
    let c = 0;
    const id = window.setInterval(() => {
      c += 1;
      setTyped(c);
      if (c >= ASK_PROMPT.length) window.clearInterval(id);
    }, 42);
    return () => window.clearInterval(id);
  }, [t]);

  const ticked = Math.min(t, ASK_STEPS.length);
  const showChart = t > ASK_STEPS.length;

  return (
    <Card className="w-[244px]">
      <div className="mb-2.5 flex items-center gap-2">
        <span
          className="grid h-6 w-6 place-items-center rounded-lg"
          style={{ background: "linear-gradient(135deg, var(--green), var(--green-deep))" }}
        >
          <img src={hrIcon} alt="" aria-hidden className="h-3 w-auto" style={{ filter: "brightness(0) invert(1)" }} />
        </span>
        <span className="text-[15px] font-bold">Ask One AI</span>
      </div>

      {/* the question, typed */}
      {/* two lines reserved from the first character: the prompt wraps once it is fully
          typed, and letting the box grow mid-type moved everything under it */}
      <div className="flex min-h-[51px] items-start gap-2 rounded-xl border border-[var(--green-line)] bg-white px-3 py-2 text-[12px] leading-[1.35] text-[var(--ink)] shadow-[0_1px_0_rgba(14,90,56,0.04)_inset]">
        <span className="mt-[1px] shrink-0 text-[var(--green)]">✦</span>
        <span className="min-w-0 flex-1">
          {ASK_PROMPT.slice(0, typed)}
          <span
            className="ml-px inline-block h-[13px] w-px translate-y-[2px] bg-[var(--green)]"
            style={{ animation: typed >= ASK_PROMPT.length ? "askblink 1s step-end infinite" : "none" }}
          />
        </span>
      </div>

      {/* One reserve sized to the TALLER state, which is the six-step list at ~121px, not
          the chart at ~85px. Sized to the chart, the card grew 17px every time the research
          ran and shrank again — in a gutter card that reads as a glitch. */}
      <div className="mt-2.5 min-h-[121px]">
        {showChart ? (
          <div className="animate-[askin_260ms_ease-out_both]">
            <div className="flex items-baseline justify-between gap-2">
              <span className="truncate text-[10.5px] font-bold tracking-[-0.01em] text-[var(--ink)]">
                Employee exits
              </span>
              {/* the finding, not just the picture: the latest month, in the same unit as
                  the axis, so the chart says something rather than only showing something */}
              <span className="shrink-0 text-[10.5px] font-bold tabular-nums text-[var(--green)]">
                14 in Sep
              </span>
            </div>
            <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="mt-1.5 w-full" role="img" aria-label="Monthly employee exits, October 2025 to September 2026: 14 exits in September, down from a peak of 24 in April">
              {[0, 0.5, 1].map((g) => (
                <line
                  key={g}
                  x1="0"
                  x2={CHART_W}
                  y1={CHART_H - PAD_Y - g * (CHART_H - PAD_Y * 2)}
                  y2={CHART_H - PAD_Y - g * (CHART_H - PAD_Y * 2)}
                  stroke="var(--border)"
                  strokeWidth="1"
                />
              ))}
              {/* pathLength=1 lets one dash length describe the whole line whatever its real
                  geometry, so the draw reads at the same speed if the series ever changes */}
              <path
                d={ATTR_LINE}
                fill="none"
                stroke="var(--green)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray="1"
                style={{ animation: "askdraw 900ms ease-out both" }}
              />
              {ATTR_PTS.map(([x, y], i) => (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={i === ATTR_PTS.length - 1 ? 2.6 : 1.7}
                  fill="var(--green)"
                  style={{
                    transformOrigin: `${x}px ${y}px`,
                    animation: `askpop 220ms ${180 + (i / (ATTR_PTS.length - 1)) * 760}ms ease-out both`,
                  }}
                />
              ))}
            </svg>
            <div className="mt-[3px] flex justify-between font-mono text-[8px] text-[var(--muted)]">
              {["Oct", "Mar", "Sep"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-1 text-[10px] font-bold tracking-[-0.01em] text-[var(--ink)]">Research</div>
            {ASK_STEPS.map((label, i) => {
              const state = i < ticked ? "done" : i === ticked ? "busy" : "idle";
              return (
                <div key={label} className="flex items-center gap-1.5 py-[2px]">
                  {state === "done" ? (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
                      <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                  ) : (
                    <span
                      className="block h-[9px] w-[9px] shrink-0 rounded-full border-[1.6px] border-[var(--green)]/25"
                      style={
                        state === "busy"
                          ? { borderTopColor: "var(--green)", animation: "askspin 700ms linear infinite" }
                          : undefined
                      }
                    />
                  )}
                  <span
                    className={`truncate text-[10px] leading-[13px] ${
                      state === "idle" ? "text-[var(--muted)]/50" : "text-[var(--ink)]"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}

/* The Action Agent flow, condensed to four turns. The shipped agent asks for six fields in
   one message and the reply runs past two screens; at 192px that is a wall of grey. The
   point a visitor needs is the shape — you ask in a sentence, it comes back filed — so the
   question is one line and the answer is the receipt. */
const AGENT_TURNS = [
  { who: "user" as const, text: "Apply Leave" },
  { who: "agent" as const, text: "Sure! I can help with that 😊 Which leave type and dates?" },
  { who: "user" as const, text: "Casual leave, 21 Sep" },
  { who: "agent" as const, receipt: true },
];

/* The agent's quick actions. The shipped screen offers eight; these six are the ones that
   carry the breadth claim — leave, attendance, on-duty, expense and helpdesk are five
   different corners of HR reachable from one prompt. Short Leave and Restricted Holiday are
   left out as near-duplicates of Apply Leave at this size. */
const AGENT_CHIPS: [string, string][] = [
  ["Apply Leave", "cal"],
  ["Helpdesk", "help"],
  ["Mark Attendance", "punch"],
  ["On Duty", "duty"],
  ["Raise Expense", "money"],
  ["Attendance Regularization", "calAlert"],
];

const ChipIcon = ({ kind }: { kind: string }) => (
  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
    {(kind === "cal" || kind === "calAlert") && (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2.5" />
        <path d="M8 2.5v4M16 2.5v4M3 10h18" />
        {kind === "calAlert" && <path d="M12 13.5v3M12 19v.01" />}
      </>
    )}
    {kind === "help" && (
      <>
        <circle cx="9.5" cy="8" r="3.5" />
        <path d="M3 20a6.5 6.5 0 0 1 11-4.7" />
        <circle cx="17.5" cy="16.5" r="3" />
        <path d="m20 19 2 2" />
      </>
    )}
    {kind === "punch" && <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5M10 17l5-5-5-5M15 12H3" />}
    {kind === "duty" && (
      <>
        <circle cx="9" cy="7.5" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 10-5.5" />
        <circle cx="17" cy="16" r="4.5" />
        <path d="M17 14v2.2l1.4 1" />
      </>
    )}
    {kind === "money" && (
      <>
        <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
        <circle cx="12" cy="12" r="2.6" />
      </>
    )}
  </svg>
);

/* Self-driving rather than scroll-driven: the phone sits in a gutter that may never cross
   a scroll threshold on a short screen, and a conversation that only advances when the page
   moves reads as broken. Two ticks of dwell at the end before it starts over. */
function useAgentFlow(turns: number) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(turns);
      return;
    }
    /* Per-step timing rather than one interval. The opening frame is the only one with
       anything to read — the agent's name, what it does, and six quick actions — and at a
       flat 1450ms it was gone before any of that landed. It holds about two and a half
       beats; the turns themselves are a few words each and register immediately. */
    let id = 0;
    const dwell = (v: number) => (v === 0 ? 3600 : 1450);
    const tick = (v: number) => {
      id = window.setTimeout(() => {
        const next = v >= turns + 2 ? 0 : v + 1;
        setStep(next);
        tick(next);
      }, dwell(v));
    };
    tick(0);
    return () => window.clearTimeout(id);
  }, [turns]);
  return Math.min(step, turns);
}

const AgentMark = ({ size = 20 }: { size?: number }) => (
  /* the rail's own One AI spark, on the product's brand green */
  <span
    className="grid shrink-0 place-items-center rounded-full"
    style={{ height: size, width: size, background: APP_BRAND }}
  >
    <img src={navOneAi} alt="" aria-hidden style={{ height: size * 0.55, width: size * 0.55 }} />
  </span>
);

function PhoneOneAiLeave() {
  const shown = useAgentFlow(AGENT_TURNS.length);

  return (
    /* Bezel is a pale warm alloy rather than near-black: on a cream page the only
       pure-dark object steals the eye from the product behind it. The hairline
       border + inset highlight are what keep it reading as a device. */
    <div
      className="relative w-[186px] rounded-[33px] border border-[var(--border)] p-[7px] shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_14px_32px_-20px_rgba(11,74,46,0.22),0_3px_8px_-6px_rgba(11,74,46,0.12)]"
      style={{ background: "linear-gradient(150deg, #f3efe5, #ded9cb 55%, #ebe6da)" }}
    >
      {/* side buttons — soft grooves, not hard black bars */}
      <span className="absolute -left-[1.5px] top-[90px] h-9 w-[2.5px] rounded-l bg-[var(--ink)]/18" />
      <span className="absolute -left-[1.5px] top-[126px] h-9 w-[2.5px] rounded-l bg-[var(--ink)]/18" />
      <span className="absolute -right-[1.5px] top-[95px] h-14 w-[2.5px] rounded-r bg-[var(--ink)]/18" />

      <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[26px] bg-[var(--panel)] shadow-[0_0_0_1px_rgba(20,40,25,0.12)]">
        {/* screen gloss */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[26px]"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.35), transparent 32%)" }}
        />
        {/* dynamic island */}
        <div className="absolute left-1/2 top-[6px] z-20 h-[18px] w-[58px] -translate-x-1/2 rounded-full bg-[var(--ink)]/70" />

        {/* status bar — sized to clear the island. At a 192px screen width the whole
            right cluster gets ~48px, so it carries icons only: the battery cell already
            shows its level, and a "86" numeral beside it was the thing pushing the row
            under the island. */}
        <div className="flex items-center justify-between px-4 pt-[11px] text-[9.5px] font-semibold text-[var(--ink)]/70">
          <span className="tabular-nums tracking-[0.01em]">8:58</span>
          <span className="flex items-center gap-[3px]">
            {/* signal: 4 stepped bars on a shared baseline, last one dimmed */}
            <svg width="12" height="8" viewBox="0 0 12 8" aria-hidden className="shrink-0">
              {[
                [0, 5, 2],
                [3.1, 3.6, 3.4],
                [6.2, 2.2, 4.8],
                [9.3, 0.8, 6.2],
              ].map(([x, y, h], i) => (
                <rect key={x} x={x} y={y} width="2.1" height={h} rx="0.9" fill="currentColor" opacity={i === 3 ? 0.3 : 1} />
              ))}
            </svg>

            {/* wifi: stroked arcs at a weight that matches the bars */}
            <svg width="11" height="8" viewBox="0 0 11 8" aria-hidden className="shrink-0">
              <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                <path d="M0.9 2.9a6.8 6.8 0 0 1 9.2 0" />
                <path d="M2.8 4.8a3.9 3.9 0 0 1 5.4 0" />
              </g>
              <circle cx="5.5" cy="6.8" r="0.95" fill="currentColor" />
            </svg>

            {/* battery: body + nub, fill is the actual 86% of the inner track */}
            <svg width="19" height="9" viewBox="0 0 19 9" aria-hidden className="shrink-0">
              <rect x="0.5" y="0.5" width="16" height="8" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.45" />
              <path d="M17.5 3.2v2.6a1.5 1.5 0 0 0 0-2.6Z" fill="currentColor" opacity="0.45" />
              <rect x="1.9" y="1.9" width="11.35" height="5.2" rx="1.2" fill="var(--green)" />
            </svg>
          </span>
        </div>

        {/* App header, matched to the shipped agent screen: menu, the agent's name with its
            switcher, the Beta tag and compose. */}
        <div className="flex shrink-0 items-center gap-1.5 border-b border-[var(--border)] px-2.5 py-[7px]">
          <span className="flex shrink-0 flex-col gap-[2.5px]" aria-hidden>
            {[0, 1, 2].map((d) => (
              <span key={d} className="block h-[1.5px] w-[11px] rounded-full bg-[var(--ink)]/70" />
            ))}
          </span>
          <span className="truncate text-[10px] font-bold tracking-[-0.01em] text-[var(--ink)]">Action Agent</span>
          <svg width="8" height="8" viewBox="0 0 12 12" aria-hidden className="shrink-0 text-[var(--ink)]/60">
            <path d="M3 4.5 6 7.5l3-3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="flex-1" />
          {/* mint, not the shipped lavender — the page has no purple left in it */}
          <span className="shrink-0 rounded-full bg-[var(--green-soft)] px-1.5 py-[1px] text-[7px] font-semibold text-[var(--green-deep)]">
            Beta
          </span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 text-[var(--ink)]/70">
            <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z" />
          </svg>
        </div>

        {/* the conversation — anchored to the bottom so the newest turn is always the one
            in frame, the way a chat that has scrolled looks */}
        {/* justify-end still, so the newest turn is the one in frame — but the turns are now
            large enough that by the receipt the thread fills the screen instead of sitting
            as a small block under a field of white */}
        <div className="flex min-h-0 flex-1 flex-col justify-end gap-[7px] overflow-hidden px-2.5 py-2">
          {shown === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-1.5 text-center">
              <AgentMark size={30} />
              <div className="text-[11px] font-bold tracking-[-0.01em] text-[var(--ink)]">Action Agent</div>
              <p className="px-1 text-[8px] leading-[1.4] text-[var(--muted)]">
                OneAI takes care of all your requests — quick, easy, and hassle-free
              </p>
              {/* wrapped rather than stacked: six stacked rows would push the composer off
                  the screen, and the shipped agent flows them the same way */}
              <div className="mt-1 flex w-full flex-wrap justify-center gap-[3px]">
                {AGENT_CHIPS.map(([label, kind]) => (
                  <span
                    key={label}
                    className="flex items-center gap-[3px] rounded-[6px] border border-[var(--border)] px-[5px] py-[4px] text-[7px] font-medium leading-none text-[var(--ink)]"
                  >
                    <ChipIcon kind={kind} />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            AGENT_TURNS.slice(0, shown).map((t, i) =>
              t.who === "user" ? (
                <div key={i} className="flex shrink-0 items-start justify-end gap-1.5">
                  <span className="max-w-[126px] rounded-[9px] rounded-tr-[3px] bg-[#eceff0] px-2 py-[6px] text-[9.5px] leading-[1.3] text-[var(--ink)]">
                    {t.text}
                  </span>
                  <span className="block h-[17px] w-[17px] shrink-0 overflow-hidden rounded-full ring-1 ring-[var(--border)]">
                    <img src={avatarAnanya} alt="" aria-hidden className="h-full w-full scale-[1.3] object-cover" />
                  </span>
                </div>
              ) : (
                <div key={i} className="flex shrink-0 items-start gap-1.5">
                  <AgentMark size={17} />
                  {t.receipt ? (
                    <div className="min-w-0 flex-1 rounded-[9px] rounded-tl-[3px] border border-[var(--border)] px-2 py-[6px]">
                      <div className="text-[10px] font-bold leading-[1.3] text-[var(--ink)]">
                        Leave request submitted 🎉
                      </div>
                      {[
                        ["Type", "Casual Leave"],
                        ["Date", "21 Sep 2026"],
                        ["Duration", "Full Day"],
                      ].map(([k, v]) => (
                        <div key={k} className="mt-[3px] flex items-baseline justify-between gap-1 text-[8.5px] leading-[11px]">
                          <span className="shrink-0 text-[var(--muted)]">{k}</span>
                          <span className="truncate font-medium text-[var(--ink)]">{v}</span>
                        </div>
                      ))}
                      <div className="mt-[5px] border-t border-[var(--border)] pt-[5px] text-[8px] leading-[11px] text-[var(--muted)]">
                        With Priya Shah · balance now <span className="font-semibold text-[var(--ink)]">12.0</span>
                      </div>
                    </div>
                  ) : (
                    <span className="max-w-[132px] rounded-[9px] rounded-tl-[3px] bg-[var(--green-soft)] px-2 py-[6px] text-[9.5px] leading-[1.3] text-[var(--ink)]">
                      {t.text}
                    </span>
                  )}
                </div>
              ),
            )
          )}
        </div>

        {/* composer */}
        <div className="flex shrink-0 items-center gap-1.5 border-t border-[var(--border)] px-2.5 py-[7px]">
          <span className="flex-1 truncate text-[8.5px] text-[var(--muted)]">Ask anything</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 text-[var(--ink)]/60">
            <rect x="9" y="2.5" width="6" height="11" rx="3" />
            <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
          </svg>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0" style={{ color: APP_BRAND }}>
            <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12 2-12 2z" />
          </svg>
        </div>

        {/* home indicator */}
        <div className="flex justify-center pb-2 pt-1">
          <span className="h-[3px] w-[68px] rounded-full bg-[var(--ink)]/25" />
        </div>
      </div>
    </div>
  );
}

/* ---------- main dashboard (chrome matched to HROne product) ---------- */


/* The inbox screen the hero now shows.

   The queue is mixed on purpose. Filtered to Confirmation it read "Confirmation request
   for…" nine times down one column, which proves HROne does one thing a lot — the opposite
   of a headline about the whole of HR landing in one place. Leave, expense, onboarding,
   attendance, recruitment, payroll and performance in one screenshot is the claim itself.

   The category column then has to hold exactly the categories the rows belong to: a Leave
   row under a column with no Leave entry contradicts itself. That is also what brings the
   column down from 17 entries to 11 — the density fix and the coherence fix are the same
   edit. "All" is selected, which is what makes the All Messages chip above the list true.

   Counts stay small and still sum to the group header.

   Ordered by HROne's own module sequence — Core HR, Recruitment, Workforce, Time Office,
   Payroll, Expense, Performance, Engagement, Asset, Helpdesk — rather than alphabetically,
   so the column reads in the order the product is sold in. Each row sits under the module
   it belongs to:

     Core HR      On boarding, Confirmation, Final clearance — and in lifecycle order
                  within that, joining then confirmation then exit, which is also roughly
                  descending importance
     Recruitment  Recruitment
     Time Office  Leave, then Attendance (the module is billed "leave & attendance", and
                  Leave is the heaviest queue at 14)
     Payroll      Payroll
     Expense      Expense
     Performance  Performance
     Asset        Manage asset

   Alphabetical put "Attendance" first and buried On boarding and Payroll in the middle,
   which is an ordering the product does not use anywhere else. */
const INBOX_NEW = 76;
const INBOX_GROUPS: [string, string][] = [
  ["All", ""],
  ["On boarding", "8"],
  ["Confirmation", "12"],
  ["Final clearance", "4"],
  ["Recruitment", "7"],
  ["Leave", "14"],
  ["Attendance", "9"],
  ["Payroll", "6"],
  ["Expense", "9"],
  ["Performance", "5"],
  ["Manage asset", "2"],
];

/* subject, received, days until due, and the category chip the row carries — the chip has
   to come from the row now that the rows are not all the same kind of work */
/* The employee id sits on the meta line, not in the subject. In the shipped product the
   subject carries it and the column truncates it away ("…(#BCPL…"), which is authentic but
   reads as sloppy at hero size — and the id is the part that gets cut. Moving it down keeps
   the record identifiable, lets every subject set in full, and is what allows the list to
   take the narrow share of the width it has in the real screen.

   The category chip under each row already states the type, so the subject does not repeat
   it ("Regularisation" under an "Attendance" chip, not "Attendance regularisation"). */
/* Same module sequence as the column beside it: Core HR (confirmation, final clearance),
   Recruitment, Time Office (leave, attendance), Payroll, Expense, Performance, Asset. The
   two read in one order instead of two.

   Nine rows, not ten — the onboarding request came out, which moves Performance up into
   the visible run. The On boarding category stays in the column with its count of 8: the
   list is one page of 76, so a category having nothing on this page is normal.

   The timestamps were re-stamped to run newest-first down that order. Reordering the rows
   alone would have left the dates jumping 15/09, 14/09, 12/09, 14/09 — a list that looks
   sorted by nothing, which reads as a bug rather than as a sort. Due-in values stay with
   their rows: an SLA belongs to the kind of request, not to when it arrived. */
const MESSAGES: [string, string, string, string][] = [
  ["Confirmation request — Rahul Verma", "#AVK10266 · 15/09, 2:26 PM", "19", "Confirmation"],
  ["Full & final — Arjun Mehta", "#AVK10260 · 15/09, 11:05 AM", "6", "Final clearance"],
  ["Offer approval — Sneha Kulkarni", "#AVK10261 · 14/09, 6:40 PM", "5", "Recruitment"],
  ["Leave approval — Priya Nair", "#AVK10265 · 14/09, 9:12 AM", "2", "Leave"],
  ["Regularisation — Vikram Iyer", "#AVK10262 · 13/09, 4:55 PM", "3", "Attendance"],
  ["Payroll sign-off — Kavya Reddy", "#AVK10259 · 12/09, 2:20 PM", "8", "Payroll"],
  ["Expense ₹12,400 — Rohan Deshmukh", "#AVK10264 · 12/09, 11:48 AM", "4", "Expense"],
  ["Goal check-in — Divya Menon", "#AVK10257 · 11/09, 5:02 PM", "11", "Performance"],
  ["Asset handover — Imran Sheikh", "#AVK10258 · 11/09, 10:30 AM", "9", "Manage asset"],
];

const Tick = () => (
  <span className="mt-[1px] block h-[7px] w-[7px] shrink-0 rounded-[1.5px] border border-[#c9c9c9]" />
);

/* The rail's icon assets were exported in whatever state they happened to be in: analytics
   at #BAE8D5 because it was the selected tab in the source file, payroll at #D4D4D4, inbox
   at pure white, the other ten at #F0F5F2. With the active row moved to Inbox, analytics
   was left glowing mint next to an untinted Inbox — the rail read as though Analytics were
   still open. Flattening every icon to white makes the row's background tint the only thing
   that says "active", which is what it should have been.

   Done here rather than in the SVGs: imports/v1/nav is shared with option-a, and recolouring
   the files would change that page too. One AI opts out — its mark is a brand gradient. */
const RAIL_ICON = { filter: "brightness(0) invert(1)" } as const;

/* ---------- the desk demo ----------

   A pointer works through two requests and stops. What separates this from the stock
   "watch the cursor" loop is mostly restraint:

   - a real macOS arrow at its real size, not a cartoon hand
   - travel eases out and settles; it never moves at constant speed
   - a beat of hesitation before each click, because people hesitate
   - the button takes the press (dips and darkens) before anything happens
   - the result is the state the product would actually show — a resolved band, a row
     ticking off, counters dropping by one — not a celebration
   - it ends, holds, and starts over rather than running continuously

   Under prefers-reduced-motion it does not run at all; the screen sits in its opening
   state, which is a complete composition on its own. */

type Step = {
  at: "confirm" | "row" | "approve" | null;
  press?: boolean;
  open: "confirm" | "offer";
  done: string[];
  ms: number;
};

const DEMO: Step[] = [
  { at: null, open: "confirm", done: [], ms: 1200 },
  { at: "confirm", open: "confirm", done: [], ms: 880 },
  { at: "confirm", press: true, open: "confirm", done: [], ms: 170 },
  { at: "confirm", open: "confirm", done: ["Confirmation"], ms: 1500 },
  { at: "row", open: "confirm", done: ["Confirmation"], ms: 780 },
  { at: "row", press: true, open: "confirm", done: ["Confirmation"], ms: 170 },
  { at: "row", open: "offer", done: ["Confirmation"], ms: 820 },
  { at: "approve", open: "offer", done: ["Confirmation"], ms: 700 },
  { at: "approve", press: true, open: "offer", done: ["Confirmation"], ms: 170 },
  { at: "approve", open: "offer", done: ["Confirmation", "Recruitment"], ms: 1900 },
  { at: null, open: "offer", done: ["Confirmation", "Recruitment"], ms: 700 },
];

function useDeskDemo() {
  const [i, setI] = useState(0);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    let id = 0;
    const tick = (v: number) => {
      id = window.setTimeout(() => {
        const next = (v + 1) % DEMO.length;
        setI(next);
        tick(next);
      }, DEMO[v].ms);
    };
    tick(0);
    return () => window.clearTimeout(id);
  }, []);
  return reduced ? DEMO[0] : DEMO[i];
}

/* The system arrow, drawn rather than imported so it inherits the mock's own scale. */
const Pointer = () => (
  <svg width="15" height="18" viewBox="0 0 15 18" fill="none" aria-hidden>
    <path d="M1.2 1 1.2 15.2 4.9 11.8 7.2 16.9 9.4 15.9 7.1 10.9 12 10.6z" fill="#fff" stroke="#1d1d1f" strokeWidth="1.1" strokeLinejoin="round" />
  </svg>
);

type RecordDef = {
  kind: string;
  subject: string;
  to: string;
  due: string;
  pill: string;
  ask: string;
  who: string;
  avatar?: string;
  initials?: string;
  meta: string[];
  primary: string;
  secondary: string;
  resolved: string;
  /* Three lines, three jobs. The status word lives on the pill and nowhere else: the
     headline says what now holds true for the person, the band says what the system did,
     and its second line says what followed. "Confirmed. Nothing left to do." said the same
     word as the pill above it and the band below it, three times in one card, and the only
     new information in it was that there was none. */
  resolvedHeadline: string;
  resolvedNote: string;
  resolvedMeta: string;
};

const RECORDS: Record<"confirm" | "offer", RecordDef> = {
  confirm: {
    kind: "Confirmation",
    subject: "Confirmation request — Rahul Verma (#AVK10266)",
    to: "Rajnikant A Rao",
    due: "Due date : 05/10/2026",
    pill: "Due in : 19 days",
    ask: "Probation complete. Confirm Rahul?",
    who: "Rahul Verma (#AVK10266)",
    avatar: avatarUser,
    meta: ["Assistant Manager, Finance & Accounts", "Band A · Mumbai", "Confirmation Date : 10/10/2026"],
    primary: "Confirm",
    secondary: "Extend probation",
    resolved: "Confirmed",
    resolvedHeadline: "Rahul is confirmed from 10 Oct.",
    resolvedNote: "Confirmation letter sent",
    resolvedMeta: "Payroll updated · probation closed",
  },
  offer: {
    kind: "Recruitment",
    subject: "Offer approval — Sneha Kulkarni (#AVK10261)",
    to: "Rajnikant A Rao",
    due: "Due date : 21/09/2026",
    pill: "Due in : 5 days",
    ask: "Offer ready. Approve for Sneha?",
    who: "Sneha Kulkarni (#AVK10261)",
    /* initials, not a photo: the three faces this project has are already spoken for, and
       reusing one would put the same person under two names on one screen */
    initials: "SK",
    meta: ["Senior Analyst, Finance & Accounts", "Band B · Pune", "CTC ₹18,00,000 · joins 06/10/2026"],
    primary: "Approve offer",
    secondary: "Send back to recruiter",
    resolved: "Approved",
    resolvedHeadline: "Offer is out with Sneha.",
    resolvedNote: "Offer letter released",
    resolvedMeta: "Joins 06/10/2026 · onboarding queued",
  },
};

/* the mock's own coordinate space — `w-full max-w-[880px]` on the wrapper */
const MOCK_W = 880;

function Dashboard() {
  const step = useDeskDemo();
  const rec = RECORDS[step.open];
  const isDone = step.done.includes(rec.kind);

  const root = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLSpanElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const approveRef = useRef<HTMLSpanElement>(null);
  const [pt, setPt] = useState<{ x: number; y: number } | null>(null);

  /* Measured from the live DOM rather than hardcoded, then divided back through the mock's
     current scale so the coordinates land in its own 880-wide space. The product is scaled
     by the page as it reveals, and an offset taken straight off the screen would drift. */
  useLayoutEffect(() => {
    const el =
      step.at === "confirm"
        ? confirmRef.current
        : step.at === "row"
          ? rowRef.current
          : step.at === "approve"
            ? approveRef.current
            : null;
    /* Only a step with no target hides the pointer. The button it just pressed is replaced
       by the resolved band, so its ref goes null the instant the click lands — clearing the
       position there made the pointer blink out mid-sequence. It holds its last position
       instead, which is also what a real one does: it stays where you left it. */
    if (!root.current || (!el && step.at !== null)) return;
    if (!el) {
      setPt(null);
      return;
    }
    const r = root.current.getBoundingClientRect();
    const k = r.width / MOCK_W || 1;
    const t = el.getBoundingClientRect();
    setPt({ x: (t.left + t.width * 0.5 - r.left) / k, y: (t.top + t.height * 0.5 - r.top) / k });
  }, [step]);

  return (
    <div ref={root} className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[0_18px_44px_-26px_rgba(11,74,46,0.3)]">
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

      {/* ── app shell, matched to the Figma node ─────────────────────────────
          Topbar spans the full width at 48px with the L0 rail below it at 200px,
          which is how the design stacks them. Item metrics are the design's own:
          32px rows, 12px/px-12 padding, 6px radius, 16px icons, 12px labels on
          #f0f5f2, the active row on #013226, and Settings pinned under a
          rgba(230,247,240,0.2) rule. */}
      <div className="flex h-10 shrink-0 items-center justify-between px-3" style={{ background: APP_SHELL }}>
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex h-7 w-5 items-center justify-center rounded-md">
            <img src={navHome} alt="" aria-hidden className="h-[13px] w-[13px]" />
          </span>
          {/* the design's placeholder company reads as the tenant; the rest of the
              mock is Aarvik Group, so it carries that name through. "Group" rather
              than a Pvt. Ltd. suffix: a group spans entities, which is the
              multi-entity story the rest of the page is making. */}
          <p className="truncate text-[12px] font-medium leading-4 text-white">Aarvik Group</p>
        </div>

        {/* A solid white field on the dark bar reads as a hole punched in the header.
            The other variations sit the search *in* the bar as a translucent well,
            which is what this follows. The Figma icons are exported dark for a white
            input, so they are inverted to sit on the tint rather than swapped out. */}
        <div className="mx-auto flex min-w-0 max-w-[288px] flex-1 items-center gap-1.5 px-3">
          <div className="flex h-7 min-w-0 flex-1 items-center gap-1.5 rounded-lg bg-white/12 px-2.5 text-[9.5px] text-white/70 ring-1 ring-white/10">
            <img
              src={navSearch}
              alt=""
              aria-hidden
              className="h-3 w-3 shrink-0 opacity-75"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <span className="min-w-0 flex-1 truncate">Type a command or search</span>
            <span className="shrink-0 rounded bg-white/15 px-1 py-[1px] text-[8px] leading-[12px] text-white/70">⌘K</span>
          </div>
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/12 ring-1 ring-white/10">
            <img
              src={navOrgChart}
              alt=""
              aria-hidden
              className="h-[13px] w-[13px] opacity-75"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <span className="flex h-7 items-center justify-center rounded-md px-2">
            <img src={navTopA} alt="" aria-hidden className="h-[13px] w-[13px]" />
          </span>
          <span className="flex h-7 items-center justify-center rounded-md px-2">
            <img src={navTopB} alt="" aria-hidden className="h-[13px] w-[13px]" />
          </span>
          <span className="ml-1 block h-[26px] w-[26px] shrink-0 overflow-hidden rounded-full ring-1 ring-white/25">
            <img
              src={avatarTopbar}
              alt=""
              aria-hidden
              className="h-full w-full object-cover"
              /* Framed to match the two approval-card avatars: chin above the edge
                 with a sliver of collar under it, not a head-only crop.

                 Measured off the source — hair top 4%, jaw 85%, sweater from 86% —
                 so the crop window has to run ~2% to ~92% to clear the hair and
                 still show collar. With transform order scale(S) translateY(t) the
                 window is 1/S tall and centred at 0.5 - t, which gives S 1.11 and
                 t 3%. Zooming past this cuts the collar off at the jaw, because
                 this portrait has almost no neck between beard and sweater. */
              style={{ transform: "scale(1.11) translateY(3%)" }}
            />
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* L0 rail */}
        {/* Icon-only, 44px against the 140px it was. The labelled rail spent 19% of an
            880px mock on navigation a hero reader never needs to read — the shipped product
            uses a 56px icon strip for exactly that reason. The 96px comes back to the three
            panels that carry the argument. */}
        <div className="flex w-[44px] shrink-0 flex-col justify-between overflow-hidden" style={{ background: APP_SHELL }}>
          <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden px-1.5 pt-2.5">
            <div className="flex flex-col border-b border-[rgba(230,247,240,0.2)] pb-2.5">
              {[
                [navInbox, "Inbox"],
                [navRequest, "Request"],
                [navTeams, "Teams"],
                [navProjects, "Projects"],
                [navOneAi, "One AI"],
                [navMySpace, "My space"],
              ].map(([icon, label]) => (
                /* Inbox carries the active tint now: the screen beside it is the inbox, and
                   a rail highlighting Analytics while an inbox is open reads as a mistake. */
                <div
                  key={label as string}
                  title={label as string}
                  className={`grid h-7 place-items-center rounded-[5px] ${
                    label === "Inbox" ? "bg-[#013226]" : ""
                  }`}
                >
                  <img
                    src={icon as string}
                    alt=""
                    aria-hidden
                    className="h-[14px] w-[14px] shrink-0"
                    style={label === "One AI" ? undefined : RAIL_ICON}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1 pb-2">
              <div className="mx-auto h-px w-4 bg-[rgba(230,247,240,0.25)]" aria-hidden />
              <div className="flex flex-col">
                {[
                  [navHrDesk, "HR Desk"],
                  [navRecruitment, "Recruitment"],
                  [navWorkforce, "Workforce"],
                  [navTimeoffice, "Timeoffice"],
                  [navPayroll, "Payroll"],
                  [navPerformance, "Performance"],
                  [navAnalytics, "Analytics"],
                ].map(([icon, label]) => (
                  /* nothing active in APPS — the open screen is Inbox, above */
                  <div key={label as string} title={label as string} className="grid h-7 place-items-center rounded-[5px]">
                    <img src={icon as string} alt="" aria-hidden className="h-[14px] w-[14px] shrink-0" style={RAIL_ICON} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col border-t border-[rgba(230,247,240,0.2)] px-1.5 pb-2.5 pt-2.5">
            <div title="Settings" className="grid h-7 place-items-center rounded-[5px]">
              <img src={navSettings} alt="" aria-hidden className="h-[14px] w-[14px] shrink-0" style={RAIL_ICON} />
            </div>
          </div>
        </div>

        {/* L1 — the inbox's own queue list. Same panel pattern the sub-nav used (titled
            header over a rule, then rows), so swapping the screen does not swap the
            shell's grammar. 150px rather than 140: the longest label here is "Declare
            statutory details" against the old "Payroll". */}
        {/* 108px. Measured, not guessed: the widest row is "Final clearance" plus its count
            at 90px including padding, so 150 was 59px of dead gap down the middle of every
            row — width spent on nothing under a headline that says "Simplest". */}
        <div className="flex w-[108px] shrink-0 flex-col overflow-hidden border-r border-[#e5e5e5] bg-white">
          <div className="flex h-8 shrink-0 items-center justify-between gap-1 border-b border-[#e5e5e5] px-2">
            <p className="truncate text-[10px] font-bold text-[#171717]">Inbox</p>
            <img src={navCollapse} alt="" aria-hidden className="h-[11px] w-[11px] shrink-0" />
          </div>

          <div className="flex h-[22px] shrink-0 items-center gap-1 px-2">
            <img src={navInbox} alt="" aria-hidden className="h-[9px] w-[9px] shrink-0 opacity-70" />
            <span className="flex-1 truncate text-[9px] font-semibold text-[var(--app-brand)]">
              New- {INBOX_NEW - step.done.length}
            </span>
            {/* the design's chevron, turned down for the open group */}
            <img src={navChevron} alt="" aria-hidden className="h-[9px] w-[9px] shrink-0 rotate-90 opacity-50" />
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {INBOX_GROUPS.map(([label, count]) => {
              const active = label === "All";
              return (
                <div
                  key={label}
                  className={`flex h-[26px] shrink-0 items-center gap-1 px-2 ${
                    active ? "bg-[#e9f2ec]" : ""
                  }`}
                >
                  <span
                    className={`min-w-0 flex-1 truncate text-[9px] leading-none ${
                      active ? "font-semibold text-[var(--app-brand)]" : "text-[#404040]"
                    }`}
                  >
                    {label}
                  </span>
                  {/* a resolved request leaves its category too — a total that drops while
                      the categories hold still is the tell that nothing really happened */}
                  <span
                    className={`shrink-0 text-[9px] font-semibold leading-none tabular-nums ${
                      active ? "text-[var(--app-brand)]" : "text-[#737373]"
                    }`}
                  >
                    {count && step.done.includes(label) ? String(Number(count) - 1) : count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* L2 — the message list. Its own column rather than part of the content pane:
            the queue has to stay put while a request is open beside it, which is the whole
            reason an inbox reads differently from a dashboard. */}
        {/* Column widths follow the real product's proportions rather than whatever the
            subjects happened to need. Beside its rail, the shipped screen splits roughly
            10 / 22 / 67 between categories, list and the open record; this was running
            20 / 39 / 40, so the list was close to twice its share and the record — the
            thing the screen is actually about — had less room than the queue.

            With the rail at 44px, 108 / 250 / 478 of the remaining 836 is about 13 / 30 / 57. Not the shipped ratio: our rail
            is a 140px labelled one against their 56px icon strip, and type here has a
            legibility floor the real screen does not have at 1920. But the record pane is
            now more than twice the queue, which is the point. */}
        <div className="flex w-[250px] shrink-0 flex-col overflow-hidden border-r border-[#e5e5e5] bg-white">
          <div className="flex h-8 shrink-0 items-center gap-1.5 border-b border-[#e5e5e5] px-2">
            <Tick />
            <span className="flex items-center gap-1 rounded-[5px] border border-[#e5e5e5] px-1.5 py-[2px] text-[8.5px] font-medium text-[#171717]">
              All Messages
              <svg width="7" height="7" viewBox="0 0 12 12" aria-hidden className="text-[#737373]">
                <path d="M1.5 3h9M3 6h6M4.5 9h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </span>
            <span className="flex-1" />
            {[0, 1].map((i) => (
              <svg key={i} width="9" height="9" viewBox="0 0 12 12" aria-hidden className="shrink-0 text-[#8a8a8a]">
                {i === 0 ? (
                  <path d="M1.5 2.5h9M3 6h6M4.5 9.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                ) : (
                  <path d="M1.8 3.2h8.4v6.2H1.8zM1.2 2h9.6v1.2H1.2z" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
                )}
              </svg>
            ))}
            <img src={navSearch} alt="" aria-hidden className="h-[9px] w-[9px] shrink-0 opacity-60" />
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {/* The selected row follows the open record, not the top of the list. Rahul's
                confirmation is what the pane on the right shows, and it sits second now that
                the queue runs in module order — highlighting row 0 regardless would have the
                list and the record disagree about what is open. */}
            {MESSAGES.map(([title, when, due, kind]) => {
              const rowDone = step.done.includes(kind);
              const open = kind === rec.kind;
              return (
                <div
                  key={title + when}
                  ref={kind === "Recruitment" ? rowRef : undefined}
                  className={`shrink-0 border-b border-[#eeeeee] px-2 py-[7px] transition-colors duration-300 ${
                    open ? "bg-[#f1f7f3]" : ""
                  } ${step.press && step.at === "row" && kind === "Recruitment" ? "bg-[#e9f2ec]" : ""}`}
                >
                  <div className="flex items-start gap-1.5">
                    {/* the checkbox becomes the tick — the row is how the queue shows the
                        work leaving it, and it is the half of the click most demos forget */}
                    {rowDone ? (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--app-brand)" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-[2px] shrink-0">
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                    ) : (
                      <Tick />
                    )}
                    <p
                      className={`min-w-0 flex-1 truncate text-[9px] font-semibold leading-[12px] transition-colors duration-300 ${
                        rowDone ? "text-[#9a9a9a]" : "text-[#171717]"
                      }`}
                    >
                      {title}
                    </p>
                  </div>
                  <p className="mt-[2px] pl-[13px] text-[7.5px] leading-[10px] text-[#8a8a8a]">{when}</p>
                  <div className="mt-[5px] flex items-center justify-between pl-[13px]">
                    <span className="text-[7.5px] font-medium text-[var(--app-brand)]">{kind}</span>
                    <span
                      className={`text-[7.5px] font-medium uppercase tracking-[0.02em] ${
                        rowDone ? "text-[var(--app-brand)]" : "text-[#737373]"
                      }`}
                    >
                      {rowDone ? "Done" : `Due in : ${due} days`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── the open request ─────────────────────────────────────────────────── */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
          <div className="flex shrink-0 items-start justify-between gap-3 px-3 pb-2 pt-2.5">
            <div className="min-w-0">
              <p className="text-[9px] font-bold leading-[12px] text-[#171717]">{rec.subject}</p>
              <p className="mt-[5px] text-[7.5px] leading-[11px] text-[#8a8a8a]">
                From : <span className="text-[#404040]">System</span>
              </p>
              <p className="text-[7.5px] leading-[11px] text-[#8a8a8a]">
                To : <span className="text-[#404040]">{rec.to}</span>
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-2">
              <p className="whitespace-nowrap text-[7.5px] font-semibold text-[#404040]">{rec.due}</p>
              <div className="flex items-center gap-1.5 rounded-[6px] border border-[#ededed] px-1.5 py-1">
                {["comment", "add", "reply", "forward", "chart", "more"].map((k) => (
                  <svg key={k} width="9" height="9" viewBox="0 0 14 14" aria-hidden className="text-[#6b6b6b]" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    {k === "comment" && <path d="M12 8.5a1.5 1.5 0 0 1-1.5 1.5H4.5L2 12V3.5A1.5 1.5 0 0 1 3.5 2h7A1.5 1.5 0 0 1 12 3.5z" />}
                    {k === "add" && <><rect x="2" y="2" width="10" height="10" rx="2" /><path d="M7 5v4M5 7h4" /></>}
                    {k === "reply" && <path d="M6 3 2.5 6.5 6 10M2.5 6.5h5A4 4 0 0 1 11.5 10.5v1" />}
                    {k === "forward" && <path d="M8 3l3.5 3.5L8 10M11.5 6.5h-5A4 4 0 0 0 2.5 10.5v1" />}
                    {k === "chart" && <><rect x="5.5" y="1.8" width="3" height="3" rx="0.8" /><rect x="1.8" y="9.2" width="3" height="3" rx="0.8" /><rect x="9.2" y="9.2" width="3" height="3" rx="0.8" /><path d="M7 4.8v2.4M3.3 9.2V7.2h7.4v2" /></>}
                    {k === "more" && <path d="M7 3.2v.01M7 7v.01M7 10.8v.01" strokeWidth="2" />}
                  </svg>
                ))}
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-start justify-center bg-[#f7f7f4] px-3 pb-3 pt-3">
            <div className="w-full max-w-[330px] rounded-[10px] border border-[#ececec] bg-white px-4 pb-4 pt-3.5 text-center shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <span
                className={`inline-block rounded-[4px] px-2 py-[3px] text-[7px] font-bold uppercase tracking-[0.1em] ${
                  isDone ? "bg-[var(--green-soft)] text-[var(--green-deep)]" : "text-white"
                }`}
                style={isDone ? undefined : { background: APP_BRAND }}
              >
                {isDone ? rec.resolved : rec.pill}
              </span>

              <p className="mt-2.5 text-[13px] font-semibold leading-[1.25] tracking-[-0.01em] text-[#171717]">
                {isDone ? rec.resolvedHeadline : rec.ask}
              </p>

              <div className="mt-2.5 rounded-[8px] border border-[#ececec] px-3 py-3">
                {rec.avatar ? (
                  <span className="mx-auto block h-[38px] w-[38px] overflow-hidden rounded-full ring-1 ring-[#e5e5e5]">
                    <img src={rec.avatar} alt="" aria-hidden className="h-full w-full scale-[1.3] object-cover" />
                  </span>
                ) : (
                  <span
                    className="mx-auto grid h-[38px] w-[38px] place-items-center rounded-full text-[12px] font-bold text-white"
                    style={{ background: APP_BRAND }}
                  >
                    {rec.initials}
                  </span>
                )}
                <p className="mt-2 text-[10px] font-bold leading-[13px] text-[#171717]">{rec.who}</p>
                {rec.meta.map((m, i) => (
                  <p
                    key={m}
                    className={`text-[8.5px] leading-[12px] ${
                      i === rec.meta.length - 1 ? "mt-[1px] font-semibold text-[#171717]" : "text-[#404040]"
                    }`}
                  >
                    {m}
                  </p>
                ))}

                {isDone ? (
                  /* The resolved state is the one the product would show: a quiet band and a
                     line saying what followed. No tick animation, no confetti — the point is
                     that the work is gone, not that something happened. */
                  <div className="mt-2.5 rounded-[6px] bg-[var(--green-soft)] px-2 py-[7px]">
                    <span className="flex items-center justify-center gap-1.5 text-[9px] font-bold text-[var(--green-deep)]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                      </svg>
                      {rec.resolvedNote}
                    </span>
                    <span className="mt-[3px] block text-[8px] leading-[11px] text-[var(--green-deep)]/75">
                      {rec.resolvedMeta}
                    </span>
                  </div>
                ) : (
                  <>
                    <p className="mt-2 text-[8.5px] font-medium text-[var(--app-brand)]">View profile</p>
                    {/* the press lives on the button, not on the pointer: a control that dips
                        and darkens under the click is what makes the click read as real */}
                    <span
                      ref={step.open === "confirm" ? confirmRef : approveRef}
                      className="mt-2 block rounded-[6px] py-[7px] text-[9px] font-bold uppercase tracking-[0.06em] text-white transition-[transform,filter] duration-150 ease-out"
                      style={{
                        background: APP_BRAND,
                        transform: step.press ? "scale(0.97)" : "scale(1)",
                        filter: step.press ? "brightness(0.86)" : "none",
                      }}
                    >
                      {rec.primary}
                    </span>
                    <p className="mt-2.5 text-[8.5px] leading-none">
                      <span className="font-medium text-[var(--app-brand)]">{rec.secondary}</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* the pointer. Positioned in the mock's own coordinate space, so it stays put on
            the button it is over while the product scales. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
          <div
            className="absolute left-0 top-0"
            style={{
              transform: `translate3d(${pt ? pt.x - 2 : MOCK_W * 0.72}px, ${pt ? pt.y - 3 : 560}px, 0) scale(${step.press ? 0.9 : 1})`,
              opacity: pt ? 1 : 0,
              /* the travel eases out and settles; the fade is quicker than the move so the
                 pointer is already visible by the time it is going anywhere */
              transition: "transform 620ms cubic-bezier(0.22,0.61,0.36,1), opacity 260ms ease-out",
            }}
          >
            <Pointer />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- assembled showcase ---------- */

/* Size the product settles to after the first scroll — constant at every width, so
   the second-scroll proportion never changes. */
/* The product's own greens, taken from the Figma node the dashboard shell was
   built from. The phone is the same app, so it paints with these rather than the
   marketing site's --green (#0e5a38) / --green-deep (#0b4a2e), which are a
   lighter, warmer pair and read as a different brand next to the dashboard. */
const APP_SHELL = "var(--app-shell)"; // topbar + rail ground
const APP_BRAND = "var(--app-brand)"; // primary actions and brand marks

const SETTLED_SCALE = 0.88;
/* iPad portrait. At and above this the big-then-shrink behaviour runs and the
   floating cards show; below it the product sits at its natural size alone. */
const TABLET_MIN = 768;
const MOCK_BASE_MAX = 880; // matches the mock's max-w
const GUTTER = 96; // container md:px-12 on both sides

export function ProductShowcase({ heroScale = 1.35 }: { heroScale?: number }) {
  const { ref, p } = useReveal();

  /* The mock is `w-full max-w-[880px]`, and `scale()` does not reflow — so a scale
     that outgrows the viewport adds a horizontal scrollbar. Cap the hero scale to
     what actually fits, which lets the same behaviour run all the way down to iPad
     instead of switching off at a hard breakpoint. */
  const [hero, setHero] = useState(1);
  /* Layout height of the mock's slot, which is `aspect-[16/11]`. scale() paints outside
     that slot, so the blown-up hero hangs below it with the page none the wiser — and a
     viewport tall enough to show Trust at rest lands the product on top of it. */
  const [reserve, setReserve] = useState(0);
  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      if (vw < TABLET_MIN) {
        setHero(1);
        setReserve(0);
        return;
      }
      const base = Math.min(MOCK_BASE_MAX, vw - GUTTER);
      const fits = (vw - 24) / base; // keep 12px clear each side
      const h = Math.min(heroScale, fits);
      setHero(h);

      /* The blow-up hangs mockH*(h-1) below its slot, and only lands on the section
         underneath when the viewport is tall enough to show that section at rest — on a
         laptop the reveal has finished long before it scrolls into view. So the reserve is
         decided by viewport height and stays put while you scroll. Keyed to the live scale
         it collapsed the document by ~212px mid-gesture, which dragged everything below
         upward and let the browser re-anchor the scroll position out from under the user. */
      const el = ref.current;
      if (!el) return;
      const mockH = (base * 11) / 16; // mock slot is aspect-[16/11]
      const pb = parseFloat(getComputedStyle(el).paddingBottom) || 0;
      const nextSectionTop = el.getBoundingClientRect().top + window.scrollY + mockH + pb;
      /* The overhang is mockH*(h-1), but pb below the slot is already clear space
         — reserving the full overhang on top of it double-counts, and on a tall
         window that left ~212px of dead cream under the product. Subtracting pb
         alone lands the blown-up product exactly on the next section's first line,
         where its shadow still crosses, so keep a 32px cushion. */
      const CUSHION = 32;
      setReserve(nextSectionTop < window.innerHeight ? Math.max(0, mockH * (h - 1) - pb + CUSHION) : 0);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [heroScale]);

  // enter: 0 = big hero product on first view, 1 = settled smaller so cards have room
  const enter = win(p, 0, 0.5);
  const scale = hero - (hero - SETTLED_SCALE) * enter;


  return (
    <div ref={ref} className="relative mx-auto mt-10 max-w-[1320px] px-6 pb-10 md:px-12 min-[1360px]:pb-20">
      <div className="relative">
        {/* dotted-grid backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-10 bottom-0"
          style={{
            backgroundImage: "radial-gradient(rgba(14,90,56,0.14) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(80% 70% at 50% 40%, black 0%, transparent 78%)",
            opacity: 0.6,
          }}
        />
        {/* soft green glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-6 h-[440px] w-[min(760px,100%)] -translate-x-1/2 rounded-full bg-[var(--green)]/10 blur-[100px]"
          style={{ opacity: 0.65 + 0.25 * enter }}
        />
        {/* grounding shadow under the dashboard */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-6 left-1/2 h-16 w-[min(600px,100%)] -translate-x-1/2 rounded-[50%] bg-[var(--green-deep)]/25 blur-2xl"
          style={{ opacity: 0.6 + 0.4 * enter }}
        />

        {/* main dashboard — comfortable centered size, shrinks on scroll to open the gutters */}
        <div
          className="relative z-10 mx-auto aspect-[16/11] w-full max-w-[880px]"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            /* Promote only while the scale is actually moving. A permanent
               `will-change: transform` pins the layer's raster scale, so the 1.35x hero
               state was magnified from a 1x texture — soft at 1920, where the mock paints
               1188px wide. Dropping the hint at rest lets Chrome re-rasterise at the real
               scale, which is where the product is actually looked at. */
            willChange: p > 0 && p < 1 ? "transform" : undefined,
          }}
        >
          <Dashboard />
        </div>

        {/* Each gutter is a flex column spanning the stage, so the cards space
            themselves evenly instead of each being pinned to its own offset. The
            old left column mixed a centre-relative anchor (right-[calc(50%+410px)])
            with an edge-relative one, which left its edges 27px apart and a 221px
            hole down the middle while the right gutter overlapped by 16px.
            items-start / items-end keep each column flush to its outer edge, and the
            entry offsets mirror across the product. (The tilts are gone — see Float.) */}
        {/* Both gutters are centred columns, which is what puts the two sides in
            balance: each one's centre of mass lands within a few px of the other's
            and close to the dashboard's own middle, instead of the left sagging
            69px lower than the right as it did when they were bottom-anchored.

            They centre on the stage rather than on the dashboard's painted box.
            Dead-centring on the dashboard is better balance on paper, but the right
            column is 673px against the dashboard's 532px, so it would overhang ~50px
            above the dashboard's top — and at the scroll position where the reveal
            settles, that lands the phone's status bar under the sticky nav. The
            stage's centre sits ~36px lower, which clears the nav and still holds
            both columns within ~40px of the dashboard's centre. */}
        {/* One travel distance on every card, mirrored across the product, and one gap.
            The four used to enter from 34/46px at different angles; identical distance with
            the stagger left in the timing is the same reveal without the scatter. */}
        {/* The product is scaled from a `top center` origin, so it paints 12% shorter than
            the box it occupies and its centre sits half that distance above the box's. The
            gutters span the box, so centring on it put both columns 36px below the product
            they are meant to flank. Offsetting by half the height the scale removes lines
            them up on what is actually drawn — and tracks the product while it animates,
            which a fixed nudge would not. */}
        <div
          className="absolute -left-9 inset-y-0 z-20 hidden flex-col items-start justify-center gap-11 min-[1360px]:flex"
          style={{ transform: `translateY(${-(1 - scale) * 50}%)` }}
        >
          <Float from={[-26, 18]} t={win(p, 0.32, 0.52)}>
            <AskAI />
          </Float>
          <Float from={[-26, 18]} t={win(p, 0.46, 0.64)}>
            <ShiftOvertime />
          </Float>
        </div>

        <div
          /* items-start, not items-end: the column is 244px to match the cards, and the cards
             fill it — but the phone is 186px, so aligning to the outer edge pushed it 58px
             further from the product than everything else, purely because it is narrower.
             Aligning on the INNER edge puts all four objects the same 17px off the product,
             which is the gap the composition is actually read against. The phone's outer
             edge now sits inside the Payroll card's; that edge faces empty page, where a
             58px difference costs nothing. */
          className="absolute -right-9 inset-y-0 z-20 hidden flex-col items-start justify-center gap-11 min-[1360px]:flex"
          style={{ transform: `translateY(${-(1 - scale) * 50}%)` }}
        >
          {/* 19px past the column's inner edge, which puts the phone 36px off the product
              against the cards' 17px. A device reads as a separate object rather than as
              another panel of the same screen, so it wants more air than a card does. */}
          <Float from={[26, 18]} t={win(p, 0.38, 0.56)} className="z-30 ml-[19px]">
            <PhoneOneAiLeave />
          </Float>
          <Float from={[26, 18]} t={win(p, 0.52, 0.7)}>
            <PayrollSummary />
          </Float>
        </div>
      </div>

      {/* room for the hero blow-up to hang into — see `reserve` above */}
      <div aria-hidden style={{ height: reserve }} />
    </div>
  );
}
