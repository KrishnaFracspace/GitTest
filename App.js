import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/Navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { Store } from './src/redux/Store';

import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

const App = () => {

    useEffect(() => {
        // Enable Crashlytics for release builds only
        if (__DEV__) {
            crashlytics().setCrashlyticsCollectionEnabled(false);
            console.log("Crashlytics disabled in DEBUG mode");
        } else {
            crashlytics().setCrashlyticsCollectionEnabled(true);
        }

        // Log that the app has started
        crashlytics().log('App mounted: Navigation initialized');

        // OPTIONAL — set user ID (helpful in production)
        // crashlytics().setUserId("user_12345");

        // OPTIONAL — global JS error handler
        const errorHandler = (error, isFatal) => {
            crashlytics().recordError(error);
            console.log("Crashlytics recorded an error:", error);

            if (isFatal) {
                // You can show your own custom crash screen if needed
            }
        };

        // Assign global handler
        ErrorUtils.setGlobalHandler(errorHandler);

    }, []);

    const routeNameRef = React.useRef();
    const navigationRef = React.useRef();


  return (
    <Provider store={Store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer
          ref={navigationRef}
          onReady={() =>
            routeNameRef.current = navigationRef.current.getCurrentRoute().name
          }
          onStateChange={async () => {
            const previousRouteName = routeNameRef.current;
            const currentRouteName = navigationRef.current.getCurrentRoute().name;

            if (previousRouteName !== currentRouteName) {
              await analytics().logScreenView({
                screen_name: currentRouteName,
                screen_class: currentRouteName
              });
            }
            routeNameRef.current = currentRouteName;
          }}
        >
          <AppNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
