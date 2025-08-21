// firebaseConfig.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getReactNativePersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBZjYL3UrnfAeZe0-q161Dt9mq-6U2gYd8",
  authDomain: "zeph-new.firebaseapp.com",
  projectId: "zeph-new",
  storageBucket: "zeph-new.firebasestorage.app",
  messagingSenderId: "630719331401",
  appId: "1:630719331401:web:a97746caff10ad4f585398"
};

// ✅ Initialize the app (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Always initialize Auth with persistence in RN
// Don't use getAuth() — it skips AsyncStorage
const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };
