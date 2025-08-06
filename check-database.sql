-- Check current table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'gallery_items'
ORDER BY ordinal_position;

-- Check sample data
SELECT 
  id,
  gif_url,
  creator_wallet,
  creator_username,
  creator_fid,
  noggle_color,
  eye_animation,
  upvotes,
  downvotes,
  created_at
FROM gallery_items 
ORDER BY created_at DESC 
LIMIT 5;

-- Count total records
SELECT COUNT(*) as total_gallery_items FROM gallery_items;

-- Check for GIFs with missing creator info
SELECT COUNT(*) as gifs_without_creator_info 
FROM gallery_items 
WHERE creator_wallet IS NULL AND creator_username IS NULL; 