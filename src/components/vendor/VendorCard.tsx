import React from 'react';
import { View, StyleSheet, Pressable, Image } from 'react-native';
import { Text, Surface, Badge, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { VendorProfile } from '../../types';
import { RatingStars } from '../ui/RatingStars';
import { formatDistance, formatPrice } from '../../utils';
import { appColors } from '../../theme';

interface VendorCardProps {
    vendor: VendorProfile;
    onPress: () => void;
}

export function VendorCard({ vendor, onPress }: VendorCardProps) {
    const theme = useTheme();

    return (
        <Pressable onPress={onPress}>
            <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
                {/* Cover Image */}
                <View style={styles.imageContainer}>
                    {vendor.coverImage ? (
                        <Image source={{ uri: vendor.coverImage }} style={styles.coverImage} />
                    ) : (
                        <View style={[styles.coverPlaceholder, { backgroundColor: theme.colors.primaryContainer }]}>
                            <MaterialCommunityIcons name="store" size={40} color={theme.colors.primary} />
                        </View>
                    )}
                    {vendor.verified === 'approved' && (
                        <View style={[styles.verifiedBadge, { backgroundColor: appColors.verified }]}>
                            <MaterialCommunityIcons name="check-decagram" size={14} color="#FFF" />
                            <Text variant="labelSmall" style={styles.verifiedText}>Verified</Text>
                        </View>
                    )}
                    {vendor.distance !== undefined && (
                        <View style={[styles.distanceBadge, { backgroundColor: theme.colors.surface }]}>
                            <MaterialCommunityIcons name="map-marker" size={14} color={theme.colors.primary} />
                            <Text variant="labelSmall" style={{ color: theme.colors.onSurface }}>
                                {formatDistance(vendor.distance)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text variant="titleMedium" numberOfLines={1} style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                        {vendor.businessName}
                    </Text>

                    <View style={styles.categoriesRow}>
                        {vendor.categories.slice(0, 3).map((cat, i) => (
                            <View key={i} style={[styles.categoryTag, { backgroundColor: theme.colors.secondaryContainer }]}>
                                <Text variant="labelSmall" style={{ color: theme.colors.onSecondaryContainer }}>
                                    {cat}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.bottomRow}>
                        <RatingStars rating={vendor.averageRating} size={14} totalReviews={vendor.totalReviews} />
                        {vendor.services.length > 0 && (
                            <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '600' }}>
                                From {formatPrice(Math.min(...vendor.services.map((s) => s.price)))}
                            </Text>
                        )}
                    </View>
                </View>
            </Surface>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
    },
    imageContainer: {
        height: 140,
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    coverPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    verifiedBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    verifiedText: {
        color: '#FFF',
        fontWeight: '600',
    },
    distanceBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 2,
        elevation: 2,
    },
    content: {
        padding: 14,
        gap: 6,
    },
    categoriesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    categoryTag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
});
