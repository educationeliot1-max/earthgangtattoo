// ============================================
// Email Automation — EARTHGANG Tattoo Studio
// ============================================

import { Resend } from 'resend';
import { Booking, User } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = `${process.env.EMAIL_FROM_NAME || 'EARTHGANG O.G. Tattoo Studio'} <${process.env.EMAIL_FROM || 'booking@earthgangtattoo.com'}>`;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.earthgangtattoo.com';

// ---------- Booking Confirmation ----------
export async function sendBookingConfirmation(booking: Booking, user: User) {
  const dateStr = new Date(booking.date).toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const html = `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ยืนยันการจอง — EARTHGANG</title>
  <style>
    body { margin:0; padding:0; background:#0A0A0A; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width:600px; margin:0 auto; background:#1A1A1A; }
    .header { background:#D70000; padding:30px; text-align:center; }
    .header h1 { color:#fff; margin:0; font-size:28px; letter-spacing:3px; }
    .header p { color:rgba(255,255,255,0.8); margin:5px 0 0; font-size:14px; }
    .body { padding:30px; }
    .badge { background:#D70000; color:#fff; display:inline-block; padding:5px 15px; border-radius:20px; font-size:12px; font-weight:bold; margin-bottom:20px; }
    .info-row { display:flex; justify-content:space-between; border-bottom:1px solid #333; padding:12px 0; }
    .info-label { color:#888; font-size:14px; }
    .info-value { color:#fff; font-size:14px; font-weight:bold; }
    .highlight { color:#D4AF37 !important; }
    .total-box { background:#222; border:1px solid #D70000; border-radius:8px; padding:20px; margin:20px 0; text-align:center; }
    .total-box .amount { font-size:32px; color:#D4AF37; font-weight:bold; }
    .deposit-box { background:#1e3a1e; border:1px solid #2d7a2d; border-radius:8px; padding:15px; margin:10px 0; }
    .cta-btn { display:block; background:#D70000; color:#fff; text-decoration:none; text-align:center; padding:15px 30px; border-radius:8px; font-size:16px; font-weight:bold; margin:20px 0; }
    .steps { counter-reset: step; }
    .step { counter-increment: step; padding:10px 0 10px 40px; position:relative; color:#ccc; font-size:14px; }
    .step::before { content: counter(step); position:absolute; left:0; top:10px; background:#D70000; color:#fff; width:25px; height:25px; border-radius:50%; text-align:center; line-height:25px; font-size:12px; font-weight:bold; }
    .footer { background:#111; padding:20px; text-align:center; }
    .footer p { color:#666; font-size:12px; margin:5px 0; }
    .social-links a { color:#D70000; text-decoration:none; margin:0 10px; }
  </style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>EARTHGANG O.G.</h1>
    <p>TATTOO STUDIO · CHIANG MAI</p>
  </div>
  <div class="body">
    <div class="badge">✅ ยืนยันการจองแล้ว</div>
    <p style="color:#fff; font-size:18px;">สวัสดีครับ คุณ${user.full_name} 👋</p>
    <p style="color:#ccc; font-size:14px;">เราได้รับการจองของคุณเรียบร้อยแล้ว กรุณาชำระมัดจำเพื่อยืนยันนัด</p>

    <div class="info-row">
      <span class="info-label">📋 เลขที่จอง</span>
      <span class="info-value highlight">${booking.booking_ref}</span>
    </div>
    <div class="info-row">
      <span class="info-label">🎨 ช่างศิลปิน</span>
      <span class="info-value">${booking.artist?.nickname || 'TBD'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">🖼 บริการ</span>
      <span class="info-value">${booking.service?.name_th || booking.service?.name_en || 'Tattoo Session'}</span>
    </div>
    <div class="info-row">
      <span class="info-label">📅 วันที่</span>
      <span class="info-value">${dateStr}</span>
    </div>
    <div class="info-row">
      <span class="info-label">⏰ เวลา</span>
      <span class="info-value">${booking.time} น.</span>
    </div>
    <div class="info-row">
      <span class="info-label">📍 สถานที่</span>
      <span class="info-value">141/2 ถ.กำแพงดิน เมืองเชียงใหม่</span>
    </div>

    <div class="total-box">
      <p style="color:#888; margin:0 0 5px; font-size:12px;">ราคารวม</p>
      <div class="amount">${booking.total_price_thb.toLocaleString()} ฿</div>
    </div>

    <div class="deposit-box">
      <p style="color:#4CAF50; font-size:16px; font-weight:bold; margin:0 0 5px;">💳 มัดจำที่ต้องชำระ (30%)</p>
      <p style="color:#fff; font-size:24px; font-weight:bold; margin:0;">${booking.deposit_thb.toLocaleString()} ฿</p>
      <p style="color:#aaa; font-size:12px; margin:5px 0 0;">ยอดที่เหลือชำระในวันนัด: ${booking.remaining_thb.toLocaleString()} ฿</p>
    </div>

    <a href="${SITE}/checkout?booking=${booking.id}" class="cta-btn">💳 ชำระมัดจำเดี๋ยวนี้</a>

    <h3 style="color:#D70000; font-size:16px;">📋 ขั้นตอนก่อนวันนัด</h3>
    <div class="steps">
      <div class="step">ชำระมัดจำ 30% ภายใน 24 ชั่วโมง</div>
      <div class="step">ดื่มน้ำให้เพียงพอ วันก่อนนัดและวันนัด</div>
      <div class="step">ทานอาหารให้อิ่มก่อนมาสัก</div>
      <div class="step">งดแอลกอฮอล์อย่างน้อย 24 ชั่วโมงก่อนนัด</div>
      <div class="step">ใส่เสื้อผ้าที่เปิดถึงตำแหน่งที่จะสัก</div>
    </div>

    <a href="${SITE}/account/bookings" style="color:#D70000; font-size:14px; display:block; text-align:center; margin-top:20px;">ดูการจองทั้งหมด →</a>
  </div>
  <div class="footer">
    <p>📞 061-804-2224 | 📍 141/2 ถ.กำแพงดิน เมืองเชียงใหม่</p>
    <p>อังคาร–เสาร์: 10:00–20:00 | อาทิตย์: นัดหมายเท่านั้น</p>
    <div class="social-links">
      <a href="https://instagram.com/earthgangtattoo">Instagram</a>
      <a href="https://facebook.com/earthgangtattoo">Facebook</a>
    </div>
    <p style="margin-top:15px;">© 2026 EARTHGANG O.G. Tattoo Studio. All Rights Reserved.</p>
  </div>
</div>
</body>
</html>`;

  return resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `✅ ยืนยันการจอง ${booking.booking_ref} — EARTHGANG Tattoo`,
    html,
  });
}

