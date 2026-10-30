# Analytics browser regression fixture

Run `npm run dev -- --host 127.0.0.1 --port 4174`, then open
`http://127.0.0.1:4174/tests/browser/analytics.html` in a real browser.
Do not set any GA4 environment flags. This fixture injects a local no-network
tag transport into the actual AnalyticsClient and renders the actual consent UI.
It is not part of the production build or public route inventory.

Browser assertions (also exercised through browser automation during V2.5 review):

1. Before consent, the audit contains no commands or Google resources. If a choice
   was saved previously, use Manage preferences → Reject, then clear only the
   fixture's `techsonic.analytics-consent.v1` storage entry for the unknown state.
2. Open preferences using the keyboard, toggle nothing and press Escape. No
   consent is granted; the banner remains. Check Tab stays in the native dialog
   while open and focus returns to its trigger on close.
3. Reject: the banner disappears and no tag appears. Reload: refusal persists.
4. Manage preferences → Accept, then navigate Advisory → Contact → Contact query
   change → Tools. Count exactly one `page_view` per distinct canonical path,
   none for the query/hash-only change, and no private query/fragment values in
   commands. React StrictMode must not duplicate initialization or the tag.
5. Emit each fixed event and inspect its payload. Repeated form starts and the
   same tool event are deduplicated within a route visit. No raw content fields
   may appear. Actual form/advisor/tool wiring is covered by component tests.
6. Reject after accepting. The tag disappears, the page reloads, refusal remains,
   and no queue or Google resources appear in the fresh document.
7. Check the consent UI at desktop and 390px, including keyboard focus, buttons,
   scrolling, and no application console errors. Resources must remain local;
   Google transport is intentionally mocked, not activated for this test.

Unit and DOM integration coverage runs under `npm test`. The real GA4 transport,
Enhanced Measurement configuration, Realtime and DebugView require a separately
approved activation; see `docs/V2.5-SEO-AUDIT.md`.
