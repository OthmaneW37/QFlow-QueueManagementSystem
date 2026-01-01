/**
 * Service for handling staff authentication
 */
export const AuthService = {
    // Hardcoded PINs for MVP
    // In production, these should be stored securely in Firebase/Database
    VALID_PINS: ['1234', '0000', '1111', '8888'],

    /**
     * Attempt to login with a PIN
     * @param {string} pin - The PIN to validate
     * @returns {Promise<boolean>} - True if valid, false otherwise
     */
    loginWithPin: async (pin) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return AuthService.VALID_PINS.includes(pin);
    },

    /**
     * Get user details (mock)
     */
    getUser: () => {
        return {
            role: 'staff',
            name: 'Staff Member'
        };
    }
};
