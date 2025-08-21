import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { auth } from '@/firebaseConfig'
import { router } from 'expo-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import * as Icons from "phosphor-react-native"
import React, { useState } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleLoginTry = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setIsLoading(true);
        try {
            console.log('Attempting login with:', email);
            await signInWithEmailAndPassword(auth, email.trim(), password);
            console.log('Login successful');
            // AuthContext will automatically handle the redirect to (tabs)
        } catch (err: any) {
            console.error('Login error:', err);
            Alert.alert('Error', err.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            // Your login logic will go here
            // await login(emailRef.current, passwordRef.current);
            // await new Promise(resolve => setTimeout(resolve, 2000)) // Simulated delay, remove this in production
            // router.replace('/(tabs)')
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <SafeAreaView style={{flex:1, backgroundColor:colors.neutral900}}>
      <KeyboardAvoidingView 
        style={{flex: 1}} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
              <BackButton iconSize={12}/>

              <View style={{gap:5, marginTop:spacingY._20}}>
                  <Text style={{color:colors.white, fontSize:28, fontWeight:'800'}}>Hey,</Text>
                  <Text style={{color:colors.white, fontSize:28, fontWeight:'800'}}>Welcome Back</Text>
              </View>

              <View style={styles.form}>
                  <Text style={{color:colors.textLighter, fontSize:16}}>Login now to access your companion</Text>
                  <Input placeholder='Enter you email' onChangeText={(value: React.SetStateAction<string>) => setEmail(value)} icon={<Icons.At size={24} color={colors.neutral300} weight='fill'/>}/>
                  <Input placeholder='Enter you password' onChangeText={(value: React.SetStateAction<string>) => setPassword(value)} secureTextEntry={true} icon={<Icons.Lock size={24} color={colors.neutral300} weight='fill'/>}/>

                  <Text style={{alignSelf:'flex-end', color:colors.white, fontWeight:'600'}}>Forgot Password?</Text>

                  <TouchableOpacity onPress={handleLoginTry} style={styles.button} disabled={isLoading}>
                      {isLoading ? (
                          <ActivityIndicator color={colors.neutral900} />
                      ) : (
                          <Text style={{color:colors.neutral900, fontSize:18, fontWeight:'bold'}}>Login</Text>
                      )}
                  </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                  <Text style={{color:colors.white, fontSize:14}}>Don't have an account?</Text>
                  <Pressable onPress={() => router.push('/register')}>
                      <Text style={styles.footerText}>
                          Sign Up
                      </Text>
                  </Pressable>
                  {/* <AppKitButton/> */}
              </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:colors.neutral900,
        gap:spacingY._15,
        paddingHorizontal:spacingX._20
    },
    form:{
        gap: spacingY._10
    },
    button: {
        backgroundColor:colors.primary,
        padding:spacingY._7,
        alignItems:'center',
        borderRadius:12,
    },
    footer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:5
    },
    footerText:{
        textAlign:'center',
        color:colors.primary,
        fontSize:14,
        fontWeight:'700'
    }
})