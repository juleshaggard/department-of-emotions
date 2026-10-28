import { useEffect, useRef, useState } from 'react';
import { getAnalyticsController } from './analytics.js';
import './analytics.css';

export function AnalyticsConsent() {
  const analytics = getAnalyticsController();
  const [choice, setChoice] = useState(() => analytics.readChoice());
  const dialogRef = useRef(null);
  const settingsRef = useRef(null);
  useEffect(() => { analytics.apply(choice); }, [analytics, choice]);
  function choose(value) { setChoice(analytics.choose(value)); }
  function close() { dialogRef.current.close(); settingsRef.current?.focus({ preventScroll: true }); }
  return <>
    {!choice && <section className="analytics-notice" aria-label="Analytics cookie choice">
      <p>Allow usage analytics? Google Analytics uses cookies to measure visits. Your emotion selections aren’t recorded. <button className="privacy-text-link" onClick={() => dialogRef.current.showModal()}>Privacy details</button></p>
      <div className="analytics-actions"><button onClick={() => choose('denied')}>Decline</button><button onClick={() => choose('granted')}>Allow analytics</button></div>
    </section>}
    <button ref={settingsRef} className="privacy-settings" onClick={() => dialogRef.current.showModal()}>Privacy &amp; cookies</button>
    <dialog ref={dialogRef} className="privacy-dialog" aria-labelledby="privacy-title" onClick={event => { if (event.target === dialogRef.current) { const b=event.currentTarget.getBoundingClientRect(); if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) close(); } }}>
      <div className="privacy-dialog-header"><h2 id="privacy-title">Privacy &amp; cookies</h2><button onClick={close} aria-label="Close privacy details">Close ×</button></div>
      <p>Department of Emotions is an independent project by Jules Haggard. The wheel works whether you allow analytics or decline.</p>
      <h3>Website analytics</h3>
      <p>With your permission, Google Analytics measures visits, page views, basic device information, and referring websites. Analytics cookies distinguish visits for up to 180 days. Google processes this information to provide traffic reports.</p>
      <p>We don’t send emotion selections, wheel interactions, custom user IDs, or URL query strings to Google Analytics. Advertising features and enhanced interaction measurement are turned off.</p>
      <h3>Your choice</h3>
      <p>Your choice is saved in this browser for 180 days. You can change it here at any time. Declining stops analytics and removes this site’s Analytics cookies. A Global Privacy Control signal keeps analytics off.</p>
      <p>Wheel appearance preferences are saved locally in your browser and aren’t sent to Google.</p>
      <p><a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">How Google uses information from sites using its services ↗</a></p>
      <p>Questions? <a href="https://www.juleshaggard.com/" target="_blank" rel="noreferrer">Contact Jules ↗</a></p>
      <p className="analytics-status" role="status">{analytics.blocked() ? 'Analytics is off: your browser sends a privacy signal.' : choice === 'granted' ? 'Analytics is currently on.' : 'Analytics is currently off.'}</p>
      <div className="analytics-actions"><button onClick={() => choose('denied')}>Decline analytics</button><button disabled={analytics.blocked()} onClick={() => choose('granted')}>Allow analytics</button></div>
    </dialog>
  </>;
}
