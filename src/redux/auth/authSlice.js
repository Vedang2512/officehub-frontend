import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
        state.loading = false;

        state.token = action.payload.token;

        state.user = action.payload.user;

        state.isAuthenticated = true;

        state.error = null;

        localStorage.setItem(
            "token",
            action.payload.token
        );
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("token");
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  setUser,
  logout,
} = authSlice.actions;

export default authSlice.reducer;