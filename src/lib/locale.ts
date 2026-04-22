import { useEffect, useState } from 'react';

export type Locale = 'zh' | 'en';

const LOCALE_KEY = 'tracewall-locale';
const LOCALE_EVENT = 'tracewall-locale-change';

function isLocale(value: string | null): value is Locale {
  return value === 'zh' || value === 'en';
}

export function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'zh';
  const value = window.localStorage.getItem(LOCALE_KEY);
  return isLocale(value) ? value : 'zh';
}

export function setStoredLocale(locale: Locale) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCALE_KEY, locale);
  window.dispatchEvent(new CustomEvent<Locale>(LOCALE_EVENT, { detail: locale }));
}

export function useLocale() {
  const [locale, setLocale] = useState<Locale>(() => getStoredLocale());

  useEffect(() => {
    const onLocaleChange = (event: Event) => {
      const customEvent = event as CustomEvent<Locale>;
      if (customEvent.detail) setLocale(customEvent.detail);
    };
    window.addEventListener(LOCALE_EVENT, onLocaleChange);
    return () => window.removeEventListener(LOCALE_EVENT, onLocaleChange);
  }, []);

  return { locale, setLocale: setStoredLocale };
}
