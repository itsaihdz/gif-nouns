import { supabase } from './supabase';

export interface StorageUploadResult {
  url: string;
  path: string;
  size: number;
  contentType: string;
}

export interface StorageError {
  message: string;
  code?: string;
}

/**
 * Upload a GIF file to Supabase Storage
 */
export async function uploadGifToStorage(
  file: File | Blob,
  filename: string,
  bucket: string = 'gifs'
): Promise<StorageUploadResult> {
  try {
    console.log('📤 Uploading GIF to Supabase Storage:', { filename, size: file.size, type: file.type });

    // Ensure the bucket exists (this will be handled by Supabase admin)
    // For now, we'll assume the bucket is already created

    // Generate a unique path for the file
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}_${filename}`;
    const filePath = `${uniqueFilename}`;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: file.type || 'image/gif',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Supabase Storage upload error:', error);
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from storage upload');
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    const result: StorageUploadResult = {
      url: urlData.publicUrl,
      path: filePath,
      size: file.size,
      contentType: file.type || 'image/gif'
    };

    console.log('✅ GIF uploaded to Supabase Storage:', result);
    return result;

  } catch (error) {
    console.error('❌ Error uploading to Supabase Storage:', error);
    throw error;
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFileFromStorage(
  filePath: string,
  bucket: string = 'gifs'
): Promise<void> {
  try {
    console.log('🗑️ Deleting file from Supabase Storage:', { filePath, bucket });

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('❌ Error deleting from Supabase Storage:', error);
      throw new Error(`Storage deletion failed: ${error.message}`);
    }

    console.log('✅ File deleted from Supabase Storage');
  } catch (error) {
    console.error('❌ Error deleting from Supabase Storage:', error);
    throw error;
  }
}

/**
 * Get a list of files in a bucket
 */
export async function listFilesInBucket(
  bucket: string = 'gifs',
  folder?: string
): Promise<string[]> {
  try {
    console.log('📋 Listing files in Supabase Storage:', { bucket, folder });

    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder || '');

    if (error) {
      console.error('❌ Error listing files from Supabase Storage:', error);
      throw new Error(`Storage listing failed: ${error.message}`);
    }

    const files = data?.map(item => item.name) || [];
    console.log('✅ Files listed from Supabase Storage:', files);
    return files;

  } catch (error) {
    console.error('❌ Error listing files from Supabase Storage:', error);
    throw error;
  }
}

/**
 * Get the public URL for a file
 */
export function getPublicUrl(
  filePath: string,
  bucket: string = 'gifs'
): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Check if a bucket exists
 */
export async function bucketExists(bucket: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Error checking bucket existence:', error);
      return false;
    }

    return data?.some(b => b.name === bucket) || false;
  } catch (error) {
    console.error('❌ Error checking bucket existence:', error);
    return false;
  }
}

/**
 * Create a bucket if it doesn't exist
 * Note: This requires admin privileges and should be done through Supabase dashboard
 */
export async function createBucketIfNotExists(
  bucket: string,
  isPublic: boolean = true
): Promise<void> {
  try {
    const exists = await bucketExists(bucket);
    
    if (!exists) {
      console.log(`🪣 Creating bucket: ${bucket}`);
      
      const { error } = await supabase.storage.createBucket(bucket, {
        public: isPublic,
        allowedMimeTypes: ['image/gif', 'image/png', 'image/jpeg', 'image/jpg'],
        fileSizeLimit: 5242880 // 5MB
      });

      if (error) {
        console.error('❌ Error creating bucket:', error);
        throw new Error(`Bucket creation failed: ${error.message}`);
      }

      console.log(`✅ Bucket created: ${bucket}`);
    } else {
      console.log(`✅ Bucket already exists: ${bucket}`);
    }
  } catch (error) {
    console.error('❌ Error creating bucket:', error);
    throw error;
  }
} 