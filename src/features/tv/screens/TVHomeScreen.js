// src/features/tv/screens/TVHomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../core/theme';

const TVHomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={[styles.text, theme.text.header]}>TV Display Module</Text>
            <Text style={[styles.text, theme.text.subheader]}>Work in Progress</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000', // TV usually dark
    },
    text: {
        color: '#fff',
        marginBottom: theme.spacing.m,
    }
});

export default TVHomeScreen;
