# Extracted Translatable Strings — Reference for Translation Map

## types.ts (sim/types.ts)

### INDICATOR_META labels + meanings
- climatePressure: "Climate pressure" / "Emissions and warming contribution"
- biodiversity: "Biodiversity" / "Habitat and ecosystem health"
- waterSecurity: "Water security" / "Ability to meet demand"
- floodResilience: "Flood resilience" / "Protection from coastal and rainfall flooding"
- publicHealth: "Public health" / "Heat, pollution, and service access"
- economicWellbeing: "Economic wellbeing" / "Jobs, productivity, and affordability"
- equity: "Equity" / "Whether benefits and risks are fairly distributed"

### KID_INDICATORS
- climatePressure: kidName "Sea & Air", bm "Laut & Udara", kidStory "The sky and the sea getting hotter from smoke.", happy "Clear skies, cool breeze", sad "Smoky, hot, stormy days"
- biodiversity: kidName "Nature & Animals", bm "Alam & Haiwan", kidStory "How many birds, fish, and trees are happy here.", happy "Birds singing, fish jumping", sad "Quiet forest, empty sea"
- waterSecurity: kidName "Clean Water", bm "Air Bersih", kidStory "Is there enough clean water for everyone's taps?", happy "Water flows at every tap", sad "Taps running dry"
- floodResilience: kidName "Safe From Flood", bm "Selamat Dari Banjir", kidStory "When the monsoon rain comes, are the houses safe?", happy "Rain falls, homes stay dry", sad "Water on the roads and floors"
- publicHealth: kidName "Healthy People", bm "Orang Sihat", kidStory "Do people stay healthy and not get sick?", happy "Everyone is strong and well", sad "More coughs, more doctors' visits"
- economicWellbeing: kidName "Good Life", bm "Kehidupan Selesa", kidStory "Can families earn enough for food, school, and fun?", happy "Jobs for everyone, good food on the table", sad "No jobs, prices too high"
- equity: kidName "Fair For All", bm "Adil Untuk Semua", kidStory "Does everybody get a fair share, rich and poor alike?", happy "Everyone is treated fairly", sad "Some have plenty, some have little"

### KID_CONTROLS
- renewableElectricity: kidName "Clean Power", bm "Tenaga Bersih", kidStory "Make electricity from sun and wind instead of smoke.", good "Less smoke in the sky", bad "Costs more at the start"
- publicTransport: kidName "Buses & Trains", bm "Bas & Kereta Api", kidStory "Big buses and trains so fewer cars crowd the roads.", good "Less traffic, cleaner air, fairer for everyone", bad "Spends our town's money"
- mangroveRestoration: kidName "Plant Trees & Mangroves", bm "Tanam Pokok & Bakau", kidStory "Plant mangroves by the sea. Nature's flood wall.", good "Less flooding, more fish and birds", bad "Takes up land we could build on"
- coastalDevelopment: kidName "Building by the Beach", bm "Bina di Tepi Pantai", kidStory "Build new homes and shops near the water.", good "More homes, more money jobs", bad "More flood danger, less nature"
- waterEfficiency: kidName "Saving Water", bm "Jimat Air", kidStory "Fix leaky pipes and reuse water. Every drop counts.", good "Water lasts through dry months", bad "Costs money to fix the pipes"
- wasteRecycling: kidName "Sorting Rubbish", bm "Kitar Semula", kidStory "Sort rubbish so it can be used again instead of thrown in the sea.", good "Cleaner river and beach, happy fish", bad "Takes work and costs a little"
- fishingPressure: kidName "How Much We Fish", bm "Menjala Ikan", kidStory "Catch more fish today, but leave enough to come back tomorrow.", good "More fish on the table now", bad "Fewer fish every year after"
- industrialActivity: kidName "Factories Working", bm "Kilang", kidStory "Factories make jobs and things, but they use power and water.", good "More jobs, more money for the town", bad "More smoke, dirtier water"

### KID_GOALS
- sea: "Clean & calm sea" / bm "Laut bersih & tenang"
- city: "Safe & healthy town" / bm "Bandar selamat & sihat"
- people: "Fair for everyone" / bm "Semua orang dapat adil"

