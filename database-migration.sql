-- Add creator_wallet column to gallery_items table
ALTER TABLE gallery_items 
ADD COLUMN creator_wallet TEXT;

-- Make existing creator fields nullable since we'll populate them from Neynar
ALTER TABLE gallery_items 
ALTER COLUMN creator_fid DROP NOT NULL,
ALTER COLUMN creator_username DROP NOT NULL,
ALTER COLUMN creator_pfp DROP NOT NULL;

-- Add index for faster lookups by wallet
CREATE INDEX IF NOT EXISTS idx_gallery_items_creator_wallet ON gallery_items(creator_wallet);

-- Add index for faster lookups by gif_url
CREATE INDEX IF NOT EXISTS idx_gallery_items_gif_url ON gallery_items(gif_url); 