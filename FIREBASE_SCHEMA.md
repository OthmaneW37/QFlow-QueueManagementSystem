# Firebase Realtime Database Schema

This document defines the exact structure to use in your Firebase Realtime Database for the QFlow Smart Queue Management System.

## Database Structure (JSON)

```json
{
  "current_ticket": {
    "number": "A-042",
    "calledAt": "2025-12-12T16:45:00.000Z"
  },
  
  "waiting_list": {
    "-NxKj9dF3mLp0qR8sT1u": {
      "number": "A-043",
      "timestamp": "2025-12-12T16:46:15.000Z"
    },
    "-NxKjA2F8nMq1rS9tU2v": {
      "number": "A-044",
      "timestamp": "2025-12-12T16:47:30.000Z"
    },
    "-NxKjB7G9oNr2sT0uV3w": {
      "number": "A-045",
      "timestamp": "2025-12-12T16:48:45.000Z"
    }
  },
  
  "config": {
    "scrolling_text": "Welcome to QFlow Smart Queue System",
    "volume": 80
  }
}
```

## Node Descriptions

### `/current_ticket`
**Type:** Object  
**Purpose:** Stores the ticket currently being served  
**Updated by:** Staff Dashboard (when "Call Next" is clicked)  
**Listened by:** TV Display Mode

**Fields:**
- `number` (string): The ticket number (e.g., "A-042")
- `calledAt` (string): ISO timestamp when the ticket was called

---

### `/waiting_list`
**Type:** Object (Push-based)  
**Purpose:** Queue of customers waiting to be served  
**Updated by:** Client Ticket Mode (adds new tickets)  
**Removed by:** Staff Dashboard (removes when calling next)  
**Listened by:** Staff Dashboard, Client Ticket Mode

**Child Structure:**
Each child has an auto-generated Firebase key (e.g., `-NxKj9dF3mLp0qR8sT1u`)

**Fields:**
- `number` (string): Unique ticket number (e.g., "A-045")
- `timestamp` (string): ISO timestamp when ticket was generated

---

### `/config`
**Type:** Object  
**Purpose:** System configuration and IoT admin controls  
**Updated by:** Staff Dashboard (admin controls)  
**Listened by:** TV Display Mode

**Fields:**
- `scrolling_text` (string): Message displayed on TV banner
- `volume` (number): Audio volume level (0-100)

---

## Setup Instructions for Student A

1. **Create Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project"
   - Name it "QFlow" (or your preference)
   - Disable Google Analytics (optional)

2. **Enable Realtime Database:**
   - In Firebase Console, go to **Build** → **Realtime Database**
   - Click "Create Database"
   - Choose your region
   - Start in **Test Mode** (for development only)
   
   > **⚠️ IMPORTANT:** Test mode allows anyone to read/write. Before production, set proper security rules!

3. **Get Your Config Credentials:**
   - Go to **Project Settings** (gear icon) → **General**
   - Scroll to "Your apps" section
   - Click the **Web** icon (`</>`) to add a web app
   - Register app with a nickname (e.g., "QFlow Web")
   - Copy the `firebaseConfig` object
   - Paste values into `src/shared/config/firebaseConfig.js`

4. **Initialize Data (Optional):**
   - Go to Realtime Database in Firebase Console
   - Click the **+** icon next to your database URL
   - Paste the sample JSON from above to start with dummy data

5. **Security Rules (For Production):**
   ```json
   {
     "rules": {
       "current_ticket": {
         ".read": true,
         ".write": "auth != null"
       },
       "waiting_list": {
         ".read": true,
         ".write": true
       },
       "config": {
         ".read": true,
         ".write": "auth != null"
       }
     }
   }
   ```

---

## IoT Data Flow

### 1. Client Takes Ticket
```
Client App → Firebase Push → /waiting_list/{id}
```

### 2. Staff Calls Next
```
Staff App → Firebase Transaction:
  1. Read first item from /waiting_list
  2. Write to /current_ticket
  3. Delete from /waiting_list/{id}
```

### 3. TV Updates Display
```
Firebase /current_ticket → onValue listener → TV Screen UI Update
```

This creates a real-time **Action → Reaction** flow demonstrating IoT principles.
