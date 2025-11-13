
import BackButton from '@/components/BackButton'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import { router } from 'expo-router'
import * as Icons from "phosphor-react-native"
import React, { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const AllChats = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (

    
    <SafeAreaView style={{flex:1, backgroundColor:colors.white}}>

      <View style={styles.container}>
        <View style={styles.header}>
            <BackButton iconSize={12} />
          <Text style={[styles.headerTitle, {position: 'absolute', width: '100%', textAlign: 'center', zIndex: -1}]}>Conversations</Text>
          <View style={{flex: 1}} />
          <TouchableOpacity style={styles.searchIcon} onPress={() => router.push('/message')}>
            <Icons.NotePencil size={verticalScale(10)} color={colors.neutral900} weight='bold'/>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Icons.MagnifyingGlass size={20} color={colors.black} weight='bold'/>
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={colors.neutral400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* <Text style={{color:colors.neutral400, fontSize:16, marginBottom:10}}>Recent</Text> */}
        {/* <View style={{height:verticalScale(20), backgroundColor:colors.neutral800, borderRadius:10,marginBottom:20, marginTop:20, padding:15}}>

        </View> */}


        <ScrollView contentContainerStyle={styles.scrollViewStyle} showsVerticalScrollIndicator={false}>
        <Text style={{color:colors.neutral900, fontSize:16, fontWeight:'600', marginTop:20}}>Today</Text>
        
          <View style={{height:verticalScale(50), backgroundColor:colors.neutral100, borderRadius:10, padding:15, borderWidth:1, borderColor:colors.neutral300}}>
            <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
              <Icons.Newspaper size={20} color={colors.neutral400} />
              <Text style={{color:colors.neutral900, fontSize:16, fontWeight:'600'}}>Relationship Advice</Text>
            </View>
            <View style={{flexDirection:'row', alignItems:'flex-start'}}>
              <Text style={{color:colors.neutral900, fontSize:16, marginTop:5, fontStyle:'italic', fontWeight:'300'}}>Requested support about a relationship issue. You are not sure about her and if she is the one for you.</Text>
            </View>
            <TouchableOpacity style={{position:'absolute', right:10, bottom:5, flexDirection:'row', alignItems:'center', gap:5}}>
              <Text style={{color:colors.neutral900, fontSize:16, fontWeight:'600'}}>Revisit</Text>
              <Icons.ArrowRight size={20} color={colors.neutral900} />
            </TouchableOpacity>
          </View>


          <View style={{height:verticalScale(50), backgroundColor:colors.neutral100, borderRadius:10, padding:15, borderWidth:1, borderColor:colors.neutral300}}>
            <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
              <Icons.Newspaper size={20} color={colors.neutral400} />
              <Text style={{color:colors.neutral900, fontSize:16, fontWeight:'600'}}>Stress from Work</Text>
            </View>            
            <View style={{flexDirection:'row', alignItems:'flex-start'}}>
              <Text style={{color:colors.neutral900, fontSize:16, marginTop:5, fontStyle:'italic', fontWeight:'300'}}>Discovered how work has been stressing you out and you are not sure how to handle it.</Text>
            </View>
            <TouchableOpacity style={{position:'absolute', right:10, bottom:5, flexDirection:'row', alignItems:'center', gap:5}}>
              <Text style={{color:colors.neutral900, fontSize:16, fontWeight:'600'}}>Revisit</Text>
              <Icons.ArrowRight size={20} color={colors.neutral900} />
            </TouchableOpacity>
          </View>

          <Text style={{color:colors.neutral900, fontSize:16, fontWeight:'600', marginTop:20}}>7 days ago</Text>
          <View style={{height:verticalScale(50), backgroundColor:colors.neutral100, borderRadius:10, padding:15, borderWidth:1, borderColor:colors.neutral300}}>
            <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
              <Icons.Newspaper size={20} color={colors.neutral400} />
              <Text style={{color:colors.neutral900, fontSize:16, fontWeight:'600'}}>Offloading thoughts</Text>
            </View>            
            <View style={{flexDirection:'row', alignItems:'flex-start'}}>
              <Text style={{color:colors.neutral500, fontSize:16, marginTop:5, fontStyle:'italic', fontWeight:'300'}}>Generic vent about family situation which you can't tell anyone else about.</Text>
            </View>
            <TouchableOpacity style={{position:'absolute', right:10, bottom:5, flexDirection:'row', alignItems:'center', gap:5}}>
              <Text style={{color:colors.neutral900, fontSize:16, fontWeight:'600'}}>Revisit</Text>
              <Icons.ArrowRight size={20} color={colors.neutral900} />
            </TouchableOpacity>
          </View>

          
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default AllChats

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
    position: 'relative'
  },
  searchIcon:{
    // backgroundColor:colors.neutral700,
    padding:spacingX._7,
    borderRadius:50,
    zIndex: 1
  },
  scrollViewStyle:{
    // marginTop:spacingY._10,
    paddingBottom: verticalScale(10),
    gap:20
  },
  headerTitle: {
    color: colors.black,
    fontSize: 20,
    fontWeight:'600'
  },
  searchBar: {
    height: verticalScale(20),
    backgroundColor: colors.white,
    borderWidth:1,
    borderColor:colors.neutral300,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  searchInput: {
    flex: 1,
    color: colors.black,
    fontSize: 16,
    padding: 0,
  },
})