import { useEffect, useState } from "react";
import logoHr from "@/imports/logohr.png";
import { NavBar, TopStripe } from "./Chrome";
import { ProductShowcase } from "./ProductShowcase";
import { Trust } from "./Trust";

/* iPad portrait. Below this the hero is not a layout that degrades — it is a
   four-card composition arranged around an 880px product mock, and the gutters
   already switch off at 1360px. Rather than ship a broken or hollowed-out phone
   version of a desktop concept, the variation asks for a bigger screen. */
const DESKTOP_MIN = 768;

function useIsDesktop() {
  const query = `(min-width: ${DESKTOP_MIN}px)`;
  /* Read synchronously on first render so the page never flashes the wrong one —
     this is a client-rendered app, so window is always there. */
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    setIsDesktop(mq.matches);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return isDesktop;
}

function SmallScreenNotice() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center px-8 text-center">
      <img src={logoHr} alt="HROne" className="h-7 w-auto" />

      <h1 className="mt-8 font-display text-[clamp(26px,7.5vw,34px)] font-semibold leading-[1.1] tracking-[-0.025em] text-[var(--ink)]">
        Best viewed on a<br />
        <span className="text-[var(--green)]">desktop or laptop</span>
      </h1>

      <p className="mt-4 max-w-[300px] text-[15px] leading-[1.55] text-[var(--muted)]">
        This preview is built around a full-size product view. Open it on a wider screen to see it as
        intended.
      </p>

      <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-[var(--green-line)] bg-[var(--green-soft)]/70 px-3.5 py-[7px] font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--green)]">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="2" y="4" width="20" height="13" rx="2" />
          <path d="M8 20h8M12 17v3" />
        </svg>
        {DESKTOP_MIN}px or wider
      </span>
    </div>
  );
}

export default function App() {
  const isDesktop = useIsDesktop();
  if (!isDesktop) return <SmallScreenNotice />;

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
          <span className="inline-flex items-center rounded-full border border-[var(--green-line)] bg-[var(--green-soft)]/70 px-4 py-[7px] text-[13px] font-semibold uppercase leading-none tracking-[0.16em] text-[var(--green)]">
            One AI-Powered
          </span>

          {/* Four levels, each separated by one clear step rather than by colour alone:
              the eyebrow pill, the claim, what the claim is for, then the proof.

              Head and subhead are one sentence, so both sit in the h1. The head drops from
              the 101px this variation used for "Built for complex" to 80px because the new
              line is 24 characters against 17 — at the old size it outran the 1040px
              measure and wrapped. The subhead is set at ~55% of the head, which is what
              carries the hierarchy; keeping the ink-then-green structure as well means the
              two levels never compete for the same emphasis. Its tracking is looser than
              the head's -0.034em, which was tuned for display sizes and reads cramped at
              44px. */}
          <h1 className="mt-6 font-display font-semibold tracking-[-0.034em] text-[var(--ink)]">
            <span className="block text-[clamp(34px,5.6vw,80px)] leading-[0.95]">The Simplest HR Software</span>
            <span className="mt-[0.28em] block text-[clamp(20px,3.1vw,44px)] leading-[1.08] tracking-[-0.022em] text-[var(--green)]">
              To Automate the Most Complex Operations
            </span>
          </h1>

          {/* wider measure than the 640px this held before: the proof line is four short
              sentences rather than one long one, and 640 broke it across four ragged rows */}
          <p className="mt-[26px] w-full max-w-[720px] text-balance text-[clamp(17px,1.45vw,20.5px)] leading-[1.45] tracking-[-0.005em] text-[var(--muted)]">
            AI-supercharged HRMS. Trusted by 2,500+ brands. Used by 11 lakh+ users. Finally, HR feels
            right.
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
