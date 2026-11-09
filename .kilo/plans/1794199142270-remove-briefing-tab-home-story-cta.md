# Remove Briefing tab; route continuity to Story (option A)

## Goal
`/briefing` is redundant with Story’s pre-play content. Remove the Briefing tab/page, keep continuity by routing former briefing actions to `/story`, and make the Home hero’s big button go to `/story`.

## Constraints / non-goals
- Do **not** change the simulation engine or model/data.
- Preserve the Story page’s existing “Mission briefing” chapter/content (it already carries mission/goals/challenges/datum) — no new page.
- Keep `/prologue` (hidden cut-scene) working; adjust its final actions per continuity.

## Decisions (confirmed)
- Continuity target: **A** — former “Mission briefing” actions point to **`/story`**. `Prologue` drops the extra “Mission briefing” button and keeps **Start the simulation** → `/simulator`.
- Home hero **big/primary** button → **Story** (`/story`).

## Implementation checklist

1. **Delete Briefing page**
   - Delete `client/src/pages/Briefing.tsx`.

2. **App routing** (`client/src/App.tsx`)
   - Remove `import Briefing from "./pages/Briefing";`.
   - Remove `<Route path={"/briefing"} component={Briefing} />`.

3. **Header nav** (`client/src/components/SiteHeader.tsx`)
   - Remove `{ href: "/briefing", label: "Briefing", tier: "flow" }` from `NAV`.
   - Resulting flow: Story, Simulator, Report (keep numbering behavior intact).

4. **Home** (`client/src/pages/Home.tsx`)
   - **Hero (big button):** change primary CTA from `/simulator` “Start governing” to `/story` (label: “Read the story” / “Start with the story” — keep editorial voice; include arrow). Keep a clear secondary path to `/simulator` (e.g., existing secondary becomes “Open simulator” / “Start governing” → `/simulator`, or add a small secondary) so users can still jump in.
   - **CTA band:** change “Mission briefing” (`/briefing`, outline) → `/story` with an appropriate label (e.g., “Read the story”); keep primary simulator CTA and FAQ quiet button.
   - **Sticky mobile bar:** change “Briefing” (`/briefing`) → `/story` (label “Story”/“Read story”).

5. **Simulator** (`client/src/pages/Simulator.tsx`)
   - Change `<SiteHeader backHref="/briefing" />` → `<SiteHeader backHref="/story" />`.

6. **Prologue** (`client/src/pages/Prologue.tsx`)
   - On the final/last chapter, **remove** the “Mission briefing” button (`/briefing`) and keep **“Start the simulation”** → `/simulator`. (Prologue/Story already present the briefing content.)

7. **Site search** (`client/src/components/SiteSearch.tsx`)
   - Remove the explicit `n.href === "/briefing"` hint branch (or replace with no-op) so dead `/briefing` copy is gone; ensure `/story` hint remains accurate (it already covers the briefing/story flow).

8. **Sitemap** (`client/public/sitemap.xml`)
   - Remove the `<url>` entry for `https://ecosim2050.vercel.app/briefing`.

9. **Content parity check (quick, while editing)**
   - Verify `client/src/pages/Story.tsx` pre-play chapters still include mission/goals/registers, challenges, and 2026 datum/budget. If any Briefing-only affordance is important (e.g., link to `/transparency` “the equations”), add it into the relevant Story chapter — keep it small.

10. **Validation**
   - `pnpm check` (`tsc --noEmit`) passes.
   - Grep for `/briefing` / `Briefing` in `client/src` and `client/public` — expect no live references (historic docs/plans may remain; out of scope unless requested).

## Risks / edge cases
- **Deep links/bookmarks to `/briefing`** will hit `NotFound` after removal. Acceptable given the explicit request; optional future improvement (out of scope): redirect `/briefing` → `/story`.
- **Home hero hierarchy:** making Story the big button changes first-run flow; preserve a visible Simulator path so returning/advanced users aren’t blocked.
- **Nav numbering:** `SiteHeader` numbers flow items by index — removing Briefing should keep numbering coherent (01 Story, 02 Simulator, 03 Report).

## Files expected to change
- Delete: `client/src/pages/Briefing.tsx`
- Edit: `client/src/App.tsx`, `client/src/components/SiteHeader.tsx`, `client/src/components/SiteSearch.tsx`, `client/src/pages/Home.tsx`, `client/src/pages/Simulator.tsx`, `client/src/pages/Prologue.tsx`, `client/public/sitemap.xml`
- Maybe small edit: `client/src/pages/Story.tsx` (only if a parity gap is found)
