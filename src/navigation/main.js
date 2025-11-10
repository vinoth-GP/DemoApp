import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import styles from '../utils/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Common from '../common';
import Feather from 'react-native-vector-icons/Feather';
import {appcolor} from '../utils/theme';
import {useForm, Controller} from 'react-hook-form';
import {RadioButton} from 'react-native-paper';
import database from '@react-native-firebase/database';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {fetchAuth} from '../Slice/authSlice';
import {fetchList, resetList, updateList} from '../Slice/listSlice';
import {store, persistor} from '../Store/store';
import {CommonActions} from '@react-navigation/native';

const Main = props => {
  const [record, setRecord] = useState('');
  const [isAdd, setIsadd] = useState(false);
  const [isUpdate, setisUpdate] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [serach, setSearch] = useState('');
  const dispatch = useDispatch();
  const [serchdata, setSearchdata] = useState([]);
  const {storedata, storeloading, storeerror} = useSelector(
    state => state.auth,
  );
  const {listdata, liststore, listloading, listerror} = useSelector(
    state => state.list,
  );
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: {errors},
  } = useForm({mode: 'onBlur'});

  useEffect(() => {
    if (storedata) {
      getList();
    } else {
      dispatch(fetchAuth());
    }
  }, [storedata]);

  useEffect(() => {
    dispatch(fetchList());
  }, []);

  const getList = async () => {
    const collectdata = {
      roleid: storedata?.id,
      createdby:storedata.role,
      id: Common.objectIdFromDate(),
    };

    setRecord(collectdata);
  };
  function handleInputChange(name, value) {
    setRecord({...record, [name]: value});
  }
  useEffect(() => {
    reset(record);
  }, [record]);
  const submit = async () => {
    if (isUpdate) {
      const updatedData = listdata.map(item => {
        if (item.id === record.id) {
          return {...item, ...record};
        }
        return item;
      });
      dispatch(updateList(updatedData));
      setisUpdate(false);
      await database().ref(`/list/${record.id}`).update(record);

      console.log('✅ Name updated successfully');
    } else {
      try {
        await database().ref(`/list/${record.id}`).set(record);
        Common.message('Record Inserted');
        fetchList();
        const rec = [...listdata, ...[record]];
        dispatch(updateList(rec));
        setIsadd(false);
        getList();
      } catch (error) {
        setIsLoad(false);
        console.error('Error storing data:', error);
      }
    }
  };

  const deleteData = value => {
    const removedata = listdata.filter(obj => obj.id !== value.id);
    dispatch(updateList(removedata));
    database()
      .ref(`/list/${value.id}`)
      .remove()
      .then(() => {
        // resetList();
        // getList();
      });
  };

  const logout = () => {
    store.dispatch({type: 'LOGOUT'}); // reset Redux state
    persistor.purge();
     let keys = ['cusinfo'];
            AsyncStorage.multiRemove(keys, (err) => {


            });
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Intro'}],
      }),
    );
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={{margin: 20, flex: 1}}>
        {isAdd || isUpdate ? (
          <View style={{flex: 1}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.container}>
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <Pressable
                  onPress={() => {
                    setIsadd(false);
                    setisUpdate(false);
                  }}>
                  <Feather
                    name="arrow-left"
                    color={appcolor.primarycolor}
                    size={18}
                  />
                </Pressable>

                <View style={{marginStart: 5}}>
                  <Text style={[styles.title]}>
                    {isUpdate ? 'Update Data' : 'Add Data'}
                  </Text>
                </View>
              </View>
              <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}>
                <View style={{marginTop: 10}}>
                  <Text style={[styles.text, {marginTop: 10}]}>Task Id</Text>
                  <View style={styles.textinputbg}>
                    <TextInput
                      style={{flex: 1, paddingStart: 10}}
                      onChangeText={val => handleInputChange('taskid', val)}
                      value={record?.taskid}
                      keyboardType="numeric"
                      placeholder="Task Id"
                      {...register('taskid', {
                        required: Common.fieldrequire,
                      })}
                    />
                  </View>
                  {errors.taskid && (
                    <Text style={styles.errortext}>
                      {errors.taskid.message}
                    </Text>
                  )}
                </View>

                <View style={{marginTop: 10}}>
                  <Text style={[styles.text, {marginTop: 10}]}>Title</Text>
                  <View style={styles.textinputbg}>
                    <TextInput
                      style={{flex: 1, paddingStart: 10}}
                      onChangeText={val => handleInputChange('title', val)}
                      placeholder="Title"
                      value={record?.title}
                      {...register('title', {
                        required: Common.fieldrequire,
                      })}
                    />
                  </View>
                  {errors.title && (
                    <Text style={styles.errortext}>{errors.title.message}</Text>
                  )}
                </View>

                <View style={{marginTop: 10}}>
                  <Text style={[styles.text, {marginTop: 10}]}>
                    Description
                  </Text>
                  <View style={styles.textinputbg}>
                    <TextInput
                      style={{
                        flex: 1,
                        paddingStart: 10,
                        height: 100,
                        textAlignVertical: 'top',
                      }}
                      onChangeText={val =>
                        handleInputChange('description', val)
                      }
                      placeholder="Description"
                      multiline={true}
                      value={record?.description}
                      {...register('description', {
                        required: Common.fieldrequire,
                      })}
                    />
                  </View>
                  {errors.description && (
                    <Text style={styles.errortext}>
                      {errors.description.message}
                    </Text>
                  )}
                </View>

                <View style={{marginTop: 10}}>
                  <Text style={[styles.text, {marginTop: 10}]}>Completed</Text>
                  <View
                    style={{flexDirection: 'row', marginTop: 10}}
                    {...register('completed', {
                      required: Common.fieldrequire,
                    })}>
                    <View style={{flexDirection: 'row'}}>
                      <RadioButton
                        value={record?.completed}
                        status={
                          record?.completed === 'yes' ? 'checked' : 'unchecked'
                        }
                        color={appcolor.primarycolor}
                        uncheckedColor="#ccc"
                        onPress={() => handleInputChange('completed', 'yes')}
                      />
                      <View style={{justifyContent: 'center'}}>
                        <Text style={styles.text}>Yes</Text>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row', marginStart: 30}}>
                      <RadioButton
                        value={record?.completed}
                        status={
                          record?.completed === 'no' ? 'checked' : 'unchecked'
                        }
                        color={appcolor.primarycolor}
                        uncheckedColor="#ccc"
                        onPress={() => handleInputChange('completed', 'no')}
                      />
                      <View style={{justifyContent: 'center'}}>
                        <Text style={styles.text}>No</Text>
                      </View>
                    </View>
                  </View>
                  {errors.completed && (
                    <Text style={styles.errortext}>
                      {errors.completed.message}
                    </Text>
                  )}
                </View>

                {isLoad ? (
                  <View style={{marginTop: 10}}>
                    <ActivityIndicator
                      size={35}
                      color={appcolor.primarycolor}
                    />
                  </View>
                ) : (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.formbtnbg,
                        {
                          borderWidth: 0,
                          backgroundColor: appcolor.primarycolor,
                        },
                      ]}
                      onPress={handleSubmit(submit)}>
                      <Text style={[styles.btntext]}>Submit</Text>
                    </TouchableOpacity>
                  </>
                )}

                <View style={{height: 50}}></View>
              </ScrollView>
            </KeyboardAvoidingView>
            {/* <View style={{marginTop: 20, flexDirection: 'row'}}>
                <Pressable onPress={()=>{
                    setIsadd(false)
                }}>
              <Feather
                name="arrow-left"
                size={22}
                color={appcolor.primarycolor}
              />
              </Pressable>
              <View style={{marginStart: 10}}>
                <Text style={styles.title}> Add Data</Text>
              </View>
            </View> */}
          </View>
        ) : (
          <View style={{flex: 1}}>
            <View style={{marginTop: 20, flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <Text style={styles.title}> Hii {storedata?.name}</Text>
              </View>
              <Pressable
                onPress={() => {
                  logout();
                }}>
                <AntDesign
                  name="logout"
                  color={appcolor.primarycolor}
                  size={18}
                />
              </Pressable>
            </View>
            <View style={[styles.textinputbg, {marginStart: 5, marginEnd: 5}]}>
              <View style={{padding: 10, justifyContent: 'center'}}>
                <Feather name="search" color={appcolor.blackColor} size={18} />
              </View>

              <TextInput
                style={{flex: 1}}
                onChangeText={val => {
                  const filteredList = listdata.filter(item =>
                    item.title.toLowerCase().includes(val.toLowerCase()),
                  );
                  setSearch(val);
                  setSearchdata(filteredList)
                }}
                value={serach}
                placeholder="Serach Title"
                placeholderTextColor={'#ccc'}
              />
            </View>
            { serach  ? (
              <View style={{flex:1}}>
                {0 < serchdata?.length ? (
                  <ScrollView>
                    {serchdata.map((value, key) => {
                      return (
                        <View style={styles.card} key={key}>
                          <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                              <Text style={styles.text}>
                                Id : {value?.taskid}
                              </Text>
                              <Text style={[styles.text, {marginTop: 10}]}>
                                Title : {value?.title}
                              </Text>
                              <Text style={[styles.text, {marginTop: 10}]}>
                                Description : {value?.description}
                              </Text>
                            </View>
                            <View style={{justifyContent: 'space-evenly'}}>
                              <Pressable
                                onPress={() => {
                                  setRecord(value), setisUpdate(true);
                                }}>
                                <Text style={styles.text}>Edit</Text>
                              </Pressable>

                              <Pressable onPress={() => deleteData(value)}>
                                <Text style={styles.text}>Delete</Text>
                              </Pressable>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.text}>No Record Found</Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={{flex:1}}>
                {0 < listdata?.length ? (
                  <ScrollView>
                    {listdata.map((value, key) => {
                      return (
                        <View style={styles.card} key={key}>
                          <View style={{flexDirection: 'row'}}>
                            <View style={{flex: 1}}>
                              <Text style={styles.text}>
                                Id : {value?.taskid}
                              </Text>
                              <Text style={[styles.text, {marginTop: 10}]}>
                                Title : {value?.title}
                              </Text>
                              <Text style={[styles.text, {marginTop: 10}]}>
                                Description : {value?.description}
                              </Text>
                              <Text style={[styles.text, {marginTop: 10}]}>
                                Createed By : {value?.createdby}
                              </Text>
                            </View>
                            <View style={{justifyContent: 'space-evenly'}}>
                              <Pressable
                                onPress={() => {
                                  setRecord(value), setisUpdate(true);
                                }}>
                                <Text style={styles.text}>Edit</Text>
                              </Pressable>

                              <Pressable onPress={() => deleteData(value)}>
                                <Text style={styles.text}>Delete</Text>
                              </Pressable>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.text}>No Record Found</Text>
                  </View>
                )}
              </View>
            )}
            {
              storedata?.role === 'admin' &&
                <Pressable
              style={{
                backgroundColor: appcolor.primarycolor,
                borderRadius: 30,
                padding: 15,
                position: 'absolute',
                bottom: 30,
                end: 20,
              }}
              onPress={() => {
                setIsadd(true);
              }}>
              <Feather name="plus" size={22} color={appcolor.whiteColor} />
            </Pressable>
            }

          
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
export default Main;