// ---------- Deposit Paid Confirmation ----------
export async function sendDepositPaidEmail(booking: Booking, user: User) {
  const html = `
<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8"><title>รับมัดจำแล้ว</title>
<style>body{margin:0;padding:0;background:#0A0A0A;font-family:Arial,sans-serif;}.container{max-width:600px;margin:0 auto;background:#1A1A1A;}.header{background:#006600;padding:25px;text-align:center;}.body{padding:30px;}.cta{display:block;background:#D70000;color:#fff;text-decoration:none;text-align:center;padding:15px;border-radius:8px;margin:20px 0;font-weight:bold;}.footer{background:#111;padding:20px;text-align:center;color:#666;font-size:12px;}</style>
</head>
<body>
<div class="container">
  <div class="header"><h1 style="color:#fff;margin:0;">💳 รับมัดจำแล้ว!</h1></div>
  <div class="body">
    <p style="color:#fff;">สวัสดีครับ คุณ${user.full_name}</p>
    <p style="color:#4CAF50;font-size:20px;font-weight:bold;">รับมัดจำ ${booking.deposit_thb.toLocaleString()} ฿ เรียบร้อยแล้ว ✅</p>
    <p style="color:#ccc;">นัดของคุณได้รับการยืนยันแล้ว!</p>
    <p style="color:#D4AF37;">📅 ${booking.date} เวลา ${booking.time} กับ ${booking.artist?.nickname}</p>
    <p style="color:#aaa;">ยอดที่เหลือชำระในวันนัด: <strong style="color:#fff;">${booking.remaining_thb.toLocaleString()} ฿</strong></p>
    <a href="${SITE}/account/bookings" class="cta">ดูรายละเอียดการจอง</a>
  </div>
  <div class="footer"><p>EARTHGANG O.G. Tattoo Studio · 061-804-2224</p></div>
</div>
</body></html>`;

  return resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `💳 รับมัดจำแล้ว — ${booking.booking_ref}`,
    html,
  });
}

