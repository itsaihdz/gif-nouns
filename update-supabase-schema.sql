-- Update Supabase Database Schema
-- This script ensures all required columns and tables exist

-- Drop existing tables if they exist (for clean recreation)
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS gallery_items CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  fid BIGINT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  pfp TEXT NOT NULL,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gif_url TEXT NOT NULL,
  creator_fid BIGINT NOT NULL REFERENCES users(fid) ON DELETE CASCADE,
  creator_username VARCHAR(255) NOT NULL,
  creator_pfp TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  noggle_color VARCHAR(50) NOT NULL,
  eye_animation VARCHAR(50) NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table with vote_type column
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_item_id UUID NOT NULL REFERENCES gallery_items(id) ON DELETE CASCADE,
  voter_fid BIGINT NOT NULL REFERENCES users(fid) ON DELETE CASCADE,
  voter_username VARCHAR(255) NOT NULL,
  voter_pfp TEXT NOT NULL,
  vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gallery_item_id, voter_fid)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_items_created_at ON gallery_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_items_creator_fid ON gallery_items(creator_fid);
CREATE INDEX IF NOT EXISTS idx_votes_gallery_item_id ON votes(gallery_item_id);
CREATE INDEX IF NOT EXISTS idx_votes_voter_fid ON votes(voter_fid);
CREATE INDEX IF NOT EXISTS idx_votes_vote_type ON votes(vote_type);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Gallery items are viewable by everyone" ON gallery_items;
DROP POLICY IF EXISTS "Votes are viewable by everyone" ON votes;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Authenticated users can create gallery items" ON gallery_items;
DROP POLICY IF EXISTS "Authenticated users can update gallery items" ON gallery_items;
DROP POLICY IF EXISTS "Authenticated users can vote" ON votes;
DROP POLICY IF EXISTS "Users can remove their own votes" ON votes;

-- Create policies for public read access
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Gallery items are viewable by everyone" ON gallery_items
  FOR SELECT USING (true);

CREATE POLICY "Votes are viewable by everyone" ON votes
  FOR SELECT USING (true);

-- Create policies for authenticated users
CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can create gallery items" ON gallery_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery items" ON gallery_items
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can vote" ON votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can remove their own votes" ON votes
  FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_gallery_items_updated_at ON gallery_items;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_items_updated_at BEFORE UPDATE ON gallery_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO users (fid, username, display_name, pfp, follower_count, following_count) VALUES
  (12345, 'alice.noun', 'Alice Noun', '', 42, 38),
  (23456, 'bob.noun', 'Bob Noun', '', 38, 42),
  (34567, 'charlie.noun', 'Charlie Noun', '', 25, 30),
  (45678, 'diana.noun', 'Diana Noun', '', 55, 45)
ON CONFLICT (fid) DO NOTHING;

INSERT INTO gallery_items (gif_url, creator_fid, creator_username, creator_pfp, title, noggle_color, eye_animation, upvotes, downvotes) VALUES
  ('/api/generate-gif?demo=1', 12345, 'alice.noun', '', 'gifnouns #1', 'blue', 'nouns', 42, 5),
  ('/api/generate-gif?demo=2', 23456, 'bob.noun', '', 'gifnouns #2', 'grass', 'viscos', 38, 2),
  ('/api/generate-gif?demo=test', 34567, 'charlie.noun', '', 'gifnouns #3', 'red', 'nouns', 25, 3)
ON CONFLICT DO NOTHING; 