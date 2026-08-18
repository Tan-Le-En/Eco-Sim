# v4 photo asset inventory (uploaded, use paths exactly)

## Newly uploaded (this session)
- /storage/real-clan-jetty_cc25bfaa.jpg — Penang clan jetty wooden stilt houses over water, wide shot (jetty-town.jpg was same source? no: clan-jetty = 7r2NUHgymzc9 wide jetty; jetty-town = Z3Ih06Ov8ZnQ high-res boats+condos behind)
- /storage/real-jetty-town_ecd78f2c.jpg — high-res Penang clan jetty with town/condos behind, blue boat, 2600x1950
- /storage/real-monsoon-sea_1fb07f26.jpg — monsoon storm cloud over sea, NYT underwater-magic article, 2048x1365
- /storage/real-storm-beach_b8463a69.jpg — dark storm beach East Coast Malaysia, Malay Mail, 1000x665
- /storage/real-langkawi-boats_1bd7b85d.jpg — colorful fishing boats bay Langkawi, small boat with driver, 539x360
- /storage/real-mangrove-roots_1515d591.jpg — mangrove prop roots tangle on tidal flat, 1279x720
- /storage/real-mangrove-forest_9da87f9c.jpg — dense mangrove forest canopy with twisted branches, 1080x720
- /storage/real-river-village_b342ee6a.jpg — red boats on calm river village, 612x408

## Previously uploaded (v3)
- home hero right: kuala kedah stilt boats (inline in Home.tsx — check exact path)
- /storage/real-fishermen-dawn_*.jpg — fishermen dawn (briefing FIG.02)
- /storage/real-mangrove-river_*.jpg — mangrove river Kilim (briefing FIG.03)
- home plates: real-penang-jetty, real-mangrove-aerial, real-fishermen-nets
- results verdict: real-fishermen-dawn probably
- Check all actual paths: grep -rn "storage" client/src

## Allocation plan (v4)
- Home hero: kuala kedah (keep)
- Home section photos: penang jetty, mangrove aerial, fishermen nets (keep) + add langkawi boats for closing band
- Briefing: dawn (02), mangrove river (03) + add clan jetty as third figure / monsoon sea
- Simulator goal zones (sea/town/people): storm beach (sea), jetty town (town), fishermen dawn or langkawi boats (people)
- Story mode chapters: monsoon sea (ch2), mangrove roots (ch3), river village (ch1), jetty town or langkawi (ch4)
- Results: verdict photo + goal montage (storm beach, mangrove roots, langkawi boats)
- Transparency: methodology photos (mangrove forest, river village)

## Re-uploaded (session 2) — hashes now match Results.tsx constants
- /storage/real-fishermen-dawn_28f5a3e4.jpg — fishermen dawn, 390x280 (DAWN_PHOTO)
- /storage/real-beach-sunset_d533ecf5.jpg — beach sunset, 900x489 (SUNSET_PHOTO)

## Final upload batch (session 2) — all verified live (ff d8 ff JPEG)
- /storage/real-langkawi-boats_00027e7a.jpg — Home CTA band Fig.05
- /storage/real-monsoon-sea_1cc09645.jpg — unused, available (story ch2)
- /storage/real-river-village_e8ba4542.jpg — unused, available (story ch1)
- /storage/real-mangrove-roots_4e54c47e.jpg — unused, available (story ch3)

## Fix status (v4-spacing-fixes.md): items 1–8 DONE
Done: Results photo paths + plate layout; Results goal titles shortened ("Clean & calm sea","Safe & healthy town","Fair for everyone") + nowrap; Control 08 visible via sticky aside scroll (lg:h-[calc(100vh-3.5rem)] overflow-y-auto); control header nowrap w-20; Briefing FIG.04 clan jetty added; Home CTA band Fig.05 langkawi plate added.
Remaining: Story Mode layer (big feature), mobile responsive pass, checkpoint + delivery.
Current version: 744630cf. Design: Editorial Field Study (see ideas.md).
