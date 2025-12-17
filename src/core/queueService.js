import app from './firebaseConfig';
import { getDatabase, ref, onValue, push, set, serverTimestamp, query, limitToLast, orderByKey } from 'firebase/database';

class QueueService {
    constructor() {
        this.listeners = [];
        this.unsubscribeFirebase = null;
        this.db = getDatabase(app);
    }

    // Subscribe to updates (TV Mode)
    subscribe(callback) {
        this.listeners.push(callback);

        if (!this.unsubscribeFirebase) {
            this.startRealtimeListener();
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

    startRealtimeListener() {
        // Listen to the current ticket being served
        const currentTicketRef = ref(this.db, 'current_display_ticket');

        // Listen to the last 3 tickets in history
        const historyRef = query(ref(this.db, 'queue_history'), limitToLast(3));

        // We combine these into a single update for simplicity, 
        // in a real app you might want separate listeners or a more robust state sync.

        // For this demo, we'll just listen to current_display_ticket and fetch history when it changes
        // OR better: Listen to both independently and merge state.

        const handleUpdate = () => {
            // This simple implementation relies on the 'current_display_ticket' node
            // containing { number: 'A001', counter: 1 }

            // And 'queue_history' being a list of tickets.
        };

        this.unsubscribeFirebase = onValue(currentTicketRef, (snapshot) => {
            const currentData = snapshot.val() || { number: '----', counter: '-' };

            // Allow getting history inside this callback or separately
            // For simplicity/performance in this specific requested flow, let's just grab the history snapshot too
            // But technically onValue is async. 
            // Let's set up a separate listener for history to be correct.
        });

        // RE-IMPLEMENTATION:
        // Use a single listener approach or managed state

        // 1. Current Ticket Listener
        this.currentUnsub = onValue(currentTicketRef, (snapshot) => {
            this.currentTicketCache = snapshot.val() || { number: '----', counter: '-' };
            this.broadcastState();
        });

        // 2. History Listener
        this.historyUnsub = onValue(historyRef, (snapshot) => {
            const rawHistory = snapshot.val();
            const historyList = rawHistory
                ? Object.values(rawHistory).reverse()
                : [];

            this.historyCache = historyList;
            this.broadcastState();
        });
    }

    broadcastState() {
        this.notify({
            current: this.currentTicketCache || { number: '----', counter: '-' },
            history: this.historyCache || []
        });
    }

    // Add a new ticket (Client Mode)
    async addTicket() {
        try {
            const ticketsRef = ref(this.db, 'queue_history');
            const currentDisplayRef = ref(this.db, 'current_display_ticket');

            // Generate a simple ticket number based on timestamp or random for now
            // In a real app, you'd use a transaction to increment a counter.
            const randomNum = Math.floor(Math.random() * 999) + 1;
            const ticketNumber = `A${randomNum.toString().padStart(3, '0')}`;
            const counter = Math.floor(Math.random() * 5) + 1;

            const newTicket = {
                number: ticketNumber,
                counter: counter,
                timestamp: serverTimestamp()
            };

            // 1. Add to History
            await push(ticketsRef, newTicket);

            // 2. Update Current Display (Trigger TV update)
            await set(currentDisplayRef, newTicket);

            return newTicket;

        } catch (error) {
            console.error("Error adding ticket:", error);
            throw error;
        }
    }

    stop() {
        if (this.currentUnsub) this.currentUnsub();
        if (this.historyUnsub) this.historyUnsub();
        this.unsubscribeFirebase = null;
    }
}

export const queueService = new QueueService();
