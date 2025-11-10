import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import styles from '../utils/styles';
import {useForm, Controller} from 'react-hook-form';
import Feather from 'react-native-vector-icons/Feather';
import {appcolor} from '../utils/theme';
import {TextInput} from 'react-native-gesture-handler';
import {Dropdown} from 'react-native-element-dropdown';
import Common from '../common';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signin = props => {
  const [record, setRecord] = useState('');
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: {errors},
  } = useForm({mode: 'onBlur'});

  function handleInputChange(name, value) {
    setRecord({...record, [name]: value});
  }

  useEffect(() => {
    reset(record);
  }, [record]);

  const submit = async () => {
    try {
      const snapshot = await database()
        .ref('/roles')
        .orderByChild('email')
        .equalTo(record?.email)
        .once('value');

      if (snapshot.exists()) {
        let userData = null;

        snapshot.forEach(child => {
          const data = child.val();
          if (data.password === record?.password) {
            userData = {
              id: data.id,
              name: data.name,
              email: data.email,
              role: data.role,
            };
          }
        });

        if (userData) {
          storeData('cusinfo', userData);
          props.navigation.navigate('Main');
          // Alert.alert(
          //   "Login Successful",
          //   `Welcome ${userData.name}!`,
          //   [
          //     {
          //       text: "OK",
          //       onPress: () =>
          //         console.log("Logged in user data:", userData),
          //     },
          //   ]
          // );
        } else {
          Alert.alert('Error', 'Invalid password');
        }
      } else {
        Alert.alert('Error', 'Email not found');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {}
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={{marginTop: '20%', alignItems: 'center'}}>
        <Text style={[styles.title]}>Sign In</Text>
      </View>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, margin: 20}}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}>
        <View style={{marginTop: 10}}>
          <Text style={[styles.text, {marginTop: 10}]}>Email</Text>
          <View style={styles.textinputbg}>
            <View style={{padding: 10, justifyContent: 'center'}}>
              <Feather name="mail" color={appcolor.blackColor} size={18} />
            </View>

            <TextInput
              style={{flex: 1}}
              onChangeText={val => handleInputChange('email', val)}
              placeholder="Email Address"
              value={record?.email}
              {...register('email', {
                required: Common.fieldrequire,
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                  message: 'Invalid email',
                },
              })}
            />
          </View>
          {errors.email && (
            <Text style={styles.errortext}>{errors.email.message}</Text>
          )}
        </View>

        <View style={{marginTop: 10}}>
          <Text style={[styles.text, {marginTop: 10}]}>Password</Text>
          <View style={styles.textinputbg}>
            <View style={{padding: 10, justifyContent: 'center'}}>
              <Feather name="lock" color={appcolor.blackColor} size={18} />
            </View>

            <TextInput
              style={{flex: 1,color:appcolor.blackColor}}
              onChangeText={val => handleInputChange('password', val)}
              placeholder="Password"
              secureTextEntry={true}
              value={record?.password}
              {...register('password', {
                required: Common.fieldrequire,
              })}
            />
          </View>
          {errors.password && (
            <Text style={styles.errortext}>{errors.password.message}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.formbtnbg,
            {
              borderWidth: 0,
              backgroundColor: appcolor.primarycolor,
              marginTop: 30,
            },
          ]}
          onPress={handleSubmit(submit)}>
          <Text style={[styles.btntext]}>Sign In</Text>
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <Text style={styles.text}>If you don't have an account</Text>
            <Pressable
              onPress={() => {
                props.navigation.navigate('Signup');
              }}>
              <Text
                style={[
                  styles.text,
                  {color: appcolor.greencolor, marginStart: 5},
                ]}>
                Sign up
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={{height: 50}}></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default Signin;
