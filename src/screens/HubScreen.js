import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppButton } from '../shared/components/AppButton';
import { AppCard } from '../shared/components/AppCard';
import { theme } from '../shared/theme';

export default function HubScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Smart Queue Management System</Text>
            <Text style={styles.subtitle}>Select Your Mode</Text>

            <View style={styles.cardContainer}>
                <AppCard style={styles.card}>
                    <Text style={styles.cardTitle}>📺 TV Display Mode</Text>
                    <Text style={styles.cardDescription}>
                        Passive listener for real-time ticket updates. Displays current number on screen.
                    </Text>
                    <AppButton
                        title="Launch TV Mode"
                        onPress={() => navigation.navigate('TV')}
                        variant="primary"
                        style={styles.button}
                    />
                </AppCard>

                <AppCard style={styles.card}>
                    <Text style={styles.cardTitle}>👨‍💼 Staff Dashboard</Text>
                    <Text style={styles.cardDescription}>
                        Control panel to call next ticket and manage queue operations.
                    </Text>
                    <AppButton
                        title="👨‍💼 Staff Portal"
                        onPress={() => navigation.navigate('StaffLogin')}
                        variant="outline"
                        style={styles.button}
                    />
                </AppCard>

                <AppCard style={styles.card}>
                    <Text style={styles.cardTitle}>🎫 Client Ticket</Text>
                    <Text style={styles.cardDescription}>
                        Get your queue number and see your position in real-time.
                    </Text>
                    <AppButton
                        title="Get Ticket"
                        onPress={() => navigation.navigate('Client')}
                        variant="outline"
                        style={styles.button}
                    />
                </AppCard>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.lg,
        justifyContent: 'center'
    },
    title: {
        fontSize: theme.typography.fontSizes['2xl'],
        fontWeight: theme.typography.fontWeights.bold,
        color: theme.colors.text.primary,
        textAlign: 'center',
        marginBottom: theme.spacing.sm
    },
    subtitle: {
        fontSize: theme.typography.fontSizes.lg,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl
    },
    cardContainer: {
        gap: theme.spacing.md
    },
    card: {
        marginBottom: theme.spacing.sm
    },
    cardTitle: {
        fontSize: theme.typography.fontSizes.xl,
        fontWeight: theme.typography.fontWeights.semibold,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm
    },
    cardDescription: {
        fontSize: theme.typography.fontSizes.sm,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.md,
        lineHeight: 20
    },
    button: {
        marginTop: theme.spacing.sm
    }
});
