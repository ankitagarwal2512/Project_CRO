import canon from "@/imports/Canon_logo_PNG1_1.png";
import haier from "@/imports/Haier_logo_PNG2_1.png";
import mrdiy from "@/imports/id30aOZ_gb_1.png";
import bikanervala from "@/imports/image_1077.png";
import siyarams from "@/imports/image_1079.png";
import wowmomo from "@/imports/image_1081.png";
import veeba from "@/imports/image_1082.png";
import amarujala from "@/imports/image_1083.png";
import timex from "@/imports/image_1086.png";
import mapmyindia from "@/imports/image_1100.png";
import flipkart from "@/imports/image_1110.png";
import magicpin from "@/imports/image_1112.png";
import aviva from "@/imports/image_1131.png";
import telegraph from "@/imports/image_1738.png";

const logoImages: [string, string][] = [
  [canon, "Canon"],
  [haier, "Haier"],
  [mrdiy, "MR. DIY"],
  [bikanervala, "Bikanervala"],
  [siyarams, "Siyaram's"],
  [wowmomo, "WOW! Momo"],
  [veeba, "Veeba"],
  [amarujala, "Amar Ujala"],
  [timex, "Timex"],
  [mapmyindia, "MapmyIndia"],
  [flipkart, "Flipkart Reset"],
  [magicpin, "Magicpin"],
  [aviva, "Aviva"],
  [telegraph, "The Telegraph"],
];

const Shield = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 text-[var(--green)]">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const Globe = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 text-[var(--green)]">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
  </svg>
);

const Lock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 text-[var(--green)]">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

/* Reads as a widening claim: who buys it, how broadly, how much work it carries, then
   the company credential. Industries belongs beside Customers — both describe the
   customer base — rather than stranded between a usage metric and a funding one. */
const stats = [
  ["2,500+", "Customers"],
  ["25+", "Industries"],
  ["11 lakh+", "Employees managed"],
  ["$8M", "Funding raised"],
];

export function Trust() {
  /* No bottom padding on the section: the logo band's own padding is what ends the page,
     which keeps the row centred between its rule and the page edge instead of depending on
     two separate paddings agreeing with each other. */
  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-[clamp(44px,5vw,68px)]">
      {/* headline + stats */}
      <div className="grid items-center gap-x-10 gap-y-8 pb-[clamp(26px,2.6vw,34px)] lg:grid-cols-[1fr_auto]">
        {/* deliberate two-line break, same idiom as the hero h1 — the natural rag put
            "workforces" up on the first line and left "run on HROne." hanging */}
        <h2 className="text-[26px] font-bold leading-tight tracking-[-0.01em] text-[var(--ink)]">
          <span className="block">
            India&apos;s most <span className="text-[var(--green)]">operationally complex</span>
          </span>
          <span className="block">workforces run on HROne.</span>
        </h2>
        {/* Columns size to their own content rather than to four equal 1fr slots. With
            equal slots the short labels (INDUSTRIES, FUNDING RAISED) left an ~80px hole
            before their rule while the long ones (EMPLOYEES MANAGED) nearly touched
            theirs, so the rules read as attached to the stat on their right instead of
            sitting between the two. gap-x-8 against pl-8 also makes the space either
            side of each rule equal — it was 12px before and 20px after. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 md:flex md:flex-wrap md:gap-x-8">
          {stats.map(([n, l], i) => (
            <div
              key={l}
              className={[
                /* Two-up until there is room for one row. The rule has to follow the
                   column, not the index: keyed to the index it landed on the third stat
                   too, which opens the second row with a rule hanging off nothing. */
                i % 2 === 1 ? "border-l border-[var(--border)] pl-6" : "",
                /* In a single row it is every stat but the first. */
                i === 0 ? "md:border-l-0 md:pl-0" : "md:border-l md:border-[var(--border)] md:pl-8",
              ].join(" ")}
            >
              <div className="text-[26px] font-bold leading-none tracking-[-0.01em] text-[var(--green)] sm:text-[30px]">{n}</div>
              <div className="mt-2 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* logos — seamless marquee */}
      <div
        className="group relative overflow-hidden border-t border-[var(--border)] py-[clamp(32px,3.2vw,44px)]"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex w-max animate-[marquee_50s_linear_infinite] group-hover:[animation-play-state:paused]">
          {[...logoImages, ...logoImages].map(([src, name], i) => (
            <div key={`${name}-${i}`} aria-hidden={i >= logoImages.length} className="flex w-[136px] shrink-0 items-center justify-center px-2">
              <img
                src={src}
                alt={name}
                className="max-h-7 w-auto max-w-[112px] object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
