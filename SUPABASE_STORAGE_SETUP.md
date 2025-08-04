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

### **Via Supabase Dashboard (Required)**

1. **Login to Supabase Dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Navigate to Storage**
   - In the left sidebar, click on **"Storage"**
   - Click **"Create a new bucket"**

3. **Configure the Bucket**
   - **Name**: `gifs` (exactly this name)
   - **Public bucket**: ✅ **Check this box** (important for sharing)
   - **File size limit**: `5 MB` (or higher if needed)
   - **Allowed MIME types**: `image/gif` (or leave empty for all types)
   - Click **"Create bucket"**

4. **Verify Bucket Creation**
   - You should see the `gifs` bucket in your storage list
   - The bucket should show as "Public"

## 🔐 **Step 2: Configure Storage Policies (Optional but Recommended)**

### **For Public Read Access**
```sql
-- Allow public read access to all files in the gifs bucket
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'gifs');
```

### **For Authenticated Uploads**
```sql
-- Allow authenticated users to upload to the gifs bucket
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'gifs' AND auth.role() = 'authenticated');
```

### **For Public Uploads (if you want anyone to upload)**
```sql
-- Allow public uploads to the gifs bucket
CREATE POLICY "Public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'gifs');
```

## 🧪 **Step 3: Test the Setup**

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Test the storage connection**:
   ```bash
   curl http://localhost:3000/api/storage/test-simple
   ```

3. **Expected Response**:
   ```json
   {
     "success": true,
     "connection": "database_ok",
     "storage": "accessible",
     "files": 0
   }
   ```

## 🚀 **Step 4: Test GIF Upload**

1. **Generate a GIF** in your app
2. **Click "Export Animated GIF"**
3. **Check the console** for upload progress
4. **Verify the file** appears in your Supabase Storage dashboard

## 🔧 **Troubleshooting**

### **Error: "Storage bucket 'gifs' does not exist"**
- **Solution**: Create the bucket in Supabase dashboard as described above
- **Verify**: Check that the bucket name is exactly `gifs` (lowercase)

### **Error: "fetch failed"**
- **Solution**: Check your internet connection and Supabase URL
- **Verify**: Ensure `NEXT_PUBLIC_SUPABASE_URL` is correct

### **Error: "new row violates row-level security policy"**
- **Solution**: Create the storage policies as described above
- **Alternative**: Make the bucket public in the dashboard

### **Files not showing in dashboard**
- **Check**: Ensure the bucket is set to "Public"
- **Verify**: Check the storage policies allow the operation

## 📊 **Benefits of Supabase Storage**

- ✅ **Permanent URLs**: Files persist and are always accessible
- ✅ **Fast CDN**: Global content delivery network
- ✅ **Cost Effective**: Generous free tier
- ✅ **Easy Sharing**: Direct links to GIFs
- ✅ **Scalable**: Handles large files and high traffic
- ✅ **Secure**: Built-in authentication and policies

## 🔗 **Useful Links**

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Storage API Reference](https://supabase.com/docs/reference/javascript/storage-createbucket)
- [Storage Policies Guide](https://supabase.com/docs/guides/storage/policies)

---

**Need Help?** If you encounter any issues, check the browser console and server logs for detailed error messages. 