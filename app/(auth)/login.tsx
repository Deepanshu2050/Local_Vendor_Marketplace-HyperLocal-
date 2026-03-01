import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import { Text, TextInput, Button, useTheme, HelperText } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { authService } from '../../src/services/auth';

export default function LoginScreen() {
    const theme = useTheme();
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    const handleLogin = async () => {
        setError('');
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        if (!isValidEmail(email)) {
            setError('Please enter a valid email');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.login({ email, password });
            await setAuth(response.user, response.token);

            if (response.user.role === 'vendor') {
                router.replace('/vendor-dashboard');
            } else if (response.user.role === 'admin') {
                router.replace('/admin');
            } else {
                router.replace('/(tabs)');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    // Demo login for testing without backend
    const handleDemoLogin = async () => {
        const demoUser = {
            _id: 'demo_user_1',
            name: 'Demo User',
            email: 'demo@localvendor.com',
            phone: '+91 9876543210',
            role: 'customer' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        await setAuth(demoUser, 'demo_token_123');
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
                <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={[styles.logoContainer, { backgroundColor: theme.colors.primaryContainer }]}>
                            <MaterialCommunityIcons name="store-marker" size={48} color={theme.colors.primary} />
                        </View>
                        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
                            Welcome Back
                        </Text>
                        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
                            Sign in to discover local vendors near you
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <TextInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            mode="outlined"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            left={<TextInput.Icon icon="email-outline" />}
                            outlineStyle={styles.inputOutline}
                            style={styles.input}
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
                            style={styles.input}
                        />

                        {error ? (
                            <HelperText type="error" visible={!!error} style={styles.error}>
                                {error}
                            </HelperText>
                        ) : null}

                        <Button
                            mode="contained"
                            onPress={handleLogin}
                            loading={loading}
                            disabled={loading}
                            style={styles.loginButton}
                            contentStyle={styles.loginButtonContent}
                            labelStyle={styles.loginButtonLabel}
                        >
                            Sign In
                        </Button>

                        <Button
                            mode="outlined"
                            onPress={handleDemoLogin}
                            style={styles.demoButton}
                            contentStyle={styles.loginButtonContent}
                        >
                            Try Demo (No Backend)
                        </Button>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                            Don't have an account?
                        </Text>
                        <Pressable onPress={() => router.push('/(auth)/signup')}>
                            <Text variant="labelLarge" style={{ color: theme.colors.primary, marginLeft: 4 }}>
                                Sign Up
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
    scroll: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 },
    header: { alignItems: 'center', marginBottom: 40 },
    logoContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: { fontWeight: '700', marginBottom: 8 },
    form: { gap: 12 },
    input: { backgroundColor: 'transparent' },
    inputOutline: { borderRadius: 14 },
    error: { marginTop: -4 },
    loginButton: { borderRadius: 28, marginTop: 8 },
    loginButtonContent: { paddingVertical: 8 },
    loginButtonLabel: { fontSize: 16, fontWeight: '600' },
    demoButton: { borderRadius: 28 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
});
