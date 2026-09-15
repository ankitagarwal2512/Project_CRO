import { Fragment, useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
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

function Float({
  children,
  className = "",
  from,
  tilt = 0,
  t,
}: {
  children: ReactNode;
  className?: string;
  from: [number, number];
  tilt?: number;
  t: number;
}) {
  const k = 1 - t;
  const style: CSSProperties = {
    opacity: clamp(t * 1.6),
    transform: `translate3d(${from[0] * k}px, ${from[1] * k}px, 0) rotate(${tilt * t}deg) scale(${0.98 + 0.02 * t})`,
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
    className={`rounded-[7px] border border-[var(--border)] bg-[var(--panel)]/95 p-4 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_24px_50px_-28px_rgba(11,74,46,0.45),0_6px_16px_-10px_rgba(11,74,46,0.25)] backdrop-blur-sm ${className}`}
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

function MultiState() {
  /* The employer-contribution breakdown from the product's payroll dashboard.
     The three rows sum to ₹23,27,155 — which is exactly the "Net contributions"
     figure on the strip in the product behind this card. The card is the detail
     behind a number already on screen rather than a second invented total, which
     is the thing that makes a mock survive someone actually reading it. */
  const rows: [string, string][] = [
    ["ESI Employer", "₹5,190"],
    ["LWF Employer", "₹784"],
    ["PF Employer", "₹23,21,181"],
  ];
  return (
    <Card className="w-[236px]">
      {/* header — title, period and the product's help affordance */}
      <div className="-mx-4 -mt-4 flex items-center gap-1.5 border-b border-[var(--border)] px-4 pb-2.5 pt-3">
        <span className="text-[12px] font-bold tracking-[-0.01em] text-[var(--ink)]">Contributions</span>
        <span className="text-[8.5px] text-[var(--muted)]">Monthly</span>
        <span className="grid h-[13px] w-[13px] shrink-0 place-items-center rounded-full bg-[var(--muted)]/30 text-[7.5px] font-bold leading-none text-white">
          ?
        </span>
      </div>

      {/* rows bleed to the card edge and alternate, the way the product lists them */}
      <div className="-mx-4">
        {rows.map(([label, value], i) => (
          <div
            key={label}
            className={`flex items-center justify-between gap-2 px-4 py-[9px] ${
              i % 2 ? "bg-[var(--cream-2)]/35" : ""
            }`}
          >
            <span className="truncate text-[9.5px] text-[var(--muted)]">{label}</span>
            <span className="shrink-0 text-[10px] font-semibold tabular-nums text-[var(--ink)]">{value}</span>
          </div>
        ))}
      </div>

      <div className="-mx-4 -mb-4 flex items-center justify-between gap-2 border-t border-[var(--border)] bg-[var(--green-soft)] px-4 py-[11px]">
        <span className="text-[9.5px] font-semibold text-[var(--green-deep)]">Total contributions</span>
        <span className="text-[11.5px] font-bold tabular-nums text-[var(--green-deep)]">₹23,27,155</span>
      </div>
    </Card>
  );
}

function ShiftRoster() {
  return (
    <Card className="w-[244px]">
      <div className="mb-3 text-[15px] font-bold">Shift roster</div>
      {["Pune", "Chennai"].map((c) => (
        <div key={c} className="mb-1.5 flex items-center justify-between">
          <span className="text-[12px] text-[var(--muted)]">{c}</span>
          <div className="flex gap-1">
            {["A", "B", "C"].map((x) => (
              <span key={x} className="grid h-6 w-6 place-items-center rounded-md bg-[var(--cream-2)] font-mono text-[11px]">
                {x}
              </span>
            ))}
          </div>
        </div>
      ))}
      <div className="mt-3 rounded-lg bg-[var(--green-soft)] px-3 py-2">
        <div className="text-[17px] font-bold text-[var(--green-deep)]">186 h</div>
        <div className="text-[11px] text-[var(--green)]">Overtime computed</div>
      </div>
    </Card>
  );
}

function ContractWorkforce() {
  return (
    <Card className="w-[224px]">
      <div className="mb-2 text-[15px] font-bold">Contract workforce</div>
      <div className="flex items-baseline gap-2">
        <span className="text-[26px] font-bold leading-none">360</span>
        <span className="text-[11px] text-[var(--muted)]">workers · 6 vendors</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-[12px]">
        <span className="text-[var(--muted)]">12 days to expiry</span>
        <span className="flex items-center gap-1.5 text-[var(--ink)]">
          <Check /> CLRA ready
        </span>
      </div>
    </Card>
  );
}

function ApprovalMatrix() {
  /* Mirrors the product's request-workflow screen: a vertical thread down the
     avatars, one node per approver, with the level badge on the right and the
     action link under the status. The old build was a five-dot stepper, which
     shows the shape of an approval chain but not who is holding it up. */
  const steps = [
    { who: "Ananya Rao", id: "#AVK0730", avatar: avatarAnanya, note: "On duty · 11/09", state: "raised" as const },
    { who: "Rohan Mehta", id: "#AVK0172", avatar: avatarUser, note: "Request is approved.", state: "approved" as const, level: "Level 1" },
    { who: "Priya Shah", id: "#AVK0190", initials: "PS", note: "Pending…", state: "pending" as const, level: "Level 2" },
  ];
  return (
    <Card className="w-[244px]">
      {/* header — carries the request's own status */}
      <div className="-mx-4 -mt-4 mb-3 flex items-center border-b border-[var(--border)] px-4 pt-3">
        <span className="relative flex shrink-0 items-center gap-1.5 whitespace-nowrap pb-2 text-[12px] font-bold text-[var(--ink)]">
          Approval workflow
          <span className="rounded-[4px] bg-[#fdf1dc] px-1.5 py-[1px] text-[9px] font-semibold text-[#9a6412]">Pending</span>
          <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--green-deep)]" />
        </span>
      </div>

      <div className="mb-2 text-[10.5px] font-semibold text-[var(--ink)]">Your request workflow</div>

      <div className="flex flex-col">
        {steps.map((st, i) => (
          <div key={st.id} className="flex gap-2.5">
            {/* Avatar + the thread that joins it to the next node. Both photos take
                the same 1.3 crop: AVATAR.png carries an uneven white rim baked into
                the file (thickest at ~1.26x radius) that a smaller scale leaves
                showing, and applying the same factor to ANANYA.png keeps the two
                heads filling their discs to the same degree rather than one sitting
                tight in frame and the other floating in it. */}
            <div className="flex w-7 shrink-0 flex-col items-center">
              {st.avatar ? (
                <span className="block h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-[var(--border)]">
                  <img src={st.avatar} alt="" aria-hidden className="h-full w-full scale-[1.3] object-cover" />
                </span>
              ) : (
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--green-soft)] text-[10px] font-bold text-[var(--green-deep)] ring-1 ring-[var(--green-line)]">
                  {st.initials}
                </span>
              )}
              {i < steps.length - 1 && <span className="w-px flex-1 bg-[var(--border)]" />}
            </div>

            <div className={`min-w-0 flex-1 rounded-lg border border-[var(--border)] px-2.5 py-2 ${i < steps.length - 1 ? "mb-2" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="truncate text-[11.5px] font-bold text-[var(--ink)]">{st.who}</div>
                {st.level && (
                  <span className="shrink-0 rounded-full bg-[#f1ecfb] px-2 py-[1px] text-[9px] font-semibold text-[#6b46c1]">
                    {st.level}
                  </span>
                )}
              </div>
              <div className="truncate font-mono text-[9px] text-[var(--muted)]">{st.id}</div>
              <div
                className={`mt-[3px] truncate text-[10.5px] ${
                  st.state === "approved" ? "text-[var(--green)]" : "text-[var(--muted)]"
                }`}
              >
                {st.note}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* Each prompt carries its own answer, so the card reads as a real exchange
   instead of one fixed result sitting under a rotating question. */
const ASK_ITEMS = [
  {
    q: "Which sites drive overtime?",
    a: "Pune and Chennai drive 62% of overtime hours this month.",
    tag: "+18% vs Aug",
  },
  {
    q: "Who is due for PF revision?",
    a: "14 employees cross the ₹15,000 wage ceiling in September.",
    tag: "3 need Form 11",
  },
  {
    q: "Summarise attrition in Sales",
    a: "Sales attrition is 3.1%, against 1.4% company-wide.",
    tag: "9 exits · 4 regretted",
  },
  {
    q: "Any statutory approvals due?",
    a: "6 approvals open — PT Maharashtra is due in 2 days.",
    tag: "2 overdue",
  },
];
const ASK_PROMPTS = ASK_ITEMS.map((i) => i.q);

function useTypewriter(phrases: string[]) {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(phrases[0]);
      setDone(true);
      return;
    }
    let i = 0; // phrase index
    let c = 0; // char index
    let deleting = false;
    let timer = 0 as unknown as ReturnType<typeof setTimeout>;
    const tick = () => {
      const phrase = phrases[i];
      if (!deleting) {
        c++;
        setText(phrase.slice(0, c));
        setDone(c === phrase.length);
        if (c === phrase.length) {
          timer = setTimeout(() => {
            deleting = true;
            tick();
          }, 2200);
          return;
        }
      } else {
        c--;
        setText(phrase.slice(0, c));
        setDone(false);
        if (c === 0) {
          deleting = false;
          i = (i + 1) % phrases.length;
          setIndex(i);
        }
      }
      timer = setTimeout(tick, deleting ? 28 : 55);
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [phrases]);
  return { text, done, index };
}

function AskAI() {
  const { text, done, index } = useTypewriter(ASK_PROMPTS);
  const item = ASK_ITEMS[index];
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

      {/* animated prompt input */}
      <div className="flex min-h-[34px] items-center gap-2 rounded-xl border border-[var(--green-line)] bg-white px-3 py-2 text-[12px] text-[var(--ink)] shadow-[0_1px_0_rgba(14,90,56,0.04)_inset]">
        <span className="text-[var(--green)]">✦</span>
        <span className="truncate">{text}</span>
        <span
          className="ml-px inline-block h-[15px] w-px bg-[var(--green)]"
          style={{ animation: done ? "askblink 1s step-end infinite" : "none", opacity: done ? undefined : 1 }}
        />
      </div>

      {/* answer — reserves its height so the card never jumps between prompts */}
      <div className="mt-2.5 min-h-[66px]">
        {done ? (
          <div className="animate-[askin_260ms_ease-out_both]">
            <p className="text-[11.5px] leading-[1.5] text-[var(--ink)]">{item.a}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-[var(--green-soft)] px-2 py-[3px] font-mono text-[9.5px] font-semibold text-[var(--green)]">
              {item.tag}
            </span>
          </div>
        ) : (
          /* Three 5px dots left the reserve visibly empty; skeleton lines fill it,
             so the card holds the same weight mid-question as it does with an
             answer on screen. */
          <div className="pt-[3px]" aria-hidden>
            {[92, 78, 58].map((w, d) => (
              <span
                key={w}
                className="mb-[5px] block h-[7px] rounded-full bg-[var(--green)]/14"
                style={{ width: `${w}%`, animation: `askdot 1.4s ${d * 0.18}s ease-in-out infinite` }}
              />
            ))}
            <span
              className="mt-[7px] block h-[13px] w-[42%] rounded-md bg-[var(--green-soft)]"
              style={{ animation: "askdot 1.4s 0.54s ease-in-out infinite" }}
            />
          </div>
        )}
      </div>
    </Card>
  );
}

function PhoneAttendance() {
  return (
    /* Bezel is a pale warm alloy rather than near-black: on a cream page the only
       pure-dark object steals the eye from the product behind it. The hairline
       border + inset highlight are what keep it reading as a device. */
    <div
      className="relative w-[206px] rounded-[33px] border border-[var(--border)] p-[7px] shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_28px_60px_-30px_rgba(11,74,46,0.38),0_8px_20px_-12px_rgba(11,74,46,0.2)]"
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

        {/* App header — same #01241a as the dashboard's topbar and rail. */}
        <div
          className="flex shrink-0 items-center gap-2 px-2.5 py-2 text-white"
          style={{ background: APP_SHELL }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="shrink-0"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="flex-1 truncate text-[11px] font-semibold tracking-[-0.01em]">Mark Attendance</span>
          <span className="flex shrink-0 flex-col items-center gap-[2.5px]" aria-hidden>
            {[0, 1, 2].map((d) => (
              <span key={d} className="block h-[2.5px] w-[2.5px] rounded-full bg-white/85" />
            ))}
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden bg-[#f3f4f2] px-2 py-[7px]">
          <div className="shrink-0 rounded-lg bg-[var(--panel)] px-2 py-2 shadow-[0_1px_3px_rgba(11,74,46,0.09)]">
            <div className="mb-[5px] flex shrink-0 items-center justify-between">
              <span className="text-[8px] font-bold uppercase tracking-[0.09em] text-[var(--ink)]">
                Current location
              </span>
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M12 7a5 5 0 1 1-1.6-3.7" stroke={APP_BRAND} strokeWidth="1.6" strokeLinecap="round" />
                <path d="M12.2 1.6v3h-3" stroke={APP_BRAND} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="mb-[7px] shrink-0">
              <div className="text-[7.5px] leading-[11px] text-[var(--muted)]">Address</div>
              <div className="whitespace-pre-line text-[10px] leading-[1.35] text-[var(--ink)]">
                {"Gat 214, Phase II, MIDC Chakan,\nPune, Maharashtra 410501"}
              </div>
            </div>

            <div className="mb-[7px] shrink-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[7.5px] leading-[11px] text-[var(--muted)]">Coordinates</span>
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
                  <circle cx="8" cy="8" r="3.4" stroke={APP_BRAND} strokeWidth="1.4" />
                  <circle cx="8" cy="8" r="1.1" fill={APP_BRAND} />
                  <path d="M8 1v2.1M8 12.9V15M1 8h2.1M12.9 8H15" stroke={APP_BRAND} strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <div className="text-[10px] leading-[1.35] tabular-nums text-[var(--ink)]">18.7601483, 73.8634127</div>
            </div>

            {/* accuracy and punch time share a row — two short values do not each
                need a full line, and the space buys the type its size back */}
            <div className="mb-[7px] shrink-0">
              <div className="text-[7.5px] leading-[11px] text-[var(--muted)]">Accuracy (in meter)</div>
              <div className="text-[10px] leading-[1.35] tabular-nums text-[var(--ink)]">8.32</div>
            </div>

            <div className="shrink-0">
              <div className="text-[7.5px] leading-[11px] text-[var(--muted)]">Punch Time</div>
              <div className="whitespace-nowrap text-[10px] leading-[1.35] tabular-nums text-[var(--ink)]">
                15-09-2026 08:58
              </div>
            </div>
          </div>

          <div className="shrink-0 rounded-lg bg-[var(--panel)] px-2 py-2 shadow-[0_1px_3px_rgba(11,74,46,0.09)]">
            <div className="text-[8px] font-bold uppercase tracking-[0.09em] text-[var(--ink)]">
              Please fill the below fields
            </div>

            {/* photo capture — what an attendance punch actually asks for */}
            <div className="mt-2 flex items-center gap-2">
              <span
                className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-md border border-dashed"
                style={{ borderColor: "var(--green-line)", background: "var(--green-soft)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={APP_BRAND} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2L8 5h8l1.5 2h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
                  <circle cx="12" cy="12.5" r="3.2" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-semibold leading-[1.35] text-[var(--ink)]">Add photo</div>
                <div className="text-[7.5px] leading-[11px] text-[var(--muted)]">Selfie required to punch in</div>
              </div>
            </div>

            <div className="mt-2 border-b border-[var(--border)] pb-1 text-[10px] text-[var(--muted)]">
              Comments
            </div>
            <div className="mt-[3px] text-right text-[7.5px] text-[var(--muted)]">0/500</div>
          </div>
        </div>

        <div className="shrink-0 bg-[var(--panel)] px-2 pb-[5px] pt-[5px]">
          <div
            className="rounded-md py-[7px] text-center text-[10px] font-semibold text-white shadow-[0_5px_12px_-6px_rgba(2,86,61,0.9)]"
            style={{ background: APP_BRAND }}
          >
            Submit Request
          </div>
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


/* Monthly effective CTC for the trailing year, ending on the month the header
   selects. The last point IS the KPI headline above it (₹4,25,51,690) rather than
   a second invented number, so the card and the strip agree — which is the thing
   that separates a real dashboard from a placeholder.

   The shape is what an Indian payroll actually does over a year: steady growth on
   headcount, a step in Sep when the increment cycle lands, a festival-bonus month
   in Oct, the post-bonus settle in Nov, and the FY-end arrears/variable spike in
   Mar before the new year resets. A monotonic line would read as invented. */
const CTC_SERIES: [string, number][] = [
  ["Jun", 36918400],
  ["Jul", 37240100],
  ["Aug", 37506800],
  ["Sep", 38944200],
  ["Oct", 41882600],
  ["Nov", 39688900],
  ["Dec", 40102400],
  ["Jan", 40512700],
  ["Feb", 40884600],
  ["Mar", 43908300],
  ["Apr", 41730500],
  ["May", 42551690],
];
const AXIS_MAX = 50_000_000;
const PLOT_W = 520;
const PLOT_TOP = 10;
const PLOT_BOT = 180;

/* Points sit at the centre of twelve equal slots, which is exactly where the
   flex-1 month labels below the plot centre themselves — so the axis lines up
   with the data instead of drifting half a slot off it. */
const ctcPt = (i: number, v: number): [number, number] => [
  ((i + 0.5) * PLOT_W) / CTC_SERIES.length,
  PLOT_BOT - (v / AXIS_MAX) * (PLOT_BOT - PLOT_TOP),
];
const CTC_PTS = CTC_SERIES.map(([, v], i) => ctcPt(i, v));
const CTC_LINE =
  `M0 ${CTC_PTS[0][1].toFixed(1)} ` +
  CTC_PTS.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(" ") +
  ` L${PLOT_W} ${CTC_PTS[CTC_PTS.length - 1][1].toFixed(1)}`;
const CTC_AREA = `${CTC_LINE} L${PLOT_W} ${PLOT_BOT} L0 ${PLOT_BOT} Z`;

function Dashboard({ p }: { p: number }) {
  /* The plot draws itself once the product has settled and just ahead of the
     cards' cascade (AskAI 0.40, phone 0.46, Approval 0.58, MultiState 0.64), so
     the order reads product -> chart -> cards rather than all at once. */
  const chart = win(p, 0.28, 0.58);
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[0_50px_90px_-40px_rgba(11,74,46,0.55)]">
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
        <div className="flex w-[140px] shrink-0 flex-col justify-between overflow-hidden" style={{ background: APP_SHELL }}>
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
                <div key={label as string} className="flex h-7 items-center gap-1.5 overflow-hidden rounded-[5px] px-2.5">
                  <img src={icon as string} alt="" aria-hidden className="h-[13px] w-[13px] shrink-0" />
                  {/* One AI is the one label the design paints with a brand gradient */}
                  <p
                    className={`min-w-0 flex-1 truncate text-[11px] leading-4 ${
                      label === "One AI"
                        ? "bg-gradient-to-r from-[#b3574d] via-[#c7ca2c] via-[11%] to-[#21902e] to-[28%] bg-clip-text text-transparent"
                        : "text-[#f0f5f2]"
                    }`}
                  >
                    {label}
                  </p>
                  {label === "Projects" && (
                    <img src={navExternal} alt="" aria-hidden className="h-3 w-3 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1 pb-2">
              <div className="flex items-center px-2.5">
                <p className="flex-1 text-[9.5px] leading-4 tracking-[0.11px] text-[rgba(73,191,155,0.7)]">APPS</p>
              </div>
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
                  <div
                    key={label as string}
                    className={`flex h-7 items-center gap-1.5 overflow-hidden rounded-[5px] px-2.5 ${
                      label === "Analytics" ? "bg-[#013226]" : ""
                    }`}
                  >
                    <img src={icon as string} alt="" aria-hidden className="h-[13px] w-[13px] shrink-0" />
                    <p className="min-w-0 flex-1 truncate text-[11px] leading-4 text-[#f0f5f2]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col border-t border-[rgba(230,247,240,0.2)] px-1.5 pb-2.5 pt-2.5">
            <div className="flex h-7 items-center gap-1.5 overflow-hidden rounded-[5px] px-2.5">
              <img src={navSettings} alt="" aria-hidden className="h-[13px] w-[13px] shrink-0" />
              <p className="min-w-0 flex-1 truncate text-[11px] leading-4 text-[#f0f5f2]">Settings</p>
            </div>
          </div>
        </div>

        {/* L1 sub-nav, styled to the product's own panel pattern: titled header
            with the collapse control over a rule, a search field, then collapsible
            groups whose active row is a full-bleed green tint. The design sizes
            this 200px, but at 1440 that leaves 1040px of content whereas our 880px
            mock would be left with 480px, so it runs at 140px with 26px rows. */}
        <div className="flex w-[140px] shrink-0 flex-col overflow-hidden border-r border-[#e5e5e5] bg-white">
          <div className="flex h-8 shrink-0 items-center justify-between gap-1 border-b border-[#e5e5e5] px-2">
            <p className="truncate text-[10px] font-medium text-[#171717]">Business Intelligence</p>
            <img src={navCollapse} alt="" aria-hidden className="h-[13px] w-[13px] shrink-0" />
          </div>

          <div className="shrink-0 px-2.5 pb-1.5 pt-2">
            <div className="flex h-[26px] items-center gap-1.5 rounded-[6px] border border-[#d4d4d4] px-2">
              <img src={navSearch} alt="" aria-hidden className="h-3 w-3 shrink-0" />
              <span className="truncate text-[10px] text-[#737373]">Search...</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 px-3 py-1">
            <span className="flex-1 truncate text-[11px] font-semibold text-[var(--green-deep)]">Dashboards</span>
            {/* the design's own chevron, turned to point up for the open group */}
            <img src={navChevron} alt="" aria-hidden className="h-[13px] w-[13px] shrink-0 -rotate-90" />
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {[
              "Employee movement",
              "Engage",
              "Expense",
              "Happiness index",
              "Helpdesk",
              "HR ops",
              "Payroll",
              "Performance",
              "Performance 9 box",
              "Pulse",
              "Recruitment",
              "ROI",
              "Survey",
              "Time office",
            ].map((item) => (
              <div
                key={item}
                className={`flex h-[26px] shrink-0 items-center truncate pl-4 pr-2 text-[11px] ${
                  item === "Payroll"
                    ? "bg-[#eef6f1] font-semibold text-[var(--green-deep)]"
                    : "text-[#171717]"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── content: the region the design leaves as a raster, rebuilt from the
            same elements — the MONTHLY chip, the KPI equation strip with its
            coloured metric tags, and the Salary Distribution card ───────────── */}
        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden bg-[#fafaf6] px-4 py-3">
          {/* page head — title + blurb on the left, the view/period controls and the
              refresh stamp on the right, as the payroll dashboard carries them.

              Type runs on four steps so each role is legible as a role, rather than
              the seven sizes bunched between 8 and 12px this block started with:
                16  page title
                14  the KPI figures — the only numbers that should carry weight
                13  card titles, kept under the page title so it stays the head
                9.5 body, control values and control labels
                8   tags, meta, axis and the period chip
              plus 11 for the +/= operators, which are connective marks rather
              than part of the text ramp.
              Everything that is a label rather than a value also loses weight or
              gains tracking, so size is not doing the work on its own. */}
          <div className="flex shrink-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[16px] font-bold leading-[20px] tracking-[-0.02em] text-[#171717]">Payroll</h2>
              <p className="mt-[5px] max-w-[300px] text-[9.5px] leading-[1.45] text-[#737373]">
                Payroll dashboard gives you overview of effective cost of employees, outstanding liabilities
                and <span className="text-[#c2622f]">ongoing loans in HROne.</span>
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-[5px]">
              <div className="flex items-center gap-1.5">
                <span className="text-[9.5px] text-[#a0a0a0]">Select View</span>
                {["Enterprise", null, "May, 2026"].map((label, i) =>
                  label ? (
                    <span
                      key={label}
                      className="flex h-[22px] items-center gap-1.5 rounded-[4px] border border-[#d4d4d4] bg-white pl-2 pr-1.5 text-[9.5px] font-medium text-[#171717]"
                    >
                      {label}
                      {/* the design's chevron, turned down for a select */}
                      <img src={navChevron} alt="" aria-hidden className="h-2.5 w-2.5 shrink-0 rotate-90" />
                    </span>
                  ) : (
                    <span
                      key={i}
                      className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[4px] border border-[#d4d4d4] bg-white"
                    >
                      <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden>
                        {[0, 1, 2].map((r) => (
                          <path
                            key={r}
                            d={`M${1.5 + r} ${3 + r * 2.5}h${9 - r * 2}`}
                            stroke="#525252"
                            strokeWidth="1.1"
                            strokeLinecap="round"
                          />
                        ))}
                      </svg>
                    </span>
                  ),
                )}
                <span className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-[var(--green-deep)] text-[7px] font-bold leading-none text-white">
                  ?
                </span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-[8px] italic text-[#8a8a8a]">Last updated time-15-09-2026</span>
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden className="shrink-0">
                  <path
                    d="M12 7a5 5 0 1 1-1.6-3.7"
                    stroke="var(--green)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path d="M12.2 1.6v3h-3" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span className="rounded-[4px] bg-[#8d9192] px-2 py-[3px] text-[8px] font-semibold uppercase tracking-[0.12em] text-white">
              MONTHLY
            </span>
          </div>

          {/* KPI strip — effective CTC = net paid + contributions + deductions + reimbursement */}
          <div className="flex shrink-0 items-stretch gap-1 rounded-xl border border-[#e5e5e5] bg-white px-2.5 py-2.5">
            {[
              { tag: "Effective CTC", tone: "#6b46c1", bg: "#f1ecfb", val: "₹4,25,51,690", sub: "2,040 Employees" },
              { tag: "Net paid", tone: "#1d4ed8", bg: "#e8eefc", val: "₹3,06,06,678" },
              { tag: "Net contributions", tone: "#9f1239", bg: "#fce8ee", val: "₹23,27,155" },
              { tag: "Net deductions", tone: "#b42318", bg: "#fdeceb", val: "₹96,17,857" },
              { tag: "Net reimbursement", tone: "#15803d", bg: "#e7f6ec", val: "₹0" },
            ].map((k, i) => (
              /* The operators are siblings of the columns, not children of them.
                 Nested, they ate into columns 2-5 only, leaving those four ~71px of
                 content against column 1's ~78px — which is what clipped the longer
                 figures while the first column had room to spare. */
              <Fragment key={k.tag}>
                {i > 0 && (
                  <span className="mt-[3px] shrink-0 text-[11px] font-normal text-[#cbcbcb]">{i === 1 ? "=" : "+"}</span>
                )}
                <div className="min-w-0 flex-1">
                  <span
                    className="inline-block max-w-full truncate rounded-[3px] px-1 py-[1px] text-[8px] font-semibold leading-[13px] tracking-[0.01em]"
                    style={{ color: k.tone, background: k.bg }}
                  >
                    {k.tag}
                  </span>
                  <div className="mt-[5px] truncate text-[14px] font-bold leading-[18px] tracking-[-0.03em] tabular-nums text-[#171717]">
                    {k.val}
                  </div>
                  {k.sub && (
                    <div className="truncate text-[8px] leading-[12px] text-[#9a9a9a]">
                      <span className="font-semibold tabular-nums text-[#6b6b6b]">2,040</span> Employees
                    </div>
                  )}
                </div>
              </Fragment>
            ))}
          </div>

          {/* Salary distribution */}
          <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-[#e5e5e5] bg-white px-4 py-3">
            <div className="flex shrink-0 items-center justify-between">
              <div className="flex items-baseline gap-2">
                <h3 className="text-[13px] font-bold tracking-[-0.015em] text-[#171717]">Salary Distribution</h3>
                <span className="text-[9.5px] text-[#8a8a8a]">Yearly</span>
              </div>
              {/* segmented control, active segment on the design's surface tone */}
              <div className="flex overflow-hidden rounded-[6px] border border-[#e5e5e5]">
                {["Effective CTC", "Net Paid", "CTC Analysis"].map((t, i) => (
                  <span
                    key={t}
                    className={`px-2.5 py-1 text-[9.5px] ${i > 0 ? "border-l border-[#e5e5e5]" : ""} ${
                      i === 0 ? "bg-[#f5f5f0] font-semibold text-[#171717]" : "text-[#8a8a8a]"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-2 shrink-0 text-[8px] tracking-[0.02em] text-[#9bb0c2]">Effective CTC (INR)</div>

            <div className="mt-1 flex min-h-0 flex-1 flex-col">
              <div className="flex min-h-0 flex-1">
                <div className="flex w-[54px] shrink-0 flex-col justify-between pr-2 text-right text-[8px] leading-none tabular-nums text-[#a3b0bf]">
                  {["50,000,000", "40,000,000", "30,000,000", "20,000,000", "10,000,000", "0"].map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>

                <div className="relative min-h-0 flex-1">
                  <svg viewBox="0 0 520 190" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
                    <defs>
                      <linearGradient id="v1sd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#b9b7f0" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#e9e8fb" stopOpacity="0.15" />
                      </linearGradient>
                      {/* the sweep is driven by scroll progress, so the series draws
                          itself left to right as the section comes into view — the
                          width is set directly rather than transitioned, because the
                          scroll already supplies the frames */}
                      <clipPath id="v1sweep">
                        <rect x="0" y="0" width={PLOT_W * chart} height="190" />
                      </clipPath>
                    </defs>

                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <line key={i} x1="0" y1={10 + i * 34} x2="520" y2={10 + i * 34} stroke="#f0f0ea" strokeWidth="1" />
                    ))}

                    <g clipPath="url(#v1sweep)">
                      <path d={CTC_AREA} fill="url(#v1sd)" />
                      <path
                        d={CTC_LINE}
                        fill="none"
                        stroke="#4fc3f7"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                      {CTC_PTS.map(([x, y], i) => (
                        <circle key={CTC_SERIES[i][0]} cx={x} cy={y} r="2.2" fill="#4fc3f7" />
                      ))}
                    </g>

                    {/* the selected month reads as current once the sweep reaches it */}
                    <circle
                      cx={CTC_PTS[CTC_PTS.length - 1][0]}
                      cy={CTC_PTS[CTC_PTS.length - 1][1]}
                      r="3.6"
                      fill="#fff"
                      stroke="#4fc3f7"
                      strokeWidth="2"
                      style={{ opacity: chart > 0.96 ? 1 : 0, transition: "opacity 240ms ease-out" }}
                    />
                  </svg>

                  <span className="absolute bottom-2.5 right-2 grid h-9 w-9 place-items-center rounded-full bg-[var(--green-deep)] shadow-[0_8px_18px_-8px_rgba(2,86,61,0.8)]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      {[4, 8, 12].map((y) => (
                        <path key={y} d={`M3 ${y}h10`} stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
                      ))}
                    </svg>
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 pl-[54px] pt-[3px]">
                {CTC_SERIES.map(([m]) => (
                  <span key={m} className="flex-1 text-center text-[7.5px] leading-[10px] text-[#a3b0bf]">
                    {m}
                  </span>
                ))}
              </div>
            </div>
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
          <Dashboard p={p} />
        </div>

        {/* Each gutter is a flex column spanning the stage, so the cards space
            themselves evenly instead of each being pinned to its own offset. The
            old left column mixed a centre-relative anchor (right-[calc(50%+410px)])
            with an edge-relative one, which left its edges 27px apart and a 221px
            hole down the middle while the right gutter overlapped by 16px.
            items-start / items-end keep each column flush to its outer edge, and
            the tilts and entry offsets mirror across the product. */}
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
        <div className="absolute -left-9 inset-y-0 z-20 hidden flex-col items-start justify-center gap-10 min-[1360px]:flex">
          <Float from={[-34, 26]} tilt={-2} t={win(p, 0.32, 0.52)}>
            <AskAI />
          </Float>
          <Float from={[-46, 42]} tilt={-2} t={win(p, 0.46, 0.64)}>
            <ApprovalMatrix />
          </Float>
        </div>

        <div className="absolute -right-9 inset-y-0 z-20 hidden flex-col items-end justify-center gap-10 min-[1360px]:flex">
          <Float from={[34, 26]} tilt={2} t={win(p, 0.38, 0.56)} className="z-30">
            <PhoneAttendance />
          </Float>
          <Float from={[46, 42]} tilt={2} t={win(p, 0.52, 0.7)}>
            <MultiState />
          </Float>
        </div>
      </div>

      {/* room for the hero blow-up to hang into — see `reserve` above */}
      <div aria-hidden style={{ height: reserve }} />
    </div>
  );
}
