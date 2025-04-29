/*
  # Initial schema setup for blog CMS

  1. New Tables
    - `profiles` 
      - `id` (uuid, primary key) - references auth.users
      - `full_name` (text)
      - `avatar_url` (text)
      - `bio` (text)
      - `website` (text)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `user_id` (uuid, references profiles.id)
      - `published` (boolean)
      - `featured` (boolean)
      - `slug` (text, unique)
      - `excerpt` (text)
      - `cover_image` (text)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `created_at` (timestamp with timezone)
    - `post_categories`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references posts.id)
      - `category_id` (uuid, references categories.id)
      
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public access to published posts
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  published boolean DEFAULT false,
  featured boolean DEFAULT false,
  slug text UNIQUE NOT NULL,
  excerpt text,
  cover_image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create post_categories table
CREATE TABLE IF NOT EXISTS post_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Posts Policies
CREATE POLICY "Published posts are viewable by everyone"
  ON posts FOR SELECT
  USING (published = true);

CREATE POLICY "Users can view their own posts"
  ON posts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- Categories Policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can create categories"
  ON categories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Post Categories Policies
CREATE POLICY "Post categories are viewable by everyone"
  ON post_categories FOR SELECT
  USING (true);

CREATE POLICY "Users can manage categories for their own posts"
  ON post_categories FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM posts WHERE id = post_id
    )
  );

CREATE POLICY "Users can update categories for their own posts"
  ON post_categories FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM posts WHERE id = post_id
    )
  );

CREATE POLICY "Users can delete categories for their own posts"
  ON post_categories FOR DELETE
  USING (
    auth.uid() IN (
      SELECT user_id FROM posts WHERE id = post_id
    )
  );