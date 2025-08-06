import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase environment variables not configured');
  console.warn('   Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  console.warn('   The app will use mock data until Supabase is configured');
}

// Add better error handling for Supabase client creation
let supabase: SupabaseClient;
let supabaseService: SupabaseClient;

try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    console.log('✅ Supabase client created successfully');
    
    // Create service role client for admin operations
    if (supabaseServiceKey) {
      supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      });
      console.log('✅ Supabase service role client created successfully');
    } else {
      console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not configured - some operations may fail');
    }
  } else {
    // Create a dummy client for development
    supabase = createClient('https://dummy.supabase.co', 'dummy-key');
    supabaseService = createClient('https://dummy.supabase.co', 'dummy-key');
    console.log('⚠️ Using dummy Supabase client (mock data will be used)');
  }
} catch (error) {
  console.error('Failed to create Supabase client:', error);
  // Create a fallback client with minimal config
  supabase = createClient('https://dummy.supabase.co', 'dummy-key');
  supabaseService = createClient('https://dummy.supabase.co', 'dummy-key');
}

export { supabase, supabaseService };

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      gallery_items: {
        Row: {
          id: string;
          gif_url: string;
          creator_wallet: string;
          creator_fid: number | null;
          creator_username: string | null;
          creator_pfp: string | null;
          title: string;
          noggle_color: string;
          eye_animation: string;
          upvotes: number;
          downvotes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gif_url: string;
          creator_wallet: string;
          creator_fid?: number | null;
          creator_username?: string | null;
          creator_pfp?: string | null;
          title: string;
          noggle_color: string;
          eye_animation: string;
          upvotes?: number;
          downvotes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gif_url?: string;
          creator_wallet?: string;
          creator_fid?: number | null;
          creator_username?: string | null;
          creator_pfp?: string | null;
          title?: string;
          noggle_color?: string;
          eye_animation?: string;
          upvotes?: number;
          downvotes?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          gallery_item_id: string;
          voter_fid: number;
          voter_username: string;
          voter_pfp: string;
          vote_type: 'upvote' | 'downvote';
          created_at: string;
        };
        Insert: {
          id?: string;
          gallery_item_id: string;
          voter_fid: number;
          voter_username: string;
          voter_pfp: string;
          vote_type: 'upvote' | 'downvote';
          created_at?: string;
        };
        Update: {
          id?: string;
          gallery_item_id?: string;
          voter_fid?: number;
          voter_username?: string;
          voter_pfp?: string;
          vote_type?: 'upvote' | 'downvote';
          created_at?: string;
        };
      };
      users: {
        Row: {
          fid: number;
          username: string;
          display_name: string;
          pfp: string;
          follower_count: number;
          following_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          fid: number;
          username: string;
          display_name: string;
          pfp: string;
          follower_count?: number;
          following_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          fid?: number;
          username?: string;
          display_name?: string;
          pfp?: string;
          follower_count?: number;
          following_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 