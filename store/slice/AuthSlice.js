import { createSlice } from '@reduxjs/toolkit'
import { cookie, getToken } from '../../helpers/helper'
// let tempId = cookie('tempId') || null;
// if (tempId == null) {
//   tempId = Math.floor(Math.random() * 9999999999999999) + new Date().getMilliseconds();
//   cookie("tempId", tempId, "set")
// }

// create a slice 
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: cookie('token') || null,
    user: cookie('user_data') ? JSON.parse(cookie('user_data')) : null,
    tempId: cookie('tempId') || null,
  },
  reducers: {
    setUser: (state, action) => {
      let { token, user, remember = false } = action.payload
      state.user = user
      state.token = token
      if (remember) {
        cookie("token", token, "set", {
          maxAge: 86400,
        });
        cookie("user_data", user, "set", {
          maxAge: 86400,
        });
      } else {
        cookie("token", token, "set");
        cookie("user_data", user, "set");
      }
    },
    setTemp: (state, action) => {
      let { token, tempId } = action.payload
      state.token = token
      state.tempId = tempId
      cookie("token", token, "set");
      cookie("tempId", tempId, "set");
    },
    removeTemp: (state, action) => {
      state.tempId = null
      cookie("tempId", null, "delete")
    },
    removeUser: (state, action) => {

      state.user = null
      state.token = null
      cookie("token", null, "delete")
      cookie("user_data", null, "delete")
    },
    setUserAddress: (state, action) => {
      let { address } = action.payload
      state.user.default_address = address
      cookie("user_data", state.user, "set");
    },
  },
})
export const { setUser, setTemp, removeUser, removeTemp, setUserAddress } = authSlice.actions
export default authSlice.reducer