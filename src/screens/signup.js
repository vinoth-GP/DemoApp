import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import styles from '../utils/styles';
import {useForm, Controller} from 'react-hook-form';
import Feather from 'react-native-vector-icons/Feather';
import {appcolor} from '../utils/theme';
import {TextInput} from 'react-native-gesture-handler';
import {Dropdown} from 'react-native-element-dropdown';
import Common from '../common';
import database from '@react-native-firebase/database';
const Signup = props => {
  const [record, setRecord] = useState('');
  const [isShow, setIsshow] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const rolearry = [
    {label: 'Admin', value: 'admin'},
    {label: 'User', value: 'user'},
  ];
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: {errors},
  } = useForm({mode: 'onBlur'});

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = () => {
    const objid = objectIdFromDate();
    setIsshow(false);
    const obj = {
      id: objid,
    };
    setRecord(obj);
  };

  function handleInputChange(name, value) {
    setRecord({...record, [name]: value});
  }

  useEffect(() => {
    reset(record);
  }, [record]);

  function objectIdFromDate() {
    const date = new Date();
    const timestamp = Math.floor(date.getTime() / 1000).toString(16);
    const random = [...Array(16)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('');
    return timestamp.padStart(8, '0') + random;
  }

  const submit = async () => {
    setIsLoad(true);

    try {
      const snapshot = await database()
        .ref('/roles')
        .orderByChild('email')
        .equalTo(record.email)
        .once('value');

      if (snapshot.exists()) {
        console.log('❌ Email already exists');
        Common.message('Email already exists');
        setIsLoad(false);
        return;
      }
      await database().ref(`/roles/${record.id}`).set(record);
      Alert.alert('Register Completed', 'Your registration was successful!', [
        {
          text: 'OK',
          onPress: () => {
            setRecord(''), setIsLoad(false);
          },
        },
      ]);
    } catch (error) {
      setIsLoad(false);
      console.error('Error storing data:', error);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={{marginTop: '20%', alignItems: 'center'}}>
        <Text style={[styles.title]}>Create Account</Text>
      </View>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, margin: 20}}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}>
        <View style={{marginTop: 10}}>
          <Text style={[styles.text, {marginTop: 10}]}>Name</Text>
          <View style={styles.textinputbg}>
            <View style={{padding: 10, justifyContent: 'center'}}>
              <Feather name="user" color={appcolor.blackColor} size={18} />
            </View>

            <TextInput
              style={{flex: 1}}
              onChangeText={val => handleInputChange('name', val)}
              value={record?.name}
              placeholder="Name"
              {...register('name', {
                required: Common.fieldrequire, // Required validation
                validate: {
                  noLongSpaces: value =>
                    (!/\s{2,}/.test(value) && value.trim() !== '') ||
                    'Invalid Name',
                  noSpecialChars: value =>
                    /^[a-zA-Z\s]*$/.test(value) || 'Invalid Name',
                  minTwoChars: value =>
                    value.trim().length >= 2 || 'Invalid Name',
                },
              })}
            />
          </View>
          {errors.name && (
            <Text style={styles.errortext}>{errors.name.message}</Text>
          )}
        </View>

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
          <Text style={[styles.text, {marginTop: 10}]}>Roles</Text>
          <View style={styles.textinputbg}>
            <View style={{padding: 10, justifyContent: 'center'}}>
              <Feather name="settings" color={appcolor.blackColor} size={18} />
            </View>
            <Dropdown
              style={{flex: 1}}
              data={rolearry}
              labelField={'label'}
              valueField={'value'}
              value={record?.role}
              selectedTextStyle={styles.text}
              placeholderStyle={[styles.text, {opacity: 0.8}]}
              placeholder="Select"
              onChange={val => {
                handleInputChange('role', val.value);
              }}
            />
          </View>
          {errors.role && (
            <Text style={styles.errortext}>{errors.role.message}</Text>
          )}
        </View>

        <View style={{marginTop: 10}}>
          <Text style={[styles.text, {marginTop: 10}]}>Password</Text>
          <View style={styles.textinputbg}>
            <View style={{padding: 10, justifyContent: 'center'}}>
              <Feather name="lock" color={appcolor.blackColor} size={18} />
            </View>

            <TextInput
              style={{flex: 1}}
              onChangeText={val => handleInputChange('password', val)}
              placeholder="Password"
              secureTextEntry={isShow ? false : true}
              value={record?.password}
              {...register('password', {
                required: Common.fieldrequire,
              })}
            />
            <Pressable
              style={{padding: 10, justifyContent: 'center'}}
              onPress={() => {
                setIsshow(!isShow);
              }}>
              <Feather
                name={isShow ? 'eye' : 'eye-off'}
                color={appcolor.blackColor}
                size={18}
              />
            </Pressable>
          </View>
          {errors.password && (
            <Text style={styles.errortext}>{errors.password.message}</Text>
          )}
        </View>

        {
          isLoad ?
          <View style={{marginTop:10}}>
          <ActivityIndicator size={35}color={appcolor.primarycolor} />
        </View> :
        <>
         <TouchableOpacity
          style={[
            styles.formbtnbg,
            {borderWidth: 0, backgroundColor: appcolor.primarycolor},
          ]}
          onPress={handleSubmit(submit)}>
          <Text style={[styles.btntext]}>Sign up</Text>
        </TouchableOpacity>

        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <Text style={styles.text}>If you already have an account</Text>
            <Pressable
              onPress={() => {
                props.navigation.navigate('Signin');
              }}>
              <Text
                style={[
                  styles.text,
                  {color: appcolor.greencolor, marginStart: 5},
                ]}>
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
        </>


        }

        
       

        <View style={{height: 50}}></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default Signup;
