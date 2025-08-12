-- Drop existing policies that might be blocking profile creation
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create a function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create better RLS policies
CREATE POLICY "Enable read access for users on own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update access for users on own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow profile creation during signup (this will be handled by trigger)
CREATE POLICY "Enable insert for authenticated users" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create admin user profile if it doesn't exist
INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin@bermirocket.com',
  'Admin User',
  'admin',
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE email = 'admin@bermirocket.com'
);
