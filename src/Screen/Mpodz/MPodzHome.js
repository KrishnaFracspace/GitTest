import { View, Text, SafeAreaView, ImageBackground, TextInput, Dimensions, Image, ScrollView, PanResponder, Animated, TouchableOpacity, Modal, Alert, Button, ActivityIndicator, BackHandler } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Feather';
import Ico from 'react-native-vector-icons/Ionicons';
import Ic from 'react-native-vector-icons/Entypo';
import Icc from 'react-native-vector-icons/AntDesign';
import CustomModal from './CustomModal';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { MpodzContext } from './MpodzContex';
import { BookPodz, GetPodz } from './MPodzApi';
// import { CFPaymentGatewayService } from 'react-native-cashfree-pg-sdk';
// import { CFSession, CFEnvironment, CFUPIIntentCheckoutPayment, CFThemeBuilder } from 'cashfree-pg-api-contract';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const BACKEND_URL = 'https://metropodz-mvp.onrender.com/api/v1/payments/status/METRO_1760069897324_C4630A4C';

export default function MPodzHome() {

    const { width, height } = Dimensions.get('window');
    const [bookingFor, setBookingFor] = useState('MySelf');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [selectedDates, setSelectedDates] = useState({});
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [podzDescription, setPodzDescription] = useState([]);
    const [bottomNav, setBottomNav] = useState('Home');
    const [addOnPrice, setAddOnPrice] = useState('500');
    const [addOnContent, setAddOnContent] = useState('Breakfast');
    const [chooseAddOn, setChooseAddOn] = useState('Breakfast');
    const [addOn, setAddOn] = useState(false); //first modal
    const [confirmBooking, setConfirmBooking] = useState(false); //second modal
    const [selectPayment, setSelectPayment] = useState(false); // third modal
    const [selectPaymentMethod, setSelectPaymentMethod] = useState(true);
    const [selectUpi, setSelectUpi] = useState(false);
    const [addCard, setAddCard] = useState(false);
    const [saveCard, setSaveCard] = useState(false);
    const [paidSuccess, setPaidSuccess] = useState(false);  //forth modal
    const [bookingDetails, setBookingDetails] = useState([]);
    const [bookingStatus, setBookingStatus] = useState('');
    // const [userDetails, setUserDetails] = useState('');

    const {setBookingData, userDetails, setUserDetails, userPhone, setUserPhone} = useContext(MpodzContext);

    const [orderId, setOrderId] = useState(null);
    const [paymentSessionId, setPaymentSessionId] = useState(null);
    const [loading, setLoading] = useState(false);

    const amount = 2500;
    const navigation = useNavigation();


    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp(); // close app
            return true;
        };

        const fetchUserDetails = async () => {
            const token = await AsyncStorage.getItem('authToken');
            const phone = await AsyncStorage.getItem('userPhone');
            if (token) {
                const decoded = jwtDecode(token);
                // console.log("Decoded token: ",decoded);
                setUserDetails(decoded);
                setUserPhone(phone)
                // console.log("Token: ", token);
                // console.log('Phone: ',phone);
            }
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        fetchUserDetails();

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        fetchAllPodz();
    }, []);

    // useEffect(() => {
    //     if (selectPayment) {
    //         createOrder();
    //     } else {
    //         setOrderId(null);
    //         setPaymentSessionId(null);
    //     }
    // }, [selectPayment]);

    //   
    // useEffect(() => {
    //     CFPaymentGatewayService.setCallback({
    //         onVerify: async (oid) => {
    //             try {
    //                 const token = await AsyncStorage.getItem('authToken');
    //                 const response = await fetch(
    //                     `https://metropodz-mvp.onrender.com/api/v1/payments/status/${oid}`,
    //                     {
    //                         method: 'GET',
    //                         headers: { 
    //                             'Content-Type': 'application/json',
    //                             Authorization : `Bearer ${token}`
    //                         },
    //                     }
    //                 );
    //                 const data = await response.json();
    //                 setBookingStatus(data);

    //                 if (data?.data?.orderStatus === 'active') {
    //                     Alert.alert('Payment Success', 'Your booking is confirmed');
    //                     onClose();
    //                     setPaidSuccess(true);
    //                 } else {
    //                     Alert.alert('Payment Failed', `Status: ${data?.data?.orderStatus}`);
    //                     console.log('Payment verification failed:', data);
    //                 }
    //             } catch (error) {
    //                 Alert.alert('Error', 'Could not verify payment');
    //                 console.error('Verify payment error:', error);
    //             }
    //         },
    //         onError: (error, oid) => {
    //             console.log("Pay Error:", error.message);
    //             Alert.alert('Payment Error', error.message || 'Something went wrong');
    //         },
    //     });

    //     return () => {
    //         CFPaymentGatewayService.removeCallback();
    //     };
    // }, []);


    const onClose = () => {
        setSelectPayment(false);
    }

    // For Payment Gateway....
    const createOrder = async () => {
        const token = await AsyncStorage.getItem('authToken');

        setLoading(true);
        try {
        const response = await fetch('https://metropodz-mvp.onrender.com/api/v1/payments/booking', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                 Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(
            {
                bookingId: bookingDetails?.data?.booking_id,
                amount: "1",
                customerDetails: {
                    name: "rakesh",
                    email: "rakesh@fracspace.com",
                    phone: "6281530068"
                },
                returnUrl: "https://app.metropodz.com/response/success",
                notifyUrl: "https://api.metropodz.com/api/response/success",
                note: "payment done for booking"
            }
            ),
        });
        const data = await response.json();
        console.log("Res create: ",data);
        if (data.success) {
            setOrderId(data?.data?.order_id);
            setPaymentSessionId(data?.data?.payment_session_id);
            console.log("CreateOrder: ",data?.data?.order_id  ,data?.data?.payment_session_id);
        } else {
            Alert.alert('Error', 'Cannot initiate payment');
        }
        } catch (error) {
            Alert.alert('Error', 'Server error');
        } finally {
            setLoading(false);
        }
    };

    
    const startUpiIntent = async () => {
        // console.log('Yes i am in...');
        if ( !orderId || !paymentSessionId ) {
            Alert.alert('Error', 'Order not created yet');
            return;
        }
        try {
            console.log("orderId:", orderId); 
            console.log("paymentSessionId:", paymentSessionId);
            console.log("Creating CFSession now...");

            const session = new CFSession( paymentSessionId, orderId, CFEnvironment.PRODUCTION);
            console.log("checking Session: ",session);

            const theme = new CFThemeBuilder()
                .setPrimaryTextColor('#000000')
                .setButtonBackgroundColor('#1E88E5')
                .setButtonTextColor('#ffffff')
                .build();

            const upiPayment = new CFUPIIntentCheckoutPayment(session, theme);
            console.log("UPI Payment: ",upiPayment);

            CFPaymentGatewayService.doUPIPayment(upiPayment);
            // console.log("I am at end...");
        } catch (error) {
            Alert.alert('Error', error.message || 'Could not start UPI Intent');
            console.error("Error in start upi intent: ",error.response?.data || error.message);
        }
    };
 

    const scrollY = useRef(new Animated.Value(0)).current;
    
    // base height + interpolation with scroll
    const animatedHeight = scrollY.interpolate({
        inputRange: [0, 150],          // scroll distance
        outputRange: [height * 0.6, height * 0.8], // min → max height
        extrapolate: "clamp",          // don’t go beyond
    });

    const fetchAllPodz = async() => {
        try{
            let {data: res} = await GetPodz();
            const data = res.data;
            // console.log("All podz: ",data[0]);
            setPodzDescription(data[0]);
        }catch(error){
            console.error('Error in Fetching All Podz: ',error.response?.data || error.message);
        }
    };

    const handleBookPodz = async() => {
        let payload = JSON.stringify(
            {
                pod_id: podzDescription?.id,
                check_in: moment(checkInDate).format("DD-MM-YY"),
                check_out: moment(checkOutDate).format("DD-MM-YY")
            }
        );
        console.log('BookPodz Payload: ',payload);
        try{
            const {data : res} = await BookPodz(payload);
            // const data = res.data;
            console.log("BookPodz Response: ",res.data?.booking_id);
            setBookingDetails(res);
        }catch(error){
            console.error('Error in booking podz: ',error.response?.data || error.message);
        }
    };

    const handleOnClick = async() => {
        if(bookingFor === 'Others'){
            if(!name || !email || !number){
                Alert.alert('Alert', 'Please fill all the given fields to continue.');
            }else {
                await handleBookPodz();
                setConfirmBooking(false);
                setSelectPayment(true);
            }
        }else{
            await handleBookPodz();
            setConfirmBooking(false);
            setSelectPayment(true);
        }
    }

    const handleDayPress = (day) => {
        const date = day.dateString;

        if(!checkInDate || (checkInDate && checkOutDate)) {
            setCheckInDate(date);
            setCheckOutDate(null);
            setSelectedDates({
                [date] : { startingDay: true, color:'#f5a623', textColor: '#fff' }
            });
        } else if(!checkOutDate && moment(date).isAfter(checkInDate)) {
            setCheckOutDate(date);
            highlightRange(checkInDate, date);

            setTimeout(() => {
                setShowCalendar(false);
            }, 200);
        }
    };

    const highlightRange = (start, end) => {
        let range = {};
        let currentDate = moment(start);

        while(currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
            const dateStr = currentDate.format("YYYY-MM-DD");
            range[dateStr] = {
                color: dateStr === start ? '#f5a623' : dateStr === end ? '#f5a623' : '#ffe4b2',
                textColor:'#fff',
                startingDay: dateStr === start,
                endingDay: dateStr === end,
            };
            currentDate.add(1, "day");
        }
        setSelectedDates(range);
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const diffTime = checkOut.getTime() - checkIn.getTime();
    const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // console.log('No of Days: ',numberOfDays);

    const bookNow = () => {
        if(checkInDate == null || checkOutDate == null){
            Alert.alert('Alert', 'Please choose Check-in and Check-out Date.');
        }else {
            setAddOn(true);
        }
    }

    const handleNext = () => {
        console.log("🔥 bookingFor (latest):", bookingFor);
        console.log("🔥 inputs:", { name, email, number });

        const bookData = bookingFor === "MySelf"? 
            {
                name: userData?.name,
                email: userData?.email,
                number: userData?.number,
                checkIn: checkInDate,
                checkOut: checkOutDate
            }
            :
            {
                name: name.trim(),
                email: email.trim(),
                number: number.trim(),
                checkIn: checkInDate,
                checkOut: checkOutDate
            };
        setBookingData(bookData);
        console.log("🔥 Final bookData:", bookData);
        setPaidSuccess(false);

        navigation.navigate("VerifyDetails", { userData: bookData });
    };

    const userData = {
        name: 'Fracspace',
        email: 'fracspace@gmail.com',
        number: '1234567890',
        address: 'Banjara Hills, Hyderabad'
    }

    const addOnData = [
        {
            img: require('./assets/Breakfast.png'),
            content: 'Breakfast',
            price: '500'
        },
        {
            img: require('./assets/Breakfast.png'),
            content: 'Travel Kit',
            price: '700'
        }
    ]

  return (
    <SafeAreaView style={{flex:1}}>
        <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
            <ImageBackground resizeMode='cover' source={require('./assets/Figmap.png')} 
                style={{justifyContent:'space-between',flex:1}}
            >
                <View style={{padding:20,marginTop:20}}>
                    <View style={{backgroundColor:'#FFF',borderRadius:10,flexDirection:'row',alignItems:'center',paddingHorizontal:15}}>
                        <Icon name={'search'} size={22} color={'#eb2c19'}/>
                        <TextInput
                            placeholder='Search Nearby Podz'
                            placeholderTextColor={'#2f2f2f'}
                            style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#2f2f2f',flex:1,marginLeft:15}}
                        />
                    </View>
                </View>

                <Animated.View style={{backgroundColor:'#f5f5f5',width:'100%',height:animatedHeight}}>
                    <Animated.ScrollView onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {y: scrollY}}}],
                        {useNativeDriver: false}
                    )} scrollEventThrottle={16} showsVerticalScrollIndicator={false} style={{marginBottom:90}}>
                        <View style={{flexDirection:'row',alignItems:'center',padding:20,justifyContent:'space-between'}}>
                            <TouchableOpacity onPress={() => {
                                setShowCalendar(!showCalendar);
                            }} style={{backgroundColor:'#fafafa',borderRadius:10,elevation:5,flexDirection:'row',alignItems:'center',padding:12}}>
                                <View>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Check-in</Text>
                                    <Text style={{fontFamily:'Poppins-Regular',fontSize:12,color:'#000'}}>{checkInDate ? moment(checkInDate).format("DD MMM YY") : "Select Date"}</Text>
                                </View>
                                <View style={{marginLeft:20}}>
                                    <Ico name={'calendar-outline'} size={22} color={'#000'}/>
                                </View>
                            </TouchableOpacity>

                            <View style={{width:25,height:25,borderRadius:16,backgroundColor:'#1919192c',alignItems:'center',justifyContent:'center'}}>
                                <Icon name={'arrow-right'} size={20} color={'#000'}/>
                            </View>

                            <TouchableOpacity onPress={() => {
                                setShowCalendar(!showCalendar);
                            }} style={{backgroundColor:'#fafafa',borderRadius:10,elevation:5,flexDirection:'row',alignItems:'center',padding:12}}>
                                <View>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Check-out</Text>
                                    <Text style={{fontFamily:'Poppins-Regular',fontSize:12,color:'#000'}}>{checkOutDate ? moment(checkOutDate).format("DD MMM YY") : "Select Date"}</Text>
                                </View>
                                <View style={{marginLeft:20}}>
                                    <Ico name={'calendar-outline'} size={22} color={'#000'}/>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity onPress={() => {
                            // navigation.navigate('VerifyDetails');
                        }} style={{marginHorizontal:20,marginVertical:10,backgroundColor:'#eb2c19',borderRadius:10,alignItems:'center',padding:10}}>
                            <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#FFF'}}>₹ {checkOutDate ? numberOfDays * amount : amount}</Text>
                        </TouchableOpacity>

                        <View style={{marginHorizontal:20,marginTop:10}}>
                            <Image resizeMode='stretch' source={require('./assets/Gif.png')} style={{width:'100%',height:200,borderRadius:15}}/>
                            <Image resizeMode='stretch' source={require('./assets/Pod.png')} style={{width:'100%',height:200,borderRadius:15,marginTop:30}}/>
                        </View>

                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Overview</Text>
                            <View style={{flexDirection:'row',alignItems:'center',gap:7}}>
                                <Ico name={'location-sharp'} size={16} color={'#000'}/>
                                <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>{podzDescription.address}</Text>
                            </View>
                        </View>

                        <View style={{borderTopWidth:1,borderTopColor:'#000',borderStyle:'dashed',marginHorizontal:20}}/>

                        <View style={{padding:20}}>
                            <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000'}}>
                                Nestled atop a sleek building terrace near Banjara Hills, Hyderabad, SkyLink Pod offers an 
                                exclusive, elevated retreat. It combines urban convenience with rooftop serenity, 
                                your perfect escape for relaxation or work, just minutes from the city.
                                {/* {podzDescription.description} */}
                            </Text>
                        </View>

                        <View style={{paddingHorizontal:20}}>
                            <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Amenities</Text>

                            <View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingVertical:20}}>
                                    {[0,1,2].map((item,index) => (
                                        <View key={index} style={{borderColor:'#e0e0e0',borderWidth:1,borderRadius:10,paddingHorizontal:15,paddingVertical:10,backgroundColor:'#fff',marginRight:20}}>
                                            <Ico name={'wifi'} size={25} color={'#000'}/>
                                            {/* <Image source={{uri:item.amenity_icon}} style={{width:30,height:30}}/> */}
                                            <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginTop:5}}>WiFi</Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => {
                            // setAddOn(true);
                            bookNow();
                        }} style={{marginHorizontal:20,backgroundColor:'#eb2c19',borderRadius:10,alignItems:'center',padding:10,}}>
                            <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#FFF'}}>Book Now</Text>
                        </TouchableOpacity>
                    </Animated.ScrollView>
                </Animated.View>

                {addOn &&
                    <Modal modalStyle={{width}} visible={true} transparent animationType='slide'>
                        <View style={{backgroundColor:'#000000B3',flex:1}}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                activeOpacity={1}
                                onPress={() => setAddOn(false)}
                            />
                            <View style={{position:'absolute',bottom:0,width:'100%'}}>
                                <View style={{backgroundColor:'#FFF',borderTopLeftRadius:20,borderTopRightRadius:20,padding:20}}>
                                    <View style={{position:'absolute',top:5,alignSelf:'center'}}>
                                        <View style={{backgroundColor:'#000',width:130,height:5,borderRadius:5}}></View>
                                    </View>

                                    <TouchableOpacity onPress={() => {
                                        setAddOn(false);
                                    }} style={{width:25,height:25,borderRadius:16,backgroundColor:'#000',alignItems:'center',justifyContent:'center'}}>
                                        <Icon name={'chevron-left'} size={20} color={'#FFF'}/>
                                    </TouchableOpacity>

                                    <View style={{marginVertical:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                        <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000'}}>Add On</Text>
                                        <TouchableOpacity onPress={() => {
                                            setAddOn(false);
                                            setConfirmBooking(true);
                                            setAddOnPrice('');
                                            setAddOnContent('');
                                        }}>
                                            <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000'}}>Skip</Text>
                                        </TouchableOpacity>
                                    </View>

                                    {addOnData.map((item, index) => (
                                        <TouchableOpacity onPress={() => {
                                            setChooseAddOn(prev => prev === item.content ? '' : item.content)
                                            setAddOnPrice(item.price);
                                            setAddOnContent(item.content);
                                        }} key={index} style={{flexDirection:'row',alignItems:'center',marginBottom:20}}>
                                            <View style={{borderColor:'#000000a4',borderWidth:0.6,borderRadius:10,padding:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between',flex:1}}>
                                                <View style={{flexDirection:'row',alignItems:'center'}}>
                                                    <Image resizeMode='stretch' source={item.img} style={{width:90,height:65,borderRadius:5}}/>
                                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginLeft:10}}>{item.content}</Text>
                                                </View>
                                                <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000'}}>₹{item.price}</Text>
                                            </View>
                                            <View style={{marginHorizontal:20}}>
                                                <View>
                                                    {chooseAddOn === item.content ?
                                                        <Ico name={'radio-button-on'} size={25} color={'#53aff1'}/>
                                                        :
                                                        <Ico name={'radio-button-off'} size={25} color={'#000'}/>
                                                    }
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}

                                    <TouchableOpacity onPress={() => {
                                        setAddOn(false);
                                        setConfirmBooking(true);
                                    }} style={{backgroundColor:'#eb2c19',borderRadius:10,alignItems:'center',padding:10,marginTop:20}}>
                                        <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#FFF'}}>Continue</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                }

                {confirmBooking &&
                    <Modal modalStyle={{width}} visible={true} transparent animationType='slide'>
                        <View style={{backgroundColor:'#000000b3',flex:1,}}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                activeOpacity={1}
                                onPress={() => setConfirmBooking(false)}
                            />
                            <View style={{position:'absolute',bottom:0,width:'100%',height:height*0.6}}>
                                <ScrollView>
                                    <View style={{backgroundColor:'#FFF',borderTopLeftRadius:20,borderTopRightRadius:20,padding:20}}>
                                        {/* <View style={{position:'absolute',top:5,alignSelf:'center'}}>
                                            <View style={{width:130,height:5,borderRadius:5,backgroundColor:'#000'}}></View>
                                        </View> */}

                                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                            <TouchableOpacity onPress={() => {
                                                setConfirmBooking(false);
                                                setAddOn(true);
                                            }} style={{width:25,height:25,borderRadius:15,backgroundColor:'#000',alignItems:'center',justifyContent:'center'}}>
                                                <Icon name={'chevron-left'} size={20} color={'#FFF'}/>
                                            </TouchableOpacity>
                                            <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000'}}>Confirm Booking</Text>
                                            <View style={{width:25}}></View>
                                        </View>

                                        <View style={{paddingHorizontal:20,paddingVertical:10,borderWidth:0.5,borderRadius:10,marginVertical:30}}>
                                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Name</Text>
                                                <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000'}}>{userData.name}</Text>
                                            </View>
                                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Address</Text>
                                                <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000'}}>{userData.address}</Text>
                                            </View>
                                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Date Of Booking</Text>
                                                <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000'}}>28/09/2025</Text>
                                            </View>
                                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Stays Dates</Text>
                                                <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000'}}>29 - 31 Sep 2025</Text>
                                            </View>
                                            {addOnContent !== '' &&
                                                <>
                                                    <View style={{borderColor:'#000',borderTopWidth:1,borderStyle:'dashed',marginVertical:15}}></View>
                                                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                        <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Add On</Text>
                                                        <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000'}}>{addOnContent}</Text>
                                                    </View>
                                                </>
                                            }
                                        </View>

                                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',}}>
                                            <TouchableOpacity onPress={() => {
                                                setBookingFor('MySelf');
                                            }} style={{borderBottomWidth:bookingFor == 'MySelf' ? 2 : 0,borderBottomColor:'#000'}}>
                                                <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000'}}>MySelf</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => {
                                                setBookingFor('Others');
                                            }} style={{borderBottomWidth:bookingFor == 'Others' ? 2 : 0,borderBottomColor:'#000'}}>
                                                <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000'}}>Others</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={{gap:20,}}>
                                            <View style={{marginTop:20}}>
                                                <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Enter Name</Text>
                                                {bookingFor === 'MySelf' ?
                                                    <View style={{borderWidth:0.5,borderRadius:10,padding:15,marginTop:10}}>
                                                        <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000000'}}>{userData.name}</Text>
                                                    </View>
                                                    :
                                                    <View style={{borderWidth:0.5,borderRadius:10,marginTop:10,}}>
                                                        <TextInput
                                                            placeholder='Enter Name'
                                                            placeholderTextColor={'#00000091'}
                                                            value={name}
                                                            onChangeText={text => setName(text)}
                                                            style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',paddingHorizontal:15}}
                                                        />
                                                    </View>
                                                }
                                            </View>

                                            <View>
                                                <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Enter Email</Text>
                                                {bookingFor === 'MySelf' ?
                                                    <View style={{borderWidth:0.5,borderRadius:10,padding:15,marginTop:10}}>
                                                        <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000000'}}>{userData.email}</Text>
                                                    </View>
                                                    :
                                                    <View style={{borderWidth:0.5,borderRadius:10,marginTop:10,}}>
                                                        <TextInput
                                                            placeholder='Enter Email'
                                                            placeholderTextColor={'#00000091'}
                                                            value={email}
                                                            onChangeText={text => setEmail(text)}
                                                            style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',paddingHorizontal:15}}
                                                        />
                                                    </View>
                                                }
                                            </View>

                                            <View>
                                                <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Enter Phone Number</Text>
                                                {bookingFor === 'MySelf' ?
                                                    <View style={{borderWidth:0.5,borderRadius:10,padding:15,marginTop:10}}>
                                                        <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000000'}}>{userData.number}</Text>
                                                    </View>
                                                    :
                                                    <View style={{borderWidth:0.5,borderRadius:10,marginTop:10,}}>
                                                        <TextInput
                                                            placeholder='Enter Phone'
                                                            placeholderTextColor={'#00000091'}
                                                            value={number}
                                                            onChangeText={text => setNumber(text)}
                                                            style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',paddingHorizontal:15}}
                                                        />
                                                    </View>
                                                }
                                            </View>

                                            <TouchableOpacity onPress={() => {
                                                if(bookingFor === 'Others'){
                                                    if(!name || !email || !number){
                                                        Alert.alert('Alert', 'Please fill all the given fields to continue.');
                                                    }else {
                                                        setConfirmBooking(false);
                                                        setSelectPayment(true);
                                                    }
                                                }else{
                                                    setConfirmBooking(false);
                                                    setSelectPayment(true);
                                                }

                                                // handleOnClick();
                                            }} style={{backgroundColor:'#eb2c19',borderRadius:10,padding:10,alignItems:'center',marginTop:10}}>
                                                <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#FFF'}}>Confirm & Pay</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                }

                {selectPayment &&
                    <Modal modalStyle={{width}} visible={true} transparent animationType='fade'>
                        <View style={{backgroundColor:'#000000b3',flex:1}}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                activeOpacity={1}
                                onPress={() => setSelectPayment(false)}
                            />
                            <View style={{position:'absolute',bottom:0,width:'100%',height:height*0.6}}>
                                <ScrollView>
                                    <View style={{backgroundColor:'#FFF',borderTopLeftRadius:20,borderTopRightRadius:20,padding:20}}>
                                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                            <TouchableOpacity onPress={() => {
                                                if(selectPaymentMethod==false){
                                                    setSelectPaymentMethod(true);
                                                } else{
                                                    setSelectPayment(false);
                                                    setConfirmBooking(true);
                                                }
                                            }} style={{width:25,height:25,borderRadius:15,alignItems:'center',justifyContent:'center',backgroundColor:'#000'}}>
                                                <Icon name={'chevron-left'} size={20} color={'#FFF'}/>
                                            </TouchableOpacity>
                                            <Text style={{fontFamily:'Poppins-SemiBold',fontSize:18,color:'#000'}}>Payment</Text>
                                            <View style={{width:25}}/>
                                        </View>

                                        <View style={{marginVertical:20}}>
                                            <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Payment methods</Text>

                                            {selectPaymentMethod ?
                                                 <View style={{borderWidth:1,borderColor:'#000',borderRadius:10,padding:15,marginVertical:20}}>
                                                    <TouchableOpacity onPress={() => {
                                                        setSelectUpi(prev => !prev);
                                                    }} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                                            <Image source={require('./assets/Upi.png')} style={{width:35,height:35}}/>
                                                            <View style={{marginLeft:20}}>
                                                                <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>UPI</Text>
                                                                <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#0000007d'}}>Pay with UPI apps</Text>
                                                            </View>
                                                        </View>
                                                        <View>
                                                            {selectUpi ?
                                                                <Icon name={'chevron-up'} size={22} color={'#000'}/>
                                                                :
                                                                <Icon name={'chevron-down'} size={22} color={'#000'}/>
                                                            }
                                                        </View>
                                                    </TouchableOpacity>

                                                    {selectUpi &&
                                                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15}}>
                                                            <View style={{alignItems:'center'}}>
                                                                <View style={{borderWidth:0.5,borderRadius:5,padding:5}}>
                                                                    <Image source={require('./assets/PhonePe.png')} style={{width:30,height:30}}/>
                                                                </View>
                                                                <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#0000007f',marginTop:10}}>Phone Pe</Text>
                                                            </View>

                                                            <View style={{alignItems:'center'}}>
                                                                <View style={{borderWidth:0.5,borderRadius:5,padding:5}}>
                                                                    <Image source={require('./assets/PhonePe.png')} style={{width:30,height:30}}/>
                                                                </View>
                                                                <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#0000007f',marginTop:10}}>Phone Pe</Text>
                                                            </View>

                                                            <View style={{alignItems:'center'}}>
                                                                <View style={{borderWidth:0.5,borderRadius:5,padding:5}}>
                                                                    <Image source={require('./assets/PhonePe.png')} style={{width:30,height:30}}/>
                                                                </View>
                                                                <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#0000007f',marginTop:10}}>Phone Pe</Text>
                                                            </View>

                                                            <View style={{alignItems:'center'}}>
                                                                <View style={{borderWidth:0.5,borderRadius:5,padding:5}}>
                                                                    <Image source={require('./assets/Upi.png')} style={{width:30,height:30}}/>
                                                                </View>
                                                                <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#0000007f',marginTop:10}}>Others</Text>
                                                            </View>
                                                        </View>
                                                    }

                                                    {selectUpi &&
                                                        <View style={{borderTopColor:'#000000c2',borderWidth:0.5,marginTop:10}}/>
                                                    }

                                                    <TouchableOpacity onPress={() => {
                                                        setSelectPaymentMethod(false);
                                                    }} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:18}}>
                                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                                            <Image source={require('./assets/Card.png')} style={{width:35,height:35}}/>
                                                            <View style={{marginLeft:20}}>
                                                                <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Pay using Card</Text>
                                                                <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#00000089'}}>All cards supported</Text>
                                                            </View>
                                                        </View>
                                                        <View>
                                                            <Icon name={'chevron-right'} size={22} color={'#000'}/>
                                                        </View>
                                                    </TouchableOpacity>

                                                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20}}>
                                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                                            <Icc name={'bank'} size={32} color={'#094168ff'} style={{marginLeft:5}}/>
                                                            <View style={{marginLeft:20}}>
                                                                <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Net Banking</Text>
                                                                <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#00000089'}}>All banks are supported</Text>
                                                            </View>
                                                        </View>
                                                        <View>
                                                            <Icon name={'chevron-right'} size={22} color={'#000'}/>
                                                        </View>
                                                    </View>
                                                </View> 
                                                :
                                                <View style={{marginBottom:30,marginTop:15}}>
                                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                        <View style={{alignItems:'center',marginRight:20}}>
                                                            <Image resizeMode='stretch' source={require('./assets/Card1.png')} style={{width:width*0.8,height:150}}/>
                                                        </View>
                                                        <TouchableOpacity onPress={() => {
                                                            setAddCard(true);
                                                            setSelectPayment(false);
                                                        }} style={{borderColor:'#000',borderWidth:1,marginRight:20,borderStyle:'dashed',padding:20,borderRadius:10,width:width*0.8,alignItems:'center',justifyContent:'center'}}>
                                                            <View style={{alignItems:'center'}}>
                                                                <Icc name={'plus'} size={25} color={'#000'}/>
                                                                <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000',marginTop:10}}>Add New Card</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                        <View style={{alignItems:'center',marginRight:20}}>
                                                            <Image resizeMode='stretch' source={require('./assets/Card1.png')} style={{width:width*0.8,height:150}}/>
                                                        </View>
                                                    </ScrollView>

                                                    <View style={{alignItems:'center',flexDirection:'row',gap:5,justifyContent:'center',marginTop:10}}>
                                                        {[0,1,2].map((item, index) => (
                                                            <View key={index} style={{width:5,height:5,borderRadius:3,backgroundColor:'#000'}}></View>
                                                        ))}
                                                    </View>
                                                </View>
                                            }

                                            <View style={{borderWidth:0.5,borderColor:'#000',borderRadius:10,padding:15}}>
                                                <Text style={{fontFamily:'Poppins-Medium',fontSize:18,color:'#000'}}>Payment Summary</Text>

                                                <View style={{borderColor:'#BCBABA',borderWidth:0.75,marginVertical:15}}/>

                                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                                                    <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#00000086'}}>Total</Text>
                                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#00000086'}}>₹3,000</Text>
                                                </View>
                                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',}}>
                                                    <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#00000086'}}>GST(6%)</Text>
                                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#00000086'}}>₹140</Text>
                                                </View>
                                                {addOnContent !== '' &&
                                                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:8}}>
                                                        <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#00000086'}}>{addOnContent} Add On</Text>
                                                        <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#1c671686'}}>+{addOnPrice}</Text>
                                                    </View>
                                                }

                                                <View style={{borderColor:'#bcbaba',borderWidth:0.75,marginVertical:15}}/>

                                                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Amount to be Paid</Text>
                                                    <Text style={{fontFamily:'Poppins-SemiBold',fontSize:14,color:'#000'}}>₹3140</Text>
                                                </View>
                                            </View>

                                            <TouchableOpacity onPress={() => {
                                                setSelectPayment(false);
                                                setPaidSuccess(true);
                                            }} style={{backgroundColor:'#eb2c19',padding:10,alignItems:'center',borderRadius:10,marginTop:25}}>
                                                <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#FFF'}}>Continue to Payment</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ScrollView>

                                {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#FFF' }}>
                                    <Text>Confirm Booking & Payment</Text>
                                    <View>
                                        <Text style={{fontFamily:'Poppins-Medium',fontSize:13,color:'#000'}}>Room: {podzDescription.pod_number}</Text>
                                        <Text style={{fontFamily:'Poppins-Medium',fontSize:13,color:'#000'}}>Check-In: {moment(checkInDate).format("DD MMM YY")}</Text>
                                        <Text style={{fontFamily:'Poppins-Medium',fontSize:13,color:'#000'}}>Check-Out: {moment(checkOutDate).format("DD MMM YY")}</Text>
                                        <Text style={{fontFamily:'Poppins-Medium',fontSize:13,color:'#000'}}>Amount: ₹1</Text>
                                    </View>
                                    {loading ? 
                                        <ActivityIndicator size="large" color="#0000ff" /> 
                                        :
                                        <Button
                                            title={loading ? "Creating order..." : "Pay with UPI"}
                                            onPress={startUpiIntent}
                                            disabled={!orderId || !paymentSessionId || loading}
                                        />
                                    }
                                    <Button title="Cancel" onPress={onClose} color="red" />
                                </View> */}
                            </View>
                        </View>
                    </Modal>
                }

                {addCard &&
                    <Modal modalStyle={{width}} visible={true} animationType='fade' transparent>
                        <View style={{backgroundColor:'#000000b3',flex:1}}>
                            <TouchableOpacity onPress={() => {
                                setAddCard(false);
                            }} style={{flex:1}}/>
                            <View style={{position:'absolute',bottom:0,width:'100%'}}>
                                <View style={{backgroundColor:'#FFF',borderTopLeftRadius:30,borderTopRightRadius:30,padding:20}}>
                                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                        <TouchableOpacity onPress={() => {
                                            setAddCard(false);
                                            setSelectPayment(true);
                                        }} style={{width:25,height:25,alignItems:'center',backgroundColor:'#000',justifyContent:'center',borderRadius:15}}>
                                            <Icon name={'chevron-left'} size={20} color={'#fff'}/>
                                        </TouchableOpacity>
                                        <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000'}}>Add Card</Text>
                                        <View style={{width:25}}></View>
                                    </View>

                                    <View style={{marginTop:30}}>
                                        <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000000b9'}}>Name</Text>
                                        <View style={{borderColor:'#0000009d',borderRadius:10,borderWidth:0.5,marginTop:10}}>
                                            <TextInput 
                                                placeholder='Enter Card Holder Name'
                                                placeholderTextColor={'#000000b9'}
                                                style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginHorizontal:15}}
                                            />
                                        </View>
                                    </View>

                                    <View style={{marginTop:20}}>
                                        <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Card Number</Text>
                                        <View style={{borderColor:'#0000009d',borderRadius:10,borderWidth:0.5,marginTop:10,flexDirection:'row',alignItems:'center',flex:1}}>
                                            <TextInput
                                                placeholder='Enter Card Number'
                                                placeholderTextColor={'#000000b9'}
                                                style={{fontFamily:'Poppins-Meidum',fontSize:14,color:'#000',marginHorizontal:15,flex:1}}
                                            />
                                            <View>
                                                <Image source={require('./assets/MasterCard.png')} style={{width:50,height:50,borderRadius:5}}/>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{flexDirection:'row',alignItems:'center',marginTop:20,gap:20}}>
                                        <View style={{flex:1,}}>
                                            <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>CVV</Text>
                                            <View style={{borderColor:'#0000009d',borderRadius:10,borderWidth:0.5,marginTop:10,flexDirection:'row',alignItems:'center'}}>
                                                <TextInput
                                                    placeholder='Enter CVV'
                                                    placeholderTextColor={'#000000b9'}
                                                    style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginHorizontal:10,flex:1}}
                                                />
                                            </View>
                                        </View>

                                        <View style={{flex:1,}}>
                                            <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Expires On</Text>
                                            <View style={{borderColor:'#0000009d',borderRadius:10,borderWidth:0.5,marginTop:10,flexDirection:'row',alignItems:'center'}}>
                                                <TextInput
                                                    placeholder='Enter Date'
                                                    placeholderTextColor={'#000000b9'}
                                                    style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000',marginHorizontal:10,flex:1}}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <TouchableOpacity onPress={() => {
                                        setSaveCard(prev => !prev);
                                    }} style={{flexDirection:'row',alignItems:'center',marginTop:25}}>
                                        {saveCard?
                                            <Ico name={'checkbox'} size={20} color={'#2363acff'}/>
                                            :
                                            <Ico name={'checkbox-outline'} size={20} color={'#000'}/>
                                        }
                                        <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000',marginLeft:10}}>Save card details for further</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {
                                        setAddCard(false);
                                        setSelectPayment(true);
                                    }} style={{backgroundColor:'#eb2c19',padding:12,marginTop:20,alignItems:'center',borderRadius:10}}>
                                        <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#FFF'}}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                }

                {paidSuccess &&
                    <Modal modalStyle={{width}} visible={true} animationType='fade' transparent>
                        <View style={{backgroundColor:'#000000b3',flex:1}}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                activeOpacity={1}
                                // onPress={() => setPaidSuccess(false)}
                            />
                            <View style={{position:'absolute',bottom:0,width:'100%'}}>
                                <ScrollView>
                                    <TouchableOpacity onPress={() => {
                                        handleNext();
                                        }} 
                                        style={{backgroundColor:'#FFF',borderTopLeftRadius:20,borderTopRightRadius:20,padding:20,height:height*0.45,justifyContent:'space-between'}}>
                                        <TouchableOpacity onPress={() => {
                                            setPaidSuccess(false);
                                            setSelectPayment(true);
                                        }} style={{width:25,height:25,borderRadius:15,alignItems:'center',justifyContent:'center',backgroundColor:'#000'}}>
                                            <Icon name={'chevron-left'} size={20} color={'#FFF'}/>
                                        </TouchableOpacity>
                                        <View style={{alignItems:'center'}}>
                                            <Ico name={'checkmark-circle'} size={100} color={'#24ae1fff'}/>
                                            {/* <Text style={{fontFamily:'Poppins-SemiBold',fontSize:20,color:'#000'}}>Booking Confirmed</Text> */}
                                            <Text style={{fontFamily:'Poppins-SemiBold',fontSize:20,color:'#000'}}>{bookingStatus?.data?.orderStatus}</Text>
                                        </View>
                                        <View style={{alignItems:'center',marginTop:40}}>
                                            <View style={{alignItems:'center'}}>
                                                <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#000'}}>Click to verify details</Text>
                                                <Icon name={'chevron-up'} size={30} color={'#000'}/>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                }

                {showCalendar &&
                    <Modal visible={true} modalStyle={{width:'100%'}} transparent>
                        <View style={{backgroundColor:'#000000b3',flex:1}}>
                            <View style={{position:'absolute',bottom:0,width:'100%'}}>
                                <View style={{backgroundColor:'#FFF',padding:30,borderTopLeftRadius:30,borderTopRightRadius:30,}}>
                                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                        <View></View>
                                        <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:17,color:'#000'}}>Select Date</Text>
                                        <TouchableOpacity onPress={() => {
                                            setShowCalendar(!showCalendar);
                                        }}>
                                            <Ic name={'cross'} size={20} color={'#000'}/>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Calendar
                                            onDayPress={handleDayPress}
                                            markingType='period'
                                            markedDates= {selectedDates}
                                            minDate = {moment().format("YYYY-MM-DD")}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                }
            </ImageBackground>
        </View>
    </SafeAreaView>
  )
}