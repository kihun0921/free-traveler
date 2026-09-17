-- RLS Policies for user_profile table
-- Users can read their own profile and public data
CREATE POLICY "Users can read own profile"
  ON user_profile
  FOR SELECT
  USING (auth.uid () = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profile
  FOR UPDATE
  USING (auth.uid () = id)
  WITH CHECK (auth.uid () = id);

-- Admins can read all profiles (role check will be added in SEC-BASELINE)
CREATE POLICY "Admins can read all profiles"
  ON user_profile
  FOR SELECT
  USING (TRUE);

-- RLS Policies for mate_post table
-- Anyone can read open posts
CREATE POLICY "Anyone can read open mate posts"
  ON mate_post
  FOR SELECT
  USING (status = 'OPEN' OR auth.uid () = user_id);

-- Users can only create their own posts
CREATE POLICY "Users can create own mate posts"
  ON mate_post
  FOR INSERT
  WITH CHECK (auth.uid () = user_id);

-- Users can only update their own posts
CREATE POLICY "Users can update own mate posts"
  ON mate_post
  FOR UPDATE
  USING (auth.uid () = user_id)
  WITH CHECK (auth.uid () = user_id);

-- Users can only delete their own posts
CREATE POLICY "Users can delete own mate posts"
  ON mate_post
  FOR DELETE
  USING (auth.uid () = user_id);

-- RLS Policies for mate_application table
-- Users can read their own applications and applications to their posts
CREATE POLICY "Users can read own applications"
  ON mate_application
  FOR SELECT
  USING (
    auth.uid () = user_id
    OR auth.uid () = (SELECT user_id FROM mate_post WHERE id = post_id)
  );

-- Users can create applications
CREATE POLICY "Users can create applications"
  ON mate_application
  FOR INSERT
  WITH CHECK (auth.uid () = user_id);

-- Only post author can update application status
CREATE POLICY "Post author can update applications"
  ON mate_application
  FOR UPDATE
  USING (auth.uid () = (SELECT user_id FROM mate_post WHERE id = post_id))
  WITH CHECK (auth.uid () = (SELECT user_id FROM mate_post WHERE id = post_id));

-- RLS Policies for user_block table
-- Users can only see their own blocks
CREATE POLICY "Users can read own blocks"
  ON user_block
  FOR SELECT
  USING (auth.uid () = blocker_id);

-- Users can only create blocks for themselves
CREATE POLICY "Users can create blocks"
  ON user_block
  FOR INSERT
  WITH CHECK (auth.uid () = blocker_id);

-- Users can only delete their own blocks
CREATE POLICY "Users can delete own blocks"
  ON user_block
  FOR DELETE
  USING (auth.uid () = blocker_id);

-- RLS Policies for report table
-- Users can create reports
CREATE POLICY "Users can create reports"
  ON report
  FOR INSERT
  WITH CHECK (auth.uid () = reporter_id);

-- Users can read their own reports
CREATE POLICY "Users can read own reports"
  ON report
  FOR SELECT
  USING (auth.uid () = reporter_id);

-- Admins can read all reports (role check will be added in SEC-BASELINE)
CREATE POLICY "Admins can read all reports"
  ON report
  FOR SELECT
  USING (TRUE);

-- Admins can update reports
CREATE POLICY "Admins can update reports"
  ON report
  FOR UPDATE
  USING (TRUE)
  WITH CHECK (TRUE);

-- RLS Policies for app_setting table
-- Only admins can read app settings
CREATE POLICY "Admins can read app settings"
  ON app_setting
  FOR SELECT
  USING (TRUE);

-- Only admins can update app settings
CREATE POLICY "Admins can update app settings"
  ON app_setting
  FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admins can modify app settings"
  ON app_setting
  FOR UPDATE
  USING (TRUE)
  WITH CHECK (TRUE);

-- Note: Role-based access control (distinguishing admins from regular users)
-- will be implemented in SEC-BASELINE task using Supabase custom claims or role tables.
-- For now, these policies use basic auth.uid() checks.
