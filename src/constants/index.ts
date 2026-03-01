import { Category } from '../types';

export const API_BASE_URL = __DEV__
    ? 'http://192.168.101.2:5000/api'
    : 'https://your-production-api.com/api';

export const SOCKET_URL = __DEV__
    ? 'http://192.168.101.2:5000'
    : 'https://your-production-api.com';

export const DEFAULT_RADIUS_KM = 10;
export const MAX_RADIUS_KM = 50;
export const ITEMS_PER_PAGE = 20;

export const BOOKING_STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

export const BOOKING_STATUS_COLORS: Record<string, string> = {
    pending: '#FF9800',
    confirmed: '#2196F3',
    in_progress: '#6750A4',
    completed: '#4CAF50',
    cancelled: '#F44336',
};

export const DEFAULT_CATEGORIES: Category[] = [
    { _id: '1', name: 'Plumber', icon: 'water-pump', color: '#2196F3', description: 'Plumbing & pipe services' },
    { _id: '2', name: 'Electrician', icon: 'lightning-bolt', color: '#FF9800', description: 'Electrical repairs & wiring' },
    { _id: '3', name: 'Tutor', icon: 'school', color: '#4CAF50', description: 'Home tutoring services' },
    { _id: '4', name: 'Tiffin', icon: 'food', color: '#F44336', description: 'Home-cooked meal delivery' },
    { _id: '5', name: 'Trainer', icon: 'dumbbell', color: '#9C27B0', description: 'Personal fitness training' },
    { _id: '6', name: 'Carpenter', icon: 'hammer', color: '#795548', description: 'Woodwork & furniture repair' },
    { _id: '7', name: 'Painter', icon: 'format-paint', color: '#E91E63', description: 'Wall painting & decor' },
    { _id: '8', name: 'Cleaner', icon: 'broom', color: '#009688', description: 'Home & office cleaning' },
    { _id: '9', name: 'Mechanic', icon: 'car-wrench', color: '#607D8B', description: 'Vehicle repair & service' },
    { _id: '10', name: 'Salon', icon: 'content-cut', color: '#FF5722', description: 'Hair & beauty at home' },
    { _id: '11', name: 'Pest Control', icon: 'bug', color: '#8BC34A', description: 'Pest removal & prevention' },
    { _id: '12', name: 'AC Repair', icon: 'air-conditioner', color: '#03A9F4', description: 'AC service & repair' },
];

export const ONBOARDING_SLIDES = [
    {
        id: '1',
        title: 'Discover Local Vendors',
        description: 'Find trusted plumbers, electricians, tutors, and more — right in your neighborhood.',
        icon: 'map-marker-radius',
        color: '#6750A4',
    },
    {
        id: '2',
        title: 'Book Instantly',
        description: 'Choose a time slot, confirm your booking, and get real-time updates on your service.',
        icon: 'calendar-check',
        color: '#625B71',
    },
    {
        id: '3',
        title: 'Rate & Review',
        description: 'Share your experience, help the community, and find the best-rated vendors near you.',
        icon: 'star-circle',
        color: '#7D5260',
    },
];
