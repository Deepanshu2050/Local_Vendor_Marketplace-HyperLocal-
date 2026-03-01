import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Avatar, Surface, Divider, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { getInitials } from '../../src/utils';
import { spacing } from '../../src/theme';
import api from '../../src/services/api';

export default function ProfileScreen() {
    const theme = useTheme();
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const logout = useAuthStore((s) => s.logout);
    const [stats, setStats] = useState({ bookings: 0, reviews: 0 });

    // Fetch real stats when screen focuses
    useFocusEffect(
        useCallback(() => {
            if (!isAuthenticated) return;
            const fetchStats = async () => {
                try {
                    const { data } = await api.get('/bookings/my');
                    const bookingCount = data?.data?.length || 0;
                    setStats({ bookings: bookingCount, reviews: 0 });
                } catch {
                    // Keep defaults if API fails
                }
            };
            fetchStats();
        }, [isAuthenticated])
    );

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    const menuItems = [
        { icon: 'account-edit-outline', label: 'Edit Profile', onPress: () => router.push('/edit-profile') },
        { icon: 'map-marker-outline', label: 'Saved Addresses', onPress: () => router.push('/saved-addresses') },
        { icon: 'bell-outline', label: 'Notifications', onPress: () => router.push('/notifications') },
        { icon: 'shield-check-outline', label: 'Privacy & Security', onPress: () => { } },
        { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => { } },
        { icon: 'information-outline', label: 'About', onPress: () => { } },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text variant="headlineSmall" style={[styles.header, { color: theme.colors.onSurface }]}>
                    Profile
                </Text>

                {/* Profile Card */}
                <Surface style={[styles.profileCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
                    <Avatar.Text
                        size={72}
                        label={getInitials(user?.name || 'U')}
                        style={{ backgroundColor: theme.colors.primaryContainer }}
                        labelStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 28 }}
                    />
                    <View style={styles.profileInfo}>
                        <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                            {user?.name || 'User'}
                        </Text>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                            {user?.email || 'email@example.com'}
                        </Text>
                        {user?.phone ? (
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                {user.phone}
                            </Text>
                        ) : null}
                        <View style={[styles.roleBadge, { backgroundColor: theme.colors.primaryContainer }]}>
                            <Text variant="labelSmall" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '600' }}>
                                {user?.role === 'vendor' ? 'Vendor' : user?.role === 'admin' ? 'Admin' : 'Customer'}
                            </Text>
                        </View>
                    </View>
                </Surface>

                {/* Quick Stats */}
                <View style={styles.statsRow}>
                    <Surface style={[styles.statCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
                        <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>{stats.bookings}</Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Bookings</Text>
                    </Surface>
                    <Surface style={[styles.statCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
                        <Text variant="headlineSmall" style={{ color: theme.colors.primary, fontWeight: '700' }}>{stats.reviews}</Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>Reviews</Text>
                    </Surface>
                </View>

                {/* Settings Menu */}
                <Surface style={[styles.menuCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
                    {menuItems.map((item, index) => (
                        <React.Fragment key={item.label}>
                            <Pressable style={styles.menuItem} onPress={item.onPress}>
                                <MaterialCommunityIcons name={item.icon as any} size={22} color={theme.colors.onSurfaceVariant} />
                                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, flex: 1, marginLeft: 14 }}>
                                    {item.label}
                                </Text>
                                <MaterialCommunityIcons name="chevron-right" size={22} color={theme.colors.onSurfaceVariant} />
                            </Pressable>
                            {index < menuItems.length - 1 && <Divider style={{ marginLeft: 52 }} />}
                        </React.Fragment>
                    ))}
                </Surface>

                {/* Vendor Dashboard Link */}
                {user?.role === 'vendor' && (
                    <Pressable
                        style={[styles.vendorLink, { backgroundColor: theme.colors.primaryContainer }]}
                        onPress={() => router.push('/vendor-dashboard')}
                    >
                        <MaterialCommunityIcons name="store" size={24} color={theme.colors.primary} />
                        <Text variant="titleSmall" style={{ color: theme.colors.onPrimaryContainer, flex: 1, marginLeft: 12 }}>
                            Vendor Dashboard
                        </Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.primary} />
                    </Pressable>
                )}

                {/* Admin Panel Link */}
                {user?.role === 'admin' && (
                    <Pressable
                        style={[styles.vendorLink, { backgroundColor: theme.colors.primaryContainer }]}
                        onPress={() => router.push('/admin')}
                    >
                        <MaterialCommunityIcons name="shield-crown" size={24} color={theme.colors.primary} />
                        <Text variant="titleSmall" style={{ color: theme.colors.onPrimaryContainer, flex: 1, marginLeft: 12 }}>
                            Admin Panel
                        </Text>
                        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.primary} />
                    </Pressable>
                )}

                {/* Logout */}
                <Pressable style={styles.logoutButton} onPress={handleLogout}>
                    <MaterialCommunityIcons name="logout" size={22} color={theme.colors.error} />
                    <Text variant="labelLarge" style={{ color: theme.colors.error, marginLeft: 8 }}>
                        Sign Out
                    </Text>
                </Pressable>

                <Text variant="bodySmall" style={[styles.version, { color: theme.colors.onSurfaceVariant }]}>
                    LocalVendor v1.0.0
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { fontWeight: '700', paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.md },
    profileCard: {
        marginHorizontal: spacing.md,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    profileInfo: { flex: 1, gap: 2 },
    roleBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, alignSelf: 'flex-start', marginTop: 4 },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: spacing.md,
        marginTop: spacing.md,
    },
    statCard: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        gap: 4,
    },
    menuCard: {
        marginHorizontal: spacing.md,
        marginTop: spacing.md,
        borderRadius: 20,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 16,
    },
    vendorLink: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: spacing.md,
        marginTop: spacing.md,
        padding: 18,
        borderRadius: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: spacing.md,
        marginTop: spacing.lg,
        paddingVertical: 14,
    },
    version: { textAlign: 'center', marginTop: spacing.sm, paddingBottom: spacing.lg },
});
