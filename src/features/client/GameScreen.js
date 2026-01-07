import { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { ref, onValue } from 'firebase/database';
import { database } from '../../shared/config/firebaseConfig';
import { theme } from '../../shared/theme';

export default function GameScreen({ navigation, route }) {
    const { myTicket } = route.params || {};
    const [waitTime, setWaitTime] = useState(null);
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [currentCounter, setCurrentCounter] = useState(null);

    useEffect(() => {
        if (!myTicket) return;

        const waitingListRef = ref(database, 'waiting_list');
        const unsubscribeWaiting = onValue(waitingListRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const ticketsArray = Object.entries(data).map(([key, value]) => value);
                ticketsArray.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

                const myIndex = ticketsArray.findIndex(t => t.number === myTicket);
                if (myIndex >= 0) {
                    setWaitTime(myIndex * 5); // 5 mins per person
                }
            }
        });

        const currentTicketRef = ref(database, 'current_ticket');
        const unsubscribeCurrent = onValue(currentTicketRef, (snapshot) => {
            const data = snapshot.val();
            if (data && data.number === myTicket) {
                setIsMyTurn(true);
                setCurrentCounter(data.counter);
            }
        });

        return () => {
            unsubscribeWaiting();
            unsubscribeCurrent();
        };
    }, [myTicket]);

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <WebView
                source={{ uri: 'https://nebez.github.io/floppybird/' }}
                style={styles.webview}
                scrollEnabled={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                // Performance optimizations
                androidLayerType="hardware"
                androidHardwareAccelerationDisabled={false}
                cacheEnabled={true}
                overScrollMode="never"
                incognito={false}
            />

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back to Queue</Text>
            </TouchableOpacity>

            {/* Wait Time Badge */}
            {waitTime !== null && !isMyTurn && (
                <View style={styles.waitBadge}>
                    <Text style={styles.waitLabel}>EST. WAIT</Text>
                    <Text style={styles.waitValue}>~{waitTime} min</Text>
                </View>
            )}

            {/* MY TURN OVERLAY */}
            {isMyTurn && (
                <View style={styles.turnOverlay}>
                    <View style={styles.turnCard}>
                        <Text style={styles.turnEmoji}>🎉</Text>
                        <Text style={styles.turnTitle}>IT'S YOUR TURN!</Text>
                        <Text style={styles.turnText}>Please proceed to:</Text>
                        <View style={styles.counterBox}>
                            <Text style={styles.counterText}>COUNTER {currentCounter}</Text>
                        </View>
                        <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
                            <Text style={styles.exitButtonText}>Show My Ticket</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    webview: {
        flex: 1,
        backgroundColor: '#000',
        opacity: 0.99, // Hack to force GPU rendering on some Android versions
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    backButtonText: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    waitBadge: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.primary,
        alignItems: 'center'
    },
    waitLabel: {
        color: '#aaa',
        fontSize: 8,
        fontWeight: 'bold'
    },
    waitValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold'
    },
    turnOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(37, 99, 235, 0.9)', // Primary color opacity
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999
    },
    turnCard: {
        backgroundColor: '#fff',
        width: '80%',
        padding: 30,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 20
    },
    turnEmoji: {
        fontSize: 60,
        marginBottom: 20
    },
    turnTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: theme.colors.text.primary,
        marginBottom: 10,
        textAlign: 'center'
    },
    turnText: {
        fontSize: 16,
        color: theme.colors.text.secondary,
        marginBottom: 20
    },
    counterBox: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 15,
        marginBottom: 30
    },
    counterText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    exitButton: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        alignItems: 'center'
    },
    exitButtonText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 16
    }
});