## engine.ts

### Events (messages)
- water_stress_warning: "The Sungai Kedah runs thin by March. Families in the kampungs fetch rainwater in plastic drums."
- water_crisis: "The dams run dry. Water board trucks park on Jalan Utama and residents queue with every container they own. The school closes early."
- coastal_flood: "A monsoon surge pushes the sea past the seawall. In the kampung, a grandmother carries her cat onto the roof and waits for a boat."
- habitat_loss_warning: "The bakau trees on the estuary bank are gone. Fishermen say the nets come back lighter every year."
- equity_warning: "The flats by the river have no lift and the bus route stops at the main road. Residents walk 40 minutes to the clinic."
- health_warning: "Hospital admissions for asthma and heat exhaustion climb. The ward runs out of beds by September."
- budget_deficit: "The town hall stops funding projects. A bridge half-finished over the mouth of the Sungai Kedah. Approval for the mayor drops to its lowest since 2026."

### explainOutcome labels
- climatePressure: "climate pressure"
- biodiversity: "biodiversity"
- waterSecurity: "water security"
- floodResilience: "flood resilience"
- publicHealth: "public health"
- economicWellbeing: "economic wellbeing"
- equity: "equity"

### explainOutcome reasons (success)
- "higher renewable electricity displaced fossil power"
- "public transport cut private vehicle trips"
- "mangrove restoration rebuilt habitat"
- "recycling reduced river pollution"
- "water efficiency held demand below supply"
- "mangroves and wetlands absorbed storm surge"
- "public transport benefits reached low-income districts"
- "industrial activity created jobs and output"
- "your combined policy mix"
- default: "No indicator clearly improved. A balanced, but stagnant, strategy."
- template: "${label(k)} improved by ${delta} points. The main driver: ${cause}."

### explainOutcome reasons (failure)
- "emissions kept growing faster than the energy transition"
- "coastal development destroyed habitat"
- "intensive fishing depleted fish stocks"
- "industrial water demand outgrew supply"
- "more people needed more water than the taps could give"
- "insufficient natural protection against rising seas"
- "costs and risks fell disproportionately on low-income districts"
- "industrial pollution and heat stress compounded"
- default: "No indicator worsened dramatically."
- template: "${label(k)} fell by ${delta} points. The unintended consequence: ${cause}."

### scoreResult penalties
- "Biodiversity collapse (below 30): −10"
- "Water failure (below 25): −8"
- "Severe inequality (equity below 35): −6"

### computeCausalLinks labels
- "Renewable electricity" / "Public transport investment" / "Mangrove restoration" / "Coastal development" / "Water efficiency" / "Industrial activity" / "Fishing pressure" / "Waste & recycling"
- Effects: "Climate pressure" / "Flood resilience" / "Biodiversity" / "Water security" / "Economic wellbeing" / "Public health" / "Equity"

## SiteHeader.tsx
- NAV: Home, Briefing, Story, Simulator, Transparency, FAQ
- "Back", "Switch to light mode" / "Switch to dark mode", "Light mode" / "Dark mode", "Close menu" / "Open menu"

## Home.tsx
- PageMeta title: "ECO//SIM — A Field Study of a Coastal Town, 2026–2050"
- PageMeta desc: "Change one thing, watch everything change. An interactive field study of Teluk Nusa, a fictional Malaysian coastal town: simple enough for a child, rigorous enough for a professor."
- Hero: "One million people. Twenty-five years."
- Hero sub: "You govern Teluk Nusa, a small town on the Malaysian coast, from 2026 to 2050. Keep the sea alive, the water clean, and treat people fairly. That is the whole job, and it has no easy answer."
- "Read the story" → arrow
- "All equations published. No black boxes."
- Footer: "Est. 2026 · 05.94°N · an open learning model, not a forecast" / "All equations published"
- "Three things, plainly."
- FIELD 01: "Meet your town" / "Teluk Nusa is a fictional Malaysian town on the Strait of Malacca. Fewer fish, flooding monsoons, salt water in the taps: the real problems of a thousand real towns. The people in these photographs are the people you are deciding for."
- FIELD 02: "Change one thing. Watch the town." / "Eight decisions shape twenty-five years. Seven things to protect: the sea and air, nature, drinking water, flood safety, public health, prosperity, and fairness. Move one dial and the whole town responds, usually in ways you did not expect."
- FIELD 03: "Try again." / "You will not find a perfect plan; you will find trade-offs. Every result tells you why things changed, and the full mathematics is published on the transparency page. Come back when a run goes wrong and try a different plan."
- Captions: "Clan jetty, Penang. Houseboats and wooden walkways over the sea." / "Mangrove river, Langkawi. Nature's own sea wall." / "Fishermen with nets at dawn, Kuala Kedah"
- CTA quote: "When I was young, the bay was full of fish. Can you keep it that way?"
- "What a fisherman in Teluk Nusa actually wants to know"
- "Coastal settlement, Penang" / "Fig. 05"
- "Start governing", "Mission briefing", "FAQ", "Briefing"
- Hero caption: "Aerial view, Kuala Kedah estuary" / "Fig. 01"

