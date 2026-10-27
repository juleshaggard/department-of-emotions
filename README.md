# Department of Emotions

An interactive emotion wheel made from editable SVG geometry and text. The wheel preserves the supplied Junto Institute reference's order and pastel palette: 6 primary, 34 secondary, and 68 tertiary sectors. Every label reads radially outward, with its first letter nearest the blank center.

## Pages and interaction

Both `/` and `/explore` open the interactive explorer. The original static wheel is available at `/wheel`.

On initial load, the wheel makes a gentle 60-degree turn and settles into its original position over 1.4 seconds. The opening motion skips reduced-motion preferences and stops immediately when someone takes control.

Drag or flick the wheel to rotate it with momentum, or use the subtle “Spin the wheel” button beneath the family buttons. Each family button selects its primary emotion and turns the section toward the right by the shortest route. The circular stage clips the rotor so it cannot cover those controls.

Hover previews persist in the reading panel. Taps, family buttons, and roving keyboard focus also select emotions. A stable breadcrumb shows the full hierarchy, such as Fear → Scared → Frightened, with the family color dot. Hover and focus keep the selected branch clear while softly fading unrelated sectors. Pointer exit and spinning restore full opacity; reduced motion removes animated fades and momentum.

The page begins directly with the wheel and reading panel, without a top header or introductory instructions. The reading sidebar starts with the emotion hierarchy and title, without a “Jump to a feeling” dropdown. Gilda Display is served locally from `public/fonts/`, with its open font license, for the emotion title and settings headlines. The three reading-panel section headings use a shared small uppercase sans-serif label style. On desktop, the wheel stays vertically centered and sticky while the sidebar and page scroll. Stable scrollbar space prevents hover content from shifting the wheel. Narrow and short landscape screens use normal scrolling flow.

A small [Created by Jules](https://www.haggard.design) link appears in the explorer's bottom site footer, outside the reading sidebar and wheel graphic. The static `/wheel` page and SVG exports remain free of outside text.

## Wheel settings and download

“Wheel settings” opens an appearance panel with independent width, color, and opacity controls for the outer border, ring lines, sector lines, main separators, center outline, and hover outline. Defaults use no outer, ring, sector, main, or center strokes and a white 6-unit hover outline. The source family palette uses 100% saturation, 114% contrast, and 97% brightness.

Color controls adjust the six families while retaining relative sector tints. Separate saturation, contrast, brightness, text color, text size, and center fill controls are available. Hover focus can be disabled or adjusted through its opacity and fade duration, with a preview option. “Reset all” restores the defaults.

Appearance preferences persist in this browser's local storage. The wheel remains editable if storage is unavailable. “Download SVG” saves `emotion-wheel-custom.svg` with the chosen colors, typography, and line settings. The standalone download includes the complete unfaded wheel and omits the temporary hover outline and app controls. Its center is blank and it has no visible title or attribution outside the wheel.

## Emotion content

All 108 sectors resolve to 105 original content entries in `src/content/`; repeated labels share one definition. Each entry includes a short definition, at least two possible body-language examples, two somatic experiences, and two behavioral experiences. Numbered body-language examples appear under “Body language,” without a “How it might show up” heading. The always-visible somatic and behavioral sections are labeled “How it feels in the body” and “How you might respond,” without carets or collapse controls. All three section headings share the same 10px, weight-650 sans-serif style with 1.6px letter spacing and uppercase text.

The reading sidebar ends after “How you might respond”; it has no disclaimer footer or “About these examples” disclosure.

Examples remain illustrative and vary by person, culture, and context. They do not diagnose or reliably identify another person's feelings. Research context is retained here:

- [Emotion and body movement](https://pubmed.ncbi.nlm.nih.gov/22059517/)
- [Context when reading expressions](https://pmc.ncbi.nlm.nih.gov/articles/PMC6640856/)
- [Felt bodily sensations](https://pmc.ncbi.nlm.nih.gov/articles/PMC3896150/)

## Source and exports

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
