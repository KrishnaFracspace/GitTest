import React, { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import Bookings from './Bookings';
import AccountStack from './AccountStack';
import BottomNavi from './BottomNavi';
import Activity from './Activity';

const Tab = createBottomTabNavigator();

export default function MpodzStack() {
    // const bottomTabRef = useBottomTabRef();
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNavi {...props} />}
    >
        <Tab.Screen name="HomeStack" component={HomeStack}/>
        <Tab.Screen name="Bookings" component={Bookings}/>
        <Tab.Screen name="Activity" component={Activity}/>
        <Tab.Screen name="AccountStack" component={AccountStack}/>
    </Tab.Navigator>
  );
}

