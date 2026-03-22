'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  locale: string;
}

const LANGUAGES = [
  { code: 'th', label: 'ไทย', flag: '🇹🇭' },
  { code: 'en', label: 'EN',  flag: '🇬🇧' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen]   = useState(false);

  const current = LANGUAGES.find(l => l.code === locale) || LANGUAGES[0];

  const switchLocale = (newLocale: string) => {
    // Replace current locale prefix with new one
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/') || `/${newLocale}`);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-brand-dark-2 border border-brand-dark-3
                   text-white text-xs font-medium px-3 py-2 rounded-lg
                   hover:border-brand-red transition-colors duration-200"
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <svg
          className={cn('w-3 h-3 transition-transform', open && 'rotate-180')}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 bg-brand-dark border border-brand-dark-3
                          rounded-xl overflow-hidden shadow-dark min-w-[110px] animate-slide-down">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => switchLocale(lang.code)}
                className={cn(
                  'w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors',
                  lang.code === locale
                    ? 'bg-brand-red/10 text-brand-red font-bold'
                    : 'text-brand-gray-light hover:bg-brand-dark-2 hover:text-white'
                )}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
                {lang.code === locale && (
                  <span className="ml-auto text-brand-red">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
