import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AppOriginal from './AppOriginal'
import V1 from './variants/v1/App'
import V2 from './variants/v2/App'
import V3 from './variants/v3/App'
import V4 from './variants/v4/App'
import './index.css'

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
   "/v1"        or "/#v1"        – the same page as "/", on its own path
   "/current"   or "/#current"   – the design "/" served before v1 was promoted,
                                   kept reachable for comparison
   "/v2"        or "/#v2"        – variation 2
   "/v3"        or "/#v3"        – variation 3 (started as a copy of v2)
   "/v4"        or "/#v4"        – variation 4 (started as a copy of v3)
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
  v1: V1,
  v2: V2,
  v3: V3,
  v4: V4,
}

const route = (window.location.pathname.replace(/^\/|\/$/g, '') ||
  window.location.hash.replace(/^#/, '')).toLowerCase()

/* v1 is the live design, so it is what an unknown route and "/" both land on. The
   page "/" used to serve is still built and still reachable at "/current". */
const Page = variants[route] ?? V1

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>,
)

window.addEventListener('hashchange', () => window.location.reload())
