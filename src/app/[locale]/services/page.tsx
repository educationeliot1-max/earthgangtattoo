import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Props { params: { locale: string }; }

const SERVICES_DATA = [
  {
    style: 'BLACKWORK',
    icon: '⬛',
    desc_th: 'ลวดลายดำเข้ม ตัดกันสูง เน้นหมึกดำสะอาด ให้ผลลัพธ์ที่ดุดัน น่าประทับใจ',
    desc_en: 'Bold, high-contrast using heavy black ink for striking visual impact.',
    items: [
      { name_th: 'เล็ก (≤5cm)', name_en: 'Small (≤5cm)',   price: 2500,  duration: '1h' },
      { name_th: 'กลาง (5–15cm)', name_en: 'Medium (5–15cm)', price: 5000,  duration: '2h' },
      { name_th: 'ใหญ่ (15cm+)', name_en: 'Large (15cm+)',  price: 9000,  duration: '4h' },
      { name_th: 'Half Sleeve',  name_en: 'Half Sleeve',   price: 25000, duration: '8h' },
      { name_th: 'Full Sleeve',  name_en: 'Full Sleeve',   price: 45000, duration: '16h' },
    ],
  },
  {
    style: 'FINELINE',
    icon: '✒️',
    desc_th: 'เส้นบางละเอียดอ่อน ด้วย Single-Needle ให้งานที่สวยงามและประณีต',
    desc_en: 'Intricate, delicate details with precision single-needle techniques.',
    items: [
      { name_th: 'เล็ก (≤5cm)',    name_en: 'Small (≤5cm)',   price: 2000, duration: '1h' },
      { name_th: 'กลาง (5–15cm)', name_en: 'Medium (5–15cm)', price: 4000, duration: '2h' },
      { name_th: 'ใหญ่ (15cm+)',  name_en: 'Large (15cm+)',   price: 7000, duration: '3h' },
    ],
  },
  {
    style: 'TRADITIONAL',
    icon: '🦅',
    desc_th: 'ลวดลายคลาสสิก เส้นหนา สีสดใส มรดกแห่งงานสักแบบดั้งเดิม',
    desc_en: 'Timeless imagery with bold outlines and vibrant colors.',
    items: [
      { name_th: 'เล็ก',  name_en: 'Small',   price: 3000,  duration: '1.5h' },
      { name_th: 'กลาง', name_en: 'Medium',  price: 6000,  duration: '3h' },
      { name_th: 'ใหญ่',  name_en: 'Large',   price: 12000, duration: '5h' },
    ],
  },
  {
    style: 'CUSTOM DESIGN',
    icon: '🎨',
    desc_th: 'ออกแบบลายเฉพาะสำหรับคุณ ไม่ซ้ำใคร สร้างสรรค์ตามไอเดียของคุณ',
    desc_en: 'Bespoke designs crafted exclusively for you — unique to your story.',
    items: [
      { name_th: 'ออกแบบและปรึกษา', name_en: 'Design Consultation', price: 0,     duration: '30min' },
      { name_th: 'Custom ชิ้นเล็ก',  name_en: 'Custom Small Piece', price: 4000,  duration: '2h' },
      { name_th: 'Custom ชิ้นใหญ่',  name_en: 'Custom Large Piece', price: 10000, duration: '4h+' },
    ],
  },
];

