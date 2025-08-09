"use client";

import { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Icon } from '../icons';
import { useUser } from '../../contexts/UserContext';

interface LeaderboardEntry {
  fid: number;
  username: string;
  pfp: string;
  score: number;
  rank: number;
  isFriend: boolean;
  isCurrentUser: boolean;
}

interface FriendLeaderboardProps {
  className?: string;
}

export function FriendLeaderboard({ className = "" }: FriendLeaderboardProps) {
  const { user } = useUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'allTime'>('weekly');

  useEffect(() => {
    if (user) {
      fetchFriendLeaderboard();
    }
  }, [user, timeframe]);

  const fetchFriendLeaderboard = async () => {
    try {
      setIsLoading(true);
      
      // Fetch leaderboard data from API
      const response = await fetch(`/api/leaderboard/friends?timeframe=${timeframe}&fid=${user?.fid}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      } else {
        // Fallback mock data for demo
        setLeaderboard([
          {
            fid: user?.fid || 0,
            username: user?.username || 'you.noun',
            pfp: user?.pfp || '/icon.png',
            score: 156,
            rank: 1,
            isFriend: false,
            isCurrentUser: true
          },
          {
            fid: 23456,
            username: 'alice.noun',
            pfp: '',
            score: 142,
            rank: 2,
            isFriend: true,
            isCurrentUser: false
          },
          {
            fid: 34567,
            username: 'bob.noun',
            pfp: '',
            score: 128,
            rank: 3,
            isFriend: true,
            isCurrentUser: false
          },
          {
            fid: 45678,
            username: 'charlie.noun',
            pfp: '',
            score: 115,
            rank: 4,
            isFriend: false,
            isCurrentUser: false
          },
          {
            fid: 56789,
            username: 'diana.noun',
            pfp: '',
            score: 98,
            rank: 5,
            isFriend: true,
            isCurrentUser: false
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching friend leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const challengeFriend = async (friendFid: number, friendUsername: string) => {
    try {
      // Send challenge notification
      const response = await fetch('/api/notifications/challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetFid: friendFid,
          challengerFid: user?.fid,
          challengerUsername: user?.username,
          challengeType: 'Create the most voted animated Noun'
        }),
      });

      if (response.ok) {
        // Show success message
        console.log(`Challenge sent to @${friendUsername}!`);
      }
    } catch (error) {
      console.error('Error sending challenge:', error);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getScoreColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-600';
      case 2: return 'text-gray-600';
      case 3: return 'text-amber-600';
      default: return 'text-gray-500';
    }
  };

  if (!user) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center text-gray-500">
          Connect your Farcaster account to see your friend leaderboard
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Friend Leaderboard
        </h3>
        <div className="flex gap-2">
          <Button
            variant={timeframe === 'daily' ? 'gradient' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('daily')}
          >
            Daily
          </Button>
          <Button
            variant={timeframe === 'weekly' ? 'gradient' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('weekly')}
          >
            Weekly
          </Button>
          <Button
            variant={timeframe === 'allTime' ? 'gradient' : 'outline'}
            size="sm"
            onClick={() => setTimeframe('allTime')}
          >
            All Time
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {leaderboard.map((entry) => (
            <div
              key={entry.fid}
              className={`flex items-center space-x-4 p-3 rounded-lg transition-colors ${
                entry.isCurrentUser
                  ? 'bg-purple-50 border border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="text-2xl font-bold text-gray-400">
                  {getRankIcon(entry.rank)}
                </div>
                <img
                  src={entry.pfp}
                  alt={entry.username}
                  className="w-10 h-10 rounded-full border-2 border-gray-200"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      @{entry.username}
                    </span>
                    {entry.isCurrentUser && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                    {entry.isFriend && !entry.isCurrentUser && (
                      <Icon name="users" size="sm" className="text-blue-500" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {entry.score} total votes
                  </div>
                </div>
              </div>

              <div className={`text-lg font-bold ${getScoreColor(entry.rank)}`}>
                {entry.score}
              </div>

              {entry.isFriend && !entry.isCurrentUser && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => challengeFriend(entry.fid, entry.username)}
                  icon={<Icon name="zap" size="sm" />}
                >
                  Challenge
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 text-center">
          {leaderboard.filter(e => e.isFriend).length} of your friends are playing
        </div>
      </div>
    </Card>
  );
} 