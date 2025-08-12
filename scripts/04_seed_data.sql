-- Insert sample learning modules
INSERT INTO learning_modules (title, description, content, difficulty_level, estimated_duration, category) VALUES
('Introduction to Entrepreneurship', 'Learn the basics of starting your own business', '{"sections": [{"title": "What is Entrepreneurship?", "content": "Entrepreneurship is the process of creating and managing a business venture..."}, {"title": "Types of Businesses", "content": "There are various types of business structures..."}]}', 'beginner', 45, 'Business'),
('AI Fundamentals', 'Understanding artificial intelligence and its applications', '{"sections": [{"title": "What is AI?", "content": "Artificial Intelligence refers to..."}, {"title": "Machine Learning Basics", "content": "Machine learning is a subset of AI..."}]}', 'beginner', 60, 'Technology'),
('Financial Literacy for Youth', 'Essential financial skills for young entrepreneurs', '{"sections": [{"title": "Budgeting Basics", "content": "Creating and managing a budget..."}, {"title": "Saving Strategies", "content": "Different ways to save money..."}]}', 'beginner', 30, 'Finance'),
('Product Development', 'How to develop and launch your first product', '{"sections": [{"title": "Market Research", "content": "Understanding your target market..."}, {"title": "MVP Development", "content": "Building a minimum viable product..."}]}', 'intermediate', 90, 'Business'),
('Digital Marketing Essentials', 'Marketing your business online', '{"sections": [{"title": "Social Media Marketing", "content": "Leveraging social platforms..."}, {"title": "Content Creation", "content": "Creating engaging content..."}]}', 'intermediate', 75, 'Marketing');

-- Insert sample opportunities
INSERT INTO opportunities (title, description, type, company_organization, location, salary_range, requirements, application_deadline, application_url, contact_email, status) VALUES
('Junior Software Developer', 'Entry-level position for recent graduates', 'job', 'TechStart Inc.', 'Nairobi, Kenya', '$800-1200/month', ARRAY['Basic programming knowledge', 'Problem-solving skills', 'Team collaboration'], '2024-03-15', 'https://techstart.com/apply', 'jobs@techstart.com', 'active'),
('Marketing Internship', 'Learn digital marketing with a growing startup', 'internship', 'GrowthCo', 'Remote', '$300-500/month', ARRAY['Social media knowledge', 'Creative thinking', 'Communication skills'], '2024-02-28', 'https://growthco.com/internship', 'internships@growthco.com', 'active'),
('Youth Innovation Scholarship', 'Scholarship for innovative young entrepreneurs', 'scholarship', 'Innovation Foundation', 'Various', '$2000-5000', ARRAY['Business plan', 'Innovation project', 'Under 25 years old'], '2024-04-30', 'https://innovation.org/scholarship', 'scholarships@innovation.org', 'active'),
('Startup Pitch Competition', 'Win funding for your startup idea', 'competition', 'Venture Hub', 'Lagos, Nigeria', '$10000 prize', ARRAY['Startup idea', 'Pitch deck', 'Team of 2-4 members'], '2024-03-31', 'https://venturehub.com/competition', 'competition@venturehub.com', 'active');

-- Insert sample community posts
INSERT INTO community_posts (author_id, title, content, category, tags) VALUES
((SELECT id FROM profiles LIMIT 1), 'Tips for First-Time Entrepreneurs', 'Starting your first business can be overwhelming. Here are some key tips that helped me get started...', 'Business', ARRAY['entrepreneurship', 'startup', 'tips']),
((SELECT id FROM profiles LIMIT 1), 'How I Built My First App', 'Last month I launched my first mobile app. Here''s my journey from idea to launch...', 'Technology', ARRAY['app development', 'mobile', 'coding']),
((SELECT id FROM profiles LIMIT 1), 'Budgeting as a Young Adult', 'Managing money in your 20s is crucial. Here''s how I learned to budget effectively...', 'Finance', ARRAY['budgeting', 'finance', 'money management']);
