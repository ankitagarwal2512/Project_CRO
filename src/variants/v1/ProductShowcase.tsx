import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import hrIcon from "@/imports/HRICON.svg";
import logoHr from "@/imports/logohr.png";
import avatarUser from "@/imports/AVATAR.png";
import avatarAnanya from "@/imports/ANANYA.png";

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
    className={`rounded-[18px] border border-[var(--border)] bg-[var(--panel)]/95 p-4 shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_24px_50px_-28px_rgba(11,74,46,0.45),0_6px_16px_-10px_rgba(11,74,46,0.25)] backdrop-blur-sm ${className}`}
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
  return (
    <Card className="w-[236px]">
      <div className="text-[15px] font-bold">Multi-state statutory</div>
      {/* says what the three numbers actually are, instead of an orphan label below them */}
      <div className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-[var(--muted)]">
        PT slabs · Sep 2026
      </div>

      <div className="mt-2.5 flex gap-1.5">
        {[
          ["MH", "3"],
          ["TN", "6"],
          ["KA", "2"],
        ].map(([st, n]) => (
          <div
            key={st}
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--cream-2)] px-1 py-1.5 text-center"
          >
            <div className="font-mono text-[9.5px] font-semibold tracking-[0.08em] text-[var(--muted)]">{st}</div>
            <div className="mt-[3px] text-[16px] font-bold leading-none text-[var(--ink)]">{n}</div>
          </div>
        ))}
      </div>

      <div className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-[var(--coral)]/10 px-2.5 py-2 text-[11.5px] leading-[1.4] text-[var(--coral-hover)]">
        <Warn />
        <span>
          October revision · <span className="whitespace-nowrap font-semibold">64 employees</span>
        </span>
      </div>
    </Card>
  );
}

