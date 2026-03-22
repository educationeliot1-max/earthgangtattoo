import Link from 'next/link';
import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: `/${locale}`,            label: 'Home' },
    { href: `/${locale}/services`,   label: 'Services' },
    { href: `/${locale}/book`,       label: 'Book Now' },
    { href: `/${locale}/portfolio`,  label: 'Portfolio' },
    { href: `/${locale}/artists`,    label: 'Artists' },
    { href: `/${locale}/membership`, label: 'Membership' },
    { href: `/${locale}/contact`,    label: 'Contact' },
  ];

  const tattooStyles = [
    'Blackwork', 'Fineline', 'Traditional',
    'Neo-Traditional', 'Geometric', 'Custom',
  ];

  return (
    <footer className="bg-brand-dark border-t border-brand-dark-3">
      {/* Main Footer */}
      <div className="container-max mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* ---- Brand ---- */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-red rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-xs">EG</span>
              </div>
              <div>
                <p className="text-white font-bold tracking-[0.2em] uppercase text-sm leading-none">EARTHGANG</p>
                <p className="text-brand-red text-[10px] tracking-[0.3em] uppercase mt-0.5">O.G. Tattoo Studio</p>
              </div>
            </div>
            <p className="text-brand-gray text-sm leading-relaxed mb-6">
              Premium tattoo studio in Chiang Mai. Specialists in Blackwork, Fineline, and Traditional styles.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/earthgangtattoo"
                target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-brand-dark-2 rounded-lg flex items-center justify-center
                           text-brand-gray hover:text-white hover:bg-brand-red transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com/earthgangtattoo"
                target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-brand-dark-2 rounded-lg flex items-center justify-center
                           text-brand-gray hover:text-white hover:bg-brand-red transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href="https://line.me/ti/p/@earthgangtattoo"
                target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-brand-dark-2 rounded-lg flex items-center justify-center
                           text-brand-gray hover:text-white hover:bg-[#06C755] transition-colors"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* ---- Quick Links ---- */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-brand-red rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-gray text-sm hover:text-brand-red transition-colors duration-200
                               flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-brand-dark-3 rounded-full group-hover:bg-brand-red transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ---- Styles ---- */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-brand-red rounded-full" />
              Tattoo Styles
            </h3>
            <ul className="space-y-2">
              {tattooStyles.map(style => (
                <li key={style}>
                  <Link
                    href={`/${locale}/services`}
                    className="text-brand-gray text-sm hover:text-brand-red transition-colors duration-200
                               flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-brand-dark-3 rounded-full group-hover:bg-brand-red transition-colors" />
                    {style}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ---- Contact ---- */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-brand-red rounded-full" />
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-red mt-0.5 shrink-0" />
                <p className="text-brand-gray text-sm leading-relaxed">
                  141/2 Kampangdin Rd,<br />
                  Tambon Phra Sing,<br />
                  Mueang Chiang Mai 50100
                </p>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-red shrink-0" />
                <a
                  href="tel:0618042224"
                  className="text-brand-gray text-sm hover:text-white transition-colors"
                >
                  061-804-2224
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-brand-red mt-0.5 shrink-0" />
                <div className="text-brand-gray text-sm">
                  <p>Tue–Sat: 10:00–20:00</p>
                  <p>Sun: By Appointment</p>
                  <p className="text-brand-gray/60">Mon: Closed</p>
                </div>
              </li>
            </ul>

            {/* Book CTA */}
            <Link
              href={`/${locale}/book`}
              className="mt-6 flex items-center justify-center gap-2 bg-brand-red text-white
                         text-xs font-bold tracking-wider uppercase px-5 py-3 rounded-lg
                         hover:bg-brand-red-dark hover:shadow-red-glow transition-all duration-300"
            >
              📅 Book a Session
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-dark-3">
        <div className="container-max mx-auto px-4 py-5 flex flex-col md:flex-row items-center
                        justify-between gap-3">
          <p className="text-brand-gray/60 text-xs">
            © {currentYear} EARTHGANG O.G. Tattoo Studio. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/privacy`} className="text-brand-gray/60 text-xs hover:text-brand-red transition-colors">
              Privacy Policy
            </Link>
            <Link href={`/${locale}/terms`} className="text-brand-gray/60 text-xs hover:text-brand-red transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
