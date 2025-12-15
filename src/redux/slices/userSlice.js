import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {VerifyLoginOtp} from '../../Screen/Mpodz/MPodzApi';
import crashlytics from '@react-native-firebase/crashlytics';

// 1️⃣ Thunk for verifying OTP
export const verifyOtpThunk = createAsyncThunk(
    'user/verifyOtp',
    async ({phone, country_code, otp_code}, {rejectWithValue}) => {
        try {
            const payload = JSON.stringify({
                phone_number: phone,
                country_code,
                otp_code,
                otp_type: 'login',
            });
            console.log('ewjcec');
            const {data: res} = await VerifyLoginOtp(payload);

            if (!res?.success) {
                return rejectWithValue('Invalid OTP');
            }

            // Save to AsyncStorage
            await AsyncStorage.setItem('authToken', res.token);
            await AsyncStorage.setItem('userPhone', phone);

            return {
                token: res.token,
                phone,
            };
        } catch (err) {
            crashlytics().log("OTP verification failed");
            crashlytics().recordError(new Error(`OTP error: ${err?.message}`));

            return rejectWithValue(err.response?.data || err.message);
        }
    },
);

// 2️⃣ Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    phone: null,
    loading: false,
    error: null,
    isLoggedIn: false,
  },

  reducers: {
    logoutUser: state => {
      state.token = null;
      state.phone = null;
      state.isLoggedIn = false;
      AsyncStorage.clear();
    },
  },

  extraReducers: builder => {
    builder
      .addCase(verifyOtpThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.phone = action.payload.phone;
        state.isLoggedIn = true;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const {logoutUser} = userSlice.actions;
export default userSlice.reducer;
