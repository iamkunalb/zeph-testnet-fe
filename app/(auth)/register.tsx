import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
import { auth } from '@/firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import * as Icons from "phosphor-react-native"
import React, { useRef, useState } from 'react'
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'




const Register = () => {
    const emailRef = useRef("")
    const passwordRef = useRef("")
    const confirmPasswordRef = useRef("")
    const [isLoading, setIsLoading] = useState(false)

    const { user, logout } = useAuth();

    const handleSignup = async () => {
        try {
          const cred = await createUserWithEmailAndPassword(auth, emailRef.current.trim(), passwordRef.current);
        //   await cred.user?.reload(); // Ensure user is up to date, typically not needed but covers race conditions
          // If you need to make a user document in Firestore, do so here explicitly (example, replace with your actual logic):
          // await createUserDoc(cred.user);
        //   router.replace('/(onboarding)/profile');  // 👈 Go to tabs
        } catch (err: any) {
          Alert.alert("Registration Failed", err.message);
        }
      };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:colors.white}}>
        <View style={styles.container}>
            <BackButton iconSize={12}/>

            <View style={{gap:5, marginTop:spacingY._20}}>
                <Text style={{color:colors.black, fontSize:28, fontWeight:'800'}}>Let's</Text>
                <Text style={{color:colors.black, fontSize:28, fontWeight:'800'}}>Get Started</Text>
            </View>

            <View style={styles.form}>
                <Text style={{color:colors.black, fontSize:16}}>Login now to access your companion</Text>
                <Input placeholder='Enter you email' onChangeText={(value: string) => (emailRef.current = value)} color={colors.black} icon={<Icons.At size={24} color={colors.neutral300} weight='fill'/>}/>
                <Input placeholder='Enter you password' onChangeText={(value: string) => (passwordRef.current = value)} secureTextEntry={true} color={colors.black} icon={<Icons.Lock size={24} color={colors.neutral300} weight='fill'/>}/>
                <Input placeholder='Re-enter you password' onChangeText={(value: string) => (confirmPasswordRef.current = value)} secureTextEntry={true} color={colors.black} icon={<Icons.Lock size={24} color={colors.neutral300} weight='fill'/>}/>

                {/* <Text style={{alignSelf:'flex-end', color:colors.white, fontWeight:'600'}}>Forgot Password?</Text> */}

                <TouchableOpacity onPress={handleSignup} style={styles.button} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color={colors.black} />
                    ) : (
                        <Text style={{color:colors.white, fontSize:18, fontWeight:'bold'}}>Register</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.or}>
                <View style={styles.orline}/>
                <Text style={{color:colors.black, fontSize:14}}>Or</Text>
                <View style={styles.orline}/>
                {/* <Text style={{color:colors.white, fontSize:14}}>Or</Text> */}
              </View>


            <View style={styles.socials}>
                  <TouchableOpacity  style={styles.socialsbutton} disabled={isLoading}>
                    <Icons.GoogleLogoIcon size={24} color={colors.black} weight='bold'/>
                    <Text style={{color:colors.black, fontSize:18, fontWeight:'bold'}}>Google</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={handleAppleLogin} style={styles.socialsbutton} disabled={isLoading}>
                    <Icons.AppleLogoIcon size={24} color={colors.black} weight='fill'/>
                    <Text style={{color:colors.black, fontSize:18, fontWeight:'bold'}}>Apple</Text>
                  </TouchableOpacity> */}
              </View>

            {/* <View style={styles.footer}>
                <Text style={{color:colors.black, fontSize:14}}>Already have an account?</Text>
                <Pressable onPress={() => router.push('/login')}>
                    <Text style={styles.footerText}>
                        Login
                    </Text>
                </Pressable>
            </View> */}
        </View>
    </SafeAreaView>
  )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:colors.white,
        gap:spacingY._15,
        paddingHorizontal:spacingX._20
    },
    form:{
        gap: spacingY._10
    },
    button: {
        backgroundColor:colors.black,
        padding:spacingY._9,
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
    },
    socialsbutton: {
        backgroundColor:colors.neutral100,
        borderWidth:1,
        borderColor:colors.neutral300,
        padding:spacingY._9,
        alignItems:'center',
        borderRadius:12,
        width:'100%',
        flexDirection:'row',
        gap:15,
        justifyContent:'center',
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