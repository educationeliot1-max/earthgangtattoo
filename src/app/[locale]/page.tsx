import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, Star, Shield, Zap } from 'lucide-react';

interface Props {
  params: { locale: string };
}

export default function HomePage({ params: { locale } }: Props) {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');

  const styles = [
    {
      name: 'BLACKWORK',
      desc_th: 'ลวดลายดำเข้ม ตัดกันอย่างโดดเด่น ด้วยหมึกดำสะอาด',
      desc_en: 'Bold, high-contrast using heavy black ink for striking visual impact.',
      color: 'from-zinc-900 to-black',
    },
    {
      name: 'FINELINE',
      desc_th: 'รายละเอียดละเอียดอ่อน สวยงาม ด้วยเทคนิค Single-Needle',
      desc_en: 'Intricate, delicate details with precision single-needle techniques.',
      color: 'from-zinc-800 to-zinc-900',
    },
    {
      name: 'TRADITIONAL',
      desc_th: 'ลวดลายคลาสสิก เส้นหนา สีสดใส บ่งบอกมรดกแห่งงานศิลปะ',
      desc_en: 'Timeless imagery with bold outlines rooted in the heritage of the craft.',
      color: 'from-red-950 to-zinc-900',
    },
  ];

  const artists = [
    {
      name: 'TOON',
      specialty_th: 'Blackwork & Geometric',
      specialty_en: 'Blackwork & Geometric',
      bio_th: 'ช่างศิลปิน Blackwork ผู้เชี่ยวชาญลวดลายเรขาคณิตและลวดลายซับซ้อน',
      bio_en: 'Blackwork specialist with mastery in geometric and intricate patterns.',
      instagram: 'toon.earthgang',
    },
    {
      name: 'RONNIE',
      specialty_th: 'Traditional & Neo-Traditional',
      specialty_en: 'Traditional & Neo-Traditional',
      bio_th: 'ช่างศิลปิน Traditional ที่นำเสนอลวดลายคลาสสิกในมุมมองสมัยใหม่',
      bio_en: 'Traditional artist presenting classic imagery through a modern lens.',
      instagram: 'ronnie.earthgang',
    },
  ];

  const features = [
    {
      icon: '📅',
      title_th: 'จองออนไลน์ 24/7',
      title_en: 'Online Booking 24/7',
      desc_th: 'จองคิวได้ทุกเวลา ไม่ต้องรอโทรหา',
      desc_en: 'Book anytime, no need to call.',
    },
    {
      icon: '💎',
      title_th: 'ระบบสมาชิก 4 ระดับ',
      title_en: '4-Tier Membership',
      desc_th: 'รับส่วนลดสูงสุด 20% และสิทธิพิเศษมากมาย',
      desc_en: 'Up to 20% off and exclusive privileges.',
    },
    {
      icon: '⭐',
      title_th: 'สะสม Loyalty Points',
      title_en: 'Loyalty Points',
      desc_th: 'ทุกบาทที่ใช้ได้คะแนนสะสม แลกส่วนลดได้',
      desc_en: 'Earn points every session, redeem for discounts.',
    },
    {
      icon: '🔔',
      title_th: 'แจ้งเตือน LINE & Email',
      title_en: 'LINE & Email Alerts',
      desc_th: 'รับการยืนยันและเตือนความจำอัตโนมัติ',
      desc_en: 'Auto confirmations and reminders.',
    },
  ];

  const membershipTiers = [
    { tier: 'BRONZE',   price: '1,000', discount: '5%',  icon: '🥉', color: 'border-amber-700' },
    { tier: 'SILVER',   price: '2,500', discount: '10%', icon: '🥈', color: 'border-gray-400' },
    { tier: 'GOLD',     price: '5,000', discount: '15%', icon: '🥇', color: 'border-yellow-500', popular: true },
    { tier: 'PLATINUM', price: '10,000', discount: '20%', icon: '💎', color: 'border-slate-300' },
  ];

  return (
    <div className="overflow-hidden">

      {/* ============================
          HERO SECTION
      ============================ */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0 bg-brand-black">
          {/* Red accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-red" />
          {/* Radial glow */}
          <div className="absolute inset-0 bg-radial-gradient" style={{
            background: 'radial-gradient(ellipse at center top, rgba(215,0,0,0.15) 0%, transparent 60%)',
          }} />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/30
                          text-brand-red text-xs font-bold tracking-widest uppercase px-4 py-2
                          rounded-full mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse" />
            Chiang Mai · Thailand
          </div>

          {/* Title */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight
                         text-white leading-none mb-4 animate-slide-up">
            EARTH
            <span className="text-brand-red">GANG</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl tracking-[0.4em] text-brand-gray-light
                        uppercase font-light mb-2 animate-slide-up"
             style={{ animationDelay: '0.1s' }}>
            O.G. TATTOO STUDIO
          </p>

          {/* Tagline */}
          <p className="text-base sm:text-lg text-brand-gray mt-6 mb-10 max-w-xl mx-auto
                        animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {locale === 'th'
              ? 'ศิลปะบนผิวหนัง ที่บ่งบอกตัวตน — แต่ละชิ้นงานคือเรื่องราวของคุณ'
              : locale === 'zh'
              ? '皮肤上的艺术，述说您的故事'
              : 'Art on Skin. Stories that Last Forever.'}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
               style={{ animationDelay: '0.3s' }}>
            <Link href={`/${locale}/book`} className="btn-primary flex items-center justify-center gap-2 text-base">
              📅&nbsp;
              {locale === 'th' ? 'จองคิวเลย' : locale === 'zh' ? '立即预约' : 'Book a Session'}
              <ArrowRight size={18} />
            </Link>
            <Link href={`/${locale}/portfolio`} className="btn-secondary flex items-center justify-center gap-2 text-base">
              🖼️&nbsp;
              {locale === 'th' ? 'ดูผลงาน' : locale === 'zh' ? '查看作品' : 'View Portfolio'}
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-lg mx-auto">
            {[
              { value: '500+', label_th: 'ลูกค้า', label_en: 'Clients', label_zh: '客户' },
              { value: '5★',   label_th: 'รีวิว', label_en: 'Reviews', label_zh: '评价' },
              { value: '8+',   label_th: 'ปีประสบการณ์', label_en: 'Years Exp.', label_zh: '年经验' },
            ].map((stat) => (
              <div key={stat.value} className="text-center">
                <p className="text-3xl font-black text-brand-red">{stat.value}</p>
                <p className="text-brand-gray text-xs mt-1">
                  {locale === 'th' ? stat.label_th : locale === 'zh' ? stat.label_zh : stat.label_en}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-brand-gray text-xs tracking-widest">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-brand-gray to-transparent" />
        </div>
      </section>

      {/* ============================
          STYLES SECTION
      ============================ */}
      <section className="section-padding bg-brand-dark">
        <div className="container-max mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-red text-sm font-bold tracking-widest uppercase mb-3">Our Expertise</p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {locale === 'th' ? 'สไตล์ที่เราเชี่ยวชาญ'
               : locale === 'zh' ? '我们的专长' : 'Our Specialties'}
            </h2>
            <div className="divider-red mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {styles.map((style, i) => (
              <Link
                key={style.name}
                href={`/${locale}/services`}
                className="group relative card-dark card-hover overflow-hidden p-8 cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${style.color} opacity-50`} />
                <div className="relative z-10">
                  <p className="text-brand-red text-xs font-bold tracking-widest mb-2">0{i + 1}</p>
                  <h3 className="text-3xl font-black text-white tracking-tight mb-3 group-hover:text-brand-red transition-colors">
                    {style.name}
                  </h3>
                  <p className="text-brand-gray text-sm leading-relaxed">
                    {locale === 'th' ? style.desc_th : style.desc_en}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-brand-red opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold tracking-wider">
                      {locale === 'th' ? 'ดูเพิ่มเติม' : locale === 'zh' ? '了解更多' : 'Learn More'}
                    </span>
                    <ArrowRight size={14} />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-red transform
                               scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          FEATURES / WHY US
      ============================ */}
      <section className="section-padding bg-brand-black">
        <div className="container-max mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-red text-sm font-bold tracking-widest uppercase mb-3">
              {locale === 'th' ? 'ทำไมต้อง EARTHGANG' : 'Why EARTHGANG'}
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {locale === 'th' ? 'ประสบการณ์ที่แตกต่าง'
               : locale === 'zh' ? '不同凡响的体验' : 'A Different Experience'}
            </h2>
            <div className="divider-red mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.icon} className="card-dark p-6 rounded-xl hover:border-brand-red/50 transition-colors">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold text-base mb-2">
                  {locale === 'th' ? f.title_th : f.title_en}
                </h3>
                <p className="text-brand-gray text-sm leading-relaxed">
                  {locale === 'th' ? f.desc_th : f.desc_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          ARTISTS SECTION
      ============================ */}
      <section className="section-padding bg-brand-dark">
        <div className="container-max mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-red text-sm font-bold tracking-widest uppercase mb-3">The Crew</p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {locale === 'th' ? 'พบกับช่างศิลปิน'
               : locale === 'zh' ? '认识我们的艺术家' : 'Meet Our Artists'}
            </h2>
            <div className="divider-red mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {artists.map((artist) => (
              <div key={artist.name} className="card-dark card-hover p-8 rounded-xl group">
                {/* Avatar placeholder */}
                <div className="w-20 h-20 bg-brand-red/10 border-2 border-brand-red/30 rounded-full
                               flex items-center justify-center mb-4 group-hover:border-brand-red transition-colors">
                  <span className="text-brand-red font-black text-2xl">{artist.name[0]}</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-1 group-hover:text-brand-red transition-colors">
                  {artist.name}
                </h3>
                <p className="text-brand-red text-xs font-bold tracking-widest uppercase mb-3">
                  {locale === 'th' ? artist.specialty_th : artist.specialty_en}
                </p>
                <p className="text-brand-gray text-sm leading-relaxed mb-4">
                  {locale === 'th' ? artist.bio_th : artist.bio_en}
                </p>
                <Link
                  href={`/${locale}/book?artist=${artist.name.toLowerCase()}`}
                  className="inline-flex items-center gap-2 text-brand-red text-xs font-bold
                             tracking-wider uppercase hover:gap-3 transition-all duration-200"
                >
                  {locale === 'th' ? 'จองกับ ' : 'Book with '}{artist.name}
                  <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href={`/${locale}/artists`} className="btn-secondary inline-flex items-center gap-2">
              {locale === 'th' ? 'ดูช่างศิลปินทั้งหมด' : locale === 'zh' ? '查看所有艺术家' : 'Meet All Artists'}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================
          MEMBERSHIP PREVIEW
      ============================ */}
      <section className="section-padding bg-brand-black">
        <div className="container-max mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-gold text-sm font-bold tracking-widest uppercase mb-3">Membership</p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {locale === 'th' ? 'สิทธิพิเศษสำหรับสมาชิก'
               : locale === 'zh' ? '会员专属权益' : 'Exclusive Member Benefits'}
            </h2>
            <div className="divider-red mx-auto mt-4" />
            <p className="text-brand-gray mt-4 text-sm max-w-xl mx-auto">
              {locale === 'th'
                ? 'เข้าร่วม EARTHGANG Family รับส่วนลดสูงสุด 20% สะสมคะแนน และสิทธิพิเศษมากมาย'
                : locale === 'zh'
                ? '加入EARTHGANG Family，享最高20%折扣、积分累积及专属特权'
                : 'Join EARTHGANG Family — up to 20% off, loyalty points, and exclusive perks.'}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {membershipTiers.map((tier) => (
              <div
                key={tier.tier}
                className={`relative card-dark border ${tier.color} rounded-xl p-6 text-center
                            transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                            ${tier.popular ? 'ring-2 ring-yellow-500' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-yellow-500 text-black text-[10px] font-black
                                     tracking-wider uppercase px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}
                <div className="text-4xl mb-3">{tier.icon}</div>
                <p className="text-white font-black tracking-wider text-sm mb-1">{tier.tier}</p>
                <p className="text-brand-red text-xl font-black mb-1">{tier.discount}</p>
                <p className="text-brand-gray text-[11px]">
                  {locale === 'th' ? 'ส่วนลด' : 'discount'}
                </p>
                <div className="mt-3 border-t border-brand-dark-3 pt-3">
                  <p className="text-brand-gold text-base font-bold">{tier.price}</p>
                  <p className="text-brand-gray text-[11px]">฿ / {locale === 'th' ? 'ปี' : 'yr'}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href={`/${locale}/membership`} className="btn-gold inline-flex items-center gap-2">
              💎&nbsp;
              {locale === 'th' ? 'ดูสิทธิประโยชน์ทั้งหมด'
               : locale === 'zh' ? '查看所有会员权益' : 'See All Benefits'}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================
          CTA SECTION
      ============================ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-brand-red" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }} />

        <div className="relative z-10 container-max mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
            {locale === 'th' ? 'พร้อมสร้างงานศิลปะของคุณ?'
             : locale === 'zh' ? '准备好创作您的艺术了吗？' : 'Ready to Ink Your Story?'}
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            {locale === 'th' ? 'จองคิวล่วงหน้า เลือกเวลาที่สะดวก รับการยืนยันทันที'
             : locale === 'zh' ? '提前预约，选择方便时间，即时确认' : 'Book in advance, pick your time, get instant confirmation.'}
          </p>
          <Link
            href={`/${locale}/book`}
            className="inline-flex items-center gap-3 bg-white text-brand-red font-black
                       text-lg px-10 py-4 rounded-xl hover:bg-brand-black hover:text-white
                       transition-all duration-300 shadow-lg hover:shadow-2xl"
          >
            📅&nbsp;
            {locale === 'th' ? 'จองคิวเลยตอนนี้' : locale === 'zh' ? '立即预约' : 'Book Now'}
            <ArrowRight size={20} />
          </Link>
          <p className="text-white/60 text-sm mt-4">
            {locale === 'th' ? 'ชำระมัดจำเพียง 30% เพื่อยืนยันนัด'
             : locale === 'zh' ? '仅需30%定金即可确认预约' : 'Only 30% deposit to confirm your appointment'}
          </p>
        </div>
      </section>

    </div>
  );
}
