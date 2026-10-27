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
- Clip the spinning rotor to the circular stage so it never intercepts clicks on the family buttons.
- Show the hovered emotion's full hierarchy in one stable breadcrumb row, such as Fear → Scared → Frightened, and retain the primary family's color dot. Do not reintroduce separate “family” or “Related to…” labels.
- Use a white outline by default for the hovered or selected emotion sector; the settings panel may customize it.
- Hovering or focusing an emotion softly fades unrelated sectors while keeping its ancestors and descendants clear. Restore full opacity on pointer exit or spinning; use opacity rather than blur and honor reduced motion.
- In the explorer, default all outer, ring, sector, main, and center stroke widths to 0, retaining editable controls. Use a white 6-unit hover outline, 100% stroke opacity, the source family palette, 100% saturation, 114% contrast, and 97% brightness. These later requested settings supersede the earlier dark dividers; remove the black center-circle outline as explicitly requested. Apply user-selected settings to both explorer routes and custom SVG downloads.
- On desktop, keep the wheel vertically centered and sticky while the reading sidebar and page scroll. Reserve stable scrollbar space so changing hover content cannot shift the wheel or cause hover jitter. On mobile and short landscape screens, use normal top-aligned flow without sticky positioning; oversized content must remain scrollable without clipping.
- Draw the white hover outline above all wheel borders and leave enough SVG padding for its full outer stroke, while preserving circular clipping and the centered rotation pivot.
- Use locally hosted Gilda Display from Google Fonts for the emotion title and settings headlines; keep body and wheel labels in their existing sans-serif fonts. The reading-panel section headings “Body language,” “How it feels in the body,” and “How you might respond” share the small uppercase sans-serif label style (10px, weight 650, 1.6px letter spacing).
- Hover previews persist so a person can move to the panel and read. Taps, family buttons, and roving keyboard focus also select emotions.
- Keep the “Jump to a feeling” dropdown removed. The reading sidebar begins directly with the emotion hierarchy and title.
- Label the numbered body-language examples “Body language,” replacing the earlier “In the body” label. Keep the “How it might show up” heading removed.
- All 108 sectors must resolve to the 105 unique emotion entries. Each entry must have a short definition, at least two possible body-language examples, two somatic experiences, and two behavioral experiences; repeated names share one definition. Show somatic and behavioral examples in always-visible reading-panel sections labeled “How it feels in the body” and “How you might respond,” without carets or collapse controls.
- Each small uppercase reading-panel section heading is followed directly by its numbered examples. Keep the helper descriptions “Sensations you might notice inside your body.” and “Ways someone might act or respond.” removed.
- End the reading sidebar after “How you might respond.” Keep the “Every body is different…” footer note and “About these examples” disclosure, including its research links, removed from the visible interface.
- At the bottom of the explorer page, include a small “Created by Jules” site-footer link to https://www.haggard.design, outside the reading sidebar and wheel graphic. Preserve the text-free static `/wheel` page and exports.
- Examples are illustrative, vary by person/culture/context, and must never claim to diagnose or reliably identify a feeling from appearance.
- Respect reduced motion and keep the wheel usable on narrow and short landscape screens.
- On each initial explorer load, gently rotate the wheel from -60 degrees to its original orientation over 1.4 seconds with an ease-out stop. Skip this opening motion for reduced-motion preferences. Pressing, dragging, selecting a family, or keyboard input must be able to interrupt it immediately; ordinary rerenders must not replay it.

## Wheel settings

- Keep the settings panel available from both interactive routes and outside the wheel graphic.
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
