# Design QA — compact sidebar without desktop page scrolling

Date:2026-10-27

final result: passed

## Current request

The user clarified that adding outer padding must not make the page scroll: reclaim the empty space inside the sidebar instead. The existing layout order, larger reading type, stable sections, supplied logo, blank wheel hub, and Joy-facing-right entrance remain.

Context screenshot: `/var/folders/0j/f8hz42fn3vxcrz0v7qrlggqm0000gn/T/codex-clipboard-20f73b34-51bd-4b06-9b9a-c2721bcbb612.png`. It shows Amused before the spacing correction. The superseded64px-only padding draft was pushed to source but was never saved or deployed as a Site version.

## Layout and typography

Normal inline bands are168/148/272/44px for summary/body/behaviors/hierarchy. Footer content plus padding totals33px, giving a665px shell. Reduced internal padding and list spacing replace the earlier oversized bands. Desktop outer block padding adapts from24px to64px using the spare viewport height, while the sidebar stays vertically centered.

At desktop heights up to720px, compact bands156/128/236/36px plus29px footer give a585px shell. Outer padding adapts from6px to32px. This profile uses a48px headline and tighter leading; definition and example font sizes remain19px and16px. Growth fallback is retained for unusually enlarged text rather than clipping it.

Phone/portrait-tablet drawers retain their natural flow, existing typography, and independent spacing. Landscape tablets from1024px use the side-by-side wheel/info layout; narrower landscape layouts retain the stacked flow.

## Visual evidence

- Full current capture: `qa/compact-sidebar-desktop.png`.
- Focused result: `qa/compact-sidebar-detail.png`.
- Same-state before/after: `qa/compact-sidebar-comparison.png`.
- Current geometry: `qa/compact-sidebar-metrics.json`.

The browser viewport is1440×989 CSS pixels with Amused selected. The native capture is normalized to that viewport before cropping the400px reading column. The before/after comparison preserves the supplied image's text scale and989px height; only blank paper is added where the component crop extends beyond the screenshot edge. Both images were visually reviewed together.

At this viewport the shell is665px high, from y162 to827. The page scroll height is exactly989px, and scrollY is zero. This moves unused space outside the content while reducing gaps inside it.

## Fidelity surfaces

- **Layout:** Title/definition, body sensations, behaviors, hierarchy, then compact brand/credit remain in the approved order. Inner reserves and gaps are intentionally smaller to fulfill the current no-scroll request.
- **Typography:** Gilda Display and the enlarged reading scale remain. Normal56px headline (48px in narrow sidebars),19px definition,16px examples,11px labels/numbers,12px hierarchy,14px brand, and11px credit. Short desktop profiles use48px headline and tighter line heights.
- **Color:** Warm paper, dark text, muted dividers, family-colored dot, pastel wheel, and white selection outline are unchanged.
- **Assets:** Exact supplied21px SVG logo remains. Wheel hub remains blank; rainbow favicon and vector wheel geometry are unchanged.
- **Copy:** Amused and all other emotion definitions/examples remain unchanged. The credit still links to `https://www.juleshaggard.com/`.

## All-sector verification

Every108 sectors (105 unique names) was selected using the real keyboard UI at each viewport below. Each had one section-height combination, one set of section starts, and one footer position. There was no content overflow, no layout jumping, and no desktop page overflow:

| CSS viewport | Stable bands | Maximum page overflow |
|---|---|---:|
|1440×989|168/148/272/44px|0px|
|1440×768|168/148/272/44px|0px|
|1101×800|168/148/272/44px|0px|
|1280×720|156/128/236/36px|0px|
|1101×600|156/128/236/36px|0px|

Per-sector measurements are saved in `qa/compact-sidebar-{width}x{height}.json` for all five viewports. No overflow-hiding workaround is used on desktop; the content genuinely fits at these sizes.

## Other verification

At834×1194 the drawer still opens correctly. Its headline is42px, examples15px/25.5px leading, and first-section padding20px, matching the prior drawer styles. No browser console errors were captured. Production build,4 Sites worker checks, and `git diff --check` passed.

