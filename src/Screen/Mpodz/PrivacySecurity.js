import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Entypo';
import Ico from 'react-native-vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';

export default function PrivacySecurity() {

    const navigation = useNavigation();
    const [location, setLocation] = useState('');
    const [notifications, setNotifications] = useState('');
    const [camera, setCamera] = useState('');
    const [smsUpdate, setSmsUpdate] = useState('');

  return (
    <SafeAreaView style={{flex:1}}>
        <View style={{flex:1,backgroundColor:'#f5f5f5',marginTop:20}}>
            <View style={{padding:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Account');
                }} style={{width:25,height:25,backgroundColor:'#000',borderRadius:25,alignItems:'center',justifyContent:'center'}}>
                    <Icon name={'chevron-left'} size={20} color={'#fff'}/>
                </TouchableOpacity>
                <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000'}}>Privacy & Security</Text>
                <View style={{width:25}}></View>
            </View>

            <View style={{padding:20}}>
                <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Control app access to your location, notifications, and more.</Text>

                <View style={{marginTop:30}}>
                    <TouchableOpacity onPress={() => {
                        setLocation(prev => !prev);
                    }} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Location</Text>
                        <View>
                            {location ? 
                                <Ico name={'toggle-on'} size={30} color={'#496FFF'}/>
                                :
                                <Ico name={'toggle-off'} size={30} color={'#496FFF'}/>
                            }
                        </View>
                    </TouchableOpacity>
                    <View style={{borderTopColor:'#000000b9',borderTopWidth:1,marginVertical:15}}/>

                    <TouchableOpacity onPress={() => {
                        setNotifications(prev => !prev);
                    }} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Notifications</Text>
                        <View>
                            {notifications ?
                                <Ico name={'toggle-on'} size={30} color={'#496fff'}/>
                                :
                                <Ico name={'toggle-off'} size={30} color={'#496fff'}/>
                            }
                        </View>
                    </TouchableOpacity>
                    <View style={{borderTopColor:'#000000b9',borderTopWidth:1,marginVertical:15}}/>

                    <TouchableOpacity onPress={() => {
                        setCamera(prev => !prev);
                    }} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Camera</Text>
                        {camera ?
                            <Ico name={'toggle-on'} size={30} color={'#496fff'}/>
                            :
                            <Ico name={'toggle-off'} size={30} color={'#496fff'}/>
                        }
                    </TouchableOpacity>
                    <View style={{borderTopColor:'#000000b9',borderTopWidth:1,marginVertical:15}}/>

                    <TouchableOpacity onPress={() => {
                        setSmsUpdate(prev => !prev);
                    }} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Allow SMS Update</Text>
                        {smsUpdate?
                            <Ico name={'toggle-on'} size={30} color={'#496fff'}/>
                            :
                            <Ico name={'toggle-off'} size={30} color={'#496fff'}/>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity style={{marginTop:40}}>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#eb2c19'}}>Request Account Deletion</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </SafeAreaView>
  )
}
