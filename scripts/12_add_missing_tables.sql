-- Adding missing tables for courses and PRDs functionality

-- Create courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  duration TEXT DEFAULT '1 hour',
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  type TEXT DEFAULT 'course' CHECK (type IN ('course', 'quiz', 'project')),
  prerequisites TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped')),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_id)
);

-- Create PRDs table if it doesn't exist
CREATE TABLE IF NOT EXISTS prds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_description TEXT,
  target_users TEXT,
  pain_points TEXT,
  user_goals TEXT,
  platform_requirements TEXT,
  technical_stack TEXT,
  integrations TEXT,
  timeline TEXT,
  success_metrics TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE prds ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Anyone can view published courses" ON courses
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for user_courses
CREATE POLICY "Users can view their own course enrollments" ON user_courses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own course enrollments" ON user_courses
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for PRDs
CREATE POLICY "Users can manage their own PRDs" ON prds
  FOR ALL USING (auth.uid() = user_id);

-- Insert sample courses
INSERT INTO courses (title, description, content, duration, difficulty, type, status) VALUES
('Business Fundamentals', 'Learn the basics of entrepreneurship and business planning', 'This course covers the essential concepts of starting and running a business...', '2 hours', 'beginner', 'course', 'published'),
('AI Basics for Entrepreneurs', 'Understanding AI and how to leverage it in your business', 'Explore how artificial intelligence can transform your business operations...', '1.5 hours', 'beginner', 'course', 'published'),
('Product Development Quiz', 'Test your knowledge on product creation and development', 'A comprehensive quiz covering product development methodologies...', '30 mins', 'intermediate', 'quiz', 'published'),
('Create Your First PRD', 'Guided project to build a Product Requirements Document', 'Step-by-step project to create a professional PRD...', '3 hours', 'intermediate', 'project', 'published'),
('Advanced Marketing Strategies', 'Deep dive into digital marketing and growth hacking', 'Advanced techniques for scaling your business through marketing...', '2.5 hours', 'advanced', 'course', 'published')
ON CONFLICT DO NOTHING;
