import { View, Text, SafeAreaView, Image, TouchableOpacity, TextInput, Alert, Animated, StyleSheet, Button } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { CountryPicker } from 'react-native-country-codes-picker';
import Ico from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Entypo';
import { SendLoginOtp, VerifyLoginOtp } from './MPodzApi';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtpThunk } from '../../redux/slices/userSlice';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

export default function Login() {

    const [animPhone, setAnimPhone] = useState(false);
    const phoneRef = useRef(null);
    const [phone, setPhone] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [selectedCode, setSelectedCode] = useState({code: '+91', name: 'India'});
    const [login, setLogin] = useState(true);
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef([]);
    const navigation = useNavigation();

    const animatedWidth = useRef(new Animated.Value(0)).current;

    const interpolatedWidth = animatedWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    })

    useEffect(() => {
        if (animPhone && phoneRef.current) {
            phoneRef.current.focus();
        }
    }, [animPhone]);

    const handleLogin = async () => {
        const payload = JSON.stringify({
            phone_number: phone,
            country_code: selectedCode.code
        });
        console.log('Payload: ',payload);

        setIsLoading(true);
        Animated.timing(animatedWidth, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false
        }).start();

        try {
            const { data: res } = await SendLoginOtp(payload);
            console.log('Response:', res);

            if (!res.success && res.message === "User with provided phone number does not exist!") {
                Alert.alert("User does not exist. Please register first.");
                return;
            }

            if(res?.success){
                analytics().logEvent('otp_sent_success', {
                    phone: phone,
                    country_code: selectedCode.code,
                });
                // console.log("handleLogin success");
            }

            // setLogin(false);

        } catch (error) {
            console.log('Error in Login:', error.response?.data || error.message);
            crashlytics().recordError(error);
            // Alert.alert("User does not exist. Please register first.");
            setLogin(true);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
                animatedWidth.setValue(0);
            }, 300);
        }
    };

    

    const dispatch = useDispatch();
    const { loading, error, isLoggedIn } = useSelector(state => state.user);

    useEffect(() => {
        if (isLoggedIn) {

            analytics().logEvent('login_success', {
                phone: phone,
                country_code: selectedCode.code,
            });

            navigation.replace('MpodzStack');
        }
    }, [isLoggedIn]);
    
    const verifyOtp = () => {
        const otp = otpDigits.join('');

        analytics().logEvent('verify_otp_attempt', {
            phone: phone,
            otp_length: otp.length,
        });

        dispatch(
            verifyOtpThunk({
                phone,
                country_code: selectedCode.code,
                otp_code: otp
            })
        );
    };


    // const verifyOtp = async() => {
    //     const otp = otpDigits.join('');
    //     let payload = JSON.stringify(
    //         {
    //             phone_number: phone,
    //             country_code: selectedCode.code,
    //             otp_code: otp,
    //             otp_type: "login"
    //         }
    //     );
    //     console.log('Verify OTP Payload: ',payload);

    //     setIsLoading(true);
    //     Animated.timing(animatedWidth, {
    //         toValue: 1,
    //         duration: 3000,
    //         useNativeDriver: false
    //     }).start();

    //     try{
    //         const {data : res} = await VerifyLoginOtp(payload);
    //         console.log('Verify Otp: ',res);
    //         if(res?.success){
    //             await AsyncStorage.setItem('authToken', res.token);
    //             await AsyncStorage.setItem('userPhone', phone);
    //             navigation.navigate('MpodzStack');
    //         }
    //     }catch(error){
    //         console.error("Error in Verifying Otp: ",error.response?.data || error.message);
    //     }finally{
    //         setTimeout(() => {
    //             setIsLoading(false);
    //             animatedWidth.setValue(0);
    //         }, 300);
    //     }
    // };

    const handleChange = (text, index) => {
        const updatedOtp = [...otpDigits];
        updatedOtp[index] = text;
        setOtpDigits(updatedOtp);

        if(text && index < 5){
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
        <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
            <View style={{paddingTop:40,alignItems:'center'}}>
                <Image resizeMode='contain' source={require('./assets/MpodLogo.png')} style={{width:'60%',height:90}}/>
            </View>

            <View style={{alignItems:'center',paddingBottom:20}}>
                <Text style={{fontFamily:'Poppins-Medium',fontSize:18,color:'#000'}}>Welcome to Metro Podz!</Text>
            </View>

            {login ?
                <View>
                    <View style={{margin:20,marginTop:animPhone && 10}}>
                        {animPhone &&
                            <Text style={{fontFamily:'Poppins-Regular',fontSize:13,color:'#000'}}>Enter Phone Number</Text>
                        }

                        <TouchableOpacity activeOpacity={1} onPress={() => {
                            setAnimPhone(true)
                        }} style={{borderColor:'#000',borderWidth:1,borderRadius:10,padding:5,marginTop:7,flexDirection:'row',alignItems:'center'}}>
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
                                <View style={{flex:1}}>
                                    <TextInput ref={phoneRef}
                                        value={phone}
                                        onChangeText={setPhone}
                                        style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginLeft:10,flex:1,}}
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

                    <View style={{alignItems:'center',marginTop:20}}>
                        <TouchableOpacity 
                        onPress={() => {
                            // setLogin(false);
                            if (phone === '') {
                                Alert.alert('Alert','Oops! You missed the phone number.');
                                return; 
                            }
                            if(phone.length !== 10){
                                Alert.alert('Alert', 'Phone Number should be of 10 digits.');
                                return;
                            }
                            setLogin(false);
                            handleLogin();

                            // For firebase analytics....
                            analytics().logEvent('send_otp_attempt', {
                                phone: phone,
                                country_code: selectedCode.code,
                            });

                            // setVisible2(true);
                            // setVisible1(false); 
                        }}
                         disabled={isLoading}   style={{backgroundColor:'#eb2c19',padding:10,paddingHorizontal:20,borderRadius:10}}
                        >
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#FFF'}}>Send OTP</Text>
                            {isLoading && (
                                <Animated.View
                                    style={[styles.overlay, {width: interpolatedWidth}]}
                                />
                            )}
                        </TouchableOpacity>


                        
                        <Button
                            title="Test Crash"
                            onPress={() => crashlytics().crash()}
                        />
                    </View>

                    <TouchableOpacity onPress={() => {
                        navigation.navigate('Registeration');
                    }} style={{alignSelf:'center',marginTop:40}}>
                        <Text style={{fontFamily:'Montserrat-Medium',fontSize:14,color:'#8E9398'}}>
                            Don't have an account yet? <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:16,color:'#000000'}}> Sign up</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
                :
                <View>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
                        <TouchableOpacity onPress={() => setLogin(true)} style={{backgroundColor:'#6262624D',padding:5,borderRadius:5}}>
                            <Icon name={'chevron-left'} size={20} color={'#000'}/>
                        </TouchableOpacity>
                        <Text style={{fontFamily:'Poppins-Medium',fontSize:18,color:'#000'}}>Verify OTP</Text>
                        <View></View>
                    </View>

                    <View style={{alignItems:'center',paddingVertical:10}}>
                        <Text style={{fontFamily:'Poppins-Regular',fontSize:15,color:'#000'}}>We’ve sent a code to <Text style={{fontFamily:'Poppins-Medium'}}>{selectedCode.code}  {phone}</Text></Text>
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
                            // handleVerifyOtp();
                            verifyOtp();
                        }} disabled={isLoading} style={{backgroundColor:'#eb2c19',padding:12,paddingHorizontal:20,borderRadius:10,alignItems:'center'}}>
                            <Text style={{fontFamily:'Poppins-SemiBold',fontSize:14,color:'#FFF'}}>Verify OTP</Text>
                            {isLoading && (
                                <Animated.View
                                    style={[styles.overlay, {width: interpolatedWidth}]}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    overlay: {
        backgroundColor:'rgba(255,255,255,0.2)',
        position:'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 1
    }
})