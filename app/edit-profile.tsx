import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, useTheme, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/store/authStore';
import { authService } from '../src/services/auth';
import { spacing } from '../src/theme';

export default function EditProfileScreen() {
    const theme = useTheme();
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const updateUser = useAuthStore((s) => s.updateUser);

    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [address, setAddress] = useState(user?.address || '');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState('');

    const handleSave = async () => {
        if (!name.trim()) { Alert.alert('Error', 'Name is required'); return; }
        if (!phone.trim()) { Alert.alert('Error', 'Phone is required'); return; }

        setLoading(true);
        try {
            const updates = { name: name.trim(), phone: phone.trim(), address: address.trim() };
            await authService.updateProfile(updates);
            updateUser(updates);
            setSnackbar('Profile updated successfully!');
            setTimeout(() => router.back(), 1000);
        } catch (err: any) {
            Alert.alert('Error', err?.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text variant="headlineSmall" style={[styles.header, { color: theme.colors.onSurface }]}>
                    Edit Profile
                </Text>

                <TextInput
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={styles.input}
                    left={<TextInput.Icon icon="account" />}
                />

                <TextInput
                    label="Email"
                    value={user?.email || ''}
                    mode="outlined"
                    disabled
                    style={styles.input}
                    left={<TextInput.Icon icon="email" />}
                />

                <TextInput
                    label="Phone"
                    value={phone}
                    onChangeText={setPhone}
                    mode="outlined"
                    keyboardType="phone-pad"
                    style={styles.input}
                    left={<TextInput.Icon icon="phone" />}
                />

                <TextInput
                    label="Address"
                    value={address}
                    onChangeText={setAddress}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    style={styles.input}
                    left={<TextInput.Icon icon="map-marker" />}
                />

                <View style={styles.roleBadge}>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                        Role: <Text style={{ fontWeight: '700', color: theme.colors.primary }}>{user?.role || 'customer'}</Text>
                    </Text>
                </View>

                <Button
                    mode="contained"
                    onPress={handleSave}
                    loading={loading}
                    disabled={loading}
                    style={styles.saveButton}
                    contentStyle={{ paddingVertical: 6 }}
                >
                    Save Changes
                </Button>

                <Button mode="outlined" onPress={() => router.back()} style={styles.cancelButton}>
                    Cancel
                </Button>
            </ScrollView>

            <Snackbar visible={!!snackbar} onDismiss={() => setSnackbar('')} duration={2000}>
                {snackbar}
            </Snackbar>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: spacing.md },
    header: { fontWeight: '700', marginBottom: spacing.lg },
    input: { marginBottom: spacing.md },
    roleBadge: { marginBottom: spacing.lg, paddingHorizontal: 4 },
    saveButton: { borderRadius: 12, marginBottom: spacing.sm },
    cancelButton: { borderRadius: 12 },
});
