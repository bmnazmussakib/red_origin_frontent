import axios from 'axios';
import { toast } from 'react-toastify';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import Router, { useRouter } from 'next/router';
import { cart as cartRoute } from '../utils/route';

export const get = async (url, params, toastR = false) => {
  try {
    let res = await axios.get(url, { params });
    return res;
  } catch (error) {
    console.log(error);
    // toastR && toast(error.message);
    if (error?.response?.status == 401) {
      router.push('/login');
    }
    return {
      message: error.message || 'Some Wrong',
      status: error.status || 500,
    };
  }
};

export const post = (url, params, body, headers = {}, rest = []) => {
  return axios.post(url, body, headers, params, ...rest);
};

export const lang = (page, key) => {
  if (page[key]) {
    return page[key];
  } else {
    return key;
  }
};
export let membership = (stroked_price, percent) => {
  // let str = stroked_price?.slice(1, -1);
  // let str2 = str?.replaceAll(",", "");
  let percentage = parseInt(stroked_price) * 0.2;
  return stroked_price - percentage.toFixed(2);
};
/*

@type info,success,warning,error
*/
export const filterVariant = (
  variants,
  variant,
  cart = false
) => {
  let barcode_selected = variants.find((val) => {
    console.log(val?.variant, variant?.toString())
    console.log("=======================*===============")

    if (val?.variant == variant?.toString()) {
      return val;
    }
  });
console.log(barcode_selected)
  if (cart) {
    return barcode_selected;
  }
  return barcode_selected?.barcode;
};

export const filterStockVariant = (
    variants,
    selectedSize,
    selectedColor =null,
    cart = false
) => {
  let barcode_selected = variants.filter((val) => {
    if (val?.variant) {
      let variantProducts = val?.variant?.split('-');
      console.log("current_stock_result", variantProducts)
      let size = variantProducts[0];
      let color = variantProducts[1];

      if (size === selectedSize) {
        return val;
      } else if (color === selectedColor) {
        return val;
      }
    }
  });
  if (cart) {
    return barcode_selected;
  }
  return barcode_selected?.barcode;
};

export const extractVariant = (variant) => {
  let variantProducts = variant?.split('-');

  let color = variantProducts[1] || null;
  let size = variantProducts[0] || null;

  return { color, size };
};
export const formatMoney = (money) => {
  return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(
    parseFloat(money).toFixed(2)
  );
};
export const extractor = (data, search = '', target = '', all = false) => {
  if (all) {
    return data.replaceAll(search, target);
  } else {
    return data.replace(search, target);
  }
};

export const formatUnderscoreToWords=(str) => {
  return str.replace(/_/g, ' ');
}

export const discountTextExcerpt = (discount) => {
  return discount.split('%')[0].split('-')[1] ?? 0;
};

export const tAlert = (message, type = 'default') => {
  toast(message, { type });
};

export const isActive = (path) => {
  let router = useRouter();

  return router.pathname === path ? true : false;
};
export function cookie(key, value = null, type = null, options = {}) {
  if (type == 'set') {
    return setCookie(key, value, options);
  } else if (type == 'delete') {
    deleteCookie(key);
    return true;
  } else {
    return getCookie(key);
  }
}

export function checkFromWishlist(wishList, id) {
  if (wishList) {
    if (wishList.includes(id)) {
      return true;
    }
  } else {
    return false;
  }
}
export function addToWishList(id) {
  let wishList = cookie('wishList');
  if (wishList) {
    wishList = JSON.parse(wishList);
    if (checkFromWishlist(wishList, id)) {
      tAlert('Removed From List', 'warning');
      removeFromWishList(id);
      return false;
    }
    wishList.push(id);
    cookie('wishList', JSON.stringify(wishList), 'set');
  } else {
    cookie('wishList', JSON.stringify([id]), 'set');
  }
  tAlert('Added to wishlist', 'success');
  return true;
}
export function removeFromWishList(id) {
  let wishList = cookie('wishList');
  if (wishList) {
    wishList = JSON.parse(wishList);
    wishList = wishList.filter((item) => item != id);
    cookie('wishList', JSON.stringify(wishList), 'set');
  }
}
export function getWishList() {
  let wishList = cookie('wishList');
  if (wishList) {
    wishList = JSON.parse(wishList);
    return wishList;
  } else {
    return [];
  }
}

export function getLang() {
  return cookie('lang') || 'en';
}

export function getToken() {
  return cookie('token');
}

export const breakPoints = {
  1: {
    slidesPerView: 1,
  },
  320: {
    slidesPerView: 1,
  },

  575: {
    slidesPerView: 1,
  },
  576: {
    slidesPerView: 2,
  },
  767: {
    slidesPerView: 2,
  },
  900: {
    slidesPerView: 3,
  },
  992: {
    slidesPerView: 3,
  },
  1024: {
    slidesPerView: 5,
  },
  1366: {
    slidesPerView: 5,
  },
  1400: {
    slidesPerView: 4,
  },
  1600: {
    slidesPerView: 5,
  },
};

