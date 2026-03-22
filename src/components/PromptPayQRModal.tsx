'use client';

import { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface PromptPayQRModalProps {
  amount: number;
  bookingRef: string;
  locale: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PromptPayQRModal({
  amount,
  bookingRef,
  locale,
  onClose,
  onConfirm,
}: PromptPayQRModalProps) {
  const [qrUrl, setQrUrl]         = useState<string>('');
  const [loading, setLoading]     = useState(true);
  const [checking, setChecking]   = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 min

  useEffect(() => {
    fetchQR();
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchQR = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payments/promptpay?amount=${amount}&ref=${bookingRef}`);
      const data = await res.json();
      setQrUrl(data.qrUrl);
    } catch {
      console.error('QR fetch failed');
    } finally {
      setLoading(false);
    }
  };

  const checkPayment = async () => {
    setChecking(true);
    try {
      const res = await fetch(`/api/payments/promptpay/verify?ref=${bookingRef}`);
      const data = await res.json();
      if (data.paid) {
        onConfirm();
      } else {
        alert(locale === 'th' ? 'ยังไม่พบการชำระเงิน กรุณาสแกน QR Code และลองอีกครั้ง' : 'Payment not found. Please scan the QR code and try again.');
      }
    } catch {
      console.error('Payment check failed');
    } finally {
      setChecking(false);
    }
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-brand-dark border border-brand-dark-3 rounded-2xl
                      w-full max-w-sm shadow-2xl animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-dark-3">
          <div>
            <h2 className="text-white font-black text-lg">🏦 PromptPay</h2>
            <p className="text-brand-gray text-xs mt-0.5">
              {locale === 'th' ? 'สแกน QR Code เพื่อชำระเงิน' : 'Scan QR Code to pay'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-brand-dark-2 text-brand-gray
                       hover:text-white hover:bg-brand-red transition-colors flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Amount */}
          <div className="text-center mb-4">
            <p className="text-brand-gray text-sm">
              {locale === 'th' ? 'ยอดที่ต้องชำระ' : 'Amount to Pay'}
            </p>
            <p className="text-4xl font-black text-brand-gold">
              {amount.toLocaleString()} ฿
            </p>
            <p className="text-brand-gray text-xs mt-1">
              {locale === 'th' ? `มัดจำ 30% • รหัสจอง: ${bookingRef}` : `30% Deposit · Ref: ${bookingRef}`}
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-2xl p-4 w-52 h-52 flex items-center justify-center shadow-lg">
              {loading ? (
                <Loader2 size={40} className="text-brand-red animate-spin" />
              ) : qrUrl ? (
                <Image src={qrUrl} alt="PromptPay QR" width={180} height={180} className="rounded-lg" />
              ) : (
                <div className="text-center">
                  <p className="text-red-500 text-sm">QR Code unavailable</p>
                  <button onClick={fetchQR} className="text-blue-500 text-xs mt-2">Retry</button>
                </div>
              )}
            </div>
          </div>

          {/* Account Name */}
          <div className="bg-brand-dark-2 rounded-xl p-3 text-center mb-4">
            <p className="text-brand-gray text-xs">
              {locale === 'th' ? 'ชื่อบัญชี' : 'Account Name'}
            </p>
            <p className="text-white font-bold text-sm">ปัญญานนท์ วีระเดชะ</p>
            <p className="text-brand-gray text-xs">064-694-795</p>
          </div>

          {/* Countdown */}
          {countdown > 0 ? (
            <p className="text-center text-brand-gray text-xs mb-4">
              ⏱ {locale === 'th' ? 'QR หมดอายุใน' : 'QR expires in'}{' '}
              <span className={countdown < 60 ? 'text-red-400 font-bold' : 'text-white font-bold'}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </p>
          ) : (
            <p className="text-center text-red-400 text-xs mb-4 font-bold">
              ⚠️ {locale === 'th' ? 'QR หมดอายุแล้ว' : 'QR expired'}
              <button onClick={fetchQR} className="text-brand-red ml-2 underline">
                {locale === 'th' ? 'สร้างใหม่' : 'Refresh'}
              </button>
            </p>
          )}

          {/* Actions */}
          <button
            onClick={checkPayment}
            disabled={checking}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold
                       py-3 rounded-xl flex items-center justify-center gap-2
                       transition-colors mb-3 disabled:opacity-60"
          >
            {checking ? (
              <><Loader2 size={18} className="animate-spin" />
                {locale === 'th' ? 'กำลังตรวจสอบ...' : 'Verifying...'}</>
            ) : (
              <><CheckCircle size={18} />
                {locale === 'th' ? 'ฉันชำระเงินแล้ว' : "I've Paid"}</>
            )}
          </button>

          <button
            onClick={fetchQR}
            className="w-full bg-brand-dark-2 border border-brand-dark-3 text-brand-gray-light
                       font-medium py-2.5 rounded-xl flex items-center justify-center gap-2
                       text-sm hover:border-brand-red hover:text-white transition-colors"
          >
            <RefreshCw size={14} />
            {locale === 'th' ? 'สร้าง QR ใหม่' : 'Refresh QR'}
          </button>

          <p className="text-brand-gray text-[11px] text-center mt-3">
            {locale === 'th'
              ? 'ปลอดภัย 100% • ชำระผ่าน PromptPay ของธนาคารคุณ'
              : '100% Secure · Pay via your bank\'s PromptPay'}
          </p>
        </div>
      </div>
    </div>
  );
}
