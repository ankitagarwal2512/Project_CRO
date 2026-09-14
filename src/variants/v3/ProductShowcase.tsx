import { useEffect, useRef, useState, type ReactNode } from "react";
import hrIcon from "@/imports/HRICON.svg";
import logoHr from "@/imports/logohr.png";
import avatarUser from "@/imports/AVATAR.png";

/* v3 — the product stands on its own.
   v1 and v2 surround the dashboard with floating snippet cards (attendance, approvals,
   Ask AI) and grow-then-shrink it on first scroll. v3 drops all of it: one screenshot,
   one dark green stage, and a slow parallax. Nothing competes with the product, so it
   has to be worth looking at on its own — which is why it is rendered at a much larger
   max width here than in the other variations. */

/* the one primitive the dashboard itself uses — the rest of v1/v2's snippet toolkit
   goes away with the floating cards */
const Check = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="shrink-0">
    <circle cx="8" cy="8" r="8" fill="var(--green)" />
    <path d="M4.5 8.2l2.2 2.2 4.8-4.8" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- main dashboard (chrome matched to HROne product) ---------- */

// Deep brand green used by the product's header + rail
const DEEP = "#02563d";
const BRIGHT = "#00bf78";

const Ic = ({ d, size = 18 }: { d: ReactNode; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {d}
  </svg>
);

const icons = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <path d="M9 4h6v3H9zM9 12h6M9 16h4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0M16 6a3 3 0 0 1 0 6M22 20a6 6 0 0 0-4-5.6" />
    </>
  ),
  chart: <path d="M4 20V11M10 20V5M16 20v-6M2 20h20" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </>
  ),
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  bell: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 0 0-4-10z" />
    </>
  ),
};

