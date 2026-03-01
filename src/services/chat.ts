import api from './api';
import { ChatMessage, ChatThread, ApiResponse } from '../types';

export const chatService = {
    getThreads: async (): Promise<ApiResponse<ChatThread[]>> => {
        const { data } = await api.get('/chat/threads');
        return data;
    },

    getMessages: async (userId: string, page = 1): Promise<ApiResponse<ChatMessage[]>> => {
        const { data } = await api.get(`/chat/${userId}`, { params: { page } });
        return data;
    },

    sendMessage: async (receiverId: string, content: string): Promise<ApiResponse<ChatMessage>> => {
        const { data } = await api.post('/chat/send', { receiverId, content });
        return data;
    },

    markAsRead: async (userId: string): Promise<void> => {
        await api.patch(`/chat/${userId}/read`);
    },
};
