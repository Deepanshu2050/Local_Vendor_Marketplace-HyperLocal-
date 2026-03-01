import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Text, Button, Surface, FAB, Divider, useTheme, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RatingStars } from '../../src/components/ui/RatingStars';
import { formatPrice, formatDistance } from '../../src/utils';
import { appColors, spacing } from '../../src/theme';
import { VendorProfile, Service, Review } from '../../src/types';

// Mock vendor detail data
const MOCK_VENDOR_DETAIL: Record<string, { vendor: VendorProfile; reviews: Review[] }> = {
    '1': {
        vendor: {
            _id: '1', userId: 'u1', businessName: 'QuickFix Plumbing',
            description: 'Professional plumbing services with 10+ years of experience. We handle everything from minor leaks to major pipe installations. Licensed, insured, and committed to quality craftsmanship.',
            categories: ['Plumber'], location: { type: 'Point', coordinates: [77.2090, 28.6139] },
            address: 'Connaught Place, New Delhi',
            services: [
                { _id: 's1', vendorId: '1', name: 'Pipe Repair', description: 'Fix leaky or burst pipes', price: 350, duration: 60, category: 'Plumber', isActive: true, createdAt: '' },
                { _id: 's1b', vendorId: '1', name: 'Drain Cleaning', description: 'Unclog blocked drains', price: 250, duration: 45, category: 'Plumber', isActive: true, createdAt: '' },
                { _id: 's1c', vendorId: '1', name: 'Full Bathroom Fitting', description: 'Complete bathroom plumbing setup', price: 5000, duration: 480, category: 'Plumber', isActive: true, createdAt: '' },
            ],
            averageRating: 4.7, totalReviews: 128, totalBookings: 340, verified: 'approved',
            gallery: [], availability: { monday: [{ start: '09:00', end: '18:00' }], tuesday: [{ start: '09:00', end: '18:00' }], wednesday: [{ start: '09:00', end: '18:00' }], thursday: [{ start: '09:00', end: '18:00' }], friday: [{ start: '09:00', end: '18:00' }], saturday: [{ start: '10:00', end: '14:00' }], sunday: [] },
            createdAt: '', updatedAt: '', distance: 1.2,
        },
        reviews: [
            { _id: 'r1', bookingId: 'b1', customerId: 'c1', vendorId: '1', rating: 5, text: 'Excellent work! Fixed my kitchen leak quickly and professionally.', createdAt: '2026-02-25T10:00:00Z', customer: { _id: 'c1', name: 'Ankit Singh', email: '', phone: '', role: 'customer', createdAt: '', updatedAt: '' } },
            { _id: 'r2', bookingId: 'b2', customerId: 'c2', vendorId: '1', rating: 4, text: 'Good service. Arrived on time and cleaned up after the job.', createdAt: '2026-02-20T14:00:00Z', customer: { _id: 'c2', name: 'Priya Sharma', email: '', phone: '', role: 'customer', createdAt: '', updatedAt: '' } },
            { _id: 'r3', bookingId: 'b3', customerId: 'c3', vendorId: '1', rating: 5, text: 'Best plumber in the area! Highly recommended.', createdAt: '2026-02-15T09:00:00Z', customer: { _id: 'c3', name: 'Rahul Kumar', email: '', phone: '', role: 'customer', createdAt: '', updatedAt: '' } },
        ],
    },
};

// Default mock for any vendor ID
const getVendorData = (id: string) => MOCK_VENDOR_DETAIL[id] || MOCK_VENDOR_DETAIL['1'];