## Story.tsx
### CHAPTERS (pre-sim mode)
- Ch01 voice: "When the river rises, our village rises with it. Some years the water comes back down. It did not come back down the year of my wedding."
- Ch01 title: "A town that lives on the water"
- Ch01 lesson: "Most of Teluk Nusa was built beside the sea and the river: homes, markets, roads. That is also the town's biggest risk. The sea rises a little every year, and the rain comes heavier. Building closer to the water means building more of the town's defence."
- Ch01 connects: "Connects to: Building by the Beach · Safe From Flood · Plant Trees & Mangroves"
- Ch02 voice: "My grandmother said the mangroves were a wall. We cut most of them down. Now the waves knock at the door."
- Ch02 title: "The wall we cut down"
- Ch02 lesson: "Mangroves grow in salt water. Their roots hold the soil, slow the waves, and give baby fish a place to hide. Clear them to build, and flooding gets worse while the fish count falls. Plant them back, and both recover. Slowly, but for sure."
- Ch02 connects: "Connects to: Plant Trees & Mangroves · Nature & Animals · How Much We Fish"
- Ch03 voice: "I leave before the sun. Some days the nets are heavy. Some days I bring home stories instead."
- Ch03 title: "The nets that come home lighter"
- Ch03 lesson: "Fishing feeds this town: boats, markets, dinners. The sea only gives what it has. Catch too many fish today and there are fewer parents to make babies tomorrow. The dial called How Much We Fish is the hardest one. Take less now and the sea rewards you for years. Take more now and the sea goes quiet."
- Ch03 connects: "Connects to: How Much We Fish · Nature & Animals · Good Life"
- Ch04 voice: "From up here you can see the bargain the town made: where the green ends, the roofs begin."
- Ch04 title: "The whole town from above"
- Ch04 lesson: "Everything here is connected. The roads bring smoke, the smoke changes the air, the air changes the rain, the rain fills the river, and the river decides whose floor gets wet. One dial pulls on every thread. That is why we watch seven things at once, not just one."
- Ch04 connects: "Connects to: every dial · every indicator"
- Ch05 voice: "The old boss always said there was no money. You have RM 100 a year. Don't spend it on what looks good. Spend it on what lasts."
- Ch05 title: "The town hands you the keys"
- Ch05 lesson: "You start in 2026 with RM 100 a year, which is not much. That is the whole game: choose where the money goes, then live with the answer for 25 years. The town will tell you what worked and what did not. Fail safely here, and you will learn something that holds in the real world."
- Ch05 connects: "Connects to: the simulator · the whole study"
- Captions: "River village, fictional Teluk Nusa" / "Mangrove roots on a tidal flat" / "The fishing coast, dusk" / "Aerial view of the coast" / "Life and work on the jetty"
- Alts: "Colourful boats moored in a calm Malaysian river village" / "Mangrove prop roots tangled on a tidal flat" / "Fishing boats on the coast at dusk" / "Aerial view of mangrove forest meeting coastal development" / "Clan jetty — houses and work over the water"

