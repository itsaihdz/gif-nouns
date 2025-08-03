import { supabase } from './supabase';
import type { Database } from './supabase';

type GalleryItem = Database['public']['Tables']['gallery_items']['Row'];
type Vote = Database['public']['Tables']['votes']['Row'];

// Mock data for fallback when Supabase is unavailable
const mockGalleryItems: GalleryItem[] = [
  {
    id: '1',
    gif_url: 'https://example.com/demo1.gif',
    creator_fid: 12345,
    creator_username: 'demo_user',
    creator_pfp: 'https://example.com/avatar1.jpg',
    title: 'gifnouns #1',
    noggle_color: 'Red',
    eye_animation: 'Blink',
    upvotes: 5,
    downvotes: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    gif_url: 'https://example.com/demo2.gif',
    creator_fid: 67890,
    creator_username: 'demo_user2',
    creator_pfp: 'https://example.com/avatar2.jpg',
    title: 'gifnouns #2',
    noggle_color: 'Blue',
    eye_animation: 'Wink',
    upvotes: 3,
    downvotes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Helper function to check if Supabase is available
async function isSupabaseAvailable(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('gallery_items')
      .select('count')
      .limit(1);
    
    return !error;
  } catch {
    return false;
  }
}

// Gallery Items
export const galleryService = {
  // Get all gallery items with votes
  async getAllItems(): Promise<GalleryItem[]> {
    try {
      // Check if Supabase is available
      const isAvailable = await isSupabaseAvailable();
      
      if (!isAvailable) {
        console.log('Supabase unavailable, using mock data');
        return mockGalleryItems;
      }

      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gallery items:', error);
        return mockGalleryItems;
      }

      return data || mockGalleryItems;
    } catch (error) {
      console.error('Failed to fetch gallery items:', error);
      return mockGalleryItems;
    }
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
    try {
      const isAvailable = await isSupabaseAvailable();
      
      if (!isAvailable) {
        console.log('Supabase unavailable, skipping item creation');
        // Return a mock item for now
        return {
          id: Date.now().toString(),
          gif_url: item.gifUrl,
          creator_fid: item.creatorFid,
          creator_username: item.creatorUsername,
          creator_pfp: item.creatorPfp,
          title: item.title,
          noggle_color: item.noggleColor,
          eye_animation: item.eyeAnimation,
          upvotes: 0,
          downvotes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }

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
          upvotes: 0,
          downvotes: 0,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating gallery item:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to create gallery item:', error);
      throw error;
    }
  },

  // Update vote counts for a gallery item
  async updateVoteCounts(itemId: string, upvotes: number, downvotes: number): Promise<void> {
    try {
      const isAvailable = await isSupabaseAvailable();
      
      if (!isAvailable) {
        console.log('Supabase unavailable, skipping vote update');
        return;
      }

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
      const isAvailable = await isSupabaseAvailable();
      
      if (!isAvailable) {
        console.log('Supabase unavailable, returning empty votes');
        return [];
      }

      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .eq('gallery_item_id', itemId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching votes:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch votes:', error);
      return [];
    }
  },

  // Check if user has voted on an item
  async hasUserVoted(itemId: string, userFid: number): Promise<{ hasVoted: boolean; voteType?: 'upvote' | 'downvote' }> {
    try {
      const isAvailable = await isSupabaseAvailable();
      
      if (!isAvailable) {
        console.log('Supabase unavailable, assuming no vote');
        return { hasVoted: false };
      }

      const { data, error } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('gallery_item_id', itemId)
        .eq('voter_fid', userFid)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking user vote:', error);
        return { hasVoted: false };
      }

      return {
        hasVoted: !!data,
        voteType: data?.vote_type
      };
    } catch (error) {
      console.error('Failed to check user vote:', error);
      return { hasVoted: false };
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
      const isAvailable = await isSupabaseAvailable();
      
      if (!isAvailable) {
        console.log('Supabase unavailable, skipping vote addition');
        // Return a mock vote
        return {
          id: Date.now().toString(),
          gallery_item_id: vote.galleryItemId,
          voter_fid: vote.voterFid,
          voter_username: vote.voterUsername,
          voter_pfp: vote.voterPfp,
          vote_type: vote.voteType,
          created_at: new Date().toISOString()
        };
      }

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
      const isAvailable = await isSupabaseAvailable();
      
      if (!isAvailable) {
        console.log('Supabase unavailable, skipping vote removal');
        return;
      }

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
      const isAvailable = await isSupabaseAvailable();
      
      if (!isAvailable) {
        console.log('Supabase unavailable, skipping vote change');
        return;
      }

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