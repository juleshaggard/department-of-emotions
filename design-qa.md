# Design QA — sidebar layout order

Date:2026-10-27

final result: passed

## Selected source and scope

User-selected image: `/var/folders/0j/f8hz42fn3vxcrz0v7qrlggqm0000gn/T/codex-clipboard-b305cc19-b00e-4e54-bd8a-57b772ab66cd.png` (402×600px). The request is to follow its sidebar layout order while retaining the previously requested larger type and stable section heights. This is a component reference, not a new mobile page design.

Required inline order: title/definition → bodily sensations → possible body language/behaviors → bordered hierarchy row → compact brand/credit footer. Remove the visible family-button row and replace the standalone page credit with the linked sidebar credit. Phone and portrait-tablet drawers preserve their existing hierarchy-first order and omit branding.

## Evidence and normalization

Implementation: `http://localhost:4173/explore`, 2048×1268 CSS viewport, Hysterical selected, opening motion complete, scroll zero. Screenshot: `qa/sidebar-order-desktop.png` (2033×1259 capture pixels). It was normalized to the CSS viewport before extracting the sidebar component at x1217–1853, y72–1172.

The source reading column spans approximately253px (x53–306). It was enlarged to a400px reading width, producing a636×950 image, then placed on a636×1100 comparison canvas. The extra150px is blank canvas beneath the reference. The implementation component occupies an equally sized636×1100 canvas. This normalizes column width and text scale without stretching away the intentionally stable reading bands.

Source and implementation were viewed together in `qa/sidebar-order-comparison.png` (1272×1124 including labels). The focused implementation proof is `qa/sidebar-order-detail.png`. These ignored QA artifacts remain local.

## Five fidelity surfaces

- **Layout:** Matches the requested sequence, with hierarchy between two divider lines and the compact footer beneath it. The brand sits left and credit sits right on one line. Summary/body/behavior/hierarchy tracks reserve208/224/376/88px, with growth fallback for accessibility. The reference's shorter Hysterical content has smaller gaps; retaining enough space for the longest entries is intentional and preserves the earlier anti-jump requirement.
- **Typography:** Retains the latest enlarged reading scale:56px Gilda Display headline (48px in narrow desktop sidebars),19px definition,16px examples,11px uppercase labels/numbering,12px hierarchy. Footer follows the new compact reference:14px brand,20px icon,11px credit. Drawer type is unchanged.
- **Color:** Existing warm paper, dark text, muted labels/dividers, and family-colored hierarchy dot remain. Wheel colors, white outline, and mobile full-opacity behavior are unchanged.
- **Assets:** Uses the user-supplied sunburst SVG at `public/brand/department-of-emotions.svg`, copied byte-for-byte from the attachment. It renders at21×21 with its authored `#212C24` strokes and no CSS filter. The separate rainbow favicon and editable wheel geometry are unchanged; the latest request removes the hub rotate control, leaving a blank center.
- **Copy:** Emotion definitions and all example text are unchanged. The hierarchy follows the selected emotion. Brand text is Department of Emotions; Site created by Jules links to `https://www.haggard.design/`. Exactly one credit link renders in the inline layout.

## Stability verification

All108 sectors (105 unique emotion names) were selected through the real roving keyboard interface at1440×900,1101×800, and1024×768. Each viewport had exactly one208/224/376/88px row-height combination, one set of section starts, and one footer position. No text or footer overflow occurred, including at the342.97px narrow reading width.

Measurements: `qa/sidebar-order-measurements-1440.json`, `qa/sidebar-order-measurements-1101.json`, and `qa/sidebar-order-measurements-1024.json`.

## Interaction checks

- Wheel dragging and keyboard emotion selection remain available. The latest request removes the hub spin control and leaves the center blank.
- At1440×900, scrolling to the document bottom retains the actual wheel circle center at450px, matching the viewport center.
- At834×1194, tapping Shocked opens the native drawer with its existing hierarchy-first summary and correct content. The sidebar footer does not render there; all wheel sectors remain at opacity1. Close restores focus to Shocked and retains selection.
- Credit href and single-instance rendering verified without opening an external site.
- No browser console errors were captured.
- `npm test`:26 passed. `npm run build`:passed. `npm run test:sites`:4 passed. `git diff --check`:passed.

