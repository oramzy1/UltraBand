-- Create bookings table for managing client booking requests
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  event_location TEXT NOT NULL,
  event_description TEXT,
  budget_range TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'counter_proposed')),
  admin_notes TEXT,
  proposed_date DATE,
  proposed_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery table for band photos and videos
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table for upcoming performances
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  venue TEXT NOT NULL,
  venue_address TEXT,
  ticket_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create band_info table for general band information
CREATE TABLE IF NOT EXISTS public.band_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL UNIQUE, -- 'about', 'contact', 'hero', etc.
  title TEXT,
  content TEXT,
  image_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.band_info ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth required for viewing)
CREATE POLICY "Allow public read access to gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read access to events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow public read access to band_info" ON public.band_info FOR SELECT USING (true);

-- Create policies for bookings (public can insert, admin can manage)
CREATE POLICY "Allow public to create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public to read their own bookings" ON public.bookings FOR SELECT USING (true);

-- Admin policies will be added when we implement authentication
-- For now, we'll allow all operations for development
CREATE POLICY "Allow all operations on bookings for development" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Allow all operations on gallery for development" ON public.gallery FOR ALL USING (true);
CREATE POLICY "Allow all operations on events for development" ON public.events FOR ALL USING (true);
CREATE POLICY "Allow all operations on band_info for development" ON public.band_info FOR ALL USING (true);
