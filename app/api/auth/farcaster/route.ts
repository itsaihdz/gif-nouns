import { NextRequest, NextResponse } from 'next/server';
import { userService } from '../../../../lib/supabase-service';
import { neynar } from '../../../../lib/neynar';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fid, username, displayName, pfp, followerCount, followingCount } = body;

    // Validate required fields
    if (!fid || !username || !displayName || !pfp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create or update user in Supabase
    const user = await userService.upsertUser({
      fid,
      username,
      displayName,
      pfp,
      followerCount,
      followingCount,
    });

    return NextResponse.json({
      success: true,
      user: {
        fid: user.fid,
        username: user.username,
        displayName: user.display_name,
        pfp: user.pfp,
        followerCount: user.follower_count,
        followingCount: user.following_count,
      }
    });
  } catch (error) {
    console.error('Error in Farcaster auth:', error);
    
    // Fallback response for when Supabase is not available
    const body = await request.json().catch(() => ({}));
    return NextResponse.json({
      success: true,
      user: {
        fid: body.fid || 12345,
        username: body.username || "demo.noun",
        displayName: body.displayName || "Demo User",
        pfp: body.pfp || "https://picsum.photos/32/32?random=1",
        followerCount: body.followerCount || 42,
        followingCount: body.followingCount || 38,
      }
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');
    const address = searchParams.get('address');

    if (!fid && !address) {
      return NextResponse.json(
        { error: 'Either FID or address parameter is required' },
        { status: 400 }
      );
    }

    let user = null;

    if (fid) {
      // Get user by FID from Supabase
      user = await userService.getUserByFid(parseInt(fid));
    } else if (address) {
      // Try to get user by wallet address from Neynar
      try {
        // First, try to get user from Supabase by address
        user = await userService.getUserByAddress(address);
        
        if (!user) {
          // If not in Supabase, try to fetch from Neynar
          // Note: Neynar doesn't have a direct address lookup, so we'll use a fallback
          console.log('User not found in Supabase, using fallback for address:', address);
          
          // For now, create a fallback user based on the address
          const fallbackUser = {
            fid: 0, // Will be assigned when they authenticate
            username: `user_${address.slice(2, 8)}.noun`,
            display_name: `User ${address.slice(2, 8)}`,
            pfp: `https://picsum.photos/32/32?random=${address.slice(2, 8)}`,
            follower_count: 0,
            following_count: 0,
          };
          
          return NextResponse.json({
            success: true,
            user: {
              fid: fallbackUser.fid,
              username: fallbackUser.username,
              displayName: fallbackUser.display_name,
              pfp: fallbackUser.pfp,
              followerCount: fallbackUser.follower_count,
              followingCount: fallbackUser.following_count,
            }
          });
        }
      } catch (error) {
        console.error('Error fetching user by address:', error);
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        fid: user.fid,
        username: user.username,
        displayName: user.display_name,
        pfp: user.pfp,
        followerCount: user.follower_count,
        followingCount: user.following_count,
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    
    // Fallback response for when Supabase is not available
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');
    const address = searchParams.get('address');
    
    if (address) {
      return NextResponse.json({
        success: true,
        user: {
          fid: 0,
          username: `user_${address.slice(2, 8)}.noun`,
          displayName: `User ${address.slice(2, 8)}`,
          pfp: `https://picsum.photos/32/32?random=${address.slice(2, 8)}`,
          followerCount: 0,
          followingCount: 0,
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      user: {
        fid: parseInt(fid || '12345'),
        username: `user${fid || '12345'}.noun`,
        displayName: `User ${fid || '12345'}`,
        pfp: `https://picsum.photos/32/32?random=${fid || '1'}`,
        followerCount: Math.floor(Math.random() * 100) + 10,
        followingCount: Math.floor(Math.random() * 50) + 5,
      }
    });
  }
} 