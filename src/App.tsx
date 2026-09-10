import { NavBar, TopStripe } from "./components/Chrome";
import { ProductShowcase } from "./components/ProductShowcase";
import { Trust } from "./components/Trust";

export default function App() {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-50">
        <TopStripe />
        <NavBar />
      </header>

      <main>
        {/* hero copy */}
        <section className="mx-auto flex max-w-[960px] flex-col items-center px-6 pb-2 pt-10 text-center sm:pt-14">
          {/* eyebrow with a full animated gradient-ring border */}
          <span className="relative inline-flex overflow-hidden rounded-full p-[1.5px]">
            <span
              aria-hidden
              className="absolute inset-[-150%] animate-[borderspin_6s_linear_infinite]"
              style={{
                background:
                  "conic-gradient(from 0deg, var(--coral), var(--green) 33%, var(--coral) 66%, var(--green) 100%)",
              }}
            />
            <span className="relative z-10 rounded-full bg-[var(--cream)] px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--coral)]">
              Enterprise HR Software
            </span>
          </span>

          <h1 className="mt-5 whitespace-nowrap font-display text-[clamp(26px,7.4vw,88px)] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--ink)]">
            Built for <span className="text-[var(--green)]">complex</span> HR
          </h1>

          <p className="mt-6 max-w-[600px] text-[17px] leading-relaxed text-[var(--muted)]">
            One platform, built around the way your organisation works — with the control and intelligent
            automation complex operations demand.
          </p>

          <div className="mt-9 flex items-center justify-center">
            <button className="group flex items-center gap-3 rounded-xl bg-[var(--coral)] px-7 py-3.5 text-[16px] font-semibold text-white shadow-[0_16px_34px_-14px_rgba(233,97,74,0.8)] transition-all hover:bg-[var(--coral-hover)] hover:shadow-[0_20px_40px_-14px_rgba(233,97,74,0.9)]">
              Get a free trial
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/20 transition-transform group-hover:translate-x-0.5">
                →
              </span>
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
