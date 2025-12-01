import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

export default function Notification() {

    const navigation = useNavigation();

  return (
    <SafeAreaView style={{flex:1}}>
        <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Account');
                }} style={{width:25,height:25,borderRadius:15,backgroundColor:'#000',alignItems:'center',justifyContent:'center'}}>
                    <Icon name={'chevron-left'} size={20} color={'#fff'}/>
                </TouchableOpacity>
                <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000'}}>Notification</Text>
                <View style={{width:25}}></View>
            </View>

            <View style={{padding:20}}>
                <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Today</Text>

                <View style={{borderColor:'#000',borderWidth:1,padding:15,borderRadius:10,flexDirection:'row',alignItems:'center',marginTop:20}}>
                    <View>
                        <Image source={require('./assets/Profile.png')} style={{width:50,height:50}}/>
                    </View>
                    <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',flex:1,marginLeft:10}}>
                        50% off on your first booking. Grab your stay at EchoTop Pod now.
                    </Text>
                </View>
            </View>
        </View>
    </SafeAreaView>
  )
}