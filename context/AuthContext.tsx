import { auth, db } from '@/firebaseConfig';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';


type AuthContextType = {
  user: User | null;
  loading: boolean;
  onboarded: boolean | null;
  userprofile: any | null;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  onboarded: null,
  userprofile: null,
  logout: async () => {},
  refreshUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  const [userprofile, setuserProfile] = useState<any | null>(null);


    useEffect(() => {
      const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);

          // 🔥 check Firestore onboarding flag
          const ref = doc(db, "users", firebaseUser.uid);
          const snap = await getDoc(ref);

          if (snap.exists()) {
            const data = snap.data();
            setOnboarded(data.profileComplete === true);
            setuserProfile(data);
          } else {
            setOnboarded(false); // new user, no doc yet
            setuserProfile(null);
          }

        } else {
          setUser(null);
          setOnboarded(null);
        }

        setLoading(false);
      });

      return () => unsub();
    }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setOnboarded(data.profileComplete === true);
          setuserProfile(data);
        } else {
          setOnboarded(false);
          setuserProfile(null);
        }
      } catch (error) {
        console.error('Error refreshing user profile:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, onboarded, userprofile, refreshUserProfile}}>
      {children}
    </AuthContext.Provider>
  );
};