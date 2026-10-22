import { useEffect, useState, type ReactNode } from "react";
import { NavBar, TopStripe } from "./Chrome";
import hrIcon from "@/imports/HRICON.svg";
import authorPhoto from "@/imports/author-placeholder.png";
import Calculator from "./Calculator";
import TrustPanel from "./TrustPanel";
import Credibility from "./Credibility";
import HomeFooter from "./HomeFooter";
import { calculate, inr } from "./calc";
import { track } from "./track";

/* The salary calculator page, served at /salary-calculator. It uses the simpler,
   ET Money-style calculator in Calculator.tsx.

   Salary calculator inner page (hrone.cloud/tools/salary-calculator), redesigned.
   Content and section order come from the SEO team's brief ("Salary calculator
   page - SEO, UX and CRO redesign"); the visual system is the homepage's , 
   cream ground, forest green, coral CTAs, Clash Grotesk over Public Sans.
   [Bracketed] text is placeholder copy the brief leaves for the SEO team to fill. */

const Arrow = () => (
  <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-200 group-hover:translate-x-0.5">
    <path d="M3 8h9.5M8.75 4.25 12.5 8l-3.75 3.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Eyebrow({ children, tone = "green" }: { children: ReactNode; tone?: "green" | "coral" | "light" }) {
  const c =
    tone === "coral"
      ? "text-[var(--coral)]"
      : tone === "light"
        ? "text-[#7fb89a]"
        : "text-[var(--green)]";
  return <span className={`text-[14px] font-semibold ${c}`}>{children}</span>;
}

function PrimaryBtn({ children, href = "#" }: { children: ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center gap-2.5 rounded-[11px] bg-[var(--coral)] px-6 py-3.5 text-[15.5px] font-semibold text-white transition-all hover:bg-[var(--coral-hover)] active:translate-y-px"
    >
      {children} <Arrow />
    </a>
  );
}

/* content */


const TOC = [
  { id: "how", label: "How in-hand salary is calculated" },
  { id: "example", label: "Example: ₹18 LPA CTC" },
  { id: "components", label: "Salary components explained" },
  { id: "regime", label: "New vs old tax regime" },
  { id: "mistakes", label: "Common mistakes" },
  { id: "faqs", label: "FAQs" },
];

const STEPS: [string, string][] = [
  ["Start with annual CTC", "the total your employer spends on you in a year."],
  ["Remove employer contributions", "employer PF and gratuity. This gives your gross salary."],
  ["Deduct employee PF", "12% of basic, often capped at ₹1,800 a month."],
  ["Deduct professional tax", "which depends on your state."],
  ["Deduct income tax (TDS)", "based on your tax regime. Divide by 12 for monthly in-hand pay."],
];

const COMPONENTS: [string, string, "Employer" | "Employee" | "Both"][] = [
  ["Basic salary", "Fixed core pay; PF and gratuity are based on it", "Employer"],
  ["HRA", "House rent allowance, part of gross pay", "Employer"],
  ["Special allowance", "Balancing amount after basic and HRA", "Employer"],
  ["Provident fund (PF)", "Retirement savings: 12% of basic from each side", "Both"],
  ["Gratuity", "Paid when you leave after eligible service", "Employer"],
  ["Professional tax", "State tax on employment, up to ₹2,500 a year", "Employee"],
  ["Income tax (TDS)", "Tax deducted monthly based on your regime", "Employee"],
];

const MISTAKES: [string, string][] = [
  ["Dividing CTC by 12.", "CTC includes employer PF and gratuity, which you don't get monthly."],
  ["Ignoring variable pay.", "Performance bonus in CTC is paid only if targets are met."],
  ["Forgetting state professional tax.", "It changes your in-hand pay slightly by state."],
  ["Assuming a higher basic is always better.", "It raises PF and gratuity, which can lower monthly in-hand pay."],
];

