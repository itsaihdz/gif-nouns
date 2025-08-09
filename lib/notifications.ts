import { supabase } from './supabase';

export interface NotificationData {
  fid: number;
  title: string;
  body: string;
  url?: string;
  imageUrl?: string;
}

export const notificationService = {
  // Send notification to a specific user
  async sendNotification(notification: NotificationData) {
    try {
      // In a real implementation, you'd use Neynar's notification API
      // For now, we'll store notifications in Supabase for tracking
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          fid: notification.fid,
          title: notification.title,
          body: notification.body,
          url: notification.url,
          image_url: notification.imageUrl,
          sent_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error sending notification:', error);
        throw error;
      }

      // TODO: Integrate with Neynar notification API
      console.log('Notification sent:', notification);
      return data;
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  },

  // Send social FOMO notifications
  async sendSocialFOMO(fid: number, friendsWhoPlayed: string[]) {
    const notification: NotificationData = {
      fid,
      title: 'Your friends are creating without you! 🎨',
      body: `${friendsWhoPlayed.slice(0, 3).join(', ')} and ${friendsWhoPlayed.length - 3} others just created animated Nouns. Don't miss out!`,
      url: 'https://gif-nouns.vercel.app',
      imageUrl: '/hero.png'
    };

    return this.sendNotification(notification);
  },

  // Send achievement notifications
  async sendAchievementNotification(fid: number, achievement: string, score?: number) {
    const notification: NotificationData = {
      fid,
      title: 'Achievement Unlocked! 🏆',
      body: `You just ${achievement}${score ? ` with ${score} votes!` : '!'} Share your creation to earn rewards.`,
      url: 'https://gif-nouns.vercel.app/gallery',
      imageUrl: '/hero.png'
    };

    return this.sendNotification(notification);
  },

  // Send challenge notifications
  async sendChallengeNotification(fid: number, challengerUsername: string, challengeType: string) {
    const notification: NotificationData = {
      fid,
      title: 'You\'ve been challenged! ⚡',
      body: `@${challengerUsername} just challenged you to ${challengeType}. Accept the challenge now!`,
      url: 'https://gif-nouns.vercel.app',
      imageUrl: '/hero.png'
    };

    return this.sendNotification(notification);
  },

  // Send time-sensitive opportunity notifications
  async sendTimeSensitiveNotification(fid: number, opportunity: string, timeLeft: string) {
    const notification: NotificationData = {
      fid,
      title: 'Limited Time Opportunity! ⏰',
      body: `${opportunity} ends in ${timeLeft}. Don't miss out on exclusive rewards!`,
      url: 'https://gif-nouns.vercel.app',
      imageUrl: '/hero.png'
    };

    return this.sendNotification(notification);
  },

  // Send friend joined notifications
  async sendFriendJoinedNotification(fid: number, friendUsername: string) {
    const notification: NotificationData = {
      fid,
      title: 'Your friend joined! 👋',
      body: `@${friendUsername} just joined GifNouns. Welcome them and show off your creations!`,
      url: 'https://gif-nouns.vercel.app',
      imageUrl: '/hero.png'
    };

    return this.sendNotification(notification);
  },

  // Send leaderboard position change notifications
  async sendLeaderboardNotification(fid: number, oldPosition: number, newPosition: number, friendUsername?: string) {
    let title = 'Leaderboard Update! 📊';
    let body = '';

    if (friendUsername) {
      if (newPosition < oldPosition) {
        title = 'You lost your spot! 😱';
        body = `@${friendUsername} just passed you on the leaderboard. Time to create something amazing!`;
      } else {
        title = 'You\'re catching up! 🚀';
        body = `You just passed @${friendUsername} on the leaderboard. Keep it up!`;
      }
    } else {
      body = `Your position changed from #${oldPosition} to #${newPosition}. ${newPosition < oldPosition ? 'Great job!' : 'Keep creating!'}`;
    }

    const notification: NotificationData = {
      fid,
      title,
      body,
      url: 'https://gif-nouns.vercel.app/gallery',
      imageUrl: '/hero.png'
    };

    return this.sendNotification(notification);
  },

  // Send daily challenge notifications
  async sendDailyChallengeNotification(fid: number, challenge: string, timeLeft: string) {
    const notification: NotificationData = {
      fid,
      title: 'Daily Challenge Available! 🎯',
      body: `Today's challenge: ${challenge}. Only ${timeLeft} left to complete it!`,
      url: 'https://gif-nouns.vercel.app',
      imageUrl: '/hero.png'
    };

    return this.sendNotification(notification);
  },

  // Send reward claim notifications
  async sendRewardNotification(fid: number, reward: string, action: string) {
    const notification: NotificationData = {
      fid,
      title: 'Reward Available! 🎁',
      body: `You earned ${reward} for ${action}. Claim it now before it expires!`,
      url: 'https://gif-nouns.vercel.app/rewards',
      imageUrl: '/hero.png'
    };

    return this.sendNotification(notification);
  }
}; 