import "@walletconnect/react-native-compat";

import CustomTabs from '@/components/CustomTabs';
// import { useAuth } from '@/context/AuthContext'
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';



const _layout = () => {
  // const { user, loading } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.replace('/welcome');
  //   }
  // }, [user, loading]);
  
  return (
    <Tabs 
      tabBar={CustomTabs} 
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name='index' options={{title:'Home'}}/>
      <Tabs.Screen name='chats' options={{title:'Chats'}}/>
      <Tabs.Screen name='activity' options={{title:'Activity'}}/>
      <Tabs.Screen name='profile' options={{title:'Profile'}}/>
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})