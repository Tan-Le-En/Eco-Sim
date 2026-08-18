# v12 — Production checklist (Aug 18)

## User requests (verbatim items)
- [ ] Preload images before page opens (critical images preloaded in index.html)
- [ ] Hero "One million people / Twenty-five years" too far apart — tighten line spacing
- [ ] Error state broadcasts full error — user-friendly error page instead (incl. 404)
- [ ] Custom 404 page with CTA above the fold
- [ ] CTA above the fold (home)
- [ ] Meta title per page
- [ ] Meta description per page
- [ ] Open Graph image
- [ ] Favicon set
- [ ] robots.txt
- [ ] sitemap.xml
- [ ] Alt text on every image
- [ ] Mobile breakpoints verified
- [ ] Sticky mobile CTA
- [ ] Loading state
- [ ] Form error state (contact form)
- [ ] Thank you page (after contact form)
- [ ] Privacy policy page (DONE v11 — verify links)
- [ ] Terms page (DONE v11 — verify links)
- [ ] Cookie banner (DONE v7 — verify)
- [ ] Analytics installed (v7 UTM + analytics endpoints — verify)
- [ ] Real contact address (FloatingContact — verify/add)
- [ ] Compressed images (v8 WebP — verify)

## Notes
- Existing: FloatingContact.tsx contact form; ErrorBoundary.tsx broadcasts full error; NotFound.tsx 404; index.html needs OG/preload; sitemap/robots go in client/public or Vite build output (static only: public/).
- Images live under /storage/* URLs (uploaded via upload-file --webdev).