function Dashboard() {
  const railTop: (keyof typeof icons)[] = ["home", "mail", "clipboard", "calendar", "users", "chart", "settings"];
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[0_50px_90px_-40px_rgba(11,74,46,0.55)]">
      {/* browser chrome — tab strip over a toolbar, the way a real window reads */}
      <div className="shrink-0 bg-[var(--cream-2)]">
        {/* tab strip */}
        <div className="flex items-end gap-1 px-3 pt-2.5">
          <div className="flex shrink-0 gap-1.5 pb-[8px] pr-2">
            <span className="h-[11px] w-[11px] rounded-full bg-[#ec6a5f]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#f5bf4f]" />
            <span className="h-[11px] w-[11px] rounded-full bg-[#61c554]" />
          </div>

          {/* active tab — merges into the white toolbar below it */}
          <div className="flex min-w-0 max-w-[186px] flex-1 items-center gap-1.5 rounded-t-[9px] bg-white px-2.5 py-[7px]">
            <img src={hrIcon} alt="" aria-hidden className="h-[11px] w-[11px] shrink-0 object-contain" />
            <span className="truncate text-[10.5px] font-medium text-[var(--ink)]">HROne — Dashboard</span>
            <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden className="ml-auto shrink-0 text-[var(--muted)]">
              <path d="M1.2 1.2l7.6 7.6M8.8 1.2L1.2 8.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </div>


          <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden className="mb-[9px] ml-1 shrink-0 text-[var(--muted)]">
            <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>

        {/* toolbar */}
        <div className="flex items-center gap-2 border-b border-[var(--border)] bg-white px-3 py-[6px]">
          <div className="flex shrink-0 items-center gap-2 text-[var(--muted)]">
            <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden>
              <path d="M8.6 3.2L4.8 7l3.8 3.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden className="opacity-40">
              <path d="M5.4 3.2L9.2 7l-3.8 3.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg
              width="13"
              height="13"
              viewBox="0 0 14 14"
              aria-hidden
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* arc sweeps up and terminates exactly where the arrowhead corner sits */}
              <path d="M11.95 8.75a5.25 5.25 0 1 1-1.24-5.46l2.71 2.54" />
              <path d="M13.42 2.33v3.5H9.92" />
            </svg>
          </div>

          {/* address bar */}
          <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full bg-[var(--cream)] px-2.5 py-[3px] ring-1 ring-[var(--border)]">
            <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden className="shrink-0 text-[var(--green)]">
              <rect x="1.6" y="4.3" width="6.8" height="4.5" rx="1" fill="currentColor" />
              <path d="M3.3 4.3V3.1a1.7 1.7 0 0 1 3.4 0v1.2" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            </svg>
            <span className="truncate font-mono text-[9.5px] text-[var(--muted)]">
              app.hrone.cloud<span className="text-[var(--ink)]">/dashboard</span>
            </span>
          </div>

        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* left rail */}
        <div
          className="flex w-[56px] shrink-0 flex-col items-center justify-between py-3.5 text-white/65"
          style={{ background: `linear-gradient(${DEEP}, ${"#024530"})` }}
        >
          <div className="flex flex-col items-center gap-2.5">
            {railTop.map((k, i) => (
              <span
                key={k}
                className={`relative grid h-9 w-9 place-items-center rounded-xl transition-colors ${
                  i === 0 ? "bg-white text-[var(--green-deep)] shadow-sm" : "hover:bg-white/10 hover:text-white"
                }`}
              >
                <Ic d={icons[k]} />
                {k === "mail" && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#e56046] text-[9px] font-bold text-white">
                    3
                  </span>
                )}
              </span>
            ))}
          </div>
          <div className="flex flex-col items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl hover:bg-white/10">
              <Ic d={icons.bolt} />
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-xl hover:bg-white/10">
              <Ic d={icons.plus} />
            </span>
            <span className="block h-8 w-8 overflow-hidden rounded-full">
              {/* AVATAR.png has a white rim baked in — uneven, thickest at ~1.26x radius.
                  1.3 crops it away entirely so the avatar reads as a clean circle. */}
              <img src={avatarUser} alt="" aria-hidden className="h-full w-full scale-[1.3] object-cover" />
            </span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          {/* top header bar */}
          <div
            className="flex shrink-0 items-center gap-3 px-4 py-2.5 text-white"
            style={{ background: `linear-gradient(90deg, ${DEEP}, #045a41 55%, ${DEEP})` }}
          >
            {/* real HROne logo (full mark + wordmark) inverted to white on the dark header */}
            <img src={logoHr} alt="HROne" className="h-[20px] w-auto" style={{ filter: "brightness(0) invert(1)" }} />
            <span className="mx-1 h-4 w-px bg-white/25" />
            <button className="flex items-center gap-1 text-[12px] text-white/85">
              Workspace <Ic d={<path d="m6 9 6 6 6-6" />} size={12} />
            </button>
            <div className="mx-auto flex w-[42%] items-center gap-2 rounded-lg bg-white/12 px-3 py-1.5 text-[12px] text-white/70 ring-1 ring-white/10">
              <Ic d={<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>} size={14} />
              Search requests, reports, people…
              <span className="ml-auto rounded bg-white/15 px-1.5 py-0.5 text-[9px] text-white/70">⌘K</span>
            </div>
            <div className="flex items-center gap-1 text-white/80">
              <span className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10">
                <Ic d={icons.calendar} size={16} />
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10">
                <Ic d={icons.bulb} size={16} />
              </span>
              <span className="relative grid h-8 w-8 place-items-center rounded-lg hover:bg-white/10">
                <Ic d={icons.bell} size={16} />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#e56046]" />
              </span>
            </div>
          </div>

          {/* content body — light, finished */}
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden bg-[#f9fafb] px-5 py-3.5">
            {/* page header */}
            <div className="flex shrink-0 items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h3 className="text-[19px] font-bold tracking-[-0.01em] text-[#101828]">Payroll run</h3>
                <span className="rounded-full bg-[#fffbeb] px-2.5 py-0.5 text-[11px] font-semibold text-[#e17100] ring-1 ring-[#e17100]/20">
                  Pre-approval
                </span>
                <span className="text-[12px] text-[#6a7282]">Sep 2026 · Aarvik Group</span>
              </div>
              <button
                className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm"
                style={{ background: BRIGHT }}
              >
                Run payroll <span className="text-white/80">→</span>
              </button>
            </div>

            {/* KPI cards */}
            <div className="grid shrink-0 grid-cols-3 gap-3">
              {[
                ["Total payout", "₹2.32 crore", "2,040 employees · 3 entities", false],
                ["Statutory dues", "₹32.00 lakh", "PF · ESI · PT · TDS · LWF", false],
                ["Run status", "Ready to run", "0 exceptions · 12 flags cleared", true],
              ].map(([label, value, sub, ok]) => (
                <div
                  key={label as string}
                  className={`rounded-xl border p-3 ${ok ? "border-[#00bf78]/30 bg-[#e6f6ec]" : "border-[#e5e7eb] bg-white"}`}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6a7282]">{label}</div>
                  <div className={`mt-1 text-[19px] font-bold ${ok ? "text-[var(--green-deep)]" : "text-[#101828]"}`}>
                    {value}
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#6a7282]">{sub}</div>
                </div>
              ))}
            </div>

            {/* tables */}
            <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 overflow-hidden">
              <div className="flex min-h-0 flex-col rounded-xl border border-[#e5e7eb] bg-white p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#101828]">Run scope</span>
                  <span className="text-[10px] font-semibold text-[#6a7282]">3 entities</span>
                </div>
                <table className="w-full text-left text-[11.5px]">
                  <thead className="text-[#99a1af]">
                    <tr className="border-b border-[#e5e7eb]">
                      <th className="pb-1 font-medium">Entity</th>
                      <th className="pb-1 font-medium">Location</th>
                      <th className="pb-1 text-right font-medium">Emp.</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#364153]">
                    {[
                      ["Aarvik Manufacturing", "Pune Plant", "960"],
                      ["Aarvik Components", "Chennai Plant", "720"],
                      ["Aarvik Services", "Bengaluru", "360"],
                    ].map((r) => (
                      <tr key={r[0]} className="border-b border-[#f3f4f6]">
                        <td className="py-1.5 font-medium">{r[0]}</td>
                        <td className="py-1.5 text-[#6a7282]">{r[1]}</td>
                        <td className="py-1.5 text-right tabular-nums">{r[2]}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="pt-2 font-bold text-[#101828]">All entities</td>
                      <td className="pt-2 text-[#6a7282]" />
                      <td className="pt-2 text-right font-bold tabular-nums text-[#101828]">2,040</td>
                    </tr>
                  </tbody>
                </table>
                {/* headcount split footer */}
                <div className="mt-auto pt-3">
                  <div className="flex h-2 w-full overflow-hidden rounded-full">
                    <span className="h-full" style={{ width: "47%", background: "var(--green-deep)" }} />
                    <span className="h-full" style={{ width: "35%", background: "var(--green)" }} />
                    <span className="h-full" style={{ width: "18%", background: "#7cc59f" }} />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#6a7282]">
                    <span>Pune 47%</span>
                    <span>Chennai 35%</span>
                    <span>Bengaluru 18%</span>
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 flex-col rounded-xl border border-[#e5e7eb] bg-white p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#101828]">Statutory deductions</span>
                  <span className="text-[10px] font-semibold text-[#6a7282]">Sep 2026</span>
                </div>
                <table className="w-full text-left text-[11.5px]">
                  <tbody className="text-[#364153]">
                    {[
                      ["PF", "Provident Fund", "₹16,00,000"],
                      ["ESI", "Employee State Ins.", "₹72,000"],
                      ["PT", "Professional Tax", "₹48,000"],
                      ["TDS", "Tax Deducted", "₹14,76,000"],
                    ].map((r) => (
                      <tr key={r[0]} className="border-b border-[#f3f4f6]">
                        <td className="py-[5px] font-semibold">{r[0]}</td>
                        <td className="py-[5px] text-[#6a7282]">{r[1]}</td>
                        <td className="py-[5px] text-right tabular-nums">{r[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* total footer */}
                <div className="mt-auto flex items-center justify-between rounded-lg bg-[#e6f6ec] px-3 py-2">
                  <span className="text-[11px] font-semibold text-[var(--green-deep)]">Total statutory</span>
                  <span className="text-[14px] font-bold tabular-nums text-[var(--green-deep)]">₹32,00,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* footer summary bar */}
          <div className="flex shrink-0 items-center gap-5 border-t border-[#e5e7eb] bg-white px-5 py-3">
            {[
              ["Gross", "₹2.64 crore", "#101828", false],
              ["Deductions", "− ₹32.00 lakh", "#b42318", false],
              ["Net payable", "₹2.32 crore", "var(--green-deep)", true],
            ].map(([label, val, color, strong], i) => (
              <div key={label as string} className="flex items-center gap-5">
                {i > 0 && <span className="h-8 w-px bg-[#eceef1]" />}
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#99a1af]">{label}</div>
                  <div
                    className={`tabular-nums ${strong ? "text-[17px] font-bold" : "text-[15px] font-semibold"}`}
                    style={{ color: color as string }}
                  >
                    {val}
                  </div>
                </div>
              </div>
            ))}

            <div className="ml-auto flex items-center gap-2.5">
              <span className="hidden items-center gap-1.5 text-[11px] text-[#6a7282] 2xl:flex">
                <Check /> Reconciled
              </span>
              <button className="rounded-lg border border-[#e5e7eb] px-3.5 py-2 text-[13px] font-semibold text-[#364152] transition-colors hover:bg-[#f3f4f6]">
                Save draft
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-[var(--green)] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(14,90,56,0.7)] transition-colors hover:bg-[var(--green-deep)]">
                Send for approval
                <span className="grid h-5 w-5 place-items-center rounded-md bg-white/20 text-[11px]">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
/* ---------- the stage ---------- */

const clamp = (v: number, a = -1, b = 1) => (Number.isFinite(v) ? Math.min(b, Math.max(a, v)) : 0);

/* How far the screenshot lags the page, in px each way from centre. Deliberately small:
   the product has to stay readable while it moves, and past roughly 60px the drift stops
   reading as depth and starts reading as a slide. It also has to stay under the stage's
   smallest top padding (48px), or the parallax would push the product into the clipped
   edge of the band at narrow widths. */
const TRAVEL = 44;

/* The measured element must not be the element that moves: a transform changes the next
   frame's getBoundingClientRect, so measuring the moved node feeds each frame back into
   the following one and the drift compounds until the product walks off the stage. The
   ref therefore sits on the static slot and the transform goes on its child. */
function useParallax() {
  const slot = useRef<HTMLDivElement>(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    const el = slot.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      /* +1 when the slot sits a full viewport below the middle of the screen, -1 when it
         sits a full viewport above. Offsetting the product in the same direction is what
         makes it travel slower than the page rather than with it. */
      const fromCentre = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      setY(clamp(fromCentre) * TRAVEL);
    };
    /* scroll fires far faster than the compositor paints, so coalesce to one rAF */
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { slot, y };
}

/* The flowing ribbon band from go.hrone.cloud — their 614x191 artwork, stretched past
   both edges so the curves run off-screen rather than terminating in view. It used to sit
   behind the headline on the cream; on the dark stage it does more, because the product is
   opaque and the curves read as the surface the screenshot rests on rather than as texture
   competing with the type. Light on dark instead of green on cream, and kept well under the
   product's own contrast so it never fights it.

   Height is a share of the stage rather than the artwork's own ratio: left at 614x191 the
   curves flatten into wide, shallow bands that read as compression artefacts on a dark
   ground. Stretching them gives the sweeps enough amplitude to be legible, and the mask
   lets them rise out of the bottom edge instead of stopping dead in open green halfway up. */
function Ribbon() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-[-4%] bottom-0 h-[58%] opacity-[0.11]"
      style={{ maskImage: "linear-gradient(to bottom, transparent, #000 38%)", WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 38%)" }}
    >
      <svg viewBox="0 0 614 191" width="100%" height="100%" preserveAspectRatio="none" fill="none">
        <path d="M5.97161 190.157L6.75813e-06 48.5474L130.67 4.94636C153.322 -2.59602 178.276 -1.48774 199.99 8.09947L275.313 41.3533C297.086 50.94 322.001 52.1046 344.693 44.5059L423.896 17.9871C446.608 10.3882 471.502 11.553 493.275 21.1397L613.753 74.3537L576.915 87.8855L495.706 52.02C471.582 41.3551 443.697 41.1882 419.43 51.506L336.847 86.5423C317.103 94.9152 294.753 96.3935 273.997 90.7697L191.174 68.2729C171.521 62.9558 150.507 63.9739 131.572 71.1829L2.92563 119.334L86.7683 92.7532C109.421 85.2108 134.375 86.3191 156.088 95.9063L231.412 129.16C253.185 138.747 278.1 139.911 300.792 132.313L379.994 105.794C402.706 98.1951 427.601 99.3598 449.394 108.946L569.872 162.16L533.034 175.692L451.825 139.827C427.701 129.162 399.815 128.995 375.549 139.313L292.966 174.349C273.221 182.722 250.872 184.256 230.116 178.576L147.292 156.079C127.639 150.762 106.626 151.781 87.6908 158.99L5.87146 190.139L5.97161 190.157Z" fill="#3ddc97" />
      </svg>
    </div>
  );
}

/* The dashboard is laid out for this box. Reflowing it wider does not make it read as a
   bigger screenshot — the type stays 13px and the cards just grow empty middles — so the
   mock keeps its design size and is scaled up instead, the way a real screenshot would
   be. MAX_ZOOM is what it is presented at when there is room. */
const MOCK_W = 880;
const MOCK_H = (MOCK_W * 11) / 16;
const MAX_ZOOM = 1.2;

export function ProductShowcase() {
  const { slot, y } = useParallax();

  /* Below MOCK_W * MAX_ZOOM of usable width the zoom backs off to whatever fits, so the
     product runs edge to edge on a phone instead of overflowing the stage. */
  const [zoom, setZoom] = useState(MAX_ZOOM);
  useEffect(() => {
    const el = slot.current;
    if (!el) return;
    const fit = () => setZoom(Math.min(MAX_ZOOM, el.clientWidth / MOCK_W));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#07351f]">
      {/* One gradient rather than the stack of glows, dots and grids v1/v2 layer up: the
          stage lifts towards its top edge, so the product reads as lit from the side the
          headline is on. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(115% 85% at 50% -12%, #10613c 0%, #07351f 60%)" }}
      />
      <Ribbon />
      {/* a hairline at the cream boundary, so the block edge reads as drawn, not as a seam */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-white/10" />

      {/* Top padding is the tighter of the two on purpose. On a laptop the fold lands just
          inside the stage, and every pixel spent above the product is a pixel of empty green
          where the screenshot should be — while the deeper bottom gives the parallax
          somewhere to travel and keeps the product off the Trust logos. */}
      <div className="relative mx-auto max-w-[1320px] px-5 pb-[clamp(64px,7vw,108px)] pt-[clamp(48px,5vw,76px)] sm:px-8 md:px-12">
        {/* The slot holds the space the scaled mock takes up — `scale()` paints outside the
            layout box without reserving any of it, so the height has to be stated here or
            the stage would collapse to 605px tall and the Trust logos would ride up over
            the product. */}
        <div
          ref={slot}
          className="mx-auto w-full"
          style={{ maxWidth: MOCK_W * MAX_ZOOM, height: MOCK_H * zoom }}
        >
          <div className="h-full w-full" style={{ transform: `translate3d(0, ${y}px, 0)` }}>
            {/* The shadow lives out here, not on the mock: on the dark stage the mock's own
                green shadow is invisible, and a wide black one is what actually lifts a
                white window off a dark ground. */}
            <div
              className="origin-top-left rounded-2xl shadow-[0_70px_130px_-50px_rgba(0,0,0,0.85)]"
              style={{ width: MOCK_W, height: MOCK_H, transform: `scale(${zoom})` }}
            >
              <Dashboard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
