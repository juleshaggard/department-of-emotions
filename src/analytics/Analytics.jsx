import { useEffect } from 'react';
import { getAnalyticsController } from './analytics.js';
import './analytics.css';

export function Analytics() {
  useEffect(() => { getAnalyticsController().start(); }, []);
  return <a className="privacy-link" href={`${import.meta.env.BASE_URL}privacy/`}>Privacy</a>;
}
