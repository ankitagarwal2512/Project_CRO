import { useEffect, useState } from "react";
import { track } from "./track";

/* Floating "Back to top" button.
   - Appears only after the visitor has scrolled about 1.5 screens, so it never
     clutters the first view, and fades rather than pops.
   - 48px target, aligned to the right edge of the 1200px content column rather
     than the window corner; on narrow screens it keeps a 20px margin.
   - Smooth scroll, or an instant jump when the visitor prefers reduced motion.
   - Moves keyboard focus to the page heading so keyboard and screen-reader users
     land at the top too, not just the viewport.
   - Hides while the footer is on screen, so it never covers footer links. */
export default function BackToTop({ focusId, footerId }: { focusId: string; footerId: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  const show = scrolled && !footerInView;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const footer = document.getElementById(footerId);
    if (!footer) return;
    const io = new IntersectionObserver(([entry]) => setFooterInView(entry.isIntersecting));
    io.observe(footer);
    return () => io.disconnect();
  }, [footerId]);

  const goTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById(focusId)?.focus({ preventScroll: true });
    track("salary_back_to_top");
  };

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      style={{ right: "max(1.25rem, calc((100vw - 1200px) / 2 + 1.5rem))" }}
      className={`fixed bottom-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-[var(--green)] text-white outline-none ring-offset-2 ring-offset-[var(--cream)] transition-all duration-200 hover:bg-[var(--green-deep)] focus-visible:ring-2 focus-visible:ring-[var(--green)] sm:bottom-8 print:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 15.5v-11M5 9l5-5 5 5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
