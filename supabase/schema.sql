-- ============================================================
-- סכמת מסד הנתונים — להרצה ב-Supabase (SQL Editor)
-- שלב 3: מסד נתונים. מריצים את כל הקובץ פעם אחת.
-- ============================================================

-- טבלת סיורים (נכס = סיור)
CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- טבלת סצנות (חדרים / נקודות צילום)
CREATE TABLE IF NOT EXISTS tour_scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  -- hotspots = חצי הניווט שתסמן בעורך (pitch/yaw/יעד)
  hotspots JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- אינדקסים למהירות
CREATE INDEX IF NOT EXISTS idx_tour_scenes_tour_id ON tour_scenes(tour_id);
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);

-- Row Level Security
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_scenes ENABLE ROW LEVEL SECURITY;

-- קריאה ציבורית לסיורים ציבוריים
DROP POLICY IF EXISTS "Public tours are viewable by everyone" ON tours;
CREATE POLICY "Public tours are viewable by everyone"
  ON tours FOR SELECT
  USING (is_public = TRUE);

DROP POLICY IF EXISTS "Public scenes are viewable by everyone" ON tour_scenes;
CREATE POLICY "Public scenes are viewable by everyone"
  ON tour_scenes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tours
      WHERE tours.id = tour_scenes.tour_id
      AND tours.is_public = TRUE
    )
  );

-- כתיבה רק דרך ה-service role (ה-API שלנו, צד שרת)
DROP POLICY IF EXISTS "Service role can do everything on tours" ON tours;
CREATE POLICY "Service role can do everything on tours"
  ON tours FOR ALL
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can do everything on scenes" ON tour_scenes;
CREATE POLICY "Service role can do everything on scenes"
  ON tour_scenes FOR ALL
  USING (auth.role() = 'service_role');
