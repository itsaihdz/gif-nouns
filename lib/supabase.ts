import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Updated Supabase configuration with new credentials
const supabaseUrl = 'https://zidivolizgoabfdkuybi.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Add better error handling for Supabase client creation
let supabase: SupabaseClient;
try {
  supabase = createClient(supabaseUrl, supabaseKey!, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
} catch (error) {
  console.error('Failed to create Supabase client:', error);
  // Create a fallback client with minimal config
  supabase = createClient(supabaseUrl, supabaseKey!);
}

export { supabase };

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      gallery_items: {
        Row: {
          id: string;
          gif_url: string;
          creator_fid: number;
          creator_username: string;
          creator_pfp: string;
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
          creator_fid: number;
          creator_username: string;
          creator_pfp: string;
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
          creator_fid?: number;
          creator_username?: string;
          creator_pfp?: string;
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