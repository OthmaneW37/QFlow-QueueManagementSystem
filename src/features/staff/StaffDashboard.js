import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../../shared/config/firebaseConfig';
import { AppButton } from '../../shared/components/AppButton';
import { theme } from '../../shared/theme';
import { QueueService } from '../../shared/services/QueueService';
import { CounterService } from '../../shared/services/CounterService';

const { width } = Dimensions.get('window');

export default function StaffDashboard({ route, navigation }) {
    const { counterId } = route.params || { counterId: '1' };
    const [currentTicket, setCurrentTicket] = useState(null);
    const [waitingList, setWaitingList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ servedToday: 0, missedToday: 0 });
    const [isOnBreak, setIsOnBreak] = useState(false);

    useEffect(() => {
        // Listen to current ticket
        const currentTicketRef = ref(database, 'current_ticket');
        const unsubscribeCurrent = onValue(currentTicketRef, (snapshot) => {
            setCurrentTicket(snapshot.val());
        });

        // Listen to waiting list
        const waitingListRef = ref(database, 'waiting_list');
        const unsubscribeWaiting = onValue(waitingListRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const ticketsArray = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                // Sort by timestamp if not already sorted
                ticketsArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                setWaitingList(ticketsArray);
            } else {
                setWaitingList([]);
            }
        });

        return () => {
            unsubscribeCurrent();
            unsubscribeWaiting();
        };
    }, []);

    const callNextTicket = async () => {
        if (isOnBreak) {
            Alert.alert('On Break', 'Please resume work to call next ticket.');
            return;
        }

        if (waitingList.length === 0) {
            Alert.alert('Queue Empty', 'No customers waiting');
            return;
        }

        setLoading(true);
        try {
            const ticket = await QueueService.callNextTicket(counterId);
            if (ticket) {
                setStats(prev => ({ ...prev, servedToday: prev.servedToday + 1 }));
            }
        } catch (error) {
            console.error('Error calling next ticket:', error);
            Alert.alert('Error', 'Failed to call next ticket');
        } finally {
            setLoading(false);
        }
    };

    const handleNoShow = async () => {
        if (!currentTicket) {
            Alert.alert('No Ticket', 'There is no active ticket to mark as absent.');
            return;
        }

        try {
            // Update stats
            setStats(prev => ({ ...prev, missedToday: prev.missedToday + 1 }));

            // Clear current ticket from Firebase to indicate "Done/Missed"
            const ticketRef = ref(database, 'current_ticket');
            await set(ticketRef, null); // Or set to a "missed" state if we want history

        } catch (error) {
            console.error("No Show failed", error);
            Alert.alert("Error", "Could not update ticket status.");
        }
    };

    const toggleBreak = () => {
        setIsOnBreak(!isOnBreak);
    };

    const handleLogout = async () => {
        try {
            await CounterService.releaseCounter(counterId);
        } catch (error) {
            console.error("Failed to release counter", error);
        }
        navigation.replace('StaffLogin');
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Header Card */}
            <View style={styles.headerCard}>
                <View style={styles.headerLeft}>
                    <View style={[styles.logoBadge, isOnBreak && styles.logoBadgeBreak]}>
                        <Text style={styles.logoText}>#{counterId}</Text>
                    </View>
                    <View>
                        <Text style={styles.welcomeText}>
                            {isOnBreak ? '⏸️ ON BREAK' : '🟢 ACTIVE'}
                        </Text>
                        <Text style={styles.headerTitle}>Staff Member</Text>
                    </View>
                </View>
                <AppButton
                    title="Log Out"
                    onPress={handleLogout}
                    variant="danger"
                    size="sm"
                    style={{ minWidth: 80 }}
                />
            </View>

            {/* Current Ticket Hero Section */}
            <View style={[styles.heroSection, isOnBreak && { opacity: 0.5 }]}>
                <Text style={styles.sectionLabel}>NOW SERVING</Text>
                <View style={[styles.ticketCard, !currentTicket && styles.ticketCardInactive]}>
                    <View style={styles.ticketCardInner}>
                        <Text style={[styles.ticketNumber, !currentTicket && styles.ticketNumberInactive]}>
                            {currentTicket?.number || '--'}
                        </Text>
                        {currentTicket?.counter && (
                            <View style={styles.counterBadge}>
                                <Text style={styles.counterBadgeText}>AT COUNTER {currentTicket.counter}</Text>
                            </View>
                        )}
                    </View>
                    {currentTicket?.calledAt && (
                        <View style={styles.timeFooter}>
                            <Text style={styles.timeText}>
                                Called at {new Date(currentTicket.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Action Area - Main Call Button */}
            <View style={styles.actionSection}>
                <AppButton
                    title={isOnBreak ? "⏸️ PAUSED" : `📣 CALL NEXT (${waitingList.length})`}
                    onPress={callNextTicket}
                    variant={isOnBreak ? "disabled" : "primary"}
                    loading={loading}
                    disabled={isOnBreak || waitingList.length === 0}
                    style={[styles.mainActionButton, isOnBreak && styles.mainButtonPaused]}
                    textStyle={{ fontSize: 18, letterSpacing: 1 }}
                />
            </View>

            {/* Quick Actions Grid */}
            <View style={styles.gridSection}>
                <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
                <View style={styles.gridRow}>
                    <AppButton
                        title="🚫 Absent"
                        onPress={handleNoShow}
                        variant="danger"
                        style={[styles.gridButton, { flex: 1, marginRight: 8 }]}
                        disabled={!currentTicket || isOnBreak}
                    />
                    <AppButton
                        title={isOnBreak ? "▶️ Resume" : "☕ Break"}
                        onPress={toggleBreak}
                        variant={isOnBreak ? "success" : "warning"}
                        style={[styles.gridButton, { flex: 1, marginLeft: 8 }]}
                    />
                </View>
            </View>

            {/* Waiting List */}
            <View style={styles.listSection}>
                <View style={styles.listHeaderRow}>
                    <Text style={styles.sectionLabel}>WAITING QUEUE</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statBadge}>
                            <Text style={styles.statBadgeText}>Served: {stats.servedToday}</Text>
                        </View>
                        <View style={[styles.statBadge, styles.statBadgeMissed]}>
                            <Text style={styles.statBadgeTextMissed}>Missed: {stats.missedToday}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.listCard}>
                    {waitingList.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyEmoji}>☕</Text>
                            <Text style={styles.emptyText}>All caught up!</Text>
                            <Text style={styles.emptySubtext}>No customers waiting in line.</Text>
                        </View>
                    ) : (
                        waitingList.slice(0, 5).map((ticket, index) => (
                            <View key={ticket.id} style={styles.listItem}>
                                <View style={styles.listItemLeft}>
                                    <View style={styles.positionCircle}>
                                        <Text style={styles.positionText}>{index + 1}</Text>
                                    </View>
                                    <Text style={styles.listItemNumber}>{ticket.number}</Text>
                                </View>
                                <Text style={styles.listItemTime}>
                                    {new Date(ticket.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        ))
                    )}
                    {waitingList.length > 5 && (
                        <View style={styles.moreItemsFooter}>
                            <Text style={styles.moreItemsText}>+ {waitingList.length - 5} others waiting</Text>
                        </View>
                    )}
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
    // Header
    headerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.xl,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    logoBadge: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: theme.colors.success, // Default green
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md
    },
    logoBadgeBreak: {
        backgroundColor: theme.colors.accent // Orange/Yellow when on break
    },
    logoText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18
    },
    welcomeText: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        fontWeight: '800',
        letterSpacing: 0.5
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text.primary
    },

    // Labels
    sectionLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.text.light,
        marginBottom: theme.spacing.sm,
        letterSpacing: 1,
        marginLeft: 4
    },

    // Hero Section
    heroSection: {
        marginBottom: theme.spacing.xl
    },
    ticketCard: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xl,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        alignItems: 'center'
    },
    ticketCardInactive: {
        backgroundColor: '#E2E8F0',
        shadowColor: '#94A3B8',
        shadowOpacity: 0.1
    },
    ticketCardInner: {
        alignItems: 'center',
        marginBottom: theme.spacing.md
    },
    ticketNumber: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 4,
        includeFontPadding: false
    },
    ticketNumberInactive: {
        color: '#94A3B8'
    },
    counterBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginTop: 4
    },
    counterBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    timeFooter: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
        width: '100%',
        alignItems: 'center',
        paddingTop: theme.spacing.md
    },
    timeText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        fontWeight: '500'
    },

    // Action Section
    actionSection: {
        marginBottom: theme.spacing.lg
    },
    mainActionButton: {
        height: 64,
        borderRadius: theme.borderRadius.lg,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6
    },
    mainButtonPaused: {
        backgroundColor: theme.colors.text.light,
        shadowOpacity: 0
    },

    // Grid Actions
    gridSection: {
        marginBottom: theme.spacing.xl
    },
    gridRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    gridButton: {
        height: 50,
        borderRadius: theme.borderRadius.md
    },

    // List Section
    listSection: {
        marginBottom: theme.spacing.xl
    },
    listHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 8
    },
    statBadge: {
        backgroundColor: '#DCFCE7',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12
    },
    statBadgeMissed: {
        backgroundColor: '#FEE2E2', // Light red
    },
    statBadgeText: {
        color: '#15803D',
        fontSize: 12,
        fontWeight: 'bold'
    },
    statBadgeTextMissed: {
        color: '#B91C1C', // Dark red
        fontSize: 12,
        fontWeight: 'bold'
    },
    listCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9'
    },
    listItemLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    positionCircle: {
        width: 32,
        height: 32,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md
    },
    positionText: {
        fontWeight: 'bold',
        color: theme.colors.text.secondary,
        fontSize: 14
    },
    listItemNumber: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.text.primary
    },
    listItemTime: {
        color: theme.colors.text.light,
        fontSize: 13
    },
    emptyState: {
        padding: theme.spacing.xl,
        alignItems: 'center'
    },
    emptyEmoji: {
        fontSize: 40,
        marginBottom: theme.spacing.sm
    },
    emptyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: 4
    },
    emptySubtext: {
        color: theme.colors.text.secondary,
        fontSize: 14
    },
    moreItemsFooter: {
        padding: theme.spacing.md,
        alignItems: 'center',
        backgroundColor: '#F8FAFC'
    },
    moreItemsText: {
        color: theme.colors.text.secondary,
        fontSize: 12,
        fontWeight: '600'
    }
});
