import { NavBar, TopStripe } from "./Chrome";
import { ProductShowcase } from "./ProductShowcase";
import { Trust } from "./Trust";

export default function App() {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-50">
        <TopStripe />
        <NavBar />
      </header>

      <main>
        {/* hero copy */}
        <section className="mx-auto flex max-w-[1040px] flex-col items-center px-6 pb-3 pt-10 text-center sm:pt-14">
          {/* eyebrow — quiet label, tied tightly to the headline */}
          <span className="inline-flex items-center rounded-full border border-[var(--green-line)] bg-[var(--green-soft)]/70 px-3.5 py-[6px] font-mono text-[11px] font-medium uppercase leading-none tracking-[0.2em] text-[var(--green)]">
            Enterprise HR Software
          </span>

          {/* deliberate two-line break — keeps the rag even at every width */}
          <h1 className="mt-5 font-display text-[clamp(32px,5.6vw,78px)] font-semibold leading-[0.98] tracking-[-0.032em] text-[var(--ink)]">
            <span className="block">
              Built for <span className="text-[var(--green)]">complex</span>
            </span>
            <span className="block">HR operations</span>
          </h1>

          <p className="mt-[22px] w-full max-w-[600px] text-balance text-[19.5px] leading-[1.58] tracking-[-0.005em] text-[var(--muted)]">
            Bring payroll, workforce, talent and employee operations together with the control and depth
            complex organisations need.
          </p>

          <div className="mt-[30px] flex items-center justify-center">
            <button className="group inline-flex items-center gap-2.5 rounded-[11px] bg-[var(--coral)] px-7 py-3.5 text-[16px] font-semibold tracking-[-0.01em] text-white shadow-[0_10px_24px_-10px_rgba(233,97,74,0.55)] transition-all duration-200 hover:bg-[var(--coral-hover)] hover:shadow-[0_14px_28px_-10px_rgba(233,97,74,0.6)] active:translate-y-px">
              Get a free trial
              <svg
                aria-hidden
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <path
                  d="M3 8h9.5M8.75 4.25 12.5 8l-3.75 3.75"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </section>

        {/* animated product */}
        <ProductShowcase />

        {/* trust / logos / certified */}
        <Trust />
      </main>
    </div>
  );
}
