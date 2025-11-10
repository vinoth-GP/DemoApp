import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import Common from '../common';
import database from '@react-native-firebase/database';

// ✅ Async thunk to fetch data from Firebase
export const fetchList = createAsyncThunk('list/fetchList', async () => {
  const store = await Common.storage(); // e.g. user info from storage
  const snapshot = await database().ref('/list').once('value');
  return {data: snapshot, store};
});

const initialState = {
  listdata: [],
  listloading: false,
  liststore: '',
  listerror: null,
};

const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    resetList: () => initialState, // reset on logout
    updateList: (state, action) => {
      state.listdata = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchList.pending, state => {
        state.listloading = true;
        state.listerror = null;
      })
      .addCase(fetchList.fulfilled, (state, action) => {
        state.listloading = false;
        const {data: snapshot, store} = action.payload;
        const dataArray = [];
        snapshot.forEach(child => {
          const item = child.val();
        //   if (item.roleid === store.id) {
        //     dataArray.push(item);
        //   }
        dataArray.push(item);
        });
        state.liststore = 'yes';
        state.listdata = dataArray; // store filtered results
      })
      .addCase(fetchList.rejected, (state, action) => {
        state.listloading = false;
        state.listerror = action.error.message;
      });
  },
});

export const {resetList,updateList} = listSlice.actions;
export default listSlice.reducer;
