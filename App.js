import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Screens
import HubScreen from './src/screens/HubScreen';
import TVScreen from './src/features/tv/TVScreen';
import StaffLoginScreen from './src/features/staff/StaffLoginScreen';
import StaffDashboard from './src/features/staff/StaffDashboard';
import ClientTicket from './src/features/client/ClientTicket';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <>
            <StatusBar style="auto" />
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Hub"
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#2563EB',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <Stack.Screen
                        name="Hub"
                        component={HubScreen}
                        options={{ title: 'QFlow - Select Mode' }}
                    />
                    <Stack.Screen
                        name="TV"
                        component={TVScreen}
                        options={{
                            title: 'TV Display Mode',
                            headerShown: false // Full screen for TV mode
                        }}
                    />
                    <Stack.Screen
                        name="StaffLogin"
                        component={StaffLoginScreen}
                        options={{ title: 'Staff Login' }}
                    />
                    <Stack.Screen
                        name="StaffDashboard"
                        component={StaffDashboard}
                        options={{ title: 'Staff Dashboard' }}
                    />
                    <Stack.Screen
                        name="Staff" // Keeping for backward compatibility if Hub links here directly, but Hub should ideally link to StaffLogin
                        component={StaffLoginScreen}
                        options={{ title: 'Staff Portal' }}
                    />
                    <Stack.Screen
                        name="Client"
                        component={ClientTicket}
                        options={{ title: 'Get Your Ticket' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}
