import { useMemo, useRef, useState, type ReactNode } from "react";
import { calculate, inr, MAX_CTC, type Inputs, type Regime } from "./calc";
import { track } from "./track";

/* The calculator. The visitor fills one row and presses Calculate; nothing is
   shown before that, so the first number they see is their own.
   States: empty -> (Calculate) -> result -> inputs edited: result dims and the button
   reads Recalculate, so a shown number never disagrees with the fields above it.
   The breakup opens from the result and always uses the calculated inputs. */

const inWords = (n: number) =>
  n >= 1e7 ? `${+(n / 1e7).toFixed(2)} crore` : n >= 1e5 ? `${+(n / 1e5).toFixed(2)} lakh` : "";

const toNumber = (v: string) => Math.min(Number(v.replace(/[^\d]/g, "")) || 0, MAX_CTC);

function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-[10px] bg-[var(--cream-2)]/70 p-1">
      {options.map(([v, l]) => {
        const on = v === value;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(v)}
            className={`rounded-[7px] px-3.5 py-1.5 text-[13.5px] font-medium transition-all ${
              on ? "bg-white text-[var(--ink)] ring-1 ring-[var(--border)]" : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="flex items-baseline justify-between gap-2 text-[13.5px] font-medium text-[var(--ink)]">
        {label}
        {hint && <span className="text-[12.5px] font-normal text-[var(--muted)]">{hint}</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-[#b8432f]">
          {error}
        </p>
      )}
    </div>
  );
}

function MoneyInput({ id, value, onChange, placeholder, suffix, invalid }: { id: string; value: number; onChange: (v: number) => void; placeholder: string; suffix?: string; invalid?: boolean }) {
  return (
    <div
      className={`flex h-[52px] items-center rounded-[10px] border bg-white px-3.5 transition-colors focus-within:border-[var(--green)] focus-within:ring-4 focus-within:ring-[var(--green-soft)] ${
        invalid ? "border-[#d9553e]" : "border-[var(--border)]"
      }`}
    >
      <span className="text-[17px] text-[var(--muted)]">₹</span>
      <input
        id={id}
        inputMode="numeric"
        autoComplete="off"
        className="w-full min-w-0 bg-transparent px-2 text-[19px] font-semibold tabular-nums text-[var(--ink)] outline-none placeholder:text-[15px] placeholder:font-normal placeholder:text-[var(--muted)]/60"
        value={value ? value.toLocaleString("en-IN") : ""}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        onChange={(e) => onChange(toNumber(e.target.value))}
      />
      {suffix && <span className="shrink-0 whitespace-nowrap text-[13px] text-[var(--muted)]">{suffix}</span>}
    </div>
  );
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

/* Lead capture lives on the download: asking for the PDF opens a small email field in
   place of the button, then the PDF is generated. Needs wiring to the HubSpot form on
   the live site; here it validates, records the event and opens the print dialog. */
function DownloadBreakup() {
  const [asking, setAsking] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return setError("Enter a valid email address.");
    setError("");
    setSent(v);
    track("salary_breakup_email");
    setTimeout(() => window.print(), 50);
  };

  if (sent)
    return (
      <p role="status" className="text-[14px] text-[var(--green)]">
        PDF ready. We&apos;ve also sent a copy to <span className="font-semibold">{sent}</span>.
      </p>
    );

  if (!asking)
    return (
      <button
        type="button"
        onClick={() => setAsking(true)}
        className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--border)] px-4 py-2.5 text-[14px] font-semibold text-[var(--ink)] transition-colors hover:border-[var(--green-line)] hover:bg-[var(--green-soft)] hover:text-[var(--green)]"
      >
        <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
        </svg>
        Download breakup (PDF)
      </button>
    );

  return (
    <form onSubmit={submit} noValidate className="w-full sm:w-auto">
      <div className="flex gap-2">
        <label htmlFor="breakup-email" className="sr-only">
          Email
        </label>
        <input
          id="breakup-email"
          type="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email to send the PDF"
          aria-invalid={!!error}
          aria-describedby={error ? "breakup-email-error" : undefined}
          className="h-[42px] w-full min-w-0 rounded-[10px] border border-[var(--border)] bg-white px-3.5 text-[14px] outline-none transition-colors focus:border-[var(--green)] focus:ring-4 focus:ring-[var(--green-soft)] sm:w-[240px]"
        />
        <button type="submit" className="h-[42px] shrink-0 rounded-[10px] bg-[var(--green)] px-4 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--green-deep)]">
          Get PDF
        </button>
      </div>
      {error && (
        <p id="breakup-email-error" className="mt-1.5 text-[13px] text-[#b8432f]">
          {error}
        </p>
      )}
    </form>
  );
}

export default function Calculator() {
  const [inputs, setInputs] = useState<Inputs>({ ctc: 0, variable: 0, basicPct: 50, regime: "new" });
  /* the inputs as of the last Calculate; null until the first one */
  const [submitted, setSubmitted] = useState<Inputs | null>(null);
  const [errors, setErrors] = useState<{ ctc?: string; variable?: string }>({});
  const [runs, setRuns] = useState(0);
  const [view, setView] = useState<"month" | "year">("month");
  /* the breakup starts closed, like ET Money's; the link opens it and brings it into view */
  const [open, setOpen] = useState(false);
  const breakupRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const toggleBreakup = () => {
    const next = !open;
    setOpen(next);
    track("salary_breakup_toggle", { open: next });
    if (next) setTimeout(() => breakupRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  };
  const set = <K extends keyof Inputs>(k: K, v: Inputs[K]) => {
    setInputs((p) => ({ ...p, [k]: v }));
    if (k in errors) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const calculateNow = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!inputs.ctc) next.ctc = "Enter your annual CTC";
    else if (inputs.variable > inputs.ctc) next.variable = "Variable pay can't be more than CTC";
    setErrors(next);
    if (next.ctc || next.variable) {
      document.getElementById(next.ctc ? "ctc" : "variable")?.focus();
      return;
    }
    setSubmitted({ ...inputs });
    setRuns((n) => n + 1);
    track("salary_calc_submit", { regime: inputs.regime, recalculate: !!submitted });
    /* on narrow screens the result lands below the fold, so bring it up */
    if (window.innerWidth < 1024) setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
  };

  const r = useMemo(() => (submitted ? calculate(submitted) : null), [submitted]);
  const dirty =
    !!submitted &&
    (submitted.ctc !== inputs.ctc || submitted.variable !== inputs.variable || submitted.basicPct !== inputs.basicPct || submitted.regime !== inputs.regime);
  const d = view === "month" ? 12 : 1;
  const f = (n: number) => inr(n / d);
  const deductionsMonth = r ? (r.employeePf + r.professionalTax + r.taxOnSalary) / 12 : 0;
  const regimeName = submitted?.regime === "old" ? "old" : "new";

  return (
    <div className="space-y-5">
      <form id="calculator" onSubmit={calculateNow} noValidate className="scroll-mt-36 overflow-hidden rounded-[20px] border border-[var(--border)] bg-white">
        {/* fill: four labelled controls and the button, in one row */}
        <div className="grid items-start gap-5 p-6 sm:grid-cols-2 sm:p-7 lg:grid-cols-[1.3fr_1fr_1.15fr_auto_auto]">
          <Field id="ctc" label="Annual CTC" error={errors.ctc}>
            <MoneyInput id="ctc" value={inputs.ctc} placeholder="e.g. 18,00,000" suffix={inWords(inputs.ctc)} invalid={!!errors.ctc} onChange={(v) => set("ctc", v)} />
          </Field>
          <Field id="variable" label="Variable pay" error={errors.variable}>
            <MoneyInput id="variable" value={inputs.variable} placeholder="Optional" invalid={!!errors.variable} onChange={(v) => set("variable", v)} />
          </Field>
          <Field id="basic" label="Basic salary">
            <div className="flex h-[52px] items-center gap-4 rounded-[10px] border border-[var(--border)] bg-white px-4">
              <input
                id="basic"
                type="range"
                min={30}
                max={60}
                step={5}
                value={inputs.basicPct}
                aria-valuetext={`${inputs.basicPct}% of CTC`}
                onChange={(e) => set("basicPct", Number(e.target.value))}
                className="sc-range min-w-0 flex-1"
                style={{ ["--fill" as string]: `${((inputs.basicPct - 30) / 30) * 100}%` }}
              />
              <span className="shrink-0 whitespace-nowrap text-[15px] font-semibold tabular-nums text-[var(--ink)]">
                {inputs.basicPct}% <span className="font-normal text-[var(--muted)]">of CTC</span>
              </span>
            </div>
          </Field>
          <Field id="regime" label="Tax regime">
            <div id="regime" role="radiogroup" aria-label="Tax regime" className="flex h-[52px] rounded-[10px] bg-[var(--cream-2)]/70 p-1">
              {(
                [
                  ["new", "New"],
                  ["old", "Old"],
                ] as [Regime, string][]
              ).map(([v, l]) => {
                const on = inputs.regime === v;
                return (
                  <button
                    key={v}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => set("regime", v)}
                    className={`flex-1 rounded-[7px] px-5 text-[14.5px] font-semibold transition-colors ${
                      on ? "bg-white text-[var(--ink)] ring-1 ring-[var(--border)]" : "text-[var(--muted)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </Field>
          <div className="sm:col-span-2 lg:col-span-1 lg:pt-[28px]">
            <button
              type="submit"
              className="h-[52px] w-full rounded-[10px] bg-[var(--green)] px-7 text-[15.5px] font-semibold text-white transition-colors hover:bg-[var(--green-deep)] lg:w-[148px]"
            >
              {submitted ? "Recalculate" : "Calculate"}
            </button>
          </div>
        </div>

        {/* read: appears on Calculate. The number leads, two labelled figures explain it,
            and a full-width row opens the breakup directly underneath. */}
        {r && (
          <div ref={resultRef} className="border-t border-[var(--green-line)] bg-[var(--green-soft)]/60">
            <div className="grid gap-6 p-6 sm:p-7 md:grid-cols-[1fr_auto] md:items-end">
              <div aria-live="polite" className={`transition-opacity ${dirty ? "opacity-45" : ""}`}>
                <div className="text-[14px] font-medium text-[var(--green-deep)]">Your monthly in-hand salary</div>
                <div key={runs} className="mt-2 flex animate-[askin_.35s_ease-out] items-baseline gap-2">
                  <output htmlFor="ctc variable basic" className="text-[clamp(40px,4vw,52px)] font-bold leading-none tracking-[-0.025em] tabular-nums text-[var(--green)]">
                    {inr(r.inhand / 12)}
                  </output>
                  <span className="text-[16px] font-medium text-[var(--green-deep)]/70">/ month</span>
                </div>
              </div>

              <dl className={`grid grid-cols-2 gap-6 transition-opacity md:gap-0 md:divide-x md:divide-[var(--green-line)] ${dirty ? "opacity-45" : ""}`}>
                <div className="md:pr-8">
                  <dt className="text-[13px] text-[var(--ink)]/60">Yearly take-home</dt>
                  <dd className="mt-1 text-[20px] font-semibold tabular-nums text-[var(--ink)]">{inr(r.takeHome)}</dd>
                </div>
                <div className="md:pl-8">
                  <dt className="text-[13px] text-[var(--ink)]/60">Deductions a month</dt>
                  <dd className="mt-1 text-[20px] font-semibold tabular-nums text-[var(--ink)]">{inr(deductionsMonth)}</dd>
                </div>
              </dl>
            </div>

            {dirty ? (
              <p role="status" className="flex items-center gap-2 border-t border-[var(--green-line)] px-6 py-3.5 text-[14px] font-medium text-[var(--ink)] sm:px-7">
                <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[var(--green)]">
                  <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 2.5v2.6h-2.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Inputs changed. Press Recalculate to update.
              </p>
            ) : (
              <button
                type="button"
                onClick={toggleBreakup}
                aria-expanded={open}
                aria-controls="breakup"
                className="group flex w-full items-center justify-between border-t border-[var(--green-line)] px-6 py-3.5 text-left text-[14.5px] font-semibold text-[var(--green)] outline-none transition-colors hover:bg-[var(--green-soft)] focus-visible:bg-[var(--green-soft)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--green)] sm:px-7"
              >
                {open ? "Hide salary breakup" : "See how it's calculated: full salary breakup"}
                <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
                  <path d="M3.5 6l4.5 4.5L12.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        )}
      </form>

      {/* full breakup, collapsed until asked for */}
      {r && (
      <div
        ref={breakupRef}
        className={`grid scroll-mt-36 transition-[grid-template-rows,opacity] duration-300 ease-out print:grid-rows-[1fr] print:opacity-100 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
      <div className="min-h-0 overflow-hidden" inert={!open}>
      <div id="breakup" className={`rounded-[20px] border border-[var(--border)] bg-white p-6 transition-opacity sm:p-9 ${dirty ? "opacity-45" : ""}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[24px] font-bold tracking-[-0.02em]">Your full salary breakup</h2>
            <p className="mt-1 text-[14px] text-[var(--muted)]">
              For a CTC of <span className="tabular-nums text-[var(--ink)]">{inr(r.ctc)}</span>, {regimeName} tax regime
            </p>
          </div>
          <Segmented
            label="Period"
            value={view}
            options={[
              ["month", "Monthly"],
              ["year", "Annual"],
            ]}
            onChange={setView}
          />
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
            <Line label="Income tax (TDS)" value={f(r.taxOnSalary)} tone="minus" />
            <Line label="In-hand salary" value={f(r.inhand)} tone="hero" />
          </Column>
          <Column title="Paid by employer (inside CTC)">
            <Line label="Employer PF" value={f(r.employerPf)} />
            <Line label="Gratuity" value={f(r.gratuity)} />
            {r.variable > 0 && <Line label="Variable pay" value={f(r.variable)} />}
            <Line label="Cost to company" value={f(r.ctc)} tone="total" />
          </Column>
        </div>

        <div className="mt-8 flex flex-col gap-5 border-t border-[var(--border)] pt-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[640px] text-[12.5px] leading-[1.6] text-[var(--muted)]">
            {regimeName === "new"
              ? "New regime: ₹75,000 standard deduction, no tax up to ₹12 lakh taxable income (Section 87A) and 4% cess."
              : "Old regime: ₹50,000 standard deduction, PF under 80C and professional tax deducted, 4% cess. HRA exemption and other investments are not included."}{" "}
            HRA is taken as 50% of basic, PF is capped at ₹1,800 a month and professional tax at ₹2,400 a year. Variable
            pay is paid separately and is not part of the monthly salary. Surcharge and ESI are not included.
          </p>
          <div className="flex shrink-0 flex-wrap gap-2.5 print:hidden">
            <DownloadBreakup />
          </div>
        </div>
      </div>
      </div>
      </div>
      )}
    </div>
  );
}
