import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Surface, Button, Chip, useTheme, IconButton, Avatar, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getInitials } from '../../src/utils';
import { appColors, spacing } from '../../src/theme';

interface PendingVendor {
    id: string;
    name: string;
    businessName: string;
    category: string;
    email: string;
    status: 'pending' | 'approved' | 'rejected';
}

const PENDING_VENDORS: PendingVendor[] = [
    { id: 'v1', name: 'Amit Kumar', businessName: 'Kumar Electronics', category: 'Electrician', email: 'amit@test.com', status: 'pending' },
    { id: 'v2', name: 'Sunita Devi', businessName: 'Sunita\'s Kitchen', category: 'Tiffin', email: 'sunita@test.com', status: 'pending' },
    { id: 'v3', name: 'Rajan Patel', businessName: 'SparkClean Services', category: 'Cleaner', email: 'rajan@test.com', status: 'pending' },
    { id: 'v4', name: 'Deepa Nair', businessName: 'FitZone Training', category: 'Trainer', email: 'deepa@test.com', status: 'pending' },
];

export default function AdminVendorsScreen() {
    const theme = useTheme();
    const router = useRouter();
    const [vendors, setVendors] = useState(PENDING_VENDORS);
    const [snack, setSnack] = useState('');

    const handleApprove = (id: string) => {
        setVendors((prev) => prev.map((v) => v.id === id ? { ...v, status: 'approved' as const } : v));
        setSnack('Vendor approved successfully');
    };

    const handleReject = (id: string) => {
        setVendors((prev) => prev.map((v) => v.id === id ? { ...v, status: 'rejected' as const } : v));
        setSnack('Vendor rejected');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => router.back()} iconColor={theme.colors.onSurface} />
                <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '600', flex: 1 }}>
                    Vendor Approvals
                </Text>
            </View>

            <FlatList
                data={vendors}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Surface style={[styles.vendorCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
                        <View style={styles.vendorRow}>
                            <Avatar.Text
                                size={48}
                                label={getInitials(item.name)}
                                style={{ backgroundColor: theme.colors.primaryContainer }}
                                labelStyle={{ color: theme.colors.onPrimaryContainer }}
                            />
                            <View style={{ flex: 1, marginLeft: 14 }}>
                                <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                                    {item.businessName}
                                </Text>
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                    {item.name} • {item.email}
                                </Text>
                                <Chip
                                    compact
                                    style={[styles.categoryChip, { backgroundColor: theme.colors.secondaryContainer }]}
                                    textStyle={{ fontSize: 11, color: theme.colors.onSecondaryContainer }}
                                >
                                    {item.category}
                                </Chip>
                            </View>
                        </View>

                        {item.status === 'pending' ? (
                            <View style={styles.actions}>
                                <Button
                                    mode="outlined"
                                    onPress={() => handleReject(item.id)}
                                    textColor={theme.colors.error}
                                    style={[styles.actionBtn, { borderColor: theme.colors.error }]}
                                    compact
                                >
                                    Reject
                                </Button>
                                <Button
                                    mode="contained"
                                    onPress={() => handleApprove(item.id)}
                                    style={styles.actionBtn}
                                    compact
                                >
                                    Approve
                                </Button>
                            </View>
                        ) : (
                            <View style={[styles.statusTag, {
                                backgroundColor: item.status === 'approved' ? appColors.successContainer : theme.colors.errorContainer
                            }]}>
                                <Text variant="labelSmall" style={{
                                    color: item.status === 'approved' ? appColors.success : theme.colors.error, fontWeight: '600'
                                }}>
                                    {item.status === 'approved' ? 'Approved' : 'Rejected'}
                                </Text>
                            </View>
                        )}
                    </Surface>
                )}
            />

            <Snackbar visible={!!snack} onDismiss={() => setSnack('')} duration={2000}>
                {snack}
            </Snackbar>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center' },
    list: { padding: spacing.md, paddingBottom: 20 },
    vendorCard: { borderRadius: 16, padding: 16, marginBottom: 12 },
    vendorRow: { flexDirection: 'row', alignItems: 'center' },
    categoryChip: { marginTop: 6, alignSelf: 'flex-start' },
    actions: { flexDirection: 'row', gap: 10, marginTop: 14, justifyContent: 'flex-end' },
    actionBtn: { borderRadius: 20 },
    statusTag: { alignSelf: 'flex-end', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, marginTop: 10 },
});