// ---------- 24h Reminder ----------
export async function sendReminderEmail(booking: Booking, user: User) {
  const html = `
<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8"><title>เตือนความจำ</title>
<style>body{margin:0;padding:0;background:#0A0A0A;font-family:Arial,sans-serif;}.container{max-width:600px;margin:0 auto;background:#1A1A1A;}.header{background:#D70000;padding:25px;text-align:center;}.body{padding:30px;}.footer{background:#111;padding:20px;text-align:center;color:#666;font-size:12px;}</style>
</head>
<body>
<div class="container">
  <div class="header"><h1 style="color:#fff;margin:0;">⏰ เตือนความจำ — พรุ่งนี้นี้แล้ว!</h1></div>
  <div class="body">
    <p style="color:#fff;font-size:18px;">สวัสดีครับ คุณ${user.full_name} 👋</p>
    <p style="color:#D4AF37;font-size:20px;font-weight:bold;">พรุ่งนี้ ${booking.time} น. กับ ${booking.artist?.nickname}</p>
    <h3 style="color:#D70000;">✅ Checklist ก่อนมาสัก:</h3>
    <ul style="color:#ccc;line-height:2;">
      <li>💧 ดื่มน้ำให้เพียงพอ</li>
      <li>🍱 ทานอาหารให้อิ่มก่อนมา</li>
      <li>😴 นอนหลับพักผ่อนให้เพียงพอ</li>
      <li>👕 ใส่เสื้อผ้าที่เข้าถึงตำแหน่งสัก</li>
      <li>🚫 งดแอลกอฮอล์ 24 ชั่วโมงก่อน</li>
      <li>🩺 แจ้งหากมีโรคประจำตัวหรือยาที่ทาน</li>
    </ul>
    <p style="color:#888;">📍 141/2 ถ.กำแพงดิน เมืองเชียงใหม่</p>
    <p style="color:#888;">📞 061-804-2224</p>
  </div>
  <div class="footer"><p>EARTHGANG O.G. Tattoo Studio</p></div>
</div>
</body></html>`;

  return resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `⏰ เตือนความจำ: นัดพรุ่งนี้ ${booking.time} น. — EARTHGANG`,
    html,
  });
}

// ---------- Aftercare Instructions ----------
export async function sendAftercareEmail(booking: Booking, user: User) {
  const html = `
<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8"><title>คำแนะนำการดูแลรอยสัก</title>
<style>body{margin:0;padding:0;background:#0A0A0A;font-family:Arial,sans-serif;}.container{max-width:600px;margin:0 auto;background:#1A1A1A;}.header{background:#1a1a2e;border-bottom:3px solid #D70000;padding:25px;text-align:center;}.body{padding:30px;}.care-card{background:#222;border-left:4px solid #D70000;padding:15px;margin:10px 0;border-radius:0 8px 8px 0;}.care-card h4{color:#D4AF37;margin:0 0 8px;}.care-card ul{color:#ccc;margin:0;padding-left:20px;line-height:1.8;font-size:14px;}.footer{background:#111;padding:20px;text-align:center;color:#666;font-size:12px;}</style>
</head>
<body>
<div class="container">
  <div class="header"><h1 style="color:#fff;margin:0;">🩹 คำแนะนำการดูแลรอยสัก</h1><p style="color:#aaa;margin:5px 0 0;">EARTHGANG O.G. Tattoo Studio</p></div>
  <div class="body">
    <p style="color:#fff;">สวัสดีครับ คุณ${user.full_name} 🎨</p>
    <p style="color:#ccc;">ขอบคุณที่ไว้วางใจ EARTHGANG กรุณาดูแลรอยสักตามคำแนะนำเพื่อให้ได้ผลลัพธ์ที่สวยงามและยั่งยืน</p>

    <div class="care-card">
      <h4>วันที่ 1–3: ทันทีหลังสัก</h4>
      <ul>
        <li>เก็บฟิล์มครอบไว้ 2–4 ชั่วโมงหลังสัก</li>
        <li>ล้างด้วยสบู่อ่อนๆ ด้วยมือเปล่า ห้ามใช้ฟองน้ำ</li>
        <li>ซับให้แห้งด้วยกระดาษทิชชู่สะอาด ห้ามถู</li>
        <li>ทามอยส์เจอไรเซอร์บางๆ เช่น Lubriderm หรือ Aquaphor</li>
      </ul>
    </div>
    <div class="care-card">
      <h4>สัปดาห์ที่ 1–2: ระยะสมาน</h4>
      <ul>
        <li>ทาครีมบางๆ วันละ 2–3 ครั้ง</li>
        <li>ห้ามแกะหรือดึงสะเก็ด</li>
        <li>ห้ามแช่น้ำนานๆ (สระว่ายน้ำ, ทะเล, อ่างอาบน้ำ)</li>
        <li>อาบน้ำได้ตามปกติ แต่ห้ามให้โดนน้ำแรงๆ</li>
      </ul>
    </div>
    <div class="care-card">
      <h4>สัปดาห์ที่ 3–4: ระยะฟื้นตัว</h4>
      <ul>
        <li>ทาครีมกันแดด SPF 50+ เมื่อออกแดด</li>
        <li>หลีกเลี่ยงแสงแดดโดยตรงนานๆ</li>
        <li>ผิวอาจลอกหรือคัน นั่นคือสัญญาณปกติ</li>
      </ul>
    </div>
    <div class="care-card">
      <h4>🚫 สิ่งที่ต้องหลีกเลี่ยง</h4>
      <ul>
        <li>ห้ามโดนแสงแดดโดยตรงนาน</li>
        <li>ห้ามแช่น้ำนาน</li>
        <li>ห้ามออกกำลังกายหนักใน 48 ชั่วโมงแรก</li>
        <li>ห้ามใช้ผลิตภัณฑ์ที่มีส่วนผสมของแอลกอฮอล์</li>
      </ul>
    </div>

    <p style="color:#aaa;font-size:13px;margin-top:20px;">หากมีอาการผิดปกติ เช่น บวม แดง หรือมีของเหลวไหล กรุณาติดต่อเราทันที</p>
    <p style="color:#D70000;font-weight:bold;">📞 061-804-2224</p>
    <p style="color:#aaa;font-size:13px;">สมาชิก Silver ขึ้นไปสามารถรับ Touch-up ฟรีตามสิทธิ์ได้เลย!</p>
  </div>
  <div class="footer"><p>EARTHGANG O.G. Tattoo Studio · 141/2 ถ.กำแพงดิน เชียงใหม่</p></div>
</div>
</body></html>`;

  return resend.emails.send({
    from: FROM,
    to: user.email,
    subject: '🩹 คำแนะนำการดูแลรอยสัก — EARTHGANG',
    html,
  });
}

