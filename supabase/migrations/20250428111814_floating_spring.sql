/*
  # Add notification settings and post stats

  1. New Tables
    - `notification_settings`
      - User notification preferences
    - `post_stats`
      - Track post views, likes, and shares
    
  2. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Create notification settings table
CREATE TABLE IF NOT EXISTS notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  email_notifications boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create post stats table
CREATE TABLE IF NOT EXISTS post_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts ON DELETE CASCADE,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  shares integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(post_id)
);

-- Enable RLS
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_stats ENABLE ROW LEVEL SECURITY;

-- Notification settings policies
CREATE POLICY "Users can view their own notification settings"
  ON notification_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification settings"
  ON notification_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Post stats policies
CREATE POLICY "Anyone can view post stats"
  ON post_stats FOR SELECT
  USING (true);

CREATE POLICY "Post owners can update stats"
  ON post_stats FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM posts WHERE id = post_id
    )
  );