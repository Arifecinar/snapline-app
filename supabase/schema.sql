-- ==========================================
-- SNAPLINE DATABASE SCHEMA FOR SUPABASE
-- ==========================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Trigger for auto creating profile when new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any and create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT,
  note_text TEXT NOT NULL,
  timestamp TEXT NOT NULL, -- e.g. "08:30" or "14:15"
  entry_date DATE DEFAULT CURRENT_DATE NOT NULL, -- e.g. "2026-09-21"
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS for entries
ALTER TABLE public.entries ENABLE ROW LEVEL SECURITY;

-- Entries Policies
CREATE POLICY "Users can view their own entries" 
  ON public.entries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries" 
  ON public.entries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" 
  ON public.entries FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" 
  ON public.entries FOR DELETE 
  USING (auth.uid() = user_id);


-- 3. ENTRY_TAGS TABLE
CREATE TABLE IF NOT EXISTS public.entry_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.entries(id) ON DELETE CASCADE,
  tag_name TEXT NOT NULL,
  mood_score INT CHECK (mood_score >= 1 AND mood_score <= 5) DEFAULT 3
);

-- Enable RLS for entry_tags
ALTER TABLE public.entry_tags ENABLE ROW LEVEL SECURITY;

-- Entry Tags Policies (linked via entries.user_id)
CREATE POLICY "Users can view tags of their own entries" 
  ON public.entry_tags FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.entries 
      WHERE entries.id = entry_tags.entry_id 
      AND entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert tags for their own entries" 
  ON public.entry_tags FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.entries 
      WHERE entries.id = entry_tags.entry_id 
      AND entries.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tags for their own entries" 
  ON public.entry_tags FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.entries 
      WHERE entries.id = entry_tags.entry_id 
      AND entries.user_id = auth.uid()
    )
  );


-- ==========================================
-- STORAGE BUCKET CONFIGURATION (INSTRUCTIONS)
-- ==========================================
-- Run the following in Supabase Dashboard -> Storage or SQL Editor:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('entry-images', 'entry-images', true);

-- Storage bucket policies:
-- CREATE POLICY "Anyone can view entry images" ON storage.objects FOR SELECT USING (bucket_id = 'entry-images');
-- CREATE POLICY "Authenticated users can upload entry images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'entry-images' AND auth.role() = 'authenticated');
