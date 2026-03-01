import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CategoryChipProps {
    name: string;
    icon: string;
    color: string;
    selected?: boolean;
    onPress: () => void;
}

export function CategoryChip({ name, icon, color, selected, onPress }: CategoryChipProps) {
    const theme = useTheme();

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.chip,
                {
                    backgroundColor: selected ? color : theme.colors.surfaceVariant,
                    opacity: pressed ? 0.8 : 1,
                    borderColor: selected ? color : 'transparent',
                },
            ]}
        >
            <MaterialCommunityIcons
                name={icon as any}
                size={20}
                color={selected ? '#FFFFFF' : color}
            />
            <Text
                variant="labelMedium"
                style={[
                    styles.label,
                    { color: selected ? '#FFFFFF' : theme.colors.onSurfaceVariant },
                ]}
            >
                {name}
            </Text>
        </Pressable>
    );
}

interface CategoryIconButtonProps {
    name: string;
    icon: string;
    color: string;
    onPress: () => void;
}

export function CategoryIconButton({ name, icon, color, onPress }: CategoryIconButtonProps) {
    const theme = useTheme();

    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.iconButton, { opacity: pressed ? 0.7 : 1 }]}>
            <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
                <MaterialCommunityIcons name={icon as any} size={28} color={color} />
            </View>
            <Text
                variant="labelSmall"
                numberOfLines={1}
                style={[styles.iconLabel, { color: theme.colors.onSurface }]}
            >
                {name}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1.5,
        marginRight: 8,
    },
    label: {
        fontWeight: '500',
    },
    iconButton: {
        alignItems: 'center',
        width: 72,
        marginHorizontal: 4,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    iconLabel: {
        textAlign: 'center',
        fontWeight: '500',
    },
});
