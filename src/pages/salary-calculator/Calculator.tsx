import { useMemo, useState, type ReactNode } from "react";
import { calculate, inr, MAX_CTC, type Inputs, type Result } from "./calc";

const SLIDER_MIN = 100000;
const SLIDER_MAX = 5000000;

/* "18 lakh" / "1.25 crore" under the CTC field, so a mistyped zero is obvious */
const inWords = (n: number) =>
  n >= 1e7 ? `${+(n / 1e7).toFixed(2)} crore` : n >= 1e5 ? `${+(n / 1e5).toFixed(2)} lakh` : n > 0 ? inr(n) : "";

const pct = (part: number, whole: number) => (whole > 0 ? (part / whole) * 100 : 0);

function Segmented<T extends string | number | boolean>({
  value,
  options,
  onChange,
  label,
  dark,
}: {
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
  label: string;
  dark?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={`inline-flex rounded-[10px] p-1 ${dark ? "bg-white/10" : "bg-[var(--cream-2)]/70"}`}>
      {options.map(([v, l]) => {
        const on = v === value;
        return (
          <button
            key={String(v)}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(v)}
            className={`rounded-[7px] px-3 py-1 text-[13px] font-medium transition-all ${
              on
                ? dark
                  ? "bg-white text-[var(--app-shell)] shadow-sm"
                  : "bg-white text-[var(--ink)] shadow-[0_1px_2px_rgba(20,40,25,0.12)]"
                : dark
                  ? "text-white/70 hover:text-white"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${on ? "bg-[var(--green)]" : "bg-[var(--ink)]/15"}`}
    >
      <span className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-[18px]" : "translate-x-0.5"}`} />
    </button>
  );
}

function Setting({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[12px] border border-[var(--border)] px-3.5 py-2.5">
      <div className="min-w-0">
        <div className="text-[13.5px] font-medium text-[var(--ink)]">{title}</div>
        {note && <div className="text-[12px] text-[var(--muted)]">{note}</div>}
      </div>
      {children}
    </div>
  );
}

function segments(r: Result) {
  return [
    { label: "In-hand", amt: r.inhand, color: "var(--green)" },
    { label: "Income tax", amt: r.tax, color: "var(--coral)" },
    { label: "Employee PF", amt: r.employeePf, color: "#5fae8e" },
    { label: "Employer PF + gratuity", amt: r.employerPf + r.gratuity, color: "#b7dccb" },
    { label: "Professional tax", amt: r.professionalTax, color: "#d4a017" },
  ];
}

function Line({ label, value, tone }: { label: string; value: string; tone?: "total" | "minus" | "hero" }) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 py-2.5 text-[14.5px] ${
        tone === "total" || tone === "hero" ? "mt-1 border-t border-[var(--border)] pt-3 font-semibold text-[var(--ink)]" : "text-[var(--ink)]/75"
      } ${tone === "hero" ? "text-[var(--green)]" : ""}`}
    >
      <span>{label}</span>
      <span className="tabular-nums">
        {tone === "minus" ? "− " : ""}
        {value}
      </span>
    </div>
  );
}

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="text-[14px] font-semibold text-[var(--ink)]">{title}</h4>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export default function Calculator() {
  const [inputs, setInputs] = useState<Inputs>({ ctc: 1800000, basicPct: 50, metro: true, pfCap: true, gratuity: true });
  const [view, setView] = useState<"month" | "year">("month");
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => setInputs((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => calculate(inputs), [inputs]);
  const segs = segments(r);
  const d = view === "month" ? 12 : 1;
  const f = (n: number) => inr(n / d);
  const share = Math.round(pct(r.inhand, r.ctc));
  const sliderVal = Math.min(Math.max(r.ctc, SLIDER_MIN), SLIDER_MAX);

  return (
    <div className="space-y-5">
      {/* calculator: sized so header, hero and this card fit one laptop screen */}
      <div
        id="calculator"
        className="grid scroll-mt-36 overflow-hidden rounded-[20px] border border-[var(--border)] bg-white shadow-[0_30px_80px_-40px_rgba(14,60,38,0.35)] lg:grid-cols-[1fr_420px]"
      >
        <div className="p-6">
          <label htmlFor="ctc" className="text-[14px] font-semibold text-[var(--ink)]">
            Your annual CTC
          </label>
          <div className="mt-2 flex items-center rounded-[12px] border border-[var(--border)] bg-[var(--cream)]/60 px-4 transition-colors focus-within:border-[var(--green)] focus-within:bg-white focus-within:ring-4 focus-within:ring-[var(--green-soft)]">
            <span className="text-[24px] font-medium text-[var(--muted)]">₹</span>
            <input
              id="ctc"
              inputMode="numeric"
              autoComplete="off"
              className="w-full min-w-0 bg-transparent px-2 py-2.5 text-[clamp(24px,2.6vw,30px)] font-bold tracking-[-0.02em] tabular-nums text-[var(--ink)] outline-none"
              value={inputs.ctc ? inputs.ctc.toLocaleString("en-IN") : ""}
              placeholder="18,00,000"
              onChange={(e) => set("ctc", Math.min(Number(e.target.value.replace(/[^\d]/g, "")) || 0, MAX_CTC))}
            />
            <span className="shrink-0 text-[13.5px] text-[var(--muted)]">{inWords(r.ctc) ? `${inWords(r.ctc)} a year` : "per year"}</span>
          </div>

          <input
            type="range"
            aria-label="Annual CTC"
            min={SLIDER_MIN}
            max={SLIDER_MAX}
            step={50000}
            value={sliderVal}
            onChange={(e) => set("ctc", Number(e.target.value))}
            className="sc-range mt-4 w-full"
            style={{ ["--fill" as string]: `${pct(sliderVal - SLIDER_MIN, SLIDER_MAX - SLIDER_MIN)}%` }}
          />

          {/* phones: the result panel sits below the fold, so echo it here */}
          <a
            href="#result"
            className="mt-4 flex items-center justify-between rounded-[12px] bg-[var(--green-soft)] px-4 py-3 text-[14px] text-[var(--green-deep)] lg:hidden"
          >
            <span>Monthly in-hand</span>
            <span className="font-semibold tabular-nums">{inr(r.inhand / 12)} ↓</span>
          </a>

          <div className="mt-4 border-t border-[var(--border)] pt-3.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[14px] font-semibold text-[var(--ink)]">Assumptions</span>
              <span className="text-[12.5px] text-[var(--muted)]">Check these against your offer letter</span>
            </div>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              <Setting title="Basic salary" note="Share of CTC">
                <Segmented label="Basic salary" value={inputs.basicPct} options={[[40, "40%"], [50, "50%"]]} onChange={(v) => set("basicPct", v)} />
              </Setting>
              <Setting title="City" note="Sets HRA">
                <Segmented label="City" value={inputs.metro} options={[[true, "Metro"], [false, "Other"]]} onChange={(v) => set("metro", v)} />
              </Setting>
              <Setting title="Cap PF at ₹1,800" note="₹15,000 wage ceiling">
                <Switch label="Cap PF" on={inputs.pfCap} onChange={(v) => set("pfCap", v)} />
              </Setting>
              <Setting title="Gratuity in CTC" note="4.81% of basic">
                <Switch label="Gratuity in CTC" on={inputs.gratuity} onChange={(v) => set("gratuity", v)} />
              </Setting>
            </div>
          </div>
        </div>

        {/* result */}
        <div id="result" className="flex scroll-mt-32 flex-col bg-[var(--app-shell)] p-6 text-white">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium text-white/70">Monthly in-hand salary</span>
            <span className="hidden text-[13px] text-white/50 sm:block">FY 2026-27, new regime</span>
          </div>
          <output
            htmlFor="ctc"
            aria-live="polite"
            className="mt-3 block text-[clamp(40px,4vw,52px)] font-bold leading-none tracking-[-0.02em] tabular-nums"
          >
            {inr(r.inhand / 12)}
          </output>
          <p className="mt-2.5 text-[14.5px] text-white/70">
            <span className="font-semibold text-white">{share}%</span> of your CTC ·{" "}
            <span className="tabular-nums text-white">{inr(r.inhand)}</span> a year
          </p>

          <div className="mt-5 text-[13px] font-medium text-white/70">Where your CTC goes</div>
          <div
            className="mt-2.5 flex h-2.5 gap-[2px] overflow-hidden rounded-full bg-white/10"
            role="img"
            aria-label={segs.map((s) => `${s.label} ${pct(s.amt, r.ctc).toFixed(1)}%`).join(", ")}
          >
            {segs.map((s) => (
              <span key={s.label} className="h-full transition-[width] duration-300 first:rounded-l-full last:rounded-r-full" style={{ width: `${pct(s.amt, r.ctc)}%`, background: s.color }} />
            ))}
          </div>
          <table className="mb-1 mt-3 w-full text-[13px]">
            <tbody>
              {segs.slice(1).map((s) => (
                <tr key={s.label} className="text-white/70">
                  <td className="py-[2px]">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
                      {s.label}
                    </span>
                  </td>
                  <td className="py-[2px] text-right tabular-nums text-white/90">{inr(s.amt / 12)}/mo</td>
                  <td className="w-14 py-[2px] text-right tabular-nums text-white/50">{pct(s.amt, r.ctc).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <a
            href="#breakup"
            className="group mt-5 inline-flex items-center justify-center gap-2 rounded-[10px] bg-white px-5 py-2.5 text-[14.5px] font-semibold text-[var(--app-shell)] transition-colors hover:bg-[var(--green-soft)] lg:mt-auto"
          >
            See full salary breakup
            <svg aria-hidden width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-y-0.5">
              <path d="M8 3v9.5M4.25 8.75 8 12.5l3.75-3.75" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* full breakup */}
      <div id="breakup" className="scroll-mt-36 rounded-[22px] border border-[var(--border)] bg-white p-6 sm:p-9">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[24px] font-bold tracking-[-0.02em]">Your full salary breakup</h2>
            <p className="mt-1 text-[14px] text-[var(--muted)]">
              For a CTC of <span className="tabular-nums text-[var(--ink)]">{inr(r.ctc)}</span>
            </p>
          </div>
          <Segmented label="Period" value={view} options={[["month", "Monthly"], ["year", "Annual"]]} onChange={setView} />
        </div>

        <div className="mt-7 grid gap-8 md:grid-cols-3 md:gap-10">
          <Column title="Earnings">
            <Line label="Basic salary" value={f(r.basic)} />
            <Line label="HRA" value={f(r.hra)} />
            <Line label="Special allowance" value={f(r.special)} />
            <Line label="Gross salary" value={f(r.gross)} tone="total" />
          </Column>
          <Column title="Deductions">
            <Line label="Employee PF" value={f(r.employeePf)} tone="minus" />
            <Line label="Professional tax" value={f(r.professionalTax)} tone="minus" />
            <Line label="Income tax (TDS)" value={f(r.tax)} tone="minus" />
            <Line label="In-hand salary" value={f(r.inhand)} tone="hero" />
          </Column>
          <Column title="Paid by employer (inside CTC)">
            <Line label="Employer PF" value={f(r.employerPf)} />
            <Line label="Gratuity" value={f(r.gratuity)} />
            <Line label="Cost to company" value={f(r.ctc)} tone="total" />
          </Column>
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-[var(--border)] pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[640px] text-[12.5px] leading-[1.6] text-[var(--muted)]">
            Estimate under the new tax regime: slabs, ₹75,000 standard deduction, Section 87A rebate up to ₹12 lakh
            taxable income and 4% cess. Professional tax taken as ₹2,400 a year; it varies by state. Surcharge, bonus
            and ESI are not included.
          </p>
          <div className="flex shrink-0 flex-wrap gap-2.5 print:hidden">
            <a
              href="https://hrone.cloud/tools/tds-calculator/"
              className="rounded-[10px] border border-[var(--border)] px-4 py-2.5 text-[14px] font-semibold text-[var(--ink)] transition-colors hover:border-[var(--green-line)] hover:bg-[var(--green-soft)] hover:text-[var(--green)]"
            >
              Compare old vs new regime
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-[10px] bg-[var(--green)] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--green-deep)]"
            >
              <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
              </svg>
              Download breakup (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
