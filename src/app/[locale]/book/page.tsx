'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ChevronRight, ChevronLeft, Calendar, Clock, User, CreditCard, Loader2 } from 'lucide-react';
import { cn, formatCurrency, generateBookingRef, TIME_SLOTS, STUDIO_HOURS } from '@/lib/utils';
import { calculateDeposit, MEMBERSHIP_PLANS } from '@/lib/membership';
import PromptPayQRModal from '@/components/PromptPayQRModal';
import BookingCalendar from '@/components/BookingCalendar';
import toast from 'react-hot-toast';

interface Props {
  params: { locale: string };
}

const ARTISTS = [
  { id: 'toon',   name: 'TOON',   specialty: 'Blackwork · Geometric',   available: [2,3,4,5,6] },
  { id: 'ronnie', name: 'RONNIE', specialty: 'Traditional · Neo-Trad',   available: [2,3,4,5,6] },
];

const SERVICES = [
  { id: 'blackwork-small',  name_th: 'Blackwork เล็ก (≤5cm)',      name_en: 'Small Blackwork (≤5cm)',       price: 2500,  duration: 1,   style: 'blackwork'   },
  { id: 'blackwork-medium', name_th: 'Blackwork กลาง (5–15cm)',    name_en: 'Medium Blackwork (5–15cm)',     price: 5000,  duration: 2,   style: 'blackwork'   },
  { id: 'blackwork-large',  name_th: 'Blackwork ใหญ่ (15cm+)',     name_en: 'Large Blackwork (15cm+)',       price: 9000,  duration: 4,   style: 'blackwork'   },
  { id: 'fineline-small',   name_th: 'Fineline เล็ก (≤5cm)',       name_en: 'Small Fineline (≤5cm)',         price: 2000,  duration: 1,   style: 'fineline'    },
  { id: 'fineline-medium',  name_th: 'Fineline กลาง (5–15cm)',     name_en: 'Medium Fineline (5–15cm)',      price: 4000,  duration: 2,   style: 'fineline'    },
  { id: 'traditional-small',name_th: 'Traditional เล็ก',           name_en: 'Small Traditional',             price: 3000,  duration: 1.5, style: 'traditional' },
  { id: 'traditional-large',name_th: 'Traditional ใหญ่',           name_en: 'Large Traditional',             price: 8000,  duration: 3,   style: 'traditional' },
  { id: 'sleeve-half',      name_th: 'Half Sleeve',                name_en: 'Half Sleeve',                   price: 25000, duration: 8,   style: 'custom'      },
  { id: 'sleeve-full',      name_th: 'Full Sleeve',                name_en: 'Full Sleeve',                   price: 45000, duration: 16,  style: 'custom'      },
  { id: 'consultation',     name_th: 'ปรึกษาและออกแบบฟรี',         name_en: 'Free Consultation & Design',    price: 0,     duration: 0.5, style: 'custom'      },
];

const STEPS = [
  { id: 1, label_th: 'บริการ',   label_en: 'Service',    icon: '🎨' },
  { id: 2, label_th: 'ช่างศิลป์', label_en: 'Artist',    icon: '👤' },
  { id: 3, label_th: 'วันเวลา',  label_en: 'Date & Time', icon: '📅' },
  { id: 4, label_th: 'รายละเอียด', label_en: 'Details',  icon: '📝' },
  { id: 5, label_th: 'ชำระมัดจำ', label_en: 'Deposit',   icon: '💳' },
];

