import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { appColors } from '../../theme';

interface RatingStarsProps {
    rating: number;
    size?: number;
    showValue?: boolean;
    totalReviews?: number;
}

export function RatingStars({ rating, size = 16, showValue = true, totalReviews }: RatingStarsProps) {
    const theme = useTheme();
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
        <View style={styles.container}>
            {Array.from({ length: fullStars }).map((_, i) => (
                <MaterialCommunityIcons key={`full-${i}`} name="star" size={size} color={appColors.star} />
            ))}
            {hasHalf && <MaterialCommunityIcons name="star-half-full" size={size} color={appColors.star} />}
            {Array.from({ length: emptyStars }).map((_, i) => (
                <MaterialCommunityIcons key={`empty-${i}`} name="star-outline" size={size} color={appColors.star} />
            ))}
            {showValue && (
                <Text variant="labelMedium" style={[styles.value, { color: theme.colors.onSurfaceVariant }]}>
                    {rating.toFixed(1)}
                </Text>
            )}
            {totalReviews !== undefined && (
                <Text variant="labelSmall" style={[styles.reviews, { color: theme.colors.onSurfaceVariant }]}>
                    ({totalReviews})
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    value: {
        marginLeft: 4,
        fontWeight: '600',
    },
    reviews: {
        marginLeft: 2,
    },
});
