-- ============================================
-- EARTHGANG O.G. Tattoo Studio — Database Schema
-- Supabase PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USERS
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id                   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                TEXT UNIQUE NOT NULL,
  full_name            TEXT NOT NULL DEFAULT '',
  phone                TEXT DEFAULT '',
  avatar_url           TEXT,
  preferred_language   TEXT DEFAULT 'th' CHECK (preferred_language IN ('th','en','zh')),
  membership_tier      TEXT DEFAULT 'none' CHECK (membership_tier IN ('none','bronze','silver','gold','platinum')),
  membership_expires_at TIMESTAMPTZ,
  loyalty_points       INTEGER DEFAULT 0 CHECK (loyalty_points >= 0),
  line_user_id         TEXT,
  date_of_birth        DATE,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ARTISTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.artists (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  nickname        TEXT NOT NULL,
  bio_th          TEXT DEFAULT '',
  bio_en          TEXT DEFAULT '',
  bio_zh          TEXT DEFAULT '',
  specialties     TEXT[] DEFAULT '{}',
  instagram       TEXT,
  avatar_url      TEXT,
  portfolio_images TEXT[] DEFAULT '{}',
  is_active       BOOLEAN DEFAULT TRUE,
  available_days  INTEGER[] DEFAULT '{2,3,4,5,6}',  -- 2=Tue ... 6=Sat
  booking_lead_hours INTEGER DEFAULT 24,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default artists
INSERT INTO public.artists (name, nickname, bio_th, bio_en, specialties, instagram, available_days)
VALUES
  ('Toon Earthgang', 'TOON',
   'ช่างศิลปิน Blackwork ผู้เชี่ยวชาญลวดลายเรขาคณิตและลวดลายซับซ้อน ประสบการณ์กว่า 8 ปี',
   'Blackwork specialist with mastery in geometric and intricate patterns. 8+ years experience.',
   ARRAY['blackwork','geometric','custom'], 'toon.earthgang', ARRAY[2,3,4,5,6]),
  ('Ronnie Earthgang', 'RONNIE',
   'ช่างศิลปิน Traditional ที่นำเสนอลวดลายคลาสสิกในมุมมองสมัยใหม่',
   'Traditional artist presenting classic imagery through a modern lens.',
   ARRAY['traditional','neotraditional','fineline'], 'ronnie.earthgang', ARRAY[2,3,4,5,6])
ON CONFLICT DO NOTHING;

-- ============================================
-- SERVICES
-- ============================================
CREATE TABLE IF NOT EXISTS public.services (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_th         TEXT NOT NULL,
  name_en         TEXT NOT NULL,
  name_zh         TEXT DEFAULT '',
  description_th  TEXT DEFAULT '',
  description_en  TEXT DEFAULT '',
  description_zh  TEXT DEFAULT '',
  style           TEXT NOT NULL,
  base_price_thb  INTEGER NOT NULL DEFAULT 0,
  price_unit      TEXT DEFAULT 'fixed' CHECK (price_unit IN ('fixed','per_hour','per_piece','quote')),
  duration_hours  NUMERIC DEFAULT 1,
  image_url       TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Insert services
INSERT INTO public.services (name_th, name_en, name_zh, style, base_price_thb, duration_hours)
VALUES
  ('Blackwork เล็ก (≤5cm)', 'Small Blackwork', '小型黑色纹身', 'blackwork', 2500, 1),
  ('Blackwork กลาง (5–15cm)', 'Medium Blackwork', '中型黑色纹身', 'blackwork', 5000, 2),
  ('Blackwork ใหญ่ (15cm+)', 'Large Blackwork', '大型黑色纹身', 'blackwork', 9000, 4),
  ('Fineline เล็ก', 'Small Fineline', '小型细线纹身', 'fineline', 2000, 1),
  ('Fineline กลาง', 'Medium Fineline', '中型细线纹身', 'fineline', 4000, 2),
  ('Traditional เล็ก', 'Small Traditional', '小型传统纹身', 'traditional', 3000, 1.5),
  ('Traditional ใหญ่', 'Large Traditional', '大型传统纹身', 'traditional', 8000, 3),
  ('Half Sleeve', 'Half Sleeve', '半袖纹身', 'custom', 25000, 8),
  ('Full Sleeve', 'Full Sleeve', '全袖纹身', 'custom', 45000, 16),
  ('ปรึกษาและออกแบบฟรี', 'Free Consultation', '免费咨询', 'custom', 0, 0.5)
ON CONFLICT DO NOTHING;

-- ============================================
-- BOOKINGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_ref             TEXT UNIQUE NOT NULL,
  user_id                 UUID REFERENCES public.users(id) ON DELETE SET NULL,
  artist_id               UUID NOT NULL REFERENCES public.artists(id),
  service_id              UUID NOT NULL REFERENCES public.services(id),
  date                    DATE NOT NULL,
  time                    TIME NOT NULL,
  duration_hours          NUMERIC DEFAULT 1,
  total_price_thb         INTEGER NOT NULL DEFAULT 0,
  deposit_thb             INTEGER NOT NULL DEFAULT 0,
  remaining_thb           INTEGER NOT NULL DEFAULT 0,
  discount_applied        INTEGER DEFAULT 0,
  points_redeemed         INTEGER DEFAULT 0,
  status                  TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','deposit_paid','confirmed','completed','cancelled','no_show')),
  notes                   TEXT,
  tattoo_placement        TEXT,
  tattoo_size             TEXT,
  reference_images        TEXT[] DEFAULT '{}',
  payment_method          TEXT CHECK (payment_method IN ('stripe','promptpay','cash')),
  stripe_payment_intent_id TEXT,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Prevent double booking
CREATE UNIQUE INDEX IF NOT EXISTS bookings_artist_date_time_unique
  ON public.bookings(artist_id, date, time)
  WHERE status NOT IN ('cancelled','no_show');

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
  id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id               UUID NOT NULL REFERENCES public.bookings(id),
  user_id                  UUID REFERENCES public.users(id),
  amount_thb               INTEGER NOT NULL,
  method                   TEXT CHECK (method IN ('stripe','promptpay','cash')),
  status                   TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','processing','paid','failed','refunded')),
  stripe_payment_intent_id TEXT,
  promptpay_ref            TEXT,
  paid_at                  TIMESTAMPTZ,
  created_at               TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LOYALTY TRANSACTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  points      INTEGER NOT NULL,
  type        TEXT CHECK (type IN ('earn','redeem','bonus','expire','admin')),
  description TEXT DEFAULT '',
  booking_id  UUID REFERENCES public.bookings(id),
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MEMBERSHIP PURCHASES
-- ============================================
CREATE TABLE IF NOT EXISTS public.membership_purchases (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.users(id),
  tier           TEXT NOT NULL,
  amount_thb     INTEGER NOT NULL,
  payment_method TEXT,
  expires_at     TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PORTFOLIO
-- ============================================
CREATE TABLE IF NOT EXISTS public.portfolio (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id     UUID NOT NULL REFERENCES public.artists(id),
  style         TEXT NOT NULL,
  image_url     TEXT NOT NULL,
  thumbnail_url TEXT,
  title         TEXT,
  placement     TEXT,
  is_featured   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_purchases ENABLE ROW LEVEL SECURITY;

-- Users can read/update own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Users can view own bookings
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- Users can view own loyalty transactions
CREATE POLICY "Users can view own transactions"
  ON public.loyalty_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Public read access for artists, services, portfolio
CREATE POLICY "Public read artists"   ON public.artists   FOR SELECT USING (true);
CREATE POLICY "Public read services"  ON public.services  FOR SELECT USING (true);
CREATE POLICY "Public read portfolio" ON public.portfolio FOR SELECT USING (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to get available time slots
CREATE OR REPLACE FUNCTION get_available_slots(
  p_date DATE,
  p_artist_id UUID
) RETURNS TABLE(time_slot TIME, is_available BOOLEAN) AS $$
DECLARE
  all_slots TIME[] := ARRAY[
    '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30',
    '18:00'
  ]::TIME[];
  slot TIME;
BEGIN
  FOREACH slot IN ARRAY all_slots LOOP
    RETURN QUERY SELECT
      slot,
      NOT EXISTS (
        SELECT 1 FROM public.bookings b
        WHERE b.date = p_date
          AND b.time = slot
          AND b.artist_id = p_artist_id
          AND b.status NOT IN ('cancelled','no_show')
      );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bookings_date       ON public.bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id    ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_artist_id  ON public.bookings(artist_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status     ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_loyalty_user_id     ON public.loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_artist    ON public.portfolio(artist_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_style     ON public.portfolio(style);
