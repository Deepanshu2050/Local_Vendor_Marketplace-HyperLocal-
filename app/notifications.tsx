import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Surface, Switch, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../src/theme';

interface NotifSetting {
    id: string;
    icon: string;
    label: string;
    description: string;
    enabled: boolean;
}

const DEFAULT_SETTINGS: NotifSetting[] = [
    { id: 'bookings', icon: 'calendar-check', label: 'Booking Updates', description: 'Get notified when your booking status changes', enabled: true },
    { id: 'messages', icon: 'message', label: 'New Messages', description: 'Receive alerts for new chat messages', enabled: true },
    { id: 'promotions', icon: 'tag', label: 'Promotions & Offers', description: 'Special deals from vendors near you', enabled: false },
    { id: 'reminders', icon: 'alarm', label: 'Service Reminders', description: 'Reminders before scheduled services', enabled: true },
    { id: 'reviews', icon: 'star', label: 'Review Requests', description: 'Reminders to review completed services', enabled: true },
    { id: 'nearby', icon: 'map-marker-radius', label: 'Nearby Vendors', description: 'New vendors available in your area', enabled: false },
];

export default function NotificationsScreen() {
    const theme = useTheme();
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);

    const toggle = (id: string) => {
        setSettings((prev) =>
            prev.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s)
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text variant="headlineSmall" style={[styles.header, { color: theme.colors.onSurface }]}>
                Notifications
            </Text>

            <FlatList
                data={settings}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
                        <View style={styles.row}>
                            <View style={[styles.iconCircle, { backgroundColor: theme.colors.primaryContainer }]}>
                                <MaterialCommunityIcons name={item.icon as any} size={22} color={theme.colors.primary} />
                            </View>
                            <View style={styles.info}>
                                <Text variant="titleSmall" style={{ fontWeight: '600', color: theme.colors.onSurface }}>
                                    {item.label}
                                </Text>
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                                    {item.description}
                                </Text>
                            </View>
                            <Switch value={item.enabled} onValueChange={() => toggle(item.id)} />
                        </View>
                    </Surface>
                )}
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { fontWeight: '700', paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.md },
    list: { paddingHorizontal: spacing.md, paddingBottom: 20 },
    card: { borderRadius: 16, padding: 16 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    iconCircle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    info: { flex: 1 },
});
