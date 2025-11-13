// components/TabBar.tsx
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Icons from "phosphor-react-native";
import React, { useRef, useState } from "react";

import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

const TabBarC = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 0, y: 0 });
  const spotlightAnimation = useRef(new Animated.Value(0)).current;
  const spotlightScale = useRef(new Animated.Value(0)).current;
  const spotlightOpacity = useRef(new Animated.Value(0)).current;

  const triggerSpotlight = (event: any, index: number) => {
    const { pageX, pageY } = event.nativeEvent;
    const tabWidth = (Dimensions.get('window').width - 32 - 28) / state.routes.length; // container width minus padding and FAB
    const tabCenterX = 16 + (index * tabWidth) + (tabWidth / 2); // 16 is left padding
    
    setSpotlightPosition({
      x: tabCenterX,
      y: pageY + 20 // Position below the tab
    });

    // Reset and animate spotlight
    spotlightAnimation.setValue(0);
    spotlightScale.setValue(0);
    spotlightOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(spotlightAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(spotlightScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(spotlightOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Fade out after animation
      Animated.timing(spotlightOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  return (  
    <View style={styles.container}>
      {/* Spotlight Effect */}
      <Animated.View
        style={[
          styles.spotlight,
          {
            left: spotlightPosition.x - 30,
            top: spotlightPosition.y - 30,
            opacity: spotlightOpacity,
            transform: [
              { scale: spotlightScale },
              {
                translateY: spotlightAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      />

      {/* LEFT — Tab Items */}
      <View style={styles.tabsWrapper}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.title !== undefined ? options.title : route.name;

          const isFocused = state.index === index;
          const icon = options.tabBarIcon
            ? options.tabBarIcon({ focused: isFocused, color: isFocused ? "#007aff" : "#666", size: 24 })
            : null;

          const onPress = (event: any) => {
            if (!isFocused) {
              triggerSpotlight(event, index);
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              onPress={onPress}
              style={[
                styles.tabButton,
                isFocused && styles.activeTabButton
              ]}
              activeOpacity={0.7}
            >
                {icon}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* RIGHT — Floating Chat Button */}
      <Animated.View style={styles.fabWrapper}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("message")}
          style={styles.fabButton}
        >
          {/* <Ionicons name="chatbubble-outline" size={24} color="#007aff" /> */}
          <Icons.NotePencil size={24} color="#007aff"/>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default TabBarC;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 28 : 18,
    left: 40,
    right: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  tabsWrapper: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.85)", // Matte glass effect with opacity
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 65,
    alignItems: "center",
    justifyContent: "space-evenly",
    flex: 1,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    // Glass effect properties
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    // Backdrop blur effect (iOS only)
    ...(Platform.OS === 'ios' && {
      backdropFilter: 'blur(20px)',
    }),
  },
  tabButton: {
    marginHorizontal: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  activeTabButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.15)', // Light blue background
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    shadowColor: '#007aff',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    transform: [{ scale: 1.05 }], // Slightly larger
  },

  fabWrapper: {
    marginLeft: 12,
    
  },
  fabButton: {
    width: 56,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    height: 56,
    borderRadius: 20, // Slightly transparent for glass effect
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  spotlight: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(0, 122, 255, 0.3)", // Blue spotlight with opacity
    shadowColor: "#007aff",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
    // Create a radial gradient effect using multiple shadows
    // This creates the spotlight effect
  },
});