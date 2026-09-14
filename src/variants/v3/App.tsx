import { NavBar, TopStripe } from "./Chrome";
import { ProductShowcase } from "./ProductShowcase";
import { Trust } from "./Trust";

/* The flowing ribbon band from go.hrone.cloud — their 614x191 artwork at 9%, stretched
   past both edges so the curves run off-screen rather than terminating in view. It clips
   itself rather than the page, so the floating cards can still hang past the container
   without being cut off. */
function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute bottom-0 left-[-4%] w-[108%] opacity-[0.09]">
        <svg viewBox="0 0 614 191" width="100%" height="auto" preserveAspectRatio="none" fill="none">
          <path d="M5.97161 190.157L6.75813e-06 48.5474L130.67 4.94636C153.322 -2.59602 178.276 -1.48774 199.99 8.09947L275.313 41.3533C297.086 50.94 322.001 52.1046 344.693 44.5059L423.896 17.9871C446.608 10.3882 471.502 11.553 493.275 21.1397L613.753 74.3537L576.915 87.8855L495.706 52.02C471.582 41.3551 443.697 41.1882 419.43 51.506L336.847 86.5423C317.103 94.9152 294.753 96.3935 273.997 90.7697L191.174 68.2729C171.521 62.9558 150.507 63.9739 131.572 71.1829L2.92563 119.334L86.7683 92.7532C109.421 85.2108 134.375 86.3191 156.088 95.9063L231.412 129.16C253.185 138.747 278.1 139.911 300.792 132.313L379.994 105.794C402.706 98.1951 427.601 99.3598 449.394 108.946L569.872 162.16L533.034 175.692L451.825 139.827C427.701 129.162 399.815 128.995 375.549 139.313L292.966 174.349C273.221 182.722 250.872 184.256 230.116 178.576L147.292 156.079C127.639 150.762 106.626 151.781 87.6908 158.99L5.87146 190.139L5.97161 190.157Z" fill="var(--green)" />
        </svg>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-50">
        <TopStripe />
        <NavBar />
      </header>

      <main>
        {/* hero + product share one backdrop, so the grid and ribbons span both */}
        <div className="relative">
          <HeroBackdrop />

        {/* hero copy */}
        <section className="relative z-10 mx-auto flex max-w-[1040px] flex-col items-center px-6 pb-3 pt-10 text-center sm:pt-14">
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
        </div>

        {/* trust / logos / certified */}
        <Trust />
      </main>
    </div>
  );
}