## Review result

The final combined visual comparison and independent review found no open P0/P1/P2 issues. Reading order, hierarchy dividers, and one-line footer match the source. The retained band spacing is an intentional difference documented above. The earlier footer-logo difference is resolved by the supplied SVG. No further visual iteration is required for this request.

## Supplied logo follow-up

Source: `/Users/Darling/.codex/attachments/21f3994e-ada3-420e-a251-7e2da91998f8/Pasted text.txt`. Exact copy saved as `public/brand/department-of-emotions.svg`. XML validates as a21×21 self-contained SVG with48 paths and no external references or script. Browser verified complete load,21×21 natural/display dimensions, and filter none. The rainbow SVG favicon still points at `/favicon.svg`. Visual proof: `qa/supplied-logo-footer.png`; full capture and metrics: `qa/supplied-logo-desktop.png`, `qa/supplied-logo-metrics.json`. Production build and4 Sites worker checks passed; no browser console errors.

## Blank wheel center follow-up

Removed the center rotate icon and its button, including the random-spin handler and associated component refs/CSS. The hub has no invisible click target. Opening animation, drag/flick momentum, emotion selection, and drawer focus restoration remain. Browser verified zero buttons/images inside the wheel stage, visible blank center, successful drag rotation, no drawer opening on a blank-hub tap at390×844, and a working Shocked tap opening its detail drawer. Footer uses the supplied logo unchanged. Proof: `qa/blank-wheel-center.png`; full capture and metrics: `qa/blank-hub-desktop.png`, `qa/blank-hub-metrics.json`. Production build and4 Sites worker checks passed; no browser console errors.

## Joy-facing-right entrance follow-up

The initial family remains Joy. The entrance now derives its resting rotation from that family's sector midpoint, yielding-92.6470588235294degrees and an opening start60degrees earlier. The existing1.4s power3.out turn is retained. Rotation is applied before Draggable initializes, so the reduced-motion code path starts at the same final angle immediately. The numeric initial angle is stable across selections; useGSAP dependencies include only the rotor reference and that resting angle.

Browser captured the normal entrance moving at-146.236degrees and settling at-92.6471degrees. At1440×1000, wheel center=(141,500), Joy label center=(276.476,500), proving a right-facing radial centerline. At390×844, wheel center=(18,422), Joy center=(85.738,422), and the drawer remained closed during the entrance. Tapping Joy opens the correct drawer. A manual rotation stayed exactly-20.0834degrees after a keyboard selection rerender; early Escape stopped the entrance at-146.078degrees. No console errors. Reduced-motion handling was code-reviewed; browser preference emulation is not exposed by this browser.26 unit checks, production build, and4 worker checks passed. Proof: `qa/joy-facing-right.png`; full capture and metrics: `qa/joy-facing-right-desktop.png`, `qa/joy-facing-right-metrics.json`.

## Sidebar outer-padding follow-up

Increased inline sidebar padding to64px at both top and bottom, including the landscape-tablet override. Section-band heights, internal section spacing, fonts, footer spacing, and drawer spacing are unchanged. At1440×1073, browser measured exact64px gaps above and below the945px sidebar shell, with reading bands208/224/376/88px. At1101×800 and1024×768, computed block padding remains64px on both sides. Scrolling the narrow desktop page to273px keeps the wheel center at400px, equal to the viewport center. At834×1194, the sidebar remains absent and drawer content retains8px top/28px bottom padding. No horizontal overflow or console errors. Production build and4 worker checks passed. Proof: `qa/sidebar-padding-detail.png`; full capture and metrics: `qa/sidebar-padding-desktop.png`, `qa/sidebar-padding-metrics.json`.
