import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { CaretLeft } from 'phosphor-react-native';
import { verticalScale } from '@/utils/styling';
import { colors, radius } from '@/constants/theme';

const BackButton = ({style, iconSize = 26}: {style?: StyleProp<ViewStyle>, iconSize?: number}) => {
    const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()} style={styles.button}>
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