import api from './api';
import { Booking, CreateBookingPayload, ApiResponse, PaginatedResponse } from '../types';

export const bookingService = {
    create: async (payload: CreateBookingPayload): Promise<ApiResponse<Booking>> => {
        const { data } = await api.post('/bookings', payload);
        return data;
    },

    getMyBookings: async (status?: string): Promise<PaginatedResponse<Booking>> => {
        const { data } = await api.get('/bookings/my', { params: { status } });
        return data;
    },

    getVendorBookings: async (status?: string): Promise<PaginatedResponse<Booking>> => {
        const { data } = await api.get('/bookings/vendor', { params: { status } });
        return data;
    },

    updateStatus: async (bookingId: string, status: string): Promise<ApiResponse<Booking>> => {
        const { data } = await api.patch(`/bookings/${bookingId}/status`, { status });
        return data;
    },

    getById: async (bookingId: string): Promise<ApiResponse<Booking>> => {
        const { data } = await api.get(`/bookings/${bookingId}`);
        return data;
    },
};
