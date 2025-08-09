-- =====================================================
-- COMPREHENSIVE DATABASE CLEANUP SCRIPT
-- This script will remove all existing data and reset
-- the database to a clean state for the new schema
-- =====================================================

-- 1. Clear all existing data from tables
-- =====================================================

-- Clear all gallery items (this will also clear related votes due to CASCADE)
DELETE FROM gallery_items;

-- Clear all users (this will also clear related votes due to CASCADE)
DELETE FROM users;

-- Clear all votes
DELETE FROM votes;

-- Clear all storage objects (GIFs) from the gifs bucket
-- Note: This will remove all uploaded GIFs from Supabase Storage
-- You may want to backup important GIFs before running this

-- 2. Reset sequences (if using auto-increment IDs)
-- =====================================================

-- Reset the gallery_items sequence
ALTER SEQUENCE IF EXISTS gallery_items_id_seq RESTART WITH 1;

-- Reset the users sequence
ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;

-- Reset the votes sequence
ALTER SEQUENCE IF EXISTS votes_id_seq RESTART WITH 1;

-- 3. Verify cleanup
-- =====================================================

-- Check that all tables are empty
SELECT 'gallery_items' as table_name, COUNT(*) as count FROM gallery_items
UNION ALL
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'votes' as table_name, COUNT(*) as count FROM votes;

-- 4. Optional: Recreate indexes for optimal performance
-- =====================================================

-- Recreate indexes for gallery_items
CREATE INDEX IF NOT EXISTS idx_gallery_items_creator_wallet ON gallery_items(creator_wallet);
CREATE INDEX IF NOT EXISTS idx_gallery_items_gif_url ON gallery_items(gif_url);
CREATE INDEX IF NOT EXISTS idx_gallery_items_created_at ON gallery_items(created_at);

-- Recreate indexes for users
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Recreate indexes for votes
CREATE INDEX IF NOT EXISTS idx_votes_gallery_item_id ON votes(gallery_item_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);

-- 5. Verify database structure
-- =====================================================

-- Check table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('gallery_items', 'users', 'votes')
ORDER BY table_name, ordinal_position;

-- 6. Final verification
-- =====================================================

-- Show final counts (should all be 0)
SELECT 'FINAL VERIFICATION' as status;
SELECT 'gallery_items' as table_name, COUNT(*) as count FROM gallery_items
UNION ALL
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'votes' as table_name, COUNT(*) as count FROM votes;
