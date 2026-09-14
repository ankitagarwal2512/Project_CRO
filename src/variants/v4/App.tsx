import gartnerIcon from "@/imports/gartner-icon.svg";
import g2Icon from "@/imports/g2icon.svg";
import { NavBar, TopStripe } from "./Chrome";

/* Both marks are drawn in the same 62x62 box, but Gartner's is a circle inscribed in it
   and G2's is a rounded square that fills it — so at equal nominal size the square carries
   about a quarter more ink and reads noticeably heavier. The square is set smaller so the
   two balance optically rather than measuring the same. */
const ratings: [string, string, string, number][] = [
  [gartnerIcon, "Gartner", "Peer Insights", 22],
  [g2Icon, "G2", "2100+ reviews", 20],
];
import { ProductShowcase } from "./ProductShowcase";
import { Trust } from "./Trust";

export default function App() {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-50">
        <div className="[@media(max-height:700px)]:hidden">
          <TopStripe />
        </div>
        <NavBar />
      </header>

      <main>
        {/* hero copy — nothing behind it now; the artwork moved onto the product's stage */}
        <section className="mx-auto flex max-w-[1040px] flex-col items-center px-6 pb-[clamp(24px,5.5vh,48px)] pt-[clamp(16px,4vh,36px)] text-center [@media(max-height:700px)]:pb-[clamp(18px,3.4vh,28px)] [@media(max-height:700px)]:pt-[clamp(12px,2.4vh,20px)]">
          {/* eyebrow — quiet label, tied tightly to the headline */}
          <span className="inline-flex items-center rounded-full border border-[var(--green-line)] bg-[var(--green-soft)]/70 px-3.5 py-[6px] font-mono text-[11px] font-medium uppercase leading-none tracking-[0.2em] text-[var(--green)]">
            Enterprise HR Software
          </span>

          {/* deliberate two-line break — keeps the rag even, except where it is dropped */}
          <h1 className="mt-[clamp(10px,1.8vh,16px)] font-display text-[clamp(30px,min(4.4vw,7.4vh),64px)] [@media(max-height:700px)]:text-[clamp(28px,min(4.4vw,5.9vh),42px)] font-semibold leading-[0.98] tracking-[-0.032em] text-[var(--ink)]">
            Built for <span className="text-[var(--green)]">complex</span>{" "}
            {/* The break is an element rather than two stacked spans so it can be dropped.
                On a short screen the second line costs ~40px of exactly the space the
                product needs, and the headline fits on one line comfortably — but only
                once there is width for it, so the min-width guard keeps narrow-and-short
                windows on the deliberate two-line rag instead of wrapping wherever the
                words happen to run out. */}
            <br className="[@media(max-height:700px)_and_(min-width:900px)]:hidden" />
            HR operations
          </h1>

          <p className="mt-[clamp(12px,2.2vh,18px)] w-full max-w-[600px] text-balance text-[clamp(16px,min(1.3vw,2.2vh),18.5px)] leading-[1.58] tracking-[-0.005em] text-[var(--muted)]">
            Bring payroll, workforce, talent and employee operations together with the control and depth
            complex organisations need.
          </p>

          <div className="mt-[clamp(16px,3.2vh,26px)] [@media(max-height:700px)]:mt-[clamp(12px,2.4vh,18px)] flex items-center justify-center">
            <button className="group inline-flex items-center gap-2.5 rounded-[11px] bg-[var(--coral)] px-7 py-3.5 [@media(max-height:700px)]:py-2.5 text-[16px] font-semibold tracking-[-0.01em] text-white shadow-[0_10px_24px_-10px_rgba(233,97,74,0.55)] transition-all duration-200 hover:bg-[var(--coral-hover)] hover:shadow-[0_14px_28px_-10px_rgba(233,97,74,0.6)] active:translate-y-px">
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

          {/* Taking the artwork off the cream left the block with nothing holding its lower
              edge — the CTA just trailed off into empty ground. A rating line does more work
              in that space than decoration would, and it is the same two marks and numbers
              already shown in Trust further down, not a new claim. */}
          <div className="mt-[clamp(14px,2.8vh,24px)] flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {ratings.map(([icon, name, sub, size]) => (
              <div key={name} className="flex items-center gap-2">
                <img src={icon} alt="" width={size} height={size} className="shrink-0" />
                <span className="text-[14px] font-bold tracking-[-0.01em] text-[var(--ink)]">4.8</span>
                <span className="text-[9px] tracking-[0.06em] text-[var(--coral)]">★★★★★</span>
                <span className="text-[12.5px] text-[var(--muted)]">
                  {name} · {sub}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* the product, alone on its stage */}
        <ProductShowcase />

        {/* trust / logos / certified */}
        <Trust />
      </main>
    </div>
  );
}
