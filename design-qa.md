# Design QA

## Current implementation — 2026-10-27

The explorer now opens at `/` and `/explore`, with the original static chart at `/wheel`. Current appearance controls and custom SVG export are documented in `README.md`; automated verification of the current content, settings, and Sites adapter is recorded in `explorer-qa.md`. The new subtle spin button is an explicit addition beneath family navigation; the earlier header and instruction row remain removed.

The settings panel permits custom line widths, colors, and opacity; family palette and contrast adjustments; text and center styling; and hover-focus settings. Reference geometry and outward labels remain editable SVG. Defaults preserve the original pastel fills and the explorer's charcoal dividers with a white hover outline.

## Historical visual QA

The evidence below documents previous revisions. Its earlier route and control descriptions do not override the current implementation summarized above.

Historical result: passed

## Current explorer styling

The interactive explorer now uses charcoal primary separators with a white hover outline and is vertically centered on desktop. Browser confirmed equal top/bottom spacing and normal scrolling on mobile; build passed. Latest evidence and measurements are in `explorer-qa.md`, with screenshot `qa/explorer-centered-dark-separators.png`.

## Latest explorer refinements

Completed and verified: stable inline relationship metadata, circular clipping to keep family buttons clickable, family-button rotation toward the right, removed visible controls and instructions, and locally hosted Gilda Display headlines. Current evidence: `qa/explorer-refinements.png`; details and browser measurements are in `explorer-qa.md`.

## Current work: interactive emotion explorer

The new `/explore` page is complete and verified. Full evidence, interaction checks, responsive captures, content coverage, resolved findings, and remaining test limitations are recorded in [explorer-qa.md](explorer-qa.md). Current screenshots: `qa/explorer-desktop.png`, `qa/explorer-responsive.png`, and `qa/explorer-mobile-reading.png`. The original wheel page and exports remain intact.

## Current revision: white primary separators

The user's latest color update changes the six main separators to white (#ffffff), preserving their 10-unit width. Ordinary sector lines remain charcoal at 4 units.

- Browser screenshot: `qa/desktop-white-dividers.png`, viewport 1659 × 1098 CSS pixels, device pixel ratio 1; sheet 1073 × 1097.98 at x=293, y=0.
- Same-size before/after comparison: `qa/comparison-white-dividers.png`. White separators span all three rings; all 108 outward labels and the blank hub remain intact. No actionable P0/P1/P2 issues.
- Preview: `qa/preview-white-dividers.png`.
- Browser computed styles confirmed six paths, rgb(255, 255, 255), and 10px stroke width.
- Build and standalone SVG/HTML export generation passed.

## Current revision: stronger primary section boundaries

The six main emotion boundaries now use 10-unit charcoal radial strokes from the hub to the outer edge, compared with 4-unit ordinary divisions. The blank center, absence of outside text, 108 outward labels, palette, and geometry are preserved.

- Browser evidence: `qa/desktop-bold-dividers.png`, 1659 × 1098 CSS-pixel viewport at device pixel ratio 1; rendered sheet 1073 × 1097.98 CSS pixels at x=293, y=0.
- Full comparison: `qa/comparison-bold-dividers.png`, showing the previous and current sheets together at 1073 × 1098 pixels. The six thicker spokes are visible through all three rings and do not overlap labels.
- Preview: `qa/preview-bold-dividers.png`.
- Browser verification: six divider paths with computed 10px stroke width, ordinary lines 4px, 108 labels, zero images, zero outside labels.
- Build and standalone export generation passed; both exported files contain all six stronger boundaries and all 108 labels.
- Final visual comparison: passed; no actionable P0/P1/P2 findings.

## Current revision: remove branding and outside text

The user's latest request supersedes the original branding requirements below: remove the center logo and all visible text outside the wheel. The center is now blank; the top-left title and bottom-right attribution wordmark are removed. All 108 emotion labels, their outward orientation, ring geometry, and colors remain unchanged.

- Current implementation screenshot: `qa/desktop-unbranded.png`, captured in the in-app browser at 1659 × 1098 CSS pixels, device pixel ratio 1.
- Current comparison evidence: `qa/comparison-unbranded.png`, with the original source and current rendered sheet normalized to 1073 × 1098 pixels. The intentional removals follow the user's explicit update.
- Current preview image: `qa/preview-unbranded.png`.
- Browser DOM verification: 108 emotion labels, zero SVG images, zero visible text elements outside emotion labels.
- `npm run build` and `npm run export`: passed. Both standalone exports contain all 108 labels and no image elements or outside headings.
- Visual inspection: blank white hub and no external title or attribution; no actionable P0/P1/P2 issues.

