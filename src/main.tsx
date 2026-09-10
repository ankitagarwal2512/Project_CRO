import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AppOriginal from './AppOriginal'
import './index.css'

/* "/"          – current design: big product on first view, settling on scroll
   "/#original" – the earlier proportions, kept for comparison */
const isOriginal = window.location.hash === '#original'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{isOriginal ? <AppOriginal /> : <App />}</React.StrictMode>,
)

window.addEventListener('hashchange', () => window.location.reload())
