import { View, Text, SafeAreaView, Image, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Entypo';
import Ico from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ShareWithFriends from './ShareWithFriends';

export default function ReferEarn() {

    const {width, height} = Dimensions.get('window');
    const navigation = useNavigation();

  return (
    <SafeAreaView style={{flex:1}}>
        <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
            <View style={{padding:20}}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Account');
                }} style={{width:25,height:25,backgroundColor:'#000',borderRadius:15,alignItems:'center',justifyContent:'center'}}>
                    <Icon name={'chevron-left'} size={20} color={'#fff'}/>
                </TouchableOpacity>

                <View style={{padding:20,alignItems:'center'}}>
                    <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000',textAlign:'center'}}>Invite your friends and earn exclusive rewards!</Text>

                    <View style={{marginTop:20}}>
                        <Image resizeMode='contain' source={require('./assets/Refer&Earn.png')} style={{width:width*0.5,height:150,}}/>
                    </View>

                    <View style={{backgroundColor:'#FFF',borderRadius:10,padding:15,paddingHorizontal:30,elevation:5,marginVertical:20}}>
                        <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#13233D',textAlign:'center',lineHeight:25}}>
                            Invite friends using your referral link and unlock exciting offers or coupons!
                        </Text>
                    </View>

                    <View style={{alignItems:'center',flexDirection:'row',}}>
                        <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000'}}>Referral Code</Text>
                        <Ico name={'copy'} size={20} color={'#000'} style={{marginLeft: 10}}/>
                    </View>

                    <View style={{borderColor:'#000',borderWidth:0.5,borderRadius:10,padding:7,borderStyle:'dashed',marginTop:15,paddingHorizontal:20}}>
                        <Text style={{fontFamily:'Poppins-Regular',fontSize:20,color:'#00000092',letterSpacing:5}}>ART16723</Text>
                    </View>

                    {/* <View style={{backgroundColor:'#eb2c19',padding:10,marginTop:40,borderRadius:5,alignItems:'center',paddingHorizontal:80}}>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#FFF'}}>Share</Text>
                    </View> */}
                    <ShareWithFriends/>
                </View>
            </View>
        </View>
    </SafeAreaView>
  )
}