// ---------- Welcome Member Email ----------
export async function sendMemberWelcomeEmail(user: User) {
  const tierEmoji: Record<string, string> = {
    bronze: '🥉', silver: '🥈', gold: '🥇', platinum: '💎',
  };
  const emoji = tierEmoji[user.membership_tier] || '🎉';

  const html = `
<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8"><title>ยินดีต้อนรับสู่ EARTHGANG Family</title>
<style>body{margin:0;background:#0A0A0A;font-family:Arial,sans-serif;}.c{max-width:600px;margin:0 auto;background:#1A1A1A;}.h{background:linear-gradient(135deg,#D70000,#AA0000);padding:40px;text-align:center;}.b{padding:30px;}.f{background:#111;padding:20px;text-align:center;color:#666;font-size:12px;}</style>
</head>
<body>
<div class="c">
  <div class="h">
    <div style="font-size:60px;">${emoji}</div>
    <h1 style="color:#fff;margin:10px 0 5px;">ยินดีต้อนรับ!</h1>
    <p style="color:rgba(255,255,255,0.8);margin:0;">คุณเป็นสมาชิก ${user.membership_tier.toUpperCase()} แล้ว</p>
  </div>
  <div class="b">
    <p style="color:#fff;font-size:18px;">สวัสดีครับ คุณ${user.full_name} ${emoji}</p>
    <p style="color:#ccc;">ขอบคุณที่เข้าร่วมเป็น EARTHGANG Family! ตอนนี้คุณสามารถรับสิทธิประโยชน์ทั้งหมดของแพลนได้เลย</p>
    <div style="background:#222;border:1px solid #D4AF37;border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
      <p style="color:#D4AF37;font-size:24px;font-weight:bold;margin:0;">${user.loyalty_points} Points</p>
      <p style="color:#888;font-size:12px;margin:5px 0 0;">Loyalty Points เริ่มต้น</p>
    </div>
    <a href="${SITE}/membership" style="display:block;background:#D70000;color:#fff;text-decoration:none;text-align:center;padding:15px;border-radius:8px;font-weight:bold;margin:20px 0;">ดูสิทธิประโยชน์ทั้งหมด →</a>
    <a href="${SITE}/book" style="display:block;background:#222;border:1px solid #D70000;color:#fff;text-decoration:none;text-align:center;padding:15px;border-radius:8px;margin:10px 0;">📅 จองคิวพร้อมส่วนลดทันที</a>
  </div>
  <div class="f"><p>EARTHGANG O.G. Tattoo Studio · Chiang Mai</p></div>
</div>
</body></html>`;

  return resend.emails.send({
    from: FROM,
    to: user.email,
    subject: `${emoji} ยินดีต้อนรับสู่ EARTHGANG ${user.membership_tier.toUpperCase()} Family!`,
    html,
  });
}
