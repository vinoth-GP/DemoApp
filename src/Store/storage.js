import { MMKV } from 'react-native-mmkv'

// Create MMKV instance
export const mmkv = new MMKV({
  id: 'secure-storage',
  encryptionKey: 'your-strong-key-123456',
})

// Adapter for redux-persist
export const reduxStorage = {
  setItem: (key, value) => {
    mmkv.set(key, value)
    return Promise.resolve(true)
  },
  getItem: (key) => {
    const value = mmkv.getString(key)
    return Promise.resolve(value ?? null)
  },
  removeItem: (key) => {
    mmkv.delete(key)
    return Promise.resolve()
  },
}
