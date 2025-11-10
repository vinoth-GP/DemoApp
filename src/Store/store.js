import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import { reduxStorage } from './storage'; // MMKV storage adapter
import  authSlice from '../Slice/authSlice';
import listSlice from '../Slice/listSlice';

const appReducer = combineReducers({
  auth: authSlice,
  list:listSlice
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined; // ✅ reset properly
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['auth','list'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk,
    }),
});

export const persistor = persistStore(store);
