-- Reset all vote counts to clean state for testing
-- This will remove all existing votes and reset vote counts to 0

-- Delete all existing votes
DELETE FROM votes;

-- Reset vote counts in gallery_items to 0
UPDATE gallery_items SET upvotes = 0, downvotes = 0;

-- Show current state after reset
SELECT 
    id,
    gif_url,
    title,
    upvotes,
    downvotes
FROM gallery_items
ORDER BY created_at DESC;

-- Show votes table (should be empty)
SELECT COUNT(*) as total_votes FROM votes;
