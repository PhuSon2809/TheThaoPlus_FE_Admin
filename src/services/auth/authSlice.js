import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { loginAdminThunk, logoutThunk, registerAdminThunk, updateAdminThunk } from './authThunk';

const getUserfromLocalStorage = localStorage.getItem('userInfoAdmin')
  ? JSON.parse(localStorage.getItem('userInfoAdmin'))
  : null;

const initialState = {
  user: getUserfromLocalStorage,
  token: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  isEditing: false,
  message: '',
};

export const RegisterAdmin = createAsyncThunk('auth/RegisterAdmin', registerAdminThunk);
export const LoginAdmin = createAsyncThunk('auth/LoginAdmin', loginAdminThunk);
export const logoutAccount = createAsyncThunk('auth/Logout', logoutThunk);
export const updateAccount = createAsyncThunk('auth/UpdateAdmin', updateAdminThunk);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMessageSuccess: (state, action) => {
      state.message = action.payload;
      toast.success(state.message);
    },
    setEditUser: (state) => {
      state.isEditing = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(RegisterAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(RegisterAdmin.fulfilled, (state, action) => {
        console.log(action.payload);
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(RegisterAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        toast.error(action.payload?.data.message);
      })
      .addCase(LoginAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(LoginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload?.user;
        state.token = action.payload?.token;
        state.message = 'success';
      })
      .addCase(LoginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(logoutAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAccount.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = '';
        toast.success('Logout Successfully');
      })
      .addCase(logoutAccount.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(updateAccount.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload?.userUpdated;
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        console.log(action.payload);
        toast.error('Phone number is already!');
        // toast.error(action.payload);
      });
  },
});

export const { setMessageSuccess, setEditUser } = authSlice.actions;
export default authSlice.reducer;
