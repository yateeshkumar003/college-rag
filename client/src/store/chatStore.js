import { create } from 'zustand';
import api from '../services/api';

export const useChatStore = create((set, get) => ({
  conversations: [],
  currentConversationId: null,
  messages: [],
  loading: false,
  fetchingConvs: false,
  error: null,

  fetchConversations: async () => {
    set({ fetchingConvs: true, error: null });
    try {
      const res = await api.get('/chat/conversations');
      set({ conversations: res.data.data });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch conversations' });
    } finally {
      set({ fetchingConvs: false });
    }
  },

  fetchMessages: async (conversationId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/chat/conversations/${conversationId}`);
      set({ 
        messages: res.data.data,
        currentConversationId: conversationId
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch messages' });
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (content) => {
    const { currentConversationId, messages } = get();
    set({ loading: true, error: null });

    // Optimistically add user message to layout
    const tempUserMessage = {
      _id: 'temp-' + Date.now(),
      role: 'user',
      content,
      createdAt: new Date().toISOString()
    };
    set({ messages: [...messages, tempUserMessage] });

    try {
      const res = await api.post('/chat', {
        message: content,
        conversationId: currentConversationId || undefined
      });

      const { conversationId: responseConvId, answer, grounded, sources } = res.data;

      const assistantMessage = {
        _id: res.data.messageId || 'reply-' + Date.now(),
        role: 'assistant',
        content: answer,
        grounded,
        sources,
        createdAt: new Date().toISOString()
      };

      // Replace optimistic message and append assistant message
      const updatedMessages = get().messages.filter(m => m._id !== tempUserMessage._id);
      set({ 
        messages: [...updatedMessages, tempUserMessage, assistantMessage],
        currentConversationId: responseConvId
      });

      // Refresh conversations list to update titles/timestamps
      await get().fetchConversations();
      return responseConvId;
    } catch (err) {
      set({ 
        error: err.response?.data?.message || 'Failed to send message',
        // Rollback optimistic message on failure
        messages: get().messages.filter(m => m._id !== tempUserMessage._id)
      });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  deleteConversation: async (conversationId) => {
    set({ error: null });
    try {
      await api.delete(`/chat/conversations/${conversationId}`);
      
      const { currentConversationId } = get();
      set({
        conversations: get().conversations.filter(c => c._id !== conversationId)
      });

      // If active conversation was deleted, reset chat window
      if (currentConversationId === conversationId) {
        set({
          currentConversationId: null,
          messages: []
        });
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to delete conversation' });
    }
  },

  resetChat: () => {
    set({
      currentConversationId: null,
      messages: [],
      error: null
    });
  }
}));
