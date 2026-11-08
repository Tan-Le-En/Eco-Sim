# Home Header Width + Prologue No-Scroll + Simulator Map Fit

## Confirmed scope (from user)

1. **Home top bar** (`Home.tsx` hero, bare `SiteHeader`): widen the bar **horizontally** (not vertically) so it reaches toward the light/dark toggle area — **not full width**. The bar is the ECO//SIM logo + controls area at the top of the home screen.
2. **Prologue** (`/prologue`): make it fit without scrolling (“so I don’t have to scroll”). Reduce overall length/size slightly while keeping it readable and preserving the storybook flow.
3. **Simulator map**: extend the map to fit the space it’s given; proportions may be adjusted.
4. **Suggest additions** (advisory, not implemented in this pass unless requested).

## Context / current state

- `client/src/pages/Home.tsx` — hero is `lg:grid-cols-[1.1fr_1fr]`. Left column contains `<SiteHeader bare />` at `:147` inside a padded container (`px-6 sm:px-10 lg:px-14 py-8 lg:py-10`). Bare header renders the full sticky-style bar markup but is placed inline; its inner row (`SiteHeader.tsx:68`) uses `px-6 sm:px-10 lg:px-14 h-16` and `justify-between`, so nav/theme controls sit at the right edge of that padded area — visually “short” of the toggle region depending on layout intent.
- `client/src/components/SiteHeader.tsx` — `bare` mode used on Home; desktop nav includes theme toggle (`:123-130`). Header height is `h-16` (recent change) — **do not increase vertically**.
- `client/src/pages/Prologue.tsx` — chapter progress + animated chapter/briefing + nav footer; generous `py-10/14`, large type, `min-h-56` image, briefing includes registers/challenges/datum/photo — likely exceeds viewport height.
- `client/src/components/CityMap.tsx` — wrapper `w-full max-w-[680px] mx-auto` (`:170`), stage `aspect-[4/3]` (`:184`). Simulator left column (`Simulator.tsx:424,427,493`) gives it horizontal space but the cap prevents filling.
- No lock icon/component found in `client/src` (only scroll-lock comments/behavior). If a specific “lock” UI element appears in the running app, locate it by screenshot/selector before changing; plan assumes Prologue compactness addresses the “no scroll” clarification.

## Implementation plan

### 1) Home top bar — widen horizontally toward theme toggle (not full)

**Goal:** Bare header bar on Home uses more horizontal space so the right-side controls (search/theme area) align closer to the light/dark toggle region, without making the bar full-width and without changing height.

**Files:** `client/src/pages/Home.tsx`, optionally `client/src/components/SiteHeader.tsx`

**Steps:**
- Inspect how `bare` is rendered: in Home the header sits inside the left hero column. Options (pick the least disruptive that matches intent):
  - **A (preferred):** In `SiteHeader`, when `bare`, reduce/adjust inner horizontal padding on large screens (e.g. `px-4 sm:px-6 lg:px-8` or asymmetric padding) so content spans closer to container edges; keep `h-16`. Ensure non-bare/sticky header keeps existing rhythm (or apply only under `bare`).
  - **B:** In `Home.tsx`, adjust the left column/header wrapper (negative margin/padding tweak or wider internal max) so the bare header’s right edge reaches nearer the theme toggle — careful not to break the border-r/grid balance.
  - **C:** Make the bare header bar span a wider portion (e.g. pull it out of padded flow with controlled width) while staying within the hero, not `w-full` of viewport.
- Verify at common widths (mobile, `md`, `lg`, `xl`) that: bar is wider horizontally, reaches toward toggle, not full-bleed/full-width, height unchanged, logo/nav alignment intact.

**Acceptance:** Home top bar visibly extends horizontally toward the light/dark toggle area; no vertical growth; not full width.

### 2) Prologue — fit without scrolling (slightly smaller/shorter)

**Goal:** Prologue view fits typical laptop/desktop viewport without page scroll where feasible; mobile may still scroll if content density requires, but reduce excess. Keep narrative, chapter navigation, accessibility, and CTA.

