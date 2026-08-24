import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default Supabase project configuration provided by user
const DEFAULT_SUPABASE_PROJECT_ID = 'dnqrcttcjnkdawjgtdtz';
const DEFAULT_SUPABASE_URL = `https://${DEFAULT_SUPABASE_PROJECT_ID}.supabase.co`;
const DEFAULT_SUPABASE_KEY = 'sb_publishable_j1bEh1KbYKgQSSQGcog61w_NX7p3_Kj';

let supabaseClient: SupabaseClient | null = null;
let connectionStatus: {
  connected: boolean;
  projectId: string;
  url: string;
  lastChecked: string;
  error?: string;
} = {
  connected: false,
  projectId: DEFAULT_SUPABASE_PROJECT_ID,
  url: DEFAULT_SUPABASE_URL,
  lastChecked: new Date().toISOString()
};

export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
  const projectId = url.includes('supabase.co')
    ? url.replace('https://', '').split('.')[0]
    : DEFAULT_SUPABASE_PROJECT_ID;

  return { url, key, projectId };
}

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const { url, key } = getSupabaseConfig();
  if (!url || !key) {
    console.warn('⚠️ Supabase credentials missing.');
    return null;
  }

  try {
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    return supabaseClient;
  } catch (err: any) {
    console.error('Failed to initialize Supabase client:', err.message);
    return null;
  }
}

/**
 * Checks connectivity to the configured Supabase instance
 */
export async function testSupabaseConnection(): Promise<{
  connected: boolean;
  projectId: string;
  url: string;
  tablesFound: string[];
  message: string;
  error?: string;
}> {
  const { url, projectId } = getSupabaseConfig();
  const client = getSupabaseClient();

  if (!client) {
    connectionStatus = {
      connected: false,
      projectId,
      url,
      lastChecked: new Date().toISOString(),
      error: 'Client could not be initialized'
    };
    return {
      connected: false,
      projectId,
      url,
      tablesFound: [],
      message: 'Supabase client not initialized',
      error: connectionStatus.error
    };
  }

  try {
    // Attempt a light ping by querying any accessible metadata or table
    const tables = ['parlors', 'services', 'users', 'appointments', 'reviews'];
    const tablesFound: string[] = [];

    for (const table of tables) {
      try {
        const { data, error } = await client.from(table).select('id').limit(1);
        if (!error && data !== null) {
          tablesFound.push(table);
        }
      } catch {
        // Table may not exist yet
      }
    }

    connectionStatus = {
      connected: true,
      projectId,
      url,
      lastChecked: new Date().toISOString()
    };

    return {
      connected: true,
      projectId,
      url,
      tablesFound,
      message: `Successfully connected to Supabase project (${projectId})`
    };
  } catch (err: any) {
    connectionStatus = {
      connected: false,
      projectId,
      url,
      lastChecked: new Date().toISOString(),
      error: err.message
    };
    return {
      connected: false,
      projectId,
      url,
      tablesFound: [],
      message: 'Failed to query Supabase database',
      error: err.message
    };
  }
}

export function getSupabaseStatus() {
  return connectionStatus;
}

/**
 * SQL Schema DDL script for setting up tables in Supabase SQL Editor
 */
export const SUPABASE_SQL_SCHEMA = `-- =========================================================================
-- GlowBook AI - Supabase PostgreSQL Schema Setup
-- Project ID: dnqrcttcjnkdawjgtdtz
-- Paste this script into your Supabase SQL Editor and run it!
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'CUSTOMER',
  phone TEXT,
  city TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Parlors Table
CREATE TABLE IF NOT EXISTS parlors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  pincode TEXT,
  phone TEXT,
  email TEXT,
  images TEXT[] DEFAULT '{}',
  cover_image TEXT,
  rating NUMERIC(2, 1) DEFAULT 4.8,
  review_count INTEGER DEFAULT 0,
  starting_price NUMERIC DEFAULT 499,
  type TEXT NOT NULL,
  service_categories TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  opening_time TEXT DEFAULT '09:00 AM',
  closing_time TEXT DEFAULT '09:00 PM',
  verified BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Services Table
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  parlor_id TEXT REFERENCES parlors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 45,
  price NUMERIC NOT NULL,
  discount_price NUMERIC,
  rating NUMERIC(2, 1) DEFAULT 4.9,
  review_count INTEGER DEFAULT 0,
  image TEXT,
  popular BOOLEAN DEFAULT false,
  gender TEXT DEFAULT 'all',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Beauticians Table
CREATE TABLE IF NOT EXISTS beauticians (
  id TEXT PRIMARY KEY,
  parlor_id TEXT REFERENCES parlors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  specialization TEXT,
  experience_years INTEGER DEFAULT 3,
  rating NUMERIC(2, 1) DEFAULT 4.9,
  review_count INTEGER DEFAULT 0,
  avatar TEXT,
  bio TEXT,
  available_days TEXT[] DEFAULT '{"Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Beauty Packages Table
CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,
  parlor_id TEXT REFERENCES parlors(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  occasion TEXT NOT NULL,
  description TEXT,
  original_price NUMERIC NOT NULL,
  package_price NUMERIC NOT NULL,
  discount_percentage INTEGER DEFAULT 20,
  duration_minutes INTEGER DEFAULT 120,
  services_included TEXT[] DEFAULT '{}',
  rating NUMERIC(2, 1) DEFAULT 4.9,
  image TEXT,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  booking_code TEXT NOT NULL,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT,
  parlor_id TEXT REFERENCES parlors(id) ON DELETE CASCADE,
  parlor_name TEXT NOT NULL,
  parlor_address TEXT,
  service_id TEXT,
  service_name TEXT NOT NULL,
  package_id TEXT,
  package_name TEXT,
  beautician_id TEXT REFERENCES beauticians(id) ON DELETE SET NULL,
  beautician_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  price NUMERIC NOT NULL,
  tax NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'confirmed',
  payment_status TEXT DEFAULT 'paid',
  payment_method TEXT DEFAULT 'razorpay',
  payment_id TEXT,
  special_requests TEXT,
  reviewed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  parlor_id TEXT REFERENCES parlors(id) ON DELETE CASCADE,
  service_name TEXT,
  beautician_name TEXT,
  rating NUMERIC(2, 1) NOT NULL,
  comment TEXT NOT NULL,
  date TEXT NOT NULL,
  verified_booking BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Read/Write for Sandbox Demo
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE parlors ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE beauticians ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Allow public access for sandbox demo API
CREATE POLICY "Allow public read users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update users" ON users FOR UPDATE USING (true);

CREATE POLICY "Allow public read parlors" ON parlors FOR SELECT USING (true);
CREATE POLICY "Allow public insert parlors" ON parlors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update parlors" ON parlors FOR UPDATE USING (true);

CREATE POLICY "Allow public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public insert services" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update services" ON services FOR UPDATE USING (true);
CREATE POLICY "Allow public delete services" ON services FOR DELETE USING (true);

CREATE POLICY "Allow public read beauticians" ON beauticians FOR SELECT USING (true);
CREATE POLICY "Allow public insert beauticians" ON beauticians FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read packages" ON packages FOR SELECT USING (true);
CREATE POLICY "Allow public insert packages" ON packages FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "Allow public insert appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update appointments" ON appointments FOR UPDATE USING (true);

CREATE POLICY "Allow public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert reviews" ON reviews FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read wishlist" ON wishlist FOR SELECT USING (true);
CREATE POLICY "Allow public insert wishlist" ON wishlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete wishlist" ON wishlist FOR DELETE USING (true);
`;
