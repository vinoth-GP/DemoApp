import React from 'react';
import {View, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import styles from '../utils/styles';
import Feather from 'react-native-vector-icons/Feather';
import { appcolor } from '../utils/theme'
const Intro = (props) => {
  const {width, height} = Dimensions.get('window');
  return (
    <View style={[styles.container]}>
      <View style={{margin: 20, marginTop: 50}}>
        <Image
          source={require('../../assets/img/signinimg.png')}
          style={{
            alignSelf: 'center',
            width: width * 1,
            resizeMode: 'contain',
            height: 300,
          }}
        />
        <View style={{marginTop: 10}}>
          <Text style={[styles.text, {fontSize: 24}]}>Welcome!</Text>
          <Text style={[styles.text, {marginTop: 10,opacity:0.5}]}>
            Plan your day with ease. Organize tasks, set goals, and stay on
            track
          </Text>
        </View>
        <TouchableOpacity
          style={styles.formbtnbg} onPress={()=>{
             props.navigation.navigate('Signin')
          }}>
          <View style={{flexDirection: 'row'}}>
            <Feather name="mail" color={appcolor.blackColor} size={18} />
            <View style={{marginStart: 10, justifyContent: 'center'}}>
              <Text style={[styles.text,{opacity:0.7}]}>Continue with Email</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{marginTop: 20,borderBottomWidth:1,width:140,borderBottomColor:appcolor.greencolor}}>
          <Text style={[styles.text]}>Create new  <Text style={[styles.text,{color:appcolor.greencolor}]} onPress={()=>{
           props.navigation.navigate('Signup') 
          }}>account</Text></Text>
        </View>
      </View>
    </View>
  );
};
export default Intro;
