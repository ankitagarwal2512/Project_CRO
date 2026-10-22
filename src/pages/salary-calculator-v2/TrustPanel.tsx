import g2Icon from "@/imports/g2icon.svg";
import adityaBirla from "@/imports/customers/aditya-birla.png";
import canon from "@/imports/customers/canon.png";
import dtdc from "@/imports/customers/dtdc.png";
import haier from "@/imports/customers/haier.png";
import hyundaiCapital from "@/imports/customers/hyundai-capital.png";
import muthoot from "@/imports/customers/muthoot-fincorp.png";
import panasonic from "@/imports/customers/panasonic.png";
import suzuki from "@/imports/customers/suzuki.png";
import timex from "@/imports/customers/timex.png";

/* Right half of the closing CTA: who uses HROne, then how they rate it.
   Logos, the 2,500+ figure and both ratings come from the HROne sales deck
   (Web Presentation: slides/hrone-why-hrone.html and the cover slides). */

/* [src, name, height in px]: heights are set by eye so each mark carries similar
   visual weight; a wide wordmark needs less height than a square one */
const LOGOS: [string, string, number][] = [
  [canon, "Canon", 22],
  [panasonic, "Panasonic", 24],
  [suzuki, "Suzuki", 22],
  [haier, "Haier", 24],
  [timex, "Timex", 20],
  [dtdc, "DTDC", 20],
  [hyundaiCapital, "Hyundai Capital", 17],
  [muthoot, "Muthoot Fincorp", 36],
  [adityaBirla, "Aditya Birla Memorial Hospital", 19],
];

function GartnerMark() {
  return (
    <svg aria-hidden width="32" height="32" viewBox="0 0 44 44" fill="none" className="shrink-0">
      <circle cx="22" cy="22" r="21.5" fill="#fff" stroke="rgba(20,40,25,0.12)" />
      <path
        d="M21.8078 33.5118C25.5077 33.6193 28.3089 32.7538 31.1133 31.2536V20.113H22.4291L22.1168 24.0052H26.7425V28.7509C25.4443 29.3337 23.9441 29.6149 21.85 29.5626C17.3994 29.4458 14.5524 26.2462 14.6085 21.6035C14.6655 17.3183 17.2498 14.2017 21.5386 14.002C24.1674 13.8829 26.3672 14.6279 27.8623 15.9025L30.7727 12.9582C28.3566 10.8261 25.2654 9.94949 21.811 10.0023C14.9963 10.1098 10 14.6863 10 21.849C10 29.0432 14.9486 33.3024 21.8078 33.5118Z"
        fill="#002856"
      />
    </svg>
  );
}

function Rating({ mark, score, source }: { mark: React.ReactNode; score: string; source: string }) {
  return (
    <div className="flex items-center gap-3">
      {mark}
      <div className="leading-tight">
        <div>
          <span className="text-[19px] font-bold tracking-[-0.02em] text-[var(--ink)]">{score}</span>
          <span className="text-[13px] text-[var(--muted)]"> / 5</span>
          <span aria-hidden className="ml-1.5 text-[12px] tracking-[1px] text-[#f5a524]">
            ★★★★★
          </span>
        </div>
        <div className="text-[12.5px] text-[var(--muted)]">{source}</div>
      </div>
    </div>
  );
}

export default function TrustPanel() {
  return (
    <div className="flex flex-col border-t border-[var(--border)] lg:border-l lg:border-t-0">
      <div className="flex flex-1 flex-col justify-center p-8 sm:p-10">
        <p className="text-[15px] text-[var(--ink)]/75">
          <span className="font-bold text-[var(--ink)]">2,500+ customers</span> run their HR on HROne
        </p>
        {/* equal cells on hairlines: each logo sits centred in the same box */}
        <ul className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-[14px] border border-[var(--border)] bg-[var(--border)]">
          {LOGOS.map(([src, name, h]) => (
            <li key={name} className="flex h-[76px] items-center justify-center bg-white px-4">
              <img
                src={src}
                alt={name}
                loading="lazy"
                style={{ height: h }}
                className="w-auto max-w-[85%] object-contain opacity-70 grayscale transition duration-200 hover:opacity-100 hover:grayscale-0"
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-[var(--border)] px-8 py-5 sm:px-10">
        <Rating mark={<img src={g2Icon} alt="" aria-hidden className="h-8 w-8 shrink-0" />} score="4.9" source="G2 · 2,100+ reviews" />
        <Rating mark={<GartnerMark />} score="4.8" source="Gartner Peer Insights" />
      </div>
    </div>
  );
}
