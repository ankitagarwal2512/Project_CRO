import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

/* Every route is its own chunk: a visitor to one page downloads only that page's code,
   not all seven homepage variants and every inner page. */
const App = lazy(() => import('./App'))
const AppOriginal = lazy(() => import('./AppOriginal'))
const V1 = lazy(() => import('./variants/v1/App'))
const V2 = lazy(() => import('./variants/v2/App'))
const V3 = lazy(() => import('./variants/v3/App'))
const V4 = lazy(() => import('./variants/v4/App'))
const V5 = lazy(() => import('./variants/v5/App'))
const V6 = lazy(() => import('./variants/v6/App'))
const V7 = lazy(() => import('./variants/v7/App'))
const SalaryCalculator = lazy(() => import('./pages/salary-calculator/App'))
const OneAi = lazy(() => import('./pages/one-ai/AppStage'))
const Pricing = lazy(() => import('./pages/pricing/App'))

/* Each entry under src/variants/ is a FULL, independent copy of the page — its own
   App, Chrome, ProductShowcase and Trust — so edits to one variation cannot leak into
   another. (AppOriginal is the exception: it still shares src/components, because it
   exists only to compare the old proportions, not to be edited.)

   To add a variation:
     cp -R src/variants/v3 src/variants/v5
     import V5 from './variants/v5/App'   and add v5: V5 below,
     then add a matching rewrite to vercel.json

   Every variation answers on two URLs — a real path and the older hash form:

   The two options under review are shared as "/option-a" and "/option-b". They are
   deliberately not called v1 and v4 outside this file: a reviewer handed "/v1" and
   "/v4" reads a series and goes looking for the ones in between, which are working
   variations not meant for that audience. The vN paths still resolve, so links
   already sent keep working — the named pair is simply what gets shared.

   "/"                      – v1, the live design
   "/option-a" or "/#option-a"   – the same page as "/" (v1), as shared for review
   "/option-b" or "/#option-b"   – v4, as shared for review
   "/option-c" or "/#option-c"   – v6, the further-developed build (see the swap note
                                   below the map)
   "/option-d" or "/#option-d"   – v7, a replica of option-c (v6) to be edited away from it
   "/v1"        or "/#v1"        – the same page as "/", on its own path
   "/current"   or "/#current"   – the design "/" served before v1 was promoted,
                                   kept reachable for comparison
   "/v2"        or "/#v2"        – variation 2
   "/v3"        or "/#v3"        – variation 3 (started as a copy of v2)
   "/v4"        or "/#v4"        – variation 4 (started as a copy of v3)
   "/v5"        or "/#v5"        – variation 5 (started as a copy of v1)
   "/v6"        or "/#v6"        – variation 6 (started as a copy of v5)
   "/v7"        or "/#v7"        – variation 7 (started as a copy of v6)
   "/salary-calculator"         – the redesigned salary calculator inner page
   "/one-ai"                    – HROne AI agents product page (replaces the live One AI page)
   "/pricing"                   – the live plans & pricing page (public/legacy/hrone-pricing)
   "/original"  or "/#original"  – the earlier proportions, kept for comparison

   The paths only resolve on a host that falls back to index.html for unknown
   routes; vercel.json does that for the deployed site, and Vite's dev server
   does it via the historyApiFallback built into `vite dev`. */
const variants: Record<string, React.ComponentType> = {
  original: AppOriginal,
  current: App,
  /* the review pair — aliases, not copies: each points at the same component its
     vN path does, so there is one page to edit rather than two that can drift */
  'option-a': V1,
  'option-b': V4,
  /* option-c is its own component, not an alias like the two above: it is a replica of
     option-a meant to be edited away from it, so it gets its own copy under variants/v5
     rather than a second name for V1. */
  /* Swapped 2026-09-18 at the user's request: the enhanced build (v6 — module-ordered
     inbox, pointer demo, resolved states) is what "option C" now means, and the build it
     grew out of (v5) moved to option D. The aliases swapped rather than the directories, so
     /v5 and /v6 still point at the code they are named after and any link to those is
     unchanged. */
  'option-c': V6,
  /* 2026-10-14: option-d now points at v7, a fresh copy of v6 to diverge from option-c.
     v5 (its previous target) is still reachable at /v5. */
  'option-d': V7,
  v1: V1,
  v2: V2,
  v3: V3,
  v4: V4,
  v5: V5,
  v6: V6,
  v7: V7,
  /* inner page redesign — hrone.cloud/tools/salary-calculator */
  'salary-calculator': SalaryCalculator,
  /* HROne AI product page, no separate One AI identity: docs/one-ai-page-content.md */
  'one-ai': OneAi,
  /* hrone.cloud/plans-pricing, saved copy with trackers stripped — the base to redesign */
  pricing: Pricing,
}

const route = (window.location.pathname.replace(/^\/|\/$/g, '') ||
  window.location.hash.replace(/^#/, '')).toLowerCase()

/* v1 is the live design, so it is what an unknown route and "/" both land on. The
   page "/" used to serve is still built and still reachable at "/current". */
const Page = variants[route] ?? V1

/* Pages that use an extra web font ask for it now, in parallel with their code chunk,
   rather than after the page has rendered. */
const ROUTE_FONTS: Record<string, string> = {
  /* Doto, the One AI headline's dot-matrix face: only the one instance the page uses */
  'one-ai': 'https://fonts.googleapis.com/css2?family=Doto:ROND,wght@100,900&display=swap',
}
const routeFont = ROUTE_FONTS[route]
if (routeFont && !document.getElementById('route-font')) {
  const l = document.createElement('link')
  l.id = 'route-font'
  l.rel = 'stylesheet'
  l.href = routeFont
  document.head.appendChild(l)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  </React.StrictMode>,
)

window.addEventListener('hashchange', () => window.location.reload())
