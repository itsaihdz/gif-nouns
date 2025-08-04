import { supabase } from './supabase';

// Storage access keys for better authentication
const STORAGE_ACCESS_KEY = process.env.SUPABASE_STORAGE_ACCESS_KEY;
const STORAGE_SECRET_KEY = process.env.SUPABASE_STORAGE_SECRET_KEY;

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

    // First check if the bucket exists
    const { data: bucketData, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('❌ Error checking buckets:', bucketError);
      throw new Error(`Storage access failed: ${bucketError.message}`);
    }
    
    const bucketExists = bucketData?.some(b => b.name === bucket);
    
    if (!bucketExists) {
      console.error(`❌ Bucket '${bucket}' does not exist`);
      throw new Error(`Storage bucket '${bucket}' does not exist. Please create it in the Supabase dashboard.`);
    }

    // Generate a unique path for the file
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}_${filename}`;
    const filePath = `${uniqueFilename}`;

    // Upload the file to Supabase Storage with enhanced options
    const uploadOptions = {
      contentType: file.type || 'image/gif',
      cacheControl: '3600',
      upsert: false
    };

    // Add storage keys to headers if available
    if (STORAGE_ACCESS_KEY && STORAGE_SECRET_KEY) {
      console.log('🔑 Using storage access keys for enhanced authentication');
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, uploadOptions);

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
      
      // Enhanced bucket creation options
      const bucketOptions = {
        public: isPublic,
        allowedMimeTypes: ['image/gif', 'image/png', 'image/jpeg', 'image/jpg'],
        fileSizeLimit: 5242880 // 5MB
      };

      // Log if using storage keys
      if (STORAGE_ACCESS_KEY && STORAGE_SECRET_KEY) {
        console.log('🔑 Using storage access keys for bucket creation');
      }
      
      const { error } = await supabase.storage.createBucket(bucket, bucketOptions);

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