'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Props { params: { locale: string }; }

const STYLES = ['All', 'Blackwork', 'Fineline', 'Traditional', 'Geometric', 'Custom'];
const ARTISTS_FILTER = ['All Artists', 'TOON', 'RONNIE'];

// Placeholder portfolio items
const PORTFOLIO_ITEMS = [
  { id: 1, title: 'Intricate Blackwork Sleeve', style: 'Blackwork', artist: 'TOON',   bg: 'from-zinc-900 to-black' },
  { id: 2, title: 'Traditional Dagger & Rose', style: 'Traditional', artist: 'RONNIE', bg: 'from-red-950 to-zinc-900' },
  { id: 3, title: 'Fineline Floral Piece',     style: 'Fineline',    artist: 'TOON',   bg: 'from-zinc-800 to-zinc-900' },
  { id: 4, title: 'Dark Ornamental Backpiece', style: 'Blackwork',   artist: 'TOON',   bg: 'from-zinc-900 to-stone-900' },
  { id: 5, title: 'Traditional Hawk',          style: 'Traditional', artist: 'RONNIE', bg: 'from-amber-950 to-zinc-900' },
  { id: 6, title: 'Abstract Blackwork Script', style: 'Blackwork',   artist: 'TOON',   bg: 'from-slate-900 to-zinc-900' },
  { id: 7, title: 'Geometric Mandala',         style: 'Geometric',   artist: 'TOON',   bg: 'from-indigo-950 to-zinc-900' },
  { id: 8, title: 'Neo-Trad Panther',          style: 'Traditional', artist: 'RONNIE', bg: 'from-red-950 to-black' },
  { id: 9, title: 'Fine Line Portrait',        style: 'Fineline',    artist: 'RONNIE', bg: 'from-zinc-800 to-black' },
];

export default function PortfolioPage({ params: { locale } }: Props) {
  const [styleFilter,  setStyleFilter]  = useState('All');
  const [artistFilter, setArtistFilter] = useState('All Artists');

  const filtered = PORTFOLIO_ITEMS.filter(item => {
    const styleMatch  = styleFilter === 'All' || item.style === styleFilter;
    const artistMatch = artistFilter === 'All Artists' || item.artist === artistFilter;
    return styleMatch && artistMatch;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="bg-brand-dark py-16 text-center border-b border-brand-dark-3">
        <div className="container-max mx-auto px-4">
          <p className="text-brand-red text-sm font-bold tracking-widest uppercase mb-3">Our Work</p>
          <h1 className="text-5xl font-black text-white tracking-tight">
            {locale === 'th' ? 'ผลงาน' : locale === 'zh' ? '作品集' : 'Portfolio'}
          </h1>
          <p className="text-brand-gray mt-3 text-sm">
            {locale === 'th' ? 'รอยสักจากช่างฝีมือของเรา'
             : locale === 'zh' ? '我们艺术家的作品' : 'Ink crafted by our artists'}
          </p>
          <div className="divider-red mx-auto mt-6" />
        </div>
      </div>

      <div className="container-max mx-auto px-4 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {STYLES.map(s => (
              <button
                key={s}
                onClick={() => setStyleFilter(s)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-bold transition-colors border',
                  styleFilter === s
                    ? 'bg-brand-red text-white border-brand-red'
                    : 'bg-brand-dark-2 text-brand-gray-light border-brand-dark-3 hover:border-brand-red/50'
                )}
              >{s}</button>
            ))}
          </div>
          <div className="flex gap-2">
            {ARTISTS_FILTER.map(a => (
              <button
                key={a}
                onClick={() => setArtistFilter(a)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-bold transition-colors border',
                  artistFilter === a
                    ? 'bg-brand-gold text-black border-brand-gold'
                    : 'bg-brand-dark-2 text-brand-gray-light border-brand-dark-3 hover:border-brand-gold/50'
                )}
              >{a}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer
                         border border-brand-dark-3 hover:border-brand-red transition-all duration-300
                         hover:shadow-red-glow"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.bg}`} />
              {/* Placeholder art SVG */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-20 h-20 opacity-20">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#D70000" strokeWidth="2" />
                  <path d="M30 50 Q50 20 70 50 Q50 80 30 50" fill="none" stroke="#D70000" strokeWidth="1.5" />
                </svg>
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-brand-black/70 opacity-0 group-hover:opacity-100
                             transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                <p className="text-white font-bold text-sm text-center leading-tight">{item.title}</p>
                <p className="text-brand-red text-xs mt-1">{item.style}</p>
                <p className="text-brand-gray text-xs">{item.artist}</p>
                <Link
                  href={`/${locale}/book?artist=${item.artist.toLowerCase()}`}
                  className="mt-3 bg-brand-red text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                  onClick={e => e.stopPropagation()}
                >
                  {locale === 'th' ? 'จองกับ ' : 'Book with '}{item.artist}
                </Link>
              </div>
              {/* Badge */}
              <div className="absolute top-2 left-2">
                <span className="bg-brand-black/70 text-brand-gray-light text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.style}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🎨</p>
            <p className="text-brand-gray">
              {locale === 'th' ? 'ไม่มีผลงานในหมวดนี้' : 'No items in this category'}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href={`/${locale}/book`} className="btn-primary inline-flex items-center gap-2">
            📅&nbsp;
            {locale === 'th' ? 'จองคิวสัก' : 'Book Your Tattoo'}
          </Link>
        </div>
      </div>
    </div>
  );
}
