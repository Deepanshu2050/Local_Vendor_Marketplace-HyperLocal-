import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text, Avatar, Surface, Badge, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { getRelativeTime, getInitials } from '../../src/utils';
import { spacing } from '../../src/theme';
import { ChatThread } from '../../src/types';

const MOCK_THREADS: ChatThread[] = [
    {
        _id: 't1',
        participant: { _id: 'u1', name: 'QuickFix Plumbing', email: '', phone: '', role: 'vendor', createdAt: '', updatedAt: '' },
        lastMessage: { _id: 'm1', senderId: 'u1', receiverId: 'demo_user_1', content: 'Sure, I can visit tomorrow at 10 AM. Does that work?', read: false, createdAt: '2026-03-01T17:30:00Z' },
        unreadCount: 2,
    },
    {
        _id: 't2',
        participant: { _id: 'u3', name: 'HomeChef Tiffin', email: '', phone: '', role: 'vendor', createdAt: '', updatedAt: '' },
        lastMessage: { _id: 'm2', senderId: 'demo_user_1', receiverId: 'u3', content: 'Can I get the monthly plan without onions?', read: true, createdAt: '2026-03-01T15:00:00Z' },
        unreadCount: 0,
    },
    {
        _id: 't3',
        participant: { _id: 'u5', name: 'SmartTutor Academy', email: '', phone: '', role: 'vendor', createdAt: '', updatedAt: '' },
        lastMessage: { _id: 'm3', senderId: 'u5', receiverId: 'demo_user_1', content: 'Great progress in today\'s session! Keep practicing the formulas.', read: true, createdAt: '2026-02-28T18:45:00Z' },
        unreadCount: 0,
    },
];

export default function ChatListScreen() {
    const theme = useTheme();
    const router = useRouter();

    const renderThread = ({ item }: { item: ChatThread }) => (
        <Pressable onPress={() => router.push(`/chat/${item.participant._id}`)}>
            <Surface style={[styles.threadCard, { backgroundColor: theme.colors.surface }]} elevation={0}>
                <Avatar.Text
                    size={50}
                    label={getInitials(item.participant.name)}
                    style={{ backgroundColor: theme.colors.primaryContainer }}
                    labelStyle={{ color: theme.colors.onPrimaryContainer }}
                />
                <View style={styles.threadContent}>
                    <View style={styles.threadHeader}>
                        <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600', flex: 1 }}>
                            {item.participant.name}
                        </Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            {getRelativeTime(item.lastMessage.createdAt)}
                        </Text>
                    </View>
                    <View style={styles.threadPreview}>
                        <Text
                            variant="bodySmall"
                            numberOfLines={1}
                            style={{
                                color: item.unreadCount > 0 ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
                                fontWeight: item.unreadCount > 0 ? '600' : '400',
                                flex: 1,
                            }}
                        >
                            {item.lastMessage.senderId === 'demo_user_1' ? 'You: ' : ''}{item.lastMessage.content}
                        </Text>
                        {item.unreadCount > 0 && (
                            <Badge size={20} style={{ backgroundColor: theme.colors.primary }}>
                                {item.unreadCount}
                            </Badge>
                        )}
                    </View>
                </View>
            </Surface>
        </Pressable>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
                Messages
            </Text>

            <FlatList
                data={MOCK_THREADS}
                keyExtractor={(item) => item._id}
                renderItem={renderThread}
                ListEmptyComponent={
                    <EmptyState
                        icon="chat-outline"
                        title="No Messages"
                        description="Start a conversation with a vendor after booking a service."
                    />
                }
                ItemSeparatorComponent={() => (
                    <View style={[styles.separator, { backgroundColor: theme.colors.outlineVariant }]} />
                )}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    title: { fontWeight: '700', paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.sm },
    threadCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 14, gap: 14 },
    threadContent: { flex: 1 },
    threadHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    threadPreview: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    separator: { height: 0.5, marginLeft: 80 },
    listContent: { paddingBottom: 20 },
});
