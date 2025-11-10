import {
  Platform,
  StyleSheet,
  useWindowDimensions,
  Dimensions,
  useColorScheme,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import {appcolor} from './theme';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appcolor.whiteColor,
  },
  title: {
    fontFamily: 'InstrumentSans-Regular',
    fontSize: 16,
    color: appcolor.blackColor,
  },
  text: {
    fontFamily: 'InstrumentSans-Regular',
    fontSize: 14,
    color: appcolor.blackColor,
  },
  btntext: {
    fontFamily: 'InstrumentSans-Regular',
    fontSize: 14,
    color: '#fff',
  },
  btnbg: {
    backgroundColor: appcolor.primarycolor,
    borderRadius: 8,
    padding: 10,
    paddingStart: 20,
    paddingEnd: 20,
    marginTop: 10,
  },
  formbtnbg: {
    borderWidth: 1,
    marginTop: 20,
    borderColor: appcolor.primarybordercolor,
    padding: 10,
    alignItems: 'center',
  },
  errortext: {
    fontFamily: 'InstrumentSans-Regular',
    fontSize: 12,
    color: appcolor.redColor,
  },
  textinputbg: {
    borderColor: appcolor.primarybordercolor,
    flexDirection: 'row',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 6,
  },
  card: {
    backgroundColor: appcolor.whiteColor,
    padding: 16,
    borderRadius: 10,
    elevation: 3, // for Android shadow,
    marginTop:20,
    marginStart:5,marginEnd:5
  },
});
export default Styles;
