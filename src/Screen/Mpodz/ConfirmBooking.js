import { View, Text, SafeAreaView, ScrollView, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';


export default function ConfirmBooking() {

    const { width, height } = Dimensions.get('window');
    const navigation = useNavigation();
    const [booking, setBooking] = useState('MySelf');

    const userData = {
        name: 'Fracsapce',
        email: 'Fracspace.com',
        phone: '1234567890'
    }


  return (
    <SafeAreaView style={{flex:1}}>
        <ScrollView style={{backgroundColor:'#F5F5F5'}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Home');
                }} style={{width:30,height:30,borderRadius:15,backgroundColor:'#000',justifyContent:'center',alignItems:'center'}}>
                    <Icon name={'chevron-left'} size={20} color={'#FFF'}/>
                </TouchableOpacity>
                <Text style={{fontFamily:'Poppins-Medium',fontSize:18,color:'#000'}}>Confirm Booking</Text>
                <View style={{width:30}}></View>
            </View>

            <View style={{backgroundColor:'#FFF',margin:20,padding:20,borderRadius:10,elevation:5}}>
                <View>
                    <Image source={require('./assets/Pod.png')} style={{width:'100%',height:220,borderRadius:5}}/>
                </View>
                <View style={{marginVertical:15}}>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Name</Text>
                        <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000'}}>SkyLink Pod</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Address</Text>
                        <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000'}}>Banjara Hills, Hyderabad</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Date Of Booking</Text>
                        <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000'}}>27/08/2025</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Stay Dates</Text>
                        <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000'}}>29 - 31 Aug 2025</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <View style={{backgroundColor:'#000',borderRadius:5,alignItems:'center',padding:6,flex:1,marginRight:15}}>
                        <Text style={{fontFamily:'Poppins-SemiBold',fontSize:14,color:'#FFF'}}>Share</Text>
                    </View>
                    <View style={{backgroundColor:'#000',width:30,height:30,borderRadius:15,alignItems:'center',justifyContent:'center'}}>
                        <MaterialCommunityIcons name={'directions-fork'} size={20} color={'#FFF'}/>
                    </View>
                </View>
            </View>

            <View>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}}>
                    <TouchableOpacity onPress={() => {
                        setBooking('MySelf');
                    }} style={{borderBottomWidth:booking==='MySelf'?2 : 0}}>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>MySelf</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setBooking('Others');
                    }} style={{borderBottomWidth:booking==='Others'?2 : 0}}>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Others</Text>
                    </TouchableOpacity>
                </View>

                {booking === 'MySelf' ?
                    <View style={{padding:20}}>
                        <View>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Enter Name</Text>
                            <View style={{borderWidth:1,borderColor:'#000',marginTop:7,borderRadius:10,padding:13}}>
                                {/* <TextInput
                                    value={userData.name}
                                    style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000'}}
                                /> */}
                                <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000'}}>{userData.name}</Text>
                            </View>
                        </View>

                        <View style={{marginTop:20}}>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Enter Email ID</Text>
                            <View style={{borderWidth:1,borderColor:'#000',marginTop:7,borderRadius:10,padding:13}}>
                                <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000'}}>{userData.email}</Text>
                            </View>
                        </View>

                        <View style={{marginTop:20}}>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Enter Phone Number</Text>
                            <View style={{borderWidth:1,borderColor:'#000',marginTop:7,borderRadius:10,padding:13}}>
                                <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000'}}>{userData.phone}</Text>
                            </View>
                        </View>
                    </View>
                    :
                    <View style={{padding:20}}>
                        <View>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Enter Name</Text>
                            <View style={{borderWidth:1,borderColor:'#000',marginTop:7,borderRadius:10}}>
                                <TextInput
                                    style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000',paddingHorizontal:15}}
                                />
                            </View>
                        </View>

                        <View style={{marginTop:20}}>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Enter Email ID</Text>
                            <View style={{borderWidth:1,borderColor:'#000',marginTop:7,borderRadius:10}}>
                                <TextInput
                                    style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000',paddingHorizontal:15}}
                                />
                            </View>
                        </View>

                        <View style={{marginTop:20}}>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Enter Phone Number</Text>
                            <View style={{borderWidth:1,borderColor:'#000',marginTop:7,borderRadius:10}}>
                                <TextInput
                                    style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000',paddingHorizontal:15}}
                                />
                            </View>
                        </View>
                    </View>
                }
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}