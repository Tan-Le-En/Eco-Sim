# v7 production UX layer — progress state

User request: dark mode toggle, cookie search/banner, site search, mobile menus, loading animations, hover states, scroll progress bars, copy button, print stylesheet, sticky headers, skip to content, PW visibility toggle, UTM tracking, form success state, form error state, confirmation modals, last updated date, expandable FAQ, floating contact.

## Done
- docs/v7-todo.md — full checklist
- index.css: .dark tokens (night archive palette), .hover-lift utility, a:hover (opacity .75), .scroll-progress bar class, .skip-link class, form states (.field-success/.field-error, .input-notice, .notice-success/.notice-error), @media print stylesheet
- App.tsx: ThemeProvider switchable=true; route /faq → Faq page (component not created yet!)
- ScrollProgress.tsx component created (RAF, respects reduced motion)
- SiteHeader.tsx rewritten: sticky + backdrop-blur-md, NAV now includes Story & FAQ, desktop dark toggle (Sun/Moon), Search button → SiteSearch, mobile hamburger drawer (AnimatePresence slide-down, scroll lock, Escape close, divide-y nav)

## DONE (updated)
- Faq.tsx page created (Accordion, 10 Q&As incl. max-77 answer, footer w/ LAST UPDATED · AUG 18, 2026)
- SiteSearch.tsx created (Dialog, fuzzy match, Cmd/Ctrl+K, pages + FAQ questions)
- CookieBanner.tsx created (accept/decline, localStorage cookie-consent)
- lib/utm.ts created (initUtm, getUtm)
- FloatingContact.tsx created (success/error states, PW toggle via Eye/EyeOff, secret code field)
- SkipToContent.tsx created (.skip-link → #main)
- CopyButton.tsx created (shared, Copy→Copied + Check, clipboard fallback)
- ConfirmDialog.tsx created (AlertDialog wrapper)
- App.tsx fully wired: ScrollProgress, SkipToContent, CookieBanner, FloatingContact, PageEntrance (framer animate presence keyed on Switch location), ScrollRestoration (scrollTo top on route), Boot (initUtm)

## REMAINING TODO
(done)
2. client/src/components/SiteSearch.tsx — Dialog (CommandPalette): search across NAV pages + common questions; open via Cmd/Ctrl+K + Search button; DialogContent rounded-none.
3. client/src/components/CookieBanner.tsx — bottom banner: "This study keeps your plan choices on your device to continue where you left off." Accept / Decline buttons, localStorage "cookie-consent", no-print.
4. client/src/lib/utm.ts — read utm_source/medium/campaign from URL, persist localStorage "utm-record" with timestamp, log to console once. Call in App.tsx on mount.
5. client/src/components/FloatingContact.tsx — bottom-right floating button (vermilion, z-40) opens Dialog with contact/newsletter form: name (required), email (required, validation), message (required), password field "Your secret code (optional)" with PW visibility toggle (Eye/EyeOff). Success state: green border + icon + message + reset; Error state: red borders on invalid fields + inline notices. Submit = toast success + reset (no backend; static site).
6. client/src/components/ConfirmDialog.tsx — reusable AlertDialog wrapper: confirm(title, description, onConfirm, dangerous?) returns promise or controlled usage. Use at: Simulator "Reset all to baseline", Results/Scenarios delete scenario, Briefing? Keep simple.
7. client/src/components/SkipToContent.tsx — .skip-link a href="#main" text "Skip to content".
8. Global footer update: find footer (pages use inline footers — Home has inline footer "EST. 2026 ..."; add global LastUpdated component or update each footer. Simplest: create client/src/components/SiteFooter.tsx? Pages have per-page footers; update Home footer to include "Last updated: Aug 18, 2026" + add SiteFooter import? Pages: Home, Story, Briefing, Results, Transparency, Simulator. Approach: create components/LastUpdatedBadge.tsx and place in each page footer + FAQ footer.
9. Add ScrollProgress, CookieBanner, SkipToContent, FloatingContact mounting to App.tsx (after Router inside SimProvider; SkipToContent before Router; add main id to pages? use location scroll restoration — wouter ScrollToTop?). Also: page entrance animation — wrap Router pages? Simplest: add framer motion AnimatePresence in App? Wouter Switch doesn't re-mount on path change; add key. Use: <AnimatePresence mode="wait"><motion.div key={location} initial={{opacity:0,y:12}} animate...><Switch/></motion.div></AnimatePresence>.
10. Simulator.tsx: add ConfirmDialog for "Reset all to baseline" (button exists around line ~? "RESET ALL TO BASELINE" button in ControlPanel or Simulator). Check ControlPanel.tsx for reset; maybe add confirmation there. Results.tsx delete scenario — wrap in AlertDialog.
11. CopyButton: existing "Share score" copies with toast — enhance with hover tooltip; shared component client/src/components/CopyButton.tsx with "Copy" → "Copied" state + Check icon; reuse in Results share.
12. Results.tsx & Simulator.tsx photo constants fine.
13. Results.tsx: reuse CopyButton in SHARE SCORE block (replace inline copy logic). Simulator: wrap "Reset all to baseline" button in ConfirmDialog. Results: wrap scenario delete (trash X) button in ConfirmDialog. Add FAQ link to Home footer/nav? Home nav already has STORY MODE / TRANSPARENCY / ENTER THE FIELD buttons — check if SiteHeader renders on Home (Simulator has SiteHeader backHref=/briefing; Home must have header too — VERIFY Home/Simulator headers don't duplicate nav). Add id="main" to main landmarks on Home/Results etc. (main elements exist; Simulator main has className flex-1). 14. Verification: desktop + 375 mobile, light + dark screenshots of /, /faq, /simulator, /results. TypeScript check. Checkpoint.

## Notes
- shadcn accordion: import from "@/components/ui/accordion"
- AlertDialog: "@/components/ui/alert-dialog"
- Dialog: "@/components/ui/dialog"
- Current checkpoint: b9112682 (v6 mobile polish). Latest version 9a0d6fee before that.
- Photos (valid): use any from docs/v4-photos.md; FAQ page needs none (text-only, field-study style) or optional real photo.
- index.html has Google Fonts (Newsreader, Public Sans, IBM Plex Mono) already.
- SimContext persists state? localStorage keys exist in SimContext (scenarios). CookieBanner should mention it.
