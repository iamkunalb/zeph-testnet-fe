import { colors } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

const BackButton = ({
  style, 
  iconSize = 26, 
  onPress
}: {
  style?: StyleProp<ViewStyle>, 
  iconSize?: number,
  onPress?: () => void
}) => {
    const router = useRouter();
    
    const handlePress = () => {
      if (onPress) {
        onPress();
      } else {
        router.back();
      }
    };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
        <CaretLeft size={verticalScale(iconSize)} color={colors.white} weight='bold'/>
    </TouchableOpacity>
  )
}

export default BackButton

const styles = StyleSheet.create({
    button:{
        backgroundColor: colors.neutral600,
        alignSelf:'flex-start',
        borderRadius: 12,
        borderCurve:"continuous",
        padding:5
    }
})