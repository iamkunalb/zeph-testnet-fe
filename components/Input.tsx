import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { InputProps } from '@/types'
import { colors, radius, spacingX } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'

const Input = (props: InputProps) => {
  return (
    <View style={[styles.container, props.containerStyle && props.containerStyle]}>
        {props.icon && props.icon}
      <TextInput 
      style={[styles.input, props.inputStyle]}
      placeholderTextColor={colors.neutral400}
      ref={props.inputRef && props.inputRef}
      {...props}    
      />
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
    input:{
        // backgroundColor: colors.neutral700,
        // borderRadius: radius._12,
        // padding: spacingX._20
        flex: 1,
        color: colors.white,
        fontSize: 16,

    },
    container:{
        // backgroundColor: colors.neutral700,
        // borderRadius: radius._12,
        // padding: spacingX._20,
        flexDirection: 'row',
        height: verticalScale(25),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.neutral300,
        borderRadius: 20,
        borderCurve: 'continuous',
        paddingHorizontal: spacingX._15,
        gap:spacingX._10
    }
})