import React, {useEffect, useState, useRef, useContext} from 'react';
import NetInfo from '@react-native-community/netinfo';
import RBSheet from 'react-native-raw-bottom-sheet';
import {firebase} from '@react-native-firebase/messaging';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer, CommonActions} from '@react-navigation/native';
import {
  Text,
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  AppState,
  useColorScheme,
  Linking,
  Alert,
} from 'react-native';
import styles from './src/utils/styles';
import Route from './src/navigation/route';
import {navigationRef} from './src/navigation/rootNavigation';
import {Provider} from 'react-redux';
import {store, persistor} from './src/Store/store';
import {PersistGate} from 'redux-persist/integration/react';

const App = () => {
  const refRBSheet = useRef();
  const [netStat, setNetStat] = useState('');
  const {height, width} = useWindowDimensions();
  const [intLoading, setIntLoading] = useState(false);
  const [start, setStart] = useState('');
  const appState = useRef(AppState.currentState);
  const systemtheme = useColorScheme();
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetStat(state.isConnected ? 'Connected' : 'Disconnected');
      if (state.isConnected) refRBSheet.current.close();
      else refRBSheet.current.open();
    });
    return () => {
      unsubscribe();
    };
  }, [netStat]);

  function checkNetworkConnection() {
    setIntLoading(true);

    setTimeout(() => {
      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          setIntLoading(false);
          refRBSheet.current.close();
        } else {
          setIntLoading(false);
          refRBSheet.current.open();
        }
      });
    }, 3000);
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer ref={navigationRef}>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={false}
          closeOnPressMask={false}
          height={height}
          customStyles={{
            draggableIcon: {
              backgroundColor: '#fff',
            },
          }}>
          <View
            style={{
              height: height,
              width: '100%',
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              marginTop: 0,
              paddingTop: 0,
            }}>
            <Image
              source={require('./assets/img/no-internet.jpg')}
              style={{
                alignSelf: 'center',
                width: width * 0.6,
                resizeMode: 'contain',
                backgroundColor: '#444',
                maxHeight: width * 0.6,
              }}
            />
            <Text style={styles.title}>Whoops!</Text>
            {netStat && netStat == 'Disconnected' && (
              <Text style={[styles.text, {marginTop: 10}]}>
                You are offline. Please check your connection and try again
              </Text>
            )}
            {netStat && netStat == 'Connected' && (
              <Text style={[styles.text, {marginTop: 10}]}>
                Your network connection is back!
              </Text>
            )}
          </View>
        </RBSheet>

        <Route />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
