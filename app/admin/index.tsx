import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Surface, useTheme, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { appColors, spacing } from '../../src/theme';

export default function AdminDashboardScreen() {
    const theme = useTheme();
    const router = useRouter();
    const logout = useAuthStore((s) => s.logout);

    const analytics = [
        { label: 'Total Users', value: '2,450', icon: 'account-group', color: theme.colors.primary },
        { label: 'Active Vendors', value: '180', icon: 'store', color: appColors.success },
        { label: 'Total Bookings', value: '8,320', icon: 'calendar-check', color: appColors.info },
        { label: 'Revenue', value: '₹12.5L', icon: 'currency-inr', color: appColors.warning },
        { label: 'Pending Approvals', value: '12', icon: 'clock-outline', color: appColors.pending },
        { label: 'Today\'s Bookings', value: '47', icon: 'calendar-today', color: '#9C27B0' },
    ];

    const menuItems = [
        { label: 'Vendor Approvals', icon: 'store-check', route: '/admin/vendors', badge: '12' },
        { label: 'Categories', icon: 'shape', route: '/admin/vendors' },
        { label: 'All Users', icon: 'account-multiple', route: '/admin/vendors' },
        { label: 'Reports', icon: 'chart-bar', route: '/admin/vendors' },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>Admin Panel</Text>
                        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                            Platform Overview
                        </Text>
                    </View>
                    <IconButton
                        icon="logout"
                        onPress={async () => { await logout(); router.replace('/(auth)/login'); }}
                        iconColor={theme.colors.error}
                    />
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {analytics.map((stat, i) => (
                        <Surface key={i} style={[styles.statCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
                            <View style={[styles.statIcon, { backgroundColor: stat.color + '18' }]}>
                                <MaterialCommunityIcons name={stat.icon as any} size={24} color={stat.color} />
                            </View>
                            <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                                {stat.value}
                            </Text>
                            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                {stat.label}
                            </Text>
                        </Surface>
                    ))}
                </View>

                {/* Admin Menu */}
                <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Manage
                </Text>
                {menuItems.map((item) => (
                    <Pressable key={item.label} onPress={() => router.push(item.route as any)}>
                        <Surface style={[styles.menuItem, { backgroundColor: theme.colors.surface }]} elevation={1}>
                            <MaterialCommunityIcons name={item.icon as any} size={24} color={theme.colors.primary} />
                            <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, flex: 1, marginLeft: 14 }}>
                                {item.label}
                            </Text>
                            {item.badge && (
                                <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
                                    <Text variant="labelSmall" style={{ color: '#FFF', fontWeight: '700' }}>{item.badge}</Text>
                                </View>
                            )}
                            <MaterialCommunityIcons name="chevron-right" size={22} color={theme.colors.onSurfaceVariant} />
                        </Surface>
                    </Pressable>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingTop: spacing.sm },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: spacing.md },
    statCard: { width: '47%', borderRadius: 16, padding: 16, gap: 4 },
    statIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    sectionTitle: { fontWeight: '600', paddingHorizontal: spacing.md, marginTop: spacing.sm, marginBottom: spacing.sm },
    menuItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.md, marginBottom: 10, padding: 16, borderRadius: 16 },
    badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginRight: 8 },
});
