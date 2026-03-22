import Link from 'next/link';
import { ArrowRight, Instagram } from 'lucide-react';

interface Props { params: { locale: string }; }

const ARTISTS = [
  {
    id: 'toon',
    name: 'TOON',
    full_name: 'Toon Earthgang',
    specialty_th: 'Blackwork · Geometric · Custom',
    specialty_en: 'Blackwork · Geometric · Custom',
    bio_th: 'ช่างศิลปิน Blackwork ผู้เชี่ยวชาญลวดลายเรขาคณิตและลวดลายซับซ้อน ประสบการณ์กว่า 8 ปี สร้างสรรค์งานศิลปะที่ดุดัน ลึกซึ้ง และมีความหมาย',
    bio_en: 'Blackwork specialist with mastery in geometric and intricate patterns. 8+ years creating bold, meaningful art that tells stories.',
    bio_zh: ' 黑色纹身专家，精通几何和复杂图案。8年以上创作经验。',
    instagram: 'toon.earthgang',
    styles: ['Blackwork', 'Geometric', 'Dotwork', 'Mandala', 'Custom'],
    available: true,
  },
  {
    id: 'ronnie',
    name: 'RONNIE',
    full_name: 'Ronnie Earthgang',
    specialty_th: 'Traditional · Neo-Traditional · Fineline',
    specialty_en: 'Traditional · Neo-Traditional · Fineline',
    bio_th: 'ช่างศิลปิน Traditional ที่นำเสนอลวดลายคลาสสิกในมุมมองสมัยใหม่ ด้วยสีสันสดใส เส้นหนาแน่น และรายละเอียดที่พิถีพิถัน',
    bio_en: 'Traditional artist presenting classic imagery through a modern lens with vibrant colors and bold lines.',
    bio_zh: '传统纹身艺术家，以现代视角呈现经典图案，色彩鲜艳，线条粗犷。',
    instagram: 'ronnie.earthgang',
    styles: ['Traditional', 'Neo-Traditional', 'Fineline', 'Portrait'],
    available: true,
  },
];

export default function ArtistsPage({ params: { locale } }: Props) {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="bg-brand-dark py-16 text-center border-b border-brand-dark-3">
        <div className="container-max mx-auto px-4">
          <p className="text-brand-red text-sm font-bold tracking-widest uppercase mb-3">The Crew</p>
          <h1 className="text-5xl font-black text-white tracking-tight">
            {locale === 'th' ? 'ช่างศิลปิน' : locale === 'zh' ? '我们的艺术家' : 'Our Artists'}
          </h1>
          <p className="text-brand-gray mt-3 max-w-md mx-auto text-sm">
            {locale === 'th' ? 'ช่างมืออาชีพที่มีความหลงใหลและประสบการณ์สูง'
             : locale === 'zh' ? '充满激情的专业纹身师' : 'Passionate professionals with years of experience'}
          </p>
          <div className="divider-red mx-auto mt-6" />
        </div>
      </div>

      <div className="container-max mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {ARTISTS.map((artist) => (
            <div key={artist.id} className="card-dark rounded-2xl overflow-hidden group">
              {/* Avatar */}
              <div className="h-64 bg-gradient-to-br from-brand-dark-3 to-brand-black flex items-center justify-center
                             border-b border-brand-dark-3 relative overflow-hidden">
                <div className="absolute inset-0" style={{
                  background: 'radial-gradient(ellipse at center, rgba(215,0,0,0.1) 0%, transparent 70%)',
                }} />
                <div className="relative w-32 h-32 bg-brand-red/10 border-4 border-brand-red/30 rounded-full
                               flex items-center justify-center group-hover:border-brand-red transition-colors duration-300">
                  <span className="text-brand-red font-black text-6xl">{artist.name[0]}</span>
                </div>
                {artist.available && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-900/80 text-green-400
                                 text-[10px] font-bold px-2 py-1 rounded-full border border-green-700">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    {locale === 'th' ? 'รับงานอยู่' : 'Available'}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <h2 className="text-3xl font-black text-white mb-1 group-hover:text-brand-red transition-colors">
                  {artist.name}
                </h2>
                <p className="text-brand-red text-xs font-bold tracking-widest uppercase mb-4">
                  {locale === 'th' ? artist.specialty_th : artist.specialty_en}
                </p>
                <p className="text-brand-gray text-sm leading-relaxed mb-6">
                  {locale === 'th' ? artist.bio_th : locale === 'zh' ? artist.bio_zh : artist.bio_en}
                </p>

                {/* Styles */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {artist.styles.map(style => (
                    <span key={style} className="bg-brand-dark-2 border border-brand-dark-3 text-brand-gray-light
                                                  text-[11px] px-3 py-1 rounded-full">
                      {style}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    href={`/${locale}/book?artist=${artist.id}`}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm"
                  >
                    📅&nbsp;
                    {locale === 'th' ? `จองกับ ${artist.name}` : `Book with ${artist.name}`}
                  </Link>
                  <a
                    href={`https://instagram.com/${artist.instagram}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 bg-brand-dark-2 border border-brand-dark-3 rounded-lg
                               flex items-center justify-center text-brand-gray
                               hover:text-white hover:border-brand-red transition-colors"
                  >
                    <Instagram size={16} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Join the crew */}
        <div className="mt-16 bg-brand-dark border border-brand-dark-3 rounded-2xl p-8 text-center">
          <p className="text-3xl mb-3">🎨</p>
          <h3 className="text-xl font-black text-white mb-2">
            {locale === 'th' ? 'มีช่างศิลปิน Guest Artist เพิ่มเร็วๆ นี้'
             : 'Guest Artists Coming Soon'}
          </h3>
          <p className="text-brand-gray text-sm">
            {locale === 'th' ? 'ติดตามเราเพื่อรับข่าวสารเกี่ยวกับ Guest Artist'
             : 'Follow us for updates on upcoming Guest Artists'}
          </p>
          <a href="https://instagram.com/earthgangtattoo" target="_blank" rel="noopener noreferrer"
             className="btn-secondary inline-flex items-center gap-2 mt-4 text-sm">
            <Instagram size={16} />
            @earthgangtattoo
          </a>
        </div>
      </div>
    </div>
  );
}
