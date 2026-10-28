# Techsonic V2: validation and deployment

## Deployment boundary

Do not deploy this branch to production until review, preview validation, and mail delivery verification are complete. Pushing the feature branch is for code review. Check the existing Cloudflare Git integration: production must track `main`, not every branch. No DNS, email routing, DKIM, SPF, DMARC, nameserver, or custom-domain change is required by this implementation.

The inspected `origin/cloudflare/workers-autoconfig` branch adds a static Workers deployment named `techsonic-site`, SPA fallback, July 1 2026 compatibility date, Node compatibility and observability. It contains no contact backend, Brevo sender configuration, mail DNS records, KV storage or scheduled refresh. It was **not merged**. V2 preserves those relevant Worker properties, explicitly points assets at Vite's `dist`, and adds only the runtime features required by the specification. The Vite plugin is unnecessary for this separate Vite build + Worker bundle flow.

Local comparison cannot establish which revision/configuration is deployed in the Cloudflare account. Before release, inspect the live Worker's bindings, build command, route/custom domain, preview policy and secrets; preserve existing values unless a reviewed change is necessary.

## Local validation

Use Node 24 (see `.node-version`).

```sh
npm ci
npm run lint
npm test
npm run build
npm run worker:check
npm run worker:dev
```

`worker:check` bundles without deploying. `worker:dev` serves built assets and API handlers locally. Vite alone (`npm run dev`) serves the frontend; the form and brief correctly report unavailable when there is no API. Build output includes separate lazy route chunks and static route documents with route-specific metadata. CSP hashes are generated from the built structured metadata. `public/_headers` must be used through the build, not copied directly to hosting.

## Required Cloudflare configuration

1. Create a **separate preview Worker** and separate KV namespace. Copy reviewed config with a preview name; do not use a production deploy command as a preview step. Do not attach the production custom domain.
2. The config declares `INTELLIGENCE` without an account-specific ID, which provides isolated local storage in Wrangler dev. Before deployment, create/select the intended KV namespace and add its actual ID through the reviewed config or dashboard. Recent Wrangler versions can provision an unspecified namespace during deployment; do not accept production provisioning until reviewed. No remote namespace was created by this implementation.
3. Confirm `CONTACT_LIMITER` is present with a limit of five attempts per 60 seconds per IP. This is Cloudflare's distributed, location-based abuse control, not a strict global quota.
4. Set `SITE_ORIGIN` to the exact preview origin, then the canonical production origin `https://www.gotechsonic.com` at release. Same-origin submissions only. Review redirects for the apex domain separately.
5. Configure a Turnstile widget for that hostname. Store `TURNSTILE_SITE_KEY` (public) as a Worker variable. Store `TURNSTILE_SECRET` as a Cloudflare secret. The server checks hostname and the `contact` action, as well as token validity. Do not use production secrets in tests.
6. Set `BREVO_API_KEY` as a Cloudflare secret. Set `BREVO_SENDER` to an existing verified `@gotechsonic.com` sender and `CONTACT_TO` to the intended Techsonic inbox. Neither identity was verified by this implementation. Do not guess the sender or create mail DNS records. Use existing authentication and routing.
7. Check the Monday 14:00 UTC Cron trigger is attached. Seed the preview KV by exercising the scheduled handler using Wrangler's local scheduled-test support, or run a reviewed one-time initialization before production traffic. There is no public refresh endpoint. Each visitor reads cached KV data; visitors never fan out to source feeds.
8. Keep the Worker entry point `worker/index.ts`, assets directory `dist`, binding `ASSETS`, and `/api/*` worker-first routing. The static SPA fallback alone would swallow API requests. API failures are JSON, not HTML.

The form fails closed with 503 when secret/configuration dependencies are missing. Secrets never use a `VITE_` prefix. `.dev.vars.example` documents names only; actual `.dev.vars*` files are ignored. No contact content is persisted by the site; messages are processed by Cloudflare and Brevo and delivered to the configured Techsonic mailbox. Avoid body logging. Configure appropriate mailbox/provider retention and access policies before release.

## Preview release checklist

- Submit one authorized test inquiry in each category with a **test recipient**; confirm inbox delivery, reply-to, headers and category routing. Browser success means Brevo accepted delivery, not that a mailbox delivered it.
- Test invalid form data, unavailable Brevo, missing secrets, invalid/expired Turnstile, disallowed origins, oversized bodies, throttling and timeout states. Do not retry email automatically: a timeout can leave delivery uncertain.
- Run a real scheduled news refresh from the preview Worker and inspect KV, source dates, deduplication, category filtering and cached responses. Test partial and total source failure; retain the previous successful snapshot. A newly configured instance starts empty, without substitute news.
- Test every route and CTA, mobile navigation, keyboard access, reduced motion, all calculator modes, copy/print, and portfolio desktop/mobile selection.
- Check browser console/network, CSP headers, favicon, metadata and sitemap against the **built Worker preview**, not just Vite.
- Measure Core Web Vitals against preview; no real-user field-performance claim is made by a local build.
- Verify current Cloudflare production tracking and build command before merging. Preserve the previous deployment as rollback. Review and approval of the PR precede any production deployment.

## Original API/runtime references

- [Workers static asset bindings and selective worker-first routing](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Cloudflare Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
- [Brevo transactional email API](https://developers.brevo.com/reference/send-transac-email)
- [Turnstile server-side validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)

## Known evidence boundaries

No Cloudflare account credentials or verified Brevo sending identity were supplied. Live inbox delivery, deployed scheduled execution, and production bindings must be validated in preview. No production deployment or DNS change was performed. Customer metrics and deployment claims were not inferred from concept material.
