import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle } from 'lucide-react';

interface Props { params: { locale: string }; }

export default function ContactPage({ params: { locale } }: Props) {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="bg-brand-dark py-16 text-center border-b border-brand-dark-3">
        <div className="container-max mx-auto px-4">
          <p className="text-brand-red text-sm font-bold tracking-widest uppercase mb-3">Get In Touch</p>
          <h1 className="text-5xl font-black text-white tracking-tight">
            {locale === 'th' ? 'ติดต่อเรา' : locale === 'zh' ? '联系我们' : 'Contact Us'}
          </h1>
          <div className="divider-red mx-auto mt-6" />
        </div>
      </div>

      <div className="container-max mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-black text-white mb-8">
              {locale === 'th' ? 'ข้อมูลติดต่อ' : 'Studio Info'}
            </h2>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4 card-dark p-5 rounded-xl">
                <div className="w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-brand-red" />
                </div>
                <div>
                  <p className="text-white font-bold mb-1">
                    {locale === 'th' ? 'ที่อยู่' : 'Address'}
                  </p>
                  <p className="text-brand-gray text-sm leading-relaxed">
                    141/2 {locale === 'th' ? 'ถ.กำแพงดิน ต.พระสิงห์' : 'Kampangdin Rd, Tambon Phra Sing'}<br />
                    {locale === 'th' ? 'เมืองเชียงใหม่ เชียงใหม่ 50100' : 'Mueang Chiang Mai, Chiang Mai 50100'}
                  </p>
                  <a
                    href="https://maps.google.com/?q=141/2+Kampangdin+Rd+Chiang+Mai"
                    target="_blank" rel="noopener noreferrer"
                    className="text-brand-red text-xs font-bold mt-2 inline-flex items-center gap-1 hover:underline"
                  >
                    📍 {locale === 'th' ? 'เปิด Google Maps' : 'Open in Google Maps'}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 card-dark p-5 rounded-xl">
                <div className="w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-brand-red" />
                </div>
                <div>
                  <p className="text-white font-bold mb-1">
                    {locale === 'th' ? 'โทรศัพท์' : 'Phone'}
                  </p>
                  <a href="tel:0618042224" className="text-brand-gold font-bold text-lg hover:underline">
                    061-804-2224
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4 card-dark p-5 rounded-xl">
                <div className="w-10 h-10 bg-brand-red/10 rounded-lg flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-brand-red" />
                </div>
                <div>
                  <p className="text-white font-bold mb-2">
                    {locale === 'th' ? 'เวลาทำการ' : 'Studio Hours'}
                  </p>
                  <div className="space-y-1 text-sm">
                    {(locale === 'th' ? [
                      { day: 'อังคาร – เสาร์', hours: '10:00 – 20:00', open: true },
                      { day: 'อาทิตย์',        hours: 'นัดหมายเท่านั้น', open: true },
                      { day: 'จันทร์',          hours: 'ปิดทำการ', open: false },
                    ] : [
                      { day: 'Tuesday – Saturday', hours: '10:00 AM – 8:00 PM', open: true },
                      { day: 'Sunday',             hours: 'By Appointment Only', open: true },
                      { day: 'Monday',             hours: 'Closed', open: false },
                    ]).map((item) => (
                      <div key={item.day} className="flex justify-between">
                        <span className={item.open ? 'text-brand-gray-light' : 'text-brand-gray/50'}>{item.day}</span>
                        <span className={item.open ? 'text-white font-medium' : 'text-brand-gray/50'}>{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="card-dark p-5 rounded-xl">
                <p className="text-white font-bold mb-4">Social Media</p>
                <div className="space-y-3">
                  {[
                    { platform: 'LINE OA', handle: '@earthgangtattoo', icon: '💬', href: 'https://line.me/ti/p/@earthgangtattoo', color: '#06C755' },
                    { platform: 'Instagram', handle: '@earthgangtattoo', icon: '📸', href: 'https://instagram.com/earthgangtattoo', color: '#E1306C' },
                    { platform: 'Facebook', handle: 'earthgangtattoo', icon: '👤', href: 'https://facebook.com/earthgangtattoo', color: '#1877F2' },
                  ].map((s) => (
                    <a
                      key={s.platform}
                      href={s.href}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <span className="text-xl">{s.icon}</span>
                      <div>
                        <p className="text-white text-sm font-medium">{s.platform}</p>
                        <p className="text-brand-gray text-xs">{s.handle}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-black text-white mb-8">
              {locale === 'th' ? 'ส่งข้อความหาเรา' : 'Send Us a Message'}
            </h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-brand-gray-light text-sm mb-2 block">
                    {locale === 'th' ? 'ชื่อ *' : 'Name *'}
                  </label>
                  <input type="text" className="input-dark"
                    placeholder={locale === 'th' ? 'ชื่อของคุณ' : 'Your name'} required />
                </div>
                <div>
                  <label className="text-brand-gray-light text-sm mb-2 block">
                    {locale === 'th' ? 'โทรศัพท์' : 'Phone'}
                  </label>
                  <input type="tel" className="input-dark" placeholder="08X-XXX-XXXX" />
                </div>
              </div>
              <div>
                <label className="text-brand-gray-light text-sm mb-2 block">
                  {locale === 'th' ? 'อีเมล *' : 'Email *'}
                </label>
                <input type="email" className="input-dark"
                  placeholder={locale === 'th' ? 'อีเมลของคุณ' : 'your@email.com'} required />
              </div>
              <div>
                <label className="text-brand-gray-light text-sm mb-2 block">
                  {locale === 'th' ? 'หัวข้อ' : 'Subject'}
                </label>
                <select className="input-dark">
                  <option value="">{locale === 'th' ? 'เลือกหัวข้อ' : 'Select topic'}</option>
                  <option value="booking">{locale === 'th' ? 'สอบถามการจอง' : 'Booking Inquiry'}</option>
                  <option value="pricing">{locale === 'th' ? 'สอบถามราคา' : 'Pricing Inquiry'}</option>
                  <option value="custom">{locale === 'th' ? 'Custom Design' : 'Custom Design'}</option>
                  <option value="other">{locale === 'th' ? 'อื่นๆ' : 'Other'}</option>
                </select>
              </div>
              <div>
                <label className="text-brand-gray-light text-sm mb-2 block">
                  {locale === 'th' ? 'ข้อความ *' : 'Message *'}
                </label>
                <textarea rows={5} className="input-dark resize-none"
                  placeholder={locale === 'th' ? 'รายละเอียดที่ต้องการสอบถาม...' : 'Your message...'} required />
              </div>
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                📨&nbsp;
                {locale === 'th' ? 'ส่งข้อความ' : locale === 'zh' ? '发送' : 'Send Message'}
              </button>
            </form>

            {/* Map Embed */}
            <div className="mt-8 rounded-xl overflow-hidden border border-brand-dark-3 h-56">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3776.5!2d98.9897!3d18.7878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDQ3JzE2LjEiTiA5OMKwNTknMjIuOSJF!5e0!3m2!1sen!2sth!4v1234567890"
                width="100%" height="100%"
                style={{ border: 0, filter: 'grayscale(0.8) invert(0.9) brightness(0.8)' }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
