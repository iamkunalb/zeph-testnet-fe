import "@walletconnect/react-native-compat";

import { useAppKit } from '@reown/appkit-ethers-react-native';

import { colors, spacingX } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';


import { useAuth } from '@/context/AuthContext';
import React from "react";

const Welcome = () => {
    const router = useRouter()
    const { user, loading } = useAuth()
    const { open } = useAppKit()

    useEffect(() => {
        console.log('Welcome page - User:', user);
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
    <SafeAreaView style={{flex:1, backgroundColor: colors.white}}>
      <View style={styles.container}>
        
        {/* Skip Button */}
        {/* <Animated.View entering={FadeIn.duration(800)} style={styles.skipContainer}>
          <TouchableOpacity style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </Animated.View> */}

        {/* Main Content Area */}
        <View style={styles.contentArea}>
          {/* Graphics Section */}
          <View style={styles.graphicsContainer}>
            {/* Purple 3D Shape */}
            <View style={styles.purpleShape} />
            
            {/* Blue Triangle with Star */}
            <View style={styles.blueTriangle}>
              <View style={styles.starCutout} />
            </View>
            
            {/* Green Rounded Square */}
            <View style={styles.greenSquare}>
              <View style={styles.circleCutout} />
            </View>
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.heading}>Zeph</Text>
            <Text style={styles.bodyText}>
            Your AI. Your Thoughts. Your Privacy.
            </Text>
          </View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          {/* Page Indicators */}
          <View style={styles.pageIndicators}>
            <View style={styles.activeIndicator} />
            <View style={styles.inactiveIndicator} />
            <View style={styles.inactiveIndicator} />
            <View style={styles.inactiveIndicator} />
          </View>

          {/* Next Button */}
          <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/login')}>
            <Text style={styles.nextButtonText}>Get Started</Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    skipContainer: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    skipButton: {
        backgroundColor: '#E8E0FF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    skipText: {
        color: colors.neutral900,
        fontSize: 14,
        fontWeight: '500',
    },
    contentArea: {
        flex: 1,
        paddingTop: 100,
        paddingHorizontal: 20,
    },
    graphicsContainer: {
        flex: 1,
        position: 'relative',
        backgroundColor: colors.white,
    },
    purpleShape: {
        position: 'absolute',
        left: 20,
        top: 50,
        width: 120,
        height: 160,
        backgroundColor: '#8B5CF6',
        borderRadius: 20,
        transform: [{ rotate: '15deg' }],
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    blueTriangle: {
        position: 'absolute',
        right: 30,
        top: 80,
        width: 80,
        height: 80,
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        transform: [{ rotate: '45deg' }],
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    starCutout: {
        width: 20,
        height: 20,
        backgroundColor: colors.white,
        borderRadius: 2,
        transform: [{ rotate: '45deg' }],
    },
    greenSquare: {
        position: 'absolute',
        right: 40,
        bottom: 120,
        width: 60,
        height: 60,
        backgroundColor: '#10B981',
        borderRadius: 12,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleCutout: {
        width: 16,
        height: 16,
        backgroundColor: colors.white,
        borderRadius: 8,
    },
    textContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    heading: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.neutral900,
        marginBottom: 16,
        lineHeight: 40,
    },
    bodyText: {
        fontSize: 16,
        color: colors.neutral700,
        lineHeight: 24,
        textAlign: 'left',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
    },
    pageIndicators: {
        flexDirection: 'row',
        gap: 8,
        marginLeft: spacingX._20,
    },
    activeIndicator: {
        width: 24,
        height: 4,
        backgroundColor: colors.black,
        borderRadius: 2,
    },
    inactiveIndicator: {
        width: 8,
        height: 8,
        backgroundColor: colors.neutral300,
        borderRadius: 4,
    },
    nextButton: {
        backgroundColor: '#000',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 24,
        minWidth: 100,
    },
    nextButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
})


