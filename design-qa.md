# Design QA — stable sidebar and oversized wheel

Date: 2026-10-27

final result: passed

## Source and normalization

The user-selected reference is `/var/folders/0j/f8hz42fn3vxcrz0v7qrlggqm0000gn/T/codex-clipboard-b341dcdd-c561-438d-9700-242fa0ab9941.png` (3694×2288 pixels). Its proportions were normalized to 2048×1268 in `qa/reference-sidebar-layout.png`.

The implementation is the existing React/SVG explorer at `http://localhost:4173/explore`. Browser CSS viewport: 2048×1268, scroll position zero. The browser screenshot is 2033×1259 pixels due to capture scaling/scrollbar space; it was normalized to 2048×1268 for comparison. The comparison captures the Hysterical reading content after the opening motion has finished. The screenshot reference has Hysterical copy with an unrelated Delighted outline; that inconsistent state is not reproduced. Wheel rotation is interactive, so its resting angular state may differ.

## Comparison evidence

Source and implementation were placed together in each comparison image and visually inspected:

- Full page: `qa/stable-layout-comparison-final.png` (4096×1300, including labels).
- Focused sidebar: `qa/stable-sidebar-comparison-final.png` (1040×1022).
- Final implementation: `qa/stable-reference-layout-final.png`.
- Mobile drawer: `qa/stable-mobile-drawer.png`.
- Per-sector browser measurements: `qa/stable-band-measurements-2048.json`, `qa/stable-band-measurements-1440.json`, and `qa/stable-band-measurements-1101.json`.

These QA artifacts are local ignored files; the app source and this report are tracked.

## Fidelity surfaces

1. **Layout:** Desktop wheel bleeds off the left, top, and bottom, with its right edge at approximately52vw. At the reference viewport its diameter is1521.6px and actual circle center is634px vertically. Sidebar content starts near64vw and is400px wide. Brand sits above the reading content and family navigation sits below it. The wheel remains sticky through the reading section, with the normal document footer following that section.
2. **Typography:** Locally hosted Gilda Display remains the emotion headline font. The existing48px title,17px definition,14px example copy, and10px uppercase labels are retained. The reference title and definition appear slightly larger; this is a minor P3 difference and preserves the site's established readable type scale. Brand uses18px sans-serif with a28px icon.
3. **Color:** Existing approved pastel family colors, saturation100%, contrast114%, brightness97%, warm paper background, and white interaction outline remain. No black wheel strokes were reintroduced.
4. **Assets:** The actual editable SVG wheel geometry and local rotate icon remain. The sidebar brand reuses the existing favicon in monochrome instead of creating a replacement sunburst; this is an intentional P3 identity difference. The live favicon/social image remain unchanged.
5. **Copy:** Existing emotion definitions, hierarchy, somatic examples, combined behavioral examples, and section labels remain. The screenshot's visible brand text was added. Earlier explicit decisions retain the icon-only hub spin, bold family label with outlined color dot, and full-width site credit rather than the reference's blank hub/pill navigation.

## Stability verification

Every one of108 sectors (105 unique emotion names) was selected through the real roving keyboard UI and measured in the browser. All current entries fit without clipping, and their section starts and navigation positions remain identical within each viewport:

| CSS viewport | Reading width | Summary / body / behavior band heights | Result |
|---|---:|---|---|
|2048×1268|400px|216 /180 /352px|108 checked; no overflow or position changes|
|1440×900|400px|216 /180 /352px|108 checked; no overflow or position changes|
|1101×800|342.97px|240 /208 /352px|108 checked; no overflow or position changes|
|768×1024|400px|216 /208 /352px|108 checked after tablet fix; no position changes|

Bands are minimum grid tracks with growth fallback for larger accessibility text or future content, rather than clipped fixed-height boxes. Mobile modal content intentionally retains natural heights.

## Issues and fixes

- Initial review: variable summary, somatic, and behavioral content changed the vertically centered block height and moved navigation. Grouped the summary and reserved all three reading bands.
- First tablet test: the larger15px tablet example text made one somatic section grow from180px to201px, shifting the last divider and navigation. Raised the tablet somatic reserve to208px and repeated all108 selections; all bands and navigation positions were stable.
- Final source/implementation visual review found no open P0, P1, or P2 issues. Minor intentional differences are recorded above.

## Interaction and responsive checks

- At390×844, actual wheel center is422px (viewport center), with no horizontal page overflow or sidebar. Initial motion does not open the drawer.
- Enter activation opens the native modal drawer with natural content heights. Close returns focus to the selected sector and preserves the white outline.
- Family navigation still selects and rotates its primary emotion toward the right.
- The hub control still completes a random spin and applies the resulting selection/outline.
- Desktop wheel stays sticky within its reading section during document scrolling; footer remains in normal flow.
- Browser captured no console errors during these checks.
- `npm test`:26 passed. `npm run build`:passed. `npm run test:sites`:4 passed.

## Mobile full-color selection follow-up

At390×844, selecting an emotion opens the drawer while every sector and wheel-stroke layer stays at opacity1. Closing preserves the white selected outline and all colors remain at full opacity. At1440×900, keyboard selection still applies desktop branch fading (104 unrelated sectors at opacity0.38). Screenshot: `qa/mobile-full-color-selection.png`. No console errors observed;26 unit checks, production build, and4 Sites worker checks passed. The narrow-layout focus gate changes only visual branch fading, retaining the existing selection reducer and modal behavior.

## Portrait iPad drawer follow-up

The drawer layout now covers widths up to600px in either orientation, plus portrait viewports up to1100px. This uses the same query in CSS and React. Phone geometry is unchanged; portrait tablets use a larger wheel capped at1100px and a600px maximum reading width inside the native bottom drawer.

Browser checks passed at768×1024,834×1194, and1024×1366: no inline sidebar or family navigation, circle vertically centered to within0.01px, initial drawer closed, real click on Shocked opens the correct detail drawer, body scroll locks, every sector remains at opacity1, Close restores focus and white outline, and body scroll unlocks. Screenshot: `qa/portrait-ipad-drawer.png`. Rotating an open834×1194 drawer to1194×834 removes the modal and restores the inline sidebar/navigation and normal scrolling.1024×768 retains the inline layout;390×844 retains the existing phone drawer and600px wheel. No browser console errors.26 checks, production build, and4 worker checks passed.

## Larger sidebar typography follow-up

Increased inline sidebar typography:56px Gilda headline (48px at1101–1279),19px definition,16px examples,11px uppercase labels and numbering,12px breadcrumbs/navigation, and20px brand. Reserved universal240/224/376px summary/body/behavior bands with growth fallback to preserve stable divider and navigation positions.

Selected all108 sectors through the real keyboard UI at1440×900,1101×800, and1024×768. Each viewport had exactly one row-height combination (240/224/376px), one set of section starts, and one navigation position; no content overflow. Verified actual computed text sizes. Visually reviewed `qa/larger-sidebar-desktop.png`; focused proof is `qa/larger-sidebar-detail.png`. Measurements are in `qa/larger-sidebar-measurements-final-{1440,1101,1024}.json`. At834×1194, the drawer remains42px title/17px definition/15px examples/10px labels with normal flow. No browser console errors.26 checks, production build, and4 worker checks passed.
