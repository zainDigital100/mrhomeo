import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export function useChatHistory() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations for signed-in users
  const loadConversations = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Create a new conversation
  const createConversation = async (title: string = 'New Conversation'): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({ user_id: user.id, title })
        .select()
        .single();
      
      if (error) throw error;
      
      setConversations(prev => [data, ...prev]);
      setCurrentConversationId(data.id);
      return data.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };

  // Save a message to the current conversation
  const saveMessage = async (conversationId: string, role: 'user' | 'assistant', content: string) => {
    if (!user || !conversationId) return;
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          role,
          content
        });
      
      if (error) throw error;

      // Update conversation title if it's the first user message
      if (role === 'user') {
        const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
        await supabase
          .from('chat_conversations')
          .update({ title, updated_at: new Date().toISOString() })
          .eq('id', conversationId);
        
        setConversations(prev => 
          prev.map(c => c.id === conversationId ? { ...c, title, updated_at: new Date().toISOString() } : c)
        );
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  // Load messages for a conversation
  const loadMessages = async (conversationId: string): Promise<Message[]> => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return (data || []).map(m => ({
        id: m.id,
        role: m.role as 'user' | 'assistant',
        content: m.content,
        timestamp: new Date(m.created_at)
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
      return [];
    }
  };

  // Delete a conversation
  const deleteConversation = async (conversationId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId);
      
      if (error) throw error;
      
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  return {
    user,
    conversations,
    currentConversationId,
    setCurrentConversationId,
    isLoading,
    createConversation,
    saveMessage,
    loadMessages,
    deleteConversation,
    loadConversations
  };
}
