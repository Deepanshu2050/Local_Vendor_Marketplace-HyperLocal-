import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { Text, TextInput, Button, useTheme, HelperText, SegmentedButtons } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { authService } from '../../src/services/auth';
import { UserRole } from '../../src/types';

export default function SignupScreen() {
    const theme = useTheme();
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<UserRole>('customer');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    const handleSignup = async () => {
        setError('');

        if (!name || !email || !phone || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        if (!isValidEmail(email)) {
            setError('Please enter a valid email');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.register({ name, email, password, phone, role });
            await setAuth(response.user, response.token);

            if (response.user.role === 'vendor') {
                router.replace('/vendor-dashboard');
            } else {
                router.replace('/(tabs)');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                    {/* Header */}
                    <View style={styles.header}>
                        <Pressable onPress={() => router.back()} style={styles.backButton}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.onSurface} />
                        </Pressable>
                        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
                            Create Account
                        </Text>
                        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
                            Join the local vendor community
                        </Text>
                    </View>

                    {/* Role Selection */}
                    <View style={styles.roleSection}>
                        <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
                            I am a
                        </Text>
                        <SegmentedButtons
                            value={role}
                            onValueChange={(v) => setRole(v as UserRole)}
                            buttons={[
                                {
                                    value: 'customer',
                                    label: 'Customer',
                                    icon: 'account',
                                },
                                {
                                    value: 'vendor',
                                    label: 'Vendor',
                                    icon: 'store',
                                },
                            ]}
                            style={styles.segmented}
                        />
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <TextInput
                            label="Full Name"
                            value={name}
                            onChangeText={setName}
                            mode="outlined"
                            left={<TextInput.Icon icon="account-outline" />}
                            outlineStyle={styles.inputOutline}
                        />

                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            mode="outlined"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            left={<TextInput.Icon icon="email-outline" />}
                            outlineStyle={styles.inputOutline}
                        />

                        <TextInput
                            label="Phone Number"
                            value={phone}
                            onChangeText={setPhone}
                            mode="outlined"
                            keyboardType="phone-pad"
                            left={<TextInput.Icon icon="phone-outline" />}
                            outlineStyle={styles.inputOutline}
                        />

                        <TextInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            mode="outlined"
                            secureTextEntry={!showPassword}
                            left={<TextInput.Icon icon="lock-outline" />}
                            right={
                                <TextInput.Icon
                                    icon={showPassword ? 'eye-off' : 'eye'}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            }
                            outlineStyle={styles.inputOutline}
                        />

                        <TextInput
                            label="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            mode="outlined"
                            secureTextEntry={!showPassword}
                            left={<TextInput.Icon icon="lock-check-outline" />}
                            outlineStyle={styles.inputOutline}
                        />

                        {error ? (
                            <HelperText type="error" visible={!!error}>
                                {error}
                            </HelperText>
                        ) : null}

                        <Button
                            mode="contained"
                            onPress={handleSignup}
                            loading={loading}
                            disabled={loading}
                            style={styles.signupButton}
                            contentStyle={styles.buttonContent}
                            labelStyle={styles.buttonLabel}
                        >
                            {role === 'vendor' ? 'Register as Vendor' : 'Create Account'}
                        </Button>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                            Already have an account?
                        </Text>
                        <Pressable onPress={() => router.back()}>
                            <Text variant="labelLarge" style={{ color: theme.colors.primary, marginLeft: 4 }}>
                                Sign In
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    flex: { flex: 1 },
    scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16 },
    header: { marginBottom: 24 },
    backButton: { marginBottom: 16 },
    title: { fontWeight: '700', marginBottom: 4 },
    roleSection: { marginBottom: 20 },
    segmented: { borderRadius: 16 },
    form: { gap: 12 },
    inputOutline: { borderRadius: 14 },
    signupButton: { borderRadius: 28, marginTop: 8 },
    buttonContent: { paddingVertical: 8 },
    buttonLabel: { fontSize: 16, fontWeight: '600' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, paddingBottom: 16 },
});
