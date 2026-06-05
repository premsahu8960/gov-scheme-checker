-- Government Scheme Eligibility Checker - Supabase Schema
-- Run this in the Supabase SQL Editor

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  state TEXT,
  district TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Government schemes
CREATE TABLE IF NOT EXISTS public.schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_hi TEXT,
  description TEXT,
  description_hi TEXT,
  category TEXT NOT NULL,
  ministry TEXT,
  benefits JSONB DEFAULT '[]',
  benefits_hi JSONB DEFAULT '[]',
  documents JSONB DEFAULT '[]',
  documents_hi JSONB DEFAULT '[]',
  deadline DATE,
  official_url TEXT,
  apply_url TEXT,
  rules JSONB DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  popularity INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eligibility rules (optional separate table for complex rules)
CREATE TABLE IF NOT EXISTS public.eligibility_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID REFERENCES public.schemes(id) ON DELETE CASCADE,
  rule_key TEXT NOT NULL,
  rule_value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved/bookmarked schemes
CREATE TABLE IF NOT EXISTS public.saved_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scheme_id UUID REFERENCES public.schemes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, scheme_id)
);

-- User feedback
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eligibility check history
CREATE TABLE IF NOT EXISTS public.eligibility_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  profile JSONB NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eligibility_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read schemes" ON public.schemes FOR SELECT USING (true);
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users manage own bookmarks" ON public.saved_schemes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users read own checks" ON public.eligibility_checks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can submit feedback" ON public.feedback FOR INSERT WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_schemes_category ON public.schemes(category);
CREATE INDEX IF NOT EXISTS idx_schemes_slug ON public.schemes(slug);
CREATE INDEX IF NOT EXISTS idx_saved_schemes_user ON public.saved_schemes(user_id);
