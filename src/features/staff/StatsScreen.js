import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AppCard } from '../../shared/components/AppCard';
import { theme } from '../../shared/theme';
import { QueueService } from '../../shared/services/QueueService';

export default function StatsScreen() {
    const [stats, setStats] = useState({
        totalServed: 0,
        averageWaitTime: 0,
        busiestHour: '--'
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        // Mock data for MVP - in real app, fetch from historical data
        setStats({
            totalServed: 42,
            averageWaitTime: 12,
            busiestHour: '10:00 - 11:00'
        });
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Daily Performance</Text>

            <View style={styles.grid}>
                <AppCard style={styles.card}>
                    <Text style={styles.value}>{stats.totalServed}</Text>
                    <Text style={styles.label}>Customers Served</Text>
                </AppCard>

                <AppCard style={styles.card}>
                    <Text style={styles.value}>{stats.averageWaitTime}m</Text>
                    <Text style={styles.label}>Avg Wait Time</Text>
                </AppCard>

                <AppCard style={styles.card}>
                    <Text style={styles.value}>{stats.busiestHour}</Text>
                    <Text style={styles.label}>Busiest Hour</Text>
                </AppCard>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.lg
    },
    title: {
        fontSize: theme.typography.fontSizes['2xl'],
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xl
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.md
    },
    card: {
        flex: 1,
        minWidth: '45%',
        alignItems: 'center',
        paddingVertical: theme.spacing.xl
    },
    value: {
        fontSize: theme.typography.fontSizes['3xl'],
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: theme.spacing.sm
    },
    label: {
        fontSize: theme.typography.fontSizes.sm,
        color: theme.colors.text.secondary
    }
});
