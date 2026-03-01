import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface SkeletonLoaderProps {
    width: number | string;
    height: number;
    borderRadius?: number;
    style?: ViewStyle;
}

export function SkeletonLoader({ width, height, borderRadius = 8, style }: SkeletonLoaderProps) {
    const theme = useTheme();
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0.7,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return (
        <Animated.View
            style={[
                {
                    width: width as number,
                    height,
                    borderRadius,
                    backgroundColor: theme.colors.surfaceVariant,
                    opacity,
                },
                style,
            ]}
        />
    );
}

export function VendorCardSkeleton() {
    return (
        <View style={skeletonStyles.card}>
            <SkeletonLoader width="100%" height={140} borderRadius={16} />
            <View style={skeletonStyles.content}>
                <SkeletonLoader width="70%" height={20} />
                <SkeletonLoader width="50%" height={14} style={{ marginTop: 8 }} />
                <View style={skeletonStyles.row}>
                    <SkeletonLoader width={80} height={14} />
                    <SkeletonLoader width={60} height={14} />
                </View>
            </View>
        </View>
    );
}

export function BookingCardSkeleton() {
    return (
        <View style={skeletonStyles.bookingCard}>
            <View style={skeletonStyles.row}>
                <SkeletonLoader width={48} height={48} borderRadius={24} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <SkeletonLoader width="60%" height={18} />
                    <SkeletonLoader width="40%" height={14} style={{ marginTop: 6 }} />
                </View>
                <SkeletonLoader width={80} height={28} borderRadius={14} />
            </View>
        </View>
    );
}

const skeletonStyles = StyleSheet.create({
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
    },
    content: {
        padding: 12,
        gap: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    bookingCard: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 16,
    },
});
