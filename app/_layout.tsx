import "@walletconnect/react-native-compat";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppKit, createAppKit, defaultConfig } from "@reown/appkit-ethers-react-native";

let APPKIT_INIT = false;
function initAppKitOnce() {
  if (APPKIT_INIT) return;
  APPKIT_INIT = true;

  const projectId = "0d70fc8cf98c1a5ffdd6ac8da4ebc686";

  const metadata = {
    name: "Zeph App",
    description: "Zeph Wellness AI",
    url: "https://zeph.io",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
    redirect: { native: "zeph://" },
  };

  // Sapphire testnet
  const sapphire = {
    chainId: 23295,
    name: "Oasis Sapphire Testnet",
    currency: "ROSE",
    explorerUrl: "https://testnet.explorer.sapphire.oasis.io",
    rpcUrl: "https://testnet.sapphire.oasis.io",
  };

  // ✅ Proper config
  const config = defaultConfig({ metadata });

  // ✅ Initialize AppKit with chain
  createAppKit({
    projectId,
    metadata,
    config,
    chains: [sapphire],
    enableAnalytics: true,
  });
}

function RootNavigation() {
  const { loading, user, onboarded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/welcome");
      return;
    }

    // 🔥 user is logged in but not onboarded
    if (onboarded === false) {
      router.replace("/(onboarding)/profile");
      return;
    }

    // 🔥 user onboarded → go home
    if (onboarded === true) {
      router.replace("/(tabs)");
      return;
    }

  }, [loading, user, onboarded]);

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#171717" }}>
        <ActivityIndicator size="large" color="#3ba7f5" />
      </View>
    );

  return <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />;
}

export default function RootLayout() {
  useEffect(() => {
    initAppKitOnce();
  }, []);

  return (
    <AuthProvider>
      {/* ✅ Must be mounted globally so events (like session_request) are handled */}
      <AppKit />
      <RootNavigation />
    </AuthProvider>
  );
}
