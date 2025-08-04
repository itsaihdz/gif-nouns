-- Storage Policies for GIF Nouns App
-- Run this in your Supabase SQL Editor

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to all files in the gifs bucket
CREATE POLICY "Public read access for gifs bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'gifs');

-- Policy to allow authenticated users to upload files to the gifs bucket
CREATE POLICY "Authenticated users can upload to gifs bucket" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'gifs');

-- Policy to allow public uploads to the gifs bucket (for unauthenticated users)
CREATE POLICY "Public upload access for gifs bucket" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'gifs');

-- Policy to allow users to update their own files
CREATE POLICY "Users can update their own files" ON storage.objects
FOR UPDATE USING (bucket_id = 'gifs');

-- Policy to allow users to delete their own files
CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (bucket_id = 'gifs');

-- Enable RLS on storage.buckets
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Policy to allow public read access to bucket information
CREATE POLICY "Public read access to buckets" ON storage.buckets
FOR SELECT USING (true);

-- Policy to allow authenticated users to create buckets
CREATE POLICY "Authenticated users can create buckets" ON storage.buckets
FOR INSERT WITH CHECK (true);

-- Verify the policies are created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('objects', 'buckets') 
AND schemaname = 'storage'; 