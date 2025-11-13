import BackButton from '@/components/BackButton'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import * as Icons from "phosphor-react-native"
import React from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'




const Notifications = () => {
  return (
    <SafeAreaView style={{flex:1, backgroundColor:colors.white}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton iconSize={12}/>
          <Text style={[styles.headerTitle, {position: 'absolute', width: '100%', textAlign: 'center', zIndex: -1}]}>Notifications</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>

          {/* Today's Notifications */}
          <View style={styles.notificationGroup}>
            <Text style={styles.groupTitle}>Today</Text>
            
            <View style={styles.notification}>
              <View style={styles.notificationIcon}>
                <Icons.ChatText size={verticalScale(12)} color={colors.black} weight='fill'/>
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>New message from AI Companion</Text>
                <Text style={styles.notificationTime}>2 hours ago</Text>
                <Text style={styles.notificationText}>Hey there! Just checking in to see how you're feeling today...</Text>
              </View>
            </View>

            <View style={styles.notification}>
              <View style={[styles.notificationIcon]}>
                <Icons.Timer size={verticalScale(12)} color={colors.black} weight='fill'/>
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Meditation Reminder</Text>
                <Text style={styles.notificationTime}>5 hours ago</Text>
                <Text style={styles.notificationText}>Time for your daily meditation session</Text>
              </View>
            </View>
          </View>

          {/* Yesterday's Notifications */}
          <View style={styles.notificationGroup}>
            <Text style={styles.groupTitle}>Yesterday</Text>
            
            <View style={styles.notification}>
              <View style={[styles.notificationIcon]}>
                <Icons.Trophy size={verticalScale(12)} color={colors.black} weight='fill'/>
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>Achievement Unlocked!</Text>
                <Text style={styles.notificationTime}>1 day ago</Text>
                <Text style={styles.notificationText}>You've completed 7 days of mood tracking! Keep it up!</Text>
              </View>
            </View>

            <View style={styles.notification}>
              <View style={[styles.notificationIcon]}>
                <Icons.Bell size={verticalScale(12)} color={colors.black} weight='fill'/>
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>New Feature Available</Text>
                <Text style={styles.notificationTime}>1 day ago</Text>
                <Text style={styles.notificationText}>Try our new guided breathing exercises</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Notifications

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:spacingX._20,
    marginTop:verticalScale(8),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: spacingY._10,
  },
  headerTitle: {
    color: colors.black,
    fontSize: 20,
    fontWeight:'600'
  },
  searchIcon:{
    backgroundColor:colors.neutral700,
    padding:spacingX._7,
    borderRadius:50
  },
  scrollViewStyle:{
    marginTop:spacingY._10,
    paddingBottom: verticalScale(10),
    gap:spacingY._25
  },
  notificationGroup: {
    gap: spacingY._10,
  },
  groupTitle: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacingY._5,
  },
  notification: {
    flexDirection: 'row',
    backgroundColor: colors.neutral100,
    borderWidth:1,
    borderColor:colors.neutral300,
    borderRadius: 12,
    padding: spacingX._15,
    gap: spacingX._15,
  },
  notificationIcon: {
    backgroundColor: colors.white,
    padding: spacingX._10,
    borderRadius: 50,
    alignSelf: 'flex-start',
  },
  notificationContent: {
    flex: 1,
    gap: 2,
  },
  notificationTitle: {
    color: colors.black,
    fontSize: 16,
    fontWeight: '500',
  },
  notificationTime: {
    color: colors.neutral900,
    fontSize: 12,
  },
  notificationText: {
    color: colors.neutral900,
    fontSize: 14,
    marginTop: spacingY._5,
  }
})