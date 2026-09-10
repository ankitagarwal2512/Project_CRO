import gartnerIcon from "@/imports/gartner-icon.svg";
import g2Icon from "@/imports/g2icon.svg";
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

const stats = [
  ["2,500+", "Organisations"],
  ["11 lakh+", "Employees managed"],
  ["28 states", "Statutory coverage"],
  ["$8M", "Funding raised"],
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

const certs: [string, () => React.JSX.Element][] = [
  ["ISO/IEC 27001:2022", Shield],
  ["SOC 1 + SOC 2", Lock],
  ["GDPR Ready", Globe],
  ["DPDPA", Shield],
];

export function Trust() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-16 pt-6">
      {/* headline + stats */}
      <div className="grid items-center gap-8 border-t border-[var(--border)] py-10 lg:grid-cols-[1fr_1.4fr]">
        <h2 className="text-[26px] font-bold leading-tight tracking-[-0.01em] text-[var(--ink)]">
          India&apos;s most <span className="text-[var(--green)]">operationally complex</span> workforces run on HROne.
        </h2>
        <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4">
          {stats.map(([n, l], i) => (
            <div key={l} className={`pr-3 ${i > 0 ? "sm:border-l sm:border-[var(--border)] sm:pl-5" : ""}`}>
              <div className="text-[30px] font-bold leading-none tracking-[-0.01em] text-[var(--green)]">{n}</div>
              <div className="mt-2 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--muted)]">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* logos — seamless marquee */}
      <div
        className="group relative overflow-hidden border-t border-[var(--border)] py-8"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="flex w-max animate-[marquee_50s_linear_infinite] group-hover:[animation-play-state:paused]">
          {[...logoImages, ...logoImages].map(([src, name], i) => (
            <div key={`${name}-${i}`} aria-hidden={i >= logoImages.length} className="flex w-[150px] shrink-0 items-center justify-center px-2">
              <img
                src={src}
                alt={name}
                className="max-h-8 w-auto max-w-[120px] object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* certified */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Certified ·</span>
          {certs.map(([label, Icon]) => (
            <span
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1 font-mono text-[11px] text-[var(--ink)]/80"
            >
              <Icon /> {label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-6">
          {[
            [gartnerIcon, "Gartner", "4.8", "Peer Insights"],
            [g2Icon, "G2", "4.8", "500+ reviews"],
          ].map(([icon, name, rating, sub]) => (
            <div key={name} className="flex items-center gap-2.5">
              <img src={icon} alt={name} className="h-7 w-7 shrink-0" />
              <div className="leading-tight">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[15px] font-bold tracking-[-0.01em] text-[var(--ink)]">{rating}</span>
                  <span className="text-[10px] tracking-[0.05em] text-[var(--coral)]">★★★★★</span>
                </div>
                <div className="text-[11px] text-[var(--muted)]">
                  {name} · {sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
