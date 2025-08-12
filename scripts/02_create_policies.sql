-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Learning modules policies (public read, admin write)
CREATE POLICY "Anyone can view learning modules" ON learning_modules FOR SELECT USING (true);

-- User progress policies
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);

-- AI chat policies
CREATE POLICY "Users can manage own chat sessions" ON ai_chat_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own chat messages" ON ai_chat_messages FOR ALL USING (
  auth.uid() IN (SELECT user_id FROM ai_chat_sessions WHERE id = session_id)
);

-- Financial policies
CREATE POLICY "Users can view savings groups they're in" ON savings_groups FOR SELECT USING (
  auth.uid() = created_by OR 
  auth.uid() IN (SELECT user_id FROM savings_group_members WHERE group_id = id)
);
CREATE POLICY "Users can create savings groups" ON savings_groups FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Group creators can update their groups" ON savings_groups FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can manage own expenses" ON expenses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own financial goals" ON financial_goals FOR ALL USING (auth.uid() = user_id);

-- Business policies
CREATE POLICY "Anyone can view active businesses" ON businesses FOR SELECT USING (status = 'active');
CREATE POLICY "Users can manage own businesses" ON businesses FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = business_id AND status = 'active')
);
CREATE POLICY "Business owners can manage their products" ON products FOR ALL USING (
  auth.uid() IN (SELECT owner_id FROM businesses WHERE id = business_id)
);

-- Orders policies
CREATE POLICY "Users can view their orders" ON orders FOR SELECT USING (
  auth.uid() = customer_id OR 
  auth.uid() IN (SELECT owner_id FROM businesses WHERE id = business_id)
);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Opportunities policies
CREATE POLICY "Anyone can view active opportunities" ON opportunities FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create opportunities" ON opportunities FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can manage their opportunities" ON opportunities FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Users can manage own applications" ON opportunity_applications FOR ALL USING (auth.uid() = user_id);

-- Community policies
CREATE POLICY "Anyone can view community posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own posts" ON community_posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can manage own likes" ON post_likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own comments" ON post_comments FOR ALL USING (auth.uid() = author_id);
CREATE POLICY "Anyone can view comments" ON post_comments FOR SELECT USING (true);

-- Teaching policies
CREATE POLICY "Anyone can view available sessions" ON teaching_sessions FOR SELECT USING (status = 'available');
CREATE POLICY "Teachers can manage own sessions" ON teaching_sessions FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Users can view their bookings" ON session_bookings FOR SELECT USING (
  auth.uid() = student_id OR 
  auth.uid() IN (SELECT teacher_id FROM teaching_sessions WHERE id = session_id)
);
CREATE POLICY "Students can create bookings" ON session_bookings FOR INSERT WITH CHECK (auth.uid() = student_id);

-- PRD policies
CREATE POLICY "Users can view PRDs they have access to" ON prds FOR SELECT USING (
  auth.uid() = author_id OR auth.uid() = ANY(collaborators)
);
CREATE POLICY "Users can manage own PRDs" ON prds FOR ALL USING (auth.uid() = author_id);
