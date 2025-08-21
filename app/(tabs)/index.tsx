import { colors, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
// import { useAuth } from '@/context/AuthContext'
import { verticalScale } from '@/utils/styling'
import { router } from 'expo-router'
import * as Icons from "phosphor-react-native"
import React, { useState } from 'react'
import { Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Home = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { user, logout } = useAuth();
  // const { user } = useGlobalContext()
  
  return (
    <SafeAreaView style={{flex:1, backgroundColor:colors.neutral900}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{gap:4}}>
            <Text style={{color:colors.neutral400, fontSize:16}}>Hey, {user?.email}</Text>
            <Text style={{color:colors.white, fontSize:20, fontWeight:'500'}}>How are you doing today?</Text>
          </View>
          <TouchableOpacity style={styles.searchIcon} onPress={() => router.push('/notifications')}>
            <Icons.Bell size={verticalScale(10)} color={colors.white}  weight='bold'/>
          </TouchableOpacity>
        </View>


        <ScrollView contentContainerStyle={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
          <View>
            <View style={styles.moods}>
              {/* <Text style={{color:colors.neutral400, fontSize:16}}>Daily Mood Log</Text> */}
              <View style={{flexDirection:'row', gap:4}}>
                <TouchableOpacity 
                  style={[styles.mood, selectedMood === 'angry' && styles.selectedMood]} 
                  onPress={() => setSelectedMood('angry')}
                >
                  <Icons.SmileyAngry size={verticalScale(20)} color={selectedMood === 'angry' ? colors.primary : colors.white} weight={selectedMood === 'angry' ? 'fill' : 'bold'}/>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.mood, selectedMood === 'sad' && styles.selectedMood]} 
                  onPress={() => setSelectedMood('sad')}
                >
                  <Icons.SmileySad size={verticalScale(20)} color={selectedMood === 'sad' ? colors.primary : colors.white} weight={selectedMood === 'sad' ? 'fill' : 'bold'}/>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.mood, selectedMood === 'meh' && styles.selectedMood]} 
                  onPress={() => setSelectedMood('meh')}
                >
                  <Icons.SmileyMeh size={verticalScale(20)} color={selectedMood === 'meh' ? colors.primary : colors.white} weight={selectedMood === 'meh' ? 'fill' : 'bold'}/>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.mood, selectedMood === 'nervous' && styles.selectedMood]} 
                  onPress={() => setSelectedMood('nervous')}
                >
                  <Icons.SmileyNervous size={verticalScale(20)} color={selectedMood === 'nervous' ? colors.primary : colors.white} weight={selectedMood === 'nervous' ? 'fill' : 'bold'}/>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.mood, selectedMood === 'happy' && styles.selectedMood]} 
                  onPress={() => setSelectedMood('happy')}
                >
                  <Icons.Smiley size={verticalScale(20)} color={selectedMood === 'happy' ? colors.primary : colors.white} weight={selectedMood === 'happy' ? 'fill' : 'bold'}/>
                </TouchableOpacity>
              </View>
            </View>

            

            <View style={{}}> 
                <View style={styles.bigcard}>
                  <TouchableOpacity style={styles.bigcardWrapper} onPress={() => router.push('/message')}>
                    <ImageBackground source={require('@/assets/images/texture-bg.jpg')} style={styles.bigcardImage}>
                      <View style={{padding:spacingX._20}}>
                        <View style={{}}>
                          <View style={{gap:4}}>
                            <Text style={{color:colors.neutral800, fontSize:22, fontWeight:'600'}}>Quick chat!</Text>
                            <Text style={{color:colors.neutral500, fontSize:14, fontWeight:'400'}}>Got something on your mind?</Text>
                            <Text style={{color:colors.neutral500, fontSize:14, fontWeight:'400'}}>Talk to your AI Companion to offload your thoughts</Text>
                          </View>
                        </View>
                      </View>
                      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', position:'absolute', bottom:10, gap:4, right:spacingX._20,}}>
                        <Text style={{color:colors.neutral800,  fontSize:14, fontWeight:'600'}}>Chat Now</Text>
                        <Icons.ArrowRight size={verticalScale(7)} color={colors.neutral800}  weight='bold'/>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                </View>
            </View>



            <View style={styles.cards}> 
              <View style={styles.card}>
                <View style={styles.header}>
                  <View style={{gap:4, width:'100%', height:'100%'}}>
                    <Text style={{color:colors.neutral400, fontSize:16}}>Inhale</Text>
                    <Text style={{color:colors.neutral400, fontSize:16, fontWeight:'700'}}>Exhale</Text>
                    <Text style={{color:colors.neutral400, fontSize:16}}>for Balance</Text>
                    <View style={{ width:'100%', justifyContent:'center', alignItems:'center',}}>
                      <Image source={require('@/assets/images/inhale.png')} style={{width:150, height:150}}/>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.card}>
                <View style={styles.header}>
                  <View style={{gap:4, width:'100%', height:'100%'}}>
                    <Text style={{color:colors.neutral400, fontSize:16}}>Take a</Text>
                    <Text style={{color:colors.neutral400, fontSize:16, fontWeight:'700'}}>Walk</Text>
                    <Text style={{color:colors.neutral400, fontSize:16}}>for Peace</Text>
                    <View style={{ width:'100%', justifyContent:'center', alignItems:'center',}}>
                      <Image source={require('@/assets/images/walk3.png')} style={{width:150, height:150}}/>
                    </View>
                  </View>
                </View>
              </View>
              
            </View>

            <View style={{marginTop:spacingY._10}}>
              <Text style={{color:colors.neutral400, fontSize:16}}>Top Categories</Text>
              <View style={styles.bubbleContainer}>
                <View style={styles.bubble}>
                  <Icons.HeadCircuit size={verticalScale(10)} color={colors.white} weight='bold'/>
                  <Text style={{color:colors.white}}>Feeling Anxious</Text>
                </View>
                <View style={styles.bubble}>
                  <Icons.HeartBreak size={verticalScale(10)} color={colors.white} weight='bold'/>
                  <Text style={{color:colors.white}}>Relationship Issue</Text>
                </View>
                <View style={styles.bubble}>
                  <Icons.MaskSad size={verticalScale(10)} color={colors.white} weight='bold'/>
                  <Text style={{color:colors.white}}>Feeling Depressed</Text>
                </View>
                <View style={styles.bubble}>
                  <Icons.Bed size={verticalScale(10)} color={colors.white} weight='bold'/>
                  <Text style={{color:colors.white}}>Bad Sleep</Text>
                </View>
              </View>
            </View>
            
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:spacingX._20,
    marginTop:verticalScale(8),
  },
  header:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:spacingY._10,
  },
  searchIcon:{
    backgroundColor:colors.neutral700,
    padding:spacingX._7,
    borderRadius:50
  },
  expandIcon:{
    backgroundColor:colors.neutral800,
    padding:spacingX._7,
    borderRadius:50
  },
  scrollViewStyle:{
    // marginTop:spacingY._10,
    paddingBottom: verticalScale(10),
    gap:spacingY._10
  },
  moods:{
    justifyContent:'space-between',
    marginBottom:spacingY._10,
    gap:4,
  },
  mood:{
    flexDirection:'row',
    alignItems:'center',
    gap:spacingX._10,
    padding:spacingX._10,
    borderRadius:50
  },
  selectedMood: {
    backgroundColor: colors.neutral700,
  },
  cards:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:spacingY._10,
  },
  card:{
    backgroundColor:colors.neutral700,
    padding:spacingX._10,
    borderRadius:10,
    height:verticalScale(100),
    width: '47%',
  },
  bigcard:{
    // backgroundColor:colors.neutral700,
    // padding:spacingX._10,
    borderRadius:10,
    height:verticalScale(70),
    width: '100%',
  },
  bigcardImage:{
    width: '100%',
    height: '100%',
    // opacity:0.5
  },
  bigcardWrapper:{
    borderRadius:10,
    overflow:'hidden',
    flex:1
  },
  bubbleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingX._10,
    marginTop: spacingY._10,
  },
  bubble: {
    backgroundColor: colors.neutral700,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingX._10,
    borderRadius: 50,
    alignSelf: 'flex-start',
    flexDirection:'row',
    alignItems:'center',
    gap:spacingX._7,
  },
})