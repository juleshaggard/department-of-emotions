# Prototype Instructions

## Wheel requirements

These visual constraints apply to the wheel graphic and original static `/wheel` page. Both `/` and `/explore` open the interactive explorer, which adds controls and explanatory text around the same wheel. The reference palette and line values below are defaults; explorer settings may customize the appearance.

- Recreate the supplied Junto Institute reference: six primary, 34 secondary, and 68 tertiary sectors, preserving their order and pastel palette.
- Every emotion label must read radially outward, with its first letter nearest the center. Do not flip left-side labels to keep them upright.
- The wheel itself must be editable code and vector geometry, as explicitly requested.
- Keep the wheel center free of text and omit the title and attribution wordmark from the wheel preview and exports. The static `/wheel` page contains no text outside the wheel; the interactive explorer retains its reading panel and controls.
- Preserve the uncluttered white background, ring geometry, and outward-facing emotion labels.
- Make the six primary emotion boundaries more prominent with 10-unit radial dividers spanning all three rings; keep ordinary sector lines at 4 units.

## Interactive explorer

- Both `/` and `/explore` show the explorer with drag/flick rotation, momentum, and a reading panel for every emotion. Keep the earlier Spin/Reset control row and visible interaction instruction paragraph removed. A later explicit request adds one subtle rotate icon and “Spin the wheel” button beneath the family buttons; retain that button. Preserve the original static wheel at `/wheel`.
- Omit the top header bar, including the wordmark, original-wheel link, and its divider.
- Omit the introductory “A moment to understand” caption and “Find a word for what you feel” heading; begin directly with the wheel and reading panel.
- Clicking a family button selects its primary emotion and rotates the center of that section toward the right, using the shortest route.
- Clip the spinning rotor to the circular stage so it never intercepts clicks on the family buttons. Use non-scrolling clipping so focusing a sector cannot scroll the wheel inside its frame.
- Show the hovered emotion's full hierarchy in one stable breadcrumb row, such as Fear → Scared → Frightened, and retain the primary family's color dot. Do not reintroduce separate “family” or “Related to…” labels.
- Use a white outline by default for the hovered or selected emotion sector; the settings panel may customize it.
- Hovering or focusing an emotion softly fades unrelated sectors while keeping its ancestors and descendants clear. Desktop mouse hover clears on pointer exit. Touch selection keeps its white outline and branch focus after lift, pointer leave, and blur until another emotion is selected. Temporarily remove branch fading during rotation and restore it when rotation stops. Use opacity rather than blur and honor reduced motion.
- In the explorer, default all outer, ring, sector, main, and center stroke widths to 0, retaining editable controls. Use a white 6-unit hover outline, 100% stroke opacity, the source family palette, 100% saturation, 114% contrast, and 97% brightness. These later requested settings supersede the earlier dark dividers; remove the black center-circle outline as explicitly requested. Apply user-selected settings to both explorer routes and custom SVG downloads.
- Size the explorer wheel from available width, using `min(100%, 780px)`; do not shrink it based on viewport height. At viewport widths from 601px through 1100px, place the reading panel below the wheel so the wheel can use the full available width up to its cap. Reduce narrow-screen page padding to preserve wheel size.
- On phones up to 600px wide, enlarge the explorer wheel to `min(160vw, 820px)`, align its right edge with the normal content area, then shift it an additional `12vw` left so it bleeds farther off the left side. Center the actual wheel circle vertically at `50dvh` in a viewport-height stage, using `svh` as a fallback. Clip page overflow, including on short screens, without creating a scrolling container. Hide the entire wheel-controls stack, including family navigation, the spin button, and credit, on these mobile screens, and retain the rotor's centered spin pivot. The modal drawer remains above the stage and scrolls internally. Larger screens retain their existing controls and wheel layout.
- At widths up to 600px, hide the inline reading sidebar. A confirmed emotion tap opens its information in a modal bottom drawer above everything, with a visible “Close” control and the same hierarchy, definition, and reading sections. Do not open the drawer on initial load, dragging, or arrow-key focus; mobile keyboard activation with Enter or Space opens it. Use the modal top layer, make the background inert, lock page scrolling, allow long drawer content to scroll internally, and respect the safe area. Closing with “Close” or Escape restores focus and preserves the touch selection highlight. Close the drawer when leaving the mobile breakpoint. At widths above 600px, retain the reading sidebar.
- Show keyboard focus on buttons through subtle fill and border changes, including the drawer’s “Close” button; omit external outline rings.
- Only at viewport widths of at least 1101px and heights of at least 1080px, keep the actual wheel circle vertically centered and sticky while the reading sidebar and page scroll. Wider but shorter viewports retain two columns in normal top-aligned scrolling flow; screens from 601px through 1100px also use normal flow. Above the mobile breakpoint, keep the wheel, family buttons, spin control, and credit accessible without clipping. Reserve stable scrollbar space so changing hover content cannot shift the wheel or cause hover jitter.
- Draw the white hover outline above all wheel borders and leave enough SVG padding for its full outer stroke, while preserving circular clipping and the centered rotation pivot.
- Use locally hosted Gilda Display from Google Fonts for the emotion title and retained settings headlines; keep body and wheel labels in their existing sans-serif fonts. The reading-panel section headings “Possible body language & behaviors” and “How it may feel in the body” share the small uppercase sans-serif label style (10px, weight 650, 1.6px letter spacing).
- Hover previews persist so a person can move to the panel and read. Taps, family buttons, and roving keyboard focus also select emotions.
- Keep the “Jump to a feeling” dropdown removed. The reading sidebar begins directly with the emotion hierarchy and title.
- Combine the earlier “Body language” and “How you might respond” sections into one “Possible body language & behaviors” section. Manually consolidate substantially overlapping examples within each emotion, retaining distinct visible cues and actions. Keep the “How it might show up” heading removed.
- All 108 sectors must resolve to the 105 unique emotion entries. Each entry has a short definition, a curated `responses` list combining body-language and behavior examples, and two `somaticExperiences`; repeated names share the same content. Show “How it may feel in the body” first, followed by “Possible body language & behaviors,” as always-visible sections without carets or collapse controls.
- Each small uppercase reading-panel section heading is followed directly by its numbered examples. Keep the helper descriptions “Sensations you might notice inside your body.” and “Ways someone might act or respond.” removed.
- Keep the gap between the emotion definition and the first reading section compact, without reserving fixed blank space beneath short definitions.
- End the reading sidebar after “Possible body language & behaviors.” Keep the “Every body is different…” footer note and “About these examples” disclosure, including its research links, removed from the visible interface.
- Include a small “Site created by Jules” credit link to https://www.haggard.design/, horizontally centered in the wheel's control stack below “Spin the wheel,” outside the reading sidebar and wheel SVG. Keep it in the stack's layout so it remains clickable and cannot overlap the controls on tall screens. Preserve the text-free static `/wheel` page and exports.
- Examples are illustrative, vary by person/culture/context, and must never claim to diagnose or reliably identify a feeling from appearance.
- Write examples as concise, neutral descriptions without repetitive “You may” or “You might” introductions. Prefer natural descriptive phrases rather than commands or claims that everyone experiences an emotion identically.
- Respect reduced motion and keep the wheel usable on narrow and short landscape screens.
- On each initial explorer load, gently rotate the wheel from -60 degrees to its original orientation over 1.4 seconds with an ease-out stop. Skip this opening motion for reduced-motion preferences. Pressing, dragging, selecting a family, or keyboard input must be able to interrupt it immediately; ordinary rerenders must not replay it.

