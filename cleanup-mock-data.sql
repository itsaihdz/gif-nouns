-- Clean up mock data from gallery_items table
-- Remove items with demo URLs or IPFS test URLs

DELETE FROM gallery_items 
WHERE gif_url LIKE '/api/generate-gif?demo=%'
   OR gif_url LIKE 'https://ipfs.io/ipfs/test%'
   OR gif_url LIKE '%demo%'
   OR creator_username LIKE 'alice.noun'
   OR creator_username LIKE 'bob.noun';

-- Reset the sequence if needed (PostgreSQL)
-- SELECT setval('gallery_items_id_seq', (SELECT MAX(id::bigint) FROM gallery_items));

-- Verify cleanup
SELECT COUNT(*) as remaining_items FROM gallery_items;
SELECT gif_url, creator_username, title FROM gallery_items ORDER BY created_at DESC LIMIT 5; 