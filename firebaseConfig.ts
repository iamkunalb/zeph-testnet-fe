// // firebaseConfig.ts
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getApp, getApps, initializeApp } from "firebase/app";
// import { Auth, getReactNativePersistence, initializeAuth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyBZjYL3UrnfAeZe0-q161Dt9mq-6U2gYd8",
//   authDomain: "zeph-new.firebaseapp.com",
//   projectId: "zeph-new",
//   storageBucket: "zeph-new.firebasestorage.app",
//   messagingSenderId: "630719331401",
//   appId: "1:630719331401:web:a97746caff10ad4f585398"
// };

// // ✅ Initialize the app (only once)
// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// // ✅ Always initialize Auth with persistence in RN
// // Don't use getAuth() — it skips AsyncStorage
// const auth: Auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

// export { app, auth };

// firebaseConfig.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import {
  initializeFirestore,
  memoryLocalCache,
  setLogLevel,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZjYL3UrnfAeZe0-q161Dt9mq-6U2gYd8",
  authDomain: "zeph-new.firebaseapp.com",
  projectId: "zeph-new",
  storageBucket: "zeph-new.firebasestorage.app",
  messagingSenderId: "630719331401",
  appId: "1:630719331401:web:a97746caff10ad4f585398",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// RN auth + persistence
const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// 🔧 RN-safe Firestore transport
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,  // hard-force long polling
  localCache: memoryLocalCache(),      // simple in-memory cache
});

// Quiet SDK noise once verified working
setLogLevel("error");

export { app, auth, db };
