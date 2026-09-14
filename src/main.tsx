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
     import V3 from './variants/v3/App'   and add '#v3': V3 below

   "/"           – current design
   "/#v2"        – variation 2
   "/#original"  – the earlier proportions, kept for comparison */
const variants: Record<string, React.ComponentType> = {
  '#original': AppOriginal,
  '#v2': V2,
}

const Page = variants[window.location.hash] ?? App

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>,
)

window.addEventListener('hashchange', () => window.location.reload())
