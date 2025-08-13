-- Create admin user and test data
-- This script creates the admin user and sample data for testing

-- First, let's create the admin user profile (assuming auth user already exists)
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  location,
  currency,
  phone,
  bio,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin@bermirocket.com',
  'Bermi Admin',
  'admin',
  'Dar es Salaam, Tanzania',
  'TZS',
  '+255123456789',
  'Platform Administrator for Bermi Rocket',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  full_name = 'Bermi Admin',
  email = 'admin@bermirocket.com',
  location = 'Dar es Salaam, Tanzania',
  currency = 'TZS',
  updated_at = NOW();

-- Create sample courses for testing
INSERT INTO courses (
  id,
  title,
  description,
  instructor,
  duration,
  level,
  category,
  price,
  currency,
  image_url,
  created_by,
  created_at
) VALUES 
(
  gen_random_uuid(),
  'Introduction to Entrepreneurship',
  'Learn the basics of starting and running a successful business',
  'Dr. Sarah Johnson',
  '4 weeks',
  'beginner',
  'Business',
  50000,
  'TZS',
  '/placeholder.svg?height=200&width=300',
  '00000000-0000-0000-0000-000000000001'::uuid,
  NOW()
),
(
  gen_random_uuid(),
  'Digital Marketing Fundamentals',
  'Master the art of online marketing and social media promotion',
  'Mark Thompson',
  '6 weeks',
  'intermediate',
  'Marketing',
  75000,
  'TZS',
  '/placeholder.svg?height=200&width=300',
  '00000000-0000-0000-0000-000000000001'::uuid,
  NOW()
),
(
  gen_random_uuid(),
  'Financial Management for SMEs',
  'Learn how to manage finances for small and medium enterprises',
  'Prof. Grace Mwangi',
  '8 weeks',
  'advanced',
  'Finance',
  100000,
  'TZS',
  '/placeholder.svg?height=200&width=300',
  '00000000-0000-0000-0000-000000000001'::uuid,
  NOW()
);

-- Create sample opportunities for testing
INSERT INTO opportunities (
  id,
  title,
  description,
  type,
  company,
  location,
  salary_min,
  salary_max,
  currency,
  requirements,
  deadline,
  created_by,
  created_at
) VALUES 
(
  gen_random_uuid(),
  'Junior Software Developer',
  'Join our tech team and help build innovative solutions for African businesses',
  'job',
  'TechAfrica Solutions',
  'Dar es Salaam, Tanzania',
  800000,
  1200000,
  'TZS',
  ARRAY['Bachelor''s degree in Computer Science', 'Knowledge of JavaScript/React', '1+ years experience'],
  NOW() + INTERVAL '30 days',
  '00000000-0000-0000-0000-000000000001'::uuid,
  NOW()
),
(
  gen_random_uuid(),
  'Marketing Internship Program',
  'Gain hands-on experience in digital marketing and brand management',
  'internship',
  'Creative Agency Ltd',
  'Nairobi, Kenya',
  300000,
  500000,
  'TZS',
  ARRAY['Currently pursuing Marketing/Business degree', 'Strong communication skills', 'Social media savvy'],
  NOW() + INTERVAL '45 days',
  '00000000-0000-0000-0000-000000000001'::uuid,
  NOW()
),
(
  gen_random_uuid(),
  'Young Entrepreneurs Grant',
  'Funding opportunity for innovative business ideas from youth aged 18-30',
  'scholarship',
  'East Africa Development Fund',
  'Regional',
  1000000,
  5000000,
  'TZS',
  ARRAY['Age 18-30', 'Innovative business plan', 'Registered business or willing to register'],
  NOW() + INTERVAL '60 days',
  '00000000-0000-0000-0000-000000000001'::uuid,
  NOW()
);

-- Create sample businesses for testing
INSERT INTO businesses (
  id,
  name,
  description,
  category,
  owner_id,
  location,
  phone,
  email,
  website,
  logo_url,
  status,
  created_at
) VALUES 
(
  gen_random_uuid(),
  'Fresh Fruits Market',
  'Premium quality fresh fruits delivered to your doorstep',
  'Food & Beverage',
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Dar es Salaam, Tanzania',
  '+255987654321',
  'info@freshfruits.co.tz',
  'https://freshfruits.co.tz',
  '/placeholder.svg?height=100&width=100',
  'active',
  NOW()
),
(
  gen_random_uuid(),
  'Tech Solutions Hub',
  'Custom software development and IT consulting services',
  'Technology',
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Nairobi, Kenya',
  '+254712345678',
  'hello@techsolutions.ke',
  'https://techsolutions.ke',
  '/placeholder.svg?height=100&width=100',
  'active',
  NOW()
);

-- Grant admin user access to all features
UPDATE profiles SET 
  role = 'admin',
  updated_at = NOW()
WHERE id = '00000000-0000-0000-0000-000000000001'::uuid;

-- Create admin authentication record (this would normally be done through Supabase Auth)
-- Note: In production, you would create this user through the Supabase dashboard or auth API
