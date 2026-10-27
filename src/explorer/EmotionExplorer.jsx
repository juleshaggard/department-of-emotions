import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { explorerSectors as sectors, families } from './explorer-data.js';
import { useWheelMotion } from './useWheelMotion.js';
import { InteractiveWheel } from './InteractiveWheel.jsx';
import { WheelSettings } from './WheelSettings.jsx';
import { useWheelSettings } from './useWheelSettings.js';
import { colorForSector } from './wheel-settings.js';
import { downloadWheelSvg } from './download-wheel-svg.js';
import './explorer.css';

const initialIndex = families.find(({ name }) => name === 'Joy').index;

function ExperienceSection({ title, description, items }) {
  return (
    <details className="experience-section" open>
      <summary><h2>{title}</h2></summary>
      <p className="experience-description">{description}</p>
      <ol>
        {items.map((item, index) => <li key={index}><span className="cue-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><p>{item}</p></li>)}
      </ol>
    </details>
  );
}
function EmotionDetails({ active, familyColor }) {
  const hierarchy = [
    active.primary.name,
    ...(active.parent ? [active.parent.name] : []),
    ...(active.ring > 0 ? [active.name] : []),
  ];

  return (
    <aside className="emotion-sidebar" aria-label="Explore an emotion">
      <div className="emotion-reading" id="emotion-details" role="region" aria-labelledby="emotion-name">
        <nav className="emotion-family" aria-label="Emotion hierarchy">
          <span className="family-swatch" style={{ backgroundColor: familyColor }} aria-hidden="true" />
          <ol className="emotion-breadcrumbs">
            {hierarchy.map((name, index) => (
              <li key={index}>
                {index > 0 && <span className="breadcrumb-arrow" aria-hidden="true">→</span>}
                <span aria-current={index === hierarchy.length - 1 ? 'true' : undefined}>{name}</span>
              </li>
            ))}
          </ol>
        </nav>
        <h1 id="emotion-name">{active.name}</h1>
        <p className="emotion-definition">{active.info.definition}</p>

        <section className="body-language" aria-labelledby="body-language-heading">
          <p className="section-kicker" id="body-language-heading">Body language</p>
          <ol>
            {active.info.bodyLanguage.map((cue, index) => (
              <li key={index}><span className="cue-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><p>{cue}</p></li>
            ))}
          </ol>
        </section>

        <ExperienceSection title="How it feels in the body" description="Sensations you might notice inside your body." items={active.info.somaticExperiences} />
        <ExperienceSection title="How you might respond" description="Ways someone might act or respond." items={active.info.behavioralExperiences} />
      </div>
    </aside>
  );
}

export default function EmotionExplorer() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Department of Emotions';
    return () => { document.title = previousTitle; };
  }, []);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [focusIndex, setFocusIndex] = useState(null);
  const [previewFocus, setPreviewFocus] = useState(false);
  const { settings, setSettings, resetSettings } = useWheelSettings();
  const rotorRef = useRef(null);
  const svgRef = useRef(null);
  const sectorRefs = useRef([]);
  const familyColors = useMemo(() => Object.fromEntries(families.map((family) => [family.name, colorForSector(family, settings)])), [settings]);
  const exportSvg = useCallback(() => downloadWheelSvg(svgRef.current, settings), [settings]);
  const clearFocus = useCallback(() => setFocusIndex(null), []);
  const onTap = useCallback((event) => {
    const index = event.target.closest?.('[data-sector-index]')?.getAttribute('data-sector-index');
    if (index != null) {
      setActiveIndex(Number(index));
      setFocusIndex(Number(index));
    }
  }, []);
  const { isMoving, isDragging, stop, rotateTo, spin } = useWheelMotion({ rotorRef, onTap, onDragStart: clearFocus });

  function spinWheel() {
    clearFocus();
    setPreviewFocus(false);
    spin();
  }

  function choose(index) {
    stop();
    setActiveIndex(index);
    setFocusIndex(index);
  }

  function chooseFamily(family) {
    clearFocus();
    setActiveIndex(family.index);
    rotateTo(-(family.start + family.end) / 2);
  }

  function preview(index, fromKeyboard = false) {
    if (fromKeyboard) choose(index);
    else if (!isMoving && !isDragging) {
      setActiveIndex(index);
      setFocusIndex(index);
    }
  }

  function handleSectorKey(event, index) {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % sectors.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + sectors.length - 1) % sectors.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = sectors.length - 1;
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(index); return; }
    else if (event.key === 'Escape') { stop(); return; }
    else return;
    event.preventDefault();
    choose(next);
    sectorRefs.current[next]?.focus({ preventScroll: true });
  }

  const active = sectors[activeIndex];
  return (
    <div className="explorer-page">
      <a href="#explorer-main" className="skip-link">Skip to the emotion explorer</a>
      <main className="explorer-main" id="explorer-main">
        <div className="explorer-layout">
          <div className="wheel-column">
            <section className="wheel-workspace" aria-label="Interactive emotion wheel">
              <div className="wheel-stage" data-moving={isMoving || isDragging}>
                <InteractiveWheel rotorRef={rotorRef} svgRef={svgRef} activeIndex={activeIndex} focusIndex={!settings.focusEnabled || isMoving || isDragging ? null : previewFocus ? activeIndex : focusIndex} onClearFocus={clearFocus} onPreview={preview} onKeyDown={handleSectorKey} sectorRefs={sectorRefs} settings={settings} />
              </div>
              <div className="wheel-controls">
                <div className="family-navigation" aria-label="Jump to an emotion family">
                  {families.map((family) => <button key={family.name} type="button" aria-pressed={active.primary.name === family.name} onClick={() => chooseFamily(family)}><span className="family-swatch" style={{ backgroundColor: familyColors[family.name] }} />{family.name}</button>)}
                </div>
                <button className="wheel-spin-hint" type="button" onClick={spinWheel}>
                  <img src="/icons/rotate-cw.svg" alt="" width="14" height="14" />
                  Spin the wheel
                </button>
              </div>
            </section>
          </div>

          <EmotionDetails active={active} familyColor={familyColors[active.primary.name]} />
          <footer className="explorer-footer"><a href="https://www.haggard.design" target="_blank" rel="noreferrer">Created by Jules</a></footer>
        </div>
      </main>
      <WheelSettings settings={settings} onChange={setSettings} onReset={() => { resetSettings(); setPreviewFocus(false); }} onExport={exportSvg} previewFocus={previewFocus} onPreviewFocusChange={setPreviewFocus} />
    </div>
  );
}
