# ECO//SIM: Coastal City 2050 — Complete Image Inventory

## Photography (Real Images)

| # | File Path | Alt Text | Used On | Caption / Fig |
|---|-----------|----------|---------|---------------|
| 1 | `/manus-storage/kuala-kedah-hd_dfd13b90.jpg` | Aerial photograph of Kuala Kedah estuary showing the river mouth, coastal settlement, and breakwater | Home (Hero) | — |
| 2 | `/manus-storage/stilt-houses-real_4d70b8ec.jpg` | Colourful boats moored in a calm Malaysian river village | Home (FIELD 01), Story (Ch. 01), Briefing (not used directly) | "Clan jetty, Penang. Houseboats and wooden walkways over the sea." / "River village, fictional Teluk Nusa" |
| 3 | `/manus-storage/merbok-mangrove-real_ccdd2def.jpg` | Mangrove prop roots tangled on a tidal flat | Home (FIELD 02), Story (Ch. 04), Briefing (not used directly) | "Mangrove river, Langkawi. Nature's own sea wall." / "Aerial view of the coast" |
| 4 | `/manus-storage/fishermen-dawn-nets-real_81f6e009.jpeg` | (Results verdict photo) | Home (FIELD 03), Results (happy verdict) | "Fishermen with nets at dawn, Kuala Kedah" / "Teluk Nusa at sunset, 2050" |
| 5 | `/manus-storage/fishermen-net-cast-real_a6fc104d.jpg` | Malaysian fishermen at dawn | Briefing (hero), Results (sad verdict), Story (Ch. 03) | "Fishermen at dawn, East Coast" / "Fishermen at dawn, 2050" / "The fishing coast, dusk" |
| 6 | `/manus-storage/mangrove-roots-real_fc3e4c78.jpg` | Mangrove prop roots tangled on a tidal flat | Story (Ch. 02) | "Mangrove roots on a tidal flat" |
| 7 | `/manus-storage/clan-jetties-aerial-real_f756af5d.jpg` | Clan jetty — houses and work over the water | Home (CTA band), Briefing (datum plate), Story (Ch. 05) | "Aerial view of stilt house village on the coast, Penang" / "Where your town lives · clan jetty" / "Life and work on the jetty" |

## Illustration / Map

| # | File Path | Alt Text | Used On | Notes |
|---|-----------|----------|---------|-------|
| 8 | `/manus-storage/teluk-nusa-map-illustrated_e05d6285.png` | Illustrated field map of Teluk Nusa (fictional coastal town) | Simulator (CityMap component) | AI-generated illustrated map used as the simulation base layer |

## Meta / Social Sharing

| # | File Path | Alt Text | Used On | Notes |
|---|-----------|----------|---------|-------|
| 9 | `/manus-storage/og-image_475a5541.jpg` | ECO//SIM — Coastal City 2050 (Open Graph preview image) | PageMeta.tsx (all pages) | Used as the og:image meta tag for social sharing |

## Component Logos

| # | File Path | Alt Text | Used On | Notes |
|---|-----------|----------|---------|-------|
| 10 | `VITE_APP_LOGO` (env variable) | "Dialog graphic" | ManusDialog.tsx | Small 10×10 dialog icon |

---

## Summary by Component

### Home.tsx
- **Hero**: `kuala-kedah-hd_dfd13b90.jpg` — "Aerial photograph of Kuala Kedah estuary showing the river mouth, coastal settlement, and breakwater"
- **FIELD 01**: `stilt-houses-real_4d70b8ec.jpg` — caption: "Clan jetty, Penang. Houseboats and wooden walkways over the sea."
- **FIELD 02**: `merbok-mangrove-real_ccdd2def.jpg` — caption: "Mangrove river, Langkawi. Nature's own sea wall."
- **FIELD 03**: `fishermen-dawn-nets-real_81f6e009.jpeg` — caption: "Fishermen with nets at dawn, Kuala Kedah"
- **CTA Band**: `clan-jetties-aerial-real_f756af5d.jpg` — "Aerial view of stilt house village on the coast, Penang"

### Briefing.tsx
- **Hero photo**: `fishermen-net-cast-real_a6fc104d.jpg` — "Malaysian fishermen at dawn"
- **Datum plate**: `merbok-mangrove-real_ccdd2def.jpg` — "Mangrove river in Langkawi"
- **Clan jetty**: `clan-jetties-aerial-real_f756af5d.jpg` — "Clan jetty houses on stilts over the sea"

### Results.tsx
- **Verdict photo (happy)**: `fishermen-dawn-nets-real_81f6e009.jpeg` — "Teluk Nusa at sunset, 2050"
- **Verdict photo (sad)**: `fishermen-net-cast-real_a6fc104d.jpg` — "Fishermen at dawn, 2050"

### Story.tsx
- **Ch. 01**: `stilt-houses-real_4d70b8ec.jpg` — "Colourful boats moored in a calm Malaysian river village"
- **Ch. 02**: `mangrove-roots-real_fc3e4c78.jpg` — "Mangrove prop roots tangled on a tidal flat"
- **Ch. 03**: `fishermen-net-cast-real_a6fc104d.jpg` — "Fishing boats on the coast at dusk"
- **Ch. 04**: `merbok-mangrove-real_ccdd2def.jpg` — "Aerial view of mangrove forest meeting coastal development"
- **Ch. 05**: `clan-jetties-aerial-real_f756af5d.jpg` — "Clan jetty — houses and work over the water"

### Simulator (CityMap.tsx)
- **Base map**: `teluk-nusa-map-illustrated_e05d6285.png` — AI-illustrated map of fictional Teluk Nusa

### PageMeta.tsx (all pages)
- **OG image**: `og-image_475a5541.jpg` — social sharing preview

### ManusDialog.tsx
- **Logo**: from `VITE_APP_LOGO` env var — "Dialog graphic"
