import "@walletconnect/react-native-compat";

import { useAppKit } from '@reown/appkit-ethers-react-native';

import { colors, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { useAuth } from '@/context/AuthContext';


const welcome = () => {
    const router = useRouter()
    const { user, loading } = useAuth()
    const { open } = useAppKit()

    useEffect(() => {
        console.log('Welcome page - User:', user);
        // Removed navigation logic to prevent conflicts with RootNavigation
    }, [user, loading])

    const handleCustomAppKitPress = () => {
        console.log('Custom AppKit button pressed');
        try {
            open();
        } catch (error) {
            console.error('Error opening AppKit:', error);
        }
    }

  return (
    <SafeAreaView style={{flex:1, backgroundColor:colors.neutral900}}>

      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginbutton}>
            <Text style={styles.text}>Login</Text>
        </TouchableOpacity>

        <Animated.Image entering={FadeIn.duration(1000)} source={require('@/assets/images/newone.png')} style={styles.welcomeImage} resizeMode='contain'/>
        
        <View style={styles.footer}>
            <Animated.View style={{alignItems:'center'}} entering={FadeInDown.duration(1000).springify().damping(12)}>
                <Text style={{color:"white", fontSize:28, fontWeight:'bold'}}>Your Ai. Your Thoughts</Text>
            </Animated.View>

            <Animated.View style={{alignItems:'center', gap:2}} entering={FadeInDown.duration(1000).delay(100).springify().damping(12)}>
                <Text style={{color:"white", fontSize:18}}>Your Ai. Your Thoughts</Text>
                {/* <Text style={{color:"white", fontSize:18}}>Your Ai. Your Thoughts</Text> */}
            </Animated.View>

            <Animated.View style={styles.buttonContainer} entering={FadeInDown.duration(1000).delay(200).springify().damping(12)}>
                <TouchableOpacity onPress={() => router.push('/register')} style={styles.button}>
                    <Text style={{color:colors.neutral900, fontSize:18, fontWeight:'bold'}}>Get Started</Text>
                </TouchableOpacity>
                {/* <AppKitButton />    */}
            </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#171717',
        paddingTop:spacingY._7
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginbutton: {
        alignSelf:'flex-end',
        marginRight:spacingX._20
    },
    welcomeImage: {
        // backgroundColor:'red',
        width: '90%',
        height: verticalScale(200),
        alignSelf:'center',
        // marginTop:verticalScale(100),
    },
    footer: {
        backgroundColor: colors.neutral900,
        alignItems:'center',
        paddingTop:verticalScale(30),
        paddingBottom:verticalScale(45),
        gap:spacingY._10,
        shadowColor:'white',
        shadowOffset: {width:0, height:-10},
        elevation:10,
        shadowRadius:25,
        shadowOpacity:0.15
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal:spacingX._25,
        gap: spacingY._10,
    },
    button: {
        backgroundColor:colors.primary,
        padding:spacingY._7,
        alignItems:'center',
        borderRadius:12,
    }
})

// // app/(auth)/welcome.tsx
// import { AppKitButton, useAppKit, useAppKitAccount } from "@reown/appkit-ethers-react-native";
// import React, { useEffect } from "react";
// import { Pressable, Text, View } from "react-native";

// export default function Welcome() {
//   const { open, close } = useAppKit();
//   const { address, isConnected, chainId } = useAppKitAccount();

//   useEffect(() => {
//     console.log("[Welcome] isConnected:", isConnected, "addr:", address, "chainId:", chainId);
//   }, [isConnected, address, chainId]);

//   return (
//     <View style={{ flex: 1, padding: 24, justifyContent: "center", gap: 16 }}>
//       <Text style={{ fontSize: 24, fontWeight: "700", color: "white" }}>Welcome</Text>
//       <Text style={{ color: "white", opacity: 0.7 }}>
//         Connect your wallet to continue.
//       </Text>

//       {/* Built-in button */}
//       <AppKitButton />

//       {/* Manual trigger (great for debugging) */}
//       <Pressable onPress={() => open()} style={{ padding: 14, backgroundColor: "white", borderRadius: 12 }}>
//         <Text style={{ textAlign: "center", fontWeight: "700" }}>Open AppKit</Text>
//       </Pressable>

//       {/* <Text style={{ color: "white" }}>Status: {status}</Text> */}
//       <Text style={{ color: "white" }}>{isConnected ? `Address: ${address}` : "Not connected"}</Text>
//       <Text style={{ color: "white" }}>{chainId ? `Chain: ${Number(chainId)}` : ""}</Text>
//     </View>
//   );
// }


