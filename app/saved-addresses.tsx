import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, TextInput, Button, Surface, useTheme, IconButton, Portal, Modal, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { spacing } from '../src/theme';

interface Address {
    id: string;
    label: string;
    address: string;
    isDefault: boolean;
}

const STORAGE_KEY = 'saved_addresses';

export default function SavedAddressesScreen() {
    const theme = useTheme();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [label, setLabel] = useState('');
    const [address, setAddress] = useState('');
    const [snackbar, setSnackbar] = useState('');
    const [loaded, setLoaded] = useState(false);

    // Load addresses from AsyncStorage
    React.useEffect(() => {
        const load = async () => {
            try {
                const data = await AsyncStorage.getItem(STORAGE_KEY);
                if (data) setAddresses(JSON.parse(data));
            } catch { }
            setLoaded(true);
        };
        load();
    }, []);

    const save = async (updated: Address[]) => {
        setAddresses(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleAdd = () => {
        setEditingId(null);
        setLabel('');
        setAddress('');
        setModalVisible(true);
    };

    const handleEdit = (item: Address) => {
        setEditingId(item.id);
        setLabel(item.label);
        setAddress(item.address);
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!label.trim() || !address.trim()) {
            Alert.alert('Error', 'Both label and address are required');
            return;
        }

        let updated: Address[];
        if (editingId) {
            updated = addresses.map((a) => a.id === editingId ? { ...a, label: label.trim(), address: address.trim() } : a);
            setSnackbar('Address updated');
        } else {
            const newAddr: Address = {
                id: Date.now().toString(),
                label: label.trim(),
                address: address.trim(),
                isDefault: addresses.length === 0,
            };
            updated = [...addresses, newAddr];
            setSnackbar('Address added');
        }

        await save(updated);
        setModalVisible(false);
    };

    const handleDelete = (id: string) => {
        Alert.alert('Delete Address', 'Are you sure?', [
            { text: 'Cancel' },
            {
                text: 'Delete', style: 'destructive',
                onPress: async () => {
                    const updated = addresses.filter((a) => a.id !== id);
                    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
                        updated[0].isDefault = true;
                    }
                    await save(updated);
                    setSnackbar('Address removed');
                },
            },
        ]);
    };

    const handleSetDefault = async (id: string) => {
        const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
        await save(updated);
        setSnackbar('Default address updated');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.headerRow}>
                <Text variant="headlineSmall" style={{ fontWeight: '700', color: theme.colors.onSurface, flex: 1 }}>
                    Saved Addresses
                </Text>
                <Button mode="contained-tonal" icon="plus" onPress={handleAdd} compact style={{ borderRadius: 12 }}>
                    Add
                </Button>
            </View>

            <FlatList
                data={addresses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
                        <View style={styles.cardRow}>
                            <MaterialCommunityIcons
                                name={item.isDefault ? 'map-marker-check' : 'map-marker-outline'}
                                size={24}
                                color={item.isDefault ? theme.colors.primary : theme.colors.onSurfaceVariant}
                            />
                            <View style={styles.cardInfo}>
                                <View style={styles.labelRow}>
                                    <Text variant="titleSmall" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
                                        {item.label}
                                    </Text>
                                    {item.isDefault && (
                                        <View style={[styles.defaultBadge, { backgroundColor: theme.colors.primaryContainer }]}>
                                            <Text variant="labelSmall" style={{ color: theme.colors.primary, fontWeight: '600' }}>Default</Text>
                                        </View>
                                    )}
                                </View>
                                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>
                                    {item.address}
                                </Text>
                            </View>
                            <View style={styles.actions}>
                                {!item.isDefault && (
                                    <IconButton icon="check-circle-outline" size={20} onPress={() => handleSetDefault(item.id)} />
                                )}
                                <IconButton icon="pencil" size={20} onPress={() => handleEdit(item)} />
                                <IconButton icon="delete-outline" size={20} iconColor={theme.colors.error} onPress={() => handleDelete(item.id)} />
                            </View>
                        </View>
                    </Surface>
                )}
                ListEmptyComponent={
                    loaded ? (
                        <View style={styles.empty}>
                            <MaterialCommunityIcons name="map-marker-off" size={48} color={theme.colors.onSurfaceVariant} />
                            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: 12 }}>
                                No saved addresses yet
                            </Text>
                            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                                Tap "Add" to save your first address
                            </Text>
                        </View>
                    ) : null
                }
                contentContainerStyle={styles.list}
            />

            {/* Add/Edit Modal */}
            <Portal>
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}>
                    <Text variant="titleLarge" style={{ fontWeight: '700', color: theme.colors.onSurface, marginBottom: spacing.md }}>
                        {editingId ? 'Edit Address' : 'Add Address'}
                    </Text>
                    <TextInput
                        label="Label (e.g. Home, Office)"
                        value={label}
                        onChangeText={setLabel}
                        mode="outlined"
                        style={{ marginBottom: spacing.sm }}
                    />
                    <TextInput
                        label="Full Address"
                        value={address}
                        onChangeText={setAddress}
                        mode="outlined"
                        multiline
                        numberOfLines={3}
                        style={{ marginBottom: spacing.md }}
                    />
                    <Button mode="contained" onPress={handleSave} style={{ borderRadius: 12 }}>
                        {editingId ? 'Update' : 'Save'}
                    </Button>
                </Modal>
            </Portal>

            <Snackbar visible={!!snackbar} onDismiss={() => setSnackbar('')} duration={2000}>{snackbar}</Snackbar>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.md },
    list: { paddingHorizontal: spacing.md, paddingBottom: 20 },
    card: { borderRadius: 16, padding: 16, marginBottom: 12 },
    cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    cardInfo: { flex: 1 },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    defaultBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
    actions: { flexDirection: 'row' },
    empty: { alignItems: 'center', marginTop: 80 },
    modal: { margin: 20, padding: 24, borderRadius: 20 },
});
