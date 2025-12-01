import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/Navigation/AppNavigator';
// import Icon from 'react-native-vector-icons/MaterialIcons';/
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
// 
  return (
    // <NavigationContainer>
    //    <AppNavigator/> 
    // </NavigationContainer>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default App

const styles = StyleSheet.create({})
