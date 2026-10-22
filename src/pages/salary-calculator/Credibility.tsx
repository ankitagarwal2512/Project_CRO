import gartnerBadge from "@/imports/credibility/gartner-customers-choice-2025.svg";
import g2Badges from "@/imports/credibility/g2-badges-2026.svg";

/* Ratings and awards, right after the calculator. Figures and marks are the ones
   used in the HROne sales deck (Web Presentation/slides/hrone-slide1.html). */

function GartnerMark() {
  return (
    <svg aria-hidden width="40" height="40" viewBox="0 0 44 44" fill="none">
      <circle cx="22" cy="22" r="21.5" fill="#fff" stroke="rgba(20,40,25,0.1)" />
      <path
        d="M21.8078 33.5118C25.5077 33.6193 28.3089 32.7538 31.1133 31.2536V20.113H22.4291L22.1168 24.0052H26.7425V28.7509C25.4443 29.3337 23.9441 29.6149 21.85 29.5626C17.3994 29.4458 14.5524 26.2462 14.6085 21.6035C14.6655 17.3183 17.2498 14.2017 21.5386 14.002C24.1674 13.8829 26.3672 14.6279 27.8623 15.9025L30.7727 12.9582C28.3566 10.8261 25.2654 9.94949 21.811 10.0023C14.9963 10.1098 10 14.6863 10 21.849C10 29.0432 14.9486 33.3024 21.8078 33.5118Z"
        fill="#002856"
      />
    </svg>
  );
}

function G2Mark() {
  return (
    <svg aria-hidden width="40" height="40" viewBox="0 0 44 44" fill="none">
      <path d="M34 0H10C4.47715 0 0 4.47715 0 10V34C0 39.5228 4.47715 44 10 44H34C39.5228 44 44 39.5228 44 34V10C44 4.47715 39.5228 0 34 0Z" fill="#EF492D" />
      <path
        d="M31.8692 16.4226H28.1116C28.2128 15.833 28.578 15.503 29.3172 15.129L30.008 14.777C31.2444 14.1434 31.9044 13.4262 31.9044 12.2558C31.9044 11.521 31.6184 10.9402 31.0508 10.5222C30.4832 10.1042 29.8144 9.89737 29.0312 9.89737C28.4253 9.89025 27.8304 10.06 27.3196 10.3858C26.8048 10.7026 26.422 11.1118 26.1844 11.6222L27.2712 12.7134C27.6936 11.8598 28.3052 11.4418 29.1104 11.4418C29.7924 11.4418 30.2104 11.7938 30.2104 12.2822C30.2104 12.6914 30.008 13.0302 29.2248 13.4262L28.7804 13.6418C27.8168 14.1302 27.148 14.689 26.7608 15.3226C26.3736 15.9562 26.1844 16.7526 26.1844 17.7162V17.9802H31.8692V16.4226ZM31.3676 19.7754H25.146L22.0352 25.161H28.2568L31.3676 30.551L34.4784 25.161L31.3676 19.7754Z"
        fill="white"
      />
      <path
        d="M22.5708 28.756C18.6108 28.756 15.3856 25.5308 15.3856 21.5708C15.3856 17.6108 18.6108 14.3856 22.5708 14.3856L25.0304 9.242C24.2204 9.08094 23.3966 8.99988 22.5708 9C15.6276 9 10 14.6276 10 21.5708C10 28.514 15.6276 34.1416 22.5708 34.1416C25.2316 34.1466 27.8244 33.3018 29.9716 31.7304L27.2524 27.0136C25.9515 28.1373 24.2899 28.7558 22.5708 28.756Z"
        fill="white"
      />
    </svg>
  );
}

function Rating({ mark, score, source }: { mark: React.ReactNode; score: string; source: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 [&>svg]:h-9 [&>svg]:w-9">{mark}</span>
      <div className="leading-tight">
        <div className="whitespace-nowrap">
          <span className="text-[19px] font-bold tracking-[-0.02em] text-[var(--ink)]">{score}</span>
          <span className="text-[13px] text-[var(--muted)]"> / 5</span>
        </div>
        <div className="whitespace-nowrap text-[12.5px] text-[var(--muted)]">{source}</div>
      </div>
    </div>
  );
}

/* Proof row for the bottom of the HR card: ratings on the left, award badges on the
   right. The badges scroll sideways on small screens rather than shrinking. */
export default function Credibility() {
  return (
    <div className="flex flex-col gap-5 border-t border-[var(--border)] px-6 py-5 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <Rating mark={<GartnerMark />} score="4.8" source="Gartner Peer Insights" />
        <Rating mark={<G2Mark />} score="4.9" source="G2 · 2,100+ reviews" />
      </div>
      <div className="-mx-1 flex items-center gap-4 overflow-x-auto px-1">
        <img src={gartnerBadge} alt="Gartner Peer Insights Customers' Choice 2025" className="h-[64px] w-auto shrink-0" />
        <span aria-hidden className="h-10 w-px shrink-0 bg-[var(--border)]" />
        <img
          src={g2Badges}
          alt="G2 Best Software 2026: Top 5 India, Top 20 APAC, Top 50 HR Products, Top 100 Highest Satisfaction Products, Top 100 Fastest Growing"
          className="h-[64px] w-auto shrink-0"
        />
      </div>
    </div>
  );
}