No P0/P1/P2 issues remain for the current request.

## Credit link follow-up

Changed the Site created by Jules destination to `https://www.juleshaggard.com/`. Browser verified the exact href, unchanged label, new-tab target, and noreferrer relationship. No spacing or styling changes. Proof and metrics: `qa/credit-link-footer.png`, `qa/credit-link-metrics.json`. Production build and4 worker checks passed.

## Drawer logo follow-up

Added the exact supplied21×21 SVG logo to the top-left of the drawer header, opposite Close. It has alt text Department of Emotions, uses the same local base-aware asset path, and aligns with the24px content inset. Header height remains60px. At390×844, the logo loads at21×21, left24px, while Close keeps its44px target. Scrolling the Touched content29px leaves logo and Close at exactly their prior screen positions. At834×1194 the logo stays24px from the drawer left, Close stays16px from the right, and they do not overlap. Closing returns focus to Touched. No console errors. Production build and4 worker checks passed. Proof: `qa/drawer-logo-detail.png`; full capture/metrics: `qa/drawer-logo-mobile.png`, `qa/drawer-logo-mobile-metrics.json`.

## Outside-tap drawer dismissal follow-up

Added a native-dialog backdrop gesture guard. A primary pointer press must start and end outside the panel, stay within10px movement, and produce a pointer click. Pointer movement/cancel/open/cleanup reset the stored press. Inside content/padding and drags do not dismiss. Dismissal uses the existing onClose cleanup, focus restoration, and scroll unlock; no new overlay is placed over the wheel.

An initial browser check caught mouse hover preview changing the selected emotion after closing. Drawer layouts now ignore pointer hover previews, while confirmed taps and keyboard previews remain available. This preserves the selected emotion under the pointer after dismissal. Desktop hover behavior is unchanged.

At390×844, inside taps stayed open; outside tap closed Joy and preserved Joy selection/focus, restored body position/static and root overflow, and avoided click-through. Reopening Touched, dragging from inside to outside, and dragging across the backdrop kept the drawer open; a following outside tap closed it and preserved Touched. Keyboard ArrowRight/Enter still opens Content; Escape closes and restores Content focus. At834×1194, outside tap closes Touched and preserves selection/focus. The visible Close button still works. No browser console errors.26 unit checks, production build,4 worker checks, and diff whitespace check passed. Proof: `qa/backdrop-dismissal.png`, `qa/backdrop-before.png`, `qa/backdrop-after.png`, `qa/backdrop-result.json`.

## Landscape iPad side-by-side follow-up

Extended the full-height side-by-side layout to landscape widths from1024px, while keeping the existing portrait drawer query unchanged. The1024–1100px landscape grid uses56vw for the wheel column with24px sidebar inline padding. Narrow sidebar headlines use48px from1024–1279px, and the existing short-height profile now applies from1024px. The stacked query is limited to max-width1023px or portrait max-width1100px, after which the existing drawer styles apply.

At1024×768, the grid's wheel right edge is524.69px and sidebar starts at565.03px. Actual reading width is395.97px; wheel centerY384px matches the viewport center. All108 sectors were selected at a stable1024×768 viewport: one168/148/272/44px band combination, one set of section starts, one footer position, and no content or page overflow. Equivalent sweeps at1024×600 and1100×768 also passed without scrolling or shifting. Per-sector files: `qa/landscape-ipad-1024x768.json`, `qa/landscape-ipad-1024x600.json`, `qa/landscape-ipad-1100x768.json`. An initial capture began before the viewport override settled; its1024×768 measurements were rerun after confirming innerWidth/innerHeight and replaced with the stable sweep.

Portrait768×1024 and1024×1366 keep the native drawer and42px drawer headline. Touched opens normally in portrait. Rotating an open portrait drawer to1024×768 removes the modal, restores the inline sidebar, unlocks body scrolling, and leaves no page overflow. No browser console errors. Production build,4 worker checks, and diff whitespace check passed. Final visual proof: `qa/landscape-ipad-1024.png`.
