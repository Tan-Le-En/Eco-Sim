# v5 user feedback checklist

1. App starts on simulator — investigated: root `/` already renders Home, no redirect exists. User's preview panel deep-links to the simulator from their earlier session (they were working there). Fix = ensure first entry teaches the goal before sim; also keep Home as Route 1 (already). No code change needed; verify in preview and tell user to open preview → homepage.
2. 25-year simulator must fit phone (375), tablet, desktop, and large screens — single-screen cockpit, no page scrolling inside the sim if possible; verify all four breakpoints.
3. Large mode: three goal cards' images must align perfectly with each other (same height/rows in the goal strip).
4. Real map: replace abstract 20x20 color grid with a stylized map of a Malaysian coastal town (bay, beach, mangrove, river, town, highlands) — zones placed according to real geography. Keep zone counts/data so the engine can still drive per-zone visuals.
5. Sliders: every 1% step (0–100), not 5% steps.
6. Teaching/clarity: the simulator must state the clear goal while playing — persistent mission targets reminder ("3 of 5 targets reached") and short "how to win" strip; results already explain. Add a visible goal bar with current targets status in the cockpit.
