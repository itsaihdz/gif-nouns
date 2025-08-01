import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fb409a1fdce1df8d42cbcba5d172a59c.supabase.co';
const supabaseKey = 'sbp_fb409a1fdce1df8d42cbcba5d172a59cef050ecf';

export const supabase = createClient(supabaseUrl, supabaseKey);

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
          votes: number;
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
          votes?: number;
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
          votes?: number;
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
          created_at: string;
        };
        Insert: {
          id?: string;
          gallery_item_id: string;
          voter_fid: number;
          voter_username: string;
          voter_pfp: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          gallery_item_id?: string;
          voter_fid?: number;
          voter_username?: string;
          voter_pfp?: string;
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