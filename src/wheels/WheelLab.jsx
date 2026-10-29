import { useLayoutEffect, useRef, useState } from 'react';
import { wheelModels } from './wheel-models.js';
import WheelExplorer, { useResponsiveLayout } from './WheelExplorer.jsx';
import './wheel-lab.css';

export default function WheelLab() {
  const [selected, setSelected] = useState(0);
  const layout = useResponsiveLayout();
  const tabs = useRef([]);
  const focusTab = useRef(false);
  useLayoutEffect(() => {
    if (focusTab.current) {
      tabs.current[selected]?.focus({ preventScroll: true });
      focusTab.current = false;
    }
  }, [selected]);
  function select(index) {
    focusTab.current = true;
    setSelected(index);
  }
  function move(event, index) {
    let next;
    if (event.key === (layout.isDrawerLayout ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % wheelModels.length;
    else if (event.key === (layout.isDrawerLayout ? 'ArrowUp' : 'ArrowLeft')) next = (index + wheelModels.length - 1) % wheelModels.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = wheelModels.length - 1;
    else return;
    event.preventDefault();
    select(next);
  }
  const model = wheelModels[selected];
  const switcher = <nav className="lab-switcher" aria-label="Choose a wheel"><div role="tablist" aria-label="Wheel type" aria-orientation={layout.isDrawerLayout ? 'vertical' : 'horizontal'}>
    {wheelModels.map((wheel,index)=><button key={wheel.id} ref={el=>{tabs.current[index]=el;}} id={`wheel-tab-${wheel.id}`} role="tab" aria-selected={selected===index} aria-controls="wheel-lab-panel" tabIndex={selected===index?0:-1} onClick={()=>select(index)} onKeyDown={event=>move(event,index)}>{wheel.label}</button>)}
  </div></nav>;
  return <div className="wheel-lab" data-wheel={model.id}>
    <section id="wheel-lab-panel" role="tabpanel" aria-labelledby={`wheel-tab-${model.id}`}><WheelExplorer key={model.id} model={model} switcher={switcher} layout={layout}/></section>
  </div>;
}