### WhatHappened (post-sim mode)
- PageMeta title: "ECO//SIM — What happened to Teluk Nusa"
- description: `${range} · ${classification.label}: score ${score} out of 100.`
- classifyRun: "The town is better off" (>=65) / "The town held, but barely" (>=45) / "The town struggled" (>=30) / "The town lost ground" (<30)
- eventEmoji: "Flood" / "Water" / "Nature" / "People" / "Health" / "Money" / "Event"
- "{range} · {events.length} events recorded"
- "Over twenty-five years, {classification.label.toLowerCase()}. Here is what the town remembers."
- "This story is built from your actual run. Every event below really happened in the model. Every number below is what your dials produced."
- "Score {score} / 100" / "Try a different path"
- "What you spent the town's money on" / "of 100"
- "The years the town remembers" / "Around {decade}"
- "What caused what" / "built up" / "pulled down"
- "What changed most"
- "What worked" / "What went wrong"
- "End of the record" / "The town remembers everything. Try again with different choices, and see which path it remembers better." / "Run again" / "Home"
- Chapters masthead: "Five chapters. No numbers. The town tells you what is wrong."
- Chapters intro: "Before you touch a dial, walk through Teluk Nusa as it is today. Listen to the people. When you run the simulation afterward, you will already know why each decision matters."
- Chapters end: "End of story" / "You have met the town. Now spend twenty-five years trying to keep it standing." / "Start the simulation" / "Mission briefing"
- PageMeta (Chapters): "ECO//SIM — Five Chapters of Teluk Nusa · the story" / "Walk through Teluk Nusa as it is today: five chapters about a town that lives on the water, its mangrove shield, and the people you decide for."

## Simulator.tsx
- toast "Simulation started" / "Teluk Nusa runs from 2026 to 2050."
- toast.error "Give your plan a name first"
- toast.success "Plan saved" / "Compare up to 4 plans on the results screen."
- PageMeta title: "ECO//SIM — The simulator · govern Teluk Nusa 2026–2050"
- PageMeta desc: "Move the eight policy dials and run 25 years. Watch the sea, the town, and the people respond. Every equation published."
- "Year" label
- "Mission" / "{count} / 5 targets"
- Tooltip: "Your 5 targets by 2050:" / "Air & sea pressure" / "Nature alive" / "Clean water in taps" / "Flood-safe homes" / "Fair for everyone"
- "Budget" label
- "Run simulation" / "Re-run 2026–2050" / "Pause" / "To 2050"
- Speeds: "Fast" / "{s}y"
- "Registers · {year}" / "tap a row for the plain-language reading"
- "Trajectory · {start} – {end}"
- "The year is 2050. Field work complete."
- "Verdict:" / "Save plan" / "Full account"
- "Worked" / "Failed"
- "Decisions · each year"
- "Adjust the ledger, re-run the simulation, observe what changed. The model has no perfect answer. Only trade-offs."
- "How the model works →"
- Save dialog: "Save this plan" / "Name your decision set to compare up to 4 plans on the results screen." / placeholder "e.g. Green coast, light industry" / "Save"
- moodPhotoAlt: "Fishermen with nets at dawn, Kuala Kedah. The town is alive." / "Fisherman casting net at dusk. The town still needs help."

