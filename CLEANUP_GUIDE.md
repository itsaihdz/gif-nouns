# 🧹 Supabase Database & Storage Cleanup Guide

This guide will help you completely reset your Supabase database and storage to start fresh with the new schema and wallet requirements.

## ⚠️ Important Warnings

**Before proceeding, please note:**
- This will **permanently delete** all existing GIFs, user data, and gallery items
- This action **cannot be undone**
- Make sure you have backups of any important data
- This will reset all sequences and indexes

## 🎯 What This Cleanup Will Do

1. **Remove all data** from `gallery_items`, `users`, and `votes` tables
2. **Delete all GIFs** from the Supabase Storage `gifs` bucket
3. **Reset all sequences** to start from 1
4. **Recreate indexes** for optimal performance
5. **Verify the cleanup** was successful

## 📋 Step-by-Step Cleanup Process

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to the **SQL Editor** in the left sidebar

### Step 2: Clean Up Database Tables

1. Open the **SQL Editor**
2. Copy and paste the contents of `cleanup-database.sql`
3. Click **Run** to execute the script
4. Verify that all tables show 0 records

### Step 3: Clean Up Storage Bucket

1. In the **SQL Editor**, copy and paste the contents of `cleanup-storage.sql`
2. Click **Run** to execute the script
3. Verify that the `gifs` bucket is now empty

### Step 4: Verify Cleanup

After running both scripts, you should see:
- All tables showing 0 records
- Storage bucket showing 0 files
- All sequences reset to 1
- Indexes recreated successfully

## 🔄 Post-Cleanup Verification

### Check Database Tables

```sql
-- Verify all tables are empty
SELECT 'gallery_items' as table_name, COUNT(*) as count FROM gallery_items
UNION ALL
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'votes' as table_name, COUNT(*) as count FROM votes;
```

### Check Storage Bucket

```sql
-- Verify storage bucket is empty
SELECT COUNT(*) as file_count FROM storage.objects WHERE bucket_id = 'gifs';
```

### Check Database Structure

```sql
-- Verify table structure is correct
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('gallery_items', 'users', 'votes')
ORDER BY table_name, ordinal_position;
```

## 🎉 After Cleanup

Once the cleanup is complete:

1. **Your database will be completely clean** - no old data, no conflicting entries
2. **Storage will be empty** - ready for new GIFs
3. **All sequences will be reset** - new entries will start from ID 1
4. **Indexes will be optimized** - for the new schema structure

## 🚀 Next Steps

After cleanup:

1. **Test the application** - Create a new GIF to verify everything works
2. **Check the gallery** - Ensure new GIFs appear correctly
3. **Verify wallet integration** - Test with connected wallets
4. **Test Neynar integration** - Ensure creator info is fetched properly

## 🆘 Troubleshooting

### If cleanup fails:

1. **Check permissions** - Ensure you have admin access to the database
2. **Check foreign key constraints** - Some tables might have CASCADE deletes
3. **Check storage policies** - Ensure you can delete from storage
4. **Contact Supabase support** - If you encounter technical issues

### If you need to restore:

- **Database**: Use your Supabase backups (if enabled)
- **Storage**: You'll need to re-upload any important GIFs
- **Configuration**: Re-run the migration scripts if needed

## 📞 Support

If you encounter any issues during the cleanup process:

1. Check the Supabase documentation
2. Review the error messages in the SQL Editor
3. Contact Supabase support if needed
4. Check the application logs for any issues

---

**Remember**: This is a one-time cleanup to ensure optimal performance with the new schema. After this, your application will work seamlessly with the new wallet requirements and database structure.
