import api from './api';
import { VendorProfile, VendorSearchParams, ApiResponse, PaginatedResponse, Service } from '../types';

export const vendorService = {
    getNearby: async (params: VendorSearchParams): Promise<PaginatedResponse<VendorProfile>> => {
        const { data } = await api.get('/vendors/nearby', { params });
        return data;
    },

    getById: async (id: string): Promise<ApiResponse<VendorProfile>> => {
        const { data } = await api.get(`/vendors/${id}`);
        return data;
    },

    getServices: async (vendorId: string): Promise<ApiResponse<Service[]>> => {
        const { data } = await api.get(`/vendors/${vendorId}/services`);
        return data;
    },

    // Vendor-side endpoints
    updateProfile: async (updates: Partial<VendorProfile>) => {
        const { data } = await api.put('/vendors/profile', updates);
        return data;
    },

    createService: async (service: Omit<Service, '_id' | 'vendorId' | 'createdAt'>) => {
        const { data } = await api.post('/vendors/services', service);
        return data;
    },

    updateService: async (serviceId: string, updates: Partial<Service>) => {
        const { data } = await api.put(`/vendors/services/${serviceId}`, updates);
        return data;
    },

    deleteService: async (serviceId: string) => {
        const { data } = await api.delete(`/vendors/services/${serviceId}`);
        return data;
    },
};
