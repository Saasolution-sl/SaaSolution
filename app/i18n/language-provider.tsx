'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import translations from './translations.json';
import manualOverrides from './manual-overrides.json';

export type Locale = 'en' | 'es' | 'nl' | 'ar' | 'pt' | 'fr' | 'de';

const languages: { code: Locale; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
];

type TranslationTable = Partial<Record<Exclude<Locale, 'en'>, Record<string, string>>>;
const generatedTable = translations as TranslationTable;
const overrideTable = manualOverrides as TranslationTable;
const table = Object.fromEntries(
  (['es', 'nl', 'ar', 'pt', 'fr', 'de'] as const).map((locale) => [
    locale,
    { ...generatedTable[locale], ...overrideTable[locale] },
  ]),
) as TranslationTable;
const originalText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Record<string, string>>();

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function translatePage(locale: Locale) {
  const dictionary = locale === 'en' ? undefined : table[locale];
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode() as Text | null;
  while (current) {
    const parent = current.parentElement;
    if (parent && !parent.closest('[data-i18n-skip]') && !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) {
      const source = originalText.get(current) ?? current.nodeValue ?? '';
      originalText.set(current, source);
      const match = source.match(/^(\s*)([\s\S]*?)(\s*)$/);
      const key = match?.[2] ?? '';
      if (key) current.nodeValue = `${match?.[1] ?? ''}${dictionary?.[key] ?? key}${match?.[3] ?? ''}`;
    }
    current = walker.nextNode() as Text | null;
  }

  document.querySelectorAll('[aria-label], [title]').forEach((element) => {
    if (element.closest('[data-i18n-skip]')) return;
    const stored = originalAttributes.get(element) ?? {};
    for (const attribute of ['aria-label', 'title']) {
      const value = stored[attribute] ?? element.getAttribute(attribute);
      if (!value) continue;
      stored[attribute] = value;
      element.setAttribute(attribute, dictionary?.[value] ?? value);
    }
    originalAttributes.set(element, stored);
  });
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>('en');

  useEffect(() => {
    const saved = window.localStorage.getItem('saasolution-language') as Locale | null;
    const browser = window.navigator.language.slice(0, 2).toLowerCase() as Locale;
    const supported = languages.some((language) => language.code === saved)
      ? saved
      : languages.some((language) => language.code === browser) ? browser : 'en';
    const updateTimer = window.setTimeout(() => updateLocale(supported ?? 'en'), 0);
    return () => window.clearTimeout(updateTimer);
  }, []);

  useEffect(() => {
    translatePage(locale);
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    window.localStorage.setItem('saasolution-language', nextLocale);
    updateLocale(nextLocale);
  }, []);

  return <LanguageContext.Provider value={{ locale, setLocale }}>{children}</LanguageContext.Provider>;
}

function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('LanguageSwitcher must be used inside LanguageProvider');
  return context;
}

export function CompanyLanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  return (
    <div className="company-languages" aria-label="Language selector" data-i18n-skip>
      {languages.map((language) => (
        <button
          type="button"
          className={locale === language.code ? 'active' : undefined}
          aria-pressed={locale === language.code}
          aria-label={`Change language to ${language.name}`}
          title={language.nativeName}
          onClick={() => setLocale(language.code)}
          key={language.code}
        >
          {language.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export function DriveLanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLanguage();
  const details = useRef<HTMLDetailsElement>(null);
  return (
    <details className={`drive-language${compact ? ' compact' : ''}`} ref={details} data-i18n-skip>
      <summary aria-label="Choose language"><span>◎</span> {locale.toUpperCase()}</summary>
      <div>
        {languages.map((language) => (
          <button
            type="button"
            className={locale === language.code ? 'active' : undefined}
            aria-pressed={locale === language.code}
            title={language.nativeName}
            onClick={() => {
              setLocale(language.code);
              details.current?.removeAttribute('open');
            }}
            key={language.code}
          >
            <b>{language.code.toUpperCase()}</b><span>{language.nativeName}</span>
          </button>
        ))}
      </div>
    </details>
  );
}
