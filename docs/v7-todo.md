# v7 — Production-grade UX layer

## Foundation
- [ ] Dark mode toggle (ThemeContext-based, persisted to localStorage, default = light editorial theme; dark = ink-paper variant)
- [ ] Sticky headers (SiteHeader sticky with backdrop blur; hide-progress on scroll-down optional)
- [ ] Skip-to-content link (global, visible on focus)
- [ ] Scroll progress bar (top of viewport, global component)
- [ ] Page loading animations (route-level entrance, framer motion AnimatePresence per page)
- [ ] Hover states (audit buttons/links/cards for hover feedback; enhance where missing)

## Navigation & discovery
- [ ] Mobile menu (hamburger drawer for SiteHeader nav links at < md)
- [ ] Site search (command-palette style dialog: fuzzy-match pages + sections; keyboard: Cmd/Ctrl+K)
- [ ] Cookie banner (simple consent; persists choice; minimal text, educational framing)
- [ ] UTM tracking (read utm_source/medium/campaign on load, persist to localStorage, log once)

## Interactive components
- [ ] Copy buttons (results share score already exists; add hover tooltip + toast feedback; reuse a shared CopyButton)
- [ ] PW visibility toggle (password input component for contact/newsletter form)
- [ ] Confirmation modals (reset controls to baseline; delete saved scenario; run from briefing — use AlertDialog/shadcn)
- [ ] Form success state (floating contact form: success message with icon)
- [ ] Form error state (validation inline errors, required fields)

## Content & contact
- [ ] FAQ section (expandable Accordion — add to Home or /faq; also link in nav)
- [ ] Floating contact widget (bottom-right, opens dialog with newsletter/contact form)
- [ ] Last updated date (footer global component: site build date / "Last updated")

## Polish
- [ ] Print stylesheet (@media print: hide nav, widgets, buttons; keep serif body; results printable)
- [ ] Type check + screenshot verification (desktop + 375px mobile, light + dark)

## File map
- client/src/index.css — dark theme tokens (.dark), print stylesheet, scroll-progress styles
- client/src/contexts/ThemeContext.tsx — extend with toggle helpers
- client/src/components/SiteHeader.tsx — sticky + mobile menu + dark toggle
- client/src/components/ScrollProgress.tsx — new global
- client/src/components/SkipToContent.tsx — new global
- client/src/components/SiteSearch.tsx — new (Cmd+K dialog)
- client/src/components/CookieBanner.tsx — new
- client/src/lib/utm.ts — new
- client/src/components/FloatingContact.tsx — new (form w/ success/error states, PW toggle if password asked — use password field for "secret phrase" contact? Use password input for a newsletter PIN)
- client/src/components/ConfirmDialog.tsx — shared confirmation helper
- client/src/components/Footer.tsx — last-updated date (check if exists)
- client/src/pages/Faq.tsx — new page (also reachable from nav)
- client/src/App.tsx — register routes, wrap providers
