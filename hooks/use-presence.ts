import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// For enterprise, we would use a dedicated Realtime cluster and inject these via env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

type PresenceState = {
  user: string;
  onlineAt: string;
  cursor?: { x: number; y: number };
};

export function usePresence(tenantId: string, roomId: string, currentUser: string) {
  const [activeUsers, setActiveUsers] = useState<PresenceState[]>([]);

  useEffect(() => {
    // We scope channels strictly by tenantId to prevent cross-tenant data leaks
    const channelName = `room:${tenantId}:${roomId}`;
    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: currentUser,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = Object.values(state).flat() as unknown as PresenceState[];
        setActiveUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log(`[Presence] ${key} joined`, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log(`[Presence] ${key} left`, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user: currentUser,
            onlineAt: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [tenantId, roomId, currentUser]);

  /**
   * Helper to broadcast ephemeral UI state (like cursors or typing indicators)
   */
  const broadcastCursor = async (x: number, y: number) => {
    const channelName = `room:${tenantId}:${roomId}`;
    await supabase.channel(channelName).track({
      user: currentUser,
      onlineAt: new Date().toISOString(),
      cursor: { x, y }
    });
  };

  return { activeUsers, broadcastCursor };
}