The following sections record verification of the original build before the user's requested removals.

## Evidence and normalization

- Source visual truth: `/var/folders/0j/f8hz42fn3vxcrz0v7qrlggqm0000gn/T/codex-clipboard-14586373-a58d-43bd-a715-d5b1fa4c6c48.png` (2318 × 2372 pixels).
- Implementation: `http://localhost:4173/`, captured in the Codex in-app browser.
- Browser viewport: 1416 × 1090 CSS pixels; device pixel ratio 1.
- Implementation screenshot: `qa/desktop.png` (1416 × 1090 pixels). The sheet measures 1065.17 × 1089.98 CSS pixels at x=175.41, y=0.
- Full-view comparison: `qa/comparison.png`. Source resized to 1065 × 1090 pixels; rendered sheet cropped from the browser screenshot to the same dimensions. Both images appear together in the comparison.
- Focused comparison: `qa/comparison-left-labels.png`, showing the left-side labels, ring borders, spacing, and intentional rotation change at readable size.
- Mobile browser evidence: `qa/mobile.png`. The same app runs in a real 390 × 844 CSS-pixel iframe, with a 390 × 399.08 sheet, 108 labels, and no horizontal or vertical overflow.
- Standalone HTML evidence: `qa/standalone.png`; 108 vector text labels and both source logos embedded as data URLs.
- State: static reference sheet, white background, with every emotion label reading radially outward. The title and attribution retain the source's normal orientation.

## Findings

No actionable P0/P1/P2 findings remain. A second agent independently reviewed the full and focused source/render comparisons and confirmed the label hierarchy, palette, ring geometry, and required orientation.

### Required fidelity surfaces

- Fonts and typography: regular humanist/sans-serif reference matched with the Calibri/Carlito/Arial stack and 46-unit labels. This machine uses Arial fallback. All labels fit their rings without wrapping or truncation. Title widths explicitly match the source. Minor font-shape differences remain P3.
- Spacing and layout: original 2318 × 2372 sheet proportions, three rings, center, wedge boundaries, heading position, and attribution preserved. The full sheet fits the desktop viewport and mobile width.
- Colors and tokens: all 6 primary, 34 secondary, and 68 tertiary fill colors sampled from the source; alternating outer-ring tints retained. Charcoal 4-unit boundaries and white background match the reference.
- Image quality and assets: both original logos are clean crops from the supplied reference and appear at their original coordinates and dimensions. The wheel itself is editable vector paths and text, as the user explicitly requested a coded wheel with changed text orientation.
- Copy and content: all 108 labels match the source, including repeated Dismayed, Satisfied, and Sadness labels and the hyphen in Awe-struck.

## Functional verification

- `npm run build`: passed.
- `npm run export`: passed; self-contained SVG and HTML produced.
- Geometry verification: 6/34/68 sectors; every ring covers exactly 360 degrees without gaps; all colors are valid; all 108 text rotations follow their spoke angles without left-side flips.
- Browser DOM verification: 108 labels, no desktop overflow, every label's rotation equals its outward spoke angle.
- Standalone export: opened and inspected in the browser; no React runtime or external image dependency is needed by the exported file.
- Main app console: checked; no application errors. Temporary QA harness timing errors were corrected before the final mobile capture; a browser-injected MutationObserver error occurred only while instrumenting iframe navigation, outside application code.
- Interaction scope: the reference is a static chart and contains no navigation, forms, or buttons. Browser zoom and native SVG text selection remain available. At narrow mobile widths, the full diagram is small; vector content remains sharp when zoomed.

## Comparison history

1. Initial full and focused comparison: passed with P3 heading-width and logo-scale differences. All required outward rotations were present.
2. Refined heading text lengths and restored source-exact logo positions and dimensions. Rebuilt and regenerated both standalone outputs.
3. Captured revised implementation and compared it together with the normalized source in `qa/comparison.png`. No actionable P0/P1/P2 differences. Confirmed mobile layout and portable output separately.

## Implementation checklist

- [x] Preserve original hierarchy, proportions, color palette, title, and attribution.
- [x] Orient the first letter of all 108 wheel labels toward the hub.
- [x] Verify desktop and narrow viewport rendering.
- [x] Deliver reusable source plus standalone SVG and HTML.

## Follow-up polish

- P3: the original font is not bundled; glyph shapes can vary slightly with the installed Calibri/Carlito/Arial fallback.
