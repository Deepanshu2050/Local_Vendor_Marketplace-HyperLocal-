import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ScrollView, RefreshControl, Pressable } from 'react-native';
import { Text, Searchbar, useTheme, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { useLocationStore } from '../../src/store/locationStore';
import { VendorCard } from '../../src/components/vendor/VendorCard';
import { CategoryIconButton } from '../../src/components/ui/CategoryChip';
import { VendorCardSkeleton } from '../../src/components/ui/SkeletonLoader';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { DEFAULT_CATEGORIES } from '../../src/constants';
import { VendorProfile } from '../../src/types';
import { spacing } from '../../src/theme';

// ─── Mock vendors for demo mode ─────────────
const MOCK_VENDORS: VendorProfile[] = [
    {
        _id: '1', userId: 'u1', businessName: 'QuickFix Plumbing', description: 'Expert plumbing services for your home. From leaky faucets to full bathroom renovations.',
        categories: ['Plumber'], services: [{ _id: 's1', vendorId: '1', name: 'Pipe Repair', description: 'Fix leaky pipes', price: 350, duration: 60, category: 'Plumber', isActive: true, createdAt: '' }],
        location: { type: 'Point', coordinates: [77.2090, 28.6139] }, address: 'Connaught Place, Delhi',
        averageRating: 4.7, totalReviews: 128, totalBookings: 340, verified: 'approved',
        gallery: [], availability: { monday: [{ start: '09:00', end: '18:00' }], tuesday: [{ start: '09:00', end: '18:00' }], wednesday: [{ start: '09:00', end: '18:00' }], thursday: [{ start: '09:00', end: '18:00' }], friday: [{ start: '09:00', end: '18:00' }], saturday: [{ start: '10:00', end: '14:00' }], sunday: [] },
        createdAt: '', updatedAt: '', distance: 1.2,
    },
    {
        _id: '2', userId: 'u2', businessName: 'BrightSpark Electricals', description: 'Certified electricians for all your electrical needs. Safety guaranteed.',
        categories: ['Electrician'], services: [{ _id: 's2', vendorId: '2', name: 'Wiring Repair', description: 'Fix faulty wiring', price: 500, duration: 90, category: 'Electrician', isActive: true, createdAt: '' }],
        location: { type: 'Point', coordinates: [77.2167, 28.6285] }, address: 'Karol Bagh, Delhi',
        averageRating: 4.5, totalReviews: 96, totalBookings: 245, verified: 'approved',
        gallery: [], availability: { monday: [{ start: '08:00', end: '20:00' }], tuesday: [{ start: '08:00', end: '20:00' }], wednesday: [{ start: '08:00', end: '20:00' }], thursday: [{ start: '08:00', end: '20:00' }], friday: [{ start: '08:00', end: '20:00' }], saturday: [{ start: '08:00', end: '20:00' }], sunday: [{ start: '10:00', end: '16:00' }] },
        createdAt: '', updatedAt: '', distance: 2.5,
    },
    {
        _id: '3', userId: 'u3', businessName: 'HomeChef Tiffin', description: 'Delicious home-cooked meals delivered to your doorstep. Fresh and hygienic.',
        categories: ['Tiffin'], services: [{ _id: 's3', vendorId: '3', name: 'Monthly Tiffin', description: 'Daily lunch & dinner', price: 3500, duration: 30, category: 'Tiffin', isActive: true, createdAt: '' }],
        location: { type: 'Point', coordinates: [77.2273, 28.6353] }, address: 'Rajouri Garden, Delhi',
        averageRating: 4.8, totalReviews: 215, totalBookings: 890, verified: 'approved',
        gallery: [], availability: { monday: [{ start: '07:00', end: '21:00' }], tuesday: [{ start: '07:00', end: '21:00' }], wednesday: [{ start: '07:00', end: '21:00' }], thursday: [{ start: '07:00', end: '21:00' }], friday: [{ start: '07:00', end: '21:00' }], saturday: [{ start: '07:00', end: '21:00' }], sunday: [{ start: '07:00', end: '21:00' }] },
        createdAt: '', updatedAt: '', distance: 0.8,
    },
    {
        _id: '4', userId: 'u4', businessName: 'FitLife Training', description: 'Personal fitness training at your home or park. Certified trainers.',
        categories: ['Trainer'], services: [{ _id: 's4', vendorId: '4', name: 'Personal Training', description: '1-on-1 session', price: 800, duration: 60, category: 'Trainer', isActive: true, createdAt: '' }],
        location: { type: 'Point', coordinates: [77.2000, 28.6200] }, address: 'Patel Nagar, Delhi',
        averageRating: 4.6, totalReviews: 73, totalBookings: 195, verified: 'approved',
        gallery: [], availability: { monday: [{ start: '06:00', end: '10:00' }, { start: '17:00', end: '21:00' }], tuesday: [{ start: '06:00', end: '10:00' }, { start: '17:00', end: '21:00' }], wednesday: [{ start: '06:00', end: '10:00' }, { start: '17:00', end: '21:00' }], thursday: [{ start: '06:00', end: '10:00' }, { start: '17:00', end: '21:00' }], friday: [{ start: '06:00', end: '10:00' }, { start: '17:00', end: '21:00' }], saturday: [{ start: '06:00', end: '12:00' }], sunday: [] },
        createdAt: '', updatedAt: '', distance: 3.1,
    },
    {
        _id: '5', userId: 'u5', businessName: 'SmartTutor Academy', description: 'Expert tutoring in all subjects. Experienced teachers for classes 1-12.',
        categories: ['Tutor'], services: [{ _id: 's5', vendorId: '5', name: 'Math Tutoring', description: 'Classes 6-12', price: 600, duration: 60, category: 'Tutor', isActive: true, createdAt: '' }],
        location: { type: 'Point', coordinates: [77.1950, 28.6100] }, address: 'Janakpuri, Delhi',
        averageRating: 4.9, totalReviews: 310, totalBookings: 1200, verified: 'approved',
        gallery: [], availability: { monday: [{ start: '15:00', end: '21:00' }], tuesday: [{ start: '15:00', end: '21:00' }], wednesday: [{ start: '15:00', end: '21:00' }], thursday: [{ start: '15:00', end: '21:00' }], friday: [{ start: '15:00', end: '21:00' }], saturday: [{ start: '09:00', end: '18:00' }], sunday: [{ start: '09:00', end: '14:00' }] },
        createdAt: '', updatedAt: '', distance: 1.8,
    },
];

export default function HomeScreen() {
    const theme = useTheme();
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const { address, requestLocation } = useLocationStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [vendors, setVendors] = useState<VendorProfile[]>(MOCK_VENDORS);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        requestLocation();
    }, []);

    const filteredVendors = vendors.filter((v) => {
        const matchesSearch = searchQuery
            ? v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
            : true;
        const matchesCategory = selectedCategory
            ? v.categories.includes(selectedCategory)
            : true;
        return matchesSearch && matchesCategory;
    });

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const renderHeader = () => (
        <View>
            {/* Greeting */}
            <View style={styles.greetingSection}>
                <View>
                    <Text variant="titleSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        {greeting()} 👋
                    </Text>
                    <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                        {user?.name || 'User'}
                    </Text>
                </View>
                <IconButton
                    icon="bell-outline"
                    size={24}
                    onPress={() => { }}
                    style={[styles.notifButton, { backgroundColor: theme.colors.surfaceVariant }]}
                />
            </View>

            {/* Location */}
            <Pressable style={styles.locationRow} onPress={requestLocation}>
                <MaterialCommunityIcons name="map-marker" size={18} color={theme.colors.primary} />
                <Text variant="bodySmall" numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant, flex: 1, marginLeft: 4 }}>
                    {address || 'Detecting location...'}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={18} color={theme.colors.onSurfaceVariant} />
            </Pressable>

            {/* Search */}
            <Searchbar
                placeholder="Search vendors, services..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[styles.searchbar, { backgroundColor: theme.colors.surfaceVariant }]}
                inputStyle={styles.searchInput}
                elevation={0}
            />

            {/* Categories */}
            <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                    Categories
                </Text>
                <Pressable onPress={() => setSelectedCategory(null)}>
                    <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
                        {selectedCategory ? 'Clear' : 'View All'}
                    </Text>
                </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
                {DEFAULT_CATEGORIES.map((cat) => (
                    <CategoryIconButton
                        key={cat._id}
                        name={cat.name}
                        icon={cat.icon}
                        color={cat.color}
                        onPress={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                    />
                ))}
            </ScrollView>

            {/* Section Title */}
            <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                    {selectedCategory ? `${selectedCategory}s Near You` : 'Nearby Vendors'}
                </Text>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    {filteredVendors.length} found
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FlatList
                data={filteredVendors}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={renderHeader}
                renderItem={({ item }) => (
                    <View style={styles.vendorCardWrapper}>
                        <VendorCard
                            vendor={item}
                            onPress={() => router.push(`/vendor/${item._id}`)}
                        />
                    </View>
                )}
                ListEmptyComponent={
                    loading ? (
                        <View style={styles.vendorCardWrapper}>
                            <VendorCardSkeleton />
                            <VendorCardSkeleton />
                            <VendorCardSkeleton />
                        </View>
                    ) : (
                        <EmptyState
                            icon="store-search"
                            title="No Vendors Found"
                            description={selectedCategory ? `No ${selectedCategory}s found near you. Try a different category.` : 'No vendors found near your location.'}
                            actionLabel="Clear Filters"
                            onAction={() => {
                                setSelectedCategory(null);
                                setSearchQuery('');
                            }}
                        />
                    )
                }
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    listContent: { paddingBottom: 20 },
    greetingSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
    },
    notifButton: { marginRight: -8 },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        marginTop: 4,
        marginBottom: spacing.md,
    },
    searchbar: {
        marginHorizontal: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.md,
    },
    searchInput: { fontSize: 14 },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        marginTop: spacing.sm,
        marginBottom: spacing.sm,
    },
    categoriesList: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
        gap: 4,
    },
    vendorCardWrapper: {
        paddingHorizontal: spacing.md,
    },
});
