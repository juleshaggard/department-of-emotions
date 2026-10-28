import './analytics.css';

export function PrivacyPage() {
  const base = import.meta.env.BASE_URL;
  return <main className="privacy-page">
    <a className="privacy-brand" href={base}><img src={`${base}brand/department-of-emotions.svg`} alt="" width="21" height="21" /><span>Department of Emotions</span></a>
    <h1>Privacy</h1>
    <p>Department of Emotions is an independent project by Jules Haggard.</p>
    <h2>Limited website analytics</h2>
    <p>We use Google Analytics for basic, cookieless traffic measurement on departmentofemotions.com. Analytics and advertising storage stay denied. We don’t set Analytics cookies or save Analytics identifiers in your browser. Old Analytics cookies from the previous opt-in setup are removed.</p>
    <p>Google receives limited page-view measurements and technical request information, such as network and device information, to support aggregate measurement and modelling. This is less detailed than standard cookie-based Analytics.</p>
    <p>Emotion selections and wheel interactions aren’t tracked. We don’t send custom user IDs, URL query strings, URL fragments, or referring websites’ full paths. Advertising signals and enhanced interaction measurement are off.</p>
    <h2>Privacy preferences</h2>
    <p>Google Analytics stays unloaded when your browser sends Global Privacy Control or when you previously declined Analytics in this browser. A previous opt-in doesn’t enable cookies: all storage remains denied.</p>
    <p>Wheel appearance preferences are saved locally in your browser and aren’t sent to Google. Local previews, GitHub Pages, the privacy page, and the static wheel page don’t load Analytics.</p>
    <p><a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noreferrer">How Google uses information from sites using its services ↗</a></p>
    <p>Questions? <a href="https://www.juleshaggard.com/" target="_blank" rel="noreferrer">Contact Jules ↗</a></p>
    <a className="privacy-back" href={base}>← Back to the wheel</a>
  </main>;
}
