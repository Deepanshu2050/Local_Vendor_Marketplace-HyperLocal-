import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Surface, useTheme, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { formatPrice } from '../../src/utils';
import { appColors, spacing } from '../../src/theme';

export default function VendorDashboardScreen() {
    const theme = useTheme();
    const router = useRouter();
    const user = useAuthStore((s) => s.user);

    const stats = [
        { label: 'Today\'s Earnings', value: formatPrice(2400), icon: 'currency-inr', color: appColors.success },
        { label: 'Total Earnings', value: formatPrice(48500), icon: 'wallet', color: theme.colors.primary },
        { label: 'Active Bookings', value: '5', icon: 'calendar-clock', color: appColors.warning },
        { label: 'Total Reviews', value: '128', icon: 'star', color: appColors.star },
    ];

    const quickActions = [
        { label: 'My Services', icon: 'briefcase-outline', route: '/vendor-dashboard/services' },
        { label: 'Bookings', icon: 'calendar-check', route: '/vendor-dashboard/bookings' },
        { label: 'Messages', icon: 'chat-outline', route: '/(tabs)/chat' },
        { label: 'Profile', icon: 'account-outline', route: '/(tabs)/profile' },
    ];

    const recentBookings = [
        { id: '1', customer: 'Ankit Singh', service: 'Pipe Repair', time: '10:00 AM', status: 'confirmed' },
        { id: '2', customer: 'Priya Sharma', service: 'Drain Cleaning', time: '2:00 PM', status: 'pending' },
        { id: '3', customer: 'Rahul Kumar', service: 'Pipe Repair', time: '4:00 PM', status: 'pending' },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Welcome back,</Text>
                        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                            {user?.name || 'Vendor'}
                        </Text>
                    </View>
                    <IconButton
                        icon="bell-outline"
                        size={24}
                        onPress={() => { }}
                        style={{ backgroundColor: theme.colors.surfaceVariant }}
                    />
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {stats.map((stat, i) => (
                        <Surface key={i} style={[styles.statCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
                            <View style={[styles.statIconContainer, { backgroundColor: stat.color + '18' }]}>
                                <MaterialCommunityIcons name={stat.icon as any} size={22} color={stat.color} />
                            </View>
                            <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700', marginTop: 8 }}>
                                {stat.value}
                            </Text>
                            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                                {stat.label}
                            </Text>
                        </Surface>
                    ))}
                </View>

                {/* Quick Actions */}
                <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Quick Actions
                </Text>
                <View style={styles.actionsRow}>
                    {quickActions.map((action) => (
                        <Pressable
                            key={action.label}
                            style={[styles.actionCard, { backgroundColor: theme.colors.surfaceVariant }]}
                            onPress={() => router.push(action.route as any)}
                        >
                            <MaterialCommunityIcons name={action.icon as any} size={28} color={theme.colors.primary} />
                            <Text variant="labelSmall" style={{ color: theme.colors.onSurface, marginTop: 6, fontWeight: '500' }}>
                                {action.label}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Recent Bookings */}
                <View style={styles.sectionHeader}>
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                        Today's Bookings
                    </Text>
                    <Pressable onPress={() => router.push('/vendor-dashboard/bookings')}>
                        <Text variant="labelMedium" style={{ color: theme.colors.primary }}>View All</Text>
                    </Pressable>
                </View>

                {recentBookings.map((booking) => (
                    <Surface key={booking.id} style={[styles.bookingItem, { backgroundColor: theme.colors.surface }]} elevation={1}>
                        <View style={styles.bookingRow}>
                            <View style={{ flex: 1 }}>
                                <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                                    {booking.customer}
                                </Text>
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                    {booking.service} • {booking.time}
                                </Text>
                            </View>
                            <View style={[styles.statusPill, {
                                backgroundColor: booking.status === 'confirmed' ? appColors.successContainer : appColors.warningContainer
                            }]}>
                                <Text variant="labelSmall" style={{
                                    color: booking.status === 'confirmed' ? appColors.success : appColors.warning,
                                    fontWeight: '600',
                                }}>
                                    {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                </Text>
                            </View>
                        </View>
                    </Surface>
                ))}

                <View style={{ height: 32 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingTop: spacing.sm },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: spacing.md, marginTop: spacing.md },
    statCard: { width: '47%', borderRadius: 16, padding: 16 },
    statIconContainer: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    sectionTitle: { fontWeight: '600', paddingHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm },
    actionsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: spacing.md },
    actionCard: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 16 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm },
    bookingItem: { marginHorizontal: spacing.md, borderRadius: 14, padding: 14, marginBottom: 10 },
    bookingRow: { flexDirection: 'row', alignItems: 'center' },
    statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
});
