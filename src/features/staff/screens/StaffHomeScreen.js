// src/features/staff/screens/StaffHomeScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../core/theme';
import * as ScreenOrientation from 'expo-screen-orientation';


const StaffHomeScreen = () => {
    React.useEffect(() => {
        // Force Portrait for Staff
        const lockOrientation = async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        };
        lockOrientation();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={theme.text.header}>Staff Portal</Text>
            <Text style={theme.text.subheader}>Work in Progress</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
});

export default StaffHomeScreen;