export default function VendorDetailScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const data = getVendorData(id!);
    const { vendor, reviews } = data;

    const [selectedTab, setSelectedTab] = useState<'services' | 'reviews'>('services');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <View style={styles.headerImage}>
                    <View style={[styles.coverPlaceholder, { backgroundColor: theme.colors.primaryContainer }]}>
                        <MaterialCommunityIcons name="store" size={64} color={theme.colors.primary} />
                    </View>
                    <View style={styles.headerOverlay}>
                        <IconButton
                            icon="arrow-left"
                            size={24}
                            onPress={() => router.back()}
                            style={[styles.backBtn, { backgroundColor: theme.colors.surface }]}
                            iconColor={theme.colors.onSurface}
                        />
                        <IconButton
                            icon="share-variant"
                            size={24}
                            onPress={() => { }}
                            style={[styles.shareBtn, { backgroundColor: theme.colors.surface }]}
                            iconColor={theme.colors.onSurface}
                        />
                    </View>
                </View>

                {/* Vendor Info */}
                <View style={styles.infoSection}>
                    <View style={styles.nameRow}>
                        <View style={{ flex: 1 }}>
                            <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                                {vendor.businessName}
                            </Text>
                            <View style={styles.locationRow}>
                                <MaterialCommunityIcons name="map-marker" size={16} color={theme.colors.primary} />
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                                    {vendor.address} • {vendor.distance ? formatDistance(vendor.distance) : ''}
                                </Text>
                            </View>
                        </View>
                        {vendor.verified === 'approved' && (
                            <View style={[styles.verifiedTag, { backgroundColor: appColors.successContainer }]}>
                                <MaterialCommunityIcons name="check-decagram" size={14} color={appColors.success} />
                                <Text variant="labelSmall" style={{ color: appColors.success, fontWeight: '600' }}>Verified</Text>
                            </View>
                        )}
                    </View>

                    <RatingStars rating={vendor.averageRating} size={18} totalReviews={vendor.totalReviews} />

                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8, lineHeight: 22 }}>
                        {vendor.description}
                    </Text>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                                {vendor.totalBookings}
                            </Text>
                            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Bookings</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: theme.colors.outlineVariant }]} />
                        <View style={styles.statItem}>
                            <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                                {vendor.totalReviews}
                            </Text>
                            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Reviews</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: theme.colors.outlineVariant }]} />
                        <View style={styles.statItem}>
                            <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                                {vendor.averageRating}
                            </Text>
                            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Rating</Text>
                        </View>
                    </View>
                </View>

                {/* Tab Switch */}
                <View style={styles.tabRow}>
                    <Pressable
                        onPress={() => setSelectedTab('services')}
                        style={[styles.tab, selectedTab === 'services' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }]}
                    >
                        <Text variant="labelLarge" style={{ color: selectedTab === 'services' ? theme.colors.primary : theme.colors.onSurfaceVariant }}>
                            Services ({vendor.services.length})
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setSelectedTab('reviews')}
                        style={[styles.tab, selectedTab === 'reviews' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }]}
                    >
                        <Text variant="labelLarge" style={{ color: selectedTab === 'reviews' ? theme.colors.primary : theme.colors.onSurfaceVariant }}>
                            Reviews ({reviews.length})
                        </Text>
                    </Pressable>
                </View>

                {/* Tab Content */}
                {selectedTab === 'services' ? (
                    <View style={styles.contentSection}>
                        {vendor.services.map((service) => (
                            <Surface key={service._id} style={[styles.serviceCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
                                <View style={styles.serviceHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                                            {service.name}
                                        </Text>
                                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
                                            {service.description}
                                        </Text>
                                    </View>
                                    <View style={styles.priceCol}>
                                        <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                                            {formatPrice(service.price)}
                                        </Text>
                                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                            {service.duration} min
                                        </Text>
                                    </View>
                                </View>
                                <Button
                                    mode="contained-tonal"
                                    onPress={() => router.push(`/vendor/book/${vendor._id}?serviceId=${service._id}`)}
                                    style={styles.bookServiceBtn}
                                    compact
                                >
                                    Book Now
                                </Button>
                            </Surface>
                        ))}
                    </View>
                ) : (
                    <View style={styles.contentSection}>
                        {reviews.map((review) => (
                            <Surface key={review._id} style={[styles.reviewCard, { backgroundColor: theme.colors.surface }]} elevation={0}>
                                <View style={styles.reviewHeader}>
                                    <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                                        {review.customer?.name || 'Anonymous'}
                                    </Text>
                                    <RatingStars rating={review.rating} size={14} showValue={false} />
                                </View>
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 6, lineHeight: 20 }}>
                                    {review.text}
                                </Text>
                                <Divider style={{ marginTop: 12 }} />
                            </Surface>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Book Now FAB */}
            <FAB
                icon="calendar-plus"
                label="Book Now"
                onPress={() => router.push(`/vendor/book/${vendor._id}`)}
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerImage: { height: 220, position: 'relative' },
    coverPlaceholder: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
    headerOverlay: { position: 'absolute', top: 8, left: 8, right: 8, flexDirection: 'row', justifyContent: 'space-between' },
    backBtn: { elevation: 2 },
    shareBtn: { elevation: 2 },
    infoSection: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
    nameRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    verifiedTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, gap: 4 },
    statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingVertical: 12, justifyContent: 'space-around' },
    statItem: { alignItems: 'center', gap: 2 },
    statDivider: { width: 1, height: 32 },
    tabRow: { flexDirection: 'row', paddingHorizontal: spacing.md, marginTop: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.06)' },
    tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
    contentSection: { paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: 100 },
    serviceCard: { borderRadius: 16, padding: 16, marginBottom: 12 },
    serviceHeader: { flexDirection: 'row', alignItems: 'flex-start' },
    priceCol: { alignItems: 'flex-end' },
    bookServiceBtn: { marginTop: 12, borderRadius: 20, alignSelf: 'flex-end' },
    reviewCard: { paddingVertical: 12 },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    fab: { position: 'absolute', bottom: 24, right: 24, borderRadius: 28 },
});
