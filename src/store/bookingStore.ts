import { create } from 'zustand';
import { Booking, BookingStatus } from '../types';

interface BookingState {
    activeBookings: Booking[];
    selectedDate: string | null;
    selectedTime: string | null;
    selectedServiceId: string | null;

    setSelectedDate: (date: string | null) => void;
    setSelectedTime: (time: string | null) => void;
    setSelectedService: (serviceId: string | null) => void;
    setActiveBookings: (bookings: Booking[]) => void;
    updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
    resetSelection: () => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
    activeBookings: [],
    selectedDate: null,
    selectedTime: null,
    selectedServiceId: null,

    setSelectedDate: (date) => set({ selectedDate: date }),
    setSelectedTime: (time) => set({ selectedTime: time }),
    setSelectedService: (serviceId) => set({ selectedServiceId: serviceId }),

    setActiveBookings: (bookings) => set({ activeBookings: bookings }),

    updateBookingStatus: (bookingId, status) => {
        const bookings = get().activeBookings.map((b) =>
            b._id === bookingId ? { ...b, status } : b
        );
        set({ activeBookings: bookings });
    },

    resetSelection: () =>
        set({ selectedDate: null, selectedTime: null, selectedServiceId: null }),
}));
