// ============================================
// PromptPay QR Code Generator
// ============================================

import QRCode from 'qrcode';

// PromptPay config
const PROMPTPAY_PHONE = process.env.PROMPTPAY_PHONE || '0646947955';

// Generate PromptPay payload string (EMV QR format)
function generatePromptPayPayload(phone: string, amount?: number): string {
  // Clean phone number
  const cleaned = phone.replace(/\D/g, '');
  const normalized = cleaned.startsWith('0')
    ? '66' + cleaned.slice(1)
    : cleaned;

  // Build EMV payload
  const payload = [
    '000201',                   // Payload format indicator
    '010212',                   // Point of initiation (dynamic)
    '2937',                     // Merchant account info
    '0016A000000677010111',     // Globally unique identifier
    `01${String(normalized.length).padStart(2, '0')}${normalized}`,
    '5802TH',                   // Country code
    '5303764',                  // Currency (THB = 764)
    ...(amount !== undefined
      ? [`5406${amount.toFixed(2)}`, `54${String(amount.toFixed(2).length).padStart(2, '0')}${amount.toFixed(2)}`]
      : []),
    '6304',                     // CRC placeholder
  ];

  // Simple payload
  const merchantAccount = `0016A000000677010111011300${normalized}`;
  const merchantAccountLen = String(merchantAccount.length).padStart(2, '0');

  let data =
    '000201' +
    '010212' +
    `29${merchantAccountLen}${merchantAccount}` +
    '5802TH' +
    '5303764';

  if (amount !== undefined) {
    const amtStr = amount.toFixed(2);
    data += `54${String(amtStr.length).padStart(2, '0')}${amtStr}`;
  }

  data += '6304';

  // CRC16-CCITT calculation
  const crc = crc16(data);
  return data + crc;
}

function crc16(data: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Generate QR code as Data URL
export async function generatePromptPayQR(amount: number): Promise<string> {
  const payload = generatePromptPayPayload(PROMPTPAY_PHONE, amount);

  const qrDataUrl = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  });

  return qrDataUrl;
}

// Generate QR code as SVG string
export async function generatePromptPayQRSvg(amount: number): Promise<string> {
  const payload = generatePromptPayPayload(PROMPTPAY_PHONE, amount);
  return QRCode.toString(payload, { type: 'svg', width: 300 });
}

export { PROMPTPAY_PHONE };
