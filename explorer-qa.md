# Emotion explorer QA

## Current implementation and automated verification — 2026-10-27

The interactive explorer is served at `/` and `/explore`; `/wheel` retains the original static chart. Current additions include a subtle “Spin the wheel” button beneath family navigation and a settings panel with independent line width/color/opacity controls, family palettes, color adjustments, typography, center fill, configurable hover focus, local preference persistence, reset, and a custom SVG download. Downloads preserve the chosen appearance while restoring the full unfaded wheel and excluding temporary selection UI.

All 105 unique content entries covering 108 sectors include a definition and at least two body-language, somatic, and behavioral examples. Somatic and behavioral sections expand in the panel. Context continues to describe examples as variable and non-diagnostic.

- `npm test`: passed, 14 tests, 0 failures.
- `npm run test:sites`: passed, 4 tests, 0 failures.
- These checks cover content, branch focus, settings, color computation, and hosting behavior. Browser interaction and export-download verification are separate from these automated results.
- Intended Sites public domain: `departmentofemotions.com`; no deployment status is asserted here.

## Historical browser QA

The sections below preserve earlier visual evidence. References to `/` as static, hidden Spin controls, earlier metadata, and prior content counts describe those revisions; the current implementation is summarized above.

Historical result: passed

## Latest update: soft branch focus

Hover/focus keeps the emotion's branch fully opaque and fades unrelated sectors to 0.38 opacity over 180ms. The selected word and ancestors stay clear for leaf feelings; hovering a parent also preserves its descendants. No blur is applied. The white topmost outline is unchanged. Pointer exit restores the wheel while preserving the reading, keyboard focus applies the same treatment, and dragging/coasting removes dimming. Existing reduced-motion rules disable transitions.

Browser verified Frustrated leaves exactly Anger, Exasperated, and Frustrated at full opacity, with 105 muted sectors; initial load has no dimming. Pointer exit and Tab exit clear focus, keyboard browsing selects the correct branch, and spinning shows zero muted sectors. Build and all 7 tests passed, including duplicate labels and interval precision. Current evidence: `qa/explorer-soft-focus.png` and `qa/explorer-soft-focus-preview.png`.

## Latest update: charcoal separators and desktop vertical centering

The explorer's six primary separators are charcoal (#303030); the hovered outline remains white. The full desktop layout is vertically centered with symmetric padding and automatic margins. Browser measured exactly 166px above and below the layout in a 1394 × 1025 viewport (center error 0), and verified divider rgb(48,48,48) and hover rgb(255,255,255). Portrait (390 × 844) and short landscape (844 × 390) retain block flow and reachable vertical scrolling. Build passed. Evidence: `qa/explorer-centered-dark-separators.png` and its preview.

## Latest update: topmost hover outline and no introduction

Moved the white hover outline to the final SVG paint layer and added centered viewBox padding so its full stroke clears the outer rim and circular clip. The pivot remains at (1159,1159); clipping still protects the family controls. Removed the introductory caption and heading; the selected emotion is now the page's h1, retaining its Gilda Display appearance. Build passed. Browser confirmed no intro, correct heading structure, and the highlight as the final layer. Evidence: `qa/explorer-no-intro.png` and `qa/explorer-no-intro-preview.png`.

## Latest update: full emotion hierarchy

Replaced family/relationship metadata with a single breadcrumb showing primary → secondary → hovered emotion, retaining the primary color dot. Primary and secondary selections show the appropriate shorter path. Browser verified Fear, Fear → Scared, and Fear → Scared → Frightened, with identical heading positions (268.1875px) and the same dot color rgb(254, 177, 147). Build passed. Evidence: `qa/explorer-hierarchy.png` and focused `qa/explorer-hierarchy-detail.png`.

## Latest update: white hovered outline

Changed the hovered/selected sector outline to white, preserving its 12-unit thickness. Build passed. Browser confirmed `rgb(255, 255, 255)` with Perplexed selected. Visual evidence: `qa/explorer-white-hover.png` and `qa/explorer-white-hover-preview.png`.

## Latest update: remove top header

Removed the wordmark, original-wheel link, header divider, and unused header styles. The page now begins directly with the main heading. Build passed; browser confirmed the header and original-wheel link are absent. Current evidence: `qa/explorer-no-header.png` and `qa/explorer-no-header-preview.png`. No actionable visual issues found.

## Current revision: requested interface refinements

All pending user requests were implemented together:

- “Related to…” now occupies the existing right-hand metadata slot. Browser measurements for Happy, Amused, and Joy showed identical heading top (364.1875px) and definition top (435.9375px), including when the relation appears.
- The rotating square is clipped by the circular stage (`overflow: hidden`, `border-radius: 50%`). Native coordinate clicks succeeded on all six family buttons; hit testing confirmed each button was the top target at its center after rotation.
- Each family button selects its main emotion and rotates its midpoint to the right via the shortest route. All six were browser-tested; final angular error was under 0.001 degrees. A family click also interrupted an active flick and aligned correctly.
- Removed the visible Spin/Reset/hint row and the visible interaction instruction paragraph. Screen-reader instructions remain in the SVG's accessible label.
- All h1/h2/h3 headlines now use locally hosted Google Fonts Gilda Display. The browser confirmed the font loaded and all three heading levels used it. The source font and OFL license are in `public/fonts/`.
- Direct dragging and flick inertia still work: two successive post-release transform observations differed, confirming the coast continues.

