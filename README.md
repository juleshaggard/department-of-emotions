# Department of Emotions

An interactive emotion wheel made from editable SVG geometry and text. The wheel preserves the supplied Junto Institute reference's order and pastel palette: 6 primary, 34 secondary, and 68 tertiary sectors. Every label reads radially outward, with its first letter nearest the blank center.

## Pages and interaction

Both `/` and `/explore` open the interactive explorer. The original static wheel is available at `/wheel`.

On initial load, the wheel makes a gentle 60-degree turn and settles into its original position over 1.4 seconds. The opening motion skips reduced-motion preferences and stops immediately when someone takes control.

Drag or flick the wheel to rotate it with momentum, or activate the upright rotate icon in its hub. This HTML button has the accessible label “Spin the wheel,” without visible label text or an under-wheel control row. It stays upright outside the spinning SVG. Each family button selects its primary emotion and turns the section toward the right by the shortest route. The circular stage clips the rotor so it cannot cover those controls.

The hub button chooses uniformly among the 105 unique emotion names, rotates the chosen sector to the right, and selects and highlights it only when the spin finishes. Interrupted spins cannot apply a stale selection; reduced motion selects immediately. On phones and portrait tablets in the drawer layout, a completed hub spin opens the information drawer. Closing it returns focus to the hub button and preserves the highlight. The opening animation and manual dragging do not open the drawer.

Family navigation sits below the reading content in normal flow. The persistent brand above the reading content and navigation below it stay outside the changing emotion content, keeping their positions stable as emotions change. The selected family uses a weight-650 label and a 1px outline around its 9px color dot, offset by 3px. The buttons have no pill backgrounds or borders; a text underline indicates keyboard focus. Navigation is hidden in the phone and portrait-tablet drawer layout.

Hover previews persist in the reading panel. Taps, family buttons, and roving keyboard focus also select emotions. A stable breadcrumb shows the full hierarchy, such as Fear → Scared → Frightened, with the family color dot. Hover and focus keep the selected branch clear while softly fading unrelated sectors. Desktop mouse hover clears on pointer exit. Touch selection keeps its white outline after lift, pointer leave, and blur until another emotion is selected. The phone and portrait-tablet drawer layout keeps all sectors and stroke layers at their full configured opacity, disabling branch fading while preserving selection and the modal drawer. Inline layouts, including landscape screens wider than 600px, retain branch focus. Rotation temporarily removes branch fading, restoring it when it stops; reduced motion removes animated fades and momentum.

The main content contains the wheel and reading panel, without a top header bar or introductory instructions. The existing 28px favicon and a dark 18px “Department of Emotions” brand sit above the reading content. The changing content starts with the emotion hierarchy and title, without a “Jump to a feeling” dropdown. Gilda Display is served locally from `public/fonts/`, with its open font license, for the emotion title. The two reading-panel section headings use a shared small uppercase sans-serif label style.

At desktop widths of at least 1101px, the full-width main grid uses 60vw and remaining-space columns. An oversized sticky wheel stays vertically centered in the viewport and is clipped at the left, top, and bottom. Its width is `clamp(74vw, 120dvh, 92vw)`, with the right edge at 52vw. The reading column is inset 4vw from its 60vw grid start, placing its content near 64vw, and is capped at 400px wide.

The inline emotion summary group (hierarchy, title, and definition), somatic section, and response section use minimum heights of 216px, 180px, and 352px at widths of at least 1280px. At widths from 1101px through 1279px, those minimums are 240px, 208px, and 352px; at landscape tablet widths from 601px through 1100px, they are 216px, 208px, and 352px. These bands fit the current dataset while keeping the surrounding brand and navigation stable. Content can grow for accessibility without clipping. Drawer reading content uses natural flow without these minimum bands. Stable scrollbar space prevents wheel shifts and hover jitter.

At landscape widths from 601px through 1100px, the wheel and reading panel stack in normal flow, with a legible wheel up to 780px wide and reading column up to 400px wide. The reading bands remain stable as emotions change. Portrait tablets use the phone-style drawer layout instead.

The drawer layout uses `(max-width: 600px), (max-width: 1100px) and (orientation: portrait)` in both JavaScript and CSS. Phones up to 600px retain a wheel width of `min(160vw, 820px)`; portrait tablets from 601px through 1100px use `min(120vw, 1100px)`. In both, the wheel's right edge aligns with the content area before an additional 12vw shift left. The actual circle is vertically centered at 50dvh in a viewport-height stage, with an svh fallback. The inline sidebar, family buttons, and credit are hidden, while the hub icon remains visible at the actual hub center despite the left bleed. Page overflow is clipped, including on short screens, without creating a scrolling container or shifting the wheel's rotation pivot. The modal drawer stays above the stage and scrolls internally.

In the drawer layout, a confirmed emotion tap or completed hub spin opens a native modal bottom drawer above everything with a visible “Close” control and the same hierarchy, definition, and reading sections in natural content flow. Tablet drawer reading content is capped at 600px wide. It stays closed on initial load, drags, and arrow-key focus; Enter or Space opens it for keyboard users. The drawer uses the modal top layer with an inert background and locked page scrolling. Long content scrolls inside the drawer, with space for the device safe area. “Close” or Escape restores focus to the opener while preserving the touch selection highlight. Leaving the drawer-layout query, including rotating a tablet to landscape, closes the drawer and unlocks page scrolling. Landscape screens wider than 600px retain their existing inline layout and fading.

