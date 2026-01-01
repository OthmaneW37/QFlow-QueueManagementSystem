import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, Animated, Easing } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '../../shared/config/firebaseConfig';
import { theme } from '../../shared/theme';
import { SoundService } from '../../shared/services/SoundService';
import * as ScreenOrientation from 'expo-screen-orientation';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function TVScreen() {
    const [currentTicket, setCurrentTicket] = useState(null);
    const [scrollingText, setScrollingText] = useState('Welcome to QFlow Smart Queue System - You can play Flappy Bird while waiting to have some fun! 🐤');
    const [history, setHistory] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Animation Ref
    const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

    useEffect(() => {
        // Force Landscape Orientation
        async function lockOrientation() {
            try {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            } catch (error) {
                console.log("Could not lock orientation", error);
            }
        }
        lockOrientation();

        // Listen to current ticket
        const currentTicketRef = ref(database, 'current_ticket');
        const unsubscribe = onValue(currentTicketRef, async (snapshot) => {
            const data = snapshot.val();
            if (data && data.number) {
                const calledTime = new Date(data.calledAt).getTime();
                const now = Date.now();

                if (now - calledTime < 10000) {
                    try {
                        await SoundService.playNotificationSound();
                    } catch (e) {
                        console.log('Sound error', e);
                    }
                }

                setCurrentTicket(prev => {
                    if (!prev || data.number !== prev.number) {
                        setHistory(old => {
                            const newHistory = [data, ...old.filter(t => t.number !== data.number)];
                            return newHistory.slice(0, 5);
                        });
                    }
                    return data;
                });
            }
        });

        // Listen to scrolling text
        const scrollingTextRef = ref(database, 'config/scrolling_text');
        const unsubscribeText = onValue(scrollingTextRef, (snapshot) => {
            const text = snapshot.val();
            if (text) setScrollingText(text);
        });

        // Clock timer
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

        return () => {
            unsubscribe();
            unsubscribeText();
            clearInterval(timer);
            ScreenOrientation.unlockAsync();
        };
    }, []);

    // Marquee Animation
    useEffect(() => {
        const duration = (SCREEN_WIDTH + 2500) * 12; // Adjusted speed

        const animation = Animated.loop(
            Animated.sequence([
                // 1. Reset instantly to the right side
                Animated.timing(translateX, {
                    toValue: SCREEN_WIDTH,
                    duration: 0,
                    useNativeDriver: true,
                }),
                // 2. Scroll to the far left
                Animated.timing(translateX, {
                    toValue: -2500, // Safe margin for long phrases
                    duration: duration,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ])
        );

        animation.start();

        return () => animation.stop();
    }, [scrollingText]); // Re-start if text changes

    return (
        <View style={styles.container}>
            <StatusBar hidden />

            {/* Header Area */}
            <View style={styles.header}>
                <View style={styles.branding}>
                    <Text style={styles.logoText}>QFlow</Text>
                    <Text style={styles.logoSubtext}>SMART QUEUE</Text>
                </View>
                <View style={styles.clockBox}>
                    <Text style={styles.timeText}>
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </Text>
                    <Text style={styles.dateText}>
                        {currentTime.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
                    </Text>
                </View>
            </View>

            {/* Main Section */}
            <View style={styles.mainContent}>
                {/* BIG Ticket Card */}
                <View style={styles.calloutSection}>
                    <View style={styles.calloutCard}>
                        <Text style={styles.nowServingLabel}>NOW SERVING</Text>
                        <Text style={styles.mainTicketNumber} numberOfLines={1} adjustsFontSizeToFit>
                            {currentTicket?.number || '--'}
                        </Text>
                        <View style={styles.indicatorContainer}>
                            <Text style={styles.atCounterLabel}>PLEASE PROCEED TO</Text>
                            <View style={styles.counterBadge}>
                                <Text style={styles.counterValue}>COUNTER {currentTicket?.counter || '-'}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* History Sidebar */}
                <View style={styles.sidebar}>
                    <Text style={styles.sidebarTitle}>RECENTLY CALLED</Text>
                    <View style={styles.historyContainer}>
                        {history.length > 0 ? (
                            history.map((t, idx) => (
                                <View key={idx} style={styles.historyRow}>
                                    <View style={styles.historyLeft}>
                                        <Text style={styles.historyNum}>{t.number}</Text>
                                        <Text style={styles.historyTime}>
                                            {new Date(t.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                    <View style={styles.historyRight}>
                                        <Text style={styles.historyCounter}>C{t.counter}</Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.historyEmpty}>Ready for calls...</Text>
                        )}
                    </View>
                </View>
            </View>

            {/* Footer Ticker - Animated */}
            <View style={styles.footer}>
                <Animated.View style={[styles.tickerWrapper, { transform: [{ translateX }] }]}>
                    <Text style={styles.tickerText}>{scrollingText}</Text>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    header: {
        height: '15%',
        backgroundColor: '#1E293B',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 40,
        borderBottomWidth: 4,
        borderBottomColor: theme.colors.primary,
    },
    branding: {
        flexDirection: 'column',
    },
    logoText: {
        fontSize: 36,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 2,
    },
    logoSubtext: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.primary,
        letterSpacing: 4,
    },
    clockBox: {
        alignItems: 'flex-end',
    },
    timeText: {
        fontSize: 40,
        fontWeight: '800',
        color: '#fff',
        fontVariant: ['tabular-nums'],
    },
    dateText: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '600',
    },
    mainContent: {
        flex: 1,
        flexDirection: 'row',
        padding: 20,
    },
    calloutSection: {
        flex: 2.5,
        justifyContent: 'center',
        paddingRight: 10,
    },
    calloutCard: {
        flex: 0.95,
        backgroundColor: '#fff',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingVertical: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    nowServingLabel: {
        fontSize: 24,
        fontWeight: '800',
        color: '#64748B',
        letterSpacing: 10,
    },
    mainTicketNumber: {
        fontSize: 200,
        fontWeight: '900',
        color: theme.colors.primary,
        width: '100%',
        textAlign: 'center',
    },
    indicatorContainer: {
        alignItems: 'center',
    },
    atCounterLabel: {
        fontSize: 20,
        fontWeight: '600',
        color: '#94A3B8',
        marginBottom: 10,
    },
    counterBadge: {
        backgroundColor: '#0F172A',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 20,
    },
    counterValue: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
    },
    sidebar: {
        flex: 1,
        backgroundColor: '#1E293B',
        borderRadius: 30,
        padding: 20,
        marginLeft: 10,
    },
    sidebarTitle: {
        color: '#94A3B8',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
        textAlign: 'center',
        marginBottom: 20,
    },
    historyContainer: {
        flex: 1,
    },
    historyRow: {
        flexDirection: 'row',
        backgroundColor: '#334155',
        borderRadius: 20,
        padding: 15,
        marginBottom: 12,
        alignItems: 'center',
        borderLeftWidth: 6,
        borderLeftColor: theme.colors.primary,
    },
    historyLeft: {
        flex: 1,
    },
    historyNum: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
    },
    historyTime: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    historyRight: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 10,
        borderRadius: 12,
    },
    historyCounter: {
        fontSize: 18,
        fontWeight: '900',
        color: theme.colors.primary,
    },
    historyEmpty: {
        color: '#475569',
        textAlign: 'center',
        marginTop: 50,
        fontStyle: 'italic',
    },
    footer: {
        height: 60,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    tickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 1000, // Enough width for long phrases
    },
    tickerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        whiteSpace: 'nowrap',
    }
});
