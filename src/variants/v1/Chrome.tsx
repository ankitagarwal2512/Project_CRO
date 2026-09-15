import logoHr from "@/imports/logohr.png";
import newsIcon from "@/imports/newsicon.svg";
import loginIcon from "@/imports/loginicon.svg";

function Caret() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" className="mt-0.5 opacity-60" aria-hidden>
      <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src={logoHr} alt="HROne" className="h-8 w-auto" />
    </div>
  );
}

export function TopStripe() {
  return (
    <div className="w-full border-b border-[var(--border)] bg-[var(--panel)]/70 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-2.5 text-[13px]">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--green)]">
            <img src={newsIcon} alt="" aria-hidden className="h-[15px] w-auto" />
            News
          </span>
          <span className="truncate text-[var(--muted)]">
            We&apos;re excited to announce the launch of the new{" "}
            <span className="font-semibold text-[var(--ink)]">HROne Studio</span> [..]
          </span>
        </div>
        <div className="hidden shrink-0 items-center gap-5 md:flex">
          <button className="flex items-center gap-1 text-[var(--ink)] transition-colors hover:text-[var(--green)]">
            Location <Caret />
          </button>
          <button className="flex items-center gap-1.5 text-[var(--ink)] transition-colors hover:text-[var(--green)]">
            <img src={loginIcon} alt="" aria-hidden className="h-4 w-4" />
            Login
          </button>
          <button className="rounded-lg bg-[var(--coral)] px-4 py-1.5 font-semibold text-white shadow-sm transition-colors hover:bg-[var(--coral-hover)]">
            Get a free trial
          </button>
        </div>
      </div>
    </div>
  );
}

export function NavBar() {
  const links = ["HR Software", "Pricing", "HR AI Agents", "HROne Studio", "HR Resources", "About"];
  const hasCaret = new Set(["HR Software", "HR AI Agents", "HROne Studio", "HR Resources", "About"]);
  return (
    <nav className="w-full border-b border-[var(--border)] bg-[var(--cream)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-6 py-4">
        <Logo />
        <div className="hidden items-center gap-7 text-[15px] font-medium lg:flex">
          {links.map((l) => (
            <button
              key={l}
              className="flex items-center gap-1 text-[var(--ink)]/85 transition-colors hover:text-[var(--green)]"
            >
              {l}
              {hasCaret.has(l) && <Caret />}
            </button>
          ))}
          <button
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-lg text-[var(--ink)]/70 transition-colors hover:bg-[var(--green-soft)] hover:text-[var(--green)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </div>
        <div className="lg:hidden">
          <button className="rounded-lg bg-[var(--coral)] px-4 py-2 text-sm font-semibold text-white">Free trial</button>
        </div>
      </div>
    </nav>
  );
}

export { Logo };
