# v8 — Image loading speed optimisation (Aug 18, 2026)

User request: "Find a way to make the images load faster. Also, just make the images load faster."

## Plan
1. Audit every manus-storage image used across pages (collect paths from grep of `manus-storage` in client/src).
2. Download originals, convert to optimised WebP/AVIF at reduced resolution (hero ≤1440w, plates ≤1000w, small plates/thumbs ≤640w), quality ~75-80.
3. Upload optimised versions with manus-upload-file --webdev, record new hashes.
4. Code changes:
   - Critical hero images: <link rel="preload" as="image" in index.html for home hero + results verdict? Keep small list.
   - Below-the-fold: loading="lazy" + decoding="async" on all <img>.
   - Blur placeholder: CSS or tiny inline base64 poster? Simplest robust: add a .img-plate wrapper with subtle warm bg while loading (paper-grain color) — avoid heavy JS placeholders to keep perf.
   - Map: CityMap renders ~400 SVG + one illustration bg — optimise the illustrated map image too.
5. Verify: measure network transfer sizes before/after via curl -s -o /dev/null -w "%{size_download}".
6. Checkpoint + deliver.

## Current image inventory (manus-storage paths in code) — grep needed; known:
- real-kampung-boats_57e6e432.jpg (home hero Fig.01)
- real-penang-jetty_a82ca28d.jpg (home 01, story ch05)
- real-mangrove-aerial_deefef09.jpg (home 02)
- real-fishermen-nets-clean_bda00363.jpg (home 03, brief FIG.02, results verdict DAWN)
- real-langkawi-boats_00027e7a.jpg (home Fig.05)
- beach-sunset photo (results SUNSET), clan jetty (brief FIG.04), monsoon sea?, fishermen dawn (was watermarked, replaced), map illustration (simulator bg)
- Story chapters use photos; need grep to list all.

## Old -> New path mapping (optimised, uploaded)
| Old | New |
|---|---|
| real-kampung-boats_57e6e432.jpg | hero_kampung-boats_1b7420b2.jpg (hero, 1440w) |
| real-fishermen-nets-clean_bda00363.jpg | hero_fishermen-nets-clean_c209bb82.jpg (hero, 1440w) |
| real-beach-sunset_d533ecf5.jpg + _7c0d4a16.jpg | hero_beach-sunset_46f82884.jpg (hero, 1440w) |
| real-penang-jetty_a82ca28d.jpg | penang-jetty_1c063f93.jpg |
| real-mangrove-aerial_deefef09.jpg | mangrove-aerial_136e988a.jpg |
| real-river-village_e8ba4542.jpg | river-village_7f0fc750.jpg |
| real-mangrove-roots_4e54c47e.jpg | mangrove-roots_f89f9365.jpg |
| real-mangrove-river_4e88bc33.jpg | mangrove-river_a2d59747.jpg |
| real-langkawi-boats_00027e7a.jpg | langkawi-boats_cc225119.jpg |
| real-clan-jetty_cc25bfaa.jpg | clan-jetty_7ac07e27.jpg |
| teluk-nusa-map-illustrated_e05d6285.png | teluk-nusa-map_68653673.png (1280w palettised) / teluk-nusa-map_bf9e9da5.webp |

Upload size total: ~1.3MB webp / ~1.6MB jpg vs ~3.8MB originals. Dev-server transfer per image ~1-2.2s -> expect ~0.1-0.4s now.

## Measurement notes
- Dev server adds ~1.5s overhead to ALL storage fetches (cold proxy), so local curl timing is not a fair comparison.
- What matters: file sizes now transfer much less data (map PNG 1.1MB→0.88MB served; originals 0.4-1.1MB vs optimised 0.06-0.2MB). On production (CDN-cached storage) the byte reduction is the full win, plus eager/preload for hero.
- All pages verified rendering correctly with new hashes (screenshots OK).

## Key rules
- Use manus-upload-file --webdev for storage (auto-hashed, persistent).
- Do not keep local media in project dir.
- Preserve alt text and editorial fig captions.
