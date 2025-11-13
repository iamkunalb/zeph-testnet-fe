import BackButton from '@/components/BackButton'
import Input from '@/components/Input'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { auth } from '@/firebaseConfig'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { router } from 'expo-router'
import { GoogleAuthProvider, sendPasswordResetEmail, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth'
import * as Icons from "phosphor-react-native"
import React, { useState } from 'react'
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

GoogleSignin.configure({
    webClientId: "630719331401-gh1hksrn9s8a8d8u2pedsurdsvpjqplt.apps.googleusercontent.com"
});

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetLoading, setResetLoading] = useState(false);

   

    const handleForgotPassword = async () => {
    if (!resetEmail.trim()) {
        Alert.alert("Error", "Please enter your email");
        return;
    }

    try {
        setResetLoading(true);
        await sendPasswordResetEmail(auth, resetEmail.trim());
        Alert.alert("Success", "Password reset link sent to your email.");
        setShowResetModal(false);
        setResetEmail("");
    } catch (err: any) {
        Alert.alert("Error", err.message);
    } finally {
        setResetLoading(false);
    }
    };



    const handleLoginTry = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        setIsLoading(true);
        try {
            console.log('Attempting login with:', email);
            await signInWithEmailAndPassword(auth, email.trim(), password);
            // router.replace('/(tabs)')
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

    // const handleGoogleLogin = async () => {
    //   // console.log('Google login')
    //   const provider = new GoogleAuthProvider();
    //   signInWithPopup(auth, provider)
    //     .then((result) => {
    //       console.log(result);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // }

    const handleGoogleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            const idToken = response.data?.idToken;
      
            const googleCredential = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(auth, googleCredential);
        
            console.log("✅ Google Sign-In Successful");
        } catch (error) {
            console.log("❌ Google Sign-In Error:", error);
        }
      };

    const handleAppleLogin = async () => {
        console.log('Apple login')
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

              <View style={{gap:5, marginTop:spacingY._20}}>
                  <Text style={{color:colors.black, fontSize:28, fontWeight:'800'}}>Hey,</Text>
                  <Text style={{color:colors.black, fontSize:28, fontWeight:'800'}}>Welcome Back</Text>
              </View>

              <View style={styles.form}>
                  <Text style={{color:colors.black, fontSize:16}}>Login now to access your companion</Text>
                  <Input placeholder='Enter you email' color={colors.black} onChangeText={(value: React.SetStateAction<string>) => setEmail(value)} icon={<Icons.At size={24} color={colors.black} weight='fill'/>}/>
                  <Input placeholder='Enter you password' color={colors.black} onChangeText={(value: React.SetStateAction<string>) => setPassword(value)} secureTextEntry={true} icon={<Icons.Lock size={24} color={colors.black} weight='fill'/>}/>

                    <TouchableOpacity  onPress={() => setShowResetModal(true)}>

                  <Text style={{alignSelf:'flex-end', color:colors.black, fontWeight:'600'}}>Forgot Password?</Text>
                    </TouchableOpacity>

                  <TouchableOpacity onPress={handleLoginTry} style={styles.button} disabled={isLoading}>
                      {isLoading ? (
                          <ActivityIndicator color={colors.black} />
                      ) : (
                          <Text style={{color:colors.white, fontSize:18, fontWeight:'bold'}}>Login</Text>
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
                  <TouchableOpacity onPress={handleGoogleLogin} style={styles.socialsbutton} disabled={isLoading}>
                    <Icons.GoogleLogoIcon size={24} color={colors.black} weight='bold'/>
                    <Text style={{color:colors.black, fontSize:18, fontWeight:'bold'}}>Google</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={handleAppleLogin} style={styles.socialsbutton} disabled={isLoading}>
                    <Icons.AppleLogoIcon size={24} color={colors.black} weight='fill'/>
                    <Text style={{color:colors.black, fontSize:18, fontWeight:'bold'}}>Apple</Text>
                  </TouchableOpacity> */}
              </View>




              <View style={styles.footer}>
                  <Text style={{color:colors.black, fontSize:14}}>Don't have an account?</Text>
                  <Pressable onPress={() => router.push('/register')}>
                      <Text style={styles.footerText}>
                          Sign Up
                      </Text>
                  </Pressable>
                  {/* <AppKitButton/> */}
              </View>
          </View>
      </KeyboardAvoidingView>
      {/* Forgot Password Modal */}
{showResetModal && (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 24,
    }}
  >
    <View
      style={{
        width: "100%",
        backgroundColor: colors.white,
        padding: 24,
        borderRadius: 16,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 10 }}>
        Reset Password
      </Text>

      <Text style={{ color: colors.black, marginBottom: 20 }}>
        Enter your email and we'll send you a reset link.
      </Text>

      <Input
        placeholder="Email"
        color={colors.black}
        onChangeText={(value: React.SetStateAction<string>) => setResetEmail(value)}
        value={resetEmail}
        icon={<Icons.At size={24} color={colors.black} weight="fill" />}
      />

      <TouchableOpacity
        onPress={handleForgotPassword}
        disabled={resetLoading}
        style={{
          backgroundColor: colors.black,
          padding: spacingY._10,
          alignItems: "center",
          borderRadius: 12,
          marginTop: 20,
        }}
      >
        {resetLoading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={{ color: colors.white, fontSize: 16, fontWeight: "600" }}>
            Send Reset Link
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowResetModal(false)}
        style={{ marginTop: 12, alignItems: "center" }}
      >
        <Text style={{ color: colors.black, fontWeight: "600" }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

    </SafeAreaView>
  )
}

export default Login

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
        width:'100%',
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