import { View, Text, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Registeration from '../Screen/Mpodz/Registeration';
import { MpodzProvider } from '../Screen/Mpodz/MpodzContex';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FirstTest from '../Screen/GitTest/FirstTest';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MpodzStack from '../Screen/Mpodz/MpodzStack';
import Login from '../Screen/Mpodz/Login';

const Stack = createNativeStackNavigator();

const AuthLoading = ({ navigation }) => {
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      console.log("knldc: ", token);

      if (token) {
        try {
          const decoded = jwtDecode(token);
          const now = new Date();
          const expiryDate = new Date(decoded.exp * 1000);

          if (now < expiryDate) {
            navigation.replace('MpodzStack'); // ✅ go directly to main stack
          } else {
            await AsyncStorage.removeItem('authToken');
            navigation.replace('Login');
          }
        } catch (error) {
          console.error('Invalid token:', error);
          await AsyncStorage.removeItem('authToken');
          navigation.replace('Login');
        }
      } else {
        navigation.replace('Login');
      }
    };

    checkToken();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
};

export default function AppNavigator() {
  return (
    <MpodzProvider>
        <GestureHandlerRootView>
            <Stack.Navigator initialRouteName='Registeration'>
                <Stack.Screen name='AuthLoading' component={AuthLoading} options={{headerShown:false}}/>
                <Stack.Screen name='Login' component={Login} options={{headerShown:false}}/>
                <Stack.Screen name='MpodzStack' component={MpodzStack} options={{headerShown: false}}/>
                <Stack.Screen name='Registeration' component={Registeration} options={{headerShown:false}}/>
            </Stack.Navigator>
        </GestureHandlerRootView>
    </MpodzProvider>
  )
}