Buttons, including the drawer’s “Close” control, show keyboard focus with subtle fill and border changes, without external outline rings. Family navigation uses a text underline instead.

A small [Site created by Jules](https://www.haggard.design/) credit link sits in a full-width page footer after the main content, centered across the entire page at the document bottom in normal flow. The footer has 16px top, 24px side, and 24px bottom padding and is hidden in the phone and portrait-tablet drawer layout. The credit sits outside the wheel controls, reading sidebar, and wheel SVG. The static `/wheel` page and SVG exports remain free of outside text and the interactive hub icon, with blank centers.

## Wheel settings and download

The “Wheel settings” button and editor are hidden on the explorer. The reusable appearance-editor and custom-SVG-download implementations remain in `src/explorer/`. Defaults use no outer, ring, sector, main, or center strokes and a white 6-unit hover outline. The source family palette uses 100% saturation, 114% contrast, and 97% brightness.

The retained editor supports separate stroke controls, family colors, saturation, contrast, brightness, text, center fill, and hover focus. It can be restored in code if further visual tuning is needed.

Previously saved appearance preferences continue to apply from this browser's local storage. The retained SVG export produces a complete unfaded vector wheel without temporary hover outlines or app controls. Its center is blank and it has no visible title or attribution outside the wheel.

## Emotion content

All 108 sectors resolve to 105 original content entries in `src/content/`; repeated labels share the same content. Each entry includes a short definition, a curated `responses` list combining body-language cues and actions, and two `somaticExperiences`. Substantially overlapping response examples are consolidated within each emotion while distinct examples are retained. “How it may feel in the body” appears first, followed by “Possible body language & behaviors”; both sections are always visible, without carets or collapse controls. Both headings share the same 10px, weight-650 sans-serif style with 1.6px letter spacing and uppercase text.

Spacing within the inline reading bands stays compact, while their minimum heights stabilize section positions across emotions. Drawer content retains natural spacing without reserved band heights. The emotion reading content ends after “Possible body language & behaviors,” with family navigation below it in inline layouts; there is no disclaimer footer or “About these examples” disclosure.

Examples remain illustrative and vary by person, culture, and context. They do not diagnose or reliably identify another person's feelings. Example copy uses concise descriptive phrases without repetitive “You may” or “You might” introductions. Research context is retained here:

- [Emotion and body movement](https://pubmed.ncbi.nlm.nih.gov/22059517/)
- [Context when reading expressions](https://pmc.ncbi.nlm.nih.gov/articles/PMC6640856/)
- [Felt bodily sensations](https://pmc.ncbi.nlm.nih.gov/articles/PMC3896150/)

## Source and exports

The rainbow-circle favicon uses the wheel's six family colors and includes SVG, PNG, ICO, and Apple touch-icon versions. `scripts/generate-favicon.py` regenerates them with Pillow.

Option 1, Editorial, is the selected 1200×630 social preview. Its source is `public/social/options/01-editorial.png`, and the published asset uses the stable `public/social/department-of-emotions.png` path. Open Graph and Twitter image metadata use the absolute URL `https://departmentofemotions.com/social/department-of-emotions.png`. The three candidates and editable SVG sources remain in `public/social/options/` as alternates. `scripts/generate-social-options.mjs` regenerates their SVG sources; passing `--renderer` with a local `@resvg/resvg-js` module also exports PNGs.

- `src/emotions.js`: editable hierarchy in clockwise order.
- `src/reference-palette.json`: colors sampled from the reference.
- `src/wheel.js`: shared SVG generator and radial geometry.
- `src/App.jsx`: routing between the explorer and static wheel.
- `src/explorer/`: interactive wheel, motion, reading panel, settings, persistence, and custom SVG download.
- `src/content/`: definitions and examples.
- `exports/emotion-wheel.svg` and `exports/emotion-wheel.html`: original static wheel exports, regenerated with `npm run export`.

The label transform deliberately follows the spoke angle without a 180-degree correction on the left:

```js
`translate(${center} ${center}) rotate(${angle}) translate(${radius} 0)`
```

## Development and verification

```sh
npm install
npm run dev
npm test
npm run build
npm run test:sites
npm run export
```

`npm test` checks complete content coverage, repeated labels, branch focus, settings normalization, palette fidelity, and color adjustments. `npm run test:sites` verifies static asset serving, app-route fallback, and hosting packaging.

The app is prepared for Sites hosting with `departmentofemotions.com` as the intended public domain. This repository documentation does not establish deployment or domain status. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact. Before handing a build to Sites, run `npm run build` and `npm run test:sites`; the build must include `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## GitHub Pages

The source is also published at [juleshaggard/department-of-emotions](https://github.com/juleshaggard/department-of-emotions). Pushes to `main` run the content checks, build a static site, and deploy it through `.github/workflows/pages.yml`.

`npm run build:pages` writes to `dist/pages`. Set `PAGES_BASE_PATH=/department-of-emotions/` to reproduce the project-path build locally. The output includes direct entry points for the root, `/explore/`, and `/wheel/`, with assets under the configured prefix. The existing Sites build and local preview output remain separate in `dist/client`.

The Pages address is [juleshaggard.github.io/department-of-emotions/](https://juleshaggard.github.io/department-of-emotions/). Canonical and social metadata continue to use the primary `departmentofemotions.com` domain; this deployment does not alter its DNS.
