import React from 'react';
import {View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Intro from '../screens/intro';
import Signup from '../screens/signup';
import Signin from '../screens/signin';
import SplashScreen from '../screens/splash';
import Main from './main';
const Stack = createNativeStackNavigator();
const Route = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        animation: 'none',
        headerShown: false,
        gestureEnabled: false,
      }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Intro" component={Intro} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Main" component={Main} />
    </Stack.Navigator>
  );
};
export default Route;