Current screenshot: `qa/explorer-refinements.png`; preview: `qa/explorer-refinements-preview.png`. Final pictured state: Amused selected, “Related to happy” in metadata, Joy oriented right. Build and the two content tests passed; no browser errors or warnings were reported during verification. The earlier sections below describe the original implementation before these requested refinements.

## Target and evidence

The requested new page is `/explore`: the established wheel plus drag/flick spinning and a definition/body-language reading panel. The source wheel is `qa/desktop-white-dividers.png`; the original attachment is `/var/folders/0j/f8hz42fn3vxcrz0v7qrlggqm0000gn/T/codex-clipboard-14586373-a58d-43bd-a715-d5b1fa4c6c48.png`.

- Final browser-rendered implementation: `qa/explorer-desktop.png`, full page, 1644 × 1103 pixels. Browser viewport 1659 × 1098 CSS pixels at device pixel ratio 1; the full-page capture excludes the scrollbar gutter. All content remains accessible through normal vertical scrolling.
- Wheel comparison: `qa/explorer-wheel-comparison.png`. Both rendered circles are cropped to their color bounds and normalized to 708 × 708 pixels in one comparison image. The new selection outline and surrounding app interface are intentional additions.
- Focused reading-panel evidence: the desktop capture shows Hopeful and its two examples; `qa/explorer-mobile-reading.png` shows Nervous and its examples on a narrow viewport.
- Responsive evidence: `qa/explorer-responsive.png`. The actual app runs inside 390 × 844 and 844 × 390 CSS-pixel browser iframes. Both expose all 108 sectors/options without horizontal overflow; wheel sizes are 335 and 600 pixels respectively.
- Final state: Hopeful selected, wheel reset to zero rotation, controls visible and ready.

## Findings and fixes

No actionable P0/P1/P2 findings remain. A separate agent reviewed the interaction code and desktop visual evidence; another reviewed the educational content.

1. P2: the wheel could disappear on a short landscape viewport because of a nonpositive height-derived width. Fixed with a positive minimum and a stacked layout on short/narrow screens. Verified at 844 × 390.
2. P2: the desktop wheel became too small on a 720px-high viewport, and controls could end up below the first screen. Set a 560px desktop minimum bounded by available width and moved controls above the wheel. Controls remain visible; page content scrolls vertically when needed.
3. Fixed the parent wording from “A form of shameful” to “Related to shameful.”
4. Added whitespace between instruction sentences when the mobile layout hides the line break.

## Required fidelity surfaces

- Typography: original outward wheel labels, font stack, and sizes retained. The new interface uses a native sans-serif hierarchy. Definitions and examples wrap naturally; long emotion names fit the panel.
- Spacing/layout: original geometry reused through the shared annular-sector generator. A separate app header, controls, family navigation, and reading column support the new task. Mobile stacks the same content.
- Colors: source-sampled pastel palette, white 10-unit main separators, charcoal 4-unit ordinary boundaries, and blank white center preserved. App chrome uses restrained warm neutrals.
- Assets: the existing chart remains editable SVG paths and text. No logos, substitute imagery, or image placeholders added.
- Copy/content: every one of 108 sectors resolves to one of 105 original definitions with at least two possible body-language examples. Repeated labels share content while retaining separate wheel positions. Context and research links explain that cues are illustrative, variable, and non-diagnostic.

## Verification

- `npm run build`: passed.
- `npm test`: two tests passed, covering every sector's definition/examples/family/parent and consistent handling of repeated labels.
- Actual native drag/release: observed rotation continue from 397.853 to 440.622 degrees after release while the status remained “Spinning…”, confirming inertia.
- Spin and Stop: spin animates, Stop freezes it and restores the idle control. Reset returns the rotor to zero. Retested on the final clean load.
- Pointer hover: moving onto Hopeful with a secondary-button pointer action, without primary-click selection, updated its definition and two examples. Reading persists when leaving a segment.
- Selection: desktop picker selected Compassionate; a narrow-frame segment click selected Nervous; the narrow-frame picker and reading panel also worked.
- Keyboard: arrow navigation advanced Hopeful to Enthusiastic; Home/End worked; Tab exited the wheel. All sectors use a single roving tab stop, with the native picker providing another complete navigation path.
- Final clean-load browser console: no errors or warnings. Initial development dependency-cache/HMR artifacts were cleared by a fresh load and did not recur.
- Original `/` page: confirmed 108 static labels and white main dividers. Its exports remain available.
- Reduced motion: hook and cleanup reviewed; it disables inertia and uses an immediate deliberate spin step. The operating system preference was not changed for testing. Real touchscreen hardware was not available; mobile-sized layout and click selection were tested in the browser.

## Checklist

- [x] Separate new page; original wheel retained.
- [x] Drag/flick momentum, interrupt, reset, and explicit controls.
- [x] Definitions and examples for every sector.
- [x] Hover, click/tap selection, picker, and keyboard navigation.
- [x] Portrait, landscape, and desktop visual checks.
- [x] Shared body-language context and primary research links.

## Follow-up polish

- P3: fine wheel labels are naturally small on phones; the complete native emotion picker provides an accessible alternative.
