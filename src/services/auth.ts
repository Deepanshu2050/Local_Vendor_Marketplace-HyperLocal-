import api from './api';
import { AuthResponse, LoginPayload, RegisterPayload } from '../types';

export const authService = {
    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/login', payload);
        return data;
    },

    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        const { data } = await api.post<AuthResponse>('/auth/register', payload);
        return data;
    },

    getProfile: async () => {
        const { data } = await api.get('/auth/profile');
        return data;
    },

    updateProfile: async (updates: Record<string, unknown>) => {
        const { data } = await api.put('/auth/profile', updates);
        return data;
    },
};
