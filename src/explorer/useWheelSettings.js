import { useCallback, useEffect, useState } from 'react';
import { normalizeWheelSettings } from './wheel-settings.js';

const STORAGE_KEY = 'emotion-wheel:appearance:v1';

function readSettings() {
  try {
    return normalizeWheelSettings(JSON.parse(window.localStorage.getItem(STORAGE_KEY)));
  } catch {
    return normalizeWheelSettings(null);
  }
}

export function useWheelSettings() {
  const [settings, setStoredSettings] = useState(readSettings);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Editing still works when browser storage is unavailable.
    }
  }, [settings]);

  const setSettings = useCallback((update) => {
    setStoredSettings((current) => normalizeWheelSettings(
      typeof update === 'function' ? update(current) : update,
    ));
  }, []);

  const resetSettings = useCallback(() => {
    setStoredSettings(normalizeWheelSettings(null));
  }, []);

  return { settings, setSettings, resetSettings };
}
