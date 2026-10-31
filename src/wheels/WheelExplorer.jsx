import { useCallback, useEffect, useId, useMemo, useReducer, useRef, useState } from 'react';
import { useWheelMotion } from '../explorer/useWheelMotion.js';
import { DraftWheel } from './DraftWheel.jsx';
import { EmotionDrawer } from '../explorer/EmotionDrawer.jsx';
import { useWheelSettings } from '../explorer/useWheelSettings.js';
import { colorForSector } from '../explorer/wheel-settings.js';
import { createWheelSelection, focusedSelectionIndex, isTouchInput, wheelSelectionReducer } from '../explorer/wheel-selection.js';
import '../explorer/explorer.css';

// Keep these in sync with the responsive layout queries in explorer.css.
const drawerQuery = '(max-width: 1100px) and (orientation: portrait)';
const landscapePhoneQuery = '(max-width: 1023px) and (orientation: landscape)';

export function useResponsiveLayout() {
  const [layout, setLayout] = useState(() => ({
    isDrawerLayout: window.matchMedia(drawerQuery).matches,
    isLandscapePhone: window.matchMedia(landscapePhoneQuery).matches,
  }));
  useEffect(() => {
    const drawer = window.matchMedia(drawerQuery);
    const landscapePhone = window.matchMedia(landscapePhoneQuery);
    const update = () => setLayout({
      isDrawerLayout: drawer.matches,
      isLandscapePhone: landscapePhone.matches,
    });
    update();
    drawer.addEventListener('change', update);
    landscapePhone.addEventListener('change', update);
    return () => {
      drawer.removeEventListener('change', update);
      landscapePhone.removeEventListener('change', update);
    };
  }, []);
  return layout;
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
function EmotionHierarchy({ active, familyColor }) {
  const hierarchy = [
    active.primary.name,
    ...(active.parent ? [active.parent.name] : []),
    ...(active.ring > 0 ? [active.name] : []),
  ];

  return (
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
  );
}

function EmotionDetails({ active, familyColor, hierarchyAfter = false }) {
  return (
    <div className="emotion-reading" id="emotion-details" role="region" aria-labelledby="emotion-name">
      <div className="emotion-summary">
        {!hierarchyAfter && <EmotionHierarchy active={active} familyColor={familyColor} />}
        <h1 id="emotion-name">{active.name}</h1>
        <p className="emotion-definition">{active.info.definition}</p>
      </div>

      {(active.info.sections || [{ title: 'How it may feel in the body', items: active.info.somaticExperiences }, { title: 'Possible body language & behaviors', items: active.info.responses }]).map(section => <ExperienceSection key={section.title} title={section.title} items={section.items} />)}
      {hierarchyAfter && <EmotionHierarchy active={active} familyColor={familyColor} />}
    </div>
  );
}

function WheelAttribution({ model, compact = false }) {
  return (
    <div className="sidebar-attribution">
      <p className="lab-source">Wheel reference: <a href={model.sourceUrl} target="_blank" rel="noreferrer">{model.source}</a></p>
      <a className="sidebar-credit" href="https://darlingjules.com/" target="_blank" rel="noreferrer">
        {compact ? 'Site by Jules' : 'Site created by Jules'}
        <svg className="credit-trans-flag" viewBox="0 0 20 12" role="img" aria-label="Transgender pride flag">
          <path fill="#5BCEFA" d="M0 0h20v12H0z" />
          <path fill="#F5A9B8" d="M0 2.4h20v7.2H0z" />
          <path fill="#FFFFFF" d="M0 4.8h20v2.4H0z" />
        </svg>
      </a>
    </div>
  );
}

export default function WheelExplorer({ model, switcher, layout }) {
  const { sectors, families } = model;
  const initialFamily = families.find(family => family.name === model.initialName) || families[0];
  const initialIndex = initialFamily.index;
  const initialRotation = -(initialFamily.start + initialFamily.end) / 2;
  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Department of Emotions';
    return () => { document.title = previousTitle; };
  }, []);
  const [selection, dispatchSelection] = useReducer(wheelSelectionReducer, initialIndex, createWheelSelection);
  const { isDrawerLayout, isLandscapePhone } = layout;
  const isTouchLayout = isDrawerLayout || isLandscapePhone;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const returnFocusRef = useRef(null);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  useEffect(() => { if (!isDrawerLayout) setDrawerOpen(false); }, [isDrawerLayout]);
  const { activeIndex } = selection;
  const { settings } = useWheelSettings();
  const rotorRef = useRef(null);
  const sidebarRef = useRef(null);
  const sectorRefs = useRef([]);
  useEffect(() => {
    if (isLandscapePhone && sidebarRef.current) sidebarRef.current.scrollTop = 0;
  }, [activeIndex, isLandscapePhone]);
  const familyColors = useMemo(() => Object.fromEntries(families.map((family) => [family.name, model.original ? colorForSector(family, settings) : family.color])), [model, settings]);
  const clearFocus = useCallback(() => dispatchSelection({ type: 'clear-transient' }), []);
  const activate = useCallback((index, touch = false) => {
    dispatchSelection({ type: 'select', index, touch: isTouchLayout || touch });
    if (isDrawerLayout) {
      returnFocusRef.current = sectorRefs.current[index];
      setDrawerOpen(true);
    }
  }, [isDrawerLayout, isTouchLayout]);
  const onTap = useCallback((event) => {
    const index = event.target.closest?.('[data-sector-index]')?.getAttribute('data-sector-index');
    if (index != null) {
      activate(Number(index), isTouchInput(event));
    }
  }, [activate]);
  const { isMoving, isDragging, stop } = useWheelMotion({ rotorRef, onTap, onDragStart: clearFocus, initialRotation });

  function choose(index) {
    stop();
    dispatchSelection({ type: 'select', index });
  }

  function preview(index, fromKeyboard = false, event) {
    if (fromKeyboard) {
      if (selection.committedIndex !== index) choose(index);
    }
    else if (!isTouchLayout && !isMoving && !isDragging) {
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
      {isDrawerLayout && switcher}
      <main className="explorer-main" id="explorer-main">
        <div className="explorer-layout">
          <div className="wheel-column">
            <section className="wheel-workspace" aria-label="Interactive emotion wheel">
              <div className="wheel-stage" data-moving={isMoving || isDragging}>
                <DraftWheel model={model} rotorRef={rotorRef} activeIndex={activeIndex} focusIndex={focusedSelectionIndex(selection, { enabled: settings.focusEnabled && !isTouchLayout, moving: isMoving || isDragging })} onClearFocus={clearFocus} onPreview={preview} onKeyDown={handleSectorKey} sectorRefs={sectorRefs} settings={settings} mobileDrawer={isDrawerLayout} drawerOpen={drawerOpen} />
              </div>
            </section>
          </div>

          {!isDrawerLayout && <aside ref={sidebarRef} className="emotion-sidebar" aria-label="Explore an emotion" tabIndex={isLandscapePhone ? 0 : undefined}>
            <div className="sidebar-shell">
              {switcher}
              <EmotionDetails active={active} familyColor={familyColors[active.primary.name]} hierarchyAfter />
              <footer className="sidebar-footer">
                <WheelAttribution model={model} />
                <div className="sidebar-brand"><img src={`${import.meta.env.BASE_URL}brand/department-of-emotions.svg`} alt="" width="21" height="21" /><span>Department of Emotions</span></div>
              </footer>
            </div>
          </aside>}
        </div>
      </main>
      {isDrawerLayout && <EmotionDrawer open={drawerOpen} onClose={closeDrawer} returnFocusRef={returnFocusRef}><EmotionDetails active={active} familyColor={familyColors[active.primary.name]} /><WheelAttribution model={model} compact /></EmotionDrawer>}
    </div>
  );
}