**File:** `client/src/pages/Prologue.tsx`

**Steps:**
- Tighten vertical rhythm: reduce `py-*` on progress, chapter sections, briefing, and nav footer; reduce gaps (`gap-12` → smaller), margins (`mb-*`), and figure/image sizing (`min-h-56`, `m-*`, briefing `h-56` photo) while preserving hierarchy.
- Constrain content height: consider `min-h-[calc(100vh-var(--header-h,4rem))]` / flex layout so progress + main content + nav fit; allow internal areas to shrink (`min-h-0`) and use `overflow-auto` only as a last-resort fallback inside a panel (prefer fitting).
- Typography/blocks: slightly reduce oversized headings/quote sizes or spacing on constrained heights (`lg:py-*`, `text-*` clamps) — “slightly smaller”, not a redesign.
- Briefing chapter is densest: compact register rows, challenges grid, and datum table (smaller padding/font where already `text-[10-13px]`, or collapse secondary detail) so chapter 5 fits.
- Validate chapters 1–4 and 5: no required scrolling on a ~768–900px tall viewport at desktop width if practical; ensure Next/Back/CTAs remain visible/tappable.

**Acceptance:** Prologue feels shorter/less tall; user can progress without needing to scroll in normal desktop use.

### 3) Simulator — extend map to fit given space (proportions adjustable)

**Goal:** Town Survey map uses available horizontal space in the simulator’s left column instead of being capped at 680px.

**Files:** `client/src/components/CityMap.tsx` (primary), optionally `client/src/pages/Simulator.tsx`

**Steps:**
- In `CityMap.tsx:170`, relax/remove `max-w-[680px] mx-auto` (e.g. `w-full max-w-none` or a larger cap like `max-w-full`/responsive max that fills the column). Keep `aspect-[4/3]` so the photo/grid mapping remains correct (documented constraint at `:180-182`); “mess with proportions a bit” can include testing a slightly different aspect only if alignment with the 1920×1440 map remains acceptable — **prefer keeping 4:3** unless visual fit clearly benefits and `object-cover`/overlay alignment is verified.
- Ensure padding/border (`p-1.5`) and legend still fit; map should not overflow the grid column (`min-w-0` already present above).
- Optional: let Simulator pass a `className` to allow wider map without affecting other `CityMap` usages (search for other imports/usages before changing defaults).

**Acceptance:** Simulator map expands to fill the left column space; no distortion that breaks cell alignment; no horizontal overflow.

## Validation

- Run TypeScript/linters/build used by the project (confirm `package.json` scripts; e.g. `pnpm -s tsc --noEmit` / `pnpm -s build` if present) — **do not commit**.
- Manual checks:
  - Home: top bar wider horizontally toward theme toggle, same height, not full width; mobile unaffected/balanced.
  - `/prologue`: chapters 1–5 navigable with minimal/no scrolling on desktop viewport.
  - `/simulator`: map fills available space; overlay/hover still works; layout stable at `lg` breakpoint.

## Risks / notes

- **“Lock” ambiguity:** no lock UI found in source; user clarified Prologue no-scroll. If the “lock is good but too long/big” refers to a different visible element, confirm with a screenshot/selector in a follow-up.
- **Prologue density vs. accessibility:** keep tap targets ≥ ~44px where practical and text readable; don’t hide essential mission info.
- **CityMap reuse:** changing default max-width affects any other page using `CityMap` — verify usages.
- **Engine untouched** (sim logic out of scope).

## Suggested additions (advisory)

- **Prologue progress polish:** show chapter titles/dots (1–5) alongside the bar for quicker orientation; optional “Skip to simulation” link on early chapters for returning users.
- **Simulator map focus mode:** a compact “expand map” toggle that temporarily gives the map more vertical/horizontal room on smaller laptops (pairs with “fit the space”).
- **Responsive fit guard:** a subtle `@media (max-height: …)` pass on Prologue to auto-tighten spacing only on short viewports, preserving comfort on tall screens.
- **Visual regression check:** quick Playwright/viewport snapshots for Home header, Prologue chapter 1/5, and Simulator map after layout changes.
