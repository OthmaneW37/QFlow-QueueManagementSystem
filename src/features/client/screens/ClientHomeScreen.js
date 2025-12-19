// src/features/client/screens/ClientHomeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { theme } from '../../../core/theme';
import { queueService } from '../../../core/queueService';

import * as ScreenOrientation from 'expo-screen-orientation';

const ClientHomeScreen = () => {
    const [loading, setLoading] = useState(false);
    const [lastTicket, setLastTicket] = useState(null);

    React.useEffect(() => {
        // Force Portrait for Client
        const lockOrientation = async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        };
        lockOrientation();
    }, []);

    const handleTakeTicket = async () => {
        setLoading(true);
        try {
            const ticket = await queueService.addTicket();
            setLastTicket(ticket);
            Alert.alert("Success", `Ticket Created: ${ticket.number}`);
        } catch (error) {
            Alert.alert("Error", "Failed to create ticket. Check connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={theme.text.header}>Welcome Client</Text>
            <Text style={styles.subtitle}>Queue Management System</Text>

            <View style={styles.card}>
                {lastTicket && (
                    <View style={styles.ticketInfo}>
                        <Text style={styles.ticketLabel}>Your Ticket</Text>
                        <Text style={styles.ticketValue}>{lastTicket.number}</Text>
                        <Text style={styles.counterText}>Go to Counter {lastTicket.counter}</Text>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleTakeTicket}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Take a Ticket</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        padding: 20,
    },
    subtitle: {
        ...theme.text.subheader,
        color: theme.colors.textSecondary,
        marginBottom: 40,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        padding: 30,
        elevation: 4,
        alignItems: 'center',
    },
    ticketInfo: {
        marginBottom: 30,
        alignItems: 'center',
    },
    ticketLabel: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    ticketValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginVertical: 10,
    },
    counterText: {
        fontSize: 18,
        fontWeight: '500',
        color: theme.colors.text,
    },
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ClientHomeScreen;
