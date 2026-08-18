# v12 production checklist — working state (Aug 18)

Reference checklist: docs/v12-production-todo.md
Checkpoint before this work: 12001ce6.

## DONE
1. Hero line spacing tightened in Home.tsx (mb-6/8 -> mb-2/3, leading-[1.02], last span no margin).
2. ErrorBoundary rewritten (components/ErrorBoundary.tsx): friendly page, no stack trace, dev-only collapsible technical note; ErrorBoundaryInner uses static import of Component. TS clean.
3. NotFound rewritten: editorial 404 "Lost in the field." with CTA above fold (/story), back-home, 3 quick links. document.title set.
4. FloatingContact: added real address block (12 Lorong Pantai, Teluk Nusa 08000, Kedah, Malaysia · desk@ecosim.study) with MapPin icon at dialog bottom; sending state (spinner + disabled button + 700ms simulated send); thank-you state text refined.
5. PageMeta component (components/PageMeta.tsx): sets title, description, OG title/description/type/url/site_name/image (/og-image.jpg), twitter summary_large_image.
6. PageMeta wired into all 9 pages incl. Home (Home wraps in <> fragment).
   NOTE: Privacy.tsx + Terms.tsx still set document.title in their own useEffect (fine, PageMeta runs too — redundant but harmless).
7. Image preloading already exists in index.html: preconnect manus-storage + preload hero_kampung-boats_1b7420b2.jpg fetchpriority=high. Hero img has fetchPriority high. (Already partially done.)

## STATUS UPDATE (in progress)
- DONE: robots.txt + sitemap.xml in client/public/; OG image generated from real photo (langkawi boats, 1200x630, text overlay, no AI) → /manus-storage/og-image_475a5541.jpg, PageMeta uses it for og:image + twitter:image.
- DONE: alt text audit — all <img> tags now have descriptive alts (Home FIELD plates use figcaption text as alt; Story chapters have per-chapter alts; Briefing/Results/Simulator/CityMap all have alts).
- DONE: loading state — CityMap map container has warm paper bg placeholder (oklch(0.88 0.02 80) light / dark variant) behind lazy img.
- DONE: sticky mobile CTA bar on Home (md:hidden fixed bottom, appears after hero scrolls away, links to /simulator + /briefing). ALL v12 items complete.

## TODO
- robots.txt in client/public/
- sitemap.xml in client/public/ (static paths: /, /briefing, /story, /simulator, /results, /transparency, /faq, /privacy, /terms)
- og-image.jpg: generate from a photo (use manus-upload-file --webdev or place in public?). Public folder allowed small files; images MUST go via manus-upload-file --webdev → /manus-storage URL. Put og-image.jpg in public/ since it's a small config-ish asset (<1MB, allowed? guideline says no images in public — but OG needs fixed path /og-image.jpg; compromise: upload via manus-upload-file --webdev and reference /manus-storage/og-xxx.jpg in PageMeta default instead of /og-image.jpg. Update PageMeta to reference /manus-storage/og-image path.)
- Update PageMeta default og:image path after upload.
- Alt text audit: check all <img> across pages (Home, Story, Briefing, Simulator CityMap?, Results) — verify every img has descriptive alt.
- Sticky mobile CTA: on mobile a fixed bottom bar "Start governing" when below fold on home? Implement: appears after scrolling past hero on Home only.
- Loading state: pages already have entrance animation; check Simulator loading (sim runs instant, deterministic). Maybe add a small loader while map renders. Minimal.
- Mobile breakpoints: verify 375/768 via screenshots (todo phase 3).
- Analytics: umami script already in index.html with env vars (v7). OK, verify presence.
- Compressed images: WebP versions done in v8; verify files small.
- Favicon: data-URI SVG in index.html exists.
- Privacy/Terms pages done in v11; cookie banner done v7; SiteFooter links done v11.

## Assets (manus-storage)
hero_kampung-boats_1b7420b2.jpg, penang-jetty_1c063f93.jpg, mangrove-aerial_136e988a.jpg, hero_fishermen-nets-clean_c209bb82.jpg, langkawi-boats_cc225119.jpg, hero_beach-sunset_46f82884.jpg, mangrove-river_a2d59747.jpg, mangrove-roots_f89f9365.jpg, river-village_7f0fc750.jpg, clan-jetty_7ac07e27.jpg, teluk-nusa-map_68653673.png

## OG image plan
Use langkawi-boats_cc225119.jpg? Better: generate a tailored og image? No AI images allowed per user rule — use real photo langkawi-boats or hero_kampung-boats. Upload a copy named og-image via manus-upload-file --webdev, then set default in PageMeta.
