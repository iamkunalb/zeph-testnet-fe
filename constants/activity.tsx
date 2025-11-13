import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'

const Activity = () => {
  return (
    <SafeAreaView style={{flex:1, backgroundColor:colors.neutral900}}>
      <View style={styles.container}>
        <Text style={styles.title}>Activity</Text>
        <Text style={styles.subtitle}>Coming soon...</Text>
      </View>
    </SafeAreaView>
  )
}

export default Activity

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacingY._10,
  },
  subtitle: {
    color: colors.neutral400,
    fontSize: 16,
  },
})