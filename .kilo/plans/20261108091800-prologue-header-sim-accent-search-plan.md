# ECO//SIM — Hidden Storybook Tab + Header Height + Simulator Accent + Report Squares + Search Upgrade

## Scope & Decisions (confirmed)

| # | Request | Decision |
|---|---------|----------|
| 1 | White header tab too short | `SiteHeader.tsx` inner bar `h-13` → `h-16`; rebalance inner padding so text stays vertically centred |
| 2 | New hidden storybook tab (cut-scene + briefing) | New page `/prologue`, sequential 5-chapter storybook blending Story chapters + Briefing mission/datum/challenges; ends with CTA to `/simulator`; NOT added to `NAV`, NOT indexed in `SiteSearch`; direct URL only (`/prologue`) |
| 3 | Simulator "Slow"/breathing → accent colour orange | `Simulator.tsx` "Slow" speed button and "Pause on events" checkbox use `--accent`/`--interactive` (vermilion-orange) instead of default muted |
| 4 | Remove report "little square" | `Results.tsx` technical appendix table — remove the indicator color dots (`<span style={{ backgroundColor: meta.color }} />` at `:405`) and the no-target `·` dot (`:230`) |
| 5 | Search based on UIUX pro Max skill | Upgrade `SiteSearch` command palette: larger field, result count banner, conditional clear button, arrow-key navigation, Enter-to-accept, Esc behaviour |

## Files affected

- `client/src/components/SiteHeader.tsx` — header height `h-13` → `h-16`, padding rebalance
- `client/src/pages/Prologue.tsx` — NEW page (hidden storybook cut-scene)
- `client/src/App.tsx` — add `Route path={"/prologue"} component={Prologue}` (no NAV entry)
- `client/src/components/SiteSearch.tsx` — UIUX pro Max command-palette upgrade
- `client/src/pages/Simulator.tsx` — "Slow" button + "Pause on events" checkbox → accent colour
- `client/src/pages/Results.tsx` — remove appendix table color dots + no-target `·` dot

## Prologue page design (new file `Prologue.tsx`)

Structure mirrors `Story.tsx`'s `Chapters` + `Briefing.tsx`:

- `PageMeta`, `SiteHeader backHref="/"` (no back button on first chapter? — decision: back to `/`)
- Masthead: "The briefing" title + short intro line
- Sequential chapters: each chapter = one full-screen-ish section with left text panel (number, voice quote, title, lesson) + right photo plate (reuse `Story.tsx` `PHOTOS` + `CHAPTERS` figures where sensible, plus Briefing datum/challenges folded into final chapters)
- Chapter 5 = mission briefing summary + datum snapshot (from `Briefing.tsx` `DATUM`/`CHALLENGES`) + CTA buttons: "Start the simulation" → `/simulator`, "Mission briefing" → `/briefing`
- Framer-motion `AnimatePresence` / `motion` chapter transitions on a stateful `chapter` index (like a cut-scene: advance on "Next", fade between chapters)
- Not in `NAV`; not in mobile drawer; not in `SiteSearch` index; reachable only at `/prologue`

## Search upgrade (UIUX pro Max)

`SiteSearch.tsx` DialogContent:
- Larger input field (height ~44px touch target)
- Result count banner ("N results match 'q'")
- Clear button (×) only when query non-empty; restores full result set
- Leading magnifier; trailing `⌘K` shortcut hint when empty
- Arrow up/down to highlight, Enter to accept, Esc closes
- Keep existing fuzzy matcher + keyboard Cmd/Ctrl+K toggle

## Simulator accent colour

`Simulator.tsx`:
- Speed button `:404` `speed === 1 ? "Slow"` → active state uses `--accent` background/text (orange-vermilion)
- "Pause on events" checkbox `:416` `accent-interactive` — ensure it renders accent colour (verify CSS maps `accent-interactive` to `--accent`; if not, add style)
- Year scrubber `:527` `accent-interactive` → accent colour thumb/track

## Validation

- `pnpm check` (tsc --noEmit) passes
- `pnpm build` (vite build) passes
- Header renders taller on all routes; no overflow regressions
- `/prologue` reachable by direct URL; not linked from header/drawer/search
- Prologue advances through 5 chapters and reaches simulator CTA
- Results appendix table has no colour dots / no-target dots
- Simulator Slow button and Pause-on-events checkbox render accent colour

## Open / out of scope

- Dark-mode variant of accent colour: reuse existing `--accent` (vermilion) already defined in both themes — no new tokens
- Prologue images: reuse existing `/storage/*` assets from `Story.tsx` `PHOTOS`; no new assets required
- Commit not requested — leave working tree dirty
