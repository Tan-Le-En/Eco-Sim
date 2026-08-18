# v17 — Current work state

## DONE:
- Default route: Home (correct after rollback)
- SiteSearch removed from SiteHeader + import removed
- LanguageToggle restored from v16 (client/src/components/LanguageToggle.tsx)
- LanguageContext restored from v16 (client/src/contexts/LanguageContext.tsx)
- LanguageProvider wired in App.tsx
- Simulator layout tightened: h-[calc(100vh-8.5rem)] overflow-hidden main, reduced padding (px-4), compact spacing (space-y-3, gap-4), trajectory gets flex-1
- Events: added deterministic hash-based variety (different flood years, offsets per event type based on controls hash)

## STILL NEED:
1. User chose option B: translate EVERYTHING including simulation output (events, verdicts, story narrative, worked/failed messages)
2. Implementation plan:
   a. Create client/src/lib/i18n/translations.ts — a comprehensive key-value map for EN/BM/中文
   b. Update LanguageContext to export a useTranslation() hook that returns t(key) function
   c. Refactor all pages/components to use t() instead of hardcoded strings
   d. Add translation keys to engine.ts events, results verdicts, story mode narrative
   e. The translation map should cover: nav labels, page headings, buttons, simulator controls, indicator names, event messages, verdict text, story chapter content, meta descriptions, cookie banner, footer, faq Q&A, privacy/terms, error boundary
3. Use the built-in LLM (gpt-5-mini) to generate translations from extracted English strings
4. Verify at 375px and desktop
5. Checkpoint and deliver

## Strategy for implementation:
- Extract all user-visible English strings from the codebase
- Use LLM to translate to BM and 中文
- Store in a translations.ts file with a key-based lookup
- Replace hardcoded strings with t(key) calls throughout

## Key files:
- client/src/components/SiteHeader.tsx — has LanguageToggle import, needs the component
- client/src/pages/Simulator.tsx — needs layout tightening
- client/src/lib/sim/engine.ts — events section at line ~221-277, needs randomness/variety
- client/src/App.tsx — needs LanguageProvider

## v16 LanguageToggle component (from git):
```tsx
import { useLang, LANGUAGES, type Language } from "@/contexts/LanguageContext";
// 3-option switch: EN / BM / 中文
// className prop for flex container
```

## v16 LanguageContext (from git):
```tsx
// Language type: "en" | "bm" | "zh"
// LANGUAGES array with code/label/native
// LanguageProvider + useLang hook
// localStorage persistence key: "ecosim:lang"
```

## Simulator layout to tighten:
- Reduce padding in the playback area
- Make the TownMood band more compact
- Reduce gap between Year/Budget/Mission row and the map
- The right-side controls panel needs to be shorter (fewer px tall per control)

## Events variety idea:
- Add a seeded random based on controls hash so each run produces different event years
- Instead of fixed years (2037, 2047), use different trigger years per run
- Add more event types with different thresholds and messages