## Results.tsx
- Empty state PageMeta: "ECO//SIM — Your field report · what changed and why" / "Your 2050 score, the causal chain behind every number, and a side-by-side comparison of up to four saved plans."
- Empty: "No report yet" / "Run the simulation to 2050 first, or return to the simulator to play." / "Go to simulator"
- Results PageMeta: "ECO//SIM — Final Report · Score {score}" / "Teluk Nusa 2050 Report: Score {score}. A summary of environmental and economic outcomes for a fictional Malaysian coastal town."
- verdict: "Teluk Nusa held its own." / "Teluk Nusa is still struggling. That is where most real plans begin."
- happy desc: "Your decisions kept the mangroves breathing, the drains holding through the monsoon, and households able to afford clean water. No goal was sacrificed to reach another. That is the sign of a planner who understood the trade-offs."
- sad desc: "At least one of the three foundations, the sea, the town, or the people, gave way. Read the causal chain below. The model tells you exactly which decision led where. Adjust one variable and run again."
- "Field report · the year is 2050"
- "Score" / "Population 2050" / "Budget remaining" / "Goals reached" / "· sea · town · people"
- Caption: "Field photograph · Teluk Nusa · December 2050" / "Teluk Nusa · 2050, work ahead"
- shareText: "I scored {score}/100 protecting Teluk Nusa to 2050 on ECO//SIM. Try to beat it."
- "Share score" / "Play again"
- "Worked" / "Failed"
- "Why it happened"
- "Technical Appendix" / "Score breakdown · indicator table · plan comparison"
- "Score breakdown" / "Indicator table · baseline → 2050" / "Compare saved plans"
- "weight ×{w}% · value {v}"
- "Scoring weights fixed & published on the transparency page"
- Table headers: "Indicator" / "2026" / "2050" / "Change"
- "Save plans from the simulator to compare them side by side here."
- ConfirmDialog: title "Delete saved plan?" / desc "This permanently removes \"{name}\" (score {score}) from the comparison board." / confirmLabel "Delete"
- Footnote: "The model rewards strategies that combine ambition with balance; one strong investment alone rarely wins. This is an educational model with simplified assumptions, not a prediction about any real city. Full equations on the transparency page."
- Alt: "Teluk Nusa at sunset, 2050" / "Fishermen at dawn, 2050"

## Briefing.tsx
- PageMeta: "ECO//SIM — Mission briefing · keep the town alive for 25 years" / "Your mission: govern a fictional Malaysian coastal town from 2026 to 2050. RM 100 a year, eight decisions, seven vital signs."
- "Teluk Nusa is yours. Keep it alive for 25 years."
- "One million people live in this fictional Malaysian town. You receive RM 100 every year to spend on it: energy, buses, trees, mangroves, water, housing. Every year from 2026 to 2050, the town responds. You win by keeping three registers healthy; you lose by neglecting any one of them."
- CHALLENGES: ["Smoke", "Most electricity comes from burning fuel."] / ["Monsoon", "Stronger storms put seafront homes at risk."] / ["Fewer fish", "Too many boats; the mangroves are shrinking."] / ["Dry taps", "Water demand is growing faster than supply."]
- DATUM labels: "Population" / "Window" / "Electricity demand" / "Fossil share" / "Renewable share" / "Forest & mangroves" / "Urbanized land" / "Annual rainfall" / "Water demand" / "Recycling" / "Private vehicles" / "Flood exposure"
- "Begin the study" / "The equations"
- Captions: "Fishermen at dawn, East Coast" / "Mangrove river, Kilim Geopark" / "Where your town lives · clan jetty"
- Alts: "Malaysian fishermen at dawn" / "Mangrove river in Langkawi" / "Clan jetty houses on stilts over the sea"
- "Open the 2026 datum" / "Close the 2026 datum"
- "Fictional baseline · not real data"
- "Read this page, then go govern."

## CookieBanner.tsx
- aria-label "Cookie notice"
- "Field note · cookies"
- "Your plan choices and theme are stored only on your device. Enabling analytics lets this study improve; declining changes nothing. See our privacy notice."
- "Allow analytics" / "Decline"

## TownMood.tsx
- "Teluk Nusa is stable today." / "Teluk Nusa is under pressure. Watch the amber registers." / "Teluk Nusa is in trouble. Red registers need action now."
- "Year {year} · {met} of 5 mission targets reached"

## CausalChain.tsx
- "Events during the run"
- "+ {n} more events omitted"
- "Strongest causal links · deterministic model"
- "Rules-based · certainty: educational model, not a forecast"

## ControlPanel.tsx
- UNIT_LABEL: "% clean power" / "% bus share" / "restored" / "new buildings" / "% saved" / "% sorted" / "boats at sea" / "factory output"
- "{pct}% / {default}%"
- "Reset all to baseline"
- ConfirmDialog: title "Reset every dial?" / desc "All eight decisions return to the 2026 baseline. Any unsaved choices are lost." / confirmLabel "Reset"

## CopyButton.tsx
- label "Copy"
- "Copied to clipboard" (success toast)
- "Copy failed — try selecting the text manually" (error toast)
- aria-label "Copied" / "{label} to clipboard"
- "Copied" (state)

