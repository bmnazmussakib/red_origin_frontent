import { applyMiddleware, configureStore, ThunkMiddleware } from "@reduxjs/toolkit"
import { createWrapper } from "next-redux-wrapper"
import authReducer from "./slice/AuthSlice"
import cartReducer from "./slice/CartSlice"
import wishlistReducer from "./slice/WishListSlice"
import GlobalSetting from "./slice/GlobalSetting"


// config the store 
const mainStore = createWrapper(
  () => configureStore({
    reducer: {
      authSlice: authReducer,
      cartSlice: cartReducer,
      wishListSlice: wishlistReducer,
      globalSetting: GlobalSetting

    },
  }), { debug: true })

export default mainStore