export default function ServicesPage({ params: { locale } }: Props) {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="bg-brand-dark py-16 text-center border-b border-brand-dark-3">
        <div className="container-max mx-auto px-4">
          <p className="text-brand-red text-sm font-bold tracking-widest uppercase mb-3">Pricing</p>
          <h1 className="text-5xl font-black text-white tracking-tight mb-4">
            {locale === 'th' ? 'บริการและราคา' : locale === 'zh' ? '服务与价格' : 'Services & Pricing'}
          </h1>
          <p className="text-brand-gray max-w-xl mx-auto text-sm">
            {locale === 'th'
              ? 'ราคาเริ่มต้น — ราคาจริงขึ้นอยู่กับขนาด ความซับซ้อน และตำแหน่งที่สัก'
              : 'Starting prices — actual cost depends on size, complexity, and placement.'}
          </p>
          <div className="divider-red mx-auto mt-6" />
        </div>
      </div>

      {/* Services */}
      <div className="container-max mx-auto px-4 py-16">
        <div className="space-y-12">
          {SERVICES_DATA.map((service) => (
            <div key={service.style}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{service.icon}</span>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-wider">{service.style}</h2>
                  <p className="text-brand-gray text-sm">
                    {locale === 'th' ? service.desc_th : service.desc_en}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-brand-dark-3">
                <table className="w-full">
                  <thead>
                    <tr className="bg-brand-dark-2 border-b border-brand-dark-3">
                      <th className="text-left p-4 text-brand-gray text-xs font-bold uppercase tracking-wider">
                        {locale === 'th' ? 'บริการ' : 'Service'}
                      </th>
                      <th className="text-center p-4 text-brand-gray text-xs font-bold uppercase tracking-wider">
                        {locale === 'th' ? 'เวลา' : 'Duration'}
                      </th>
                      <th className="text-right p-4 text-brand-gray text-xs font-bold uppercase tracking-wider">
                        {locale === 'th' ? 'ราคาเริ่มต้น' : 'Starting Price'}
                      </th>
                      <th className="text-center p-4 text-brand-gray text-xs font-bold uppercase tracking-wider">
                        {locale === 'th' ? 'มัดจำ 30%' : '30% Deposit'}
                      </th>
                      <th className="p-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {service.items.map((item, i) => (
                      <tr key={i} className="border-b border-brand-dark-3 hover:bg-brand-dark-2/50 transition-colors">
                        <td className="p-4">
                          <p className="text-white font-medium text-sm">
                            {locale === 'th' ? item.name_th : item.name_en}
                          </p>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-brand-gray text-sm">{item.duration}</span>
                        </td>
                        <td className="p-4 text-right">
                          {item.price === 0 ? (
                            <span className="text-green-400 font-bold text-sm">FREE</span>
                          ) : (
                            <span className="text-brand-gold font-bold text-sm">
                              {item.price.toLocaleString()} ฿
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {item.price > 0 ? (
                            <span className="text-brand-gray-light text-xs">
                              {Math.ceil(item.price * 0.3).toLocaleString()} ฿
                            </span>
                          ) : (
                            <span className="text-brand-gray/40 text-xs">—</span>
                          )}
                        </td>
                        <td className="p-4">
                          <Link
                            href={`/${locale}/book?service=${item.name_en.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-brand-red text-xs font-bold hover:underline flex items-center gap-1 justify-end"
                          >
                            {locale === 'th' ? 'จอง' : 'Book'}
                            <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <div className="mt-12 bg-brand-dark border border-brand-dark-3 rounded-xl p-6">
          <h3 className="text-white font-bold mb-4">
            📌 {locale === 'th' ? 'หมายเหตุ' : 'Notes'}
          </h3>
          <ul className="space-y-2 text-brand-gray text-sm">
            {(locale === 'th' ? [
              'ราคาที่แสดงเป็นราคาเริ่มต้น ราคาจริงขึ้นอยู่กับขนาด ความซับซ้อน และตำแหน่งที่สัก',
              'ต้องชำระมัดจำ 30% เพื่อยืนยันการจอง',
              'ยอดที่เหลือชำระในวันนัด',
              'ราคารวม VAT แล้ว',
              'ราคาไม่รวมค่าสีพิเศษ (เช่น สีขาว, UV)',
              'สมาชิก Bronze ลด 5%, Silver ลด 10%, Gold ลด 15%, Platinum ลด 20%',
            ] : [
              'Prices shown are starting prices — final cost depends on size, complexity, and placement',
              '30% deposit required to confirm booking',
              'Remaining balance due on appointment day',
              'Prices include VAT',
              'Special inks (white, UV) may incur additional cost',
              'Members get 5–20% off based on tier',
            ]).map((note, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brand-red mt-0.5">•</span>
                {note}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link href={`/${locale}/book`} className="btn-primary inline-flex items-center gap-2 text-base">
            📅&nbsp;
            {locale === 'th' ? 'จองคิวเลย' : 'Book a Session'}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
