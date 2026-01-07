import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Vibration, Dimensions } from 'react-native';
import { ref, push, onValue, runTransaction } from 'firebase/database';
import { database } from '../../shared/config/firebaseConfig';
import { AppButton } from '../../shared/components/AppButton';
import { theme } from '../../shared/theme';

const { width } = Dimensions.get('window');

export default function ClientTicket({ navigation }) {
    const [myTicket, setMyTicket] = useState(null);
    const [waitingList, setWaitingList] = useState([]);
    const [currentTicket, setCurrentTicket] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Listen to waiting list to calculate position
        const waitingListRef = ref(database, 'waiting_list');
        const unsubscribeWaiting = onValue(waitingListRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const ticketsArray = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                // Sort by timestamp
                ticketsArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                setWaitingList(ticketsArray);
            } else {
                setWaitingList([]);
            }
        });

        // Listen to current ticket
        const currentTicketRef = ref(database, 'current_ticket');
        const unsubscribeCurrent = onValue(currentTicketRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setCurrentTicket(data);
                // Notification Logic: Current ticket matches my ticket
                if (myTicket && data.number === myTicket) {
                    // Check if recently called (within last 10s) to vibrate
                    const calledTime = new Date(data.calledAt).getTime();
                    if (Date.now() - calledTime < 10000) {
                        try {
                            Vibration.vibrate([0, 500, 200, 500]);
                        } catch (e) {
                            console.log('Vibration not supported');
                        }
                    }
                }
            }
        });

        return () => {
            unsubscribeWaiting();
            unsubscribeCurrent();
        };
    }, [myTicket]);

    useEffect(() => {
        // Auto-reset logic
        if (myTicket && currentTicket && currentTicket.number !== myTicket) {
            const isInWaiting = waitingList.find(t => t.number === myTicket);
            const isCurrent = currentTicket.number === myTicket;

            if (!isInWaiting && !isCurrent) {
                setMyTicket(null);
            }
        }
    }, [currentTicket, waitingList, myTicket]);

    // Transactional Ticket Number Generation
    const takeTicket = async () => {
        setLoading(true);
        try {
            const indexRef = ref(database, 'config/last_ticket_index');

            // Transaction to atomically increment ticket number
            const result = await runTransaction(indexRef, (currentData) => {
                return (currentData || 0) + 1;
            });

            const nextIndex = result.snapshot.val();
            const ticketNumber = `A-${String(nextIndex).padStart(3, '0')}`;

            // Push new ticket to /waiting_list
            const waitingListRef = ref(database, 'waiting_list');
            await push(waitingListRef, {
                number: ticketNumber,
                timestamp: new Date().toISOString()
            });

            setMyTicket(ticketNumber);
        } catch (error) {
            console.error('Error generating ticket transaction:', error);
            Alert.alert('Error', 'Failed to generate ticket. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Calculate position in queue
    const getMyPosition = () => {
        if (!myTicket) return null;
        const position = waitingList.findIndex(ticket => ticket.number === myTicket);
        return position >= 0 ? position + 1 : null;
    };

    const myPosition = getMyPosition();
    const peopleAhead = myPosition ? myPosition - 1 : null;
    const isMyTurn = currentTicket?.number === myTicket;

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Background Decoration */}
            <View style={styles.circleDecoration} />

            <Text style={styles.pageTitle}>Mobile Kiosk</Text>
            <Text style={styles.pageSubtitle}>Smart Queue System</Text>

            {/* Main Action Area */}
            {!myTicket ? (
                <View style={styles.startCard}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.iconText}>🎫</Text>
                    </View>
                    <Text style={styles.instructionTitle}>Join the Queue</Text>
                    <Text style={styles.instructionText}>
                        Tap the button below to get your digital ticket and track your status in real-time.
                    </Text>
                    <AppButton
                        title="Get My Ticket"
                        onPress={takeTicket}
                        variant="primary"
                        loading={loading}
                        style={styles.takeButton}
                        size="lg"
                    />
                </View>
            ) : (
                <View style={[styles.ticketCard, isMyTurn && styles.ticketCardActive]}>
                    <View style={styles.ticketHeader}>
                        <Text style={[styles.ticketLabel, isMyTurn && styles.ticketLabelActive]}>YOUR TICKET</Text>
                    </View>
                    <View style={styles.ticketBody}>
                        <Text style={[styles.ticketNumber, isMyTurn && { color: '#fff' }]}>{myTicket}</Text>

                        {isMyTurn ? (
                            <View style={styles.statusBadgeActive}>
                                <Text style={styles.statusBadgeTextActive}>IT'S YOUR TURN!</Text>
                            </View>
                        ) : (
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusBadgeText}>WAITING</Text>
                            </View>
                        )}

                        {!isMyTurn && (
                            <AppButton
                                title="🎮 Play Flappy Bird"
                                onPress={() => navigation.navigate('Game', { myTicket })}
                                variant="outline"
                                style={{ marginTop: 20, width: '100%' }}
                            />
                        )}

                        {isMyTurn && currentTicket?.counter && (
                            <Text style={styles.counterInstruction}>
                                Please proceed to Counter {currentTicket.counter}
                            </Text>
                        )}
                    </View>

                    {!isMyTurn && (
                        <View style={styles.ticketFooter}>
                            <View style={styles.ticketStat}>
                                <Text style={styles.statLabel}>POSITION</Text>
                                <Text style={styles.statValue}>#{myPosition || '-'}</Text>
                            </View>
                            <View style={styles.ticketStatDivider} />
                            <View style={styles.ticketStat}>
                                <Text style={styles.statLabel}>EST. WAIT TIME</Text>
                                <Text style={styles.statValue}>
                                    {peopleAhead !== null
                                        ? peopleAhead === 0
                                            ? '< 1 min'
                                            : `~${peopleAhead * 5} min`
                                        : '-'}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            )}

            {/* Live Queue Status */}
            <View style={styles.statsSection}>
                <Text style={styles.sectionHeader}>LIVE STATUS</Text>

                <View style={styles.statusRow}>
                    <View style={styles.statusCard}>
                        <Text style={styles.statusLabel}>Now Serving</Text>
                        <Text style={styles.statusValueMain}>{currentTicket?.number || '--'}</Text>
                        {currentTicket?.counter && (
                            <Text style={styles.statusSubtext}>Counter {currentTicket.counter}</Text>
                        )}
                    </View>

                    <View style={styles.statusCard}>
                        <Text style={styles.statusLabel}>Total Waiting</Text>
                        <Text style={styles.statusValueSecondary}>{waitingList.length}</Text>
                        <Text style={styles.statusSubtext}>People</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        padding: theme.spacing.lg
    },
    circleDecoration: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: theme.colors.primary,
        opacity: 0.05
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginTop: theme.spacing.xl
    },
    pageSubtitle: {
        fontSize: 16,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xl
    },

    // Start Card
    startCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xl,
        alignItems: 'center',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: theme.spacing.xl
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg
    },
    iconText: {
        fontSize: 32
    },
    instructionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm
    },
    instructionText: {
        textAlign: 'center',
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xl,
        lineHeight: 22
    },
    takeButton: {
        width: '100%',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5
    },

    // Ticket Card
    ticketCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        marginBottom: theme.spacing.xl,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        overflow: 'hidden'
    },
    ticketCardActive: {
        backgroundColor: theme.colors.success,
    },
    ticketHeader: {
        backgroundColor: '#F1F5F9',
        paddingVertical: theme.spacing.sm,
        alignItems: 'center'
    },
    ticketLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: theme.colors.text.secondary
    },
    ticketLabelActive: {
        color: theme.colors.text.primary
    },
    ticketBody: {
        padding: theme.spacing.xl,
        alignItems: 'center'
    },
    ticketNumber: {
        fontSize: 56,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
        letterSpacing: 2
    },
    statusBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12
    },
    statusBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.text.secondary,
        letterSpacing: 1
    },
    statusBadgeActive: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: theme.spacing.sm
    },
    statusBadgeTextActive: {
        color: theme.colors.success,
        fontWeight: 'bold',
        fontSize: 14
    },
    counterInstruction: {
        color: '#fff',
        marginTop: theme.spacing.sm,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },
    ticketFooter: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingVertical: theme.spacing.md
    },
    ticketStat: {
        flex: 1,
        alignItems: 'center'
    },
    ticketStatDivider: {
        width: 1,
        backgroundColor: '#F1F5F9'
    },
    statLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.text.light,
        marginBottom: 2
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text.primary
    },

    // Stats Section
    statsSection: {
        marginBottom: theme.spacing.xl
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.text.light,
        marginBottom: theme.spacing.md,
        letterSpacing: 1
    },
    statusRow: {
        flexDirection: 'row',
        gap: theme.spacing.md
    },
    statusCard: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    },
    statusLabel: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.sm
    },
    statusValueMain: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 2
    },
    statusValueSecondary: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: 2
    },
    statusSubtext: {
        fontSize: 11,
        color: theme.colors.text.light
    }
});
