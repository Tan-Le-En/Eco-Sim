# Research notes — anti-AI-slop & award-winning UI/UX

## Source 1: "How to fix the AI-generated look in your frontend" — Alan West, DEV.to
URL: https://dev.to/alanwest/how-to-fix-the-ai-generated-look-in-your-frontend-1ahh

The AI look = amplification of defaults. Four concrete fixes:

1. **Tear out the default palette** — drop default Tailwind colors entirely, build a custom palette from a base hue that isn't indigo/slate. Force failure: if someone reaches for bg-indigo-600 it shouldn't compile.
2. **Break the layout grammar** — AI layouts are vertically stacked, full-width, centered sections. Use CSS Grid asymmetric layouts: content offset left, art bleeding right, overlapping elements, content that breaks the grid. "Off-center compositions signal a human chose this."
3. **Kill the rounded-2xl reflex** — pick ONE component vocabulary: no border radius, no drop shadows; borders and color contrast do the work instead. One radius vocabulary for the whole site.
4. **Replace placeholder copy** — no "Empower/Unlock/Transform"; no feature cards titled with two abstract nouns; at least one concrete claim with a number; at least one sentence that sounds like a real person wrote it.

Signature examples given: Fraunces serif display + IBM Plex Sans; warm ember accent #e8775a; ink palette #f6f5f1/#3d3a32/#1a1814.

## Source 2: "5 AI Website Design Tips" — James Presbitero, Unpromptable Substack
URL: https://unpromptable.substack.com/p/5-ai-website-design-tips-for-websites

1. Develop taste first — collect 10-15 references from Behance/Dribbble/Awwwards before building.
2. Use pre-existing quality assets; skills mentioned: **UI/UX Pro Max** (skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max) — comprehensive design intelligence across stacks.
3. (truncated — identity/constraints/taste; recognition forms through deliberate constraint)

## Anthropic "Anti AI-Slop UI Design Skill" (medium recap)
URL: https://medium.com/@porter.nicholas/anthropic-skills-marketplace-the-anti-ai-slop-ui-design-skill-a572d0cfef4f
- "Choose fonts that are beautiful, unique and interesting. Avoid generic fonts like Arial and Inter."

## Synthesis for the redesign (v3 direction)
- Palette: custom, non-Tailwind-default hues. Editorial ink/warm-paper with ONE distinctive accent (Malaysian coral/sea, but specific hexes, not oklch approximations of defaults).
- Typography: distinctive display serif or gro­tesque with character (e.g., Fraunces / Archivo / Newsreader), mono for data, never Inter.
- Layout: asymmetric grid, overlapping, bleed imagery, no centered stacked sections, no rounded-2xl cards, thin borders instead of shadows.
- Copy: concrete numbers, human voice, no empowerment-speak.
- Imagery: REAL photographs, not AI-generated (user requirement).
- Single-screen: less scrolling — full viewport hero, app-like simulator in one viewport.
- Award-style details: oversized type, micro-labels with hairlines, generous but intentional whitespace, motion that reveals, editorial numbering, strong grid.
