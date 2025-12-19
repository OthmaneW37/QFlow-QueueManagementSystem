// src/features/tv/screens/TVHomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../../core/theme';
import { queueService } from '../../../core/queueService';
import * as ScreenOrientation from 'expo-screen-orientation';

const { width, height } = Dimensions.get('window');

const TVHomeScreen = () => {
    const [currentTicket, setCurrentTicket] = useState({ number: '----', counter: '-' });
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Force Landscape for TV
        const lockOrientation = async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        };
        lockOrientation();

        return () => {
            // Reset to default when leaving
            ScreenOrientation.unlockAsync();
        };
    }, []);

    useEffect(() => {
        // Subscribe to ticket updates
        const unsubscribe = queueService.subscribe((data) => {
            setCurrentTicket(data.current);
            setHistory(data.history);
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            {/* Left Panel - Main Display (70%) */}
            <View style={styles.mainPanel}>
                <Text style={styles.nowServingLabel}>NOW SERVING</Text>
                <View style={styles.ticketContainer}>
                    <Text style={styles.ticketNumber}>{currentTicket.number}</Text>
                </View>
                <Text style={styles.counterLabel}>COUNTER {currentTicket.counter}</Text>
            </View>

            {/* Right Panel - History (30%) */}
            <View style={styles.sidePanel}>
                <View style={styles.headerContainer}>
                    <Text style={styles.historyHeader}>RECENT</Text>
                </View>
                {history.map((ticket, index) => (
                    <View key={index} style={styles.historyItem}>
                        <Text style={styles.historyCode}>{ticket.number}</Text>
                        <Text style={styles.historyCounter}>Cn {ticket.counter}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#121212', // Dark background for TV
    },
    // Left Panel
    mainPanel: {
        flex: 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 2,
        borderRightColor: '#333',
        padding: 40,
    },
    nowServingLabel: {
        color: '#aaaaaa',
        fontSize: width * 0.04,
        fontWeight: '300',
        letterSpacing: 4,
        marginBottom: 20,
    },
    ticketContainer: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 60,
        paddingVertical: 30,
        borderRadius: 20,
        marginBottom: 30,
        elevation: 10,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    ticketNumber: {
        color: '#ffffff',
        fontSize: width * 0.12, // Responsive giant font
        fontWeight: 'bold',
        includeFontPadding: false,
    },
    counterLabel: {
        color: '#ffffff',
        fontSize: width * 0.05,
        fontWeight: 'bold',
    },

    // Right Panel
    sidePanel: {
        flex: 0.3,
        backgroundColor: '#1e1e1e',
        padding: 20,
    },
    headerContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        paddingBottom: 15,
        marginBottom: 20,
    },
    historyHeader: {
        color: '#888',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
    },
    historyCode: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    historyCounter: {
        color: theme.colors.secondary,
        fontSize: 20,
        fontWeight: '500',
    }
});

export default TVHomeScreen;

