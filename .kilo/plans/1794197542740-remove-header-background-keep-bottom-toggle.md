# Plan: Remove Header White Box Background, Keep Bottom-Right Toggle on Home

## Goal
- Remove the semi-transparent "white box" background from `SiteHeader` (the `bg-background/92 backdrop-blur-md` styling)
- Keep the theme toggle in the header (top-right) functional but without the background
- Keep the fixed bottom-right theme toggle on the Home page only (current behavior)

## Changes Required

### 1. Modify `client/src/components/SiteHeader.tsx`
**Lines 73-78**: Change the header's `className` to remove the semi-transparent background and backdrop blur.

**Current (non-bare mode):**
```tsx
"sticky top-0 z-50 bg-background/92 backdrop-blur-md border-b border-border"
```

**New (non-bare mode):**
```tsx
"sticky top-0 z-50 border-b border-border"
```

**Bare mode** (lines 75-76) already has a solid background - keep as-is since it's used for immersive pages.

### 2. No changes to `client/src/pages/Home.tsx`
The bottom-right fixed theme toggle (lines 218-231) already works correctly with `fixed bottom-4 right-4 z-50`.

## Validation
- Open Home page → verify header is transparent (only bottom border visible), theme toggle in header works
- Scroll Home page → verify bottom-right theme toggle stays fixed and functional
- Open FAQ page → verify header is transparent, theme toggle in header works
- Test both light and dark modes

## Risk
Low - purely visual CSS change, no logic modifications.