// ============================================
// EARTHGANG — Membership Tiers Configuration
// Pricing based on Chiang Mai 2026 economy
// ============================================

import { MembershipPlan, MembershipTier, PointsRedemptionRate } from '@/types';

// Chiang Mai Pricing Rationale:
// - Average tattoo session in CM: 2,000–15,000 THB
// - Local income: ~18,000–25,000 THB/month
// - Prices accessible yet premium for the brand
// - Bronze = coffee-money per month (83฿/mo) → great entry
// - Silver = cheap dinner per month (208฿/mo) → regular clients
// - Gold   = nice dinner per month (417฿/mo) → loyal collectors
// - Platinum = fine dining per month (833฿/mo) → VIP collectors

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    tier: 'bronze',
    name_th: 'บรอนซ์',
    name_en: 'Bronze',
    name_zh: '铜牌',
    price_thb: 1000,
    price_per_month: 83,
    discount_percent: 5,
    free_touchups: 0,
    points_multiplier: 1.0,
    color: '#CD7F32',
    icon: '🥉',
    badge_color: 'from-amber-700 to-amber-900',
    benefits_th: [
      '✅ ส่วนลด 5% สำหรับบริการทั้งหมด',
      '✅ สิทธิ์จองคิวก่อนบุคคลทั่วไป 24 ชั่วโมง',
      '✅ สะสม Loyalty Points 1x',
      '✅ รับของขวัญวันเกิดสุดพิเศษ',
      '✅ รับ Aftercare Guide ดิจิทัล',
      '✅ เข้าถึง Community LINE Group',
    ],
    benefits_en: [
      '✅ 5% discount on all services',
      '✅ Priority booking 24hrs before public',
      '✅ Loyalty Points 1x multiplier',
      '✅ Birthday gift surprise',
      '✅ Digital Aftercare Guide',
      '✅ Access to Community LINE Group',
    ],
    benefits_zh: [
      '✅ 所有服务享5%折扣',
      '✅ 提前24小时优先预约',
      '✅ 积分1倍累积',
      '✅ 生日惊喜礼物',
      '✅ 数字护理指南',
      '✅ 加入社群LINE群组',
    ],
  },
  {
    tier: 'silver',
    name_th: 'ซิลเวอร์',
    name_en: 'Silver',
    name_zh: '银牌',
    price_thb: 2500,
    price_per_month: 208,
    discount_percent: 10,
    free_touchups: 1,
    points_multiplier: 1.5,
    color: '#A8A9AD',
    icon: '🥈',
    badge_color: 'from-gray-400 to-gray-600',
    benefits_th: [
      '✅ ส่วนลด 10% สำหรับบริการทั้งหมด',
      '✅ สิทธิ์จองคิวก่อนบุคคลทั่วไป 48 ชั่วโมง',
      '✅ สะสม Loyalty Points 1.5x',
      '✅ Touch-up ฟรี 1 ครั้งต่อปี',
      '✅ ชุด Aftercare Kit ฟรี',
      '✅ รับของขวัญวันเกิด + ส่วนลดพิเศษ 15%',
      '✅ เข้าถึง Flash Sale ก่อนใคร',
      '✅ เข้าร่วม Members-only Event',
    ],
    benefits_en: [
      '✅ 10% discount on all services',
      '✅ Priority booking 48hrs before public',
      '✅ Loyalty Points 1.5x multiplier',
      '✅ 1 free touch-up per year',
      '✅ Free Aftercare Kit',
      '✅ Birthday gift + 15% special discount',
      '✅ Early access to Flash Sales',
      '✅ Members-only event access',
    ],
    benefits_zh: [
      '✅ 所有服务享10%折扣',
      '✅ 提前48小时优先预约',
      '✅ 积分1.5倍累积',
      '✅ 每年1次免费补色',
      '✅ 免费护理套装',
      '✅ 生日礼物+15%特别折扣',
      '✅ 闪购优先通知',
      '✅ 会员专属活动',
    ],
  },
  {
    tier: 'gold',
    name_th: 'โกลด์',
    name_en: 'Gold',
    name_zh: '金牌',
    price_thb: 5000,
    price_per_month: 417,
    discount_percent: 15,
    free_touchups: 2,
    points_multiplier: 2.0,
    color: '#D4AF37',
    icon: '🥇',
    badge_color: 'from-yellow-500 to-yellow-700',
    benefits_th: [
      '✅ ส่วนลด 15% สำหรับบริการทั้งหมด',
      '✅ VIP Booking — จองคิวล่วงหน้า 7 วัน',
      '✅ สะสม Loyalty Points 2x',
      '✅ Touch-up ฟรี 2 ครั้งต่อปี',
      '✅ ชุด Aftercare Kit Premium ฟรี',
      '✅ วันเกิด: ส่วนลด 20% + Tattoo Voucher 500฿',
      '✅ การออกแบบลายเฉพาะ (Custom Design) ฟรี 1 ครั้ง',
      '✅ เชิญสู่ VIP Event พร้อมเครื่องดื่ม',
      '✅ ชื่อบน Wall of Fame ในสตูดิโอ',
    ],
    benefits_en: [
      '✅ 15% discount on all services',
      '✅ VIP Booking — 7 days advance priority',
      '✅ Loyalty Points 2x multiplier',
      '✅ 2 free touch-ups per year',
      '✅ Free Premium Aftercare Kit',
      '✅ Birthday: 20% off + 500฿ Tattoo Voucher',
      '✅ 1 free custom design consultation',
      '✅ VIP Event invitations with drinks',
      '✅ Name on Studio Wall of Fame',
    ],
    benefits_zh: [
      '✅ 所有服务享15%折扣',
      '✅ VIP预约 — 提前7天优先',
      '✅ 积分2倍累积',
      '✅ 每年2次免费补色',
      '✅ 免费高级护理套装',
      '✅ 生日：20%折扣+500฿纹身券',
      '✅ 1次免费定制设计咨询',
      '✅ VIP活动邀请含饮品',
      '✅ 工作室名人墙留名',
    ],
  },
  {
    tier: 'platinum',
    name_th: 'แพลตินัม',
    name_en: 'Platinum',
    name_zh: '白金',
    price_thb: 10000,
    price_per_month: 833,
    discount_percent: 20,
    free_touchups: 99, // unlimited
    points_multiplier: 3.0,
    color: '#E5E4E2',
    icon: '💎',
    badge_color: 'from-slate-300 to-slate-500',
    benefits_th: [
      '✅ ส่วนลด 20% สำหรับบริการทั้งหมด',
      '✅ PLATINUM Booking — จองทุกเวลา ทุกวัน',
      '✅ สะสม Loyalty Points 3x',
      '✅ Touch-up ไม่จำกัดตลอดปี',
      '✅ ชุด Aftercare Kit Deluxe ฟรี (2 ชุด/ปี)',
      '✅ วันเกิด: 25% off + Voucher 1,000฿ + ของขวัญพิเศษ',
      '✅ ออกแบบลายเฉพาะไม่จำกัด + ปรึกษาส่วนตัว',
      '✅ VIP Lounge Access + บริการ Personal Artist',
      '✅ เชิญสู่ Gala Night ประจำปี',
      '✅ ชื่อบน Premium Wall of Fame พร้อมกรอบทอง',
      '✅ Priority รับช่างศิลปิน Guest Artist ชื่อดัง',
      '✅ ส่วนลด 10% สำหรับ Merch ทั้งหมด',
    ],
    benefits_en: [
      '✅ 20% discount on all services',
      '✅ PLATINUM Booking — anytime, any day',
      '✅ Loyalty Points 3x multiplier',
      '✅ Unlimited touch-ups all year',
      '✅ Free Deluxe Aftercare Kit (2 sets/year)',
      '✅ Birthday: 25% off + 1,000฿ Voucher + special gift',
      '✅ Unlimited custom designs + personal consultations',
      '✅ VIP Lounge Access + Personal Artist service',
      '✅ Annual Gala Night invitation',
      '✅ Premium Wall of Fame with gold frame',
      '✅ Priority access to Guest Artist bookings',
      '✅ 10% discount on all merchandise',
    ],
    benefits_zh: [
      '✅ 所有服务享20%折扣',
      '✅ 白金预约 — 随时随地优先',
      '✅ 积分3倍累积',
      '✅ 全年无限次补色',
      '✅ 免费豪华护理套装（每年2套）',
      '✅ 生日：25%折扣+1,000฿券+特别礼物',
      '✅ 无限定制设计+个人咨询',
      '✅ VIP休息室+专属艺术家服务',
      '✅ 年度晚宴邀请',
      '✅ 黄金相框高级名人墙',
      '✅ 特邀艺术家预约优先权',
      '✅ 所有周边商品9折',
    ],
  },
];

