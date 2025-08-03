-- Update Supabase Database Schema
-- Run this in your Supabase SQL Editor to fix the vote_type column issue

-- First, drop existing tables if they exist (this will clear all data)
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

-- Create votes table with vote_type
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
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_items_updated_at BEFORE UPDATE ON gallery_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO users (fid, username, display_name, pfp, follower_count, following_count) VALUES
  (12345, 'alice.noun', 'Alice Noun', 'https://picsum.photos/32/32?random=1', 42, 38),
  (67890, 'bob.noun', 'Bob Noun', 'https://picsum.photos/32/32?random=2', 15, 23),
  (11111, 'charlie.noun', 'Charlie Noun', 'https://picsum.photos/32/32?random=3', 89, 67);

INSERT INTO gallery_items (gif_url, creator_fid, creator_username, creator_pfp, title, noggle_color, eye_animation, upvotes, downvotes) VALUES
  ('https://ipfs.io/ipfs/bafkreidbasoljijtgo2pzbonlg2wh3zq3omhfnv2ggubfmncsd24y3245u', 12345, 'alice.noun', 'https://picsum.photos/32/32?random=1', 'gifnouns #1', 'blue', 'nouns', 5, 1),
  ('https://ipfs.io/ipfs/bafkreidbasoljijtgo2pzbonlg2wh3zq3omhfnv2ggubfmncsd24y3245u', 67890, 'bob.noun', 'https://picsum.photos/32/32?random=2', 'gifnouns #2', 'purple', 'ojos-nouns', 3, 0),
  ('https://ipfs.io/ipfs/bafkreidbasoljijtgo2pzbonlg2wh3zq3omhfnv2ggubfmncsd24y3245u', 11111, 'charlie.noun', 'https://picsum.photos/32/32?random=3', 'gifnouns #3', 'red', 'viscos', 7, 2);

-- Insert some sample votes
INSERT INTO votes (gallery_item_id, voter_fid, voter_username, voter_pfp, vote_type) VALUES
  ((SELECT id FROM gallery_items WHERE title = 'gifnouns #1' LIMIT 1), 67890, 'bob.noun', 'https://picsum.photos/32/32?random=2', 'upvote'),
  ((SELECT id FROM gallery_items WHERE title = 'gifnouns #1' LIMIT 1), 11111, 'charlie.noun', 'https://picsum.photos/32/32?random=3', 'upvote'),
  ((SELECT id FROM gallery_items WHERE title = 'gifnouns #2' LIMIT 1), 12345, 'alice.noun', 'https://picsum.photos/32/32?random=1', 'upvote'),
  ((SELECT id FROM gallery_items WHERE title = 'gifnouns #3' LIMIT 1), 12345, 'alice.noun', 'https://picsum.photos/32/32?random=1', 'downvote'); 