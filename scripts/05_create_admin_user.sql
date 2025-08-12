-- Create admin user with credentials
-- Email: admin@bermirocket.com
-- Password: BermiAdmin2024!

-- First, ensure the auth.users table exists and insert admin user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@bermirocket.com',
  crypt('BermiAdmin2024!', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Create corresponding profile for the admin user
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  location,
  currency,
  skills,
  interests,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@bermirocket.com'),
  'admin@bermirocket.com',
  'Bermi Rocket Administrator',
  'admin',
  'Global',
  'USD',
  ARRAY['Platform Management', 'User Support', 'System Administration'],
  ARRAY['Youth Empowerment', 'Technology', 'Education'],
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  full_name = 'Bermi Rocket Administrator',
  updated_at = now();

-- Grant admin permissions
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@bermirocket.com';
