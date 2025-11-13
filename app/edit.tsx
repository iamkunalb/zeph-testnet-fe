import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/firebaseConfig'
import { router } from 'expo-router'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import * as Icons from "phosphor-react-native"
import React, { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const EditProfile = () => {
    const { user, userprofile, refreshUserProfile } = useAuth()
    const firstNameInputRef = useRef<TextInput>(null)
    const lastNameInputRef = useRef<TextInput>(null)
    const ageInputRef = useRef<TextInput>(null)
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [age, setAge] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true)

    // Load current user data
    useEffect(() => {
        if (userprofile) {
            setFirstName(userprofile.firstName || "")
            setLastName(userprofile.lastName || "")
            setAge(userprofile.age ? userprofile.age.toString() : "")
            setIsLoadingData(false)
        } else {
            setIsLoadingData(false)
        }
    }, [userprofile])

    const handleSubmit = async () => {
        if (!user) {
            Alert.alert('Error', 'You must be signed in to update your profile.')
            return
        }

        setIsLoading(true);
        try {
            const userData = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                age: age.trim() ? parseInt(age.trim()) : null,
                updatedAt: serverTimestamp(),
            };

            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, userData, { merge: true });
            
            // Refresh user profile data immediately
            await refreshUserProfile();
            
            Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.error('Profile update error:', error);
            Alert.alert('Error', error?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <SafeAreaView style={{flex:1, backgroundColor:colors.white}}>
      <KeyboardAvoidingView 
        style={{flex: 1}} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        
          <View style={styles.container}>
              <BackButton iconSize={12}/>

              <View style={{gap:5, marginTop:spacingY._20, width:'100%'}}>
                  <Text style={{color:colors.black, fontSize:28, fontWeight:'800'}}>Edit</Text>
                  <Text style={{color:colors.black, fontSize:28, fontWeight:'800'}}>Profile</Text>
              </View>

              {isLoadingData ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={colors.black} />
                </View>
              ) : (
                <View style={styles.form}>
                  <Input 
                    placeholder='First Name' 
                    color={colors.black} 
                    value={firstName}
                    onChangeText={(value: string) => setFirstName(value)} 
                    icon={<Icons.User size={24} color={colors.black} weight='fill'/>}
                    inputRef={firstNameInputRef}
                  />
                  <Input 
                    placeholder='Last Name' 
                    color={colors.black} 
                    value={lastName}
                    onChangeText={(value: string) => setLastName(value)} 
                    icon={<Icons.User size={24} color={colors.black} weight='fill'/>}
                    inputRef={lastNameInputRef}
                  />
                  <Input 
                    placeholder='Age' 
                    color={colors.black} 
                    value={age}
                    onChangeText={(value: string) => setAge(value)} 
                    keyboardType="number-pad"
                    icon={<Icons.Calendar size={24} color={colors.black} weight='fill'/>}
                    inputRef={ageInputRef}
                  />
                </View>
              )}
            <TouchableOpacity onPress={handleSubmit} style={styles.button} disabled={isLoading}>
                {isLoading ? (
                    <ActivityIndicator color={colors.white} />
                ) : (
                    <Text style={{color:colors.white, fontSize:18, fontWeight:'bold'}}>Confirm Changes</Text>
                )}
            </TouchableOpacity>

              {/* <View style={styles.or}>
                <View style={styles.orline}/>
                <Text style={{color:colors.black, fontSize:14}}>Or</Text>
                <View style={styles.orline}/>
              </View> */}
          </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:colors.white,
        gap:spacingY._15,
        paddingHorizontal:spacingX._20,
        position:'relative',
        alignItems:'center',
    },
    form:{
        gap: spacingY._10,
        width:'100%',
    },
    button: {
        backgroundColor:colors.black,
        padding:spacingY._9,
        alignItems:'center',
        borderRadius:12,
        width:'100%',
        position:'absolute',
        bottom:0,
    },

    footer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:5,
        width:'100%',
    },
    socials:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:20,
        width:'100%',
        paddingHorizontal:spacingX._10,
        marginBottom:spacingY._10,
    },
    footerText:{
        textAlign:'center',
        color:colors.primary,
        fontSize:14,
        fontWeight:'700'
    },
    or:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        gap:10,
        width:'100%',
        // marginVertical:spacingY._10,
    },
    orline:{
        flex:1,
        height:1,
        backgroundColor:colors.neutral300,
    }
})