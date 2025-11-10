import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fieldrequire= "This field is required"

const message = (data) => {

    return Snackbar.show({
        text: data,
        duration: Snackbar.LENGTH_LONG,
        fontFamily: 'InstrumentSans-Regular',
        fontSize: 8,
        numberOfLines: 4,
        position: 'top'
    });

}

const storage = async () => {
    var store = JSON.parse(await AsyncStorage.getItem('cusinfo'))
    return store
}
const objectIdFromDate=()=> {
    const date = new Date();
    const timestamp = Math.floor(date.getTime() / 1000).toString(16);
    const random = [...Array(16)]
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join('');
    return timestamp.padStart(8, '0') + random;
  }
const Common= {
    fieldrequire,
    message,
    storage,
    objectIdFromDate
}
export default Common