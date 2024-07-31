import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { cookie, extractVariant, tAlert } from "../../helpers/helper";

//! cart format
// {
// id: 5217
// name: "MENS CLASSIC KURTA"
// thumbnail_image: "http://sailors3bucket1.s3.ap-southeast-1.amazonaws.com/uploads/all/fpyAzlgplHVGMp1XgDCGnWb0ypRnRmewFIFg4At9.jpg"
// main_price: 2805.25
// main_price_discount: 0
// discount_amount: 0
// barcode: "A038303"
// variant: "peachpuff_1-l"
// quantity: 1
// discount: "0"
// stock: null
// tax: 0
// shipping: 0
//}
// ? cart format


// create a slice
export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    payment_info: {},
    cart: cookie("CART") ? JSON.parse(cookie("CART")) : [],
    coupon: cookie("coupon") ? JSON.parse(cookie("coupon")) : {
      coupon: "",
      coupon_applied: false,
      coupon_amount: 0,
      tax: 0,
      free_shipping: false,
    },
    membership: cookie("membership") ? JSON.parse(cookie("membership")) : {
      membership_no: "",
      membership_applied: null,
      membership_amount: 0,
      otp: false,
      tax: 0,
    },
    gift_card: cookie("gift_card") ? JSON.parse(cookie("gift_card")) : {
      gift_card_no: "",
      gift_card_applied: null,
      gift_card_amount: 0,
      otp: false,
      tax: 0,
    }
  },
  reducers: {
    setPaymentInfo: (state, action) => {
      state.payment_info = action.payload.payment_info
    },
    addToCart: ({ cart }, { payload }) => {

      let { id, name, thumbnail_image, main_price, main_price_discount, barcode, variant, discount, stock, shipping_cost = 0, tax = 0, slug, sku, product_id, quantity } =
          payload;

      let product = cart?.findIndex((item) => item.barcode == barcode);
      if (product != -1) {
        if (quantity) {
          cart[product].quantity = quantity;
        } else {
          cart[product].quantity += 1;
        }
      } else {
        cart.push({
          id,
          name,
          thumbnail_image,
          main_price: main_price,
          main_price_discount: main_price_discount,
          quantity: quantity || 1,
          barcode,
          variant,
          discount: parseFloat(discount),
          stock,
          tax,
          slug,
          shipping_cost,
          sku,
          product_id
        });
      }

      cookie("CART", JSON.stringify(cart), "set");

    },
    removeFromCart: (state, { payload }) => {
      let { cart } = state
      let { id, barcode, removeFromCart = false } = payload;
      let getId = cart?.findIndex((item) => item.barcode == barcode);
      if (removeFromCart) {
        cart = cart.filter((item, i) => {
          if (getId != i) {
            return item
          }
        });
      } else {
        if (getId != -1) {
          if (cart[getId]?.quantity == 1) {
            cart.splice(cart.indexOf(getId), 1);
          } else {

            cart[getId].quantity -= 1;

          }
        }
      }
      cookie("CART", JSON.stringify(cart), "set");
      tAlert("Product removed to cart", "success");
      state.cart = cart;
      return state
    },
    clearCart: (state) => {

      state.cart = [];
      state.coupon = {
        coupon: "",
        coupon_applied: false,
        coupon_amount: 0,
        free_shipping: false,

      }
      state.backend_cart = [];
      cookie("coupon", JSON.stringify({
        coupon: "",
        coupon_applied: false,
        coupon_amount: 0,
        free_shipping: false,
      }), "set");
      cookie("CART", JSON.stringify([]), "set");
      return state
    },
    applyCoupon: ({ coupon }, { payload }) => {
      coupon.coupon = payload.coupon;
      coupon.coupon_applied = payload.coupon_applied;
      coupon.coupon_amount = payload.coupon_amount;
      coupon.tax = payload.tax;
      coupon.free_shipping = payload.free_shipping;
      cookie("coupon", JSON.stringify(coupon), "set");

    },
    clearCoupon: ({ coupon }, { payload }) => {
      coupon.coupon = "";
      coupon.coupon_applied = false;
      coupon.coupon_amount = 0;
      coupon.tax = 0;
      coupon.free_shipping = false;
      cookie("coupon", "delete");

    },
    membershipOtpSend: (state, { payload }) => {
      state.membership.otp = payload.send_status;
    },
    giftCardOtpSend: (state, { payload }) => {
      state.gift_card.otp = payload.send_status;
    },
    applyMemberShip: ({ membership }, { payload }) => {
      //console.log(JSON.stringify(payload.membership_amount) + 'prantho')
      membership.membership_no = payload.membership_no;
      membership.membership_applied = payload.membership_applied;
      membership.membership_amount = payload.membership_amount;
      membership.otp = false
      membership.tax = payload.tax
      cookie("membership", JSON.stringify(membership), "set");
    },
    applyGiftCard: ({ gift_card }, { payload }) => {
      //consolapplyGiftCarde.log(JSON.stringify(payload.membership_amount) + 'prantho')
      gift_card.gift_card_no = payload.gift_card_no;
      gift_card.gift_card_applied = payload.gift_card_applied;
      gift_card.gift_card_amount = payload.gift_card_amount;
      gift_card.otp = false
      gift_card.tax = payload.tax
      cookie("gift_card", JSON.stringify(gift_card), "set");
    },
    clearMemberShip: ({ coupon }, { payload }) => {
      coupon.membership = "";
      coupon.membership_applied = false;
      coupon.membership_amount = 0;
      coupon.tax = 0
      cookie("membership", "delete");
    },
    backendCart: (state, { payload }) => {
      let backend_cart = payload?.carts;
      backend_cart = backend_cart[0]?.cart_items ?? backend_cart;
      console.log(backend_cart)
      let tempCart = backend_cart.map((item) => {
        let {
          id,
          original_price,
          owner_id,
          user_id,
          product_id,
          product_name,
          sku,
          barcode,
          product_thumbnail_image,
          variation,
          price,
          currency_symbol,
          tax,
          shipping_cost,
          quantity,
          discount,
          lower_limit,
          upper_limit,
          stock,
          circular_discount,
          flash_discount,
          loyalty_discount,
          slug,
          digital = 0,
        } = item;
        return {
          id: id,
          name: product_name,
          thumbnail_image: product_thumbnail_image,
          main_price: price,
          main_price_discount: price - (discount / quantity),
          barcode: barcode || null,
          variant: variation,
          discount: parseFloat(discount) + parseFloat(circular_discount) + parseFloat(flash_discount) + parseFloat(loyalty_discount),
          tax: tax || 0,
          shipping_cost: shipping_cost || 0,
          slug: slug,
          sku: sku,
          quantity,
          product_id
        }
      });

      state.cart = [
        ...tempCart
      ]
      cookie("CART", JSON.stringify(state.cart), "set");
    },

    extraReducers: {
      [HYDRATE]: (state, { payload }) => {
        return {
          ...state,
          cart: cookie("CART") ? JSON.parse(cookie("CART")) : [],
        };
      },
    },
  }
});
export const { setPaymentInfo, applyGiftCard, addToCart, removeFromCart, clearCart, applyCoupon, clearCoupon, backendCart, membershipOtpSend, applyMemberShip, clearMemberShip, giftCardOtpSend } = cartSlice.actions;
export default cartSlice.reducer;
