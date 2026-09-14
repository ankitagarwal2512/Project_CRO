import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AppOriginal from './AppOriginal'
import V2 from './variants/v2/App'
import './index.css'

/* Each entry under src/variants/ is a FULL, independent copy of the page — its own
   App, Chrome, ProductShowcase and Trust — so edits to one variation cannot leak into
   another. (AppOriginal is the exception: it still shares src/components, because it
   exists only to compare the old proportions, not to be edited.)

   To add a variation:
     cp -R src/variants/v2 src/variants/v3
     import V3 from './variants/v3/App'   and add v3: V3 below

   Every variation answers on two URLs — a real path and the older hash form:

   "/"                      – current design
   "/v2"        or "/#v2"        – variation 2
   "/original"  or "/#original"  – the earlier proportions, kept for comparison

   The paths only resolve on a host that falls back to index.html for unknown
   routes; vercel.json does that for the deployed site, and Vite's dev server
   does it via the historyApiFallback built into `vite dev`. */
const variants: Record<string, React.ComponentType> = {
  original: AppOriginal,
  v2: V2,
}

const route = (window.location.pathname.replace(/^\/|\/$/g, '') ||
  window.location.hash.replace(/^#/, '')).toLowerCase()

const Page = variants[route] ?? App

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>,
)

window.addEventListener('hashchange', () => window.location.reload())
