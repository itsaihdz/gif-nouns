"use client";

import { useState, useEffect } from 'react';

interface UserVote {
  itemId: string;
  voteType: 'upvote' | 'downvote';
}

export function useUserVotes() {
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);

  // Load user votes from localStorage on mount
  useEffect(() => {
    const storedVotes = localStorage.getItem('gifnouns_user_votes');
    if (storedVotes) {
      try {
        setUserVotes(JSON.parse(storedVotes));
      } catch (error) {
        console.error('Failed to parse stored votes:', error);
        setUserVotes([]);
      }
    }
  }, []);

  // Save votes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gifnouns_user_votes', JSON.stringify(userVotes));
  }, [userVotes]);

  const addVote = (itemId: string, voteType: 'upvote' | 'downvote') => {
    setUserVotes(prev => {
      // Remove any existing vote for this item
      const filtered = prev.filter(vote => vote.itemId !== itemId);
      // Add the new vote
      return [...filtered, { itemId, voteType }];
    });
  };

  const removeVote = (itemId: string) => {
    setUserVotes(prev => prev.filter(vote => vote.itemId !== itemId));
  };

  const getUserVote = (itemId: string): 'upvote' | 'downvote' | null => {
    const vote = userVotes.find(vote => vote.itemId === itemId);
    return vote?.voteType || null;
  };

  return {
    addVote,
    removeVote,
    getUserVote,
  };
}
