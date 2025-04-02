import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from './LanguageSwitcher';

// Types
interface ChatMessage {
  id: number;
  roomId: number;
  senderId: number;
  content: string;
  createdAt: string;
  readBy: number[];
}

interface ChatParticipant {
  id: number;
  roomId: number;
  userId: number;
  role: string;
  joinedAt: string;
}

interface ChatRoom {
  id: number;
  bookingId: number;
  title: string;
  createdAt: string;
  lastMessageAt: string;
}

interface User {
  id: number;
  username: string;
  email: string;
}

interface ChatInterfaceProps {
  bookingId: number;
  currentUser: User;
}

// API functions
const fetchChatRooms = async (bookingId: number) => {
  const response = await fetch(`/api/chat/rooms/by-booking/${bookingId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch chat rooms');
  }
  return response.json();
};

const fetchMessages = async (roomId: number) => {
  const response = await fetch(`/api/chat/rooms/${roomId}/messages`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
};

const fetchParticipants = async (roomId: number) => {
  const response = await fetch(`/api/chat/rooms/${roomId}/participants`);
  if (!response.ok) {
    throw new Error('Failed to fetch participants');
  }
  return response.json();
};

const createChatRoom = async (data: { bookingId: number; title: string }) => {
  const response = await fetch('/api/chat/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create chat room');
  }
  return response.json();
};

const sendMessage = async (data: { roomId: number; content: string }) => {
  const response = await fetch(`/api/chat/rooms/${data.roomId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: data.content,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  return response.json();
};

const markMessagesAsRead = async (roomId: number) => {
  const response = await fetch(`/api/chat/rooms/${roomId}/read`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to mark messages as read');
  }
  return response.json();
};

export default function ChatInterface({ bookingId, currentUser }: ChatInterfaceProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const { currentLanguage } = useLanguage();
  const isRTL = currentLanguage.direction === 'rtl';

  const translations = {
    en: {
      newMessage: 'Type your message here...',
      send: 'Send',
      createChatRoom: 'Start Chat',
      chatWith: 'Chat with',
      host: 'Host',
      guest: 'Guest',
      noMessages: 'No messages yet. Start the conversation!',
      loading: 'Loading...',
      today: 'Today',
      yesterday: 'Yesterday',
    },
    ar: {
      newMessage: 'اكتب رسالتك هنا...',
      send: 'إرسال',
      createChatRoom: 'بدء محادثة',
      chatWith: 'محادثة مع',
      host: 'المضيف',
      guest: 'الضيف',
      noMessages: 'لا توجد رسائل بعد. ابدأ المحادثة!',
      loading: 'جاري التحميل...',
      today: 'اليوم',
      yesterday: 'أمس',
    },
  };

  const t = translations[currentLanguage.code as keyof typeof translations] || translations.en;

  // Fetch chat rooms for this booking
  const { 
    data: chatRooms, 
    isLoading: isLoadingRooms,
    refetch: refetchRooms
  } = useQuery({
    queryKey: ['/api/chat/rooms/by-booking', bookingId],
    queryFn: () => fetchChatRooms(bookingId),
    enabled: !!bookingId
  });

  // Fetch messages for active room
  const { 
    data: messages, 
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['/api/chat/rooms/messages', activeRoomId],
    queryFn: () => fetchMessages(activeRoomId as number),
    enabled: !!activeRoomId,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Fetch participants for active room
  const { 
    data: participants, 
    isLoading: isLoadingParticipants 
  } = useQuery({
    queryKey: ['/api/chat/rooms/participants', activeRoomId],
    queryFn: () => fetchParticipants(activeRoomId as number),
    enabled: !!activeRoomId
  });

  // Create chat room mutation
  const createRoomMutation = useMutation({
    mutationFn: createChatRoom,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms/by-booking', bookingId] });
      setActiveRoomId(data.id);
      toast({
        title: 'Chat room created',
        description: 'You can now start the conversation.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to create chat room',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms/messages', activeRoomId] });
      setMessageText('');
    },
    onError: (error) => {
      toast({
        title: 'Failed to send message',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  });

  // Mark messages as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markMessagesAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms/messages', activeRoomId] });
    }
  });

  // Set first room as active if none is selected and rooms are loaded
  useEffect(() => {
    if (!activeRoomId && chatRooms && chatRooms.length > 0) {
      setActiveRoomId(chatRooms[0].id);
    }
  }, [chatRooms, activeRoomId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Mark messages as read when viewing a room
  useEffect(() => {
    if (activeRoomId) {
      markAsReadMutation.mutate(activeRoomId);
    }
  }, [activeRoomId, messages]);

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeRoomId) return;

    sendMessageMutation.mutate({
      roomId: activeRoomId,
      content: messageText
    });
  };

  // Handle create chat room
  const handleCreateChatRoom = () => {
    createRoomMutation.mutate({
      bookingId,
      title: `Booking #${bookingId} Chat`
    });
  };

  // Format date for messages
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `${t.today}, ${format(date, 'h:mm a')}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `${t.yesterday}, ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  // Find participant role by user ID
  const getParticipantRole = (userId: number) => {
    if (!participants) return '';
    const participant = participants.find(p => p.userId === userId);
    return participant?.role || '';
  };

  // Render message bubble
  const renderMessage = (message: ChatMessage) => {
    const isSelf = message.senderId === currentUser.id;
    const role = getParticipantRole(message.senderId);
    const roleLabel = role === 'host' ? t.host : t.guest;

    return (
      <div
        key={message.id}
        className={`flex mb-4 ${isSelf ? 'justify-end' : 'justify-start'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className={`flex ${isSelf ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[80%]`}>
          <Avatar className="w-8 h-8 mr-2 ml-2">
            <AvatarFallback>{roleLabel.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              {roleLabel} • {formatMessageDate(message.createdAt)}
            </div>
            <div
              className={`rounded-lg px-4 py-2 ${
                isSelf
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              {message.content}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background border rounded-md shadow-sm">
      {/* Chat header */}
      <div className="p-4 border-b">
        {activeRoomId && chatRooms ? (
          <CardTitle>
            {t.chatWith} {chatRooms.find(room => room.id === activeRoomId)?.title || `${t.host}`}
          </CardTitle>
        ) : (
          <div className="flex justify-between items-center">
            <CardTitle>{t.chatWith} {t.host}</CardTitle>
            {!isLoadingRooms && (!chatRooms || chatRooms.length === 0) && (
              <Button 
                onClick={handleCreateChatRoom} 
                disabled={createRoomMutation.isPending}
              >
                {createRoomMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {t.createChatRoom}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">{t.loading}</span>
          </div>
        ) : !messages || messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            {t.noMessages}
          </div>
        ) : (
          <>
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </>
        )}
      </ScrollArea>

      {/* Message input */}
      {activeRoomId && (
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={t.newMessage}
              className="flex-1 resize-none min-h-[80px]"
            />
            <Button
              type="submit"
              disabled={!messageText.trim() || sendMessageMutation.isPending}
              className="self-end"
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {t.send}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}