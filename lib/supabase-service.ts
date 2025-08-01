import { supabase } from './supabase';
import type { Database } from './supabase';

type GalleryItem = Database['public']['Tables']['gallery_items']['Row'];
type Vote = Database['public']['Tables']['votes']['Row'];
type User = Database['public']['Tables']['users']['Row'];

// Gallery Items
export const galleryService = {
  // Get all gallery items with votes
  async getAllItems(): Promise<GalleryItem[]> {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery items:', error);
      throw error;
    }

    return data || [];
  },

  // Create a new gallery item
  async createItem(item: {
    gifUrl: string;
    creatorFid: number;
    creatorUsername: string;
    creatorPfp: string;
    title: string;
    noggleColor: string;
    eyeAnimation: string;
  }): Promise<GalleryItem> {
    const { data, error } = await supabase
      .from('gallery_items')
      .insert({
        gif_url: item.gifUrl,
        creator_fid: item.creatorFid,
        creator_username: item.creatorUsername,
        creator_pfp: item.creatorPfp,
        title: item.title,
        noggle_color: item.noggleColor,
        eye_animation: item.eyeAnimation,
        votes: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating gallery item:', error);
      throw error;
    }

    return data;
  },

  // Update vote count for a gallery item
  async updateVoteCount(itemId: string, voteCount: number): Promise<void> {
    const { error } = await supabase
      .from('gallery_items')
      .update({ votes: voteCount })
      .eq('id', itemId);

    if (error) {
      console.error('Error updating vote count:', error);
      throw error;
    }
  },
};

// Votes
export const voteService = {
  // Get votes for a specific gallery item
  async getVotesForItem(itemId: string): Promise<Vote[]> {
    const { data, error } = await supabase
      .from('votes')
      .select('*')
      .eq('gallery_item_id', itemId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching votes:', error);
      throw error;
    }

    return data || [];
  },

  // Check if user has voted for an item
  async hasUserVoted(itemId: string, userFid: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('votes')
      .select('id')
      .eq('gallery_item_id', itemId)
      .eq('voter_fid', userFid)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking user vote:', error);
      throw error;
    }

    return !!data;
  },

  // Add a vote
  async addVote(vote: {
    galleryItemId: string;
    voterFid: number;
    voterUsername: string;
    voterPfp: string;
  }): Promise<Vote> {
    const { data, error } = await supabase
      .from('votes')
      .insert({
        gallery_item_id: vote.galleryItemId,
        voter_fid: vote.voterFid,
        voter_username: vote.voterUsername,
        voter_pfp: vote.voterPfp,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding vote:', error);
      throw error;
    }

    return data;
  },

  // Remove a vote
  async removeVote(itemId: string, userFid: number): Promise<void> {
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('gallery_item_id', itemId)
      .eq('voter_fid', userFid);

    if (error) {
      console.error('Error removing vote:', error);
      throw error;
    }
  },
};

// Users
export const userService = {
  async upsertUser(userData: {
    fid: number;
    username: string;
    displayName: string;
    pfp: string;
    followerCount?: number;
    followingCount?: number;
  }) {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        fid: userData.fid,
        username: userData.username,
        display_name: userData.displayName,
        pfp: userData.pfp,
        follower_count: userData.followerCount || 0,
        following_count: userData.followingCount || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserByFid(fid: number) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('fid', fid)
      .single();

    if (error) throw error;
    return data;
  },
};

export const realtimeService = {
  subscribeToGallery(callback: (payload: any) => void) {
    return supabase
      .channel('gallery_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_items' }, callback)
      .subscribe();
  },

  subscribeToVotes(callback: (payload: any) => void) {
    return supabase
      .channel('vote_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, callback)
      .subscribe();
  },
}; 