## ConfirmDialog.tsx
- default confirmLabel "Confirm"
- "Cancel"

## SiteFooter.tsx
- "ECO//SIM · Teluk Nusa · an open educational model, not real-world advice"
- aria-label "Legal"
- "Privacy" / "Terms"
- "© 2026 · Last updated · Aug 18, 2026"

## IndicatorStrip.tsx
- "Close story" / "Tap for the story"

## TimelineChart.tsx
- CausalTooltip: "Year {year} · what changed" + explanatory note + "Fictional town · educational model · not a forecast"

## ErrorBoundary.tsx
- "Field report · something broke"
- "The town went quiet."
- "Something on this page stopped working. Nothing you typed is lost, but the page cannot show what you came for. The quickest fix is a fresh start."
- "Reload the page" / "Back to the study"
- "Hide technical note (dev only)" / "Show technical note (dev only)"
- "ECO//SIM · Teluk Nusa · an open educational model, not real-world advice"
- "© 2026 · Last updated · Aug 18, 2026"

## NotFound.tsx
- "404 · nowhere on the map"
- "Lost in the field."
- "The page you asked for is not here. It may never have existed, or the address changed. Either way, the town is waiting a few clicks away."
- "Start the story" / "Back home"
- "Simulator" / "Transparency" / "FAQ"

## Faq.tsx
- PageMeta: "ECO//SIM — FAQ · asked at the field desk" / "Honest answers about the score, the trade-offs, classrooms, phones, and privacy. If it isn't here, search."
- "Asked at the field desk."
- "Honest answers, published like everything else on this site. If the answer you need isn't here, use the search bar above."
- "Still curious about the model?" / "Every equation is published." / "Open transparency →"
- FAQS q/a pairs (10 items — see file)

## Transparency.tsx
- PageMeta: "ECO//SIM — Transparency · every equation, published" / "The full mathematics: equations, weights, assumptions, limits, and the real science the model is calibrated to."
- "For teachers, students & professors"
- "How this game actually works"
- Intro: "A child can play ECO//SIM without reading this page. But if you want to see the machinery: the equations, the variables, the score weights, everything is published here. If you cannot see how a simulation decides its outcomes, it can't teach you anything real."
- Section labels: "01 · Published equations" / "02 · Variables & units" / "03 · Score weights, the same for everyone" / "04 · What this model does not do" / "05 · Where the real science lives"
- Table headers: "Control" / "Description" / "Range" / "Main effects"
- Weight labels: "Climate pressure" / "Biodiversity" / "Water security" / "Public health" / "Economic wellbeing" / "Flood resilience" / "Equity"
- Penalties note: "Penalties: flood resilience below 35 or water security below 35 in any year subtracts 8 points; a fishery collapse subtracts 5."
- Sources intro: "Teluk Nusa is fictional and every constant above is illustrative. But the direction of each relationship is borrowed from real research. These are the published sources the model loosely follows, so you can read the original."
- "Read the source"
- Honest-use notice: "Honest-use notice" / "ECO//SIM is an educational simulation of a completely fictional city (Nusa Bay) with illustrative constants. Nothing here is a real-world forecast, a planning recommendation, or scientific evidence about any actual coast."
- CTA: "Back to the simulator"

## Privacy.tsx
- "Privacy notice · ECO//SIM"
- "What this site keeps, and what it does not."
- Intro: "ECO//SIM is an educational website about a fictional town. This notice tells you, plainly, what happens to your data when you visit."
- Sections 1-5 (see file)
- "Home" / "Terms of use"

## Terms.tsx
- "Terms of use · ECO//SIM"
- "The rules of this game, and this site."
- Intro: "Teluk Nusa is a fictional town. Every number in this simulator is an illustrative constant for teaching. This page exists so there are no misunderstandings."
- Sections 1-5 (see file)
- "transparency page" / "Home" / "Privacy notice"

## CityMap.tsx (alt texts)
- Check file for map-related strings

## ManusDialog.tsx
- Check for contact form strings

## App.tsx
- No user-facing strings (routes only)
