// src/core/firebaseConfig.js

// FIXME: Firebase package is corrupt/missing. 
// Using Mock Config to allow app to start in "Simulation Mode".

const app = {
    options: {
        apiKey: "" // Empty key triggers Mock Mode in queueService
    }
};

export default app;
