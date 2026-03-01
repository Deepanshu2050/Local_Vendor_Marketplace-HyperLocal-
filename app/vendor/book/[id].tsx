import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Text, TextInput, Button, Surface, useTheme, IconButton, Snackbar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../../../src/theme';
import { formatPrice, formatTime, generateTimeSlots } from '../../../src/utils';
import api from '../../../src/services/api';

const DAYS_AHEAD = 7;
const TIME_SLOTS = generateTimeSlots('08:00', '20:00', 60);

function getUpcomingDates(): { date: string; label: string; dayLabel: string }[] {
    const dates = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < DAYS_AHEAD; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        dates.push({
            date: d.toISOString().split('T')[0],
            label: `${d.getDate()} ${monthNames[d.getMonth()]}`,
            dayLabel: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[d.getDay()],
        });
    }
    return dates;
}

export default function BookingScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { id, serviceId: queryServiceId } = useLocalSearchParams<{ id: string; serviceId?: string }>();

    const upcomingDates = getUpcomingDates();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackVisible, setSnackVisible] = useState(false);

    const handleConfirmBooking = async () => {
        if (!selectedDate || !selectedTime || !address) return;

        setLoading(true);
        try {
            await api.post('/bookings', {
                vendorId: id,
                serviceId: queryServiceId || id,
                scheduledDate: selectedDate,
                scheduledTime: selectedTime,
                address: address.trim(),
                notes: notes.trim() || undefined,
                serviceName: 'Service Booking',
            });
            setSnackVisible(true);
            setTimeout(() => {
                router.replace('/(tabs)/bookings');
            }, 1500);
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Booking failed. Please try again.';
            Alert.alert('Booking Error', msg);
        } finally {
            setLoading(false);
        }
    };

    const isValid = selectedDate && selectedTime && address.trim().length > 0;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => router.back()} iconColor={theme.colors.onSurface} />
                <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                    Book Service
                </Text>
                <View style={{ width: 48 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Date Selection */}
                <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Select Date
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesRow}>
                    {upcomingDates.map((d) => (
                        <Pressable
                            key={d.date}
                            onPress={() => setSelectedDate(d.date)}
                            style={[
                                styles.dateChip,
                                {
                                    backgroundColor: selectedDate === d.date ? theme.colors.primary : theme.colors.surfaceVariant,
                                    borderColor: selectedDate === d.date ? theme.colors.primary : 'transparent',
                                },
                            ]}
                        >
                            <Text
                                variant="labelSmall"
                                style={{ color: selectedDate === d.date ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }}
                            >
                                {d.dayLabel}
                            </Text>
                            <Text
                                variant="titleSmall"
                                style={{
                                    color: selectedDate === d.date ? theme.colors.onPrimary : theme.colors.onSurface,
                                    fontWeight: '700',
                                }}
                            >
                                {d.label}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Time Selection */}
                <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Select Time
                </Text>
                <View style={styles.timeSlotsGrid}>
                    {TIME_SLOTS.map((t) => (
                        <Pressable
                            key={t}
                            onPress={() => setSelectedTime(t)}
                            style={[
                                styles.timeChip,
                                {
                                    backgroundColor: selectedTime === t ? theme.colors.primary : theme.colors.surfaceVariant,
                                },
                            ]}
                        >
                            <Text
                                variant="labelMedium"
                                style={{ color: selectedTime === t ? theme.colors.onPrimary : theme.colors.onSurface }}
                            >
                                {formatTime(t)}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Address */}
                <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Service Address
                </Text>
                <TextInput
                    label="Full Address"
                    value={address}
                    onChangeText={setAddress}
                    mode="outlined"
                    multiline
                    numberOfLines={2}
                    left={<TextInput.Icon icon="map-marker-outline" />}
                    outlineStyle={styles.inputOutline}
                />

                {/* Notes */}
                <Text variant="titleSmall" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                    Notes (Optional)
                </Text>
                <TextInput
                    label="Any special instructions..."
                    value={notes}
                    onChangeText={setNotes}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    left={<TextInput.Icon icon="note-text-outline" />}
                    outlineStyle={styles.inputOutline}
                />

                {/* Summary */}
                {isValid && (
                    <Surface style={[styles.summaryCard, { backgroundColor: theme.colors.primaryContainer }]} elevation={0}>
                        <Text variant="titleSmall" style={{ color: theme.colors.onPrimaryContainer, fontWeight: '600', marginBottom: 8 }}>
                            Booking Summary
                        </Text>
                        <View style={styles.summaryRow}>
                            <MaterialCommunityIcons name="calendar" size={16} color={theme.colors.onPrimaryContainer} />
                            <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer, marginLeft: 8 }}>
                                {upcomingDates.find((d) => d.date === selectedDate)?.label} ({upcomingDates.find((d) => d.date === selectedDate)?.dayLabel})
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.onPrimaryContainer} />
                            <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer, marginLeft: 8 }}>
                                {formatTime(selectedTime!)}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <MaterialCommunityIcons name="map-marker" size={16} color={theme.colors.onPrimaryContainer} />
                            <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer, marginLeft: 8 }}>
                                {address}
                            </Text>
                        </View>
                    </Surface>
                )}
            </ScrollView>

            {/* Confirm Button */}
            <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outlineVariant }]}>
                <Button
                    mode="contained"
                    onPress={handleConfirmBooking}
                    loading={loading}
                    disabled={!isValid || loading}
                    style={styles.confirmButton}
                    contentStyle={styles.confirmButtonContent}
                    labelStyle={styles.confirmButtonLabel}
                >
                    Confirm Booking
                </Button>
            </View>

            <Snackbar
                visible={snackVisible}
                onDismiss={() => setSnackVisible(false)}
                duration={1500}
                style={{ backgroundColor: theme.colors.inverseSurface }}
            >
                Booking confirmed successfully!
            </Snackbar>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: spacing.md },
    scrollContent: { padding: spacing.md, paddingBottom: 120 },
    sectionTitle: { fontWeight: '600', marginTop: spacing.md, marginBottom: spacing.sm },
    datesRow: { gap: 10, paddingVertical: 4 },
    dateChip: {
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1.5,
        minWidth: 80,
        gap: 4,
    },
    timeSlotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    timeChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
    },
    inputOutline: { borderRadius: 14 },
    summaryCard: { borderRadius: 16, padding: 16, marginTop: spacing.md },
    summaryRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
    bottomBar: {
        padding: spacing.md,
        borderTopWidth: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    confirmButton: { borderRadius: 28 },
    confirmButtonContent: { paddingVertical: 8 },
    confirmButtonLabel: { fontSize: 16, fontWeight: '600' },
});
