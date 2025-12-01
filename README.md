Satoshi Nakamoto Tracker — Local Test & Troubleshooting

Overview
- Lightweight frontend that fetches BTC price from CoinGecko and exchange rates from ExchangeRate-API.
- Includes a service worker to cache local assets; during development this can interfere with external API requests.

How to run locally (Windows / PowerShell)
1. Open PowerShell in the project root (where `index.html` is located).
2. Serve the files over HTTP (service worker requires HTTP/HTTPS):

```powershell
python -m http.server 8000
# or, if Node.js is available:
npx http-server -p 8000
```
3. Open `http://localhost:8000/` in your browser.

What to look for (DevTools)
- Console: look for these messages:
  - `[fetchExchangeRate] starting`
  - `[fetchBTC] starting attempt 0`
  - `[fallback] initiating forced fetch attempts` (if the fallback ran)
  - `[SW] unregistered old service worker` (indicates previous SWs were removed)
- Network: filter requests by `coingecko` and `exchangerate-api` and confirm they return `200` and JSON.

Quick curl tests
```powershell
curl "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
curl "https://api.exchangerate-api.com/v4/latest/USD"
```

Automated API tests
- PowerShell (Windows): `scripts\test_api.ps1`
- Shell (Linux/macOS): `scripts/test_api.sh`

Run them from the project root:

```powershell
# PowerShell
.\scripts\test_api.ps1

# bash
bash scripts/test_api.sh
```

If API requests are missing or failing
- Service worker: In DevTools → Application → Service Workers, click `Unregister` and reload.
- CORS or blocked: Check the console for CORS errors or network blocked-by-client messages.
- CDN / library blocking: If Chart.js or another CDN resource shows an `Integrity` or load error, remove the `integrity` attribute or provide a local fallback.
- Opened via `file://`: Service workers and `fetch` behave differently. Always serve via `http://` for accurate testing.

Changes made to help debugging
- `index.html`
  - Network requests moved to run before chart initialization.
  - Fetch calls use `cache: 'no-store', mode: 'cors'`.
  - Console logs added for fetch entry points and a 2s fallback that forces fetch attempts.
  - Added automatic unregister of existing service workers on page load to avoid stale caches.
- `serviceWorker.js`
  - Fetch handler bypasses cache for cross-origin requests so external APIs are always fetched from network.

Next steps you can request
- Add a local `chart.min.js` fallback to guarantee chart initialization without CDN.
- Remove SRI/integrity on the Chart.js script if it's causing load failures.
- Add UI-visible status indicators for API success/failure.

If you want, I can also add an automated test script that runs the curl checks and reports pass/fail locally.
