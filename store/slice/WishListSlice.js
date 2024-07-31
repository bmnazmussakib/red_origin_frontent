import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { cookie, get, getToken, post, tAlert } from "../../helpers/helper";
import { hasCookie } from "cookies-next";
import axios from "axios";
import { toast } from "react-toastify";

// create a slice
export const wishListSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: cookie("wishList") ? JSON.parse(cookie("wishList")) : [],
  },
  reducers: {
    addToWishList({ wishlist }, { payload }) {

      let { id, toast = true } = payload;

      if (wishlist.includes(id)) {
        wishlist.splice(wishlist.indexOf(id), 1);
        toast ? tAlert("Removed From List", "warning") : null;
      } else {
        wishlist.push(id);
        toast ? tAlert("Added To List", "success") : null;
      }
      cookie("wishList", JSON.stringify(wishlist), "set");
    },
    removeWishList({ wishlist }, { payload }) {
      let { id } = payload;
      wishlist.splice(wishlist.indexOf(id), 1);

      tAlert("Removed From List", "warning");
      cookie("wishList", JSON.stringify(wishlist), "set");
    },
    clearWishList(state, { payload }) {
      state.wishlist = [];
      let { logout } = payload;
      if (logout) {
        cookie("wishList", JSON.stringify(state.wishlist), "set");
        return state;
      }
      tAlert("Removed From List", "warning");
      cookie("wishList", JSON.stringify(state.wishlist), "set");
      return state;
      
    }
  },
  extraReducers: {
    [HYDRATE]: (state, { payload }) => {
      return {
        ...state,
        wishlist: cookie("wishList") ? JSON.parse(cookie("wishList")) : [],
      };
    },
  },
});
export const { addToWishList, removeWishList, clearWishList } = wishListSlice.actions;

export default wishListSlice.reducer;






export const addToWishListBackend = (data, token = null) => async (dispatch) => {
  let user = cookie('user_data') ? JSON.parse(cookie('user_data')) : null
  let wishListData = {
    user_id: user.id,
    product_id: data?.id
  }
  await axios.get(
    (process.env.NEXT_PUBLIC_SERVER_MAIN_URL ??
      'https://backend.rise-brand.com/') + 'sanctum/csrf-cookie'
  ).then(async (csrf) => {
    let res = await post('/v2/wishlists?platform=web', '', wishListData, {
      headers: {
        Authorization: `Bearer ${token || getToken()}`,
      }
    }).catch((err) => {
      return {
        status: false,
        message: err?.message || 'Try Again',
      };
    });

    if (res?.status == 200 && res.data?.result == true) {
      dispatch(addToWishList({ id: data?.id }));
      return {
        status: true,
        message: res?.data?.message || 'Added to wishlist',
      };
    } else if (res?.status == 201 && res.data?.result == true) {
      await dispatch(removeWishList({ id: data?.id }));
      return {
        status: true,
        message: res?.data?.message || 'Removed to wishlist',
      };
    } else {
      return {
        status: false,
        message: res?.data?.message || 'Try Again',
      };
    }
  });


};


export const getWishListBackend = (token = null) => async (dispatch) => {
  let user = cookie('user_data') ? JSON.parse(cookie('user_data')) : null
  let result = await axios.get('/v2/wishlists', {
    headers: {
      Authorization: `Bearer ${token || getToken()}`,
    }
  }).catch((err) => {
    return {
      status: false,
      message: err?.message || 'Try Again',
    };
  });

  if (result?.status == 200 && result?.data?.success == true) {
    console.log(result?.data?.data)
    let wishList = result?.data?.data?.forEach((item) => {
      dispatch(addToWishList({
        id: item?.product?.id,
        toast: false
      }));
    })
  }

}