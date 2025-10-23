import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Suppress noisy Google Ads / doubleclick errors in dev console
// NOTE: This is a minimal/dev-only helper. Prefer finding/removing the source
// of the requests in production.
if (process.env.NODE_ENV !== 'production') {
  window.addEventListener('error', (ev) => {
    try {
      const msg = ev?.message || '';
      const src = ev?.filename || '';
      if (
        msg.includes('googleads.g.doubleclick.net') ||
        msg.includes('doubleclick') ||
        src.includes('doubleclick') ||
        src.includes('googleads')
      ) {
        // prevent the default logging for these noisy ad/network errors
        ev.preventDefault();
        return true;
      }
    } catch (e) {
      // ignore
    }
    return false;
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
