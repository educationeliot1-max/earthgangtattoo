import Link from 'next/link';
import { Check, Star, Crown, Zap } from 'lucide-react';
import { MEMBERSHIP_PLANS } from '@/lib/membership';

interface Props {
  params: { locale: string };
}

export default function MembershipPage({ params: { locale } }: Props) {

  const faq = [
    {
      q_th: 'สามารถอัพเกรดระดับสมาชิกได้ไหม?',
      q_en: 'Can I upgrade my membership tier?',
      a_th: 'ได้เลยครับ สามารถอัพเกรดได้ทุกเมื่อ ยอดที่จ่ายไปแล้วจะถูกหักออกจากค่าสมาชิกใหม่',
      a_en: 'Yes! You can upgrade anytime. Your remaining balance will be applied towards the new tier.',
    },
    {
      q_th: 'Loyalty Points หมดอายุไหม?',
      q_en: 'Do Loyalty Points expire?',
      a_th: 'คะแนนมีอายุ 1 ปีหลังจากรับคะแนน สมาชิก Platinum คะแนนไม่มีวันหมดอายุ',
      a_en: 'Points expire after 1 year. Platinum members have no expiry date on points.',
    },
    {
      q_th: 'Touch-up ฟรีใช้กับบริการอะไรบ้าง?',
      q_en: 'Which services qualify for free touch-ups?',
      a_th: 'Touch-up ฟรีใช้ได้กับรอยสักที่ทำที่สตูดิโอของเรา ภายใน 3 เดือนหลังจากสักครั้งแรก',
      a_en: 'Free touch-ups apply to tattoos done at our studio within 3 months of the original session.',
    },
    {
      q_th: 'สมาชิกคนละบัญชีกับคนอื่นได้ไหม?',
      q_en: 'Can membership be shared?',
      a_th: 'สมาชิกเป็นรายบุคคล ไม่สามารถแชร์หรือโอนได้',
      a_en: 'Membership is personal and non-transferable.',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">

      {/* Hero */}
      <div className="relative py-20 bg-brand-dark text-center overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.1) 0%, transparent 70%)',
        }} />
        <div className="relative z-10 container-max mx-auto px-4">
          <p className="text-brand-gold text-sm font-bold tracking-widest uppercase mb-3">
            EARTHGANG Family
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4">
            {locale === 'th' ? 'ระบบสมาชิก'
             : locale === 'zh' ? '会员系统' : 'Membership'}
          </h1>
          <p className="text-brand-gray max-w-xl mx-auto text-sm leading-relaxed">
            {locale === 'th'
              ? 'เข้าร่วม EARTHGANG Family รับสิทธิพิเศษ ส่วนลด คะแนนสะสม และประสบการณ์ VIP'
              : locale === 'zh'
              ? '加入EARTHGANG Family，享受专属特权、折扣、积分和VIP体验'
              : 'Join EARTHGANG Family. Enjoy exclusive privileges, discounts, loyalty points, and VIP experiences.'}
          </p>
          <div className="divider-red mx-auto mt-6" />
        </div>
      </div>

      {/* Tier Cards */}
      <div className="container-max mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {MEMBERSHIP_PLANS.map((plan, index) => {
            const isGold = plan.tier === 'gold';
            const benefits = locale === 'th' ? plan.benefits_th
                           : locale === 'zh' ? plan.benefits_zh
                           : plan.benefits_en;

            return (
              <div
                key={plan.tier}
                className={`relative rounded-2xl border overflow-hidden transition-all duration-300
                            hover:-translate-y-2 hover:shadow-2xl
                            ${isGold
                              ? 'border-yellow-500 ring-2 ring-yellow-500/30'
                              : 'border-brand-dark-3 hover:border-brand-red'
                            }`}
                style={{ background: '#191919' }}
              >
                {isGold && (
                  <div className="absolute top-0 left-0 right-0 flex justify-center">
                    <span className="bg-yellow-500 text-black text-[10px] font-black
                                     tracking-widest uppercase px-4 py-1 rounded-b-full">
                      ⭐ POPULAR
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className={`p-6 pt-${isGold ? '8' : '6'} text-center`}
                     style={{ background: `linear-gradient(135deg, ${plan.color}22, transparent)` }}>
                  <div className="text-5xl mb-3">{plan.icon}</div>
                  <h3 className="text-xl font-black text-white tracking-wider uppercase">
                    {locale === 'th' ? plan.name_th
                     : locale === 'zh' ? plan.name_zh : plan.name_en}
                  </h3>
                  <div className="mt-3">
                    <span className="text-4xl font-black text-white">
                      {plan.price_thb.toLocaleString()}
                    </span>
                    <span className="text-brand-gold text-lg ml-1">฿</span>
                    <p className="text-brand-gray text-xs mt-1">
                      / {locale === 'th' ? 'ปี' : locale === 'zh' ? '年' : 'year'}
                      {' '}· (~{plan.price_per_month.toLocaleString()}฿/mo)
                    </p>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10">
                    <div>
                      <p className="text-brand-red font-black text-lg">{plan.discount_percent}%</p>
                      <p className="text-brand-gray text-[10px]">
                        {locale === 'th' ? 'ส่วนลด' : 'off'}
                      </p>
                    </div>
                    <div>
                      <p className="text-brand-gold font-black text-lg">
                        {plan.free_touchups === 99 ? '∞' : plan.free_touchups}
                      </p>
                      <p className="text-brand-gray text-[10px]">
                        {locale === 'th' ? 'touch-ups' : 'touch-ups'}
                      </p>
                    </div>
                    <div>
                      <p className="text-green-400 font-black text-lg">{plan.points_multiplier}x</p>
                      <p className="text-brand-gray text-[10px]">points</p>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="p-5">
                  <ul className="space-y-2">
                    {benefits.map((benefit, i) => (
                      <li key={i} className="text-sm text-brand-gray-light leading-snug">
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/${locale}/account?join=${plan.tier}`}
                    className={`mt-6 w-full flex items-center justify-center gap-2 font-bold
                                text-sm py-3 rounded-xl transition-all duration-300
                                ${isGold
                                  ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-gold-glow'
                                  : 'bg-brand-dark-2 border border-brand-dark-3 text-white hover:border-brand-red hover:bg-brand-red'
                                }`}
                  >
                    {plan.icon}&nbsp;
                    {locale === 'th' ? `สมัคร ${plan.name_th}`
                     : locale === 'zh' ? `加入 ${plan.name_zh}` : `Join ${plan.name_en}`}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="container-max mx-auto px-4 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white">
            {locale === 'th' ? '📊 เปรียบเทียบสิทธิประโยชน์'
             : locale === 'zh' ? '权益对比表' : 'Benefits Comparison'}
          </h2>
          <div className="divider-red mx-auto mt-4" />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-brand-dark-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-dark-2">
                <th className="text-left p-4 text-brand-gray font-bold">
                  {locale === 'th' ? 'สิทธิประโยชน์' : 'Benefit'}
                </th>
                {MEMBERSHIP_PLANS.map(p => (
                  <th key={p.tier} className="text-center p-4">
                    <div className="text-2xl">{p.icon}</div>
                    <p className="text-white font-black text-xs tracking-wider uppercase mt-1">
                      {p.name_en}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  feature: locale === 'th' ? 'ส่วนลดทุกบริการ' : 'Discount on all services',
                  values: ['5%', '10%', '15%', '20%'],
                },
                {
                  feature: locale === 'th' ? 'จองคิวก่อนบุคคลทั่วไป' : 'Priority Booking',
                  values: ['24h', '48h', '7 days', locale === 'th' ? 'ทุกเวลา' : 'Anytime'],
                },
                {
                  feature: locale === 'th' ? 'Touch-up ฟรี/ปี' : 'Free Touch-ups/year',
                  values: ['0', '1', '2', '∞'],
                },
                {
                  feature: locale === 'th' ? 'Points Multiplier' : 'Points Multiplier',
                  values: ['1x', '1.5x', '2x', '3x'],
                },
                {
                  feature: locale === 'th' ? 'Aftercare Kit ฟรี' : 'Free Aftercare Kit',
                  values: ['❌', '✅', '✅ Premium', '✅ Deluxe x2'],
                },
                {
                  feature: locale === 'th' ? 'ส่วนลดวันเกิด' : 'Birthday Discount',
                  values: ['10%', '15%', '20%', '25%'],
                },
                {
                  feature: locale === 'th' ? 'Custom Design ฟรี' : 'Free Custom Design',
                  values: ['❌', '❌', '1 ครั้ง/ปี', locale === 'th' ? 'ไม่จำกัด' : 'Unlimited'],
                },
                {
                  feature: locale === 'th' ? 'VIP Event' : 'VIP Events',
                  values: ['❌', '✅', '✅', '✅ Gala Night'],
                },
              ].map((row, ri) => (
                <tr
                  key={ri}
                  className={`border-t border-brand-dark-3 ${ri % 2 === 0 ? '' : 'bg-brand-dark-2/30'}`}
                >
                  <td className="p-4 text-brand-gray-light font-medium">{row.feature}</td>
                  {row.values.map((val, vi) => (
                    <td key={vi} className="p-4 text-center">
                      <span className={
                        val === '❌' ? 'text-brand-gray/40' :
                        vi === 3 ? 'text-yellow-400 font-bold' :
                        'text-white font-medium'
                      }>
                        {val}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Loyalty Points Section */}
      <div className="bg-brand-dark py-16">
        <div className="container-max mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-brand-gold text-sm font-bold tracking-widest uppercase mb-2">⭐ Loyalty Program</p>
            <h2 className="text-3xl font-black text-white">
              {locale === 'th' ? 'ระบบสะสมคะแนน' : 'Loyalty Points System'}
            </h2>
            <div className="divider-red mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card-dark p-6 rounded-xl text-center">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-white font-bold mb-2">
                {locale === 'th' ? 'รับคะแนน' : 'Earn Points'}
              </h3>
              <p className="text-brand-gray text-sm">
                {locale === 'th'
                  ? 'ทุก 100฿ ที่ใช้บริการ = 5–15 คะแนน (ขึ้นอยู่กับระดับสมาชิก)'
                  : 'Every 100฿ spent = 5–15 points (based on tier)'}
              </p>
            </div>
            <div className="card-dark p-6 rounded-xl text-center">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="text-white font-bold mb-2">
                {locale === 'th' ? 'แลกส่วนลด' : 'Redeem'}
              </h3>
              <p className="text-brand-gray text-sm">
                {locale === 'th'
                  ? '100 คะแนน = 3–12฿ ส่วนลด (ขึ้นอยู่กับระดับสมาชิก)'
                  : '100 points = 3–12฿ discount (based on tier)'}
              </p>
            </div>
            <div className="card-dark p-6 rounded-xl text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-white font-bold mb-2">
                {locale === 'th' ? 'โบนัสพิเศษ' : 'Bonus Points'}
              </h3>
              <p className="text-brand-gray text-sm">
                {locale === 'th'
                  ? 'รับโบนัสพิเศษในวันเกิด รีวิว และการแนะนำเพื่อน'
                  : 'Bonus points on birthday, reviews, and referrals'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="container-max mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white">
            {locale === 'th' ? '❓ คำถามที่พบบ่อย' : 'FAQ'}
          </h2>
          <div className="divider-red mx-auto mt-4" />
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
          {faq.map((item, i) => (
            <div key={i} className="card-dark rounded-xl p-5">
              <h3 className="text-white font-bold mb-2">
                {locale === 'th' ? item.q_th : item.q_en}
              </h3>
              <p className="text-brand-gray text-sm leading-relaxed">
                {locale === 'th' ? item.a_th : item.a_en}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-brand-red py-16">
        <div className="container-max mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            💎 {locale === 'th' ? 'เริ่มต้นด้วย Bronze เพียง 1,000฿/ปี'
                : 'Start with Bronze for just 1,000฿/year'}
          </h2>
          <p className="text-white/80 mb-6">
            {locale === 'th' ? 'เพียง 83฿/เดือน รับส่วนลด 5% ทันที!'
             : 'Just 83฿/month — get 5% off instantly!'}
          </p>
          <Link href={`/${locale}/account?join=bronze`} className="inline-flex items-center gap-2
            bg-white text-brand-red font-black px-8 py-4 rounded-xl hover:bg-brand-black hover:text-white transition-all">
            🥉 {locale === 'th' ? 'สมัครสมาชิกเลย' : 'Join Now'}
          </Link>
        </div>
      </div>
    </div>
  );
}
