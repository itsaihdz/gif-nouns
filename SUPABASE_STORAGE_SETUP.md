# Supabase Storage Setup Guide

## 🎯 **Overview**

This guide will help you set up Supabase Storage to store generated GIFs, providing better sharing experience compared to blob URLs.

## 📋 **Prerequisites**

1. **Supabase Project**: You should already have a Supabase project set up
2. **Environment Variables**: Ensure these are configured in your `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## 🪣 **Step 1: Create Storage Bucket**

### **Via Supabase Dashboard (Recommended)**

1. **Login to Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Navigate to Storage**
   - In the left sidebar, click on **"Storage"**
   - Click **"Create a new bucket"**

3. **Configure the Bucket**
   - **Name**: `gifs`
   - **Public bucket**: ✅ **Enable** (This allows public access to GIFs)
   - **File size limit**: `5 MB`
   - **Allowed MIME types**: 
     - `image/gif`
     - `image/png` 
     - `image/jpeg`
     - `image/jpg`

4. **Create Bucket**
   - Click **"Create bucket"**

### **Bucket Configuration Details**

```json
{
  "name": "gifs",
  "public": true,
  "file_size_limit": 5242880,
  "allowed_mime_types": [
    "image/gif",
    "image/png", 
    "image/jpeg",
    "image/jpg"
  ]
}
```

## 🔐 **Step 2: Configure Storage Policies**

### **Public Read Policy (Required)**

1. **Go to Storage Policies**
   - In Storage section, click on the `gifs` bucket
   - Click **"Policies"** tab

2. **Create Public Read Policy**
   - Click **"New Policy"**
   - **Policy Name**: `Public Read Access`
   - **Allowed Operations**: `SELECT`
   - **Policy Definition**:
   ```sql
   CREATE POLICY "Public Read Access" ON storage.objects
   FOR SELECT USING (bucket_id = 'gifs');
   ```

### **Authenticated Upload Policy (Optional but Recommended)**

1. **Create Upload Policy**
   - Click **"New Policy"**
   - **Policy Name**: `Authenticated Upload`
   - **Allowed Operations**: `INSERT`
   - **Policy Definition**:
   ```sql
   CREATE POLICY "Authenticated Upload" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'gifs');
   ```

### **Owner Delete Policy (Optional)**

1. **Create Delete Policy**
   - Click **"New Policy"**
   - **Policy Name**: `Owner Delete`
   - **Allowed Operations**: `DELETE`
   - **Policy Definition**:
   ```sql
   CREATE POLICY "Owner Delete" ON storage.objects
   FOR DELETE USING (bucket_id = 'gifs');
   ```

## 🧪 **Step 3: Test the Setup**

### **Test Storage Connection**

```bash
# Test basic connection
curl http://localhost:3000/api/storage/test

# Test bucket existence
curl http://localhost:3000/api/storage/test?test=bucket

# List files (will be empty initially)
curl http://localhost:3000/api/storage/test?test=list
```

### **Expected Response**

```json
{
  "success": true,
  "bucket": "gifs",
  "exists": true,
  "files": [],
  "message": "Bucket test completed successfully"
}
```

## 🚀 **Step 4: Upload Test**

1. **Generate a GIF** in the app
2. **Check the upload process** - it should now use Supabase Storage
3. **Verify the URL** - should be a Supabase Storage URL like:
   ```
   https://your-project.supabase.co/storage/v1/object/public/gifs/1234567890_gifnouns_1.gif
   ```

## 🔧 **Troubleshooting**

### **Common Issues**

1. **"Bucket creation failed"**
   - ✅ **Solution**: Create bucket manually via Supabase Dashboard
   - Bucket creation requires admin privileges

2. **"Policy violation"**
   - ✅ **Solution**: Ensure storage policies are configured correctly
   - Check that public read policy exists

3. **"File upload failed"**
   - ✅ **Solution**: Check file size (max 5MB) and MIME type
   - Verify bucket exists and is public

4. **"CORS error"**
   - ✅ **Solution**: Add your domain to Supabase CORS settings
   - Go to Settings > API > CORS origins

### **CORS Configuration**

If you encounter CORS issues, add these origins to your Supabase project:

1. **Go to Settings > API**
2. **Add CORS Origins**:
   ```
   http://localhost:3000
   http://localhost:3001
   https://your-production-domain.com
   ```

## 📊 **Benefits of Supabase Storage**

### **vs Blob URLs**
- ✅ **Permanent URLs** - No expiration
- ✅ **Better Performance** - CDN delivery
- ✅ **Easy Sharing** - Direct links work everywhere
- ✅ **Scalable** - Handles large files efficiently

### **vs IPFS**
- ✅ **Faster Access** - No gateway delays
- ✅ **Reliable** - No network issues
- ✅ **Cost Effective** - Included in Supabase plan
- ✅ **Easy Management** - Dashboard interface

## 🔄 **Migration from IPFS**

If you were previously using IPFS:

1. **Existing GIFs**: Will continue to work (IPFS URLs remain valid)
2. **New GIFs**: Will use Supabase Storage
3. **Gallery**: Will show both IPFS and Supabase URLs
4. **Sharing**: Supabase URLs will load faster

## 📝 **Next Steps**

1. ✅ **Create the bucket** in Supabase Dashboard
2. ✅ **Configure policies** for public access
3. ✅ **Test the upload** with a generated GIF
4. ✅ **Verify sharing** works with new URLs

Your GIFs will now be stored permanently on Supabase Storage with fast, reliable access for sharing! 🎉 