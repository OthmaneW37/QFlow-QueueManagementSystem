// App.js
import { registerRootComponent } from 'expo';
import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Feature Screens
import TVHomeScreen from './src/features/tv/screens/TVHomeScreen';
import StaffHomeScreen from './src/features/staff/screens/StaffHomeScreen';
import ClientHomeScreen from './src/features/client/screens/ClientHomeScreen';
import { theme } from './src/core/theme';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Queue Management System</Text>
            <Text style={styles.subtitle}>Select Mode (Debug)</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#000' }]}
                    onPress={() => navigation.navigate('TV_Display')}
                >
                    <Text style={styles.buttonText}>📺 TV Mode</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                    onPress={() => navigation.navigate('Staff_Portal')}
                >
                    <Text style={styles.buttonText}>👔 Staff Portal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.secondary }]}
                    onPress={() => navigation.navigate('Client_App')}
                >
                    <Text style={styles.buttonText}>📱 Client App</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
    },
    buttonContainer: {
        width: '80%',
        gap: 20,
    },
    button: {
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    }
});

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Debug Menu', headerShown: false }}
                />
                <Stack.Screen
                    name="TV_Display"
                    component={TVHomeScreen}
                    options={{ title: 'TV Display', headerShown: false }}
                />
                <Stack.Screen
                    name="Staff_Portal"
                    component={StaffHomeScreen}
                    options={{ title: 'Staff Portal' }}
                />
                <Stack.Screen
                    name="Client_App"
                    component={ClientHomeScreen}
                    options={{ title: 'Client App' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default registerRootComponent(App);
