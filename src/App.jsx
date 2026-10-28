import { lazy, Suspense } from 'react';
import { createEmotionWheelSvg } from './wheel.js';
import palette from './reference-palette.json';
import { Analytics } from './analytics/Analytics.jsx';
import { PrivacyPage } from './analytics/PrivacyPage.jsx';

const wheel = createEmotionWheelSvg({ palette });
const EmotionExplorer = lazy(() => import('./explorer/EmotionExplorer.jsx'));

export function App() {
  const base = import.meta.env.BASE_URL;
  const pathname = window.location.pathname;
  const route = pathname.startsWith(base) ? `/${pathname.slice(base.length)}` : pathname;
  if (route.replace(/\/$/, '') === '/privacy') return <PrivacyPage />;
  if (route.replace(/\/$/, '') !== '/wheel') {
    return <><Suspense fallback={<main className="explorer-loading">Opening the emotion explorer…</main>}><EmotionExplorer /></Suspense><Analytics /></>;
  }
  return <main className="wheel-sheet" dangerouslySetInnerHTML={{ __html: wheel }} />;
}
