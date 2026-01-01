import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { AppButton } from '../../shared/components/AppButton';
import { theme } from '../../shared/theme';
import { AuthService } from '../../shared/services/AuthService';
import { CounterService } from '../../shared/services/CounterService';

const AVAILABLE_COUNTERS = ['1', '2', '3', '4', '5', '6'];
const { width } = Dimensions.get('window');

export default function StaffLoginScreen({ navigation }) {
    const [pin, setPin] = useState('');
    const [counter, setCounter] = useState('1');
    const [loading, setLoading] = useState(false);
    const [showCounterModal, setShowCounterModal] = useState(false);

    const handleLogin = async () => {
        if (!pin) {
            Alert.alert('Error', 'Please enter your PIN');
            return;
        }

        setLoading(true);
        try {
            const isAvailable = await CounterService.isCounterAvailable(counter);
            if (!isAvailable) {
                Alert.alert(
                    'Access Denied',
                    `Counter ${counter} is already being used by another admin.\nPlease choose a different counter.`
                );
                setLoading(false);
                return;
            }

            const isValid = await AuthService.loginWithPin(pin);
            if (isValid) {
                await CounterService.lockCounter(counter);
                navigation.replace('StaffDashboard', { counterId: counter });
            } else {
                Alert.alert('Access Denied', 'Invalid PIN code');
                setPin('');
            }
        } catch (error) {
            Alert.alert('Error', 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                {/* Background Decoration */}
                <View style={styles.circleDecoration} />

                <View style={styles.card}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.logoBadge}>
                            <Text style={styles.logoText}>Q</Text>
                        </View>
                        <Text style={styles.title}>QFlow Staff</Text>
                        <Text style={styles.subtitle}>Secure Access Portal</Text>
                    </View>

                    {/* Counter Selection */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Working Station</Text>
                        <TouchableOpacity
                            style={styles.counterSelector}
                            onPress={() => setShowCounterModal(true)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.counterIcon}>
                                <Text style={styles.counterIconText}>#</Text>
                            </View>
                            <Text style={styles.counterValue}>Counter {counter}</Text>
                            <Text style={styles.dropdownIcon}>▼</Text>
                        </TouchableOpacity>
                    </View>

                    {/* PIN Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Security PIN</Text>
                        <TextInput
                            style={styles.pinInput}
                            value={pin}
                            onChangeText={setPin}
                            keyboardType="numeric"
                            secureTextEntry
                            maxLength={4}
                            placeholder="• • • •"
                            placeholderTextColor={theme.colors.text.light}
                        />
                    </View>

                    {/* Login Button */}
                    <AppButton
                        title="Authenticate & Access"
                        onPress={handleLogin}
                        loading={loading}
                        variant="primary"
                        style={styles.loginButton}
                        size="md"
                    />
                </View>

                {/* Footer or Version Info */}
                <Text style={styles.versionText}>v1.0.0 • Secure Connection</Text>

                {/* Counter Selection Modal */}
                <Modal
                    visible={showCounterModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowCounterModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Select Your Counter</Text>
                            <Text style={styles.modalSubtitle}>Where are you working today?</Text>

                            <View style={styles.gridContainer}>
                                {AVAILABLE_COUNTERS.map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={[
                                            styles.counterOption,
                                            counter === item && styles.selectedOption
                                        ]}
                                        onPress={() => {
                                            setCounter(item);
                                            setShowCounterModal(false);
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[
                                            styles.optionText,
                                            counter === item && styles.selectedOptionText
                                        ]}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <AppButton
                                title="Cancel Selection"
                                onPress={() => setShowCounterModal(false)}
                                variant="outline"
                                size="sm"
                                style={styles.modalButton}
                            />
                        </View>
                    </View>
                </Modal>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC', // Very light blue-grey
        justifyContent: 'center',
        padding: theme.spacing.lg,
        alignItems: 'center'
    },
    circleDecoration: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: theme.colors.primary,
        opacity: 0.1,
        transform: [{ scaleX: 1.5 }]
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xl,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)'
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl
    },
    logoBadge: {
        width: 60,
        height: 60,
        borderRadius: 18,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6
    },
    logoText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold'
    },
    title: {
        fontSize: theme.typography.fontSizes['2xl'],
        fontWeight: theme.typography.fontWeights.bold,
        color: theme.colors.text.primary,
        marginBottom: 2
    },
    subtitle: {
        fontSize: theme.typography.fontSizes.sm,
        color: theme.colors.text.secondary,
        fontWeight: '500'
    },
    inputGroup: {
        marginBottom: theme.spacing.lg
    },
    label: {
        fontSize: theme.typography.fontSizes.xs,
        fontWeight: '700',
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    counterSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    counterIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md
    },
    counterIconText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 16
    },
    counterValue: {
        flex: 1,
        fontSize: theme.typography.fontSizes.md,
        fontWeight: '600',
        color: theme.colors.text.primary
    },
    dropdownIcon: {
        fontSize: 12,
        color: theme.colors.text.secondary
    },
    pinInput: {
        backgroundColor: '#F1F5F9',
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        fontSize: 24,
        textAlign: 'center',
        fontWeight: 'bold',
        letterSpacing: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        color: theme.colors.text.primary
    },
    loginButton: {
        marginTop: theme.spacing.md,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6
    },
    versionText: {
        marginTop: theme.spacing.xl,
        color: theme.colors.text.light,
        fontSize: theme.typography.fontSizes.xs
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)', // Darker overlay
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg
    },
    modalContent: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: theme.spacing.xl,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
        elevation: 20
    },
    modalTitle: {
        fontSize: theme.typography.fontSizes.xl,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs
    },
    modalSubtitle: {
        fontSize: theme.typography.fontSizes.sm,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xl
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
        marginBottom: theme.spacing.xl
    },
    counterOption: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent'
    },
    selectedOption: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        transform: [{ scale: 1.05 }]
    },
    optionText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text.secondary
    },
    selectedOptionText: {
        color: '#fff'
    },
    modalButton: {
        width: '100%'
    }
});
