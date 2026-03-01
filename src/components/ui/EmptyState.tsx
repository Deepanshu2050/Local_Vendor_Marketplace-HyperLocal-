import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
                <MaterialCommunityIcons
                    name={icon as any}
                    size={48}
                    color={theme.colors.primary}
                />
            </View>
            <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
                {title}
            </Text>
            <Text variant="bodyMedium" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
                {description}
            </Text>
            {actionLabel && onAction && (
                <Button mode="contained" onPress={onAction} style={styles.button}>
                    {actionLabel}
                </Button>
            )}
        </View>
    );
}

export function OfflineState({ onRetry }: { onRetry?: () => void }) {
    return (
        <EmptyState
            icon="wifi-off"
            title="You're Offline"
            description="Check your internet connection and try again."
            actionLabel="Retry"
            onAction={onRetry}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingVertical: 48,
    },
    iconContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: '600',
    },
    description: {
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    button: {
        borderRadius: 24,
        paddingHorizontal: 8,
    },
});
