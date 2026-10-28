import { useMemo } from 'react';
import { annularSector, WHEEL } from '../wheel.js';
import { isInFocusedBranch } from '../explorer/explorer-data.js';
import { colorForSector } from '../explorer/wheel-settings.js';

function splitLabel(text, limit) {
  const words = text.split(' '), lines = [];
  for (const word of words) {
    if (!lines.length || `${lines.at(-1)} ${word}`.length > limit) lines.push(word);
    else lines[lines.length - 1] += ` ${word}`;
  }
  return lines;
}
const point = (r, a) => ({ x: WHEEL.center + r * Math.cos(a * Math.PI / 180), y: WHEEL.center + r * Math.sin(a * Math.PI / 180) });
function petal(inner, outer, start, end) {
  const p = (r, a) => { const v = point(r, a); return `${v.x} ${v.y}`; };
  const inset = Math.min(.9, (end - start) * .12);
  return `M ${p(outer - 24, start)} Q ${p(outer, start)} ${p(outer, start + inset)} A ${outer} ${outer} 0 0 1 ${p(outer, end - inset)} Q ${p(outer, end)} ${p(outer - 24, end)} L ${p(inner, end)} A ${inner} ${inner} 0 0 0 ${p(inner, start)} Z`;
}
function line(start, inner, outer) {
  const a=point(inner,start), b=point(outer,start);
  return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
}
export function DraftWheel({ model, rotorRef, activeIndex, focusIndex, onClearFocus, onPreview, onKeyDown, sectorRefs, settings, mobileDrawer, drawerOpen }) {
  const { sectors, families, radii } = model;
  const active=sectors[activeIndex], focused=focusIndex == null ? null : sectors[focusIndex];
  const colors=useMemo(()=>sectors.map(s=>model.original ? colorForSector(s,settings) : s.color),[model,settings]);
  const padding=14, extent=WHEEL.width+padding*2;
  const path = s => model.petals && s.ring === 2 ? petal(radii[s.ring],radii[s.ring+1],s.start,s.end) : annularSector(radii[s.ring],radii[s.ring+1],s.start,s.end);
  const ringNames=model.id==='situations' ? ['Situation','Feeling'] : ['Core emotion','Emotion',model.id==='sensations'?'Body sensation':model.id==='behaviors'?'Behavior':'Specific feeling'];
  const strokeStyle=key=>({stroke:settings.strokes[key].color,strokeWidth:settings.strokes[key].width,opacity:settings.strokes[key].opacity*(focused?settings.mutedOpacity:1),fill:'none',pointerEvents:'none'});
  return <div className="wheel-rotor" ref={rotorRef} onPointerLeave={onClearFocus} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))onClearFocus();}}>
    <svg className={`interactive-wheel${focused?' has-focus':''}`} viewBox={`${-padding} ${-padding} ${extent} ${extent}`} style={{'--wheel-muted-opacity':settings.mutedOpacity,'--wheel-fade-duration':`${settings.fadeDuration}ms`}} role="group" aria-label={`${model.label} wheel. Drag or flick to spin. Use arrow keys to explore. Press Escape to stop.`}>
      {sectors.map((s,index)=>{
        const angle=(s.start+s.end)/2, radius=(radii[s.ring]+radii[s.ring+1])/2;
        const lines=model.original ? [s.name] : splitLabel(s.name,model.id==='situations' ? (s.ring===0?17:19) : model.id==='behaviors'&&s.ring===2?20:24);
        const size=model.original ? settings.labelSize : model.id==='situations' ? (s.ring===0?42:38) : s.ring===0?35:38;
        const leading=size*1.13;
        return <g key={index} ref={el=>{sectorRefs.current[index]=el;}} className={`explorer-sector${index===activeIndex?' is-active':''}${focused&&!isInFocusedBranch(s,focused)?' is-muted':''}`} role="button" tabIndex={index===activeIndex?0:-1} aria-label={`${s.name}, ${ringNames[s.ring].toLowerCase()}. ${s.info.definition}`} aria-pressed={index===activeIndex} aria-controls={mobileDrawer?'emotion-drawer':'emotion-details'} aria-haspopup={mobileDrawer?'dialog':undefined} aria-expanded={mobileDrawer?drawerOpen&&index===activeIndex:undefined} data-sector-index={index} data-emotion={s.name} onPointerEnter={e=>onPreview(index,false,e)} onPointerMove={e=>onPreview(index,false,e)} onFocus={e=>{if(e.currentTarget.matches(':focus-visible'))onPreview(index,true);}} onKeyDown={e=>onKeyDown(e,index)}>
          <path d={path(s)} fill={colors[index]} stroke={model.original?'none':model.stroke} strokeWidth={model.strokeWidth||0} strokeLinejoin="round" />
          <text className="explorer-label" style={{fontSize:size,fill:settings.labelColor,pointerEvents:'none'}} transform={`translate(${WHEEL.center} ${WHEEL.center}) rotate(${angle}) translate(${radius} 0)`} textAnchor="middle" dominantBaseline="central" y={-(lines.length-1)*leading/2} aria-hidden="true">{lines.map((text,i)=><tspan key={i} x="0" dy={i?leading:0}>{text}</tspan>)}</text>
        </g>;
      })}
      {model.original && <g aria-hidden="true">
        <g style={strokeStyle('sectors')}>{sectors.filter(s=>s.ring>0&&!families.some(f=>Math.abs(f.start-s.start)<1e-7)).map(s=><g key={s.index}>{line(s.start,radii[s.ring],radii[s.ring+1])}</g>)}</g>
        <g style={strokeStyle('rings')}>{radii.slice(1,-1).map(r=><circle key={r} cx={WHEEL.center} cy={WHEEL.center} r={r}/>)}</g>
        <g style={strokeStyle('primary')}>{families.map(f=><g key={f.index}>{line(f.start,radii[0],radii.at(-1))}</g>)}</g>
        <circle cx={WHEEL.center} cy={WHEEL.center} r={radii.at(-1)} style={strokeStyle('outer')}/>
      </g>}
      <circle cx={WHEEL.center} cy={WHEEL.center} r={radii[0]} fill={settings.hubFill} pointerEvents="none" aria-hidden="true" />
      {model.original&&<circle cx={WHEEL.center} cy={WHEEL.center} r={radii[0]} style={strokeStyle('hub')} aria-hidden="true"/>}
      <path className="selected-outline" d={path(active)} fill="none" stroke={settings.strokes.hover.color} strokeWidth={settings.strokes.hover.width} strokeOpacity={settings.strokes.hover.opacity} pointerEvents="none" aria-hidden="true" />
    </svg>
  </div>;
}
