import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import styles from '../utils/styles';
import {appcolor} from '../utils/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({navigation}) => {
  const {width, height} = Dimensions.get('window');
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(async () => {
      const data = await AsyncStorage.getItem('cusinfo');
      if (data) {
        navigation.replace('Main');
      } else {
        navigation.replace('Intro');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, {justifyContent: 'center'}]}>
      <Image
        source={require('../../assets/img/signinimg.png')}
        style={{
          alignSelf: 'center',
          width: width * 1,
          resizeMode: 'contain',
          height: 300,
        }}
      />
      <ActivityIndicator size={40} color={appcolor.primarycolor} />
    </View>
  );
};

export default SplashScreen;
