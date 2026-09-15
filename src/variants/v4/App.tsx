import { useEffect, useState } from "react";
import gartnerIcon from "@/imports/gartner-icon.svg";
import g2Icon from "@/imports/g2icon.svg";
import logoHr from "@/imports/logohr.png";
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

/* iPad portrait, the same line the root variation draws. Below it the hero is not a
   layout that degrades — it is a 1120px product window that opens out on scroll, and
   shrinking that to a phone leaves neither the screen readable nor the effect intact.
   Rather than ship a hollowed-out phone version of a desktop concept, the variation
   asks for a bigger screen. Copied rather than imported: each variation owns its own
   App so a change to one cannot reach another. */
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

          {/* Short enough to hold one line at every width, so the conditional break the longer
              headline needed is gone with it — and being one line, it can take far more size.
              Sized off the smaller of a width and a height term: width so it never outgrows
              its measure (it sits at ~85% of it on a laptop), height so a short screen does
              not spend the fold on type. The second clamp is the short-screen regime. */}
          <h1 className="mt-[clamp(10px,1.8vh,16px)] font-display text-[clamp(32px,min(6.4vw,10.4vh),96px)] [@media(max-height:700px)]:text-[clamp(30px,min(6.4vw,9vh),56px)] font-semibold leading-[0.98] tracking-[-0.032em] text-[var(--ink)]">
            {/* Green sits on the noun, not the adjective — same move as v1. It also
                stops doubling the highlight the Trust h2 puts on "operationally
                complex" further down the page. */}
            Built for complex <span className="text-[var(--green)]">HR</span>.
          </h1>

          <p className="mt-[clamp(12px,2.2vh,18px)] w-full max-w-[720px] text-balance text-[clamp(16px,min(1.45vw,2.4vh),20px)] leading-[1.4] tracking-[-0.005em] text-[var(--muted)]">
            {/* non-breaking space: "HR operations" is one term and the balanced rag was
                splitting it across the two lines */}
            Deep configurability, powerful automation, and connected HR&nbsp;operations — built to work the
            way your organisation actually works.
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
