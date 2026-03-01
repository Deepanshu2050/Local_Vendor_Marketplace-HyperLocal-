import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, SegmentedButtons, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { BookingCard } from '../../src/components/booking/BookingCard';
import { BookingCardSkeleton } from '../../src/components/ui/SkeletonLoader';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Booking } from '../../src/types';
import { spacing } from '../../src/theme';
import { useAuthStore } from '../../src/store/authStore';
import api from '../../src/services/api';

export default function BookingsScreen() {
    const theme = useTheme();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const [filter, setFilter] = useState('all');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchBookings = useCallback(async () => {
        if (!isAuthenticated) { setLoading(false); return; }
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data?.data || []);
        } catch (err) {
            console.log('Bookings fetch error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [isAuthenticated]);

    // Refetch when screen focuses (so new bookings appear)
    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchBookings();
        }, [fetchBookings])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchBookings();
    };

    const filteredBookings = bookings.filter((b) => {
        if (filter === 'all') return true;
        if (filter === 'upcoming') return ['pending', 'confirmed', 'in_progress'].includes(b.status);
        if (filter === 'past') return ['completed', 'cancelled'].includes(b.status);
        return true;
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                My Bookings
            </Text>

            <View style={styles.filterContainer}>
                <SegmentedButtons
                    value={filter}
                    onValueChange={setFilter}
                    buttons={[
                        { value: 'all', label: 'All' },
                        { value: 'upcoming', label: 'Upcoming' },
                        { value: 'past', label: 'Past' },
                    ]}
                    style={styles.segmented}
                />
            </View>

            {loading ? (
                <View style={{ paddingHorizontal: spacing.md }}>
                    <BookingCardSkeleton />
                    <BookingCardSkeleton />
                    <BookingCardSkeleton />
                </View>
            ) : (
                <FlatList
                    data={filteredBookings}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.cardWrapper}>
                            <BookingCard booking={item} onPress={() => { }} />
                        </View>
                    )}
                    ListEmptyComponent={
                        <EmptyState
                            icon="calendar-blank"
                            title="No Bookings"
                            description={
                                filter === 'all'
                                    ? "You haven't made any bookings yet. Browse vendors to get started!"
                                    : `No ${filter} bookings found.`
                            }
                        />
                    }
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                    }
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    title: { fontWeight: '700', paddingHorizontal: spacing.md, paddingTop: spacing.sm },
    filterContainer: { paddingHorizontal: spacing.md, paddingVertical: spacing.md },
    segmented: { borderRadius: 16 },
    cardWrapper: { paddingHorizontal: spacing.md },
    listContent: { paddingBottom: 20 },
});
