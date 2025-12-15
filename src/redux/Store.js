import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
// import userRe

export const Store = configureStore({
  reducer: {
    user: userReducer,
  },
});
