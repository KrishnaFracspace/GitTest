import { View, Text, SafeAreaView, Image, TouchableOpacity, Modal, Dimensions, TextInput } from 'react-native'
import React, { useContext, useState } from 'react'
import Icon from 'react-native-vector-icons/Entypo';
import Ico from 'react-native-vector-icons/FontAwesome5';
import Ic from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Account() {

    const {width, height} = Dimensions.get('window');
    const [profile, setProfile] = useState(false);
    const [camera, setCamera] = useState(false);
    const navigation = useNavigation();

    const handleLogout= async() => {
        try{
            await AsyncStorage.multiRemove(['authToken', 'userPhone']);
            navigation.replace('Login');
            console.log("User Logged out and async cleaned..");
        }catch(error){
            console.error("Error in clearing AsyncStorage: ",error);
        }
    }


  return (
    <SafeAreaView style={{backgroundColor:'#FAFAFA',flex:1}}>
        <View style={{flex:1,justifyContent:'space-between'}}>
            <View>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between',padding:20}}>
                    {/* <View style={{width:25,height:25,borderRadius:15,alignItems:'center',justifyContent:'center',backgroundColor:'#000'}}>
                        <Icon name={'cross'} size={20} color={'#fff'}/>
                    </View> */}
                    <View style={{width:20}}></View>
                    <Text style={{fontFamily:'Poppins-Medium',fontSize:18,color:'#000'}}>Account</Text>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Notification');
                    }}>
                        <Ico name={'bell'} size={20} color={'#000'}/>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection:'row',alignItems:'center',padding:20}}>
                    <View style={{width:100,height:100,borderRadius:50,zIndex:1}}>
                        <Image source={require('./assets/Profile.png')} style={{width:'100%',height:'100%'}}/>
                        <View style={{position:'absolute',bottom:-5,left:5}}>
                            <TouchableOpacity onPress={() =>{
                                setCamera(true);
                            }} style={{backgroundColor:'#FFF',width:30,height:30,borderRadius:15,alignItems:'center',justifyContent:'center',}}>
                                <Icon name={'camera'} size={20} color={'#000'}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{backgroundColor:'#FFF',borderRadius:15,padding:22,zIndex:0,marginLeft:-50,elevation:5,alignItems:'center',flex:1}}>
                        <View style={{marginLeft:10}}>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Nandu Parimi</Text>
                            <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#13233D'}}>nanduparimi@gmail.com</Text>
                        </View>
                    </View>
                </View>

                <View style={{paddingHorizontal:20,flexDirection:'row',alignItems:'center',justifyContent:'space-evenly'}}>
                    <View style={{backgroundColor:'#FFF',padding:15,alignItems:'center',flexDirection:'row',elevation:5,borderRadius:10}}>
                        <Ic name={'call'} size={18} color={'#000'}/>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginLeft:10}}>Call Support</Text>
                    </View>
                    <View style={{backgroundColor:'#FFF',padding:15,alignItems:'center',flexDirection:'row',elevation:5,borderRadius:10}}>
                        <Ic name={'chatbubbles'} size={18} color={'#000'}/>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginLeft:10}}>Live Chat</Text>
                    </View>
                </View>

                <View style={{backgroundColor:'#FFF',borderRadius:10,padding:20,elevation:5,margin:20}}>
                    <TouchableOpacity onPress={() => {
                        setProfile(true);
                    }} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Ico name={'user-alt'} size={18} color={'#000'}/>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginLeft:15}}>My Profile</Text>
                        </View>
                        <Ico name={'chevron-right'} size={15} color={'#000'}/>
                    </TouchableOpacity>

                    <View style={{borderTopColor:'#BCBABA',borderWidth:0.5,marginLeft:30,marginVertical:15}}/>

                    <TouchableOpacity onPress={() => {
                        navigation.navigate('PrivacySecurity');
                    }} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <MaterialCommunityIcons name={'shield-lock'} size={20} color={'#000'}/>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginLeft:12}}>Privacy & Security</Text>
                        </View>
                        <Ico name={'chevron-right'} size={15} color={'#000'}/>
                    </TouchableOpacity>

                    <View style={{borderTopColor:'#bcbaba',borderWidth:0.5,marginLeft:30,marginVertical:15}}/>

                    <TouchableOpacity onPress={() => {
                        navigation.navigate('ReferEarn');
                    }} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Image source={require('./assets/Refer.png')} style={{width:20,height:20}}/>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginLeft:15}}>Refer and Earn</Text>
                        </View>
                        <Ico name={'chevron-right'} size={15} color={'#000'}/>
                    </TouchableOpacity>

                    <View style={{borderTopColor:'#bcbaba',borderWidth:0.5,marginLeft:30,marginVertical:15}}/>

                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                        <TouchableOpacity onPress={() => {
                            handleLogout();
                        }} style={{flexDirection:'row',alignItems:'center'}}>
                            <Image source={require('./assets/LogOut.png')} style={{width:20,height:20}}/>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#EB2C19',marginLeft:15}}>LogOut</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
            </View>

            <View style={{alignItems:'center',padding:20}}>
                <Text style={{fontFamily:'Poppins-Regular',fontSize:12,color:'#000'}}>Version v1</Text>
                <Text style={{fontFamily:'Poppins-Regular',fontSize:12,color:'#000',marginTop:10}}>Read our <Text style={{color:'#285AFF'}}>Privacy Policy</Text> & <Text style={{color:'#285aff'}}>Terms of Use</Text></Text>
            </View>

            {profile &&
            <Modal modalStyle={{width}} visible={true} transparent>
                <View style={{flex:1,backgroundColor:'#000000B3'}}>
                    <TouchableOpacity onPress={() => {
                        setProfile(false);
                    }} style={{flex:1}}/>
                    <View style={{position:'absolute',bottom:0,width:width,backgroundColor:'#f5f5f5',borderTopLeftRadius:30,borderTopRightRadius:30,padding:20,elevation:5}}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                            <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000'}}>My Profile</Text>
                            <TouchableOpacity onPress={() => {
                                setProfile(false);
                            }} style={{width:25,height:25,borderRadius:25,backgroundColor:'#d9d9d9ad',alignItems:'center',justifyContent:'center'}}>
                                <Icon name={'cross'} size={20} color={'#000'}/>
                            </TouchableOpacity>
                        </View>

                        <View style={{marginTop:20}}>
                            <Text style={{fontFamily:'Poppins-Regular',fontSize:16,color:'#000'}}>Name</Text>
                            <View style={{borderColor:'#00000098',borderRadius:10,borderWidth:1,marginTop:10}}>
                                <TextInput 
                                    placeholder='Enter Name'
                                    placeholderTextColor={'#abababcd'}
                                    style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginLeft:12}}
                                />
                            </View>
                        </View>

                        <View style={{marginTop:20}}>
                            <Text style={{fontFamily:'Poppins-Regular',fontSize:16,color:'#000'}}>Email ID</Text>
                            <View style={{borderColor:'#00000098',borderRadius:10,borderWidth:1,marginTop:10}}>
                                <TextInput
                                    placeholder='Enter Email'
                                    placeholderTextColor={'#abababcd'}
                                    style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginLeft:12}}
                                />
                            </View>
                        </View>

                        <View style={{marginTop:20}}>
                            <Text style={{fontFamily:'Poppins-Regular',fontSize:16,color:'#000'}}>Phone Number</Text>
                            <View style={{borderColor:'#00000098',borderRadius:10,borderWidth:1,marginTop:10}}>
                                <TextInput 
                                    placeholder='Enter Phone Number'
                                    placeholderTextColor={'#abababcd'}
                                    style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginLeft:12}}
                                />
                            </View>
                        </View>

                        <View style={{alignItems:'center',marginTop:40}}>
                            <View style={{backgroundColor:'#eb2c19',padding:15,paddingHorizontal:100,borderRadius:10,alignItems:'center'}}>
                                <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#fff'}}>Save</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            }
            
            {camera &&
                <Modal modalStyle={{width}} visible={true} transparent>
                    <View style={{flex:1,backgroundColor:'#000000b3'}}>
                        <TouchableOpacity onPress={() => {
                            setCamera(false);
                        }} style={{flex:1}}/>
                        <View style={{position:'absolute',bottom:0,width:width,backgroundColor:'#f5f5f5',borderTopLeftRadius:30,borderTopRightRadius:30,padding:20,elevation:5}}>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000'}}>Select Profile Photo</Text>
                                <TouchableOpacity onPress={() => {
                                    setCamera(false);
                                }} style={{width:25,height:25,backgroundColor:'#d9d9d9ad',borderRadius:15,alignItems:'center',justifyContent:'center'}}>
                                    <Icon name={'cross'} size={20} color={'#000'}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{padding:20,alignItems:'center',flexDirection:'row',justifyContent:'space-evenly',}}>
                                <View style={{borderColor:'#0000007c',borderWidth:0.5,borderRadius:10,padding:15,alignItems:'center'}}>
                                    <Icon name={'camera'} size={20} color={'#000'}/>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginTop:10}}>Camera</Text>
                                </View>
                                <View style={{borderColor:'#0000007c',borderWidth:0.5,borderRadius:10,padding:15,paddingHorizontal:20,alignItems:'center',justifyContent:'center'}}>
                                    <Icon name={'images'} size={20} color={'#000'}/>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginTop:10}}>Gallery</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            }
        </View>
    </SafeAreaView>
  )
}
