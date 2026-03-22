# 🔥 EARTHGANG O.G. Tattoo Studio — Website

**Full-stack custom website for EARTHGANG O.G. Tattoo Studio, Chiang Mai**

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Payments | Stripe + PromptPay QR |
| Email | Resend |
| Notifications | LINE Messaging API + WhatsApp (Twilio) |
| i18n | next-intl (TH/EN/ZH) |
| Hosting | Vercel (FREE) |

---

## 🚀 Deployment Steps

### Step 1 — Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name: `earthgang-tattoo`
3. Copy your **Project URL** and **anon key**
4. Go to **SQL Editor** → paste contents of `supabase/schema.sql` → Run

### Step 2 — Create Vercel Project

1. Go to [vercel.com](https://vercel.com) → Import from GitHub
2. Upload this project folder
3. Framework: **Next.js** (auto-detected)

### Step 3 — Configure Environment Variables

In Vercel → Settings → Environment Variables, add:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

NEXT_PUBLIC_SITE_URL=https://www.earthgangtattoo.com

STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

PROMPTPAY_PHONE=0646947955
PROMPTPAY_NAME=ปัญญานนท์ วีระเดชะ

RESEND_API_KEY=re_...
EMAIL_FROM=booking@earthgangtattoo.com

LINE_CHANNEL_ACCESS_TOKEN=...
LINE_CHANNEL_SECRET=...

DEPOSIT_PERCENT=30
```

### Step 4 — Connect Your Domain (Wix → Vercel)

1. In Vercel → Domains → Add `earthgangtattoo.com`
2. Vercel will show you DNS records to add
3. Go to **Wix Dashboard** → Domain → Advanced → DNS Records
4. Delete existing A/CNAME records pointing to Wix
5. Add new records from Vercel:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com
6. Wait 24–48 hours for propagation ✅

### Step 5 — Set Up LINE OA Webhook

1. Go to [LINE Developers](https://developers.line.biz)
2. Create Messaging API channel
3. Set Webhook URL: `https://www.earthgangtattoo.com/api/notifications/line`
4. Enable webhooks
5. Add channel access token to env vars

### Step 6 — Set Up Stripe Webhooks

1. Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://www.earthgangtattoo.com/api/payments/stripe/webhook`
3. Events: `checkout.session.completed`

---

## 📁 Project Structure

```
earthgangtattoo/
├── src/
│   ├── app/
│   │   ├── [locale]/          # All pages (th/en/zh)
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── book/          # Booking wizard
│   │   │   ├── services/      # Pricing
│   │   │   ├── membership/    # Membership tiers
│   │   │   ├── artists/       # Artist profiles
│   │   │   ├── portfolio/     # Gallery
│   │   │   ├── contact/       # Contact + map
│   │   │   ├── account/       # Customer dashboard
│   │   │   └── login/         # Auth
│   │   ├── api/
│   │   │   ├── bookings/      # Create/get bookings
│   │   │   ├── payments/      # Stripe + PromptPay
│   │   │   ├── membership/    # Membership management
│   │   │   ├── notifications/ # LINE webhook
│   │   │   └── auth/          # Registration
│   │   └── admin/             # Admin dashboard
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── BookingCalendar.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── PromptPayQRModal.tsx
│   ├── lib/
│   │   ├── supabase.ts        # Browser client
│   │   ├── supabase-server.ts # Server client
│   │   ├── membership.ts      # Tier config & pricing
│   │   ├── line.ts            # LINE OA automation
│   │   ├── email.ts           # Email templates
│   │   ├── promptpay.ts       # QR generation
│   │   └── utils.ts           # Helpers
│   └── types/index.ts         # All TypeScript types
├── messages/
│   ├── th.json               # Thai translations
│   ├── en.json               # English translations
│   └── zh.json               # Chinese translations
├── supabase/
│   └── schema.sql            # Full database schema
├── .env.example              # Environment variables template
├── tailwind.config.ts        # Brand colors
├── next.config.mjs           # Next.js config
└── README.md
```

---

## 💎 Membership Tiers (Chiang Mai 2026 Pricing)

| Tier | Price/Year | ~Per Month | Discount | Touch-ups | Points |
|------|-----------|-----------|----------|-----------|--------|
| 🥉 Bronze | 1,000 ฿ | ~83 ฿/mo | 5% | 0 | 1x |
| 🥈 Silver | 2,500 ฿ | ~208 ฿/mo | 10% | 1/year | 1.5x |
| 🥇 Gold | 5,000 ฿ | ~417 ฿/mo | 15% | 2/year | 2x |
| 💎 Platinum | 10,000 ฿ | ~833 ฿/mo | 20% | Unlimited | 3x |

---

## 💳 PromptPay Config

- **Name:** ปัญญานนท์ วีระเดชะ
- **Number:** 064-694-795
- **Deposit:** 30% of total

---

## 📞 Studio Info

- **Phone:** 061-804-2224
- **Address:** 141/2 Kampangdin Rd, Tambon Phra Sing, Mueang Chiang Mai 50100
- **Hours:** Tue–Sat 10:00–20:00 | Sun by appointment | Mon closed

---

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env.local
# Fill in your values

# Run development server
npm run dev

# Open http://localhost:3000/th
```

---

## 📧 Email Automation Triggers

| Trigger | Email Sent |
|---------|-----------|
| New booking | Booking confirmation + deposit instructions |
| Deposit paid | Deposit confirmed + remaining balance |
| 24h before | Reminder + checklist |
| Session complete | Aftercare instructions |
| Membership join | Welcome email |

## 🤖 LINE OA Auto-Replies

| Customer types | Bot responds with |
|---------------|------------------|
| จอง / book / 预约 | Booking link |
| ราคา / price / 价格 | Price list |
| สมาชิก / member / 会员 | Membership tiers |
| ที่ตั้ง / address / 地址 | Location map |
| เวลา / hours / open | Studio hours |
| anything else | Full menu |
