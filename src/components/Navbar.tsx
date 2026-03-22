'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, ChevronDown, User, Calendar, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  locale: string;
}

export default function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setIsOpen(false); }, [pathname]);

  const navLinks = [
    { href: `/${locale}`,              label: t('home')       },
    { href: `/${locale}/services`,     label: t('services')   },
    { href: `/${locale}/portfolio`,    label: t('portfolio')  },
    { href: `/${locale}/artists`,      label: t('artists')    },
    { href: `/${locale}/membership`,   label: t('membership') },
    { href: `/${locale}/contact`,      label: t('contact')    },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}`;
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-brand-black/95 backdrop-blur-md border-b border-brand-dark-3 shadow-dark'
          : 'bg-transparent'
      )}
    >
      <div className="container-max mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* ---- Logo ---- */}
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-red rounded-sm flex items-center justify-center
                           transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xs tracking-tight leading-none text-center">
                EG
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm tracking-[0.2em] uppercase leading-none">
                EARTHGANG
              </p>
              <p className="text-brand-red text-[10px] tracking-[0.3em] uppercase leading-none mt-0.5">
                O.G. Tattoo Studio
              </p>
            </div>
          </Link>

          {/* ---- Desktop Nav Links ---- */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium tracking-wider uppercase transition-colors duration-200 relative group',
                  isActive(link.href)
                    ? 'text-brand-red'
                    : 'text-brand-gray-light hover:text-white'
                )}
              >
                {link.label}
                <span className={cn(
                  'absolute -bottom-1 left-0 h-0.5 bg-brand-red transition-all duration-300',
                  isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                )} />
              </Link>
            ))}
          </div>

          {/* ---- Right Actions ---- */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher locale={locale} />

            {/* Book Now Button */}
            <Link
              href={`/${locale}/book`}
              className="hidden md:flex items-center gap-2 bg-brand-red text-white
                         text-xs font-bold tracking-wider uppercase px-5 py-2.5 rounded-lg
                         transition-all duration-300 hover:bg-brand-red-dark hover:shadow-red-glow"
            >
              <Calendar size={14} />
              {t('book')}
            </Link>

            {/* Account */}
            <Link
              href={`/${locale}/account`}
              className="hidden md:flex items-center gap-1.5 text-brand-gray-light
                         hover:text-white transition-colors p-2 rounded-lg
                         hover:bg-brand-dark-2"
            >
              <User size={18} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white p-2 rounded-lg hover:bg-brand-dark-2 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ---- Mobile Menu ---- */}
      <div className={cn(
        'lg:hidden overflow-hidden transition-all duration-300',
        isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="bg-brand-black border-t border-brand-dark-3 px-4 pb-6 pt-4">
          <div className="flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-3 rounded-lg text-sm font-medium tracking-wider uppercase transition-colors',
                  isActive(link.href)
                    ? 'bg-brand-red/10 text-brand-red'
                    : 'text-brand-gray-light hover:bg-brand-dark-2 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-brand-dark-3 mt-3 pt-4 flex flex-col gap-2">
              <Link
                href={`/${locale}/book`}
                className="flex items-center justify-center gap-2 bg-brand-red text-white
                           font-bold tracking-wider uppercase px-5 py-3 rounded-lg
                           hover:bg-brand-red-dark transition-colors"
              >
                <Calendar size={16} />
                {t('book')}
              </Link>
              <Link
                href={`/${locale}/account`}
                className="flex items-center justify-center gap-2 border border-brand-dark-3
                           text-brand-gray-light font-medium px-5 py-3 rounded-lg
                           hover:border-brand-red hover:text-white transition-colors"
              >
                <User size={16} />
                {t('account')}
              </Link>
              <div className="flex justify-center mt-2">
                <LanguageSwitcher locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
