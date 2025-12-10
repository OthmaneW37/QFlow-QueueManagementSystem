// src/features/client/screens/ClientHomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../core/theme';

const ClientHomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={theme.text.header}>Client App</Text>
            <Text style={theme.text.subheader}>Work in Progress</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
    },
});

export default ClientHomeScreen;
