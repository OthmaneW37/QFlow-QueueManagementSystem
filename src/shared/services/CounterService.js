import { ref, get, set, serverTimestamp, onDisconnect } from 'firebase/database';
import { database } from '../config/firebaseConfig';

export const CounterService = {
    /**
     * Checks if a counter is currently active/occupied.
     * @param {string} counterId 
     * @returns {Promise<boolean>} true if available, false if occupied
     */
    async isCounterAvailable(counterId) {
        try {
            const counterRef = ref(database, `counters_status/${counterId}`);
            const snapshot = await get(counterRef);
            const data = snapshot.val();

            // If no data, it's available. If is_active is true, it's taken.
            if (data && data.is_active) {
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking counter status:', error);
            return false; // Fail safe
        }
    },

    /**
     * Locks the counter for the current user.
     * Also sets an onDisconnect hook to auto-release if the app crashes/closes.
     * @param {string} counterId 
     */
    async lockCounter(counterId) {
        try {
            const counterRef = ref(database, `counters_status/${counterId}`);

            // Set active status
            await set(counterRef, {
                is_active: true,
                last_login: new Date().toISOString()
            });

            // Auto-release on disconnect (if internet cut or crash)
            onDisconnect(counterRef).update({
                is_active: false
            });

            return true;
        } catch (error) {
            console.error('Error locking counter:', error);
            return false;
        }
    },

    /**
     * Releases the counter (manually on logout).
     * @param {string} counterId 
     */
    async releaseCounter(counterId) {
        try {
            const counterRef = ref(database, `counters_status/${counterId}`);
            await set(counterRef, {
                is_active: false,
                last_logout: new Date().toISOString()
            });

            // Cancel onDisconnect hook? 
            // onDisconnect().cancel() is usually good practice but setting to false covers it.
            return true;
        } catch (error) {
            console.error('Error releasing counter:', error);
            return false;
        }
    }
};
