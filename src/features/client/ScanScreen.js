import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Button, Dimensions, Alert } from 'react-native';
import { CameraView, Camera } from "expo-camera";
import { theme } from '../../shared/theme';
import { AppButton } from '../../shared/components/AppButton';

const { width } = Dimensions.get('window');

// The token we expect to see in the QR code. 
const ACCESS_TOKEN = "QFLOW_ACCESS_TOKEN";

export default function ScanScreen({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    // Lock to prevent multiple scans
    const isProcessing = useRef(false);

    useEffect(() => {
        const getPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };
        getPermissions();

        // Cleanup lock on unmount
        return () => { isProcessing.current = false; };
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        // Strict guard clause
        if (scanned || isProcessing.current) return;

        isProcessing.current = true;
        setScanned(true);

        if (data === ACCESS_TOKEN) {
            Alert.alert(
                "Access Granted",
                "You have successfully joined the location.",
                [{
                    text: "OK",
                    onPress: () => {
                        navigation.replace("Client");
                        // Note: We NOT resetting isProcessing here because we are navigating away.
                    }
                }],
                { cancelable: false } // Prevent dismissing by tapping outside
            );
        } else {
            console.log("Scanned data:", data);
            Alert.alert(
                "Invalid QR Code",
                "This QR code is not valid for this queue.",
                [{
                    text: "Try Again",
                    onPress: () => {
                        setScanned(false);
                        // Add a small delay before allowing another scan to prevent accidental double-scans
                        setTimeout(() => {
                            isProcessing.current = false;
                        }, 1000);
                    }
                }],
                { cancelable: false }
            );
        }
    };

    if (hasPermission === null) {
        return <View style={styles.container}><Text>Requesting for camera permission...</Text></View>;
    }
    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text>No access to camera</Text>
                <Button title={"Allow Camera"} onPress={() => Camera.requestCameraPermissionsAsync()} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Scan to Join</Text>
                <Text style={styles.subtitle}>Scan the QR code on the TV display</Text>
            </View>

            <View style={styles.cameraContainer}>
                <CameraView
                    // Disable the callback completely if we have scanned
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr", "pdf417"],
                    }}
                    style={StyleSheet.absoluteFillObject}
                />
                {/* Visual Overlay Marker */}
                <View style={styles.marker} />
            </View>

            {scanned && (
                <View style={styles.processingOverlay}>
                    <Text style={styles.processingText}>Processing...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.text.secondary,
    },
    cameraContainer: {
        width: width * 0.8,
        height: width * 0.8,
        overflow: 'hidden',
        borderRadius: 20,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    marker: {
        width: 200,
        height: 200,
        borderWidth: 2,
        borderColor: '#fff',
        opacity: 0.5,
    },
    processingOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
    },
    processingText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    }
});
