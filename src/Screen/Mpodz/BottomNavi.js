import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React, { forwardRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 4;

const tabs = [
  {
    icon: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Homee1.png',
    notActive: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Homee.png',
    label: 'Home',
    navi: 'HomeStack',
    nav: 'MPodzHome',
  },
  {
    icon: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Booking3.png',
    notActive: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Booking2.png',
    label: 'Booking',
    navi: 'Bookings',
    nav: 'Bookings',
  },
  {
    icon: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Activity1.png',
    notActive: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Activity.png',
    label: 'Activity',
    navi: 'Activity',
    nav: 'Activity',
  },
  {
    icon: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Account.png',
    notActive: 'https://fracspace-updates.s3.ap-south-1.amazonaws.com/appImages/Account.png',
    label: 'Account',
    navi: 'AccountStack',
    nav: 'Account',
  },
];

const BottomNavi = forwardRef(({ state, navigation }, ref) => {
    const [selected, setSelected] = useState(state.index);
    const [bottomNav, setBottomNav] = useState('Home');

    useEffect(() => {
        setSelected(state.index);
    }, [state.index]);

    const currentRoute = state.routes[state.index];
    const nestedRoute = getFocusedRouteNameFromRoute(currentRoute);
    const routeName = nestedRoute ?? currentRoute.name;

    //   console.log("▶ Stack:", currentRoute.name, "| nested:", nestedRoute, "| route:", routeName);

    // ✅ Hide BottomNav when not on the first screen of each stack
    if (
        (currentRoute.name === 'HomeStack' && routeName !== 'HomeStack' && routeName !== 'MPodzHome') ||
        (currentRoute.name === 'AccountStack' && routeName !== 'AccountStack' && routeName !== 'Account') ||
        (currentRoute.name === 'Bookings' && routeName !== 'Bookings') ||
        (currentRoute.name === 'Activity' && routeName !== 'Activity')
    ) {
        return null;
    }

  return (
    <View style={{ width: '100%', position: 'absolute', bottom: 0 }}>
      <View
        style={{
          backgroundColor: '#FFF',
          borderWidth: 0.5,
          borderColor: '#00000042',
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {tabs.map((item, index) => {
          const isActive = bottomNav === item.label;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setBottomNav(item.label);
                if (item.navi) {
                  navigation.navigate(item.navi, {
                    screen: item.nav,
                  });
                }
              }}
              style={{ alignItems: 'center' }}
            >
              {!isActive ? (
                <Image
                  source={{ uri: item.notActive }}
                  style={{ width: 25, height: 25 }}
                  resizeMode="contain"
                />
              ) : (
                <Image source={{ uri: item.icon }} style={{ width: 25, height: 25 }} resizeMode="contain" />
              )}
              <Text
                style={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: 13,
                  color: '#000',
                  marginTop: 5,
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

export default BottomNavi;
