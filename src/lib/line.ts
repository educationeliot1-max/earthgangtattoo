// ============================================
// LINE OA Automation — EARTHGANG Tattoo Studio
// ============================================

import { Booking } from '@/types';

const LINE_API = 'https://api.line.me/v2/bot/message';
const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN!;

// ---------- Send Flex Message ----------
export async function sendLineMessage(userId: string, messages: object[]) {
  const res = await fetch(`${LINE_API}/push`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ to: userId, messages }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('LINE API Error:', err);
    throw new Error(`LINE API failed: ${err}`);
  }
  return res.json();
}

// ---------- Broadcast to All Followers ----------
export async function broadcastLineMessage(messages: object[]) {
  const res = await fetch(`${LINE_API}/broadcast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ messages }),
  });
  return res.json();
}

// ---------- Booking Confirmation Message ----------
export function buildBookingConfirmMessage(booking: Booking): object[] {
  const dateStr = new Date(booking.date).toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return [
    {
      type: 'flex',
      altText: `✅ ยืนยันการจอง ${booking.booking_ref}`,
      contents: {
        type: 'bubble',
        size: 'mega',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#D70000',
          paddingAll: '20px',
          contents: [
            {
              type: 'text',
              text: '🔖 EARTHGANG O.G. TATTOO',
              color: '#FFFFFF',
              size: 'sm',
              weight: 'bold',
            },
            {
              type: 'text',
              text: '✅ ยืนยันการจองแล้ว',
              color: '#FFFFFF',
              size: 'xl',
              weight: 'bold',
            },
          ],
        },
        body: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#1A1A1A',
          paddingAll: '20px',
          spacing: 'md',
          contents: [
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                { type: 'text', text: '📋 เลขที่จอง', color: '#888888', size: 'sm', flex: 2 },
                { type: 'text', text: booking.booking_ref, color: '#D4AF37', size: 'sm', weight: 'bold', flex: 3 },
              ],
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                { type: 'text', text: '🎨 ช่างศิลปิน', color: '#888888', size: 'sm', flex: 2 },
                { type: 'text', text: booking.artist?.nickname || 'TBD', color: '#FFFFFF', size: 'sm', flex: 3 },
              ],
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                { type: 'text', text: '📅 วันที่', color: '#888888', size: 'sm', flex: 2 },
                { type: 'text', text: dateStr, color: '#FFFFFF', size: 'sm', flex: 3, wrap: true },
              ],
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                { type: 'text', text: '⏰ เวลา', color: '#888888', size: 'sm', flex: 2 },
                { type: 'text', text: booking.time, color: '#FFFFFF', size: 'sm', flex: 3 },
              ],
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                { type: 'text', text: '💰 ราคารวม', color: '#888888', size: 'sm', flex: 2 },
                { type: 'text', text: `${booking.total_price_thb.toLocaleString()} ฿`, color: '#D4AF37', size: 'sm', weight: 'bold', flex: 3 },
              ],
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                { type: 'text', text: '💳 มัดจำ (30%)', color: '#888888', size: 'sm', flex: 2 },
                { type: 'text', text: `${booking.deposit_thb.toLocaleString()} ฿`, color: '#FF6B6B', size: 'sm', weight: 'bold', flex: 3 },
              ],
            },
            { type: 'separator', color: '#333333' },
            {
              type: 'text',
              text: '📍 141/2 ถ.กำแพงดิน เมืองเชียงใหม่',
              color: '#888888',
              size: 'xs',
              wrap: true,
            },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#222222',
          paddingAll: '15px',
          spacing: 'sm',
          contents: [
            {
              type: 'button',
              action: {
                type: 'uri',
                label: '📅 ดูรายละเอียดการจอง',
                uri: `${process.env.NEXT_PUBLIC_SITE_URL}/account/bookings`,
              },
              style: 'primary',
              color: '#D70000',
              height: 'sm',
            },
            {
              type: 'button',
              action: {
                type: 'uri',
                label: '📞 ติดต่อสตูดิโอ',
                uri: `tel:0618042224`,
              },
              style: 'secondary',
              height: 'sm',
            },
          ],
        },
      },
    },
  ];
}

// ---------- Reminder Message (24h before) ----------
export function buildReminderMessage(booking: Booking): object[] {
  return [
    {
      type: 'flex',
      altText: `⏰ เตือนความจำ: นัดวันพรุ่งนี้ ${booking.time}`,
      contents: {
        type: 'bubble',
        size: 'kilo',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#D70000',
          paddingAll: '15px',
          contents: [
            { type: 'text', text: '⏰ เตือนความจำ', color: '#FFFFFF', size: 'lg', weight: 'bold' },
          ],
        },
        body: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#1A1A1A',
          paddingAll: '20px',
          spacing: 'md',
          contents: [
            { type: 'text', text: 'นัดของคุณพรุ่งนี้นี้!', color: '#FFFFFF', size: 'lg', weight: 'bold' },
            { type: 'text', text: `🕐 ${booking.time} น. กับ ${booking.artist?.nickname}`, color: '#D4AF37', size: 'md' },
            { type: 'separator', color: '#333333' },
            { type: 'text', text: '📋 สิ่งที่ต้องเตรียม:', color: '#FFFFFF', size: 'sm', weight: 'bold' },
            { type: 'text', text: '• ดื่มน้ำและทานอาหารให้อิ่ม\n• นอนหลับพักผ่อนให้เพียงพอ\n• ใส่เสื้อผ้าที่เข้าถึงตำแหน่งสัก\n• หลีกเลี่ยงแอลกอฮอล์ 24 ชั่วโมงก่อน', color: '#CCCCCC', size: 'sm', wrap: true },
          ],
        },
      },
    },
  ];
}

// ---------- Deposit Paid Message ----------
export function buildDepositPaidMessage(booking: Booking): object[] {
  return [
    {
      type: 'flex',
      altText: `💳 รับมัดจำแล้ว ${booking.deposit_thb.toLocaleString()} ฿`,
      contents: {
        type: 'bubble',
        size: 'kilo',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#006600',
          paddingAll: '15px',
          contents: [
            { type: 'text', text: '💳 รับมัดจำแล้ว!', color: '#FFFFFF', size: 'xl', weight: 'bold' },
          ],
        },
        body: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#1A1A1A',
          paddingAll: '20px',
          spacing: 'md',
          contents: [
            { type: 'text', text: `รับมัดจำ ${booking.deposit_thb.toLocaleString()} ฿ เรียบร้อยแล้ว`, color: '#FFFFFF', size: 'md', wrap: true },
            { type: 'text', text: `ยอดที่เหลือชำระวันนัด: ${booking.remaining_thb.toLocaleString()} ฿`, color: '#D4AF37', size: 'md', wrap: true },
            { type: 'text', text: `📅 ${booking.date} เวลา ${booking.time}`, color: '#CCCCCC', size: 'sm' },
          ],
        },
      },
    },
  ];
}

// ---------- Studio Admin Notification ----------
export async function notifyStudioAdmin(booking: Booking): Promise<void> {
  const ADMIN_LINE_ID = process.env.LINE_ADMIN_USER_ID;
  if (!ADMIN_LINE_ID) return;

  const message = [{
    type: 'text',
    text: `🔔 การจองใหม่!\n\n📋 ${booking.booking_ref}\n👤 ${booking.user?.full_name}\n📱 ${booking.user?.phone}\n🎨 ${booking.artist?.nickname}\n📅 ${booking.date} ${booking.time}\n💰 ${booking.total_price_thb.toLocaleString()} ฿\n💳 มัดจำ: ${booking.deposit_thb.toLocaleString()} ฿`,
  }];

  await sendLineMessage(ADMIN_LINE_ID, message);
}

// ---------- LINE Webhook Handler ----------
export function parseWebhookEvent(body: {
  events: Array<{
    type: string;
    replyToken: string;
    source: { userId: string };
    message?: { text: string };
  }>;
}) {
  return body.events;
}

export async function replyLineMessage(replyToken: string, messages: object[]) {
  const res = await fetch(`${LINE_API}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });
  return res.json();
}

