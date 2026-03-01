import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { Text, TextInput, Avatar, useTheme, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getInitials, getRelativeTime } from '../../src/utils';
import { spacing } from '../../src/theme';
import { ChatMessage } from '../../src/types';

const MOCK_MESSAGES: ChatMessage[] = [
    { _id: 'm1', senderId: 'u1', receiverId: 'demo_user_1', content: 'Hi! How can I help you today?', read: true, createdAt: '2026-03-01T15:00:00Z' },
    { _id: 'm2', senderId: 'demo_user_1', receiverId: 'u1', content: 'I need someone to fix a pipe leak in my kitchen.', read: true, createdAt: '2026-03-01T15:02:00Z' },
    { _id: 'm3', senderId: 'u1', receiverId: 'demo_user_1', content: 'Sure! Can you describe the issue? Is it a constant drip or a burst pipe?', read: true, createdAt: '2026-03-01T15:03:00Z' },
    { _id: 'm4', senderId: 'demo_user_1', receiverId: 'u1', content: 'It\'s a slow drip from the faucet joint. Getting worse over the past week.', read: true, createdAt: '2026-03-01T15:05:00Z' },
    { _id: 'm5', senderId: 'u1', receiverId: 'demo_user_1', content: 'Got it. That sounds like a gasket issue. I can fix that easily. Would tomorrow 10 AM work for you?', read: true, createdAt: '2026-03-01T17:00:00Z' },
    { _id: 'm6', senderId: 'demo_user_1', receiverId: 'u1', content: 'Yes, 10 AM works perfectly!', read: true, createdAt: '2026-03-01T17:05:00Z' },
    { _id: 'm7', senderId: 'u1', receiverId: 'demo_user_1', content: 'Sure, I can visit tomorrow at 10 AM. Does that work?', read: false, createdAt: '2026-03-01T17:30:00Z' },
];

export default function ChatScreen() {
    const theme = useTheme();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const currentUserId = 'demo_user_1';
    const participantName = 'QuickFix Plumbing';

    const sendMessage = () => {
        if (!inputText.trim()) return;
        const newMsg: ChatMessage = {
            _id: `m${Date.now()}`,
            senderId: currentUserId,
            receiverId: id!,
            content: inputText.trim(),
            read: false,
            createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMsg]);
        setInputText('');

        // Simulate reply
        setTimeout(() => {
            const reply: ChatMessage = {
                _id: `m${Date.now() + 1}`,
                senderId: id!,
                receiverId: currentUserId,
                content: 'Thanks for your message! I\'ll get back to you shortly.',
                read: false,
                createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, reply]);
        }, 2000);
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        const isMe = item.senderId === currentUserId;
        return (
            <View style={[styles.messageBubbleRow, isMe ? styles.myRow : styles.theirRow]}>
                <View
                    style={[
                        styles.bubble,
                        isMe
                            ? [styles.myBubble, { backgroundColor: theme.colors.primary }]
                            : [styles.theirBubble, { backgroundColor: theme.colors.surfaceVariant }],
                    ]}
                >
                    <Text
                        variant="bodyMedium"
                        style={{ color: isMe ? theme.colors.onPrimary : theme.colors.onSurface }}
                    >
                        {item.content}
                    </Text>
                    <Text
                        variant="labelSmall"
                        style={[
                            styles.timestamp,
                            { color: isMe ? theme.colors.onPrimary + '99' : theme.colors.onSurfaceVariant },
                        ]}
                    >
                        {getRelativeTime(item.createdAt)}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            {/* Chat Header */}
            <View style={[styles.header, { borderBottomColor: theme.colors.outlineVariant }]}>
                <IconButton icon="arrow-left" onPress={() => router.back()} iconColor={theme.colors.onSurface} />
                <Avatar.Text
                    size={36}
                    label={getInitials(participantName)}
                    style={{ backgroundColor: theme.colors.primaryContainer }}
                    labelStyle={{ color: theme.colors.onPrimaryContainer, fontSize: 14 }}
                />
                <View style={styles.headerInfo}>
                    <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                        {participantName}
                    </Text>
                    <Text variant="labelSmall" style={{ color: theme.colors.primary }}>Online</Text>
                </View>
                <IconButton icon="phone" onPress={() => { }} iconColor={theme.colors.primary} />
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={renderMessage}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                showsVerticalScrollIndicator={false}
            />

            {/* Input Bar */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={[styles.inputBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outlineVariant }]}>
                    <TextInput
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Type a message..."
                        mode="outlined"
                        style={styles.textInput}
                        outlineStyle={styles.inputOutline}
                        dense
                        right={
                            <TextInput.Icon
                                icon="send"
                                color={inputText.trim() ? theme.colors.primary : theme.colors.onSurfaceVariant}
                                onPress={sendMessage}
                            />
                        }
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingRight: 4, borderBottomWidth: 0.5, gap: 8 },
    headerInfo: { flex: 1 },
    messagesList: { padding: spacing.md, paddingBottom: 8 },
    messageBubbleRow: { marginBottom: 10 },
    myRow: { alignItems: 'flex-end' },
    theirRow: { alignItems: 'flex-start' },
    bubble: { maxWidth: '78%', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
    myBubble: { borderBottomRightRadius: 6 },
    theirBubble: { borderBottomLeftRadius: 6 },
    timestamp: { marginTop: 4, alignSelf: 'flex-end', fontSize: 10 },
    inputBar: { flexDirection: 'row', padding: spacing.sm, paddingBottom: Platform.OS === 'ios' ? spacing.md : spacing.sm, borderTopWidth: 0.5 },
    textInput: { flex: 1, backgroundColor: 'transparent', maxHeight: 100 },
    inputOutline: { borderRadius: 24 },
});
