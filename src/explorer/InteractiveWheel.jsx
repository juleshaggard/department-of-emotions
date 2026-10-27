import { useMemo } from 'react';
import { annularSector, WHEEL } from '../wheel.js';
import { explorerSectors as sectors, families, isInFocusedBranch } from './explorer-data.js';
import { colorForSector } from './wheel-settings.js';

const ringNames = ['Core emotion', 'Secondary emotion', 'Specific feeling'];
const radiusPoint = (radius, angle) => ({
  x: WHEEL.center + radius * Math.cos(angle * Math.PI / 180),
  y: WHEEL.center + radius * Math.sin(angle * Math.PI / 180),
});

// Family boundaries have their own layer, so ordinary lines never show through.
const sectorLines = sectors.filter((sector) => sector.ring > 0
  && !families.some((family) => Math.abs(family.start - sector.start) < 1e-7));

function RadialLine({ start, inner, outer }) {
  const a = radiusPoint(inner, start);
  const b = radiusPoint(outer, start);
  return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
}

export function InteractiveWheel({ rotorRef, svgRef, activeIndex, focusIndex, onClearFocus, onPreview, onKeyDown, sectorRefs, settings }) {
  const active = sectors[activeIndex];
  const focused = focusIndex == null ? null : sectors[focusIndex];
  const colors = useMemo(() => sectors.map((sector) => colorForSector(sector, settings)), [settings]);
  const padding = Math.max(8, Math.ceil(Math.max(...Object.values(settings.strokes).map(({ width }) => width)) / 2 + 2));
  const extent = WHEEL.width + padding * 2;

  function strokeStyle(key) {
    const stroke = settings.strokes[key];
    return {
      stroke: stroke.color,
      strokeWidth: stroke.width,
      strokeLinejoin: 'round',
      opacity: stroke.opacity * (focused && key !== 'hover' ? settings.mutedOpacity : 1),
      fill: 'none',
      pointerEvents: 'none',
    };
  }

  return (
    <div className="wheel-rotor" ref={rotorRef} data-testid="spinning-wheel" onPointerLeave={onClearFocus} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) onClearFocus(); }}>
      <svg
        ref={svgRef}
        className={`interactive-wheel${focused ? ' has-focus' : ''}`}
        viewBox={`${-padding} ${-padding} ${extent} ${extent}`}
        style={{ '--wheel-muted-opacity': settings.mutedOpacity, '--wheel-fade-duration': `${settings.fadeDuration}ms` }}
        role="group"
        aria-label="Emotion wheel. Drag or flick to spin. Use left and right arrow keys to explore feelings. Press Escape to stop."
      >
        {sectors.map((sector, index) => {
          const angle = (sector.start + sector.end) / 2;
          const radius = (WHEEL.radii[sector.ring] + WHEEL.radii[sector.ring + 1]) / 2;
          return (
            <g
              key={index}
              ref={(element) => { sectorRefs.current[index] = element; }}
              className={`explorer-sector${index === activeIndex ? ' is-active' : ''}${focused && !isInFocusedBranch(sector, focused) ? ' is-muted' : ''}`}
              role="button"
              tabIndex={index === activeIndex ? 0 : -1}
              aria-label={`${sector.name}, ${ringNames[sector.ring].toLowerCase()}. ${sector.info.definition}`}
              aria-pressed={index === activeIndex}
              aria-controls="emotion-details"
              data-sector-index={index}
              data-emotion={sector.name}
              onPointerEnter={() => onPreview(index)}
              onPointerMove={() => onPreview(index)}
              onFocus={() => onPreview(index, true)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <path className="sector-fill" style={{ fill: colors[index], stroke: 'none' }} d={annularSector(WHEEL.radii[sector.ring], WHEEL.radii[sector.ring + 1], sector.start, sector.end)} />
              <text
                className="explorer-label"
                style={{ fontFamily: 'Calibri, Carlito, Arial, sans-serif', fontSize: settings.labelSize, fontWeight: 400, fill: settings.labelColor, pointerEvents: 'none' }}
                transform={`translate(${WHEEL.center} ${WHEEL.center}) rotate(${angle}) translate(${radius} 0)`}
                textAnchor="middle"
                dominantBaseline="central"
                aria-hidden="true"
              >{sector.name}</text>
            </g>
          );
        })}

        <g className="wheel-strokes sector-separators" data-stroke-key="sectors" style={strokeStyle('sectors')} aria-hidden="true">
          {sectorLines.map((sector) => <RadialLine key={sector.index} start={sector.start} inner={WHEEL.radii[sector.ring]} outer={WHEEL.radii[sector.ring + 1]} />)}
        </g>
        <g className="wheel-strokes ring-boundaries" data-stroke-key="rings" style={strokeStyle('rings')} aria-hidden="true">
          {WHEEL.radii.slice(1, -1).map((radius) => <circle key={radius} cx={WHEEL.center} cy={WHEEL.center} r={radius} />)}
        </g>
        <g className="wheel-strokes explorer-dividers" data-stroke-key="primary" style={strokeStyle('primary')} aria-hidden="true">
          {families.map((family) => <RadialLine key={family.name} start={family.start} inner={WHEEL.radii[0]} outer={WHEEL.radii.at(-1)} />)}
        </g>
        <circle className="wheel-strokes outer-border" data-stroke-key="outer" cx={WHEEL.center} cy={WHEEL.center} r={WHEEL.radii.at(-1)} style={strokeStyle('outer')} aria-hidden="true" />
        <circle cx={WHEEL.center} cy={WHEEL.center} r={WHEEL.radii[0]} fill={settings.hubFill} style={{ pointerEvents: 'none' }} aria-hidden="true" />
        <circle className="wheel-strokes hub-border" data-stroke-key="hub" cx={WHEEL.center} cy={WHEEL.center} r={WHEEL.radii[0]} style={strokeStyle('hub')} aria-hidden="true" />
        <path className="selected-outline" data-stroke-key="hover" d={annularSector(WHEEL.radii[active.ring], WHEEL.radii[active.ring + 1], active.start, active.end)} style={strokeStyle('hover')} aria-hidden="true" />
      </svg>
    </div>
  );
}
