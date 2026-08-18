# v11 — User review fixes (Aug 18)

## User requests (verbatim summary)
1. Hero: "One million people." / "Twenty-five years." spacing between lines not enough; "years" too far left. DONE-ish (added block spacing mb-6/mb-8; still verify left alignment — user said years too much to the left; all lines start same x now; acceptable).
2. Est. 2026 latitude strip too bulky on small screens. DONE: compact 10px, wraps, second span hidden <640px.
3. Langkawi "Fishing bay" image too small. DONE: h-36 -> h-52 to match FIELD plates.
4. Hero must fit every screen size (done: clamp type + grid).
5. "add a bit of a background before you want to start" — user wants a pre-start background/atmosphere (interpretation: richer background texture or scene before starting? possibly the intro/landing background; ambiguous — implement subtle atmospheric background treatment on landing + maybe story intro). TODO: ask or add atmospheric treatment.
6. Privacy policy + terms pages missing. TODO: add /privacy + /terms pages, link from cookie banner, footer, SiteFooter/SiteHeader.
7. Images roughly the same size, every screen. DONE: FIELD plates h-52 uniform. Verify Story plates + CTA band.
8. Prepare project for GitHub repo upload. TODO: export via Settings → GitHub (user action) — tell user; also ensure repo-clean state (no local-only assets).

## Assets in use (storage URLs used in code)
- HERO /storage/hero_kedah-kampung_... (Home right plate, Kuala Kedah)
- FIELD plates: /storage/penang-jetty_1c063f93.jpg (Clan jetty, Penang), /storage/mangrove-aerial_136e988a.jpg (Langkawi), /storage/fishermen-nets_... (fishermen hailing nets)
- CTA band: LANGKAWI = fishing bay image
- Story: river-village_7f0fc750.jpg, mangrove-roots_f89f9365.jpg, hero_beach-sunset_46f82884.jpg, mangrove-aerial_136e988a.jpg, penang-jetty_1c063f93.jpg
- Results: hero_beach-sunset_46f82884.jpg, hero_fishermen-nets-clean_c209bb82.jpg

## Done in v10 checkpoint b7572028
- Anti-slop copy pass (em-dashes removed, roleplay cut, sources on Transparency: IPCC AR6, DOE Malaysia, FRIM, FAO).

## Notes
- Mobile check 375px: hero looks good; photos uniform; footer compact.
- Langkawi in CTA band hidden on <md (md:hidden) — fine per user "hidden md:block" was already; height fixed.
- Cookie banner (FieldNoteCookies) links need Privacy/Terms links.
- Footer component: global site footer links.
