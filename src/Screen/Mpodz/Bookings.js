import { View, Text, SafeAreaView, ScrollView, Image } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Entypo';
import QRCode from 'react-native-qrcode-svg';

export default function Bookings() {
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#f5f5f5'}}>
        <ScrollView>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
                <View style={{width:25,height:25,borderRadius:15,backgroundColor:'#000',alignItems:'center',justifyContent:'center'}}>
                    <Icon name={'chevron-left'} size={20} color={'#fff'}/>
                </View>
            </View>

            <View style={{paddingHorizontal:20,}}>
                <Text style={{fontFamily:'Poppins-Medium',fontSize:15,color:'#000'}}>Latest Bookings</Text>

                <View style={{borderColor:'#000',borderRadius:10,padding:10,borderWidth:0.5,marginTop:20}}>
                    <View style={{flexDirection:'row',alignItems:'center',}}>
                        <View>
                            <Image resizeMode='stretch' source={require('./assets/Pod.png')} style={{width:110,height:110,borderRadius:10}}/>
                        </View>
                        <View style={{marginLeft:10,gap:2,flex:1}}>
                            <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000'}}>Nandu Parimi</Text>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>
                                Date Of Booking: <Text style={{fontFamily:'Poppins-Regular',fontSize:14}}>27/08/2025</Text>
                            </Text>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>
                                Location: <Text style={{fontFamily:'Poppins-Regular',fontSize:14}}>Banjara Hills, Hyderabad</Text>
                            </Text>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>
                                Stay Dates: <Text style={{fontFamily:'Poppins-Regular',fontSize:14}}>29-31 Aug 2025</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={{borderColor:'#000',borderWidth:0.5,borderStyle:'dashed',marginVertical:12}}/>

                    <View style={{alignItems:'center'}}>
                        <QRCode
                            size={120}
                            color='#000'
                            backgroundColor='#fff'
                        />

                        <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#0000009d',marginTop:10}}>Scan the QR code to check in</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}