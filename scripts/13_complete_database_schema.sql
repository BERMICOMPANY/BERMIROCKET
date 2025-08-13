-- Creating complete database schema with all required tables and policies
-- Drop existing tables if they exist to recreate with proper structure
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS opportunities CASCADE;
DROP TABLE IF EXISTS user_connections CASCADE;
DROP TABLE IF EXISTS connect_profiles CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS incomes CASCADE;
DROP TABLE IF EXISTS financial_goals CASCADE;
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS businesses CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS user_courses CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS fx_rates CASCADE;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    country TEXT,
    currency_code TEXT DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create businesses table
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    logo_url TEXT,
    cover_url TEXT,
    website TEXT,
    socials JSONB DEFAULT '{}',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media table
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    file_size INTEGER,
    captions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial_goals table
CREATE TABLE financial_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_amount DECIMAL(12,2) NOT NULL,
    current_amount DECIMAL(12,2) DEFAULT 0,
    target_currency TEXT DEFAULT 'USD',
    due_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table (for incomes and expenses)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    category TEXT,
    source TEXT,
    description TEXT,
    occurred_on DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    content JSONB DEFAULT '{}',
    difficulty TEXT DEFAULT 'beginner',
    duration_minutes INTEGER DEFAULT 60,
    is_published BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_courses table (enrollment and progress)
CREATE TABLE user_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completed_at TIMESTAMP WITH TIME ZONE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Create opportunities table
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by_admin_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('grant', 'job', 'accelerator', 'competition', 'scholarship', 'other')),
    summary TEXT,
    details JSONB DEFAULT '{}',
    requirements JSONB DEFAULT '{}',
    open_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    close_at TIMESTAMP WITH TIME ZONE,
    url TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    applicant_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'review', 'accepted', 'rejected')),
    answers JSONB DEFAULT '{}',
    attachments JSONB DEFAULT '{}',
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(opportunity_id, applicant_user_id)
);

-- Create connect_profiles table
CREATE TABLE connect_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    headline TEXT,
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_connections table
CREATE TABLE user_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    peer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, peer_id),
    CHECK (user_id != peer_id)
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    payload JSONB DEFAULT '{}',
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fx_rates table for currency conversion
CREATE TABLE fx_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    base_currency TEXT NOT NULL DEFAULT 'USD',
    currency_code TEXT NOT NULL,
    rate DECIMAL(10,6) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date, base_currency, currency_code)
);

-- Add role column to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'staff', 'user'));

-- Create indexes for performance
CREATE INDEX idx_businesses_user_id ON businesses(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_financial_goals_user_id ON financial_goals(user_id);
CREATE INDEX idx_user_courses_user_id ON user_courses(user_id);
CREATE INDEX idx_applications_user_id ON applications(applicant_user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_user_connections_user_id ON user_connections(user_id);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE connect_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Organizations policies
CREATE POLICY "Users can view their own organizations" ON organizations FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Users can create organizations" ON organizations FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Users can update their own organizations" ON organizations FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Admins can view all organizations" ON organizations FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Businesses policies
CREATE POLICY "Users can view their own businesses" ON businesses FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create businesses" ON businesses FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own businesses" ON businesses FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Public can view verified businesses" ON businesses FOR SELECT USING (is_verified = true);
CREATE POLICY "Admins can manage all businesses" ON businesses FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Financial data policies
CREATE POLICY "Users can manage their own financial goals" ON financial_goals FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can manage their own transactions" ON transactions FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can view all financial data" ON financial_goals FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can view all transactions" ON transactions FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Courses policies
CREATE POLICY "Everyone can view published courses" ON courses FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage all courses" ON courses FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- User courses policies
CREATE POLICY "Users can manage their own course enrollments" ON user_courses FOR ALL USING (user_id = auth.uid());

-- Opportunities policies
CREATE POLICY "Everyone can view published opportunities" ON opportunities FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage all opportunities" ON opportunities FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Applications policies
CREATE POLICY "Users can manage their own applications" ON applications FOR ALL USING (applicant_user_id = auth.uid());
CREATE POLICY "Admins can view and manage all applications" ON applications FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Connect profiles policies
CREATE POLICY "Users can manage their own connect profile" ON connect_profiles FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Everyone can view public connect profiles" ON connect_profiles FOR SELECT USING (visibility = 'public');

-- User connections policies
CREATE POLICY "Users can manage their own connections" ON user_connections FOR ALL USING (user_id = auth.uid() OR peer_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Media policies
CREATE POLICY "Users can manage their own media" ON media FOR ALL USING (owner_user_id = auth.uid());
CREATE POLICY "Public can view business media" ON media FOR SELECT USING (
    business_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM businesses WHERE id = media.business_id AND is_verified = true
    )
);

-- Audit logs policies (admin only)
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Insert some sample courses
INSERT INTO courses (title, description, content, difficulty, duration_minutes, is_published, created_by) VALUES
('Business Fundamentals', 'Learn the basics of starting and running a business', '{"modules": [{"title": "Introduction to Business", "content": "Understanding business basics"}, {"title": "Market Research", "content": "How to research your market"}]}', 'beginner', 120, true, (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1)),
('Financial Literacy', 'Master personal and business finance management', '{"modules": [{"title": "Budgeting Basics", "content": "Creating and managing budgets"}, {"title": "Investment Principles", "content": "Understanding investments"}]}', 'beginner', 90, true, (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1)),
('Digital Marketing', 'Learn to market your business online', '{"modules": [{"title": "Social Media Marketing", "content": "Using social media effectively"}, {"title": "Content Creation", "content": "Creating engaging content"}]}', 'intermediate', 150, true, (SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1));

-- Insert sample opportunities
INSERT INTO opportunities (created_by_admin_id, title, type, summary, details, status) VALUES
((SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1), 'Youth Entrepreneur Grant', 'grant', 'Funding for young entrepreneurs starting their first business', '{"amount": "$5000", "eligibility": "Ages 18-25", "deadline": "2024-12-31"}', 'published'),
((SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1), 'Tech Startup Accelerator', 'accelerator', '3-month intensive program for tech startups', '{"duration": "3 months", "equity": "6%", "funding": "$50000"}', 'published'),
((SELECT id FROM auth.users WHERE email LIKE '%admin%' LIMIT 1), 'Business Plan Competition', 'competition', 'Annual competition for best business plan', '{"prize": "$10000", "categories": ["Tech", "Social Impact", "Traditional"]}', 'published');

-- Insert sample fx_rates
INSERT INTO fx_rates (date, base_currency, currency_code, rate) VALUES
(CURRENT_DATE, 'USD', 'TZS', 2500.00),
(CURRENT_DATE, 'USD', 'KES', 150.00),
(CURRENT_DATE, 'USD', 'UGX', 3700.00),
(CURRENT_DATE, 'USD', 'EUR', 0.85),
(CURRENT_DATE, 'USD', 'GBP', 0.75);

-- Create function to automatically create connect profile when user signs up
CREATE OR REPLACE FUNCTION create_connect_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO connect_profiles (user_id, headline, skills, interests, visibility)
    VALUES (NEW.id, 'Aspiring Entrepreneur', '{}', '{}', 'public');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create connect profile
DROP TRIGGER IF EXISTS on_auth_user_created_connect_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_connect_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_connect_profile();
