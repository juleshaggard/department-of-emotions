import { useEffect, useId, useRef, useState } from 'react';
import { STROKE_CONTROLS } from './wheel-settings.js';
import './wheel-settings.css';

const FAMILY_NAMES = ['Anger', 'Sadness', 'Surprise', 'Joy', 'Love', 'Fear'];
const percent = (value) => `${Math.round(value * 100)}%`;
const units = (value) => `${Number(value.toFixed(1))}`;

function RangeControl({ label, accessibleLabel = label, value, min, max, step = 0.01, format = units, disabled = false, onChange }) {
  const id = useId();
  return (
    <div className="wheel-setting-range">
      <div className="wheel-setting-range-label">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id} aria-hidden="true">{format(value)}</output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} disabled={disabled} aria-label={accessibleLabel} aria-valuetext={format(value)} onChange={(event) => onChange(Number(event.target.value))} />
    </div>
  );
}

function ColorControl({ label, value, compact = false, onChange }) {
  const id = useId();
  return (
    <div className={`wheel-setting-color${compact ? ' is-compact' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="color" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

export function WheelSettings({ settings, onChange, onReset, onExport, previewFocus, onPreviewFocusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const panelId = useId();
  const titleId = useId();
  const triggerRef = useRef(null);
  const closeRef = useRef(null);
  const hasOpenedRef = useRef(false);
  const exportAttemptRef = useRef(0);
  const previewFocusChangeRef = useRef(onPreviewFocusChange);
  previewFocusChangeRef.current = onPreviewFocusChange;

  function closePanel() {
    setIsOpen(false);
    onPreviewFocusChange(false);
  }

  useEffect(() => {
    if (!isOpen) {
      if (hasOpenedRef.current) triggerRef.current?.focus({ preventScroll: true });
      return undefined;
    }
    hasOpenedRef.current = true;
    closeRef.current?.focus({ preventScroll: true });
    function handleEscape(event) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      setIsOpen(false);
      previewFocusChangeRef.current(false);
    }
    window.addEventListener('keydown', handleEscape, true);
    return () => window.removeEventListener('keydown', handleEscape, true);
  }, [isOpen]);

  useEffect(() => () => { exportAttemptRef.current += 1; }, []);

  const update = (key, value) => onChange((previous) => ({ ...previous, [key]: value }));
  const updateStroke = (key, property, value) => onChange((previous) => ({
    ...previous,
    strokes: { ...previous.strokes, [key]: { ...previous.strokes[key], [property]: value } },
  }));
  const updatePalette = (name, value) => onChange((previous) => ({
    ...previous,
    palette: { ...previous.palette, [name]: value },
  }));

  async function downloadSvg() {
    if (isExporting || !onExport) return;
    const attempt = ++exportAttemptRef.current;
    setIsExporting(true);
    setExportMessage('Preparing SVG…');
    try {
      await onExport();
      if (attempt === exportAttemptRef.current) setExportMessage('SVG downloaded.');
    } catch {
      if (attempt === exportAttemptRef.current) setExportMessage('The SVG could not be downloaded. Please try again.');
    } finally {
      if (attempt === exportAttemptRef.current) setIsExporting(false);
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        className="wheel-settings-trigger"
        type="button"
        hidden={isOpen}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => {
          if (isOpen) closePanel();
          else { setExportMessage(''); setIsOpen(true); }
        }}
      >Wheel settings</button>

      {isOpen && (
        <aside className="wheel-settings-panel" id={panelId} aria-labelledby={titleId}>
          <header className="wheel-settings-header">
            <h2 id={titleId}>Wheel settings</h2>
            <button ref={closeRef} className="wheel-settings-close" type="button" onClick={closePanel}>Close</button>
          </header>

          <div className="wheel-settings-body">
            <details className="wheel-settings-section" open>
              <summary>Lines</summary>
              <div className="wheel-settings-section-content">
                {STROKE_CONTROLS.map(({ key, label }) => (
                  <div className="wheel-settings-stroke" key={key}>
                    <div className="wheel-settings-stroke-heading">
                      <h3>{label}</h3>
                      <ColorControl compact label={`${label} color`} value={settings.strokes[key].color} onChange={(value) => updateStroke(key, 'color', value)} />
                    </div>
                    <div className="wheel-settings-stroke-controls">
                      <RangeControl label="Width" accessibleLabel={`${label} width`} value={settings.strokes[key].width} min={0} max={32} step={0.5} onChange={(value) => updateStroke(key, 'width', value)} />
                      <RangeControl label="Opacity" accessibleLabel={`${label} opacity`} value={settings.strokes[key].opacity} min={0} max={1} format={percent} onChange={(value) => updateStroke(key, 'opacity', value)} />
                    </div>
                  </div>
                ))}
              </div>
            </details>

            <details className="wheel-settings-section">
              <summary>Color &amp; contrast</summary>
              <div className="wheel-settings-section-content">
                <h3 className="wheel-settings-subheading">Emotion families</h3>
                <div className="wheel-settings-palette">
                  {FAMILY_NAMES.map((name) => <ColorControl key={name} label={name} value={settings.palette[name]} onChange={(value) => updatePalette(name, value)} />)}
                </div>
                <div className="wheel-settings-control-group">
                  <RangeControl label="Saturation" value={settings.saturation} min={0} max={2} format={percent} onChange={(value) => update('saturation', value)} />
                  <RangeControl label="Contrast" value={settings.contrast} min={0.5} max={1.8} format={percent} onChange={(value) => update('contrast', value)} />
                  <RangeControl label="Brightness" value={settings.brightness} min={0.65} max={1.3} format={percent} onChange={(value) => update('brightness', value)} />
                </div>
                <div className="wheel-settings-control-group">
                  <ColorControl label="Text color" value={settings.labelColor} onChange={(value) => update('labelColor', value)} />
                  <RangeControl label="Text size" value={settings.labelSize} min={24} max={64} step={1} onChange={(value) => update('labelSize', value)} />
                  <ColorControl label="Center fill" value={settings.hubFill} onChange={(value) => update('hubFill', value)} />
                </div>
              </div>
            </details>

            <details className="wheel-settings-section">
              <summary>Hover focus</summary>
              <div className="wheel-settings-section-content">
                <label className="wheel-settings-checkbox">
                  <input type="checkbox" checked={settings.focusEnabled} onChange={(event) => {
                    const enabled = event.target.checked;
                    update('focusEnabled', enabled);
                    if (!enabled) onPreviewFocusChange(false);
                  }} />
                  <span>Fade other branches on hover</span>
                </label>
                <RangeControl label="Other branches opacity" value={settings.mutedOpacity} min={0.05} max={1} format={percent} disabled={!settings.focusEnabled} onChange={(value) => update('mutedOpacity', value)} />
                <RangeControl label="Fade duration" value={settings.fadeDuration} min={0} max={400} step={10} format={(value) => `${value} ms`} disabled={!settings.focusEnabled} onChange={(value) => update('fadeDuration', value)} />
                <label className="wheel-settings-checkbox wheel-settings-preview">
                  <input type="checkbox" checked={previewFocus} disabled={!settings.focusEnabled} onChange={(event) => onPreviewFocusChange(event.target.checked)} />
                  <span>Preview hover effect</span>
                </label>
                <p className="wheel-settings-help">Keep the selected branch in focus while you adjust these settings.</p>
              </div>
            </details>
          </div>

          <footer className="wheel-settings-footer">
            <div className="wheel-settings-actions">
              <button className="wheel-settings-reset" type="button" onClick={() => { onReset(); onPreviewFocusChange(false); setExportMessage('Settings reset.'); }}>Reset all</button>
              <button className="wheel-settings-download" type="button" onClick={downloadSvg} disabled={isExporting || !onExport}>{isExporting ? 'Preparing…' : 'Download SVG'}</button>
            </div>
            <p className="wheel-settings-status" role="status" aria-live="polite" aria-atomic="true">{exportMessage}</p>
          </footer>
        </aside>
      )}
    </>
  );
}
