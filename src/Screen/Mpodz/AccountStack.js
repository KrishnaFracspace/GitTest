import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Account from './Account';
import ReferEarn from './ReferEarn';
import PrivacySecurity from './PrivacySecurity';
import Notification from './Notification';

const Stack = createNativeStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator initialRouteName='Account' screenOptions={{headerShown: false}}>
        <Stack.Screen name="Account" component={Account}/>
        <Stack.Screen name="ReferEarn" component={ReferEarn}/>
        <Stack.Screen name="PrivacySecurity" component={PrivacySecurity}/>
        <Stack.Screen name="Notification" component={Notification}/>
    </Stack.Navigator>
  );
}
