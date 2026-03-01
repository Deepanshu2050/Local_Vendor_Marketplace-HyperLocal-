import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, SegmentedButtons, useTheme, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookingCard } from '../../src/components/booking/BookingCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Booking } from '../../src/types';
import { spacing } from '../../src/theme';

const VENDOR_BOOKINGS: Booking[] = [
    {
        _id: 'vb1', customerId: 'c1', vendorId: '1', serviceId: 's1',
        scheduledDate: '2026-03-05', scheduledTime: '10:00', status: 'pending',
        totalAmount: 350, address: 'B-12, Green Park, Delhi',
        createdAt: '2026-03-01', updatedAt: '2026-03-01',
        service: { _id: 's1', vendorId: '1', name: 'Pipe Repair', description: '', price: 350, duration: 60, category: 'Plumber', isActive: true, createdAt: '' },
        customer: { _id: 'c1', name: 'Ankit Singh', email: 'ankit@test.com', phone: '', role: 'customer', createdAt: '', updatedAt: '' },
    },
    {
        _id: 'vb2', customerId: 'c2', vendorId: '1', serviceId: 's2',
        scheduledDate: '2026-03-05', scheduledTime: '14:00', status: 'pending',
        totalAmount: 250, address: 'A-5, Safdarjung, Delhi',
        createdAt: '2026-03-01', updatedAt: '2026-03-01',
        service: { _id: 's2', vendorId: '1', name: 'Drain Cleaning', description: '', price: 250, duration: 45, category: 'Plumber', isActive: true, createdAt: '' },
        customer: { _id: 'c2', name: 'Priya Sharma', email: 'priya@test.com', phone: '', role: 'customer', createdAt: '', updatedAt: '' },
    },
    {
        _id: 'vb3', customerId: 'c3', vendorId: '1', serviceId: 's1',
        scheduledDate: '2026-03-04', scheduledTime: '16:00', status: 'confirmed',
        totalAmount: 350, address: 'C-8, Vasant Kunj, Delhi',
        createdAt: '2026-02-28', updatedAt: '2026-03-01',
        service: { _id: 's1', vendorId: '1', name: 'Pipe Repair', description: '', price: 350, duration: 60, category: 'Plumber', isActive: true, createdAt: '' },
        customer: { _id: 'c3', name: 'Rahul Kumar', email: 'rahul@test.com', phone: '', role: 'customer', createdAt: '', updatedAt: '' },
    },
];

export default function VendorBookingsScreen() {
    const theme = useTheme();
    const router = useRouter();
    const [filter, setFilter] = useState('all');
    const [bookings, setBookings] = useState(VENDOR_BOOKINGS);

    const filtered = bookings.filter((b) => {
        if (filter === 'all') return true;
        if (filter === 'pending') return b.status === 'pending';
        if (filter === 'active') return ['confirmed', 'in_progress'].includes(b.status);
        return false;
    });

    const handleAccept = (id: string) => {
        setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: 'confirmed' as const } : b));
    };

    const handleReject = (id: string) => {
        setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: 'cancelled' as const } : b));
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => router.back()} iconColor={theme.colors.onSurface} />
                <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '600', flex: 1 }}>
                    Bookings
                </Text>
            </View>

            <View style={styles.filterContainer}>
                <SegmentedButtons
                    value={filter}
                    onValueChange={setFilter}
                    buttons={[
                        { value: 'all', label: 'All' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'active', label: 'Active' },
                    ]}
                    style={{ borderRadius: 16 }}
                />
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <BookingCard
                        booking={item}
                        onPress={() => { }}
                        showActions
                        onAccept={() => handleAccept(item._id)}
                        onReject={() => handleReject(item._id)}
                    />
                )}
                ListEmptyComponent={
                    <EmptyState
                        icon="calendar-blank"
                        title="No Bookings"
                        description="No bookings match the current filter."
                    />
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center' },
    filterContainer: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
    list: { paddingHorizontal: spacing.md, paddingBottom: 20 },
});
