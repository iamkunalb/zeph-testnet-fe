import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { auth } from '@/firebaseConfig'
import { router } from 'expo-router'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import * as Icons from "phosphor-react-native"
import React, { useRef, useState } from 'react'
import { ActivityIndicator, Alert, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Register = () => {
    const emailRef = useRef("")
    const passwordRef = useRef("")
    const confirmPasswordRef = useRef("")
    const [isLoading, setIsLoading] = useState(false)
    
    const handleSubmit = async () => {
        if (passwordRef.current !== confirmPasswordRef.current) {
            Alert.alert("Error", "Passwords don't match");
            return;
        }
        
        if (passwordRef.current.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long");
            return;
        }
        
        setIsLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, emailRef.current.trim(), passwordRef.current);
            // User will be automatically logged in after successful registration
            // The AuthContext will handle the redirect to (tabs)
        } catch (error: any) {
            console.error("Registration failed:", error.message);
            Alert.alert("Registration Failed", error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSignup = async () => {
        try {
          await createUserWithEmailAndPassword(auth, emailRef.current.trim(), passwordRef.current);
          router.replace('/(tabs)');  // 👈 Go to tabs
        } catch (err: any) {
          Alert.alert("Registration Failed", err.message);
        }
      };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:colors.neutral900}}>
        <View style={styles.container}>
            <BackButton iconSize={12}/>

            <View style={{gap:5, marginTop:spacingY._20}}>
                <Text style={{color:colors.white, fontSize:28, fontWeight:'800'}}>Let's</Text>
                <Text style={{color:colors.white, fontSize:28, fontWeight:'800'}}>Get Started</Text>
            </View>

            <View style={styles.form}>
                <Text style={{color:colors.textLighter, fontSize:16}}>Login now to access your companion</Text>
                <Input placeholder='Enter you email' onChangeText={(value: string) => (emailRef.current = value)} icon={<Icons.At size={24} color={colors.neutral300} weight='fill'/>}/>
                <Input placeholder='Enter you password' onChangeText={(value: string) => (passwordRef.current = value)} secureTextEntry={true} icon={<Icons.Lock size={24} color={colors.neutral300} weight='fill'/>}/>
                <Input placeholder='Re-enter you password' onChangeText={(value: string) => (confirmPasswordRef.current = value)} secureTextEntry={true} icon={<Icons.Lock size={24} color={colors.neutral300} weight='fill'/>}/>

                {/* <Text style={{alignSelf:'flex-end', color:colors.white, fontWeight:'600'}}>Forgot Password?</Text> */}

                <TouchableOpacity onPress={handleSignup} style={styles.button} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color={colors.neutral900} />
                    ) : (
                        <Text style={{color:colors.neutral900, fontSize:18, fontWeight:'bold'}}>Register</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={{color:colors.white, fontSize:14}}>Already have an account?</Text>
                <Pressable onPress={() => router.push('/login')}>
                    <Text style={styles.footerText}>
                        Login
                    </Text>
                </Pressable>
            </View>
        </View>
    </SafeAreaView>
  )
}

export default Register

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