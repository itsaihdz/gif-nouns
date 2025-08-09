-- Add real Supabase GIF to gallery
-- This script adds the example GIF from Supabase Storage

-- First, create a user for this GIF
INSERT INTO users (fid, username, display_name, pfp, follower_count, following_count) VALUES
  (999999, '0xf1f5...Ae4', '0xf1f5...Ae4', '', 0, 0)
ON CONFLICT (fid) DO NOTHING;

-- Add the real Supabase GIF to gallery
INSERT INTO gallery_items (gif_url, creator_fid, creator_username, creator_pfp, title, noggle_color, eye_animation, upvotes, downvotes) VALUES
  ('https://wczuohfgwyywvcjfrnju.supabase.co/storage/v1/object/public/gifs//1754333651986_gifnouns_5_1754333650965.gif', 
   999999, '0xf1f5...Ae4', '', 
   'Real Supabase GIF Example', 'blue', 'nouns', 10, 0)
ON CONFLICT DO NOTHING;

-- Verify the addition
SELECT COUNT(*) as total_items FROM gallery_items;
SELECT gif_url, creator_username, title FROM gallery_items WHERE gif_url LIKE '%supabase.co%' ORDER BY created_at DESC; 