## Wheel settings

- Hide the “Wheel settings” button and editor on both interactive routes, as explicitly requested. Retain the editor source and the approved appearance defaults and saved preferences.
- Provide separate width, color, and opacity controls for the outer border, ring lines, sector lines, main separators, center outline, and hover outline. Keep sliders and color swatches visually distinct.
- Include family palette controls that retain relative sector tints, plus saturation, contrast, brightness, label color, label size, and center fill controls.
- Include hover-focus enablement, muted opacity, fade duration, and a temporary preview. Honor reduced motion regardless of the chosen fade duration.
- Save appearance preferences locally in the browser, recover safely from missing or invalid saved values, and keep the controls usable when storage is unavailable. “Reset all” restores the defaults.
- “Download SVG” exports the full vector wheel with the selected appearance, selectable outward labels, and blank center. Remove transient selection outlines, branch fading, and app controls from the download. Keep export dimensions padded enough for the full outer stroke.
- Preserve the locally hosted rotate icon and subtle “Spin the wheel” button beneath family navigation; do not reintroduce the former top-level control row or instruction paragraph.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

The intended Sites public domain is `departmentofemotions.com`. Treat publication and domain connection as deployment state to verify; do not infer that the site is live from repository configuration alone.

## GitHub Pages

- The GitHub source repository is `juleshaggard/department-of-emotions`. Publish its `main` branch with `.github/workflows/pages.yml` and retain the independent Sites hosting configuration.
- `npm run build:pages` emits a static site in `dist/pages`, using `PAGES_BASE_PATH` for its project URL prefix. Keep root, `/explore/`, and `/wheel/` directly loadable with real HTML entry points. Asset URLs and route detection must work under the project prefix.
- The primary custom-domain identity and social metadata remain `https://departmentofemotions.com/`; publishing to Pages does not change DNS.

## Site identity and sharing

- Use the six-color circular favicon in `public/favicon.svg`, with PNG, ICO, and Apple touch-icon fallbacks. Match the wheel's pastel family palette and keep its center and exterior clear.
- The selected social preview is option 1, Editorial, from `public/social/options/01-editorial.png` (1200×630), using the actual wheel geometry and Gilda Display. Serve the selected image at the stable `public/social/department-of-emotions.png` path and use `https://departmentofemotions.com/social/department-of-emotions.png` for Open Graph and Twitter image metadata. Retain the editable SVG source and other candidates in `public/social/options/` as alternates.