export default function BookingPage({ params: { locale } }: Props) {
  const t = useTranslations('booking');

  const [step, setStep]           = useState(1);
  const [serviceId, setServiceId] = useState('');
  const [artistId, setArtistId]   = useState('');
  const [date, setDate]           = useState('');
  const [time, setTime]           = useState('');
  const [placement, setPlacement] = useState('');
  const [size, setSize]           = useState('');
  const [notes, setNotes]         = useState('');
  const [payMethod, setPayMethod] = useState<'promptpay' | 'stripe'>('promptpay');
  const [loading, setLoading]     = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [showQR, setShowQR]       = useState(false);
  const [success, setSuccess]     = useState(false);

  const selectedService = SERVICES.find(s => s.id === serviceId);
  const selectedArtist  = ARTISTS.find(a => a.id === artistId);
  const total    = selectedService?.price || 0;
  const deposit  = calculateDeposit(total);
  const remaining = total - deposit;

  const canProceed = () => {
    switch (step) {
      case 1: return !!serviceId;
      case 2: return !!artistId;
      case 3: return !!date && !!time;
      case 4: return !!placement;
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && step < 5) setStep(s => s + 1);
  };

  const handleConfirmBooking = async () => {
    if (!canProceed()) return;
    setLoading(true);
    try {
      const ref = generateBookingRef();
      setBookingRef(ref);

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          artist_id: artistId,
          date, time,
          placement, size, notes,
          total_price_thb: total,
          deposit_thb: deposit,
          payment_method: payMethod,
          booking_ref: ref,
        }),
      });

      if (!res.ok) throw new Error('Booking failed');

      if (payMethod === 'promptpay') {
        setShowQR(true);
      } else {
        // Stripe redirect
        const { url } = await res.json();
        if (url) window.location.href = url;
      }
    } catch (err) {
      toast.error(locale === 'th' ? 'เกิดข้อผิดพลาด กรุณาลองใหม่' : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">
            {locale === 'th' ? '🎉 จองสำเร็จ!' : '🎉 Booking Confirmed!'}
          </h1>
          <p className="text-brand-gold text-xl font-bold mb-2">{bookingRef}</p>
          <p className="text-brand-gray mb-6">
            {locale === 'th'
              ? 'เราส่งรายละเอียดไปยังอีเมลและ LINE ของคุณแล้ว'
              : 'We\'ve sent booking details to your email and LINE.'}
          </p>
          <div className="bg-brand-dark border border-brand-dark-3 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between py-2 border-b border-brand-dark-3">
              <span className="text-brand-gray text-sm">{locale === 'th' ? 'บริการ' : 'Service'}</span>
              <span className="text-white text-sm font-medium">
                {locale === 'th' ? selectedService?.name_th : selectedService?.name_en}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-brand-dark-3">
              <span className="text-brand-gray text-sm">{locale === 'th' ? 'ช่างศิลป์' : 'Artist'}</span>
              <span className="text-white text-sm font-medium">{selectedArtist?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-brand-dark-3">
              <span className="text-brand-gray text-sm">{locale === 'th' ? 'วันที่' : 'Date'}</span>
              <span className="text-white text-sm font-medium">{date}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-brand-gray text-sm">{locale === 'th' ? 'เวลา' : 'Time'}</span>
              <span className="text-white text-sm font-medium">{time}</span>
            </div>
          </div>
          <a
            href={`/${locale}/account/bookings`}
            className="btn-primary inline-flex items-center gap-2 w-full justify-center"
          >
            {locale === 'th' ? 'ดูการจองของฉัน' : 'View My Bookings'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container-max mx-auto max-w-3xl">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-brand-red text-sm font-bold tracking-widest uppercase mb-2">
            {locale === 'th' ? 'จองคิว' : 'Book a Session'}
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {locale === 'th' ? 'จองคิวสัก'
             : locale === 'zh' ? '预约纹身' : 'Book Your Session'}
          </h1>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-10 relative">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-brand-dark-3 -translate-y-1/2 z-0" />
          {STEPS.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
              <button
                onClick={() => s.id < step && setStep(s.id)}
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                  step === s.id
                    ? 'bg-brand-red text-white shadow-red-glow'
                    : step > s.id
                    ? 'bg-green-500 text-white cursor-pointer'
                    : 'bg-brand-dark-2 text-brand-gray border border-brand-dark-3'
                )}
              >
                {step > s.id ? <Check size={16} /> : s.icon}
              </button>
              <span className={cn(
                'text-[10px] font-medium hidden sm:block',
                step === s.id ? 'text-brand-red' : step > s.id ? 'text-green-500' : 'text-brand-gray'
              )}>
                {locale === 'th' ? s.label_th : s.label_en}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="card-dark rounded-2xl p-6 md:p-8">

          {/* Step 1: Select Service */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">
                {locale === 'th' ? '🎨 เลือกบริการ' : '🎨 Select Service'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setServiceId(service.id)}
                    className={cn(
                      'p-4 rounded-xl border text-left transition-all duration-200',
                      serviceId === service.id
                        ? 'border-brand-red bg-brand-red/10 shadow-red-glow'
                        : 'border-brand-dark-3 hover:border-brand-red/50 hover:bg-brand-dark-2'
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-bold text-sm">
                          {locale === 'th' ? service.name_th : service.name_en}
                        </p>
                        <p className="text-brand-gray text-xs mt-1 capitalize">{service.style}</p>
                        <p className="text-brand-gray text-xs mt-1">
                          {service.duration > 0 ? `${service.duration}h` : '30min'}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        {service.price > 0 ? (
                          <p className="text-brand-gold font-bold text-sm">
                            {service.price.toLocaleString()} ฿
                          </p>
                        ) : (
                          <p className="text-green-400 font-bold text-sm">FREE</p>
                        )}
                      </div>
                    </div>
                    {serviceId === service.id && (
                      <div className="flex items-center gap-1 mt-2 text-brand-red text-xs font-bold">
                        <Check size={12} />
                        {locale === 'th' ? 'เลือกแล้ว' : 'Selected'}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Artist */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">
                {locale === 'th' ? '👤 เลือกช่างศิลปิน' : '👤 Select Artist'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ARTISTS.map((artist) => (
                  <button
                    key={artist.id}
                    onClick={() => setArtistId(artist.id)}
                    className={cn(
                      'p-6 rounded-xl border text-left transition-all duration-200',
                      artistId === artist.id
                        ? 'border-brand-red bg-brand-red/10 shadow-red-glow'
                        : 'border-brand-dark-3 hover:border-brand-red/50 hover:bg-brand-dark-2'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-brand-red/10 border border-brand-red/30 rounded-full
                                     flex items-center justify-center shrink-0">
                        <span className="text-brand-red font-black text-xl">{artist.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-white font-black text-lg">{artist.name}</p>
                        <p className="text-brand-red text-xs font-bold mt-0.5">{artist.specialty}</p>
                      </div>
                    </div>
                    {artistId === artist.id && (
                      <div className="flex items-center gap-1 mt-3 text-brand-red text-xs font-bold">
                        <Check size={12} />
                        {locale === 'th' ? 'เลือกแล้ว' : 'Selected'}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">
                {locale === 'th' ? '📅 เลือกวันและเวลา' : '📅 Select Date & Time'}
              </h2>
              <BookingCalendar
                locale={locale}
                selectedDate={date}
                onSelectDate={setDate}
                disabledDays={[1]} // Monday closed
              />

              {date && (
                <div className="mt-6">
                  <p className="text-white font-bold text-sm mb-3">
                    {locale === 'th' ? '⏰ เลือกเวลา' : '⏰ Select Time'}
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setTime(slot)}
                        className={cn(
                          'py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                          time === slot
                            ? 'bg-brand-red text-white shadow-red-glow'
                            : 'bg-brand-dark-2 border border-brand-dark-3 text-brand-gray-light hover:border-brand-red/50 hover:text-white'
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Details */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">
                {locale === 'th' ? '📝 รายละเอียดเพิ่มเติม' : '📝 Additional Details'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-brand-gray-light text-sm font-medium mb-2 block">
                    {locale === 'th' ? 'ตำแหน่งที่ต้องการสัก *' : 'Tattoo Placement *'}
                  </label>
                  <input
                    type="text"
                    value={placement}
                    onChange={e => setPlacement(e.target.value)}
                    className="input-dark"
                    placeholder={locale === 'th'
                      ? 'เช่น แขนซ้าย, หลัง, ข้อมือ'
                      : 'e.g. Left arm, back, wrist'}
                  />
                </div>
                <div>
                  <label className="text-brand-gray-light text-sm font-medium mb-2 block">
                    {locale === 'th' ? 'ขนาดโดยประมาณ' : 'Approximate Size'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {['XS <3cm', 'S 3-7cm', 'M 7-15cm', 'L 15cm+'].map(s => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={cn(
                          'py-2 rounded-lg text-xs font-medium transition-colors',
                          size === s
                            ? 'bg-brand-red text-white'
                            : 'bg-brand-dark-2 border border-brand-dark-3 text-brand-gray-light hover:border-brand-red/50'
                        )}
                      >{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-brand-gray-light text-sm font-medium mb-2 block">
                    {locale === 'th' ? 'หมายเหตุเพิ่มเติม' : 'Additional Notes'}
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={4}
                    className="input-dark resize-none"
                    placeholder={locale === 'th'
                      ? 'ไอเดีย, ดีไซน์, รูปอ้างอิง, หรือรายละเอียดอื่นๆ'
                      : 'Ideas, design concepts, reference images, or other details'}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Payment */}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-6">
                {locale === 'th' ? '💳 ชำระมัดจำ' : '💳 Pay Deposit'}
              </h2>

              {/* Booking Summary */}
              <div className="bg-brand-dark-2 rounded-xl p-4 mb-6">
                <p className="text-brand-red text-xs font-bold tracking-widest uppercase mb-3">
                  {locale === 'th' ? 'สรุปการจอง' : 'Booking Summary'}
                </p>
                {[
                  { label: locale === 'th' ? 'บริการ' : 'Service', value: locale === 'th' ? selectedService?.name_th : selectedService?.name_en },
                  { label: locale === 'th' ? 'ช่างศิลปิน' : 'Artist', value: selectedArtist?.name },
                  { label: locale === 'th' ? 'วันที่' : 'Date', value: date },
                  { label: locale === 'th' ? 'เวลา' : 'Time', value: time },
                  { label: locale === 'th' ? 'ตำแหน่ง' : 'Placement', value: placement },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-1.5 border-b border-brand-dark-3">
                    <span className="text-brand-gray text-sm">{item.label}</span>
                    <span className="text-white text-sm font-medium">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2 border-b border-brand-dark-3">
                  <span className="text-brand-gray text-sm">{locale === 'th' ? 'ราคารวม' : 'Total'}</span>
                  <span className="text-white font-bold">{total.toLocaleString()} ฿</span>
                </div>
                <div className="flex justify-between py-2 border-b border-brand-dark-3">
                  <span className="text-brand-gray text-sm">{locale === 'th' ? 'มัดจำ 30%' : 'Deposit 30%'}</span>
                  <span className="text-brand-gold font-bold text-lg">{deposit.toLocaleString()} ฿</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-brand-gray text-sm">{locale === 'th' ? 'ยอดที่เหลือชำระ' : 'Remaining'}</span>
                  <span className="text-brand-gray-light font-medium">{remaining.toLocaleString()} ฿</span>
                </div>
              </div>

              {/* Payment Methods */}
              <p className="text-brand-gray-light text-sm font-medium mb-3">
                {locale === 'th' ? 'วิธีชำระเงิน' : 'Payment Method'}
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { id: 'promptpay' as const, label: 'PromptPay', icon: '🏦', sub: locale === 'th' ? 'QR Code พร้อมเพย์' : 'QR Code' },
                  { id: 'stripe' as const, label: locale === 'th' ? 'บัตรเครดิต' : 'Credit Card', icon: '💳', sub: 'Visa · Mastercard' },
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPayMethod(method.id)}
                    className={cn(
                      'p-4 rounded-xl border text-left transition-all duration-200',
                      payMethod === method.id
                        ? 'border-brand-red bg-brand-red/10'
                        : 'border-brand-dark-3 hover:border-brand-red/50 bg-brand-dark-2'
                    )}
                  >
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <p className="text-white font-bold text-sm">{method.label}</p>
                    <p className="text-brand-gray text-xs mt-0.5">{method.sub}</p>
                    {payMethod === method.id && (
                      <Check size={14} className="text-brand-red mt-2" />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={handleConfirmBooking}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-3 text-base py-4"
              >
                {loading ? (
                  <><Loader2 size={20} className="animate-spin" />
                    {locale === 'th' ? 'กำลังดำเนินการ...' : 'Processing...'}</>
                ) : (
                  <>💳&nbsp;
                    {locale === 'th'
                      ? `ชำระมัดจำ ${deposit.toLocaleString()} ฿`
                      : `Pay Deposit ${deposit.toLocaleString()} ฿`}
                  </>
                )}
              </button>

              <p className="text-brand-gray text-xs text-center mt-3">
                🔒 {locale === 'th' ? 'การชำระเงินปลอดภัย SSL' : 'Secure SSL payment'}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-brand-dark-3">
              <button
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1}
                className="flex items-center gap-2 text-brand-gray-light disabled:opacity-30
                           hover:text-white transition-colors font-medium text-sm"
              >
                <ChevronLeft size={18} />
                {locale === 'th' ? 'ย้อนกลับ' : 'Back'}
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {locale === 'th' ? 'ถัดไป' : 'Next'}
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step > 1 && step === 5 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 text-brand-gray-light hover:text-white
                         transition-colors font-medium text-sm mt-4"
            >
              <ChevronLeft size={18} />
              {locale === 'th' ? 'ย้อนกลับ' : 'Back'}
            </button>
          )}
        </div>
      </div>

      {/* PromptPay QR Modal */}
      {showQR && (
        <PromptPayQRModal
          amount={deposit}
          bookingRef={bookingRef}
          locale={locale}
          onClose={() => setShowQR(false)}
          onConfirm={() => {
            setShowQR(false);
            setSuccess(true);
            toast.success(locale === 'th' ? 'ชำระเงินสำเร็จ!' : 'Payment confirmed!');
          }}
        />
      )}
    </div>
  );
}
