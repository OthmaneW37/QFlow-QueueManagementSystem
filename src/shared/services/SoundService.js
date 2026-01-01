import { Audio } from 'expo-av';

/**
 * Service for Sound Notifications
 */
export const SoundService = {
    /**
     * Play a notification sound
     */
    playNotificationSound: async () => {
        try {
            console.log('SoundService: Configuring audio mode...');
            // Configure audio mode to play even if the switch is set to silent
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
                staysActiveInBackground: false,
            });

            console.log('SoundService: Playing notification sound 🎵');

            // Using a reliable sound from Expo's official demo assets
            const { sound } = await Audio.Sound.createAsync(
                { uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
                { shouldPlay: true }
            );

            sound.setOnPlaybackStatusUpdate(async (status) => {
                if (status.didJustFinish) {
                    await sound.unloadAsync();
                }
            });

        } catch (error) {
            console.error('SoundService: Error playing sound', error);
        }
    }
};