const FAQS: [string, string][] = [
  ["How do I calculate my in-hand salary from CTC?", "Subtract employer PF and gratuity from your CTC to get gross salary. Then subtract employee PF, professional tax and income tax. Divide the result by 12 for your monthly in-hand salary."],
  ["What percentage of CTC is in-hand salary?", "It depends on your basic salary, PF and tax. In the ₹18 lakh example on this page, about 87% of CTC reaches the bank. Use the calculator above for your exact number."],
  ["Why is my in-hand salary lower than CTC divided by 12?", "CTC includes employer PF and gratuity, which are not paid monthly. Employee PF, professional tax and TDS are also deducted from your monthly pay."],
  ["How much PF is deducted from my salary?", "Employee PF is 12% of basic salary plus DA. Many employers apply it on a wage ceiling of ₹15,000, which caps it at ₹1,800 a month."],
  ["Is there no income tax up to ₹12 lakh in the new regime?", "Yes. Under the new regime, taxable income up to ₹12 lakh gets a full rebate under Section 87A. With the ₹75,000 standard deduction, salaried income up to ₹12.75 lakh pays no tax."],
  ["How much professional tax is deducted?", "It depends on your state, up to ₹2,500 a year. Some states, such as Delhi, do not levy it. This calculator uses ₹2,400 a year as a default."],
  ["Is HRA part of in-hand salary?", "Yes. HRA is part of your gross salary and is paid every month. An HRA tax exemption is available only under the old tax regime."],
  ["Can HR use this calculator to create salary structures?", "Yes, for one employee at a time. To build CTC structures and run payroll for your whole team, HR teams use HROne Payroll."],
];

const READS = [
  { tag: "Payroll", title: "What is CTC? Meaning, components and calculation", time: "[X] min read" },
  { tag: "Tax", title: "New vs old tax regime: which is better for salaried employees?", time: "[X] min read" },
  { tag: "HR guide", title: "How to design a salary structure in India", time: "[X] min read" },
];

/* the next step after a result: the six tools people open right after this one */
const TOOLS = [
  { name: "TDS calculator", desc: "Compare tax under the old and new regime.", href: "https://hrone.cloud/tools/tds-calculator/" },
  { name: "Gratuity calculator", desc: "See the gratuity you get when you leave.", href: "https://hrone.cloud/tools/gratuity-calculator/" },
  { name: "Leave encashment calculator", desc: "Calculate pay for unused leave.", href: "https://hrone.cloud/tools/leave-encashment-calculator/" },
  { name: "Salary slip generator", desc: "Turn this breakup into a payslip.", href: "#" },
  { name: "Salary increment letter", desc: "Share a revised CTC with an employee.", href: "#" },
  { name: "Offer letter generator", desc: "Add this CTC breakup to an offer letter.", href: "#" },
];

/* the full tools index near the end of the page: [label, href]. Hrefs are the brief's where it
   gives them; the rest are placeholders until those pages' URLs are confirmed. */
const FREE_TOOLS: { h: string; l: [string, string][] }[] = [
  {
    h: "Calculators",
    l: [
      ["Salary calculator", "#calculator"],
      ["TDS calculator", "https://hrone.cloud/tools/tds-calculator/"],
      ["Gratuity calculator", "https://hrone.cloud/tools/gratuity-calculator/"],
      ["Leave encashment calculator", "https://hrone.cloud/tools/leave-encashment-calculator/"],
      ["HR software ROI calculator", "#"],
    ],
  },
  { h: "Letter generators", l: [["Offer letter", "#"], ["Salary increment letter", "#"], ["Appointment letter", "#"], ["Relieving letter", "#"]] },
  { h: "Payslips and templates", l: [["Payslip explained", "#"], ["Salary slip generator", "#"], ["Invoice generator", "#"], ["HR policy templates", "#"]] },
];

/* pieces */

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-36 text-[clamp(26px,2.8vw,34px)] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--ink)]">
      {children}
    </h2>
  );
}

const P = ({ children }: { children: ReactNode }) => <p className="mt-4 text-[16.5px] leading-[1.7] text-[var(--ink)]/75">{children}</p>;
const A = ({ children, href = "#" }: { children: ReactNode; href?: string }) => (
  <a href={href} className="font-medium text-[var(--green)] underline decoration-[var(--green-line)] underline-offset-4 hover:decoration-[var(--green)]">
    {children}
  </a>
);

