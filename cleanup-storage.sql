-- =====================================================
-- SUPABASE STORAGE CLEANUP SCRIPT
-- This script will remove all files from the gifs bucket
-- =====================================================

-- Note: This script should be run in the Supabase SQL Editor
-- It will remove ALL files from the gifs bucket

-- 1. List all files in the gifs bucket (for verification)
-- =====================================================
SELECT 
    name,
    bucket_id,
    owner,
    created_at,
    updated_at,
    last_accessed_at,
    metadata
FROM storage.objects 
WHERE bucket_id = 'gifs'
ORDER BY created_at DESC;

-- 2. Delete all files from the gifs bucket
-- =====================================================
-- WARNING: This will permanently delete all GIFs from storage
-- Make sure you have backups if needed

DELETE FROM storage.objects 
WHERE bucket_id = 'gifs';

-- 3. Verify cleanup
-- =====================================================
-- Check that the gifs bucket is now empty
SELECT 
    'gifs' as bucket_name,
    COUNT(*) as remaining_files
FROM storage.objects 
WHERE bucket_id = 'gifs';

-- 4. Optional: Reset bucket metadata
-- =====================================================
-- Update bucket metadata to reflect clean state
UPDATE storage.buckets 
SET 
    updated_at = NOW(),
    public = true
WHERE id = 'gifs';

-- 5. Final verification
-- =====================================================
-- Show final state of storage
SELECT 'STORAGE CLEANUP COMPLETE' as status;
SELECT 
    bucket_id,
    COUNT(*) as file_count
FROM storage.objects 
GROUP BY bucket_id
ORDER BY bucket_id;
