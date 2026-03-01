import React, { useRef, useState } from 'react';
import { View, FlatList, Dimensions, StyleSheet, Animated } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/store/authStore';
import { ONBOARDING_SLIDES } from '../src/constants';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
    const theme = useTheme();
    const router = useRouter();
    const setOnboarded = useAuthStore((s) => s.setOnboarded);
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const handleNext = () => {
        if (currentIndex < ONBOARDING_SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            handleGetStarted();
        }
    };

    const handleGetStarted = async () => {
        await setOnboarded(true);
        router.replace('/(auth)/login');
    };

    const handleSkip = async () => {
        await setOnboarded(true);
        router.replace('/(auth)/login');
    };

    const renderSlide = ({ item }: { item: typeof ONBOARDING_SLIDES[0] }) => (
        <View style={[styles.slide, { width }]}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '18' }]}>
                <MaterialCommunityIcons name={item.icon as any} size={80} color={item.color} />
            </View>
            <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
                {item.title}
            </Text>
            <Text variant="bodyLarge" style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
                {item.description}
            </Text>
        </View>
    );

    const renderDots = () => (
        <View style={styles.dotsContainer}>
            {ONBOARDING_SLIDES.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [8, 24, 8],
                    extrapolate: 'clamp',
                });
                const dotOpacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                });
                return (
                    <Animated.View
                        key={i}
                        style={[
                            styles.dot,
                            {
                                width: dotWidth,
                                opacity: dotOpacity,
                                backgroundColor: theme.colors.primary,
                            },
                        ]}
                    />
                );
            })}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.skipContainer}>
                {currentIndex < ONBOARDING_SLIDES.length - 1 && (
                    <Button mode="text" onPress={handleSkip} textColor={theme.colors.onSurfaceVariant}>
                        Skip
                    </Button>
                )}
            </View>

            <FlatList
                ref={flatListRef}
                data={ONBOARDING_SLIDES}
                renderItem={renderSlide}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                })}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
            />

            {renderDots()}

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={handleNext}
                    style={styles.nextButton}
                    contentStyle={styles.nextButtonContent}
                    labelStyle={styles.nextButtonLabel}
                >
                    {currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
                </Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    skipContainer: {
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingTop: 8,
        minHeight: 48,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        textAlign: 'center',
        lineHeight: 26,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 24,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    buttonContainer: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    nextButton: {
        borderRadius: 28,
    },
    nextButtonContent: {
        paddingVertical: 8,
    },
    nextButtonLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
});