// ---------- Auto-reply Handler ----------
export async function handleAutoReply(event: {
  type: string;
  replyToken: string;
  source: { userId: string };
  message?: { text: string };
}) {
  if (event.type !== 'message' || !event.message?.text) return;
  const text = event.message.text.toLowerCase().trim();

  let reply: object[] = [];

  if (text.includes('จอง') || text.includes('book') || text.includes('预约')) {
    reply = [{
      type: 'text',
      text: '📅 จองคิวได้เลยที่:\nhttps://www.earthgangtattoo.com/book\n\nหรือโทร: 061-804-2224\nเปิด: อังคาร–เสาร์ 10:00–20:00',
    }];
  } else if (text.includes('ราคา') || text.includes('price') || text.includes('价格')) {
    reply = [{
      type: 'text',
      text: '💰 ราคาเริ่มต้นขึ้นอยู่กับขนาดและความซับซ้อน:\n\n• Fineline เล็ก: เริ่ม 2,000฿\n• Blackwork กลาง: เริ่ม 4,000฿\n• Traditional ใหญ่: เริ่ม 6,000฿\n• Custom: ขึ้นอยู่กับดีไซน์\n\nดูเพิ่มเติม: earthgangtattoo.com/services',
    }];
  } else if (text.includes('สมาชิก') || text.includes('member') || text.includes('会员')) {
    reply = [{
      type: 'text',
      text: '💎 สมัครสมาชิก EARTHGANG:\n\n🥉 Bronze: 1,000฿/ปี (ส่วนลด 5%)\n🥈 Silver: 2,500฿/ปี (ส่วนลด 10%)\n🥇 Gold: 5,000฿/ปี (ส่วนลด 15%)\n💎 Platinum: 10,000฿/ปี (ส่วนลด 20%)\n\nดูรายละเอียด: earthgangtattoo.com/membership',
    }];
  } else if (text.includes('ที่ตั้ง') || text.includes('address') || text.includes('地址') || text.includes('แผนที่')) {
    reply = [{
      type: 'location',
      title: 'EARTHGANG O.G. Tattoo Studio',
      address: '141/2 Kampangdin Rd, Tambon Phra Sing, Mueang Chiang Mai 50100',
      latitude: 18.7878,
      longitude: 98.9897,
    }];
  } else if (text.includes('เวลา') || text.includes('hours') || text.includes('open') || text.includes('เปิด')) {
    reply = [{
      type: 'text',
      text: '🕐 เวลาทำการ:\nอังคาร – เสาร์: 10:00–20:00\nอาทิตย์: นัดหมายเท่านั้น\nจันทร์: ปิด\n\n📞 061-804-2224',
    }];
  } else {
    reply = [{
      type: 'text',
      text: '👋 สวัสดีครับ! ยินดีต้อนรับสู่ EARTHGANG O.G. Tattoo Studio\n\nพิมพ์:\n📅 "จอง" — จองคิว\n💰 "ราคา" — ดูราคา\n💎 "สมาชิก" — สิทธิประโยชน์\n📍 "ที่ตั้ง" — แผนที่\n🕐 "เวลา" — เวลาเปิด/ปิด',
    }];
  }

  await replyLineMessage(event.replyToken, reply);
}