// ---------- Points Redemption Rates ----------
export const POINTS_RATES: Record<MembershipTier, PointsRedemptionRate> = {
  none:     { tier: 'none',     points_per_100thb: 1,  thb_per_100points: 0.5 },
  bronze:   { tier: 'bronze',   points_per_100thb: 5,  thb_per_100points: 3   },
  silver:   { tier: 'silver',   points_per_100thb: 8,  thb_per_100points: 5   },
  gold:     { tier: 'gold',     points_per_100thb: 10, thb_per_100points: 8   },
  platinum: { tier: 'platinum', points_per_100thb: 15, thb_per_100points: 12  },
};

// ---------- Helper Functions ----------
export function getMembershipPlan(tier: MembershipTier): MembershipPlan | undefined {
  return MEMBERSHIP_PLANS.find(p => p.tier === tier);
}

export function calculateMemberDiscount(price: number, tier: MembershipTier): number {
  const plan = getMembershipPlan(tier);
  if (!plan) return 0;
  return Math.floor(price * plan.discount_percent / 100);
}

export function calculatePointsEarned(price: number, tier: MembershipTier): number {
  const rate = POINTS_RATES[tier];
  return Math.floor((price / 100) * rate.points_per_100thb);
}

export function calculatePointsValue(points: number, tier: MembershipTier): number {
  const rate = POINTS_RATES[tier];
  return Math.floor((points / 100) * rate.thb_per_100points);
}

export function getNextTier(tier: MembershipTier): MembershipTier | null {
  const tiers: MembershipTier[] = ['none', 'bronze', 'silver', 'gold', 'platinum'];
  const idx = tiers.indexOf(tier);
  return idx < tiers.length - 1 ? tiers[idx + 1] : null;
}

export const DEPOSIT_PERCENT = 0.30; // 30% deposit

export function calculateDeposit(total: number): number {
  return Math.ceil(total * DEPOSIT_PERCENT);
}
