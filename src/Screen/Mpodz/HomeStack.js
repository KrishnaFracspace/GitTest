import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MPodzHome from './MPodzHome';
import VerifyDetails from './VerifyDetails';
import BookingConfirm from './BookingConfirm';
import DisplayDetails from './DisplayDetails';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator initialRouteName='MPodzHome' screenOptions={{headerShown: false}}>
        <Stack.Screen name="MPodzHome" component={MPodzHome} />
        <Stack.Screen name='VerifyDetails' component={VerifyDetails} options={{headerShown:false}}/>
        <Stack.Screen name='DisplayDetails' component={DisplayDetails} options={{headerShown:false}}/>
        <Stack.Screen name='BookingConfirm' component={BookingConfirm} options={{headerShown:false}}/>
    </Stack.Navigator>
  );
}
