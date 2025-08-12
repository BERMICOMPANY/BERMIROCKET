-- Add role column to profiles table for admin functionality
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Create index for role column
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Update admin user role if exists
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@bermirocket.com';

-- Add RLS policy for role-based access
CREATE POLICY "Users can read own profile and admins can read all" ON profiles
FOR SELECT USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
