import { useEffect } from 'react';
import { getAnalyticsController } from './analytics.js';

export function Analytics() {
  useEffect(() => { getAnalyticsController().start(); }, []);
  return null;
}
