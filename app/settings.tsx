import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { router } from 'expo-router'
import * as Icons from "phosphor-react-native"
import React, { useState } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Settings = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [age, setAge] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            console.log('Attempting to update profile with:', name, age);
            // TODO: Implement profile update logic
            console.log('Profile update successful');
            router.back();
        } catch (error) {
            console.error('Profile update error:', error);
            Alert.alert('Error', 'Failed to update profile');
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
                  <Text style={{color:colors.black, fontSize:28, fontWeight:'800'}}>Settings</Text>
              </View>

              <View style={styles.form}>
                  {/* <Text style={{color:colors.black, fontSize:16}}>Update your profile</Text> */}
                  <Input placeholder='Enter you email' color={colors.black} onChangeText={(value: React.SetStateAction<string>) => setEmail(value)} icon={<Icons.At size={24} color={colors.black} weight='fill'/>}/>
                  <Input placeholder='Enter you age' color={colors.black} onChangeText={(value: React.SetStateAction<string>) => setAge(value)} icon={<Icons.User size={24} color={colors.black} weight='fill'/>}/>

              </View>
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

export default Settings

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