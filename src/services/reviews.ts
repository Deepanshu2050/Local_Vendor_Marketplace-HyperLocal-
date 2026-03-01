import api from './api';
import { Review, CreateReviewPayload, ApiResponse, PaginatedResponse } from '../types';

export const reviewService = {
    create: async (payload: CreateReviewPayload): Promise<ApiResponse<Review>> => {
        const { data } = await api.post('/reviews', payload);
        return data;
    },

    getVendorReviews: async (vendorId: string, page = 1): Promise<PaginatedResponse<Review>> => {
        const { data } = await api.get(`/reviews/vendor/${vendorId}`, { params: { page } });
        return data;
    },
};
