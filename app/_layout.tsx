import { useEffect, useState, useCallback } from 'react';
import { useColorScheme, View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { lightTheme, darkTheme } from '../src/theme';
import { useAuthStore } from '../src/store/authStore';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 2,
            refetchOnWindowFocus: false,
        },
    },
});

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [isDark, setIsDark] = useState(colorScheme === 'dark');
    const theme = isDark ? darkTheme : lightTheme;
    const hydrate = useAuthStore((s) => s.hydrate);
    const isLoading = useAuthStore((s) => s.isLoading);

    useEffect(() => {
        setIsDark(colorScheme === 'dark');
    }, [colorScheme]);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    const onLayoutRootView = useCallback(async () => {
        if (!isLoading) {
            await SplashScreen.hideAsync();
        }
    }, [isLoading]);

    if (isLoading) {
        return (
            <View style={[styles.loading, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={styles.container} onLayout={onLayoutRootView}>
            <SafeAreaProvider>
                <QueryClientProvider client={queryClient}>
                    <PaperProvider theme={theme}>
                        <StatusBar style={isDark ? 'light' : 'dark'} />
                        <Stack
                            screenOptions={{
                                headerShown: false,
                                animation: 'slide_from_right',
                                contentStyle: { backgroundColor: theme.colors.background },
                            }}
                        >
                            <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
                            <Stack.Screen name="(auth)" options={{ animation: 'slide_from_bottom' }} />
                            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
                            <Stack.Screen name="vendor/[id]" />
                            <Stack.Screen name="vendor/book/[id]" />
                            <Stack.Screen name="chat/[id]" />
                            <Stack.Screen name="vendor-dashboard" />
                            <Stack.Screen name="admin" />
                        </Stack>
                    </PaperProvider>
                </QueryClientProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
