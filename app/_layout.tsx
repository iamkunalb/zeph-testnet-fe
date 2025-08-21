import "@walletconnect/react-native-compat";

import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppKit, createAppKit, defaultConfig } from "@reown/appkit-ethers-react-native";

// ---- AppKit init (singleton guard) ----
let APPKIT_INIT = false;
function initAppKitOnce() {
  if (APPKIT_INIT) return;
  APPKIT_INIT = true;

  const projectId = "0d70fc8cf98c1a5ffdd6ac8da4ebc686";

    // 2. Create config
    const metadata = {
    name: "AppKit RN",
    description: "AppKit RN Example",
    url: "https://reown.com/appkit",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
    redirect: {
        native: "myapp://",
    },
    };


  const config = defaultConfig({ metadata });

  const mainnet = {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
  };

  const sapphire = {
    chainId: 23295,
    name: "Oasis Sapphire Testnet",
    currency: "TEST",
    explorerUrl: "https://testnet.explorer.sapphire.oasis.io",
    rpcUrl: "https://testnet.sapphire.oasis.io",
  };



  createAppKit({
    projectId,
    metadata,
    config,
    chains: [mainnet, sapphire],
    enableAnalytics: true,
  });

}

function RootNavigation() {
  const { loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('RootNavigation - Loading:', loading, 'User:', user?.email);
    
    if (!loading) {
      console.log('RootNavigation - Auth state resolved. User:', user?.email);
      
      if (user) {
        console.log('User exists, navigating to tabs');
        router.replace("/(tabs)");
      } else {
        console.log('No user, navigating to welcome');
        router.replace("/welcome");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: '#171717' }}>
        <ActivityIndicator size="large" color="#3ba7f5" />
      </View>
    );
  }

  // When not loading, render your stacks normally.
  return <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />;
}

export default function RootLayout() {
  useEffect(() => {
    initAppKitOnce();
  }, []);

  return (
    <AuthProvider>
      {/* AppKit must stay mounted globally so the modal works anywhere */}
      <AppKit />
      <RootNavigation />
    </AuthProvider>
  );
}
