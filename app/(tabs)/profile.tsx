import "@walletconnect/react-native-compat";

import { colors, spacingX } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
// import { useAuth } from '@/context/AuthContext'
import { verticalScale } from '@/utils/styling';
import { AppKitButton } from '@reown/appkit-ethers-react-native';
import * as Icons from "phosphor-react-native";
import React from 'react';
import { Alert, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Profile = () => {
  // const { refetch, user } = useGlobal/Context();
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            // if (result) {
            //   Alert.alert("Success", "Logged out successfully", [
            //     {
            //       text: "OK",
            //       onPress: () => {
            //         router.replace('/welcome');
            //       }
            //     }
            //   ]);
            //   refetch();
            // } else {
            //   Alert.alert("Error", "Failed to logout");
            // }
          }
        }
      ]
    );
  };
  return (

    <SafeAreaView style={{flex:1, backgroundColor:colors.neutral900}}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            {/* <Icons.User size={verticalScale(60)} color={colors.neutral400} weight="regular" /> */}
            <Image source={require('@/assets/images/batman.jpg')} style={{width:150, height:150}}/>
          </View>
          {/* <Text style={styles.name}>{user?.} </Text> */}
          <Text style={styles.email}>{user?.email}</Text>
          <AppKitButton/>
        </View>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={[styles.menuItem,]}>
            <View style={{backgroundColor:'', aspectRatio:1, height:'100%', alignItems:'center', borderRadius:15, justifyContent:'center'}}>
              <Icons.User size={22} color={colors.white}   weight="fill" />
            </View>
            <Text style={styles.menuText}>Edit Profile</Text>
            <Icons.CaretRight size={20} color={colors.white} weight="bold" style={styles.menuArrow} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem]}>
            <View style={{backgroundColor:'', aspectRatio:1, height:'100%', alignItems:'center', borderRadius:15, justifyContent:'center'}}>
              <Icons.Gear size={22} color={colors.white}   weight="fill" />
            </View>
            <Text style={styles.menuText}>Settings</Text>
            <Icons.CaretRight size={20} color={colors.white} weight="bold" style={styles.menuArrow} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem]}>
            <View style={{backgroundColor:'', aspectRatio:1, height:'100%', alignItems:'center', borderRadius:15, justifyContent:'center'}}>
              <Icons.LockKey size={22} color={colors.white}   weight="fill" />
            </View>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Icons.CaretRight size={20} color={colors.white} weight="bold" style={styles.menuArrow} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, ]} onPress={handleLogout}>
             <View style={{backgroundColor:'', aspectRatio:1, height:'100%', alignItems:'center', borderRadius:15, justifyContent:'center'}}>
              <Icons.Power size={22} color={colors.white}   weight="fill" />
            </View>
            <Text style={styles.menuText}>Logout</Text>
            <Icons.CaretRight size={20} color={colors.white} weight="bold" style={styles.menuArrow} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={{bottom:20, position:'absolute', width:'100%', alignItems:'center'}}>
        <View style={{flexDirection:'row', opacity:0.6, alignItems:'center', gap:spacingX._10}}>
          <Icons.Trash size={22} color="red"   weight="fill" />
          <Text style={{color:"red", fontSize:16, fontWeight:'500'}}>Delete Account</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>

  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    marginTop: verticalScale(15),
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '600',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  avatarCircle: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: colors.neutral800,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(16),
    overflow:'hidden',
    borderWidth:2,
    borderColor:colors.neutral500,
  },
  name: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  email: {
    color: colors.neutral400,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 2,
  },
  menuContainer: {
    width: '100%',
    gap: verticalScale(3),
    marginTop: 10
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor:colors.neutral800,
    padding:20,
    // paddingVertical: verticalScale(10),
    height:verticalScale(30),
    // paddingHorizontal: spacingX._20,
    marginBottom: 0,
  },
  menuText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginLeft: 16,
  },
  menuArrow: {
    marginLeft: 8,
  },
})