import { create } from 'zustand';
import * as Location from 'expo-location';

interface LocationState {
    latitude: number | null;
    longitude: number | null;
    address: string | null;
    isLoading: boolean;
    error: string | null;

    requestLocation: () => Promise<void>;
    setLocation: (lat: number, lng: number, address?: string) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
    latitude: null,
    longitude: null,
    address: null,
    isLoading: false,
    error: null,

    requestLocation: async () => {
        set({ isLoading: true, error: null });
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                set({ error: 'Location permission denied', isLoading: false });
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const [geocode] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            const address = geocode
                ? [geocode.street, geocode.city, geocode.region].filter(Boolean).join(', ')
                : null;

            set({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                address,
                isLoading: false,
            });
        } catch (err) {
            set({
                error: 'Failed to get location',
                isLoading: false,
            });
        }
    },

    setLocation: (latitude: number, longitude: number, address?: string) => {
        set({ latitude, longitude, address: address ?? null });
    },
}));
