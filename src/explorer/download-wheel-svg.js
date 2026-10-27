const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const EXPORT_TITLE_ID = 'emotion-wheel-export-title';
const EXPORT_DESCRIPTION_ID = 'emotion-wheel-export-description';

/** Download a static copy of the full wheel without changing the live SVG. */
export function downloadWheelSvg(svgElement, settings) {
  if (svgElement?.namespaceURI !== SVG_NAMESPACE || svgElement.localName !== 'svg') {
    throw new Error('The wheel is not ready to export.');
  }

  const viewBox = svgElement.getAttribute('viewBox')?.trim().split(/[\s,]+/).map(Number);
  if (viewBox?.length !== 4 || !viewBox.every(Number.isFinite) || viewBox[2] <= 0 || viewBox[3] <= 0) {
    throw new Error('The wheel has no valid export dimensions.');
  }

  const copy = svgElement.cloneNode(true);
  copy.querySelectorAll('.selected-outline, [data-stroke-key="hover"], title, desc, script, foreignObject, style')
    .forEach((element) => element.remove());

  // Hover focus fades sectors and some independent stroke layers. Restore the
  // complete wheel while keeping each layer's user-selected base opacity.
  copy.querySelectorAll('.explorer-sector').forEach((element) => {
    element.style.opacity = '1';
    element.removeAttribute('opacity');
  });
  copy.querySelectorAll('[data-stroke-key]').forEach((element) => {
    const key = element.getAttribute('data-stroke-key');
    const opacity = settings?.strokes?.[key]?.opacity;
    if (typeof opacity !== 'number' || !Number.isFinite(opacity) || opacity < 0 || opacity > 1) {
      throw new Error(`The ${key} divider opacity is not ready to export.`);
    }
    element.style.opacity = String(opacity);
    element.removeAttribute('opacity');
  });

  // Every visible appearance value is inline in the live SVG. CSS classes and
  // app interaction attributes can therefore be removed from the static copy.
  [copy, ...copy.querySelectorAll('*')].forEach((element) => {
    [...element.attributes].forEach(({ name }) => {
      const attribute = name.toLowerCase();
      if (attribute === 'id' || attribute === 'class' || attribute === 'role'
        || attribute === 'tabindex' || attribute === 'focusable'
        || attribute === 'contenteditable' || attribute === 'draggable'
        || attribute.startsWith('aria-') || attribute.startsWith('data-')
        || attribute.startsWith('on')) {
        element.removeAttribute(name);
      }
    });
    element.style.removeProperty('cursor');
    element.style.removeProperty('transition');
    element.style.removeProperty('animation');
    if (!element.getAttribute('style')?.trim()) element.removeAttribute('style');
  });

  copy.setAttribute('xmlns', SVG_NAMESPACE);
  copy.setAttribute('width', String(viewBox[2]));
  copy.setAttribute('height', String(viewBox[3]));
  copy.setAttribute('role', 'img');
  copy.setAttribute('aria-labelledby', EXPORT_TITLE_ID);
  copy.setAttribute('aria-describedby', EXPORT_DESCRIPTION_ID);

  const title = document.createElementNS(SVG_NAMESPACE, 'title');
  title.setAttribute('id', EXPORT_TITLE_ID);
  title.textContent = 'Emotion & Feeling Wheel';
  const description = document.createElementNS(SVG_NAMESPACE, 'desc');
  description.setAttribute('id', EXPORT_DESCRIPTION_ID);
  description.textContent = 'Six core emotions, 34 secondary emotions, and 68 specific feelings. '
    + 'Every label reads outward from the center. Colors, typography, and dividers reflect the selected custom settings.';
  copy.prepend(title, description);

  const source = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + new XMLSerializer().serializeToString(copy);
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = 'emotion-wheel-custom.svg';
  anchor.hidden = true;

  try {
    (document.body || document.documentElement).append(anchor);
    anchor.click();
  } finally {
    anchor.remove();
    // Let the browser begin reading the Blob before releasing its URL.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
}
