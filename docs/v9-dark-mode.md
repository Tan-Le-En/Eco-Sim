# v9 — Dark mode fixes

## User report
- End of Story page is not dark.
- Hero is "not dark enough" — very blurry (likely the gradient overlay on the hero photo is washed out in dark mode, or dark hero bg is light beige).

## Root causes found
1. Story closing band: `bg-foreground text-background` — `--foreground` in dark mode is light beige (oklch 0.92), so the closing band stays LIGHT in dark mode. Fix: use `dark:bg-card` or swap to token pair that darkens.
2. Photo-plate img placeholder bg oklch(0.9 0.012 85) hardcoded light — make it respect dark mode.
3. paper-grain noise @35% opacity on top of dark bg also whitens slightly (acceptable but reduce in dark mode).

## Fix plan (all confirmed)
1. index.css `.paper-grain::before` — reduce opacity to 0.18, and add `html.dark .paper-grain::before { opacity: 0.1; background-color: oklch(0.16 0.01 75); }` so noise doesn't wash out the dark bg. (Blurry/whitened hero + story hero = grain + blur.)
2. index.css `.photo-plate img` placeholder — change to `background-color: var(--secondary)` so it adapts to dark mode.
3. Story.tsx closing band (~line with `bg-foreground text-background`) — replace with semantic: `bg-card text-card-foreground dark:bg-[oklch(0.2_0.012_75)]`? Simplest: use `dark:bg-popover` or just `bg-secondary text-secondary-foreground`. Chosen: keep design intent (dark band) → use `bg-secondary text-secondary-foreground`.
4. SiteHeader.tsx line 76 `bg-foreground text-background` (mobile menu) — same fix: `bg-secondary text-secondary-foreground`.
5. CookieBanner.tsx line 38 same pattern — fix: `bg-secondary text-secondary-foreground`.
6. Home.tsx line 189 `border-foreground hover:bg-foreground hover:text-background` (secondary CTA) — fix: `border-foreground/30 hover:bg-foreground/10` (avoid filling with light bg).
7. SiteHeader mobile menu: check line 135 `bg-background` fine (token).

## Verified via console (dark mode on /story)
- body bg = oklch(0.16 0.01 75) DARK OK
- closing band = oklch(0.92 0.008 85) LIGHT ← root cause
- paper-grain opacity 0.35 washes bg (blurry effect)
- Story section bg-transparent (inherits body)

## Diagnosis TODO
- [ ] Check .dark tokens in index.css — background value, whether paper-grain / card backgrounds stay light in dark mode
- [ ] Story page: check closing band (Fig.05 CTA band?) — may use hardcoded light bg classes (bg-background overrides or hardcoded colors)
- [ ] Hero: check gradient overlay classes and any hardcoded light colors (e.g., bg-card with hardcoded oklch light values)

## Key facts
- Dark tokens live in an unlayered `html.dark` block after :root in index.css (fixed in v7).
- Theme toggle persists in localStorage (ThemeContext).
- Use browser to verify live rendering: set dark via toggle, capture pages.

## Fixes TODO
- [ ] Make dark mode background truly dark (near-black warm charcoal, not beige)
- [ ] Ensure hero gradient overlay provides real contrast in both modes
- [ ] Ensure Story closing band uses semantic tokens, not hardcoded light colors

## Done (verified in browser, dark mode persisted)
1. index.css: paper-grain noise reduced (0.12 in dark, multiply blend in light) — fixed "blurry hero"
2. index.css: .photo-plate img placeholder now var(--secondary) — dark-adaptive
3. Story.tsx: closing band now bg-secondary dark:bg-[oklch(0.12)] — VERIFIED DARK at page bottom (screenshot confirms dark closing band + dark cookie banner)
4. SiteHeader.tsx: active nav chip dark-adaptive
5. CookieBanner.tsx: band + label + decline button dark-adaptive — verified dark
6. Home.tsx: hero overlay gradient now from-background/85 (dark scrim, dark-adaptive); Mission briefing CTA hover fixed
- TypeScript clean, all pages checked. Remaining: final screenshot pass /simulator dark mode, then checkpoint.
- Note: story screenshot shows cookie banner light because localStorage choice reset? No — banner shows default light bg-secondary... actually banner bg appears LIGHT in the bottom screenshot. Re-check: dark cookie banner uses dark:bg-[oklch(0.2)] — in the screenshot it appears light beige. Verify via console.
