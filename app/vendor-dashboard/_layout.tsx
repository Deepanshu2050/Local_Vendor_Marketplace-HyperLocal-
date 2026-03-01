import { Stack } from 'expo-router';

export default function VendorDashboardLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="services" />
            <Stack.Screen name="bookings" />
        </Stack>
    );
}
