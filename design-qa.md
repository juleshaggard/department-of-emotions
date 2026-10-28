# Design QA — landscape phones with independent info scrolling

Date:2026-10-27

final result: passed

## Current request and responsive modes

Landscape iPhones must use the side-by-side layout, allowing the info panel to scroll while the wheel stays vertically centered in the viewport.

The drawer query is now only `(max-width:1100px) and (orientation:portrait)`. All landscape layouts use columns. Landscape phones, `(max-width:1023px) and (orientation:landscape)`, use a full-height52%/48% grid inside a clipped viewport page. The right aside alone scrolls, with stable scrollbar space, contained overscroll, vertical touch panning, momentum scrolling, safe-area-aware padding, and a keyboard tab stop.

The wheel stays in its own viewport-height flex frame, with its actual circle centered vertically. It remains oversized and bleeds left: diameter `clamp(560px,160dvh,92vw)` with svh fallback. The hub remains blank and the entrance still rests with Joy pointing right.

Phone landscape reading uses natural rows separated by16px, a30–40px Gilda headline,17px definition,15px examples, and wrapping hierarchy/footer. Selecting a new emotion resets this info scroller to the top. Portrait phones and tablets retain the native drawer. Existing1024px+ landscape layouts retain their compact stable reading bands.

Both portrait-drawer and landscape-phone flags are read together. Both touch layouts retain full wheel opacity, ignore pointer hover previews, and preserve tap selection. Landscape taps update inline details; keyboard selection remains available.

## Visual evidence

- Initial landscape view: `qa/landscape-phone-main.png`.
- Same wheel after info scroll: `qa/landscape-phone-scrolled.png`.
- Combined inspection: `qa/landscape-phone-scroll-comparison.png`.
- Interaction geometry: `qa/landscape-phone-scroll-metrics.json`.

The two844×390 views were inspected together. The wheel image and rotation remain unchanged while the right-hand text moves. The sidebar remains separate from the wheel without overlap.

## Viewport and content checks

| CSS viewport | Checks | Reading width | Wheel centerY | Page overflow |
|---|---:|---:|---:|---:|
|568×320|All108 sectors|218.45px|160px|0px|
|667×375|Default Joy|265.97px|187.51px|0px|
|844×390|All108 sectors|350.92px|195px|0px|
|932×430|Default Joy|393.17px|215px|0px|

At both full-sector sweeps, every entry fit horizontally, there was no modal drawer, all sectors remained unfaded, and the info pane reset to scrollTop0 after each new selection. Natural content heights grow inside the scroller rather than extending the page. Per-sector evidence: `qa/landscape-phone-{width}x{height}.json` for each size above.

## Interaction verification

- At844×390, scrolling the aside to134px leaves page scroll at0, wheel centerY195px, and rotation exactly-92.6471degrees.
- Tapping Optimistic updates inline information and resets aside scrollTop to0; no drawer opens and no sectors are muted.
- After scrolling the Optimistic pane to236px, dragging the wheel changes its rotation to-39.4099degrees but leaves aside scroll at236px and page scroll at0.
- Focusing the info pane and pressing PageDown scrolls it to134px while the page stays at0.
- At390×844, Touched still opens the portrait drawer with its logo. Rotating to844×390 closes the modal, unlocks body scrolling, shows Touched inline, and resets info scroll to0 without page overflow.
- At768×1024, the iPad portrait drawer still opens. Rotating to1024×768 restores the existing grid, non-scrolling desktop sidebar,16px examples, and zero page overflow.
- No browser console errors were captured.

## Preserved design surfaces

Gilda Display, the body-font family, palette, white selection outline, exact supplied logo, blank hub, content order, and all definitions/examples remain. The credit still links to `https://www.juleshaggard.com/`. Only landscape-phone sizing and text flow differ from the larger inline sidebar. Portrait drawer typography and controls remain unchanged.

## Checks

`npm test`:26 passed. Production build passed. `npm run test:sites`:4 passed. `git diff --check` passed. No P0/P1/P2 issues remain for this request.
