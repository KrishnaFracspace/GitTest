import { View, Text, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Entypo';
import Ico from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { Registration, SendLoginOtp, VerifyLoginOtp } from './MPodzApi';
import { CountryPicker } from 'react-native-country-codes-picker';
import { MpodzContext } from './MpodzContex';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Registeration() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [selectedCode, setSelectedCode] = useState({ code: '+91', name: 'India' });
    const [animName, setAnimName] = useState(false);
    const [animPhone, setAnimPhone] = useState(false);
    const [animMail, setAnimMail] = useState(false);
    const [registration, setRegistration] = useState(true);
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [userReg, setUserReg] = useState([]);
    const inputRefs = useRef([]);
    const phoneRef = useRef(null);
    const nameRef = useRef(null);
    const mailRef = useRef(null);
    const navigation = useNavigation();

    const { setToken } = useContext(MpodzContext);
 
    useEffect(() => {
        if (animPhone && phoneRef.current) {
            phoneRef.current.focus();
        }
    }, [animPhone]);

    useEffect(() => {
        if (animName && nameRef.current) {
            nameRef.current.focus();
        }
    }, [animName]);

    useEffect(() => {
        if (animMail && mailRef.current) {
            mailRef.current.focus();
        }
    }, [animMail]);

    const handleRegistration = async () => {
        let payload = JSON.stringify({
            name: name,
            email: email,
            phone_number: phone,
            country_code: selectedCode.code,
            password: ""
        });
        console.log('Payload: ', payload);

        try {
            let { data: res } = await Registration(payload);
            const data = res.data;
            setUserReg(data);
            console.log("Registration: ", data);
            return data;
        } catch (error) {
            console.error('Error in Registration: ', error.response?.data || error);
            return error.response?.data || { success: false, error: 'Something went wrong' };
        }
    }

    const  handleSendOtp = async () => {
        let payload = JSON.stringify({
            phone_number: phone,
            country_code: selectedCode.code
        });

        try {
            let { data: res } = await SendLoginOtp(payload);
            const data = res.data;
            console.log("Otp Sent: ", data);
            return data; // ✅ Return OTP sent info
        } catch (error) {
            console.error('Error in Sending Otp: ', error.response?.data || error.message);
            return { success: false, error: error.response?.data?.error || "Failed to send OTP" };
        }
    };

    // const handleVerifyOtp = async () => {
    //     const otp = otpDigits.join('');
    //     const payload = JSON.stringify({
    //         phone_number: phone,
    //         country_code: selectedCode.code,
    //         otp_code: otp,
    //         otp_type: "login"
    //     });
    //     console.log("verify", payload)

    //     try {
    //         const { data: res } = await VerifyLoginOtp(payload); // Your API to verify OTP
    //         // const data = res.data;
    //         if (res?.success) {
    //             console.log("OTP Verified: ", res);
    //             // Alert.alert("Success", "Phone verified successfully!");
    //             setToken(res.token);
    //             navigation.navigate('HomeStack');
    //         } else {
    //             Alert.alert("Error", res?.error || "OTP verification failed");
    //         }
    //     } catch (error) {
    //         console.error("Error in OTP verification: ", error.response?.data || error.message);
    //         Alert.alert("Error", "OTP verification failed");
    //     }
    // };

    // 

    const handleVerifyOtp = async () => {
        const otp = otpDigits.join('');
        const payload = JSON.stringify({
            phone_number: phone,
            country_code: selectedCode.code,
            otp_code: otp,
            otp_type: "login"
        });

        try {
            const { data: res } = await VerifyLoginOtp(payload);

            if (res?.success) {
                console.log("OTP Verified: ", res);

                // Store token persistently
                await AsyncStorage.setItem('authToken', res.token);

                // Optional: store in state for immediate use
                setToken(res.token);

                navigation.navigate('HomeStack');
            } else {
                Alert.alert("Error", res?.error || "OTP verification failed");
            }
        } catch (error) {
            console.error("Error in OTP verification: ", error.response?.data || error.message);
            Alert.alert("Error", "OTP verification failed");
        }
    };

    const handleVerify = async () => {
        if (!name || !email || !phone) {
            Alert.alert('Alert', "Please fill all fields for Register");
            return; // exit early
        }

        const data = await handleRegistration();
        console.log("Data: ", data);

        if (data?.token && data?.user) {
            // Registration succeeded
            await handleSendOtp();
            setRegistration(false);
        } else {
            Alert.alert('Alert', data?.error || "Something went wrong");
        }
    }


    const handleChange = (text, index) => {
        const updatedOtp = [...otpDigits];
        updatedOtp[index] = text;
        setOtpDigits(updatedOtp);

        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && otpDigits[index] === '') {
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

  return (
    <SafeAreaView style={{flex:1}}>
        <ScrollView style={{backgroundColor:'#f5f5f5',}}>
            <View style={{paddingTop:40,alignItems:'center'}}>
                <Image resizeMode='contain' source={require('./assets/MpodLogo.png')} style={{width:'60%',height:90}}/>
            </View>

            {registration ?
                <>
                    <View style={{alignItems:'center',paddingBottom:20}}>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:18,color:'#000'}}>Welcome to Metro Podz!</Text>
                    </View>

                    <View style={{margin:20, marginTop:animName && 10}}>
                        {animName &&
                            <Text style={{fontFamily:'Poppins-Regular',fontSize:13,color:'#000',}}>Enter Full Name</Text>
                        }
                    
                        <TouchableOpacity activeOpacity={1} onPress={() => {
                            setAnimName(true);
                        }} style={{borderColor:'#000',borderWidth:1,borderRadius:10,marginTop:7}}>
                            {!animName ?
                                <View style={{padding:15}}>
                                    <Text style={{fontFamily:'Poppins-Regular',fontSize:13,color:'#000',paddingLeft:12}}>Enter Full Name</Text>
                                </View>
                                :
                                <View>
                                    <TextInput 
                                        ref={nameRef}
                                        value={name}
                                        onChangeText={setName}
                                        style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginLeft:12}}
                                    />
                                </View>
                            }
                        </TouchableOpacity>
                    </View>

                    <View style={{margin:20,marginTop:animPhone && 10}}>
                        {animPhone &&
                            <Text style={{fontFamily:'Poppins-Regular',fontSize:13,color:'#000'}}>Enter Phone Number</Text>
                        }

                        <TouchableOpacity activeOpacity={1} onPress={() => {
                            setAnimPhone(true)
                        }} style={{borderColor:'#000',borderWidth:1,borderRadius:10,marginTop:7,flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity onPress={() => {
                                setShowPicker(true);
                            }} style={{flexDirection:'row',alignItems:'center',padding:10,borderRightWidth:1}}>
                                <Text style={{fontFamily:'Poppins-SemiBold',fontSize:14,color:'#000',}}>
                                    {selectedCode.code}
                                </Text>
                                <Ico name={'caretdown'} size={10} color={'#000'} style={{marginLeft:5}}/>
                            </TouchableOpacity>
                            
                            {!animPhone ?
                                <View style={{padding:15}}>
                                    <Text style={{fontFamily:'Poppins-Regular',fontSize:13,color:'#000',paddingLeft:0}}>Enter Phone Number</Text>
                                </View>
                                :
                                <View>
                                    <TextInput ref={phoneRef}
                                        value={phone}
                                        onChangeText={setPhone}
                                        style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginLeft:0}}
                                    />
                                </View>
                            }
                        </TouchableOpacity>
                    </View>

                    <CountryPicker
                        show={showPicker}
                        pickerButtonOnPress={(item) => {
                            setSelectedCode({ code: item.dial_code, name: item.name });
                            setShowPicker(false);
                        }}
                        onBackdropPress={() => setShowPicker(false)}
                        style={{
                            modal: {height: 400},
                            countryName: {color:'#000'},
                            dialCode: {color: '#000'},
                            flag: {color: '#000'},
                            textInput: {color:'#000'}
                        }}
                    />

                    <View style={{margin:20,marginTop: animMail && 10}}>
                        {animMail &&
                            <Text style={{fontFamily:'Poppins-Regular',fontSize:13,color:'#000'}}>Enter Email ID</Text>
                        }
                        <TouchableOpacity activeOpacity={1} onPress={() => {
                            setAnimMail(true);
                        }} style={{borderColor:'#000',borderWidth:1,borderRadius:10,marginTop:7}}>
                            {!animMail ? 
                                <View style={{padding:15}}>
                                    <Text style={{fontFamily:'Poppins-Regular',fontSize:13,color:'#000',paddingLeft:12}}>Enter Email ID</Text>
                                </View>
                                :
                                <View>
                                    <TextInput
                                        ref={mailRef}
                                        value={email}
                                        onChangeText={setEmail}
                                        style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginLeft:12}}
                                    />
                                </View>
                            }
                        </TouchableOpacity>
                    </View>

                    <View style={{alignItems:"center",marginTop:20}}>
                        <TouchableOpacity onPress={() => {
                            // setRegistration(false);
                            handleVerify();
                        }} style={{backgroundColor:'#eb2c19',padding:10,paddingHorizontal:20,borderRadius:10}}>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#FFF'}}>Send OTP</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Login');
                    }} style={{alignSelf:'center',marginTop:20}}>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#8E9398'}}>
                            Already have an account? <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000'}}>Sign in</Text>
                        </Text>
                    </TouchableOpacity>

                    <View style={{alignItems:'center',justifyContent:'center',flexDirection:'row',marginVertical:30}}>
                        <View style={{borderTopWidth:1,borderColor:'#00000030',width:'23%'}}></View>
                        <Text style={{fontFamily:'Poppins-Regular',fontSize:16,color:'#000',marginHorizontal:15}}>Or Continue With</Text>
                        <View style={{borderTopWidth:1,borderColor:'#00000030',width:'23%'}}></View>
                    </View>

                    <View style={{marginHorizontal:20,alignItems:'center',flexDirection:'row',alignSelf:'center',gap:15,}}>
                        <View style={{backgroundColor:'#e0e0e06f',width:60,height:60,borderRadius:30,alignItems:'center',justifyContent:'center'}}>
                            <Image source={require('./assets/Google.png')} style={{width:30,height:30}}/>
                        </View>
                        <View style={{backgroundColor:'#e0e0e06f',width:60,height:60,borderRadius:30,alignItems:'center',justifyContent:'center'}}>
                            <Image source={require('./assets/Apple.png')} style={{width:30,height:30}}/>
                        </View>
                    </View>
                </>
                :
                <View>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
                        <TouchableOpacity onPress={() => setRegistration(true)} style={{backgroundColor:'#6262624D',padding:5,borderRadius:5}}>
                            <Icon name={'chevron-left'} size={20} color={'#000'}/>
                        </TouchableOpacity>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:18,color:'#000'}}>Verify OTP</Text>
                        <View></View>
                    </View>

                    <View style={{alignItems:'center',paddingVertical:10}}>
                        <Text style={{fontFamily:'Poppins-Regular',fontSize:15,color:'#000'}}>We’ve sent a code to <Text style={{fontFamily:'Poppins-Medium'}}>+91 XXXX-XX1234</Text></Text>
                    </View>

                    <View style={{flexDirection:'row',alignItems:'center',alignSelf:'center',gap:10,marginTop:30}}>
                        {[0,1,2,3,4,5].map((index) => (
                            <View key={index} style={{borderColor:'#e1e6eb',borderWidth:1,borderRadius:10,paddingHorizontal:5}}>
                                <TextInput
                                    ref={(ref) => (inputRefs.current[index] = ref)}
                                    style={{fontFamily:'WorkSans-Medium',fontSize:20,color:'#000',textAlign:'center',width:30}}
                                    keyboardType='number-pad'
                                    maxLength={1}
                                    value={otpDigits[index]}
                                    onChangeText={(text) => handleChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                />
                                <View style={{borderTopColor:'#8e9398',borderTopWidth:1,marginBottom:10}}></View>
                            </View>
                        ))}
                    </View>

                    <View style={{alignItems:'center',marginVertical:30}}>
                        <Text style={{fontFamily:'Poppins-Regular',fontSize:15,color:'#000'}}>Didn't receive the OTP ?<Text style={{fontFamily:'Poppins-Medium'}}> Resend</Text></Text>
                    </View>

                    <View style={{alignItems:'center',}}>
                        <TouchableOpacity onPress={() => {
                            // navigation.navigate('MPodzHome');
                            handleVerifyOtp();
                        }} style={{backgroundColor:'#eb2c19',padding:12,paddingHorizontal:20,borderRadius:10,alignItems:'center'}}>
                            <Text style={{fontFamily:'Poppins-SemiBold',fontSize:14,color:'#FFF'}}>Verify OTP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </ScrollView>
    </SafeAreaView>
  )
}