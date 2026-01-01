# QFlow - Folder Structure

This document explains the **Feature-First Architecture** used in this project, designed for parallel development by 4 team members.

## Directory Tree

```
QFlow/
├── App.js                          # Root navigation setup
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── .gitignore                      # Git exclusions
│
├── assets/                         # Static resources
│   ├── icon.png                    # App icon (needs to be added)
│   ├── splash.png                  # Splash screen (needs to be added)
│   ├── adaptive-icon.png           # Android adaptive icon
│   └── sounds/                     # Audio files (Student B)
│       └── notification.mp3        # Ding-dong sound
│
└── src/
    ├── screens/                    # Shared screens
    │   └── HubScreen.js            # Landing page (mode selection)
    │
    ├── shared/                     # Student A's domain
    │   ├── config/
    │   │   └── firebaseConfig.js   # Firebase initialization
    │   │
    │   ├── theme/
    │   │   └── index.js            # Colors, fonts, spacing
    │   │
    │   └── components/
    │       ├── AppButton.js        # Reusable button
    │       └── AppCard.js          # Reusable card wrapper
    │
    └── features/                   # Feature modules (one per student)
        │
        ├── tv/                     # Student B's domain
        │   └── TVScreen.js         # TV Display Mode
        │                           # - Firebase listener (/current_ticket)
        │                           # - Sound notification
        │                           # - Video player
        │
        ├── staff/                  # Student C's domain
        │   └── StaffDashboard.js   # Staff Dashboard
        │                           # - Call Next function
        │                           # - Queue management
        │                           # - Admin controls
        │
        └── client/                 # Student D's domain
            └── ClientTicket.js     # Client Ticket Mode
                                    # - Take Ticket function
                                    # - Live queue status
```

## Architecture Principles

### 1. Feature-First Organization
Each feature (TV, Staff, Client) has its own isolated folder. This allows team members to work independently without merge conflicts.

### 2. Shared Resources
Common utilities, components, theme, and Firebase config are centralized in `/shared` to ensure consistency.

### 3. Single Entry Point
`App.js` serves as the navigation hub, connecting all features.

---

## Team Member Assignments

| Student | Domain | Primary Files | Responsibilities |
|---------|--------|---------------|------------------|
| **Student A** | Core & Shared | `src/shared/*`, `firebaseConfig.js` | Project setup, Firebase credentials, theme, reusable components |
| **Student B** | TV Display | `src/features/tv/TVScreen.js` | Firebase listener, sound notification, video player integration |
| **Student C** | Staff | `src/features/staff/StaffDashboard.js` | Queue control, "Call Next" transaction, admin controls |
| **Student D** | Client | `src/features/client/ClientTicket.js` | Ticket generation, queue position tracking |

---

## Git Workflow Recommendation

To minimize conflicts, follow these guidelines:

1. **Branch Naming:**
   - `feature/student-a-shared-setup`
   - `feature/student-b-tv-display`
   - `feature/student-c-staff-dashboard`
   - `feature/student-d-client-ticket`

2. **Pull Requests:**
   - Each student creates PRs for their feature folder
   - Student A merges shared components first
   - Others merge after Student A's setup is complete

3. **Avoid Editing:**
   - Don't edit files outside your assigned domain
   - If shared components need changes, coordinate with Student A

---

## File Ownership Reference

### Student A (Core)
- ✅ `package.json`
- ✅ `app.json`
- ✅ `src/shared/config/firebaseConfig.js`
- ✅ `src/shared/theme/index.js`
- ✅ `src/shared/components/AppButton.js`
- ✅ `src/shared/components/AppCard.js`

### Student B (TV)
- ✅ `src/features/tv/TVScreen.js`
- 🔄 Add: `assets/sounds/notification.mp3`
- 🔄 Optional: Video component integration

### Student C (Staff)
- ✅ `src/features/staff/StaffDashboard.js`
- 🔄 Enhance: Admin controls (volume, etc.)

### Student D (Client)
- ✅ `src/features/client/ClientTicket.js`
- 🔄 Enhance: UI polish, animations

### Shared (All)
- ✅ `App.js` (navigation routes)
- ✅ `src/screens/HubScreen.js` (landing page)

---

## Notes

- **Assets:** The `assets/` folder needs to be populated with actual images and sounds
- **Modularity:** Each feature can have sub-components (e.g., `tv/components/VideoPlayer.js`)
- **Testing:** Each student should be able to test their feature independently using Firebase

This structure ensures clean separation of concerns and enables productive parallel development! 🚀
