import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Booking } from '../../types';
import { formatDate, formatTime, formatPrice } from '../../utils';
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_COLORS } from '../../constants';

interface BookingCardProps {
    booking: Booking;
    onPress: () => void;
    showActions?: boolean;
    onAccept?: () => void;
    onReject?: () => void;
}

export function BookingCard({ booking, onPress, showActions, onAccept, onReject }: BookingCardProps) {
    const theme = useTheme();
    const statusColor = BOOKING_STATUS_COLORS[booking.status];
    const statusLabel = BOOKING_STATUS_LABELS[booking.status];

    return (
        <Pressable onPress={onPress}>
            <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
                <View style={styles.header}>
                    <View style={styles.serviceInfo}>
                        <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                            {booking.service?.name || 'Service'}
                        </Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            {booking.vendor?.businessName || 'Vendor'}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                        <Text variant="labelSmall" style={{ color: statusColor, fontWeight: '600' }}>
                            {statusLabel}
                        </Text>
                    </View>
                </View>

                <View style={styles.details}>
                    <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="calendar" size={16} color={theme.colors.onSurfaceVariant} />
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 6 }}>
                            {formatDate(booking.scheduledDate)}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.onSurfaceVariant} />
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 6 }}>
                            {formatTime(booking.scheduledTime)}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <MaterialCommunityIcons name="currency-inr" size={16} color={theme.colors.primary} />
                        <Text variant="labelMedium" style={{ color: theme.colors.primary, fontWeight: '600', marginLeft: 4 }}>
                            {formatPrice(booking.totalAmount)}
                        </Text>
                    </View>
                </View>

                {showActions && booking.status === 'pending' && (
                    <View style={styles.actions}>
                        <Pressable
                            onPress={onReject}
                            style={[styles.actionBtn, { backgroundColor: theme.colors.errorContainer }]}
                        >
                            <MaterialCommunityIcons name="close" size={18} color={theme.colors.error} />
                            <Text variant="labelMedium" style={{ color: theme.colors.error }}>Decline</Text>
                        </Pressable>
                        <Pressable
                            onPress={onAccept}
                            style={[styles.actionBtn, { backgroundColor: theme.colors.primaryContainer }]}
                        >
                            <MaterialCommunityIcons name="check" size={18} color={theme.colors.primary} />
                            <Text variant="labelMedium" style={{ color: theme.colors.primary }}>Accept</Text>
                        </Pressable>
                    </View>
                )}
            </Surface>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    serviceInfo: {
        flex: 1,
        gap: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    details: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.06)',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.06)',
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
});
