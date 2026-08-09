# Screenshot pass 1 findings (full page, desktop)

Home: strong. Hero, steps, audience, CTA all render. Landing bg image visible on right. No issues.

Briefing: good. Profile table mono, challenges coral-left borders, budget 100, targets. No issues.

Simulator: works but issues:
1. Indicator strip labels wrap/cut ("Biodivers", "Water secur", "Flood resilien", meaning text truncated "Emission...", "Habitat ..."). Fix: reduce label length in INDICATOR_META or shorten to fit; also meaning text gets cut because of group overflow. Use overflow-visible for meaning, wrap.
2. Trajectory chart shows a single 2026 point; fine.
3. City map looks like random scattered blocks — acceptable as 20x20 model but legend covers right on small width; ok.
4. Play button works; need runtime check of playback (can't verify via screenshot).

Results: empty state renders fine.

Transparency: good.

Actions:
- Shorten indicator labels: "Climate" / "Bio-diversity" -> use shorter labels + always full meaning text without truncation.
- Fix indicator card overflow (meanings clipped by .group? actually "meaning" uses .truncate so truncate at card edge — change to non-truncating small text).
- After fixes: run playback test via browser console log check.
