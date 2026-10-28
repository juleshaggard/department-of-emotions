import { useCallback, useEffect, useId, useMemo, useReducer, useRef, useState } from 'react';
import { explorerSectors as sectors, families } from './explorer-data.js';
import { useWheelMotion } from './useWheelMotion.js';
import { InteractiveWheel } from './InteractiveWheel.jsx';
import { EmotionDrawer } from './EmotionDrawer.jsx';
import { useWheelSettings } from './useWheelSettings.js';
import { colorForSector } from './wheel-settings.js';
import { createWheelSelection, focusedSelectionIndex, isTouchInput, wheelSelectionReducer } from './wheel-selection.js';
import { pickRandomEmotion } from './wheel-spin.js';
import './explorer.css';

const initialIndex = families.find(({ name }) => name === 'Joy').index;
// Keep this in sync with the drawer layout media query in explorer.css.
const mobileQuery = '(max-width: 600px), (max-width: 1100px) and (orientation: portrait)';

function useMobileLayout() {
  const [mobile, setMobile] = useState(() => window.matchMedia(mobileQuery).matches);
  useEffect(() => {
    const query = window.matchMedia(mobileQuery);
    const update = (event) => setMobile(event.matches);
    setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return mobile;
}

function ExperienceSection({ title, items }) {
  const headingId = useId();
  return (
    <section className="experience-section" aria-labelledby={headingId}>
      <h2 className="section-kicker" id={headingId}>{title}</h2>
      <ol>
        {items.map((item, index) => <li key={index}><span className="cue-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><p>{item}</p></li>)}
      </ol>
    </section>
  );
}
function EmotionDetails({ active, familyColor }) {
  const hierarchy = [
    active.primary.name,
    ...(active.parent ? [active.parent.name] : []),
    ...(active.ring > 0 ? [active.name] : []),
  ];

  return (
    <div className="emotion-reading" id="emotion-details" role="region" aria-labelledby="emotion-name">
      <div className="emotion-summary">
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
      </div>

      <ExperienceSection title="How it may feel in the body" items={active.info.somaticExperiences} />
      <ExperienceSection title="Possible body language & behaviors" items={active.info.responses} />
    </div>
  );
}

function FamilyNavigation({ activeFamily, colors, onChoose }) {
  return (
    <nav className="family-navigation" aria-label="Jump to an emotion family">
      {families.map((family) => <button key={family.name} type="button" aria-pressed={activeFamily === family.name} onClick={(event) => onChoose(family, event)}><span className="family-swatch" style={{ backgroundColor: colors[family.name] }} />{family.name}</button>)}
    </nav>
  );
}

export default function EmotionExplorer() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Department of Emotions';
    return () => { document.title = previousTitle; };
  }, []);
  const [selection, dispatchSelection] = useReducer(wheelSelectionReducer, initialIndex, createWheelSelection);
  const isMobile = useMobileLayout();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const returnFocusRef = useRef(null);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  useEffect(() => { if (!isMobile) setDrawerOpen(false); }, [isMobile]);
  const { activeIndex } = selection;
  const { settings } = useWheelSettings();
  const rotorRef = useRef(null);
  const spinButtonRef = useRef(null);
  const sectorRefs = useRef([]);
  const familyColors = useMemo(() => Object.fromEntries(families.map((family) => [family.name, colorForSector(family, settings)])), [settings]);
  const clearFocus = useCallback(() => dispatchSelection({ type: 'clear-transient' }), []);
  const activate = useCallback((index, touch = false) => {
    dispatchSelection({ type: 'select', index, touch: isMobile || touch });
    if (isMobile) {
      returnFocusRef.current = sectorRefs.current[index];
      setDrawerOpen(true);
    }
  }, [isMobile]);
  const activateRef = useRef(activate);
  activateRef.current = activate;
  const onTap = useCallback((event) => {
    const index = event.target.closest?.('[data-sector-index]')?.getAttribute('data-sector-index');
    if (index != null) {
      activate(Number(index), isTouchInput(event));
    }
  }, [activate]);
  const { isMoving, isDragging, stop, rotateTo, spin } = useWheelMotion({ rotorRef, onTap, onDragStart: clearFocus });

  function spinWheel() {
    const result = pickRandomEmotion(sectors);
    clearFocus();
    spin(-(result.start + result.end) / 2, () => {
      activateRef.current(result.index, true);
      returnFocusRef.current = spinButtonRef.current;
    });
  }

  function choose(index) {
    stop();
    dispatchSelection({ type: 'select', index });
  }

  function chooseFamily(family, event) {
    dispatchSelection({ type: 'select', index: family.index, family: true, touch: isTouchInput(event, window.matchMedia('(pointer: coarse)').matches) });
    rotateTo(-(family.start + family.end) / 2);
  }

  function preview(index, fromKeyboard = false, event) {
    if (fromKeyboard) {
      if (selection.committedIndex !== index) choose(index);
    }
    else if (!isMoving && !isDragging) {
      dispatchSelection({ type: 'preview', index, touch: isTouchInput(event) });
    }
  }

  function handleSectorKey(event, index) {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % sectors.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + sectors.length - 1) % sectors.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = sectors.length - 1;
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); stop(); activate(index); return; }
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
                <InteractiveWheel rotorRef={rotorRef} activeIndex={activeIndex} focusIndex={focusedSelectionIndex(selection, { enabled: settings.focusEnabled && !isMobile, moving: isMoving || isDragging })} onClearFocus={clearFocus} onPreview={preview} onKeyDown={handleSectorKey} sectorRefs={sectorRefs} settings={settings} mobileDrawer={isMobile} drawerOpen={drawerOpen} />
                <button ref={spinButtonRef} className="wheel-spin-button" type="button" aria-label="Spin the wheel" title="Spin the wheel" aria-controls={isMobile ? 'emotion-drawer' : 'emotion-details'} aria-haspopup={isMobile ? 'dialog' : undefined} onClick={spinWheel} onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); stop(); } }}>
                  <img src={`${import.meta.env.BASE_URL}icons/rotate-cw.svg`} alt="" width="20" height="20" />
                </button>
              </div>
            </section>
          </div>

          {!isMobile && <aside className="emotion-sidebar" aria-label="Explore an emotion">
            <div className="sidebar-shell">
              <div className="sidebar-brand"><img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width="28" height="28" /><span>Department of Emotions</span></div>
              <EmotionDetails active={active} familyColor={familyColors[active.primary.name]} />
              <FamilyNavigation activeFamily={active.primary.name} colors={familyColors} onChoose={chooseFamily} />
            </div>
          </aside>}
        </div>
      </main>
      <footer className="explorer-footer"><a href="https://www.haggard.design/" target="_blank" rel="noreferrer">Site created by Jules</a></footer>
      {isMobile && <EmotionDrawer open={drawerOpen} onClose={closeDrawer} returnFocusRef={returnFocusRef}><EmotionDetails active={active} familyColor={familyColors[active.primary.name]} /></EmotionDrawer>}
    </div>
  );
}
