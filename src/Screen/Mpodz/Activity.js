import { View, Text, SafeAreaView, ScrollView, Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Entypo';

export default function Activity() {
  return (
    <SafeAreaView style={{flex:1}}>
        <ScrollView style={{backgroundColor:'#f5f5f5'}}>
            <View style={{padding:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <View style={{width:25,height:25,borderRadius:13,alignItems:'center',justifyContent:'center',backgroundColor:'#000'}}>
                    <Icon name={'chevron-left'} size={20} color={'#fff'}/>
                </View>
                <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>My Activity</Text>
                <View style={{width:25}}></View>
            </View>
            <View style={{paddingHorizontal:20}}>
                <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>History</Text>

                <View style={{backgroundColor:'#fff',borderRadius:10,padding:10,marginTop:15,alignItems:'center',flexDirection:'row',justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row',alignItems:'center',}}>
                        <View>
                            <Image source={require('./assets/Pod.png')} style={{width: 90,height:75,borderRadius:10}}/>
                        </View>
                        <View style={{marginLeft:15}}>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#0000007c'}}>Banjara Hills, Hyderabad</Text>
                            <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000'}}>₹3,640</Text>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#0000007c'}}>31 Aug 2025</Text>
                        </View>
                    </View>
                    <View>
                        <Icon name={'chevron-right'} size={22} color={'#000'}/>
                    </View>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}