function Faqs() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mt-6 divide-y divide-[var(--border)] rounded-[16px] border border-[var(--border)] bg-white">
      {FAQS.map(([q, a], i) => {
        const isOpen = open === i;
        return (
          <div key={q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 px-5 py-4.5 text-left text-[16px] font-semibold text-[var(--ink)] sm:px-6"
              >
                {q}
                <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className={`shrink-0 text-[var(--muted)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                  <path d="M2.5 5 7 9.5 11.5 5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </h3>
            <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[15.5px] leading-[1.65] text-[var(--muted)] sm:px-6 sm:pr-14">{a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ExampleTable() {
  /* computed, not typed in, the example can never disagree with the calculator */
  const r = calculate({ ctc: 1800000, variable: 0, basicPct: 50, regime: "new" });
  const rows: [string, number, "base" | "minus" | "total"][] = [
    ["Annual CTC", r.ctc, "base"],
    ["− Employer PF (₹1,800 × 12)", r.employerPf, "minus"],
    [`− Gratuity (4.81% of ${inr(r.basic)} basic)`, r.gratuity, "minus"],
    ["= Gross salary", r.gross, "total"],
    ["− Employee PF", r.employeePf, "minus"],
    ["− Professional tax", r.professionalTax, "minus"],
    [`− Income tax incl. 4% cess (taxable income ${inr(r.taxable)})`, r.tax, "minus"],
    ["= In-hand salary", r.inhand, "total"],
  ];
  return (
    <>
      <div className="mt-6 overflow-x-auto rounded-[16px] border border-[var(--border)] bg-white">
        <table className="w-full min-w-[520px] text-[14.5px]">
          <thead>
            <tr className="bg-[var(--cream)] text-left text-[12px] uppercase tracking-[0.08em] text-[var(--muted)]">
              <th className="px-5 py-3 font-medium">Step</th>
              <th className="px-5 py-3 text-right font-medium">Annual</th>
              <th className="px-5 py-3 text-right font-medium">Monthly</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {rows.map(([l, v, t], i) => (
              <tr
                key={l}
                className={
                  t === "total"
                    ? i === rows.length - 1
                      ? "bg-[var(--green-soft)] font-semibold text-[var(--green)]"
                      : "font-semibold text-[var(--ink)]"
                    : "text-[var(--ink)]/75"
                }
              >
                <td className="px-5 py-3">{l}</td>
                <td className="px-5 py-3 text-right tabular-nums">{inr(v)}</td>
                <td className="px-5 py-3 text-right tabular-nums">{inr(v / 12)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <P>
        So about <strong className="text-[var(--ink)]">{Math.round((r.inhand / r.ctc) * 100)}%</strong> of this CTC reaches the employee&apos;s bank.{" "}
        <A href="#calculator">Try your own numbers above</A>.
      </P>
    </>
  );
}

/* page */

export default function SalaryCalculatorPage() {
  const active = useActiveSection(TOC.map((t) => t.id));

  /* title and description lead with the target keywords ("in hand salary calculator",
     "salary calculator"); on the live site these belong in the server-rendered <head> */
  useEffect(() => {
    document.title = "In-Hand Salary Calculator FY 2026-27: CTC to Take-Home Pay | HROne";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Free in-hand salary calculator. Enter your CTC to see monthly take-home pay after PF, professional tax and income tax, under the new or old tax regime for FY 2026-27.";
  }, []);

  /* every demo, trial, pricing or expert link counts as a CTA click, named by its text */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("a, button");
      const text = el?.textContent?.trim() ?? "";
      if (el && /demo|trial|pricing|payroll expert|how it works|how hrone payroll works/i.test(text)) {
        track("salary_cta_click", { cta: text.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="min-h-full bg-[var(--cream)]">
      <header className="sticky top-0 z-50 print:hidden">
        <TopStripe />
        <NavBar />
      </header>

      <main>
        {/* hero + calculator */}
        <section className="mx-auto max-w-[1200px] px-4 pb-12 pt-5 sm:px-6 sm:pb-14">
          <nav aria-label="Breadcrumb" className="text-[13px] text-[var(--muted)] print:hidden">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><a href="#" className="hover:text-[var(--green)]">Home</a></li>
              <li aria-hidden>›</li>
              <li><a href="#" className="hover:text-[var(--green)]">Free HR tools</a></li>
              <li aria-hidden>›</li>
              <li aria-current="page" className="text-[var(--ink)]">Salary calculator</li>
            </ol>
          </nav>

          {/* one tight group (title → subhead → description → proof), one left edge shared
              with the calculator; the team-payroll prompt is a quiet link, not a second card */}
          <div className="mt-7 flex flex-col gap-5 sm:mt-9 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[780px]">
              <h1 className="font-display text-[clamp(34px,3.8vw,48px)] font-semibold leading-[1] tracking-[-0.035em]">In-Hand Salary Calculator</h1>
              <p className="mt-3 text-[17px] leading-[1.55] text-[var(--muted)]">
                Calculate your in-hand salary from CTC after PF, professional tax and income tax for FY 2026-27.
              </p>
            </div>

          </div>

          <div className="mt-4">
            <Calculator />
          </div>
        </section>

        <div className="print:hidden">
          {/* HR CTA: a follow-up to the result, on the calculator's own width, not a full slab */}
          <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6 sm:pb-20">
            {/* one card: the ask on top, the proof for it underneath */}
            <div className="overflow-hidden rounded-[20px] border border-[var(--border)] bg-white">
            <div className="flex flex-col gap-6 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-white border border-[var(--green-line)]">
                  <img src={hrIcon} alt="" aria-hidden className="h-6 w-auto" />
                </span>
                <div>
                  <h2 className="text-[20px] font-bold leading-[1.25] tracking-[-0.01em] text-[var(--ink)]">Need salary breakups for your whole team?</h2>
                  <p className="mt-1 max-w-[620px] text-[15px] leading-[1.55] text-[var(--ink)]/70">
                    HROne Payroll builds CTC structures, calculates PF, ESI, PT and TDS for each employee and sends their
                    payslips.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-3 pl-16 lg:pl-0">
                <PrimaryBtn>Book a payroll demo</PrimaryBtn>

              </div>
            </div>
            <Credibility />
            </div>
          </section>

          {/* what to calculate next: right after the result, the visitor's natural next step */}
          <section className="mx-auto max-w-[1200px] px-6 pb-20">
            <h2 className="text-[clamp(26px,2.8vw,34px)] font-bold tracking-[-0.02em]">What to calculate next</h2>
            <p className="mt-2 text-[16px] text-[var(--muted)]">Free tools people use right after the salary calculator.</p>
            <div className="mt-8 grid gap-px overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
              {TOOLS.map((t) => (
                <a key={t.name} href={t.href} className="group flex items-start justify-between gap-4 bg-white p-6 transition-colors hover:bg-[var(--cream)]">
                  <div>
                    <div className="text-[16.5px] font-semibold text-[var(--ink)] group-hover:text-[var(--green)]">{t.name}</div>
                    <div className="mt-1 text-[14.5px] text-[var(--muted)]">{t.desc}</div>
                  </div>
                  <span className="mt-1 text-[var(--muted)] group-hover:text-[var(--green)]">
                    <Arrow />
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* guide */}
          <section className="border-t border-[var(--border)] bg-white">
            <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 lg:grid-cols-[250px_1fr] lg:gap-16">
              <aside className="hidden lg:block">
                <div className="sticky top-36 space-y-6">
                  <nav aria-label="On this page">
                    <Eyebrow>On this page</Eyebrow>
                    <ul className="mt-4 space-y-1 border-l border-[var(--border)]">
                      {TOC.map((t) => (
                        <li key={t.id}>
                          <a
                            href={`#${t.id}`}
                            className={`-ml-px block border-l-2 py-1.5 pl-4 text-[14px] transition-colors ${
                              active === t.id ? "border-[var(--green)] font-semibold text-[var(--green)]" : "border-transparent text-[var(--muted)] hover:text-[var(--ink)]"
                            }`}
                          >
                            {t.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <div className="rounded-[16px] bg-[var(--cream)] p-5">
                    {/* Excel's app icon, redrawn as SVG so it sits cleanly on the cream card */}
                    <svg aria-label="Microsoft Excel" role="img" width="44" height="44" viewBox="0 0 48 48" className="mb-4">
                      <defs>
                        <clipPath id="xl-doc">
                          <rect x="13" y="3" width="33" height="42" rx="2.5" />
                        </clipPath>
                        <linearGradient id="xl-tile" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor="#18884F" />
                          <stop offset="1" stopColor="#0B6631" />
                        </linearGradient>
                      </defs>
                      <g clipPath="url(#xl-doc)">
                        <rect x="13" y="3" width="16.5" height="10.5" fill="#21A366" />
                        <rect x="29.5" y="3" width="16.5" height="10.5" fill="#33C481" />
                        <rect x="13" y="13.5" width="16.5" height="10.5" fill="#107C41" />
                        <rect x="29.5" y="13.5" width="16.5" height="10.5" fill="#21A366" />
                        <rect x="13" y="24" width="16.5" height="10.5" fill="#185C37" />
                        <rect x="29.5" y="24" width="16.5" height="10.5" fill="#107C41" />
                        <rect x="13" y="34.5" width="33" height="10.5" fill="#185C37" />
                        <rect x="13" y="11" width="16.5" height="28.5" rx="2" fill="#000" opacity=".18" />
                      </g>
                      <rect x="2" y="12" width="25" height="25" rx="2.5" fill="url(#xl-tile)" />
                      <path
                        transform="translate(-2 -1.1)"
                        fill="#fff"
                        d="M9.807 33.067l4.836-7.486L10.214 18.1h3.564l2.418 4.785c.223.454.376.792.459 1.015h.031c.159-.363.326-.716.5-1.058L19.769 18.1h3.27l-4.544 7.438 4.659 7.528H19.67l-2.794-5.226a4.4 4.4 0 0 1-.334-.7H16.5a3.3 3.3 0 0 1-.323.677l-2.876 5.249Z"
                      />
                    </svg>
                    <div className="text-[15px] font-semibold">Doing payroll in Excel?</div>
                    <p className="mt-1 text-[13.5px] leading-[1.5] text-[var(--muted)]">See how HR teams run compliant payroll in HROne.</p>
                    <a href="#" className="mt-4 inline-block rounded-[9px] bg-[var(--coral)] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--coral-hover)]">
                      Book a free demo
                    </a>
                  </div>
                </div>
              </aside>

              <article className="min-w-0 max-w-[760px]">
                {/* how */}
                <H2 id="how">How is in-hand salary calculated from CTC?</H2>
                <P>
                  Your in-hand salary is your CTC minus employer PF, gratuity, employee PF, professional tax and income
                  tax (TDS). It is the amount that reaches your bank account each month.
                </P>
                <div className="mt-6 rounded-[14px] border border-[var(--green-line)] bg-[var(--green-soft)]/60 px-5 py-4 text-[15px] font-medium leading-[1.7] text-[var(--green-deep)]">
                  In-hand salary = CTC − Employer PF − Gratuity − Employee PF − Professional tax − Income tax
                </div>
                <ol className="mt-6 space-y-3">
                  {STEPS.map(([b, rest], i) => (
                    <li key={b} className="flex gap-4">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--cream-2)] text-[13px] font-semibold text-[var(--green)]">{i + 1}</span>
                      <p className="pt-0.5 text-[16px] leading-[1.6] text-[var(--ink)]/75">
                        <strong className="font-semibold text-[var(--ink)]">{b}</strong>: {rest}
                      </p>
                    </li>
                  ))}
                </ol>

                {/* example */}
                <div className="mt-16">
                  <H2 id="example">Example: in-hand salary for ₹18 LPA CTC</H2>
                  <P>Assumptions: basic is 50% of CTC, PF is capped, gratuity is part of CTC, metro city, new tax regime.</P>
                  <ExampleTable />
                </div>

                {/* inline CTA */}
                <div className="mt-10 flex flex-col gap-5 rounded-[18px] border border-[var(--border)] bg-[var(--cream)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                  <div>
                    <div className="text-[17px] font-semibold">Still building salary structures in Excel?</div>
                    <p className="mt-1 max-w-[460px] text-[14.5px] leading-[1.55] text-[var(--muted)]">
                      Set salary templates once in HROne. Every new joiner&apos;s CTC, deductions and in-hand pay are calculated for you.
                    </p>
                  </div>
                  <a href="#" className="shrink-0 rounded-[10px] bg-[var(--green)] px-5 py-3 text-center text-[14.5px] font-semibold text-white transition-colors hover:bg-[var(--green-deep)]">
                    Get a demo
                  </a>
                </div>

                {/* components */}
                <div className="mt-16">
                  <H2 id="components">Salary components explained</H2>
                  <div className="mt-6 overflow-x-auto rounded-[16px] border border-[var(--border)]">
                    <table className="w-full min-w-[520px] text-[14.5px]">
                      <thead>
                        <tr className="bg-[var(--cream)] text-left text-[12px] uppercase tracking-[0.08em] text-[var(--muted)]">
                          <th className="px-5 py-3 font-medium">Component</th>
                          <th className="px-5 py-3 font-medium">What it is</th>
                          <th className="px-5 py-3 font-medium">Paid by</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {COMPONENTS.map(([c, w, by]) => (
                          <tr key={c}>
                            <td className="px-5 py-3.5 font-semibold text-[var(--ink)]">{c}</td>
                            <td className="px-5 py-3.5 text-[var(--ink)]/75">{w}</td>
                            <td className="px-5 py-3.5">
                              <span
                                className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${
                                  by === "Employer" ? "bg-[var(--green-soft)] text-[var(--green)]" : by === "Employee" ? "bg-[#fde6df] text-[#b8432f]" : "bg-[var(--cream-2)] text-[var(--ink)]/80"
                                }`}
                              >
                                {by}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* regime */}
                <div className="mt-16">
                  <H2 id="regime">New vs old tax regime: which gives more in-hand pay?</H2>
                  <P>
                    Under the new regime, there is no income tax if your taxable income is up to ₹12 lakh, thanks to the
                    Section 87A rebate. With the ₹75,000 standard deduction, salaried people earning up to ₹12.75 lakh pay
                    no tax.
                  </P>
                  <P>
                    The old regime can still work out better if you claim large deductions such as HRA exemption, 80C and
                    home loan interest. <A href="https://hrone.cloud/tools/tds-calculator/">Compare both regimes in our TDS calculator</A>.
                  </P>
                </div>

                {/* mistakes */}
                <div className="mt-16">
                  <H2 id="mistakes">Common mistakes when reading your CTC</H2>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {MISTAKES.map(([b, rest]) => (
                      <li key={b} className="rounded-[14px] border border-[var(--border)] p-5">
                        <div className="flex items-start gap-2.5">
                          <svg aria-hidden width="18" height="18" viewBox="0 0 20 20" className="mt-0.5 shrink-0 text-[var(--coral)]">
                            <circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                          <div>
                            <div className="text-[15.5px] font-semibold text-[var(--ink)]">{b}</div>
                            <div className="mt-1 text-[14.5px] leading-[1.55] text-[var(--muted)]">{rest}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* video */}
                <div className="mt-16">
                  <h3 className="text-[18px] font-semibold">Watch: how HR teams run payroll in HROne</h3>
                  <div className="mt-4 grid aspect-video place-items-center rounded-[18px] bg-[var(--app-shell)] text-white/60">
                    <div className="flex flex-col items-center gap-3">
                      <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-[var(--app-shell)]">
                        <svg aria-hidden width="20" height="20" viewBox="0 0 20 20"><path d="M6 4l10 6-10 6z" fill="currentColor" /></svg>
                      </span>
                      <span className="text-[13.5px]">[Video: 2-minute payroll walkthrough]</span>
                    </div>
                  </div>
                </div>

                {/* faqs */}
                <div className="mt-16">
                  <H2 id="faqs">Frequently asked questions</H2>
                  <Faqs />
                </div>

                {/* author */}
                <div className="mt-12 flex gap-4 rounded-[16px] bg-[var(--cream)] p-6">
                  {/* PLACEHOLDER: a product-mockup face, not a real person. Replace with the
                      actual author's photo along with the [Author name] text before launch. */}
                  <img src={authorPhoto} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white" />
                  <div className="text-[14px] leading-[1.6] text-[var(--muted)]">
                    <div className="text-[15px] font-semibold text-[var(--ink)]">Written by [Author name], [Designation]</div>
                    Reviewed by [Payroll expert name], [Designation, years of payroll experience]. Tax rules checked against
                    Income Tax Department and EPFO sources on [date]. Last updated: [DD Mon 2026].
                  </div>
                </div>

                {/* related reads */}
                <div className="mt-16">
                  <h3 className="text-[18px] font-semibold">Related reads</h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {READS.map((r) => (
                      <a key={r.title} href="#" className="group flex flex-col rounded-[16px] border border-[var(--border)] p-5 transition-colors hover:border-[var(--green-line)] hover:bg-[var(--cream)]">
                        <Eyebrow tone="coral">{r.tag}</Eyebrow>
                        <span className="mt-3 flex-1 text-[15.5px] font-semibold leading-[1.4] text-[var(--ink)] group-hover:text-[var(--green)]">{r.title}</span>
                        <span className="mt-4 text-[13px] text-[var(--muted)]">{r.time}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* tools directory: the employee's next step, before the final ask */}
          <section aria-labelledby="free-tools" className="mx-auto max-w-[1200px] px-6 pb-12 pt-16">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <h2 id="free-tools" className="text-[22px] font-bold tracking-[-0.015em]">
                More free HR tools
              </h2>
              <a href="#" className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-[var(--green)]">
                All 25+ free HR tools <Arrow />
              </a>
            </div>
            <div className="mt-4 grid gap-x-8 gap-y-7 border-t border-[var(--border)] pt-6 sm:grid-cols-3">
              {FREE_TOOLS.map((c) => (
                <div key={c.h}>
                  <h3 className="text-[13.5px] font-semibold text-[var(--ink)]">{c.h}</h3>
                  <ul className="mt-3 space-y-2 text-[14.5px] text-[var(--ink)]/80">
                    {c.l.map(([label, href]) => {
                      const current = label === "Salary calculator";
                      return (
                        <li key={label}>
                          <a
                            href={href}
                            aria-current={current ? "page" : undefined}
                            className={`transition-colors hover:text-[var(--green)] ${current ? "font-semibold text-[var(--green)]" : ""}`}
                          >
                            {label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* closing CTA: pitch left, proof right */}
          <section className="mx-auto max-w-[1200px] px-6 pb-24">
            <div className="grid overflow-hidden rounded-[24px] border border-[var(--border)] bg-white lg:grid-cols-[1.25fr_1fr]">
              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-2.5">
                  <img src={hrIcon} alt="" aria-hidden className="h-6 w-auto" />
                  <Eyebrow>HROne Payroll</Eyebrow>
                </div>
                <h2 className="mt-4 text-balance text-[clamp(30px,3.6vw,46px)] font-bold leading-[1.04] tracking-[-0.02em]">
                  Stop calculating salaries <span className="whitespace-nowrap text-[var(--green)]">one by one</span>
                </h2>
                <p className="mt-4 max-w-[480px] text-[16.5px] leading-[1.6] text-[var(--muted)]">
                  Set up your salary structures once, and HROne calculates pay for every employee after that.
                </p>
                <ul className="mt-6 space-y-3 text-[15.5px] text-[var(--ink)]/80">
                  {["Salary templates for each grade and location", "PF, ESI, PT and TDS calculated every pay cycle", "Payslips emailed to employees on payday"].map((t) => (
                    <li key={t} className="flex gap-3">
                      <svg aria-hidden width="18" height="18" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0 text-[var(--green)]">
                        <path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <PrimaryBtn>Book a free demo</PrimaryBtn>
                  <a href="#" className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-[var(--green)]">
                    See pricing <Arrow />
                  </a>
                </div>
              </div>

              <TrustPanel />
            </div>
          </section>
        </div>
      </main>

      <div className="print:hidden">
        <HomeFooter />
      </div>
    </div>
  );
}
