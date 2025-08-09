import { supabase } from './supabase';
import type { Database } from './supabase';

type GalleryItem = Database['public']['Tables']['gallery_items']['Row'];
type Vote = Database['public']['Tables']['votes']['Row'];

// Gallery Items
export const galleryService = {
  // Get all gallery items with votes
  async getAllItems(): Promise<GalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .not('gif_url', 'like', '/api/generate-gif?demo=%') // Filter out demo URLs
        .not('gif_url', 'like', 'https://ipfs.io/ipfs/test%') // Filter out test IPFS URLs
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gallery items:', error);
        throw error;
      }

      console.log('✅ Fetched gallery items:', data?.length || 0, 'items');
      return data || [];
    } catch (error) {
      console.error('Failed to fetch gallery items:', error);
      throw error;
    }
  },

  // Create a new gallery item
  async createItem(item: {
    gifUrl: string;
    creatorWallet: string; // Only store wallet address
    title: string;
    noggleColor: string;
    eyeAnimation: string;
  }): Promise<GalleryItem> {
    try {
      // First try with the new schema (creator_wallet column)
      try {
        const { data, error } = await supabase
          .from('gallery_items')
          .insert({
            gif_url: item.gifUrl,
            creator_wallet: item.creatorWallet, // Store wallet address only
            creator_fid: null, // Will be fetched from Neynar
            creator_username: null, // Will be fetched from Neynar
            creator_pfp: null, // Will be fetched from Neynar
            title: item.title,
            noggle_color: item.noggleColor,
            eye_animation: item.eyeAnimation,
            upvotes: 0,
            downvotes: 0,
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        return data;
      } catch (schemaError: any) {
        // If creator_wallet column doesn't exist, fall back to old schema
        if (schemaError.message && schemaError.message.includes('creator_wallet')) {
          console.log('⚠️ creator_wallet column not found, using fallback schema');
          
          const { data, error } = await supabase
            .from('gallery_items')
            .insert({
              gif_url: item.gifUrl,
              creator_fid: 0, // Fallback
              creator_username: item.creatorWallet, // Store wallet as username temporarily
              creator_pfp: '',
              title: item.title,
              noggle_color: item.noggleColor,
              eye_animation: item.eyeAnimation,
              upvotes: 0,
              downvotes: 0,
            })
            .select()
            .single();

          if (error) {
            console.error('Error creating gallery item with fallback schema:', error);
            throw error;
          }

          return data;
        } else {
          throw schemaError;
        }
      }
    } catch (error) {
      console.error('Failed to create gallery item:', error);
      throw error;
    }
  },

  // Update vote counts for a gallery item
  async updateVoteCounts(itemId: string, upvotes: number, downvotes: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('gallery_items')
        .update({ upvotes, downvotes })
        .eq('id', itemId);

      if (error) {
        console.error('Error updating vote counts:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to update vote counts:', error);
      throw error;
    }
  },
};

// Votes
export const voteService = {
  // Get votes for a specific gallery item
  async getVotesForItem(itemId: string): Promise<Vote[]> {
    try {
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
    } catch (error) {
      console.error('Failed to fetch votes:', error);
      throw error;
    }
  },

  // Check if user has voted on an item
  async hasUserVoted(itemId: string, userFid: number): Promise<{ hasVoted: boolean; voteType?: 'upvote' | 'downvote' }> {
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('gallery_item_id', itemId)
        .eq('voter_fid', userFid)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking user vote:', error);
        throw error;
      }

      return {
        hasVoted: !!data,
        voteType: data?.vote_type
      };
    } catch (error) {
      console.error('Failed to check user vote:', error);
      throw error;
    }
  },

  // Add a vote (upvote or downvote)
  async addVote(vote: {
    galleryItemId: string;
    voterFid: number;
    voterUsername: string;
    voterPfp: string;
    voteType: 'upvote' | 'downvote';
  }): Promise<Vote> {
    try {
      const { data, error } = await supabase
        .from('votes')
        .upsert({
          gallery_item_id: vote.galleryItemId,
          voter_fid: vote.voterFid,
          voter_username: vote.voterUsername,
          voter_pfp: vote.voterPfp,
          vote_type: vote.voteType,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding vote:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to add vote:', error);
      throw error;
    }
  },

  // Remove a vote
  async removeVote(itemId: string, userFid: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('votes')
        .delete()
        .eq('gallery_item_id', itemId)
        .eq('voter_fid', userFid);

      if (error) {
        console.error('Error removing vote:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to remove vote:', error);
      throw error;
    }
  },

  // Change vote type (upvote to downvote or vice versa)
  async changeVote(itemId: string, userFid: number, newVoteType: 'upvote' | 'downvote'): Promise<void> {
    try {
      const { error } = await supabase
        .from('votes')
        .update({ vote_type: newVoteType })
        .eq('gallery_item_id', itemId)
        .eq('voter_fid', userFid);

      if (error) {
        console.error('Error changing vote:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to change vote:', error);
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

  // Get user by FID
  async getUserByFid(fid: number) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('fid', fid)
      .single();

    if (error) {
      console.error('Error fetching user by FID:', error);
      throw error;
    }

    return data;
  },

  // Get user by wallet address (if we had a verified_addresses column)
  async getUserByAddress(address: string) {
    // For now, we don't have a verified_addresses column in our users table
    // This would require extending the schema to include verified addresses
    // For now, return null to indicate user not found
    console.log('getUserByAddress not implemented - would need schema extension');
    return null;
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