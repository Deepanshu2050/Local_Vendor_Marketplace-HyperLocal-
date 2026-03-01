import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Surface, Button, TextInput, FAB, Portal, Modal, useTheme, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatPrice } from '../../src/utils';
import { spacing } from '../../src/theme';
import { Service } from '../../src/types';

const INITIAL_SERVICES: Service[] = [
    { _id: 's1', vendorId: '1', name: 'Pipe Repair', description: 'Fix leaky or burst pipes', price: 350, duration: 60, category: 'Plumber', isActive: true, createdAt: '' },
    { _id: 's2', vendorId: '1', name: 'Drain Cleaning', description: 'Unclog blocked drains', price: 250, duration: 45, category: 'Plumber', isActive: true, createdAt: '' },
    { _id: 's3', vendorId: '1', name: 'Full Bathroom Fitting', description: 'Complete bathroom plumbing setup', price: 5000, duration: 480, category: 'Plumber', isActive: true, createdAt: '' },
];

export default function ServicesScreen() {
    const theme = useTheme();
    const router = useRouter();
    const [services, setServices] = useState(INITIAL_SERVICES);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');

    const openAdd = () => {
        setEditingService(null);
        setName('');
        setDescription('');
        setPrice('');
        setDuration('');
        setModalVisible(true);
    };

    const openEdit = (s: Service) => {
        setEditingService(s);
        setName(s.name);
        setDescription(s.description);
        setPrice(s.price.toString());
        setDuration(s.duration.toString());
        setModalVisible(true);
    };

    const handleSave = () => {
        if (!name || !price) return;
        if (editingService) {
            setServices((prev) => prev.map((s) =>
                s._id === editingService._id ? { ...s, name, description, price: Number(price), duration: Number(duration) || 60 } : s
            ));
        } else {
            const newService: Service = {
                _id: `s${Date.now()}`, vendorId: '1', name, description, price: Number(price),
                duration: Number(duration) || 60, category: 'Plumber', isActive: true, createdAt: new Date().toISOString(),
            };
            setServices((prev) => [...prev, newService]);
        }
        setModalVisible(false);
    };

    const handleDelete = (id: string) => {
        setServices((prev) => prev.filter((s) => s._id !== id));
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => router.back()} iconColor={theme.colors.onSurface} />
                <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '600', flex: 1 }}>
                    My Services
                </Text>
            </View>

            <FlatList
                data={services}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Surface style={[styles.serviceCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
                        <View style={styles.serviceRow}>
                            <View style={{ flex: 1 }}>
                                <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>{item.name}</Text>
                                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 2 }}>{item.description}</Text>
                                <View style={styles.meta}>
                                    <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>{formatPrice(item.price)}</Text>
                                    <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}> • {item.duration} min</Text>
                                </View>
                            </View>
                            <View style={styles.actions}>
                                <IconButton icon="pencil" size={20} onPress={() => openEdit(item)} iconColor={theme.colors.primary} />
                                <IconButton icon="delete-outline" size={20} onPress={() => handleDelete(item._id)} iconColor={theme.colors.error} />
                            </View>
                        </View>
                    </Surface>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="briefcase-plus" size={48} color={theme.colors.onSurfaceVariant} />
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                            No services yet. Add your first service!
                        </Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                onPress={openAdd}
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
            />

            <Portal>
                <Modal
                    visible={modalVisible}
                    onDismiss={() => setModalVisible(false)}
                    contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
                >
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginBottom: 16 }}>
                        {editingService ? 'Edit Service' : 'Add Service'}
                    </Text>
                    <TextInput label="Service Name" value={name} onChangeText={setName} mode="outlined" outlineStyle={styles.inputOutline} style={styles.input} />
                    <TextInput label="Description" value={description} onChangeText={setDescription} mode="outlined" multiline outlineStyle={styles.inputOutline} style={styles.input} />
                    <View style={styles.inputRow}>
                        <TextInput label="Price (₹)" value={price} onChangeText={setPrice} mode="outlined" keyboardType="numeric" outlineStyle={styles.inputOutline} style={[styles.input, { flex: 1 }]} />
                        <TextInput label="Duration (min)" value={duration} onChangeText={setDuration} mode="outlined" keyboardType="numeric" outlineStyle={styles.inputOutline} style={[styles.input, { flex: 1 }]} />
                    </View>
                    <View style={styles.modalActions}>
                        <Button mode="text" onPress={() => setModalVisible(false)}>Cancel</Button>
                        <Button mode="contained" onPress={handleSave} style={{ borderRadius: 20 }}>{editingService ? 'Update' : 'Add'}</Button>
                    </View>
                </Modal>
            </Portal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center' },
    list: { padding: spacing.md, paddingBottom: 100 },
    serviceCard: { borderRadius: 16, padding: 16, marginBottom: 12 },
    serviceRow: { flexDirection: 'row', alignItems: 'flex-start' },
    meta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
    actions: { flexDirection: 'row' },
    emptyContainer: { alignItems: 'center', paddingTop: 80 },
    fab: { position: 'absolute', bottom: 24, right: 24, borderRadius: 28 },
    modal: { margin: 20, padding: 24, borderRadius: 24 },
    input: { marginBottom: 12, backgroundColor: 'transparent' },
    inputOutline: { borderRadius: 14 },
    inputRow: { flexDirection: 'row', gap: 12 },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
});
