import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../shared/theme';

export default function GameScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>← Back to Queue</Text>
            </TouchableOpacity>

            <View style={styles.gameWrapper}>
                <iframe
                    src="https://nebez.github.io/floppybird/"
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                    }}
                    title="Flappy Bird"
                />
            </View>

            <Text style={styles.hint}>Click or Tap to Fly!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333',
        alignItems: 'center',
        paddingTop: 60,
    },
    gameWrapper: {
        width: 320,
        height: 480,
        backgroundColor: '#000',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: '#555',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        zIndex: 10
    },
    backButtonText: {
        fontWeight: 'bold',
        color: theme.colors.primary,
    },
    hint: {
        color: '#fff',
        marginTop: 20,
        opacity: 0.7
    }
});
