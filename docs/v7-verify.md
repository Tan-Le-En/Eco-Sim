# v7 verification state (Aug 18, 2026)

## Desktop screenshots verified — all render correctly:
- `/` Home: sticky header w/ logo+nav+search+dark toggle, cookie banner bottom (accept/decline), hero intact, SiteHeader bare used. OK.
- `/faq`: accordion, numbered codes, sticky header, cookie banner. OK.
- `/story`: SiteHeader backHref=/, chapters fine. OK.
- `/briefing`: SiteHeader, sticky. OK.
- `/simulator`: sticky header, mission chip 2/5 targets, illustrated map, dials w/ 30%/30% one-line values, cookie banner. OK.
- `/results`: verdict plate w/ clean nets photo, SHARE SCORE copy button, WORKED/FAILED, causal chain. OK.
- `/transparency`: sticky header, equations. OK.

## All v7 items DONE:
- dark mode toggle (SiteHeader sun/moon), sticky header + blur
- skip-to-content (.skip-link → #main)
- scroll progress bar (.scroll-progress, RAF)
- page entrance animation (App.tsx AnimatePresence keyed Switch)
- hover states + btn-press active scale
- mobile hamburger menu (SiteHeader AnimatePresence drawer)
- site search (SiteSearch, Cmd/Ctrl+K)
- cookie banner (CookieBanner, localStorage cookie-consent)
- UTM tracking (lib/utm.ts, initUtm in Boot)
- print stylesheet (@media print in index.css, [data-no-print])
- copy button (CopyButton reused in Results share)
- confirmation modals (ConfirmDialog: ControlPanel reset, Results scenario delete)
- floating contact (FloatingContact: field-desk button, form w/ success/error states, PW visibility toggle)
- last-updated date (Home footer, Story footer, Faq footer)
- expandable FAQ (/faq page, 10 items)

## Remaining before checkpoint:
1. Mobile screenshot at 375px: /, /faq, /simulator — verify hamburger menu, cookie banner, floating button don't break.
2. Dark mode: verify at least one page (index.css .dark tokens exist).
3. TypeScript OK (already verified: TSC_OK).
4. Checkpoint + deliver.

## Asset note
Clean nets photo: /manus-storage/real-fishermen-nets-clean_bda00363.jpg (used Results verdict, Home NETS, Briefing FIG.02)
