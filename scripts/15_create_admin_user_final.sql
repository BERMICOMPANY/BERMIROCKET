-- Create admin user and profile
-- This script creates the admin user directly in Supabase

-- First, let's ensure we have the proper admin user
-- Note: This needs to be run in Supabase SQL Editor as it requires admin privileges

-- Create the admin user profile (the auth user will be created via signup)
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  currency,
  location,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@bermirocket.com',
  'Bermi Rocket Admin',
  'admin',
  'TZS',
  'Tanzania',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  currency = 'TZS',
  location = 'Tanzania',
  updated_at = now();

-- Create some sample data for testing
INSERT INTO courses (
  id,
  title,
  description,
  content,
  difficulty,
  duration_minutes,
  is_published,
  created_by,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Introduction to Entrepreneurship',
  'Learn the basics of starting and running a business',
  '{"modules": [{"title": "Business Basics", "content": "Understanding business fundamentals"}]}',
  'beginner',
  120,
  true,
  (SELECT id FROM profiles WHERE email = 'admin@bermirocket.com'),
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- Create sample opportunities
INSERT INTO opportunities (
  id,
  title,
  summary,
  type,
  status,
  details,
  requirements,
  open_at,
  close_at,
  created_by_admin_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Young Entrepreneur Grant',
  'Funding opportunity for young entrepreneurs in Tanzania',
  'grant',
  'open',
  '{"amount": "50000", "currency": "TZS", "description": "Grant for innovative business ideas"}',
  '{"age": "18-35", "location": "Tanzania", "business_plan": true}',
  now(),
  now() + interval '30 days',
  (SELECT id FROM profiles WHERE email = 'admin@bermirocket.com'),
  now(),
  now()
) ON CONFLICT DO NOTHING;
