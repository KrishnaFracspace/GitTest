import { View, Text, ScrollView, SafeAreaView, ImageBackground, Dimensions, TextInput, Image, TouchableOpacity, Animated, PanResponder, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Feather'
import Ico from 'react-native-vector-icons/Ionicons'
import Ic from 'react-native-vector-icons/FontAwesome5'
import Icc from 'react-native-vector-icons/Entypo'
import CustomModal from './CustomModal'
import moment from "moment";
import { Calendar } from 'react-native-calendars'
import { useNavigation } from '@react-navigation/native'

export default function Home() {

    const { width, height } = Dimensions.get('window');
    const navigation = useNavigation('');
    const [search, setSearch] = useState(false);
    const [selectedDates, setSelectedDates] = useState({});
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [bottomNav, setBottomNav] = useState('Home');

    const translateY = useRef(new Animated.Value(0)).current;

    // Function to open the search panel
    const openSearch = () => {
        setSearch(true);
        Animated.timing(translateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    // Function to close the search panel
    const closeSearch = () => {
        Animated.timing(translateY, {
            toValue: height,
            duration: 500,
            useNativeDriver: true,
        }).start(() => setSearch(false));
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 5,
            onPanResponderMove: (_, gesture) => {
                if (gesture.dy > 0) {
                    translateY.setValue(gesture.dy);
                }
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dy > 100) {
                    closeSearch();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const handleDayPress = (day) => {
        const date = day.dateString;

        if(!checkInDate || (checkInDate && checkOutDate)) {
            setCheckInDate(date);
            setCheckOutDate(null);
            setSelectedDates({
                [date]: { startingDay: true, color: '#f5a623', textColor: '#fff' }
            });
        }
        else if(!checkOutDate && moment(date).isAfter(checkInDate)) {
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
                textColor: '#FFF',
                startingDay: dateStr === start,
                endingDay: dateStr === end,
            };
            currentDate.add(1, "day");
        }
        setSelectedDates(range);
    }

  return (
    <SafeAreaView style={{flex:1}}>
        <View style={{flex:1}}>
            <ImageBackground resizeMode='cover' source={require('./assets/Figmap.png')} style={{flex:1,width:width, height:height,justifyContent:'space-between'}}>
                <TouchableOpacity onPress={() => {
                    openSearch();
                }} style={{backgroundColor:'#FAFAFA',borderRadius:10,flexDirection:'row',paddingHorizontal:15,margin:20,marginTop:30,alignItems:'center'}}>
                    <Icon name={'search'} size={22} color={'#EB2C19'}/>
                    <TextInput
                        placeholder='Search Nearby Podz'
                        placeholderTextColor={'#2f2f2fb3'}
                        style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#2f2f2fb3',marginLeft:10,flex:1}}
                        onFocus={openSearch}
                    />
                </TouchableOpacity>

                <View style={{padding:20,backgroundColor:'#ffffff',height:height*0.6}}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom:50}}>
                        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:2}}>
                            <TouchableOpacity onPress={() => {
                                setShowCalendar(!showCalendar);
                            }} style={{backgroundColor:'#fafafa',flexDirection:'row',alignItems:'center',elevation:5,padding:10,borderRadius:10}}>
                                <View>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#13233D'}}>Check-in</Text>
                                    <Text style={{fontFamily:'Poppins-Regular',fontSize:12,color:'#13233D'}}>{checkInDate ? moment(checkInDate).format("DD MMM YY") : "Select Date"}</Text>
                                </View>
                                <View style={{marginLeft:15}}>
                                    <Ico name={'calendar-outline'} size={25} color={'#000'}/>
                                </View>
                            </TouchableOpacity>

                            <View style={{backgroundColor:'#19191911',borderRadius:20,padding:10}}>
                                <Icon name={'arrow-right'} size={20} color={'#000'}/>
                            </View>

                            <TouchableOpacity onPress={() => {
                                setShowCalendar(!showCalendar);
                            }} style={{backgroundColor:'#fafafa',flexDirection:'row',alignItems:'center',elevation:5,padding:10,borderRadius:10}}>
                                <View>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:14,color:'#13233D'}}>Check-out</Text>
                                    <Text style={{fontFamily:'Poppins-Regualr',fontSize:12,color:'#13233D'}}>{checkOutDate ? moment(checkOutDate).format("DD MMM YY") : "Select Date"}</Text>
                                </View>
                                <View style={{marginLeft:15}}>
                                    <Ico name={'calendar-outline'} size={25} color={'#000'}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={{marginTop:30}}>
                            <Text style={{fontFamily:'Poppins-SemiBold',fontSize:18,color:'#000'}}>Introducing SkyLink Pod</Text>

                            <View style={{marginTop:15}}>
                                <Image source={require('./assets/Gif.png')} style={{width:width*0.9,height:200,borderRadius:10}}/>
                                <Image resizeMode='cover' source={require('./assets/Pod.png')} style={{width: width*0.9,height:200,borderRadius:10,marginTop:20}}/>
                            </View>
                        </View>

                        <View style={{marginTop:20}}>
                            <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000'}}>Overview</Text>

                            <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000'}}>
                                Nestled atop a sleek building terrace near Banjara Hills, Hyderabad, SkyLink Pod offers 
                                an exclusive, elevated retreat. It combines urban convenience with rooftop serenity, 
                                your perfect escape for relaxation or work, just minutes from the city.
                            </Text>
                        </View>

                        <View style={{marginTop:20}}>
                            <Text style={{fontFamily:'Poppins-SemiBold',fontSize:16,color:'#000'}}>Amenities</Text>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:15}}>
                                {[1,2,3].map((item, index) => (
                                    <View key={index} style={{borderColor:'#E0E0E0',borderRadius:12,borderWidth:1,backgroundColor:'#FFF',paddingHorizontal:20,paddingVertical:14,alignItems:'center',marginRight:15}}>
                                        <Ic name={'dumbbell'} size={20} color={'#000'}/>
                                        <Text style={{fontFamily:'Poppins-Medium',fontSize:12,color:'#000',marginTop:10}}>GYM</Text>
                                    </View>
                                ))}
                                <View style={{borderColor:'#e0e0e0',borderRadius:12,borderWidth:1,backgroundColor:'#fff',paddingHorizontal:20,paddingVertical:14,alignItems:'center',marginRight:15}}>
                                    <Ic name={'tv'} size={20} color={'#000'}/>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:12,color:'#000',marginTop:10}}>TV</Text>
                                </View>

                                <View style={{borderColor:'#e0e0e0',borderRadius:12,borderWidth:1,backgroundColor:'#fff',paddingHorizontal:20,paddingVertical:14,alignItems:'center',marginRight:15}}>
                                    <Ic name={'wifi'} size={20} color={'#000'}/>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:12,color:'#000',marginTop:10}}>WiFi</Text>
                                </View>
                            </ScrollView>
                        </View>

                        <View style={{marginVertical:30}}>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <View style={{backgroundColor:'#EB2C19',borderRadius:8,alignItems:'center',flex:1,padding:10}}>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#FFF'}}>Direction</Text>
                                </View>
                                <View style={{backgroundColor:'#eb2c19',borderRadius:8,alignItems:'center',flex:1,padding:10,marginLeft:15}}>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#FFF'}}>Save For Later</Text>
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => {
                                navigation.navigate('ConfirmBooking');
                            }} style={{backgroundColor:'#eb2c19',borderRadius:8,alignItems:'center',padding:10,marginTop:20}}>
                                <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#fff',}}>Book Now</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>

                    <View style={{position:'absolute',bottom:0,left:0,right:0,}}>
                        <View style={{paddingHorizontal:20,paddingTop:15,paddingBottom:5,borderWidth:0.5,borderColor:'#00000042',backgroundColor:'#FFF',borderTopLeftRadius:30,borderTopRightRadius:30}}>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <TouchableOpacity onPress={() => {
                                    setBottomNav('Home');
                                }} style={{alignItems:'center'}}>
                                    <Ic name={'home'} size={22} color={bottomNav==='Home'?'#eb2c19':'#000'}/>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:12,color:bottomNav==='Home'?'#eb2c19':'#000',marginTop:5}}>Home</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setBottomNav('Bookings');
                                }} style={{alignItems:'center'}}>
                                    <Ico name={'calendar-outline'} size={22} color={bottomNav==='Bookings'?'#eb2c19':'#000'}/>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:12,color:bottomNav==='Bookings'?'#eb2c19':'#000',marginTop:5}}>Bookings</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setBottomNav('Activity');
                                }} style={{alignItems:'center'}}>
                                    <Ic name={'tasks'} size={22} color={bottomNav==='Activity'?'#eb2c19':'#000'}/>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:12,color:bottomNav==='Activity'?'#eb2c19':'#000000',marginTop:5}}>Activity</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setBottomNav('Account');
                                }} style={{alignItems:'center'}}>
                                    <View style={{borderWidth:1,borderRadius:20,borderColor:bottomNav==='Account'?'#eb2c19':'#000'}}>
                                        <Icon name={'user'} size={22} color={bottomNav==='Account'?'#eb2c19':'#000'}/>
                                    </View>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:12,color:bottomNav==='Account'?'#eb2c19':'#000',marginTop:5}}>Account</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {search &&
                <Animated.View style={{position:'absolute',bottom:0,left:0,right:0,height:height*0.8,transform: [{ translateY }]}}>
                    <KeyboardAvoidingView style={{flex:1}}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
                    >
                        <View {...panResponder.panHandlers}  style={{backgroundColor:'#FFF',flex:1,paddingHorizontal:20}}>

                            <View style={{width:100,height:3,borderRadius:5,backgroundColor:'#000',alignSelf:'center',marginTop:5}}></View>

                            <View style={{borderWidth:0.5,borderColor:'#0000003a',marginVertical:10,marginTop:30}}/>

                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <View style={{alignItems:'center'}}>
                                    <Icc name={'location-pin'} size={25} color={'#eb2c19'}/>
                                    <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000000bd'}}>1.7 km</Text>
                                </View>

                                <View style={{marginLeft:20}}>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>SkyLink Podz</Text>
                                    <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000000bd'}}>Road No-12, banjara hills, Hyderabad </Text>
                                </View> 
                            </View>

                            <View style={{borderWidth:0.5,borderColor:'#0000003a',marginVertical:10}}/>

                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                <View style={{alignItems:'center'}}>
                                    <Icc name={'location-pin'} size={25} color={'#eb2c19'}/>
                                    <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000000bd'}}>2.0 km</Text>
                                </View>

                                <View style={{marginLeft:20}}>
                                    <Text style={{fontFamily:'Poppins-Medium',fontSize:16,color:'#000'}}>Sky House</Text>
                                    <Text style={{fontFamily:'Poppins-Regular',fontSize:14,color:'#000000bd'}}>Narsingi main road, El Dorado, Hyderabad </Text>
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Animated.View>
                }

                {showCalendar &&
                    <CustomModal visible={true} modalStyle={{width:'100%'}}>
                        <View style={{backgroundColor:'#FFF',padding:30,borderTopLeftRadius:30,borderTopRightRadius:30}}>
                            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                <View></View>
                                <Text style={{fontFamily:'Montserrat-SemiBold',fontSize:17,color:'#000'}}>Select Date</Text>
                                <TouchableOpacity onPress={() => {
                                    setShowCalendar(!showCalendar);
                                }}>
                                    <Icc name={'cross'} size={20} color={'#000'}/>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <Calendar
                                    onDayPress={handleDayPress}
                                    markingType='period'
                                    markedDates={selectedDates}
                                    minDate={moment().format("YYYY-MM-DD")}
                                />
                            </View>
                        </View>
                    </CustomModal>
                }
            </ImageBackground>
        </View>
    </SafeAreaView>
  )
}