function ShiftRoster() {
  return (
    <Card className="w-[224px]">
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
      <div className="mt-2 flex items-center gap-2 text-[12px] text-[var(--ink)]">
        <Check /> 12 flags resolved
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
  /* One row per stage keeps the node, its name and its state in the same grid
     column — the old build laid those out as three independent flex rows, so the
     labels never actually sat under their nodes. */
  const CURRENT = 1;
  const stages = [
    { name: "Ops", state: "Approved" },
    { name: "Finance", state: "In review" },
    { name: "Head", state: "Queued" },
    { name: "CFO", state: "Queued" },
    { name: "Control", state: "Queued" },
  ];

  return (
    <Card className="w-[244px]">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-[15px] font-bold">Approval matrix</span>
        <span className="font-mono text-[9.5px] font-semibold text-[var(--muted)]">
          {CURRENT + 1}/{stages.length}
        </span>
      </div>

      <div className="grid grid-cols-5">
        {stages.map((st, i) => {
          const done = i < CURRENT;
          const current = i === CURRENT;
          return (
            <div key={st.name} className="relative flex flex-col items-center">
              {/* connector runs from the previous node's centre to this one */}
              {i > 0 && (
                <span
                  className={`absolute right-1/2 top-3 h-[1.5px] w-full -translate-y-1/2 ${
                    i <= CURRENT ? "bg-[var(--green)]/55" : "bg-[var(--green-line)]"
                  }`}
                />
              )}
              <span
                className={`relative z-10 grid h-6 w-6 place-items-center rounded-full text-[10.5px] font-semibold ${
                  done
                    ? "bg-[var(--green)] text-white"
                    : current
                      ? "bg-white text-[var(--green)] ring-2 ring-[var(--green)] shadow-[0_0_0_3px_rgba(14,90,56,0.12)]"
                      : "border border-[var(--green-line)] bg-[var(--panel)] text-[var(--muted)]"
                }`}
              >
                {done ? (
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3.6 8.4l2.9 2.9 5.9-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={`mt-1.5 text-[9px] leading-none ${
                  current ? "font-semibold text-[var(--ink)]" : "text-[var(--muted)]"
                }`}
              >
                {st.name}
              </span>
              <span
                className={`mt-[3px] text-[8.5px] leading-none ${
                  done ? "text-[var(--green)]" : current ? "text-[var(--coral-hover)]" : "text-[var(--muted)]/60"
                }`}
              >
                {st.state}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-3 space-y-1.5 border-t border-[var(--border)] pt-2.5 text-[11px]">
        <div className="flex justify-between gap-2">
          <span className="shrink-0 text-[var(--muted)]">Delegation</span>
          <span className="truncate font-medium">Rohan Mehta → Priya Shah</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="shrink-0 text-[var(--muted)]">Audit</span>
          <span className="font-mono">Ananya · 09:42</span>
        </div>
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
    <Card className="w-[264px]">
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
          <div className="flex items-center gap-1.5 pt-1.5" aria-hidden>
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                className="h-[5px] w-[5px] rounded-full bg-[var(--green)]/45"
                style={{ animation: `askdot 1.1s ${d * 0.16}s ease-in-out infinite` }}
              />
            ))}
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
      className="relative w-[206px] rounded-[38px] border border-[var(--border)] p-[7px] shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_28px_60px_-30px_rgba(11,74,46,0.38),0_8px_20px_-12px_rgba(11,74,46,0.2)]"
      style={{ background: "linear-gradient(150deg, #f3efe5, #ded9cb 55%, #ebe6da)" }}
    >
      {/* side buttons — soft grooves, not hard black bars */}
      <span className="absolute -left-[1.5px] top-[92px] h-9 w-[2.5px] rounded-l bg-[var(--ink)]/18" />
      <span className="absolute -left-[1.5px] top-[132px] h-9 w-[2.5px] rounded-l bg-[var(--ink)]/18" />
      <span className="absolute -right-[1.5px] top-[110px] h-14 w-[2.5px] rounded-r bg-[var(--ink)]/18" />

      <div className="relative overflow-hidden rounded-[32px] bg-[var(--panel)] shadow-[0_0_0_1px_rgba(20,40,25,0.12)]">
        {/* screen gloss */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[32px]"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.35), transparent 32%)" }}
        />
        {/* dynamic island */}
        <div className="absolute left-1/2 top-[7px] z-20 h-[19px] w-[54px] -translate-x-1/2 rounded-full bg-[var(--ink)]/70" />

        {/* status bar — sized to clear the island. At a 192px screen width the whole
            right cluster gets ~48px, so it carries icons only: the battery cell already
            shows its level, and a "86" numeral beside it was the thing pushing the row
            under the island. */}
        <div className="flex items-center justify-between px-4 pt-[11px] text-[9.5px] font-semibold text-[var(--ink)]/70">
          <span className="tabular-nums tracking-[0.01em]">9:41</span>
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

        {/* header */}
        <div className="flex items-center justify-between px-4 pb-2 pt-2">
          <span className="text-[15px] text-[var(--muted)]">‹</span>
          <span className="text-[13px] font-bold">Attendance</span>
          <span className="relative text-[13px] text-[var(--muted)]">
            ⌾<span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[var(--coral)]" />
          </span>
        </div>

        {/* person */}
        <div className="flex items-center gap-2.5 px-4 pb-2">
          <span className="block h-9 w-9 shrink-0 overflow-hidden rounded-full">
            <img src={avatarAnanya} alt="" aria-hidden className="h-full w-full object-cover" />
          </span>
          <div className="leading-tight">
            <div className="text-[13px] font-bold">Ananya Rao</div>
            <div className="text-[10px] text-[var(--muted)]">Shift A · Pune Plant</div>
          </div>
        </div>

        {/* map with geofence */}
        <div className="relative mx-3 h-[92px] overflow-hidden rounded-2xl bg-[#e9f0e8]">
          {/* Drawn like a real map tile: land, parcels, then roads as casing + fill.
             The casing/fill pair is what makes strokes read as streets rather than lines. */}
          <svg viewBox="0 0 190 92" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
            <rect width="190" height="92" fill="#e9f0e8" />

            {/* parkland */}
            <path d="M137 44 L178 38 L185 68 L145 75 Z" fill="#0e5a38" opacity="0.15" />
            {/* the plant site itself, so the geofence sits over a real parcel */}
            <path d="M70 34 L116 30 L119 64 L73 68 Z" fill="#0e5a38" opacity="0.10" />
            <path
              d="M70 34 L116 30 L119 64 L73 68 Z"
              fill="none"
              stroke="#0e5a38"
              strokeWidth="0.8"
              strokeDasharray="2.5 2"
              opacity="0.35"
            />
            <path d="M-4 -4 L38 -4 L34 14 L-4 17 Z" fill="#0e5a38" opacity="0.09" />

            {/* building footprints, angled slightly so nothing lines up perfectly */}
            <g fill="#0e5a38" opacity="0.14">
              <rect x="8" y="26" width="17" height="10" rx="1.5" transform="rotate(-4 16 31)" />
              <rect x="30" y="24" width="9" height="10" rx="1.5" transform="rotate(-4 34 29)" />
              <rect x="58" y="26" width="14" height="9" rx="1.5" transform="rotate(-3 65 30)" />
              <rect x="76" y="25" width="10" height="9" rx="1.5" transform="rotate(-3 81 29)" />
              <rect x="96" y="22" width="18" height="10" rx="1.5" transform="rotate(-3 105 27)" />
              <rect x="140" y="16" width="15" height="8" rx="1.5" transform="rotate(-2 147 20)" />
              <rect x="160" y="14" width="12" height="8" rx="1.5" transform="rotate(-2 166 18)" />
              <rect x="8" y="68" width="16" height="11" rx="1.5" transform="rotate(-3 16 73)" />
              <rect x="28" y="67" width="10" height="11" rx="1.5" transform="rotate(-3 33 72)" />
              <rect x="60" y="64" width="19" height="11" rx="1.5" transform="rotate(-3 69 69)" />
              <rect x="88" y="62" width="12" height="11" rx="1.5" transform="rotate(-3 94 67)" />
              <rect x="150" y="82" width="16" height="10" rx="1.5" transform="rotate(-3 158 87)" />
            </g>

            {/* roads — darker casing underneath, pale fill on top */}
            {[
              "M-6 60 L64 55 L118 39 L196 33",
              "M-6 20 L58 16 L132 10 L196 6",
              "M-6 84 L92 79 L196 70",
              "M42 -6 L50 38 L44 98",
              "M122 -6 L130 38 L137 98",
              "M80 -6 L86 30",
              "M162 36 L168 98",
            ].map((d, i) => (
              <path
                key={`c${i}`}
                d={d}
                fill="none"
                stroke="#cfdccd"
                strokeWidth={(i < 1 ? 7 : i < 3 ? 4.6 : i < 5 ? 4 : 2.6) + 1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {[
              "M-6 60 L64 55 L118 39 L196 33",
              "M-6 20 L58 16 L132 10 L196 6",
              "M-6 84 L92 79 L196 70",
              "M42 -6 L50 38 L44 98",
              "M122 -6 L130 38 L137 98",
              "M80 -6 L86 30",
              "M162 36 L168 98",
            ].map((d, i) => (
              <path
                key={`f${i}`}
                d={d}
                fill="none"
                stroke="#fbfdfa"
                strokeWidth={i < 1 ? 7 : i < 3 ? 4.6 : i < 5 ? 4 : 2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* approach track, running along the arterial into the site */}
            <path
              d="M-6 60 L64 55 L95 46"
              fill="none"
              stroke="#0e5a38"
              strokeWidth="2.2"
              strokeDasharray="3.5 4.5"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>

          {/* geofence ring + pin */}
          <span className="absolute left-1/2 top-1/2 h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--green)]/45 bg-[var(--green)]/12" />
          <span className="absolute left-1/2 top-1/2 grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[var(--green)] text-white ring-2 ring-white/80 shadow-[0_3px_8px_-2px_rgba(11,74,46,0.7)]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="2.6" />
            </svg>
          </span>
          <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-semibold text-[var(--green-deep)] shadow-[0_1px_4px_rgba(11,74,46,0.18)]">
            Inside geofence
          </span>
        </div>

        {/* confirmed status */}
        <div className="mx-3 mt-2.5 flex items-center gap-2 rounded-xl bg-[var(--green-soft)] px-2.5 py-2">
          <Check />
          <div className="leading-tight">
            <div className="text-[11px] font-bold text-[var(--green-deep)]">Location confirmed</div>
            <div className="text-[10px] text-[var(--muted)]">Pune Plant · Punched in 08:58</div>
          </div>
        </div>

        {/* punch button */}
        <div className="px-3 pt-3 pb-1.5">
          <div className="flex items-center gap-1 rounded-full bg-[var(--green)] p-1 text-[11px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(14,90,56,0.7)]">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-[12px] text-[var(--green)] shadow-sm">→</span>
            <span className="flex-1 whitespace-nowrap text-center">Swipe to punch out</span>
            <span className="h-6 w-6 shrink-0" aria-hidden />
          </div>
        </div>

        {/* home indicator */}
        <div className="flex justify-center pb-2 pt-1">
          <span className="h-1 w-24 rounded-full bg-[var(--ink)]/25" />
        </div>
      </div>
    </div>
  );
}

/* ---------- main dashboard (chrome matched to HROne product) ---------- */

// Deep brand green used by the product's header + rail
const DEEP = "#02563d";
const BRIGHT = "#00bf78";

const Ic = ({ d, size = 18 }: { d: ReactNode; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {d}
  </svg>
);

const icons = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4h6v3H9zM9 12h6M9 16h4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M22 20a6 6 0 0 0-4-5.6" />
    </>
  ),
  chart: <path d="M4 20V11M10 20V5M16 20v-6M2 20h20" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </>
  ),
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  bell: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10z" />
    </>
  ),
};

function Dashboard() {
  const railTop: (keyof typeof icons)[] = ["home", "mail", "clipboard", "calendar", "users", "chart", "settings"];
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

      <div className="flex min-h-0 flex-1">
        {/* left rail */}
        <div
          className="flex w-[56px] shrink-0 flex-col items-center justify-between py-3.5 text-white/65"
          style={{ background: `linear-gradient(${DEEP}, ${"#024530"})` }}
        >
          <div className="flex flex-col items-center gap-2.5">
            {railTop.map((k, i) => (
              <span
                key={k}
                className={`relative grid h-9 w-9 place-items-center rounded-xl transition-colors ${
                  i === 0 ? "bg-white text-[var(--green-deep)] shadow-sm" : "hover:bg-white/10 hover:text-white"
                }`}
              >
                <Ic d={icons[k]} />
                {k === "mail" && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#e56046] text-[9px] font-bold text-white">
                    3
                  </span>
                )}
              </span>
            ))}
          </div>
          <div className="flex flex-col items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl hover:bg-white/10">
              <Ic d={icons.bolt} />
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-xl hover:bg-white/10">
              <Ic d={icons.plus} />
            </span>
            <span className="block h-8 w-8 overflow-hidden rounded-full">
              {/* AVATAR.png has a white rim baked in — uneven, thickest at ~1.26x radius.
                  1.3 crops it away entirely so the avatar reads as a clean circle. */}
              <img src={avatarUser} alt="" aria-hidden className="h-full w-full scale-[1.3] object-cover" />
            </span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          {/* top header bar */}
          <div
            className="flex shrink-0 items-center gap-3 px-4 py-2.5 text-white"
            style={{ background: `linear-gradient(90deg, ${DEEP}, #045a41 55%, ${DEEP})` }}
          >
            {/* real HROne logo (full mark + wordmark) inverted to white on the dark header */}
            <img src={logoHr} alt="HROne" className="h-[20px] w-auto" style={{ filter: "brightness(0) invert(1)" }} />
            <span className="mx-1 h-4 w-px bg-white/25" />
            <button className="flex items-center gap-1 text-[12px] text-white/85">
              Workspace <Ic d={<path d="m6 9 6 6 6-6" />} size={12} />
            </button>
            <div className="mx-auto flex w-[42%] items-center gap-2 rounded-lg bg-white/12 px-3 py-1.5 text-[12px] text-white/70 ring-1 ring-white/10">
              <Ic d={<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>} size={14} />
              Search requests, reports, people…
              <span className="ml-auto rounded bg-white/15 px-1.5 py-0.5 text-[9px] text-white/70">⌘K</span>
            </div>
            <div className="flex items-center gap-1 text-white/80">
              <span className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10">
                <Ic d={icons.calendar} size={16} />
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10">
                <Ic d={icons.bulb} size={16} />
              </span>
              <span className="relative grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10">
                <Ic d={icons.bell} size={16} />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#e56046]" />
              </span>
            </div>
          </div>

          {/* content body — light, finished */}
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden bg-[#f9fafb] px-5 py-3.5">
            {/* page header */}
            <div className="flex shrink-0 items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h3 className="text-[19px] font-bold tracking-[-0.01em] text-[#101828]">Payroll run</h3>
                <span className="rounded-full bg-[#fffbeb] px-2.5 py-0.5 text-[11px] font-semibold text-[#e17100] ring-1 ring-[#e17100]/20">
                  Pre-approval
                </span>
                <span className="text-[12px] text-[#6a7282]">Sep 2026 · Aarvik Group</span>
              </div>
              <button
                className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm"
                style={{ background: BRIGHT }}
              >
                Run payroll <span className="text-white/80">→</span>
              </button>
            </div>

            {/* KPI cards */}
            <div className="grid shrink-0 grid-cols-3 gap-3">
              {[
                ["Total payout", "₹2.32 crore", "2,040 employees · 3 entities", false],
                ["Statutory dues", "₹32.00 lakh", "PF · ESI · PT · TDS · LWF", false],
                ["Run status", "Ready to run", "0 exceptions · 12 flags cleared", true],
              ].map(([label, value, sub, ok]) => (
                <div
                  key={label as string}
                  className={`rounded-xl border p-3 ${ok ? "border-[#00bf78]/30 bg-[#e6f6ec]" : "border-[#e5e7eb] bg-white"}`}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6a7282]">{label}</div>
                  <div className={`mt-1 text-[19px] font-bold ${ok ? "text-[var(--green-deep)]" : "text-[#101828]"}`}>
                    {value}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#6a7282]">{sub}</div>
                </div>
              ))}
            </div>

            {/* tables */}
            <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 overflow-hidden">
              <div className="flex min-h-0 flex-col rounded-xl border border-[#e5e7eb] bg-white p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#101828]">Run scope</span>
                  <span className="text-[10px] font-semibold text-[#6a7282]">3 entities</span>
                </div>
                <table className="w-full text-left text-[11.5px]">
                  <thead className="text-[#99a1af]">
                    <tr className="border-b border-[#e5e7eb]">
                      <th className="pb-1 font-medium">Entity</th>
                      <th className="pb-1 font-medium">Location</th>
                      <th className="pb-1 text-right font-medium">Emp.</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#364153]">
                    {[
                      ["Aarvik Manufacturing", "Pune Plant", "960"],
                      ["Aarvik Components", "Chennai Plant", "720"],
                      ["Aarvik Services", "Bengaluru", "360"],
                    ].map((r) => (
                      <tr key={r[0]} className="border-b border-[#f3f4f6]">
                        <td className="py-1.5 font-medium">{r[0]}</td>
                        <td className="py-1.5 text-[#6a7282]">{r[1]}</td>
                        <td className="py-1.5 text-right tabular-nums">{r[2]}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="pt-2 font-bold text-[#101828]">All entities</td>
                      <td className="pt-2 text-[#6a7282]" />
                      <td className="pt-2 text-right font-bold tabular-nums text-[#101828]">2,040</td>
                    </tr>
                  </tbody>
                </table>
                {/* headcount split footer */}
                <div className="mt-auto pt-3">
                  <div className="flex h-2 w-full overflow-hidden rounded-full">
                    <span className="h-full" style={{ width: "47%", background: "var(--green-deep)" }} />
                    <span className="h-full" style={{ width: "35%", background: "var(--green)" }} />
                    <span className="h-full" style={{ width: "18%", background: "#7cc59f" }} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#6a7282]">
                    <span>Pune 47%</span>
                    <span>Chennai 35%</span>
                    <span>Bengaluru 18%</span>
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 flex-col rounded-xl border border-[#e5e7eb] bg-white p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#101828]">Statutory deductions</span>
                  <span className="text-[10px] font-semibold text-[#6a7282]">Sep 2026</span>
                </div>
                <table className="w-full text-left text-[11.5px]">
                  <tbody className="text-[#364153]">
                    {[
                      ["PF", "Provident Fund", "₹16,00,000"],
                      ["ESI", "Employee State Ins.", "₹72,000"],
                      ["PT", "Professional Tax", "₹48,000"],
                      ["TDS", "Tax Deducted", "₹14,76,000"],
                    ].map((r) => (
                      <tr key={r[0]} className="border-b border-[#f3f4f6]">
                        <td className="py-[5px] font-semibold">{r[0]}</td>
                        <td className="py-[5px] text-[#6a7282]">{r[1]}</td>
                        <td className="py-[5px] text-right tabular-nums">{r[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* total footer */}
                <div className="mt-auto flex items-center justify-between rounded-lg bg-[#e6f6ec] px-3 py-2">
                  <span className="text-[11px] font-semibold text-[var(--green-deep)]">Total statutory</span>
                  <span className="text-[14px] font-bold tabular-nums text-[var(--green-deep)]">₹32,00,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* footer summary bar */}
          <div className="flex shrink-0 items-center gap-5 border-t border-[#e5e7eb] bg-white px-5 py-3">
            {[
              ["Gross", "₹2.64 crore", "#101828", false],
              ["Deductions", "− ₹32.00 lakh", "#b42318", false],
              ["Net payable", "₹2.32 crore", "var(--green-deep)", true],
            ].map(([label, val, color, strong], i) => (
              <div key={label as string} className="flex items-center gap-5">
                {i > 0 && <span className="h-8 w-px bg-[#eceef1]" />}
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#99a1af]">{label}</div>
                  <div
                    className={`tabular-nums ${strong ? "text-[17px] font-bold" : "text-[15px] font-semibold"}`}
                    style={{ color: color as string }}
                  >
                    {val}
                  </div>
                </div>
              </div>
            ))}

            <div className="ml-auto flex items-center gap-2.5">
              <span className="hidden items-center gap-1.5 text-[11px] text-[#6a7282] 2xl:flex">
                <Check /> Reconciled
              </span>
              <button className="rounded-lg border border-[#e5e7eb] px-3.5 py-2 text-[13px] font-semibold text-[#364152] transition-colors hover:bg-[#f3f4f6]">
                Save draft
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-[var(--green)] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(14,90,56,0.7)] transition-colors hover:bg-[var(--green-deep)]">
                Send for approval
                <span className="grid h-5 w-5 place-items-center rounded-md bg-white/20 text-[11px]">→</span>
              </button>
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
      setReserve(nextSectionTop < window.innerHeight ? mockH * (h - 1) : 0);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [heroScale]);

  // enter: 0 = big hero product on first view, 1 = settled smaller so cards have room
  const enter = win(p, 0, 0.5);
  const scale = hero - (hero - SETTLED_SCALE) * enter;


  return (
    <div ref={ref} className="relative mx-auto mt-10 max-w-[1320px] px-6 pb-10 md:px-12 min-[1360px]:pb-28">
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

        {/* cards settle fully in the side gutters — no overlap with the product */}
        <Float from={[-30, 24]} tilt={-2} t={win(p, 0.4, 0.62)} className="absolute right-[calc(50%+410px)] top-2 z-20 hidden min-[1360px]:block">
          <AskAI />
        </Float>
        <Float from={[-46, 40]} tilt={-1.4} t={win(p, 0.55, 0.78)} className="absolute -left-9 bottom-2 z-20 hidden min-[1360px]:block">
          <ApprovalMatrix />
        </Float>

        {/* the phone anchors the top of the right gutter, sharing its right edge with
            the card below it and with ApprovalMatrix's hang on the left */}
        <Float from={[34, 26]} tilt={2} t={win(p, 0.46, 0.68)} className="absolute -right-9 top-[-14px] z-30 hidden min-[1360px]:block">
          <PhoneAttendance />
        </Float>
        <Float from={[46, 52]} tilt={2.5} t={win(p, 0.66, 0.94)} className="absolute -right-9 bottom-2 z-20 hidden min-[1360px]:block">
          <MultiState />
        </Float>
      </div>

      {/* room for the hero blow-up to hang into — see `reserve` above */}
      <div aria-hidden style={{ height: reserve }} />
    </div>
  );
}