export const trendingBreakPoints = {
  320: {
    slidesPerView: 1,
  },
  414: {
    slidesPerView: 1,
  },
  575: {
    slidesPerView: 2,
  },
  767: {
    slidesPerView: 3,
  },
  992: {
    slidesPerView: 3,
  },
  1024: {
    slidesPerView: 4,
  },
  1600: {
    slidesPerView: 5,
  },
};

export const newarrivalbreakpoints = {
  320: {
    slidesPerView: 2,
  },
  414: {
    slidesPerView: 2,
  },
  767: {
    slidesPerView: 3,
  },
  992: {
    slidesPerView: 3,
  },
  1024: {
    slidesPerView: 4,
  },
  1366: {
    slidesPerView: 5,
  },
  1600: {
    slidesPerView: 5,
  },
};

export const flashbreakpoints = {
  320: {
    slidesPerView: 2,
  },
  414: {
    slidesPerView: 2,
  },
  767: {
    slidesPerView: 3,
  },
  992: {
    slidesPerView: 3,
  },
  1024: {
    slidesPerView: 4,
  },
  1366: {
    slidesPerView: 5,
  },
  1600: {
    slidesPerView: 5,
  },
};

export const featurebreakpoints = {
  320: {
    slidesPerView: 2,
  },
  414: {
    slidesPerView: 2,
  },
  767: {
    slidesPerView: 3,
  },
  992: {
    slidesPerView: 3,
  },
  1024: {
    slidesPerView: 4,
  },
  1366: {
    slidesPerView: 5,
  },
  1600: {
    slidesPerView: 5,
  },
};

export const suggestedbreakpoints = {
  320: {
    slidesPerView: 2,
  },
  414: {
    slidesPerView: 2,
  },
  576: {
    slidesPerView: 3,
  },
  767: {
    slidesPerView: 3,
  },
  992: {
    slidesPerView: 3,
  },
  1024: {
    slidesPerView: 4,
  },
  1366: {
    slidesPerView: 4,
  },
  1600: {
    slidesPerView: 4,
  },
};

export const recentviewbreakpoints = {
  320: {
    slidesPerView: 2,
  },
  414: {
    slidesPerView: 2,
  },
  576: {
    slidesPerView: 3,
  },
  767: {
    slidesPerView: 3,
  },
  992: {
    slidesPerView: 3,
  },
  1024: {
    slidesPerView: 4,
  },
  1366: {
    slidesPerView: 4,
  },
  1600: {
    slidesPerView: 4,
  },
};

export let addToCartBackend = async (cartData = {}, token = null) => {
  try {
    let res = await post(cartRoute.ADD_TO_CART, null, cartData, {
      headers: {
        Authorization: `Bearer ${token || getToken()}`,
      },
    }).catch((err) => {
      console.log(err?.response?.data?.message);
      throw new Error(err?.response?.data?.message || 'Stock not available');
    });
    if (res?.status == 200 && res.data?.result == true) {
      return {
        add_status: true,
        message: res.data.message || 'Added to cart',
      };
    } else {
      return {
        add_status: false,
        message: res.data.message || 'Stock not available',
      };
    }
  } catch (error) {
    console.log(error)
    return {
      add_status: false,
      message: error?.message || 'Stock not available',
    }
  }
};

export const removeFromCartBackend = async (
  product_id,
  barcode,
  token = null
) => {
  let res = await post(
    '/v2/carts/delete',
    null,
    {
      product_id,
      barcode,
    },
    {
      headers: {
        Authorization: `Bearer ${token || getToken()}`,
      },
    }
  ).catch((err) => {

    return {
      remove_status: false,
      message: err.message || 'Try Again',
    };
  });
  if (res?.status == 200 && res.data?.result == true) {
    return {
      remove_status: true,
      message: res.data.message || 'Removed from cart',
    };
  } else {
    return {
      remove_status: false,
      message: res.data.message || 'Try Again',
    };
  }
};

export let calculationFromCart = (carts) => {
  let subTotal = 0;
  let discount = 0;
  let tax = 0;
  let shipping = 0;
  let total = 0;
  carts.map((cart) => {
    let cartDiscount = 0;
    cartDiscount = parseFloat(cart?.discount);
    subTotal +=
      parseFloat(cart.main_price_discount) * parseFloat(cart.quantity);
    discount += parseInt(cartDiscount) * parseFloat(cart.quantity);
    tax += parseFloat(cart.tax) * parseFloat(cart.quantity);
    shipping += parseFloat(cart.shipping_cost) * parseFloat(cart.quantity);
    total += cart.total * parseFloat(cart.quantity);
  });
  return {
    subTotal,
    discount,
    tax,
    shipping,
    total,
  };
}