import app from './firebaseConfig';
import { getDatabase, ref, onValue } from 'firebase/database';

// Helper to check if Firebase is configured
const isFirebaseConfigured = () => {
    return app.options && app.options.apiKey !== "";
};

class QueueService {
    constructor() {
        this.listeners = [];
        this.currentTicket = { number: 'A000', counter: 1 };
        this.history = [];
        this.mockInterval = null;
    }

    // Subscribe to updates
    subscribe(callback) {
        this.listeners.push(callback);

        if (isFirebaseConfigured()) {
            this.startRealtimeListener();
        } else {
            console.log("Firebase not configured. Starting Mock Mode.");
            this.startMockSimulation();
        }

        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
            if (this.listeners.length === 0) {
                this.stop();
            }
        };
    }

    notify(data) {
        this.listeners.forEach(cb => cb(data));
    }

    // Real implementation (disabled until keys provided)
    startRealtimeListener() {
        // Placeholder for future implementation
        // const db = getDatabase(app);
        // ...
    }

    // Mock Simulation for testing on TV
    startMockSimulation() {
        if (this.mockInterval) return;

        let counter = 1;

        this.mockInterval = setInterval(() => {
            // Generate next ticket
            const nextNum = counter++;
            const ticketNumber = `A${nextNum.toString().padStart(3, '0')}`;

            // Add previous to history
            if (this.currentTicket.number !== 'A000') {
                this.history = [this.currentTicket, ...this.history].slice(0, 3);
            }

            this.currentTicket = {
                number: ticketNumber,
                counter: Math.floor(Math.random() * 5) + 1 // Random counter 1-5
            };

            this.notify({
                current: this.currentTicket,
                history: this.history
            });

        }, 5000); // New ticket every 5 seconds
    }

    stop() {
        if (this.mockInterval) {
            clearInterval(this.mockInterval);
            this.mockInterval = null;
        }
    }
}

export const queueService = new QueueService();
