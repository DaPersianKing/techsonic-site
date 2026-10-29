# Techsonic V2 content and asset audit

## Inputs inspected

- Existing React/TypeScript/Vite source, entry point, routes, styling, UI primitives, package and lockfile, public metadata and logo assets.
- Existing Git branches/remotes; `main` and `origin/main` matched at the initial refreshed comparison. The feature branch was clean before implementation.
- Local Techsonic Brand Guide image in `Company Stuff/Logos`, plus the website package flyer in `Company Stuff/Flyers`.
- Local `Services` and `ChannelOps` reference directories. These contain conceptual workflow images, service descriptions and branded application material. They are not verified proof of completed customer engagements or numerical results. Confidential invoice directories were not used for public assets.
- Live restaurant, salon and boutique demo pages, including displayed capability and fictional-business notices. Screenshots are captured from the actual sites, not generated mockups. Capture date: October 28, 2026.

## Findings and implementation decisions

- Existing contact submit handler was a no-op while the UI displayed success. Replaced with a server endpoint, validated requests, spam checks and actual email acceptance handling.
- Existing homepage implied completed/active customer milestones. Replaced with equal-weight process controls and explicit framework labeling.
- Existing content made unsupported supplier counts, unbiased-percentage, preferential-pricing and software-platform claims. Removed these claims. Ecosystem language is scoped to TSD, CSP and hyperscaler sourcing routes without blanket partnership/certification claims.
- Existing page metadata/structured data called Techsonic an AI software platform. Replaced with the advisory and engineering positioning, Techsonic LLC identity and service metadata.
- Existing logo selection ignored icon/legal variants. Icon now has a distinct source; legal pairs the approved mark with a visible Techsonic LLC identity. Light/dark variants use optimized versions of approved raster originals because the existing simplified SVG wordmarks do not faithfully represent the brand-guide logo. Preserve proportions and clear space; do not redraw the legal mark.
- No supplied `CarrierSlaCalculator.tsx` was present. Implemented the specified checklist behavior using existing button and utility infrastructure.
- No authenticated customer outcome evidence or supporting screenshots for 38%, 45 days or 85% were present. Engagements are prominently labeled illustrative profiles with target outcomes. They must not be relabeled as actual case studies without evidence and approval.
- Package inclusions follow the local flyer: Standard 1–3 pages; Growth up to five pages with supported booking/menu integration and monthly content edits; VIP store/catering and scoped catalog setup. Advanced integrations, automation and extra optimization remain custom quoted. No prices are displayed.
- Portfolio describes demonstrated interactions, not real transactional integrations. Demos do not take real orders, bookings, payments or customer inquiries. Production functionality requires agreed integrations.
- New routes separate enterprise advisory, development/automation and website leads; legacy homepage anchors remain for advisory, solutions, about and tools where practical.
- No verified local office address was supplied; no fictitious address or local-business review/rating claim is published.

## Feed evaluation

The brief uses source headlines, publication dates, original links and short Techsonic context notes. It does not copy article descriptions or full text. Category context is rule-based editorial guidance, not an AI-generated summary of an unread article. No category is filled with fabricated stories.

| Source                                                        | Evaluation                                                                                                                                                          |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CISA                                                          | Official advisory RSS returned XML successfully in live endpoint check.                                                                                             |
| AWS What's New                                                | Official RSS returned XML successfully in live endpoint check.                                                                                                      |
| Google Cloud                                                  | Official `cloudblog.withgoogle.com/rss/` returned XML successfully; the `/blog/products/rss` page was HTML and is not used.                                         |
| FCC                                                           | Official news feed endpoint returned 403 from the verification environment. Failure is tolerated; do not claim verified access. Recheck from preview.               |
| Azure Updates                                                 | Suitable primary-source category; no verified stable feed was established in this implementation, so it is not guessed.                                             |
| Light Reading, Fierce Network, BleepingComputer, The Register | Relevant secondary sources, but no feed redistribution permission was established. Not scraped or ingested. Prefer original links and reviewed terms before adding. |

The server filters recent relevant articles, enforces HTTPS and source-host allowlists, strips tracking parameters, rejects declarations/entities, and deduplicates URLs and titles. A per-source limit prevents a prolific cloud feed from filling the entire brief. Partial refresh retains previous entries for failed sources; total failure leaves the prior KV brief untouched. Actual scheduled access must be verified from preview before release.

## Calculator boundaries

SLA math handles only the three explicitly modeled methods; it is not a universal interpretation of a supplier agreement. Overlapping incidents must be merged before entry. Exclusions subtract outage minutes without changing the period denominator. Credit basis is entered MRC without period proration; max credit is a percentage of that basis. Target equality does not trigger a credit. Contract eligibility, claim windows and evidence remain separate.

Bandwidth uses evenly distributed users and additive per-active-user budgets; site traffic measurement remains necessary. Cost comparison applies annual escalators at 12-month anniversaries, recurring taxes only and one-time credits once; heterogeneous terms are flagged instead of advertised as savings.
