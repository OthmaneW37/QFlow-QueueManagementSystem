# Queue Management System Setup

## 1. Project Structure (Tree View)

```
/
├── App.js                      # Entry point (Navigation Root)
├── package.json
├── src/
│   ├── core/
│   │   ├── firebaseConfig.js   # Firebase initialization
│   │   └── theme.js            # Shared styles/colors
│   └── features/
│       ├── client/
│       │   └── screens/
│       │       └── ClientHomeScreen.js
│       ├── staff/
│       │   └── screens/
│       │       └── StaffHomeScreen.js
│       └── tv/
│           └── screens/
│               └── TVHomeScreen.js
```

## 2. Dependencies (Install Commands)

Run these commands in your project root to install the required packages for React Navigation and Firebase.

### For Expo (Recommended)
```bash
npx expo install react-native-screens react-native-safe-area-context
npm install @react-navigation/native @react-navigation/native-stack firebase
```

### For React Native CLI
```bash
npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context firebase
# Don't forget pod install for iOS
cd ios && pod install
```

## 3. Next Steps

1.  Copy the content of `src/core/firebaseConfig.js` and add your actual Firebase keys.
2.  Run the app: `npx expo start` (or `npx react-native run-android/ios`).
3.  Assign features to your team:
    *   **Feature A**: `src/features/shared` & `src/core`
    *   **Feature B**: `src/features/tv`
    *   **Feature C**: `src/features/staff`
    *   **Feature D**: `src/features/client`
