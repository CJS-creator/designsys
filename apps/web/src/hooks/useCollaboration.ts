import { useState, useEffect, useCallback, useRef } from 'react';

// Types for collaboration features
export interface PresenceUser {
  id: string;
  name: string;
  avatar?: string;
  color: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  cursor?: { x: number; y: number };
  lastActive: Date;
}

export interface CollaborationActivity {
  id: string;
  userId: string;
  userName: string;
  action: 'edit' | 'view' | 'comment' | 'share' | 'export';
  target: string;
  timestamp: Date;
}

export interface CollaborationConfig {
  userId: string;
  userName: string;
  userColor: string;
  roomId: string;
  enableCursorTracking?: boolean;
  enablePresence?: boolean;
  enableActivityFeed?: boolean;
}

// Status colors mapping (exported for use in components)
export const statusColors: Record<PresenceUser['status'], string> = {
  online: '#22c55e',
  away: '#eab308',
  busy: '#ef4444',
  offline: '#9ca3af',
};

// Hook for managing real-time presence
export function usePresence(config: CollaborationConfig) {
  const { userId, userName, userColor, roomId, enablePresence = true } = config;
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate presence connection (replace with real WebSocket/Socket.io)
  useEffect(() => {
    if (!enablePresence) return;

    setIsConnected(true);

    // Mock initial users
    const mockUsers: PresenceUser[] = [
      {
        id: userId,
        name: userName,
        color: userColor,
        status: 'online',
        lastActive: new Date(),
      },
      {
        id: 'user-2',
        name: 'Sarah Designer',
        color: '#3b82f6',
        status: 'online',
        lastActive: new Date(),
      },
      {
        id: 'user-3',
        name: 'Mike Developer',
        color: '#10b981',
        status: 'away',
        lastActive: new Date(Date.now() - 3600000),
      },
    ];

    setUsers(mockUsers);

    // Cleanup
    return () => {
      setIsConnected(false);
      setUsers([]);
    };
  }, [userId, userName, userColor, roomId, enablePresence]);

  // Update user status
  const updateStatus = useCallback((status: PresenceUser['status']) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, status, lastActive: new Date() } : user
      )
    );
  }, [userId]);

  // Update cursor position
  const updateCursor = useCallback((x: number, y: number) => {
    if (!enablePresence) return;
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, cursor: { x, y }, lastActive: new Date() } : user
      )
    );
  }, [userId, enablePresence]);

  // Leave room
  const leave = useCallback(() => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    setIsConnected(false);
  }, [userId]);

  return {
    users,
    isConnected,
    currentUser: users.find(u => u.id === userId),
    updateStatus,
    updateCursor,
    leave,
  };
}

// Hook for tracking cursor positions
export function useCursorTracking(enabled: boolean = true) {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsTracking(false);
      return;
    }

    setIsTracking(true);

    const handleMouseMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      setIsTracking(false);
    };
  }, [enabled]);

  return { cursor, isTracking };
}

// Hook for activity feed
export function useActivityFeed(config: { userId: string; enableActivityFeed?: boolean }) {
  const { userId, enableActivityFeed = true } = config;
  const [activities, setActivities] = useState<CollaborationActivity[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  // Simulate activity recording
  useEffect(() => {
    if (!enableActivityFeed) return;

    setIsRecording(true);

    // Mock initial activities
    const mockActivities: CollaborationActivity[] = [
      {
        id: 'act-1',
        userId: 'user-2',
        userName: 'Sarah Designer',
        action: 'edit',
        target: 'Button Component',
        timestamp: new Date(Date.now() - 300000),
      },
      {
        id: 'act-2',
        userId: 'user-3',
        userName: 'Mike Developer',
        action: 'comment',
        target: 'Color Palette',
        timestamp: new Date(Date.now() - 600000),
      },
      {
        id: 'act-3',
        userId: userId,
        userName: 'You',
        action: 'view',
        target: 'Typography Scale',
        timestamp: new Date(Date.now() - 900000),
      },
    ];

    setActivities(mockActivities);

    return () => {
      setIsRecording(false);
      setActivities([]);
    };
  }, [userId, enableActivityFeed]);

  // Add new activity
  const addActivity = useCallback((
    action: CollaborationActivity['action'],
    target: string
  ) => {
    const newActivity: CollaborationActivity = {
      id: `act-${Date.now()}`,
      userId,
      userName: 'You',
      action,
      target,
      timestamp: new Date(),
    };
    setActivities(prev => [newActivity, ...prev]);
  }, [userId]);

  // Clear activity feed
  const clear = useCallback(() => {
    setActivities([]);
  }, []);

  return {
    activities,
    isRecording,
    addActivity,
    clear,
  };
}

// Hook for typing indicators
export function useTypingIndicator(userId: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTyping = useCallback(() => {
    setIsTyping(true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setTypingUsers(prev => prev.filter(id => id !== userId));
    }, 3000);
  }, [userId]);

  const stopTyping = useCallback(() => {
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, []);

  // Simulate other users typing
  useEffect(() => {
    // Mock: occasionally add a typing user
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        const randomUser = ['user-2', 'user-3'].find(id => id !== userId);
        if (randomUser && !typingUsers.includes(randomUser)) {
          setTypingUsers(prev => [...prev, randomUser]);
          setTimeout(() => {
            setTypingUsers(prev => prev.filter(id => id !== randomUser));
          }, 2000);
        }
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [userId, typingUsers]);

  return {
    typingUsers,
    isTyping,
    startTyping,
    stopTyping,
  };
}

// Hook for collaboration messaging
export function useCollaborationMessaging(userId: string) {
  const [messages, setMessages] = useState<Array<{
    id: string;
    userId: string;
    userName: string;
    content: string;
    timestamp: Date;
  }>>([]);
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useCallback((content: string) => {
    setIsSending(true);

    const newMessage = {
      id: `msg-${Date.now()}`,
      userId,
      userName: 'You',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate network delay
    setTimeout(() => {
      setIsSending(false);
    }, 500);
  }, [userId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isSending,
    sendMessage,
    clearMessages,
  };
}

// Main collaboration hook that combines all features
export function useCollaboration(config: CollaborationConfig) {
  const {
    userId,
    userName,
    userColor,
    roomId,
    enableCursorTracking = true,
    enablePresence = true,
    enableActivityFeed = true,
  } = config;

  const presence = usePresence({ userId, userName, userColor, roomId, enablePresence });
  const cursor = useCursorTracking(enableCursorTracking);
  const activityFeed = useActivityFeed({ userId, enableActivityFeed });
  const typing = useTypingIndicator(userId);
  const messaging = useCollaborationMessaging(userId);

  return {
    presence,
    cursor,
    activityFeed,
    typing,
    messaging,
  };
}

// Utility function to format activity timestamp
export function formatActivityTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Utility function to get status indicator size
export function getStatusSize(size: 'sm' | 'md' | 'lg'): { width: number; height: number } {
  const sizes = {
    sm: { width: 8, height: 8 },
    md: { width: 12, height: 12 },
    lg: { width: 16, height: 16 },
  };
  return sizes[size];
}

// Utility function to calculate cursor offset for overlapping avatars
export function getAvatarOverlap(index: number, overlapPx: number = -8): number {
  return index * overlapPx;
}
