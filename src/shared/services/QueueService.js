import { ref, set, remove, get, query, orderByChild, limitToFirst } from 'firebase/database';
import { database } from '../config/firebaseConfig';

/**
 * Service for Queue Operations
 */
export const QueueService = {
    /**
     * Call the next ticket in the queue
     * @returns {Promise<object|null>} The ticket that was called, or null if empty
     */
    callNextTicket: async (counterId = '1') => {
        try {
            // 1. Get the first ticket
            const waitingListRef = ref(database, 'waiting_list');
            const firstTicketQuery = query(waitingListRef, orderByChild('timestamp'), limitToFirst(1));
            const snapshot = await get(firstTicketQuery);

            if (!snapshot.exists()) {
                return null;
            }

            // Get ID and data of first ticket
            const ticketId = Object.keys(snapshot.val())[0];
            const ticketData = snapshot.val()[ticketId];

            // 2. Set as current ticket
            const currentTicketRef = ref(database, 'current_ticket');
            await set(currentTicketRef, {
                ...ticketData,
                calledAt: new Date().toISOString(),
                counter: counterId
            });

            // 3. Remove from waiting list
            const ticketRef = ref(database, `waiting_list/${ticketId}`);
            await remove(ticketRef);

            return ticketData;
        } catch (error) {
            console.error('QueueService: Error calling next ticket', error);
            throw error;
        }
    },

    /**
     * Get queue metrics
     */
    getQueueMetrics: async () => {
        try {
            const snapshot = await get(ref(database, 'waiting_list'));
            if (!snapshot.exists()) return { count: 0 };
            return { count: Object.keys(snapshot.val()).length };
        } catch (error) {
            console.error('QueueService: Error getting metrics', error);
            return { count: 0 };
        }
    }
};
