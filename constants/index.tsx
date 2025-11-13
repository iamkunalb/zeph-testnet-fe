import { colors, spacingX, spacingY } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'
// import { useAuth } from '@/context/AuthContext'
import { verticalScale } from '@/utils/styling'
import { router } from 'expo-router'
import * as Icons from "phosphor-react-native"
import React, { useState } from 'react'
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Home = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { user, logout } = useAuth();
  // const { user } = useGlobalContext()
  
  return (
      // <DottedPaper backgroundColor={colors.white}>
    <SafeAreaView style={{flex:1, backgroundColor:colors.white}}>


      <View style={styles.container}>
            <View style={{paddingHorizontal:spacingX._20, paddingBottom:spacingY._5}}>
                    {/* <Animated.View style={styles.graphicsContainer}>
                    <View style={styles.purpleShape} />
                    
                    <View style={styles.blueTriangle}>
                    </View>
                    
                    <View style={styles.greenSquare}>
                      <View style={styles.circleCutout} />
                    </View>
                  </Animated.View> */}

                    <View style={styles.header}>
                      <View style={{gap:4}}>
                        <Text style={{color:colors.neutral400, fontSize:16}}>Hey, {user?.email}</Text>
                        <Text style={{color:colors.black, fontSize:20, fontWeight:'500'}}>How are you doing today?</Text>
                      </View>
                      <TouchableOpacity style={styles.searchIcon} onPress={() => router.push('/notifications')}>
                        <Icons.Bell size={verticalScale(10)} color={colors.white}  weight='bold'/>
                      </TouchableOpacity>
                    </View>


                    
                    <View style={styles.moods}>
                      <View style={{flexDirection:'row', gap:4}}>
                        <TouchableOpacity 
                          style={[styles.mood, selectedMood === 'angry' && styles.selectedMood]} 
                          onPress={() => setSelectedMood('angry')}
                        >
                          <Icons.SmileyAngry size={verticalScale(20)} color={selectedMood === 'angry' ? colors.neutral900 : colors.black} weight={selectedMood === 'angry' ? 'fill' : 'bold'}/>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.mood, selectedMood === 'sad' && styles.selectedMood]} 
                          onPress={() => setSelectedMood('sad')}
                        >
                          <Icons.SmileySad size={verticalScale(20)} color={selectedMood === 'sad' ? colors.neutral900 : colors.black} weight={selectedMood === 'sad' ? 'fill' : 'bold'}/>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.mood, selectedMood === 'meh' && styles.selectedMood]} 
                          onPress={() => setSelectedMood('meh')}
                        >
                          <Icons.SmileyMeh size={verticalScale(20)} color={selectedMood === 'meh' ? colors.neutral900 : colors.black} weight={selectedMood === 'meh' ? 'fill' : 'bold'}/>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.mood, selectedMood === 'nervous' && styles.selectedMood]} 
                          onPress={() => setSelectedMood('nervous')}
                        >
                          <Icons.SmileyNervous size={verticalScale(20)} color={selectedMood === 'nervous' ? colors.neutral900 : colors.black} weight={selectedMood === 'nervous' ? 'fill' : 'bold'}/>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.mood, selectedMood === 'happy' && styles.selectedMood]} 
                          onPress={() => setSelectedMood('happy')}
                        >
                          <Icons.Smiley size={verticalScale(20)} color={selectedMood === 'happy' ? colors.neutral900 : colors.black} weight={selectedMood === 'happy' ? 'fill' : 'bold'}/>
                        </TouchableOpacity>
                      </View>
                    </View>
            </View>









            <View style={[styles.scrollViewStyle, {backgroundColor:colors.neutral100,}]}>
            <View style={{paddingBottom:verticalScale(20)}}>
              <View style={styles.cards}> 
                <View style={[styles.card, {backgroundColor:"rgb(133,192,241)"}]}>
                  <View style={styles.header}>
                    <View style={{gap:4, width:'100%', height:'100%'}}>
                      <Text style={{color:colors.white, fontSize:16}}>Inhale</Text>
                      <Text style={{color:colors.white, fontSize:16, fontWeight:'700'}}>Exhale</Text>
                      <Text style={{color:colors.white, fontSize:16}}>for Balance</Text>
                    </View>
                  </View>
                  <View style={{ width:'100%', position:'absolute', bottom:0, right:0, justifyContent:'center', alignItems:'center',}}>
                    <Image source={require('@/assets/images/inhale.png')} style={{width:100, height:100}}/>
                  </View>
                </View>

                <View style={[styles.card, {backgroundColor:"rgb(237,224,231)"}]}>
                  <View style={styles.header}>
                    <View style={{gap:4, width:'100%', height:'100%'}}>
                      <Text style={{color:colors.black, fontSize:16}}>Take a</Text>
                      <Text style={{color:colors.black, fontSize:16, fontWeight:'700'}}>Walk</Text>
                      <Text style={{color:colors.black, fontSize:16}}>for Peace</Text>
                    </View>
                  </View>
                  <View style={{ width:'100%', position:'absolute', bottom:0, right:0, justifyContent:'center', alignItems:'center',}}>
                    <Image source={require('@/assets/images/walk3.png')} style={{width:100, height:100}}/>
                  </View>
                </View>
              </View>


            <View style={{marginTop:spacingY._10}}> 
              <Text style={{color:colors.black, fontSize:16, fontWeight:'600'}}>Recent Conversation</Text>
                <TouchableOpacity style={{position:'absolute', right:10, top:0, flexDirection:'row', alignItems:'center', gap:5}} onPress={() => router.push('/allChats')}>
                  <Text style={{color:colors.neutral900, fontSize:16, fontWeight:'600'}}>View All</Text>
                  <Icons.ArrowRight size={20} color={colors.neutral900} />
                </TouchableOpacity>

              <View style={{height:verticalScale(50), marginTop:spacingY._10, backgroundColor:colors.neutral300, borderRadius:10, padding:15, borderWidth:1, borderColor:colors.neutral400}}>
                <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                  <Icons.Newspaper size={20} color={colors.neutral400} />
                  <Text style={{color:colors.neutral900, fontSize:16, fontWeight:'600'}}>Relationship Advice</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'flex-start'}}>
                  <Text style={{color:colors.neutral900, fontSize:16, marginTop:5, fontStyle:'italic', fontWeight:'300'}}>Requested support about a relationship issue. You are not sure about her and if she is the one for you.</Text>
                </View>
                {/* <TouchableOpacity style={{position:'absolute', right:10, bottom:5, flexDirection:'row', alignItems:'center', gap:5}}>
                  <Text style={{color:colors.neutral900, fontSize:16, fontWeight:'600'}}>Revisit</Text>
                  <Icons.ArrowRight size={20} color={colors.neutral900} />
                </TouchableOpacity> */}
              </View>
                {/* <View style={styles.bigcard}>
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
                </View> */}
            </View>

            <View style={{marginTop:spacingY._10}}>
              <Text style={{color:colors.black, fontSize:16, fontWeight:'600'}}>Top Categories</Text>
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
          </View>
        </View>
    </SafeAreaView>
      // </DottedPaper>

  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:verticalScale(8),
    // backgroundColor:'white',
  },
  header:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:spacingY._5,
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
    // marginTop:spacingY._60,
    // paddingTop:spacingY._10,
    paddingBottom: verticalScale(50),
    // gap:spacingY._10,
    backgroundColor:'white',
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.12)',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    paddingHorizontal:spacingX._20,

  },
  moods:{
    justifyContent:'space-between',
    // marginBottom:spacingY._10,
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
    // backgroundColor: colors.neutral300,
    
  },
  cards:{
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:spacingY._10,
  },
  card:{
    padding:spacingX._10,
    borderRadius:20,
    height:verticalScale(70),
    width: '49%',
  },
  bigcard:{
    // backgroundColor:colors.neutral700,
    // padding:spacingX._10,
    marginTop:spacingY._10,
    borderRadius:10,
    height:verticalScale(70),
    width: '100%',
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.12)',
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
  graphicsContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.white,
  },
  purpleShape: {
    position: 'absolute',
    left: 20,
    top: 50,
    width: 120,
    height: 160,
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
    transform: [{ rotate: '15deg' }],
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  blueTriangle: {
    position: 'absolute',
    right: 30,
    top: 80,
    width: 80,
    height: 80,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    transform: [{ rotate: '45deg' }],
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
},
starCutout: {
    width: 20,
    height: 20,
    backgroundColor: colors.white,
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
},
greenSquare: {
    position: 'absolute',
    right: 40,
    bottom: 120,
    width: 60,
    height: 60,
    backgroundColor: '#10B981',
    borderRadius: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
},
circleCutout: {
    width: 16,
    height: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
},
})