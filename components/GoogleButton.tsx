import { spacingY } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GoogleButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onPress, disabled = false, isLoading = false }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.disabled]} 
      onPress={onPress} 
      disabled={disabled || isLoading}
    >
      <View style={styles.content}>
        {/* Google "G" Logo */}
        <View style={styles.googleLogo}>
          <View style={styles.gTopLeft} />
          <View style={styles.gTopRight} />
          <View style={styles.gBottomRight} />
          <View style={styles.gBottomLeft} />
          <View style={styles.gStem} />
        </View>
        
        {/* Google Text */}
        <Text style={styles.googleText}>GOOGLE</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2D2D2D', // Dark gray/charcoal background
    paddingVertical: spacingY._9,
    paddingHorizontal: 16,
    borderRadius: 25, // Rounded corners for pill shape
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleLogo: {
    width: 18,
    height: 18,
    position: 'relative',
  },
  gTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 8,
    height: 8,
    backgroundColor: '#EA4335', // Red
    borderTopLeftRadius: 9,
  },
  gTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    backgroundColor: '#FBBC05', // Yellow
    borderTopRightRadius: 9,
  },
  gBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 8,
    height: 8,
    backgroundColor: '#34A853', // Green
    borderBottomRightRadius: 9,
  },
  gBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 8,
    height: 8,
    backgroundColor: '#4285F4', // Blue
    borderBottomLeftRadius: 9,
  },
  gStem: {
    position: 'absolute',
    top: 2,
    left: 5,
    width: 2,
    height: 14,
    backgroundColor: '#4285F4', // Blue
    borderRadius: 1,
  },
  googleText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default GoogleButton; 