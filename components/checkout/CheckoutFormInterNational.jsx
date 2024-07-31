import {
  Formik,
  Form,
  useFormikContext,
  ErrorMessage,
  useFormik,
  connect,
  Field,
} from "formik";
import Router, { useRouter } from "next/router";
import React, { useCallback } from "react";
import * as Yup from "yup";
import { post, tAlert, get, cookie } from "../../helpers/helper.js";
import { cart, checkoutPage, detail } from "../../utils/route.js";
import { makeInteger } from "../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
  clearCart,
  applyCoupon as applyCouponAction,
  clearCoupon,
  membershipOtpSend,
  applyMemberShip,
  backendCart,
  clearMemberShip,
  setPaymentInfo,
  giftCardOtpSend,
  applyGiftCard,
} from "../../store/slice/CartSlice.js";
import { useEffect } from "react";
import { setPaymentTypes } from "../../store/slice/GlobalSetting.js";
import { useState } from "react";
import CartSection from "./CartSection.jsx";
import { getSettingValue } from "../../utils/filters.js";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import BkashComponent from "./BkashComponent.jsx";
import useBkash from "../../hook/useBkash.jsx";
import animationData from "../../public/assets/images/animation_lmyez1bg.json";
import Lottie from "react-lottie";
const CheckoutFormInterNational = ({ carts, getProducts }) => {
  let router = useRouter();
  const [isDisabled, setDisabled] = useState(false);
  const [countryId, setCountryId] = useState(null);
  console.log(carts);
  let auth = useSelector((state) => state?.authSlice?.user);
  let tempId = useSelector((state) => state?.authSlice?.tempId);
  let couponSlice = useSelector((state) => state?.cartSlice?.coupon);
  let businessSlice = useSelector((state) => state?.globalSetting);
  let pages = useSelector((state) => state?.globalSetting.pages);
  let paymentInfoRedux = useSelector((state) => state?.cartSlice?.payment_info);
  let memberSlice = useSelector((state) => state?.cartSlice?.membership);
  let giftCardSlice = useSelector((state) => state?.cartSlice?.gift_card);
  let cartRedux = useSelector((state) => state.cartSlice.cart);

  // useEffect(() => {
  //   get("pages")
  //     .then((res) => {
  //       if (res.data && res.status === 200) {
  //         setPageList(res.data.data);
  //       }
  //     })
  //     .catch((error) => {});
  // }, []);
  let filterPages = (type) => {
    let tempPages = pages.filter((page) => page.title == type);

    if (tempPages.length > 0) {
      return tempPages[0];
    } else {
      return {
        slug: "#",
        id: "#",
      };
    }
  };
  let [successOrderInfo, setSuccessOrderInfo] = useState({
    order_id: null,
    token: null,
    grand_total: null,
    payment_type: null,
  });

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState();
  const [cityList, setCityList] = useState();
  const [thanaList, setThanaList] = useState();
  const [postalList, setPostalList] = useState();
  const [areaList, setAreaList] = useState();

  const [shippingStateList, setShippingStateList] = useState();
  const [shippingCityList, setShippingCityList] = useState();
  const [shippingThanaList, setShippingThanaList] = useState();
  const [shippingPostalList, setShippingPostalList] = useState();
  const [shippingAreaList, setShippingAreaList] = useState();
  const [pickupPointList, setPickupPointList] = useState();
  const [savedAddress, setSavedAddress] = useState(null);
  let [hasDigitalProduct, setHasDigitalProduct] = useState(false);
  const [savedShippingAddress, setSavedShippingAddress] = useState(null);
  let [currentDefaultAddress, setCurrentDefaultAddress] = useState(null);
  console.log('currentDefaultAddress: ', currentDefaultAddress)

  let [sameBilling, setSameBilling] = useState(false);
  let [deliveryCharge, setDeliveryCharge] = useState({
    insideDhaka: [],
    outsideDhaka: [],
    shippingCharge: 0,
  });

  let nameParts = auth?.name?.split(" ");

  let firstName, lastName;
  if (nameParts?.length >= 3) {
    firstName = nameParts[0] + " " + nameParts[1];
    lastName = nameParts[2];
  } else if (nameParts?.length === 2) {
    firstName = nameParts[0];
    lastName = nameParts[1]; // Empty string for last name
  } else if (nameParts?.length === 1) {
    firstName = nameParts[0];
    lastName = ""; // Empty string for last name
  }

  let [orderInfo, setOrderInfo] = useState({
    shipping_type: "home_delivery",
    pickup_points_id: "",

    billing_first_name: auth?.name ? firstName : "",
    billing_last_name: auth?.name ? lastName : "",
    billing_email: auth?.email ? auth?.email : "",
    billing_country: "",
    billing_thana: "",
    billing_district: "",
    billing_postal_code: "",
    billing_phone: auth?.phone ? auth?.phone : "",
    billing_address: "",

    // if pickup point is selected
    shipping_first_name: "",
    shipping_last_name: "",
    shipping_email: "",
    shipping_country: "",
    shipping_district: "",
    shipping_thana: "",
    shipping_postal_code: "",
    shipping_phone: "",
    shipping_address: "",

    payment_type: "",
    privacy_policy: "",
    note: "",
  });

  let [coupon, setCoupon] = useState({
    coupon: "",
    coupon_applied: false,
    coupon_amount: 0,
    free_shipping: false,
  });
  let [memberShipInput, setMemberSHipInput] = useState({
    membership_no: "",
    membership_otp: "",
  });

  let [giftCardInput, setGiftCardInput] = useState({
    gift_card_no: "",
    gift_card_otp: "",
  });

  let inhouseCart = carts.filter((cart) => cart?.name === "Inhouse");
  let pickupCart = carts.filter((cart) => cart?.name === "Pickup");

  let [cartCalculation, setCartCalculation] = useState({
    subTotal: 0,
    discount: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    shippingCharge: 0,
    grandTotal: 0,
    payable: 0,
    gift_wrap_amount: 0,
  });
  let getCartSummary = async () => {
    let { data, status } = await get(cart.CART_SUMMARY).catch((err) => {
      return false;
    });
    if (status === 200) {
      console.log(data);
      const {
        coupon_applied,
        coupon_code,
        discount,
        grand_total,
        grand_total_value,
        loyality_applied,
        shipping_cost,
        sub_total,
        tax
      } = data;
      setCartCalculation({
        subTotal: parseFloat(sub_total),
        discount: parseFloat(discount),
        tax: tax,
        shipping: parseFloat(shipping_cost),
        total: parseFloat(grand_total),
      });
    }
  };
  useEffect(() => {
    let subTotal = 0;
    let shippingCharge = 0;
    let vat = 0;
    let discount = 0;
    let grandTotal = 0;
    let payAble = 0;
    let withDiscountOutTax = 0;

    inhouseCart[0]?.cart_items?.map((cart) => {
      let cartDiscount = 0;
      cartDiscount =
        parseFloat(cart?.discount) +
        parseFloat(cart?.circular_discount) * parseFloat(cart.quantity) +
        parseFloat(cart?.flash_discount) +
        parseFloat(cart?.loyalty_discount);
      subTotal += parseFloat(cart.price) * parseFloat(cart.quantity);
      discount += parseInt(cartDiscount);
      vat += parseFloat(cart.tax) * parseFloat(cart.quantity);

      shippingCharge +=
        parseFloat(cart.shipping_cost) * parseFloat(cart.quantity);
      if (cart?.digital == 1) {
        setHasDigitalProduct(true);
      }
    });
    console.log(subTotal, shippingCharge, vat, discount);
    if (coupon.coupon_applied) {
      discount = coupon.coupon_amount;
      vat = couponSlice?.tax;
    } else if (memberSlice?.membership_applied) {
      discount = memberSlice?.membership_amount;
      vat = memberSlice?.tax;
    } else if (giftCardSlice?.gift_card_applied) {
      // discount = giftCardSlice?.gift_card_amount;
      vat = giftCardSlice?.tax;
    }
    if (
      parseInt(
        getSettingValue(businessSlice?.globalsetting, "free_shipping_status")
      ) == 1 || (parseInt(getSettingValue(businessSlice?.globalsetting, "free_shipping_limit")) != null && parseInt(getSettingValue(businessSlice?.globalsetting, "free_shipping_limit")) > 0 && parseInt(getSettingValue(businessSlice?.globalsetting, "free_shipping_limit")) <= parseFloat(subTotal))
    ) {
      shippingCharge = 0;
    } else {
      shippingCharge = deliveryCharge?.shippingCharge ?? 0;
    }
    if (hasDigitalProduct) {
      shippingCharge = 0;
    }
    console.log(subTotal, shippingCharge, vat, discount);
    grandTotal = subTotal + shippingCharge + vat - discount;
    payAble = grandTotal - giftCardSlice?.gift_card_amount || 0;
    if (grandTotal < 0) {
      grandTotal = 0;
    }
    // setCartCalculation({
    //   ...cartCalculation,
    //   subTotal: subTotal,
    //   shippingCharge: shippingCharge,
    //   discount: discount,
    //   vat: vat,
    //   grandTotal: grandTotal,
    //   payable: payAble,
    // });

    // setCartCalculation({
    //   ...cartCalculation,
    //   subTotal: subTotal,
    //   shippingCharge: shippingCharge,
    //   discount: discount,
    //   vat: vat,
    //   grandTotal: grandTotal,
    // });
    getCartSummary();
  }, [carts, coupon, deliveryCharge, memberSlice, giftCardSlice]);
  let dispatch = useDispatch();
  let checkoutSchema = Yup.object().shape({
    billing_first_name: Yup.string().required("First Name is required"),
    billing_last_name: Yup.string().required("Last Name is required"),
    billing_phone: Yup.string().required("Phone is required"),
    billing_email: Yup.string().required("Email is required"),
    billing_district: Yup.string().required("District is required"),
    billing_postal_code: Yup.string().required("Postal Code is required"),
    billing_address: Yup.string().required("Address is required"),

    shipping_first_name: Yup.string().when("shipping_type", {
      is: (shipping_type) => shipping_type === "home_delivery",
      then: Yup.string().required("First Name is required"),
    }),

    shipping_last_name: Yup.string().when("shipping_type", {
      is: (shipping_type) => shipping_type === "home_delivery",
      then: Yup.string().required("Last Name is required"),
    }),

    shipping_phone: Yup.string().when("shipping_type", {
      is: (shipping_type) => shipping_type === "home_delivery",
      then: Yup.string().required("Phone is required"),
    }),
    shipping_email: Yup.string().when("shipping_type", {
      is: (shipping_type) => shipping_type === "home_delivery",

      then: Yup.string().required("Email is required"),
    }),
    shipping_district: Yup.string().when("shipping_type", {
      is: (shipping_type) => shipping_type === "home_delivery",
      then: Yup.string().required("District is required"),
    }),
    shipping_thana: Yup.string().when("shipping_type", {
      is: (shipping_type) => shipping_type === "home_delivery",
      then: Yup.string().required("Thana is required"),
    }),
    shipping_postal_code: Yup.string().when("shipping_type", {
      is: (shipping_type) => shipping_type === "home_delivery",
      then: Yup.string().required("Postal Code is required"),
    }),
    shipping_address: Yup.string().when("shipping_type", {
      is: (shipping_type) => shipping_type === "home_delivery",
      then: Yup.string().required("Address is required"),
    }),
    pickup_points_id: Yup.string().when("shipping_type", {
      is: (shipping_type) => shipping_type === "pickup_point",
      then: Yup.string().required("Pickup Point is required"),
    }),

    payment_type: Yup.string().required("Please Select Payment Method First."),
    privacy_policy: Yup.array().required(
      "Accept the Terms & Conditions, Return & Refund Policy and Privacy Policy of www.redorigin.com.bd"
    ),
    note: Yup.string().notRequired(),
    gift_card_time: Yup.string().notRequired(),
    gift_wrap: Yup.array().notRequired(),
  });
  let fetchCart = async () => {
    if (carts && carts?.length >= 0) {
      dispatch(
        backendCart({
          carts: carts,
        })
      );
    }
  };
  const applyCoupon = async (e) => {
    if (coupon.coupon === "") {
      tAlert("Please Enter a Coupon", "error");
      return;
    }
    let result = await post(checkoutPage.APPLY_COUPON, "", {
      user_id: auth.id,
      coupon_code: coupon.coupon,
    }).catch((err) => {
      if (err.response.status === 401) {
        tAlert("Please Login", "error");
        router.push("/login");
      } else {
        tAlert("please try Again", "error");
      }
      return false;
    });
    if (result.status === 200 && result?.data?.result === true) {
      tAlert("Coupon Applied", "success");
      setCoupon({
        ...coupon,
        coupon_applied: true,
        coupon_amount: result?.data?.discount,
        tax: result?.data?.tax,
        free_shipping: result?.data?.free_shipping,
      });
      dispatch(
        applyCouponAction({
          coupon_applied: true,
          coupon_amount: result?.data?.discount,
          coupon: coupon.coupon,
          tax: result?.data?.tax,
          free_shipping: result?.data?.free_shipping,
        })
      );
    } else {
      tAlert(result?.data?.message || "Coupon Not Applied", "error");
    }
  };
  const removeCoupon = async (e) => {
    let result = await post(checkoutPage.REMOVE_COUPON, "", {
      user_id: auth?.id,
    }).catch((err) => {
      if (err.response.status === 401) {
        tAlert("Please Login", "error");
        Router.push("/login");
      } else {
        tAlert("please try Again", "error");
      }
      return false;
    });
    if (result.status === 200 && result?.data?.result === true) {
      tAlert("Coupon Removed", "success");
      setCoupon({
        coupon: "",
        coupon_applied: false,
        coupon_amount: 0,
        tax: 0,
        free_shipping: false,
      });
      dispatch(
        applyCouponAction({
          coupon: "",
          coupon_applied: false,
          coupon_amount: 0,
          tax: 0,
        })
      );
    } else {
      tAlert("Coupon not Removed", "error");
    }
  };
  let loyaltyMember = async () => {
    if (memberShipInput.membership_no === "") {
      tAlert("Please Enter a Membership No", "error");
      return;
    }
    let { data, status } = await get(
      "/v3/loyalitymember?loyality_info=" + memberShipInput.membership_no
    ).catch((err) => {
      if (err.response.status === 401) {
        tAlert("Please Login", "error");
        router.push("/login");
      } else {
        tAlert("please try Again", "error");
      }
      return false;
    });
    if (status === 200) {
      if (data?.result === true) {
        tAlert("Member Found", "success");
        dispatch(
          membershipOtpSend({
            send_status: true,
          })
        );
      } else {
        tAlert(data?.message || "Member Not Found", "error");
      }
    } else {
      tAlert(data?.message || "Member Not Found", "error");
    }
  };

  let checkLoyaltyOtp = async () => {
    let membershipCheck = await post("/v2/check-loyality-otp", null, {
      otp: memberShipInput.membership_otp,
      loyality_info: memberShipInput.membership_no,
    }).catch((err) => {
      if (err.response.status === 401) {
        tAlert("Please Login", "error");
        router.push("/login");
      } else if (err.response.status === 400) {
        tAlert("Wrong OTP", "error");
      } else {
        tAlert("OTP Expired", "error");
      }
      dispatch(
        applyMemberShip({
          membership_no: memberShipInput.membership_no,
          membership_applied: false,
          membership_amount: 0,
          tax: 0,
        })
      );
      return false;
    });
    if (membershipCheck && membershipCheck.status === 200) {
      //console.log(JSON.stringify(membershipCheck));
      if (membershipCheck.data.result === true) {
        tAlert("OTP Verified", "success");
        dispatch(
          applyMemberShip({
            membership_no: memberShipInput.membership_no,
            membership_applied: true,
            membership_amount: parseInt(membershipCheck?.data?.discount_amount),
            tax: parseInt(membershipCheck?.data?.tax),
          })
        );
        setCartCalculation({
          ...cartCalculation,
          vat: parseInt(membershipCheck?.data?.tax),
        });
      } else {
        tAlert("OTP Not Verified", "error");
        dispatch(
          applyMemberShip({
            membership_no: memberShipInput.membership_no,
            membership_applied: false,
            membership_amount: 0,
            tax: 0,
          })
        );
      }
    }
  };

  let getPaymentTypes = async () => {
    let { data, status } = await get(checkoutPage.PAYMENT_TYPES).catch(
      (err) => {
        return false;
      }
    );
    if (status === 200) {
      dispatch(
        setPaymentTypes({
          payment_types: data,
        })
      );
    } else {
      tAlert("Something went wrong");
    }
  };

  useEffect(() => {

    if (countryList.length > 0) {
      const getBDCountry = countryList.filter((item) => item.name == "Bangladesh")
      fetchDistrictList(getBDCountry[0].id)
      setCountryId(getBDCountry[0].id)
    }
  }, [countryList]);

  let sameAsBillingAddress = async (e, values, setFieldValue) => {
    if (
      values.billing_first_name === "" ||
      values.billing_last_name === "" ||
      values.billing_email === "" ||
      values.billing_district === "" ||
      values.billing_postal_code === "" ||
      values.billing_phone === "" ||
      values.billing_address === "" ||
      countryId == null ||
      values.billing_thana === ""
    ) {
      tAlert("Please Fill Billing Address First", "error");
      return;
    }
    if (e.target.checked) {
      setFieldValue("shipping_first_name", values.billing_first_name);
      setFieldValue("shipping_last_name", values.billing_last_name);
      setFieldValue("shipping_email", values.billing_email);
      setFieldValue("shipping_country", countryId);
      setFieldValue("shipping_phone", values.billing_phone);
      setFieldValue("shipping_address", values.billing_address);
      setFieldValue("shipping_postal_code", values.billing_postal_code);

      //await shippingChargeByArea(values.billing_thana, true)
      await fetchDistrictList(countryId, true);
      setFieldValue("shipping_district", values.billing_district);
      await fetchThanaList(
        values?.billing_district,
        true,
        countryId,
        values.billing_thana
      );
      setFieldValue("shipping_thana", values.billing_thana);

      // return false;

      // fetchPostalCodeList(values.billing_district, values.billing_thana, true);
      // fetchAreaList(values?.billing_postal_code, true);
      // setFieldValue("shipping_area", values.billing_area);
      setSameBilling(true);

      // get("get-shipping-charge").then((res) => {
      //   setCartCalculation((state) => {
      //     return {
      //       ...state,
      //       shippingCharge: res.data.shipping_charge,
      //       grandTotal: state.grandTotal + res.data.shipping_charge,
      //     };
      //   });
      // });
    } else {
      setFieldValue("shipping_first_name", "");
      setFieldValue("shipping_last_name", "");
      setFieldValue("shipping_email", "");
      setFieldValue("shipping_country", "");
      setFieldValue("shipping_phone", "");
      setFieldValue("shipping_district", "");
      setFieldValue("shipping_thana", "");
      setFieldValue("shipping_postal_code", "");
      setFieldValue("shipping_address", "");
      setFieldValue("shipping_postal_code", "");
      // setFieldValue("shipping_area", "");

      setDeliveryCharge({
        ...deliveryCharge,
        shippingCharge: 0,
      });
      setSameBilling(false);
    }
  };
  function removeApostrophe(value) {
    let e = value;
    e = e.replace(/'/g, "");
    e = e.replace(/"/g, "");
    return e;
  }
  let fetchShippingCharge = async () => {
    let { data, status } = await get(checkoutPage.DELIVERY_CHARGE).catch(
      (err) => {
        return false;
      }
    );
    console.log(data);
    if (status === 200) {
      setDeliveryCharge({
        ...deliveryCharge,
        insideDhaka: data.insideDhaka,
        outsideDhaka: data.outsideDhaka,
      });
    }
  };
  let [deliveryExpressCharge, setDeliveryExpressCharge] = useState(0);
  let expressDelivery = async () => {
    let { data, status } = await get(
      checkoutPage.ShippingChargeExpressAndRegular
    ).catch((err) => {
      return false;
    });
    console.log(data);
    if (status === 200) {
      console.log(data);
      setDeliveryExpressCharge({
        ...deliveryExpressCharge,
        ...data
      });
    }
  };

  let onLinePayment = async (args) => {
    let { data, status } = await post("/v2/pay", "", args).catch((res) => {
      throw new Error("Something went wrong");
    });
    if (status === 200) {
      return data;
    }
  };

  const createOrder = async (data) => {
    let result = await post(checkoutPage.ORDER_CREATE, "", {
      ...data,
      loyality_info: memberSlice?.membership_no,
      gift_wrap:
        data?.gift_wrap?.length > 0 && data?.gift_wrap[0] == "yes"
          ? true
          : false,
    }).catch((err) => {
      tAlert("please try Again", "error");
    });
    console.log(result);
    console.log(result?.data?.orderArray?.code)
    console.log(result?.data)
    if (result.status === 200 && result?.data) {
      dispatch(clearCart());
      dispatch(clearMemberShip());
      // //console.log(result?.data);
      //setSuccessOrderInfo(result?.data);
      // try {
      if (data.payment_type != "cash_on_delivery") {
        let paymentData = await onLinePayment({
          payment_type: "cart_payment",
          combined_order_id: result?.data?.combined_order_id,
          amount: result?.data?.grand_total,
          payment_option: data.payment_type,
          platform: "web",
          url:
            window.location.origin +
            "/thankyou?order_code=" +
            result?.data?.order_id,
        });
        setSuccessOrderInfo({
          order_id: result?.data?.order_id,
          token: paymentData?.token,
          grand_total: result?.data?.grand_total,
          payment_type: data.payment_type,
        });

        // deleteCookie("payment_info");
        // setCookie("payment_info", {
        //   payment_type: data.payment_type,
        //   token: paymentData?.token,
        //   amount: result?.data?.grand_total,
        // });
        // dispatch(
        //   setPaymentInfo({
        //     payment_info: {
        //       payment_type: data.payment_type,
        //       token: paymentData?.token,
        //       amount: result?.data?.grand_total,
        //     },
        //   })
        // );
        return {
          status: true,
          data: result?.data,
          paymentData: paymentData,
        };
      } else {
        router.replace("/thankyou?order_code=" + result?.data?.order_id);
      }
      // } catch (error) {
      //   router.push("/thankyou?order_code=" + result?.data?.order_id);
      // }
      // tAlert("Order Created", "success");
      // router.push("/thankyou?order_code=" + result?.data?.order_id);
    } else if (result.status === 200 && !result?.data) {
      throw new Error(result?.data?.message || "Something went wrong");
    } else {
      dispatch(clearCart());
      dispatch(clearMemberShip());
      tAlert("Something went wrong", "error");
      return {
        status: false,
        data: null,
        paymentData: null,
      };
    }
  };
  // ! address book
  const fetchDistrictList = (country, shipping = false) => {
    get(checkoutPage.STATES + "/" + country)
      .then((res) => {
        if (shipping) {
          setShippingStateList(res?.data?.data);
          return false;
        }
        setStateList(res?.data?.data);
        setThanaList();
        setPostalList();
        setAreaList();
        //fetchShippingCharge();
      })
      .catch((error) => { });
  };
  const fetchGiftProduct = async (isChecked) => {
    let gift_wrap_style_code = getSettingValue(
      businessSlice?.globalsetting,
      "gift_wrap_style_code"
    );
    if (gift_wrap_style_code == null) {
      return false;
    }
    let { data, status } = await get(
      detail.PRODUCT_BY_SLUG + "/" + gift_wrap_style_code
    );
    console.log(data);
    if (status === 200) {
      if (isChecked) {
        setCartCalculation({
          ...cartCalculation,
          gift_wrap_amount: data?.data[0]?.stroked_price,
        });
      } else {
        setCartCalculation({
          ...cartCalculation,
          gift_wrap_amount: 0,
        });
      }
    }
  };

  const shippingChargeByArea = (area, shipping = false) => {
    if (shipping) {
      if (shippingThanaList?.length > 0) {
        const selectedAreaCost = shippingThanaList?.filter((item) => {
          if (item.id == area) {
            return item;
          }
        });
        if (selectedAreaCost != null && selectedAreaCost?.length > 0) {
          setDeliveryCharge({
            ...deliveryCharge,
            shippingCharge: selectedAreaCost[0]?.cost,
          });
        }
      } else {
        tAlert('Select District Fist', 'warning')
      }
    }
  }
  const fetchThanaList = (city, shipping = false, countryId = null, cityId = null, initDefault = null) => {
    get(checkoutPage.CITIES + "?state_id=" + city)
      .then(async (res) => {
        let fetchThanaList = res?.data?.data;

        if (cityId != null) {
          if (initDefault) {
            setShippingThanaList(fetchThanaList);
            setThanaList(fetchThanaList);
          }
          if (cityId != null) {
            const selectedAreaCost = fetchThanaList?.filter((item) => {
              if (item.id == cityId) {
                return item;
              }
            });
            // console.log("selectedAreaCost", shippingThanaList)
            console.log("selectedAreaCost", selectedAreaCost)
            if (selectedAreaCost != null && selectedAreaCost?.length > 0) {
              setDeliveryCharge({
                ...deliveryCharge,
                shippingCharge: selectedAreaCost[0]?.cost,
              });
            }
          }
        }

        if (shipping) {
          // shipping charge
          setShippingThanaList(fetchThanaList);
          //! shipping charge
          let shippingPlaceName = [];
          if (shippingStateList) {
            shippingPlaceName = shippingStateList?.filter((item) => {
              if (item.id == city) {
                return item;
              }
            });
          } else {
            let { data: districtList } = await get(
              checkoutPage.STATES + "/" + countryId
            );
            shippingPlaceName = districtList?.data?.filter((item) => {
              if (item.id == city) {
                return item;
              }
            });
          }

          let default_inside_dhaka = parseFloat(
            getSettingValue(
              businessSlice?.globalsetting,
              "default_inside_dhaka"
            )
          );
          let default_outside_dhaka = parseFloat(
            getSettingValue(
              businessSlice?.globalsetting,
              "default_outside_dhaka"
            )
          );


          console.log("selectedAreaCost", fetchThanaList)
          console.log("selectedAreaCost", cityId)

          // if (cityId != null){
          // 	const selectedAreaCost = fetchThanaList?.filter((item) => {
          // 		if (item.id == cityId) {
          // 			return item;
          // 		}
          // 	});
          // 	// console.log("selectedAreaCost", shippingThanaList)
          // 	 console.log("selectedAreaCost", selectedAreaCost)
          // 	if (selectedAreaCost !=null && selectedAreaCost?.length > 0){
          // 		setDeliveryCharge({
          // 			...deliveryCharge,
          // 			shippingCharge: selectedAreaCost[0]?.cost,
          // 		});
          // 	}
          // }

          // let shippingChargeTemp = null;
          // let totalCartItem = 0;
          // let totalCartItemWeight = 0;
          //
          // cartRedux?.forEach((item) => {
          // 	totalCartItem += item?.quantity;
          // 	totalCartItemWeight += item?.weight;
          // });
          //
          // let {
          // 	unit_wise_shipping_cost_active,
          // 	unit_wise_shipping_cost_price,
          // 	shipping_cost,
          // } = fetchThanaList?.[0]?.state;
          //
          // if (unit_wise_shipping_cost_active == 1 && unit_wise_shipping_cost_active != null){
          // 	// per kg price 50
          // 	// per gram will 50 / 100 = 0.05
          //
          // 	let perGm = unit_wise_shipping_cost_price / 100;
          // 	shippingChargeTemp = perGm * totalCartItemWeight;
          // }
          // else {
          // 	shippingChargeTemp = shipping_cost;
          // }

          // if (
          // 	shippingPlaceName?.length > 0 &&
          // 	shippingPlaceName[0]?.name == "Dhaka"
          // ) {
          // 	for (const [key, value] of Object.entries(
          // 		deliveryExpressCharge?.shipping_charge
          // 	)) {
          // 		if (parseInt(key) == parseInt(totalCartItem)) {
          // 			shippingChargeTemp = parseFloat(
          // 				value?.price_inside_dhaka
          // 			);
          // 			break;
          // 		}
          // 	}
          // 	if (shippingChargeTemp == null) {
          // 		shippingChargeTemp = default_inside_dhaka;
          // 	}
          // } else {
          // 	for (const [key, value] of Object.entries(
          // 		deliveryExpressCharge?.shipping_charge
          // 	)) {
          // 		if (parseInt(key) === parseInt(totalCartItem)) {
          // 			shippingChargeTemp = parseFloat(
          // 				value?.price_outside_dhaka
          // 			);
          // 			break;
          // 		}
          // 	}
          // 	console.log(shippingChargeTemp);
          // 	if (shippingChargeTemp == null) {
          // 		shippingChargeTemp = default_outside_dhaka;
          // 	}
          // }

          // setDeliveryCharge({
          // 	...deliveryCharge,
          // 	shippingCharge: shippingChargeTemp,
          // });

          //! shipping charge
          // alert(shippingChargeTemp)
          return false;
        }
        setThanaList(fetchThanaList);
        setPostalList();
        setAreaList();
      })
      .catch((error) => { });
  };
  console.log(deliveryCharge)
  let [shippingThanaId, setShippingThanaId] = useState();

  // const fetchPostalCodeList = (singlecity, singlethana, shipping = false) => {
  //   get("postal-code-list/" + singlecity + "/" + singlethana)
  //     .then((res) => {
  //       let data = res.data.postcode.map((val) => {
  //         return val.name;
  //       });
  //       if (shipping) {
  //         setShippingPostalList(data);
  //         return false;
  //       }
  //       setPostalList(data);
  //       setAreaList();
  //     })
  //     .catch((error) => {});
  // };
  const fetchPickUpPoint = async () => {
    let { data, status } = await get(checkoutPage.PICKUP_POINT).catch(
      (error) => { }
    );
    if (status === 200) {
      setPickupPointList(data?.data || []);
    }
  };
  const fetchAreaList = (code, shipping = false) => {
    get("area-list/" + code)
      .then((res) => {
        let data = res.data.area.map((val) => {
          return val.name;
        });
        if (shipping) {
          setShippingAreaList(data);
          return false;
        }
        setAreaList(data);
      })
      .catch((error) => { });
  };
  // ! address book

  const fetchCountry = async () => {
    let { data, status } = await get(checkoutPage.COUNTRIES).catch(
      (error) => { }
    );
    if (status === 200) {
      setCountryList(data?.data || []);
    }
  };

  useEffect(() => {
    if (!auth) {
      cookie("checkout_redirect", true, "set");
      router.push("/login");
    }
    console.log(carts);
    if (carts?.length <= 0 || !carts) {
      dispatch(clearCart());
      router.push("/shop");
    }
    fetchCountry();
    setCoupon({
      coupon_applied: couponSlice.coupon_applied,
      coupon_amount: couponSlice.coupon_amount,
      coupon: couponSlice.coupon,
      free_shipping: couponSlice.free_shipping,
    });
    fetchPickUpPoint();
    getPaymentTypes();
    fetchCart();
    fetchShippingCharge();

    expressDelivery();

  }, []);
  const giftCardCheck = async (e) => {
    if (giftCardInput.gift_card_no === "") {
      tAlert("Please Enter a Gift Card", "error");
      return;
    }

    let { data, status } = await get(
      "/v2/giftVoucher?voucher_no=" + giftCardInput.gift_card_no
    ).catch((err) => {
      if (err.response.status === 401) {
        tAlert("Please Login", "error");
        router.push("/login");
      } else {
        tAlert("please try Again", "error");
      }
      return false;
    });
    if (status === 200) {
      if (data?.result === true) {
        tAlert("Card Found", "success");
        dispatch(
          giftCardOtpSend({
            send_status: true,
          })
        );
      } else {
        tAlert(data?.message || "Gift Card Not Found", "error");
      }
    } else {
      tAlert(data?.message || "Gift Card Not Found", "error");
    }
  };

  let giftCardOtp = async () => {
    let giftCheck = await post("/v2/check-voucher-otp", null, {
      otp: giftCardInput.gift_card_otp,
      voucher_no: giftCardInput.gift_card_no,
    }).catch((err) => {
      if (err.response.status === 401) {
        tAlert("Please Login", "error");
        router.push("/login");
      } else if (err.response.status === 400) {
        tAlert("Wrong OTP", "error");
      } else {
        tAlert("OTP Expired", "error");
      }
      dispatch(
        applyGiftCard({
          gift_card_no: giftCardInput.gift_card_no,
          gift_card_applied: false,
          gift_card_amount: 0,
          tax: 0,
        })
      );
      return false;
    });
    console.log(giftCheck);
    if (giftCheck && giftCheck.status === 200) {
      //console.log(JSON.stringify(giftCheck));
      if (giftCheck.data.result === true) {
        console.log(giftCheck);
        tAlert("OTP Verified", "success");
        dispatch(
          applyGiftCard({
            gift_card_no: giftCardInput.gift_card_no,
            gift_card_applied: true,
            gift_card_amount: parseInt(giftCheck?.data?.amount),
            tax: 0,
          })
        );
        setCartCalculation({
          ...cartCalculation,
          vat: parseInt(giftCheck?.data?.tax || 0),
        });
      } else {
        tAlert("OTP Not Verified", "error");
        dispatch(
          applyGiftCard({
            gift_card_no: giftCardInput.gift_card_no,
            gift_card_applied: false,
            gift_card_amount: 0,
            tax: 0,
          })
        );
      }
    }
  };
  const [isChecked, setIsChecked] = useState(false);
  const handleChange = () => {
    setIsChecked(!isChecked);
  };
  console.log('cart_calculation', cartCalculation);


  const [showShipping, setShowShipping] = useState(false)

  const handleCheckboxChange = () => {
    setShowShipping(prevShowShipping => !prevShowShipping);
  };

  console.log('showShipping: ', showShipping)

  return (
    <>
      <button
        id="bKash_button"
        style={{
          display: "none",
        }}
      >
        pay with bkash
      </button>
      <Formik
        enableReinitialize={true}
        initialValues={orderInfo}
        validationSchema={checkoutSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setDisabled(true);
          if (values.privacy_policy && values.privacy_policy?.length <= 0) {
            tAlert("Please accept privacy policy", "error");
            setDisabled(false);
            return false;
          } else {
            values.shipping_address = removeApostrophe(values.shipping_address);
            values.billing_address = removeApostrophe(values.billing_address);
            values.note = removeApostrophe(values.note);

            if (auth?.name?.length > 0) {
              values.billing_first_name = auth?.name;
            }
            if (auth?.email?.length > 0) {
              values.billing_email = auth?.email;
            }
            if (auth?.phone?.length > 0) {
              values.billing_phone = auth?.phone;
            }

            let { status, data, paymentData } = await createOrder(values).catch(
              (err) => {
                tAlert(err.message || "please try Again", "error");
                setDisabled(false);
              }
            );
            if (values.payment_type == "bkash") {
              window.location.href = paymentData?.url;
            } else if (values.payment_type == "nagad") {
              window.location.href = paymentData?.url;
            } else if (values.payment_type == "sslCommerz") {
              window.location.href = paymentData?.url;
            }
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => (
          <Form id="" className="progress-form" action="" lang="en" novalidate>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div className="common-fieldset-main">
                  <fieldset className="common-fieldset">
                    <legend className="rounded-0">Billing address</legend>

                    <div className="row mb-3">
                      <div className="col-4">
                        <label className="form-check-label2 " for="">
                          Select delivery type
                        </label>
                      </div>
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="home_delivery"
                            name="shipping_type"
                            id="pickupStoreChNo"
                            checked={
                              values.shipping_type === "home_delivery" && true
                            }
                            onChange={(e) => {
                              // setOrderInfo({
                              //   ...orderInfo,
                              //   shipping_type: e.target.value,
                              // });
                              setFieldValue("shipping_type", e.target.value);
                            }}
                          />
                          <label
                            className="form-check-label"
                            for="pickupStoreChNo"
                          >
                            Home delivery
                          </label>

                          {touched.shipping_type || errors.shipping_type ? (
                            <p className="text-danger">
                              {errors.shipping_type}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      {getSettingValue(
                        businessSlice?.globalsetting,
                        "pickup_point"
                      ) == 1 && (
                          <div className="col-4">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                value="pickup_point"
                                name="shipping_type"
                                id="pickupStoreChYes"
                                checked={
                                  values.shipping_type == "pickup_point" && true
                                }
                                onChange={(e) => {
                                  // setOrderInfo({
                                  //   ...orderInfo,
                                  //   shipping_type: e.target.value,
                                  // });
                                  setFieldValue("shipping_type", e.target.value);
                                }}
                              />
                              <label
                                className="form-check-label"
                                for="pickupStoreChYes"
                              >
                                Pickup from store
                              </label>
                              {touched.shipping_type || errors.shipping_type ? (
                                <p className="text-danger">
                                  {errors.shipping_type}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* same as default address  */}
                    <div className="row ">
                      {values.shipping_type === "home_delivery" && (
                        <>
                          {" "}
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <label className="form-check-label2 mb-3" for="">
                              Select from saved address or Enter Your address
                            </label>
                          </div>
                          {auth ? (
                            auth?.default_address?.map((item, key) => {
                              if (parseInt(item?.set_default) == 1) {
                                console.log('address: ', item?.set_default)
                                setSavedAddress(key);
                              }
                              return (
                                <div
                                  onClick={async () => {
                                    // if (currentDefaultAddress) {
                                    //   setCurrentDefaultAddress();
                                    // } else {
                                    //   setCurrentDefaultAddress(item.id);
                                    // }

                                    let address = auth?.default_address.filter(
                                      (addr) => item.id === addr.id
                                    );
                                    setSavedAddress(key);

                                    setFieldValue(
                                      "billing_first_name",
                                      auth?.name ? firstName : ""
                                    );
                                    setFieldValue(
                                      "billing_last_name",
                                      auth?.name ? lastName : ""
                                    );
                                    setFieldValue(
                                      "billing_email",
                                      address[0].email || auth.email
                                    );
                                    setFieldValue(
                                      "billing_country",
                                      address[0].country_id
                                    );
                                    setFieldValue(
                                      "billing_phone",
                                      address[0].phone || auth.phone
                                    );
                                    setFieldValue(
                                      "billing_postal_code",
                                      address[0].postal_code
                                    );
                                    setFieldValue(
                                      "billing_address",
                                      address[0].address
                                    );
                                    await fetchDistrictList(
                                      address[0].country_id
                                    );
                                    setFieldValue(
                                      "billing_district",
                                      address[0].state_id
                                    );
                                    await fetchThanaList(address[0].state_id);
                                    setFieldValue(
                                      "billing_thana",
                                      address[0].city_id
                                    );
                                  }}
                                  className="col-xs-12 col-sm-12 col-md-12 col-lg-6"
                                >
                                  <a
                                    href="javascript:void(0)"
                                    className={
                                      savedAddress === key
                                        ? "userAddress selected"
                                        : "userAddress"
                                    }
                                    useraddressattributeid="18"
                                  >
                                    <label>
                                      <input
                                        type="radio"
                                        name="billing"
                                        className="form-check-input"
                                        value={item?.id} />
                                      <div
                                        className="address-books"
                                        key={item.id}
                                      >
                                        <address>
                                          <span className="name19">
                                            {auth?.name}
                                          </span>
                                          <br />
                                          District:{" "}
                                          <span className="district">
                                            {item?.state_name}
                                          </span>
                                          <br />
                                          Email:{" "}
                                          <span className="">{item?.email}</span>
                                          <br />
                                          Phn No:{" "}
                                          <span className="mobile">
                                            {item?.phone || auth?.phone}
                                          </span>
                                          <br />
                                          Postcode:{" "}
                                          <span className="postcode">
                                            {item?.postal_code}
                                          </span>
                                          <br />
                                          Address :{" "}
                                          <span className="address">
                                            {item?.address}
                                          </span>
                                        </address>
                                      </div>
                                    </label>
                                  </a>
                                </div>
                              );
                            })
                          ) : (
                            <h1>No Default Address Selected</h1>
                          )}
                        </>
                      )}
                      {/* {values.shipping_type === "pickup_point" && (
                        <>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={handleChange}
                            name="pickup_points_id"
                          >
                            <option selected>Select Store</option>
                            {pickupPointList?.map((item) => {
                              return (
                                <option value={item?.id}>
                                  {item?.name || item?.address}
                                </option>
                              );
                            })}
                          </select>
                          {touched.pickup_points_id ||
                          errors.pickup_points_id ? (
                            <h5 className="text-danger"></h5>
                          ) : null}
                        </>
                      )} */}
                    </div>
                    {/*! same as billing address  */}
                    <div className="row">
                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group">
                          <label for="first-name" className="form-label">
                            First name
                            <span
                              data-required="true"
                              aria-hidden="true"
                            ></span>
                          </label>
                          <input
                            id="first-name"
                            className="form-control"
                            type="text"
                            name="billing_first_name"
                            onChange={handleChange}
                            value={values.billing_first_name}
                            placeholder="First name"
                          />
                          {touched.billing_first_name ||
                            errors.billing_first_name ? (
                            <p className="text-danger">
                              {errors.billing_first_name}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group">
                          <label for="last-name" className="form-label">
                            Last name
                          </label>
                          <input
                            id="last-name"
                            className="form-control"
                            type="text"
                            name="billing_last_name"
                            onChange={handleChange}
                            value={values.billing_last_name}
                          />
                          {touched.billing_last_name ||
                            errors.billing_last_name ? (
                            <p className="text-danger">
                              {errors.billing_last_name}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group">
                          <label for="phone-number" className="form-label">
                            Phone number
                            <span
                              data-required="true"
                              aria-hidden="true"
                            ></span>
                          </label>
                          <input
                            id="phone-number"
                            className="form-control"
                            type="text"
                            name="billing_phone"
                            onChange={handleChange}
                            value={values.billing_phone}
                            placeholder="Phone Number"
                          />
                          {errors.billing_phone || touched.billing_phone ? (
                            <p className="text-danger">
                              {errors.billing_phone}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group">
                          <label for="email-address" className="form-label">
                            Email address
                            <span
                              data-required="true"
                              aria-hidden="true"
                            ></span>
                          </label>
                          <input
                            id="email-address"
                            className="form-control"
                            type="email"
                            name="billing_email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.billing_email}
                            autocomplete="email"
                            inputmode="email"
                            placeholder="E-mail Address"
                          />
                          {touched.billing_email || errors.billing_email ? (
                            <p className="text-danger">
                              {errors.billing_email}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group">
                          <label for="address-state" className="form-label">
                            Country
                            <span
                              data-required="true"
                              aria-hidden="true"
                            ></span>
                          </label>
                          <select
                            id="address-state"
                            name="billing_country"
                            onBlur={handleBlur}
                            value={countryId ?? values.billing_country}
                            autocomplete="billing_country address-level1"
                            required
                            className="form-control"
                          >

                            {countryList != undefined &&
                              countryList.map((val) => {
                                return (
                                  <option value={val?.id}>{val?.name}</option>
                                );
                              })}
                          </select>
                          {touched.billing_country || errors.billing_country ? (
                            <p className="text-danger">
                              {errors.billing_country}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group">
                          <label for="address-state" className="form-label">
                            District
                            <span
                              data-required="true"
                              aria-hidden="true"
                            ></span>
                          </label>
                          <select
                            id="address-state"
                            name="billing_district"
                            onChange={(e) => {
                              setFieldValue("billing_district", e.target.value);
                              setFieldValue("billing_country", countryId);
                              fetchThanaList(e.target.value);
                            }}
                            onBlur={handleBlur}
                            value={values.billing_district}
                            autocomplete="shipping address-level1"
                            required
                            className="form-control"
                          >
                            <option value="" disabled selected>
                              Please select
                            </option>
                            {stateList != undefined &&
                              stateList.map((val) => {
                                return (
                                  <option value={val?.id}>{val?.name}</option>
                                );
                              })}
                          </select>
                          {touched.billing_district ||
                            errors.billing_district ? (
                            <p className="text-danger">
                              {errors.billing_district}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group">
                          <label htmlFor="address-state" className="form-label">
                            Area
                            <span
                              data-required="true"
                              aria-hidden="true"
                            ></span>
                          </label>
                          <select
                            id="address-state"
                            name="billing_thana"
                            autoComplete="shipping address-level1"
                            required=""
                            className="form-control"
                            onChange={handleChange}
                            value={values.billing_thana}
                          >
                            <option value="" disabled="" selected="">
                              Please select
                            </option>
                            {thanaList != undefined &&
                              thanaList.map((val) => {
                                return (
                                  <option value={val?.id}>{val?.name}</option>
                                );
                              })}
                          </select>
                          {touched.billing_thana || errors.billing_thana ? (
                            <p className="text-danger">
                              {errors.billing_thana}
                            </p>
                          ) : null}
                          {errors != undefined && (
                            <div className="text-danger">{errors?.thana}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group">
                          <label htmlFor="address-state" className="form-label">
                            Postal Code
                            <span
                              data-required="true"
                              aria-hidden="true"
                            ></span>
                          </label>

                          <input
                            id="email-address"
                            className="form-control"
                            type="text"
                            name="billing_postal_code"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.billing_postal_code}
                            autocomplete="email"
                            placeholder="Postal Code"
                          />

                          {touched.billing_postal_code ||
                            errors.billing_postal_code ? (
                            <p className="text-danger">
                              {errors.billing_postal_code}
                            </p>
                          ) : null}
                          {errors != undefined && (
                            <div className="text-danger">{errors?.postal}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="form-group mb-0">
                          <label for="address" className="form-label">
                            Address
                            <span
                              data-required="true"
                              aria-hidden="true"
                            ></span>
                          </label>

                          <textarea
                            className="form-control"
                            id="address"
                            name="billing_address"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.billing_address ?? ""}
                            autocomplete="shipping address-line1"
                            required
                            style={{ height: "100px" }}
                            placeholder="Address Details"
                            defaultValue={""}
                          ></textarea>
                          {touched.billing_address || errors.billing_address ? (
                            <p className="text-danger">
                              {errors.billing_address}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/*! same as billing address  */}
                    {values.shipping_type === "home_delivery" && (
                      <>
                        <div className="row my-3">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <label className="form__choice-wrapper">
                              <input
                                id=""
                                type="checkbox"
                                className="me-2 form-check-input"
                                name=""
                                value={values.sameBilling}
                                onClick={() =>
                                  sameAsBillingAddress(
                                    event,
                                    values,
                                    setFieldValue
                                  )
                                }
                                checked={showShipping}
                                onChange={handleCheckboxChange}
                              />
                              <span>Same as billing address</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    {/* same as default address  */}
                    {
                      !showShipping && <div className="row ">
                        {values.shipping_type === "home_delivery" && (
                          <>
                            {" "}
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                              <label className="form-check-label2 mb-3" for="">
                                Select from saved shipping address or Enter Your shipping address
                              </label>
                            </div>
                            {auth ? (
                              auth?.default_address?.map((item, key) => {
                                if (parseInt(item?.set_default) == 1) {
                                  setSavedShippingAddress(key);
                                }
                                return (
                                  <div
                                    onClick={async () => {
                                      if (currentDefaultAddress) {
                                        setCurrentDefaultAddress();
                                      } else {
                                        setCurrentDefaultAddress(item.id);
                                      }
                                      let address = auth?.default_address.filter(
                                        (addr) => item.id === addr.id
                                      );
                                      setSavedShippingAddress(key);

                                      setFieldValue(
                                        "shipping_first_name",
                                        auth?.name ? firstName : ""
                                      );
                                      setFieldValue(
                                        "shipping_last_name",
                                        auth?.name ? lastName : ""
                                      );
                                      setFieldValue(
                                        "shipping_email",
                                        address[0].email || auth.email
                                      );
                                      setFieldValue(
                                        "shipping_country",
                                        address[0].country_id
                                      );
                                      setFieldValue(
                                        "shipping_phone",
                                        address[0].phone || auth.phone
                                      );
                                      setFieldValue(
                                        "shipping_postal_code",
                                        address[0].postal_code
                                      );
                                      setFieldValue(
                                        "shipping_address",
                                        address[0].address
                                      );
                                      await fetchDistrictList(
                                        address[0].country_id,
                                        true
                                      );
                                      setFieldValue(
                                        "shipping_district",
                                        address[0].state_id
                                      );

                                      await fetchThanaList(
                                        address[0].state_id,
                                        true,
                                        address[0].country_id,
                                        address[0].city_id
                                      );
                                      setFieldValue(
                                        "shipping_thana",
                                        address[0].city_id
                                      );
                                    }}
                                    className="col-xs-12 col-sm-12 col-md-12 col-lg-6"
                                  >
                                    <a
                                      href="javascript:void(0)"
                                      className={
                                        savedShippingAddress === key
                                          ? "userAddress selected"
                                          : "userAddress"
                                      }
                                      useraddressattributeid="18"
                                    >
                                      <label>
                                        <input type="radio" name="shipping" className="form-check-input" value={item?.id} />
                                        <div
                                          className="address-books"
                                          key={item.id}
                                        >
                                          <address>
                                            <span className="name19">
                                              {auth?.name}
                                            </span>
                                            <br />
                                            District:{" "}
                                            <span className="district">
                                              {item?.state_name}
                                            </span>
                                            <br />
                                            Email:{" "}
                                            <span className="">{item?.email}</span>
                                            <br />
                                            Phn No:{" "}
                                            <span className="mobile">
                                              {item?.phone || auth?.phone}
                                            </span>
                                            <br />
                                            Postcode:{" "}
                                            <span className="postcode">
                                              {item?.postal_code}
                                            </span>
                                            <br />
                                            Address :{" "}
                                            <span className="address">
                                              {item?.address}
                                            </span>
                                          </address>
                                        </div>
                                      </label>
                                    </a>
                                  </div>
                                );
                              })
                            ) : (
                              <h1>No Default Address Selected</h1>
                            )}
                          </>
                        )}
                        {values.shipping_type === "pickup_point" && (
                          <>
                            <select
                              className="form-select"
                              aria-label="Default select example"
                              onChange={handleChange}
                              name="pickup_points_id"
                            >
                              <option selected>Select Store</option>
                              {pickupPointList?.map((item) => {
                                return (
                                  <option selected={item?.id == values.pickup_points_id} value={item?.id}>
                                    {item?.name || item?.address}
                                  </option>
                                );
                              })}
                            </select>
                            {touched.pickup_points_id ||
                              errors.pickup_points_id ? (
                              <div className="text-danger">{errors.pickup_points_id}</div>
                            ) : null}
                          </>
                        )}
                      </div>
                    }





                    {!showShipping && values.shipping_type === "home_delivery" && (
                      <>
                        {/* ===================================================== shipping address ============================================== */}
                        <div className="row">
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label for="first-name" className="form-label">
                                First name
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <input
                                id="first-name"
                                className="form-control"
                                type="text"
                                name="shipping_first_name"
                                autocomplete="given-name"
                                required
                                value={values.shipping_first_name}
                                onChange={handleChange}
                                placeholder="First Name"
                                disabled={
                                  currentDefaultAddress || sameBilling
                                    ? true
                                    : false
                                }
                              />
                              {
                                errors.shipping_first_name ? (
                                  <div className="text-danger">
                                    {errors.shipping_first_name}
                                  </div>
                                ) : null}
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label for="last-name" className="form-label">
                                Last name
                              </label>
                              <input
                                id="last-name"
                                className="form-control"
                                type="text"
                                name="shipping_last_name"
                                autocomplete="family-name"
                                value={values.shipping_last_name}
                                onChange={handleChange}
                                placeholder="Last Name"
                                disabled={
                                  currentDefaultAddress || sameBilling
                                    ? true
                                    : false
                                }
                              />
                              {
                                errors.shipping_last_name ? (
                                  <div className="text-danger">
                                    {errors.shipping_last_name}
                                  </div>
                                ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label for="phone-number" className="form-label">
                                Phone number
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <input
                                id="phone-number"
                                className="form-control"
                                type="text"
                                name="shipping_phone"
                                autocomplete="tel"
                                inputmode="tel"
                                required
                                placeholder="Phone Number"
                                value={values.shipping_phone}
                                onChange={handleChange}
                                disabled={
                                  currentDefaultAddress || sameBilling
                                    ? true
                                    : false
                                }
                              />
                              {
                                errors.shipping_phone ? (
                                  <div className="text-danger">
                                    {errors.shipping_phone}
                                  </div>
                                ) : null}
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label for="email-address" className="form-label">
                                Email address
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <input
                                required
                                id="email-address"
                                className="form-control"
                                type="email"
                                name="shipping_email"
                                autocomplete="email"
                                inputmode="email"
                                placeholder="E-mail Address"
                                value={values.shipping_email}
                                onChange={handleChange}
                                disabled={
                                  currentDefaultAddress || sameBilling
                                    ? true
                                    : false
                                }
                              />
                              {
                                errors.shipping_email ? (
                                  <div className="text-danger">
                                    {errors.shipping_email}
                                  </div>
                                ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label for="address-state" className="form-label">
                                Country
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <select
                                id="address-state"
                                name="shipping_country"
                                // onChange={(e) => {
                                //   setFieldValue(
                                //     "shipping_country",
                                //     e.target.value
                                //   );
                                //   fetchDistrictList(e.target.value, true);
                                // }}
                                onBlur={handleBlur}
                                value={countryId}
                                autocomplete="shipping_country address-level1"
                                required
                                className="form-control"
                              >
                                {countryList != undefined &&
                                  countryList.map((val) => {
                                    return (
                                      <option value={val?.id}>
                                        {val?.name}
                                      </option>
                                    );
                                  })}
                              </select>
                              {touched.shipping_country ||
                                errors.shipping_country ? (
                                <p className="text-danger">
                                  {errors.shipping_country}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label for="address-state" className="form-label">
                                District
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <select
                                id="address-state"
                                name="shipping_district"
                                onChange={(e) => {
                                  setFieldValue(
                                    "shipping_district",
                                    e.target.value
                                  );
                                  setFieldValue(
                                    "shipping_country",
                                    countryId
                                  );
                                  fetchThanaList(
                                    e.target.value,
                                    true,
                                    values.shipping_country
                                  );
                                }}
                                onBlur={handleBlur}
                                value={values.shipping_district}
                                autocomplete="shipping address-level1"
                                required
                                className="form-control"
                              >
                                <option value="" disabled selected>
                                  Please select
                                </option>
                                {stateList != undefined &&
                                  stateList.map((val) => {
                                    return (
                                      <option value={val?.id}>
                                        {val?.name}
                                      </option>
                                    );
                                  })}
                              </select>
                              {
                                errors.shipping_district ? (
                                  <p className="text-danger">
                                    {errors.shipping_district}
                                  </p>
                                ) : null}
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label
                                htmlFor="address-state"
                                className="form-label"
                              >
                                Area
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <select
                                id="address-state"
                                name="shipping_thana"
                                autoComplete="shipping address-level1"
                                required
                                className="form-control"
                                onChange={(e) => {
                                  shippingChargeByArea(e.target.value, true);
                                  setFieldValue(
                                    "shipping_thana",
                                    e.target.value
                                  );
                                }}
                                value={values.shipping_thana}
                              >
                                <option value="" disabled="" selected="">
                                  Please select
                                </option>
                                {shippingThanaList != undefined &&
                                  shippingThanaList.map((val) => {
                                    return (
                                      <option value={val?.id}>
                                        {val?.name}
                                      </option>
                                    );
                                  })}
                              </select>
                              {
                                errors.shipping_thana ? (
                                  <p className="text-danger">
                                    {errors.shipping_thana}
                                  </p>
                                ) : null}
                            </div>
                          </div>

                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label
                                htmlFor="address-state"
                                className="form-label"
                              >
                                Postal Code
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>

                              <input
                                id="email-address"
                                className="form-control"
                                type="text"
                                name="shipping_postal_code"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.shipping_postal_code}
                                autocomplete="email"
                                placeholder="Postal Code"
                              />

                              {touched.shipping_postal_code ||
                                errors.shipping_postal_code ? (
                                <p className="text-danger">
                                  {errors.shipping_postal_code}
                                </p>
                              ) : null}
                              {errors != undefined && (
                                <div className="text-danger">
                                  {errors?.postal}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group mb-0">
                              <label for="address" className="form-label">
                                Address
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>

                              <textarea
                                className="form-control"
                                id="address"
                                name="shipping_address"
                                onChange={handleChange}
                                value={values.shipping_address}
                                autocomplete="shipping address-line1"
                                required
                                style={{ height: "100px" }}
                                placeholder="Address Details"
                                defaultValue={""}
                              >
                                {values.shipping_address}
                              </textarea>
                              {touched.shipping_address ||
                                errors.shipping_address ? (
                                <p className="text-danger">
                                  {errors.shipping_address}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  </fieldset>
                </div>
                <div className="common-fieldset-main">
                  <fieldset className="common-fieldset">
                    <legend className="rounded-0">Additional Info</legend>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                      <div className="form-group mb-0">
                        <label for="address" className="form-label">
                          Order Note
                        </label>

                        <textarea
                          className="form-control"
                          id="address"
                          name="note"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.note ?? ""}
                          autocomplete="shipping address-line1"
                          style={{ height: "100px" }}
                          placeholder="Order Note"
                          defaultValue={""}
                        ></textarea>
                        {touched.note || errors.note ? (
                          <p className="text-danger">{errors.note}</p>
                        ) : null}
                      </div>
                    </div>
                  </fieldset>
                </div>

              </div>
              <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                <div className="common-fieldset-main d-none">
                  <fieldset className="common-fieldset">
                    <legend className="rounded-0">shipping address</legend>

                    <div className="row mb-3">
                      <div className="col-4">
                        <label className="form-check-label2 " for="">
                          Select delivery type
                        </label>
                      </div>
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="home_delivery"
                            name="shipping_type"
                            id="pickupStoreChNo"
                            checked={
                              values.shipping_type === "home_delivery" && true
                            }
                            onChange={(e) => {
                              // setOrderInfo({
                              //   ...orderInfo,
                              //   shipping_type: e.target.value,
                              // });
                              setFieldValue("shipping_type", e.target.value);
                            }}
                          />
                          <label
                            className="form-check-label"
                            for="pickupStoreChNo"
                          >
                            Home delivery
                          </label>

                          {touched.shipping_type || errors.shipping_type ? (
                            <p className="text-danger">
                              {errors.shipping_type}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      {getSettingValue(
                        businessSlice?.globalsetting,
                        "pickup_point"
                      ) == 1 && (
                          <div className="col-4">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                value="pickup_point"
                                name="shipping_type"
                                id="pickupStoreChYes"
                                checked={
                                  values.shipping_type == "pickup_point" && true
                                }
                                onChange={(e) => {
                                  // setOrderInfo({
                                  //   ...orderInfo,
                                  //   shipping_type: e.target.value,
                                  // });
                                  setFieldValue("shipping_type", e.target.value);
                                }}
                              />
                              <label
                                className="form-check-label"
                                for="pickupStoreChYes"
                              >
                                Pickup from store
                              </label>
                              {touched.shipping_type || errors.shipping_type ? (
                                <p className="text-danger">
                                  {errors.shipping_type}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        )}
                    </div>
                    {/* same as default address  */}
                    <div className="row ">
                      {values.shipping_type === "home_delivery" && (
                        <>
                          {" "}
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <label className="form-check-label2 mb-3" for="">
                              Select from saved address or Enter Your address
                            </label>
                          </div>
                          {auth ? (
                            auth?.default_address?.map((item, key) => {
                              if (parseInt(item?.set_default) == 1) {
                                setSavedShippingAddress(key);
                              }
                              return (
                                <div
                                  onClick={async () => {
                                    if (currentDefaultAddress) {
                                      setCurrentDefaultAddress();
                                    } else {
                                      setCurrentDefaultAddress(item.id);
                                    }
                                    let address = auth?.default_address.filter(
                                      (addr) => item.id === addr.id
                                    );
                                    setSavedShippingAddress(key);

                                    setFieldValue(
                                      "shipping_first_name",
                                      auth?.name ? firstName : ""
                                    );
                                    setFieldValue(
                                      "shipping_last_name",
                                      auth?.name ? lastName : ""
                                    );
                                    setFieldValue(
                                      "shipping_email",
                                      address[0].email || auth.email
                                    );
                                    setFieldValue(
                                      "shipping_country",
                                      address[0].country_id
                                    );
                                    setFieldValue(
                                      "shipping_phone",
                                      address[0].phone || auth.phone
                                    );
                                    setFieldValue(
                                      "shipping_postal_code",
                                      address[0].postal_code
                                    );
                                    setFieldValue(
                                      "shipping_address",
                                      address[0].address
                                    );
                                    await fetchDistrictList(
                                      address[0].country_id,
                                      true
                                    );
                                    setFieldValue(
                                      "shipping_district",
                                      address[0].state_id
                                    );

                                    await fetchThanaList(
                                      address[0].state_id,
                                      true,
                                      address[0].country_id,
                                      address[0].city_id
                                    );
                                    setFieldValue(
                                      "shipping_thana",
                                      address[0].city_id
                                    );
                                  }}
                                  className="col-xs-12 col-sm-12 col-md-12 col-lg-6"
                                >
                                  <a
                                    href="javascript:void(0)"
                                    className={
                                      savedShippingAddress === key
                                        ? "userAddress selected"
                                        : "userAddress"
                                    }
                                    useraddressattributeid="18"
                                  >
                                    <label>
                                      <input type="radio" name="shipping" className="form-check-input" value={item?.id} />
                                      <div
                                        className="address-books"
                                        key={item.id}
                                      >
                                        <address>
                                          <span className="name19">
                                            {auth?.name}
                                          </span>
                                          <br />
                                          District:{" "}
                                          <span className="district">
                                            {item?.state_name}
                                          </span>
                                          <br />
                                          Email:{" "}
                                          <span className="">{item?.email}</span>
                                          <br />
                                          Phn No:{" "}
                                          <span className="mobile">
                                            {item?.phone || auth?.phone}
                                          </span>
                                          <br />
                                          Postcode:{" "}
                                          <span className="postcode">
                                            {item?.postal_code}
                                          </span>
                                          <br />
                                          Address :{" "}
                                          <span className="address">
                                            {item?.address}
                                          </span>
                                        </address>
                                      </div>
                                    </label>
                                  </a>
                                </div>
                              );
                            })
                          ) : (
                            <h1>No Default Address Selected</h1>
                          )}
                        </>
                      )}
                      {values.shipping_type === "pickup_point" && (
                        <>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={handleChange}
                            name="pickup_points_id"
                          >
                            <option selected>Select Store</option>
                            {pickupPointList?.map((item) => {
                              return (
                                <option selected={item?.id == values.pickup_points_id} value={item?.id}>
                                  {item?.name || item?.address}
                                </option>
                              );
                            })}
                          </select>
                          {touched.pickup_points_id ||
                            errors.pickup_points_id ? (
                            <div className="text-danger">{errors.pickup_points_id}</div>
                          ) : null}
                        </>
                      )}
                    </div>
                    {/*! same as billing address  */}
                    {values.shipping_type === "home_delivery" && (
                      <>
                        <div className="row mb-3">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <label className="form__choice-wrapper">
                              <input
                                id=""
                                type="checkbox"
                                className="me-2 form-check-input"
                                name=""
                                value={values.sameBilling}
                                onClick={() =>
                                  sameAsBillingAddress(
                                    event,
                                    values,
                                    setFieldValue
                                  )
                                }
                              />
                              <span>Same as billing address</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    {values.shipping_type === "home_delivery" && (
                      <>
                        {/* ===================================================== shipping address ============================================== */}
                        <div className="row">
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label for="first-name" className="form-label">
                                First name
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <input
                                id="first-name"
                                className="form-control"
                                type="text"
                                name="shipping_first_name"
                                autocomplete="given-name"
                                required
                                value={values.shipping_first_name}
                                onChange={handleChange}
                                placeholder="First Name"
                                disabled={
                                  currentDefaultAddress || sameBilling
                                    ? true
                                    : false
                                }
                              />
                              {
                                errors.shipping_first_name ? (
                                  <div className="text-danger">
                                    {errors.shipping_first_name}
                                  </div>
                                ) : null}
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label for="last-name" className="form-label">
                                Last name
                              </label>
                              <input
                                id="last-name"
                                className="form-control"
                                type="text"
                                name="shipping_last_name"
                                autocomplete="family-name"
                                value={values.shipping_last_name}
                                onChange={handleChange}
                                placeholder="Last Name"
                                disabled={
                                  currentDefaultAddress || sameBilling
                                    ? true
                                    : false
                                }
                              />
                              {
                                errors.shipping_last_name ? (
                                  <div className="text-danger">
                                    {errors.shipping_last_name}
                                  </div>
                                ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label for="phone-number" className="form-label">
                                Phone number
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <input
                                id="phone-number"
                                className="form-control"
                                type="text"
                                name="shipping_phone"
                                autocomplete="tel"
                                inputmode="tel"
                                required
                                placeholder="Phone Number"
                                value={values.shipping_phone}
                                onChange={handleChange}
                                disabled={
                                  currentDefaultAddress || sameBilling
                                    ? true
                                    : false
                                }
                              />
                              {
                                errors.shipping_phone ? (
                                  <div className="text-danger">
                                    {errors.shipping_phone}
                                  </div>
                                ) : null}
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label for="email-address" className="form-label">
                                Email address
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <input
                                required
                                id="email-address"
                                className="form-control"
                                type="email"
                                name="shipping_email"
                                autocomplete="email"
                                inputmode="email"
                                placeholder="E-mail Address"
                                value={values.shipping_email}
                                onChange={handleChange}
                                disabled={
                                  currentDefaultAddress || sameBilling
                                    ? true
                                    : false
                                }
                              />
                              {
                                errors.shipping_email ? (
                                  <div className="text-danger">
                                    {errors.shipping_email}
                                  </div>
                                ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label for="address-state" className="form-label">
                                Country
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <select
                                id="address-state"
                                name="shipping_country"
                                // onChange={(e) => {
                                //   setFieldValue(
                                //     "shipping_country",
                                //     e.target.value
                                //   );
                                //   fetchDistrictList(e.target.value, true);
                                // }}
                                onBlur={handleBlur}
                                value={countryId}
                                autocomplete="shipping_country address-level1"
                                required
                                className="form-control"
                              >
                                {countryList != undefined &&
                                  countryList.map((val) => {
                                    return (
                                      <option value={val?.id}>
                                        {val?.name}
                                      </option>
                                    );
                                  })}
                              </select>
                              {touched.shipping_country ||
                                errors.shipping_country ? (
                                <p className="text-danger">
                                  {errors.shipping_country}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label for="address-state" className="form-label">
                                District
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <select
                                id="address-state"
                                name="shipping_district"
                                onChange={(e) => {
                                  setFieldValue(
                                    "shipping_district",
                                    e.target.value
                                  );
                                  setFieldValue(
                                    "shipping_country",
                                    countryId
                                  );
                                  fetchThanaList(
                                    e.target.value,
                                    true,
                                    values.shipping_country
                                  );
                                }}
                                onBlur={handleBlur}
                                value={values.shipping_district}
                                autocomplete="shipping address-level1"
                                required
                                className="form-control"
                              >
                                <option value="" disabled selected>
                                  Please select
                                </option>
                                {stateList != undefined &&
                                  stateList.map((val) => {
                                    return (
                                      <option value={val?.id}>
                                        {val?.name}
                                      </option>
                                    );
                                  })}
                              </select>
                              {
                                errors.shipping_district ? (
                                  <p className="text-danger">
                                    {errors.shipping_district}
                                  </p>
                                ) : null}
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label
                                htmlFor="address-state"
                                className="form-label"
                              >
                                Area
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <select
                                id="address-state"
                                name="shipping_thana"
                                autoComplete="shipping address-level1"
                                required
                                className="form-control"
                                onChange={(e) => {
                                  shippingChargeByArea(e.target.value, true);
                                  setFieldValue(
                                    "shipping_thana",
                                    e.target.value
                                  );
                                }}
                                value={values.shipping_thana}
                              >
                                <option value="" disabled="" selected="">
                                  Please select
                                </option>
                                {shippingThanaList != undefined &&
                                  shippingThanaList.map((val) => {
                                    return (
                                      <option value={val?.id}>
                                        {val?.name}
                                      </option>
                                    );
                                  })}
                              </select>
                              {
                                errors.shipping_thana ? (
                                  <p className="text-danger">
                                    {errors.shipping_thana}
                                  </p>
                                ) : null}
                            </div>
                          </div>

                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label
                                htmlFor="address-state"
                                className="form-label"
                              >
                                Postal Code
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>

                              <input
                                id="email-address"
                                className="form-control"
                                type="text"
                                name="shipping_postal_code"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.shipping_postal_code}
                                autocomplete="email"
                                placeholder="Postal Code"
                              />

                              {touched.shipping_postal_code ||
                                errors.shipping_postal_code ? (
                                <p className="text-danger">
                                  {errors.shipping_postal_code}
                                </p>
                              ) : null}
                              {errors != undefined && (
                                <div className="text-danger">
                                  {errors?.postal}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group mb-0">
                              <label for="address" className="form-label">
                                Address
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>

                              <textarea
                                className="form-control"
                                id="address"
                                name="shipping_address"
                                onChange={handleChange}
                                value={values.shipping_address}
                                autocomplete="shipping address-line1"
                                required
                                style={{ height: "100px" }}
                                placeholder="Address Details"
                                defaultValue={""}
                              >
                                {values.shipping_address}
                              </textarea>
                              {touched.shipping_address ||
                                errors.shipping_address ? (
                                <p className="text-danger">
                                  {errors.shipping_address}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </fieldset>
                </div>
                <div className="common-fieldset-main">
                  <fieldset className="common-fieldset">
                    <legend className="rounded-0">review cart</legend>
                    <div className="table-responsive review-cart-table">
                      <CartSection carts={carts} getProducts={getProducts} />
                    </div>
                  </fieldset>
                </div>
                {getSettingValue(
                  businessSlice?.globalsetting,
                  "gift_wrap_status"
                ) == "true" && (
                    <div className="common-fieldset-main">
                      <fieldset className="common-fieldset">
                        <legend className="rounded-0">Wrap Your Gift</legend>
                        <div className="row align-items-center">
                          <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                            <div class="form-check">
                              <input
                                type="checkbox"
                                name="gift_wrap"
                                className="form-check-input"
                                id="gift_wrap"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    fetchGiftProduct(e.target.checked);
                                  } else {
                                    fetchGiftProduct(e.target.checked);
                                  }
                                  console.log(e);
                                  handleChange(e);
                                }}
                              />
                              <label for="gift_wrap" className="form-check-label">
                                Want to Wrap Your Gift
                              </label>
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                            <Lottie
                              options={{
                                loop: true,
                                autoplay: true,
                                animationData: animationData,
                                rendererSettings: {
                                  preserveAspectRatio: "xMidYMid slice",
                                },
                              }}
                              height={100}
                              width={100}
                            />
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group mb-0">
                              {touched.gift_wrap || errors.gift_wrap ? (
                                <p className="text-danger">{errors.gift_wrap}</p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  )}
                <div className="common-fieldset-main d-none">
                  <fieldset className="common-fieldset">
                    <legend className="rounded-0">coupon</legend>

                    <div className="row g-3 align-items-center">
                      <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                        <input
                          type="text"
                          id=""
                          className="form-control"
                          aria-describedby="coupon"
                          placeholder="Coupon Code Here"
                          readOnly={coupon.coupon_applied ? true : false}
                          onChange={(e) =>
                            setCoupon({
                              ...coupon,
                              coupon: e.target.value,
                            })
                          }
                          value={coupon.coupon}
                        />
                      </div>
                      <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        {coupon.coupon_applied ? (
                          <button
                            type="button"
                            className="continue-btn w-100 bg-danger"
                            onClick={removeCoupon}
                            disabled={
                              memberSlice?.membership_applied ? true : false
                            }
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="continue-btn w-100"
                            onClick={applyCoupon}
                            disabled={
                              coupon.coupon_applied ||
                                memberSlice?.membership_applied
                                ? true
                                : false
                            }
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    </div>
                  </fieldset>
                </div>
                <>
                  <div className="common-fieldset-main d-none">
                    <fieldset className="common-fieldset">
                      <legend className="rounded-0">
                        Club Member/Employee Discount
                      </legend>

                      <div className="row g-3 align-items-center">
                        {!memberSlice?.otp && (
                          <>
                            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                              <input
                                type="text"
                                id=""
                                className="form-control"
                                aria-describedby="coupon"
                                onChange={(e) =>
                                  setMemberSHipInput({
                                    ...memberShipInput,
                                    membership_no: e.target.value,
                                  })
                                }
                                placeholder="User Club Card No/ Employee ID"
                              />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                              <button
                                type="button"
                                className="continue-btn w-100"
                                onClick={loyaltyMember}
                                disabled={couponSlice?.coupon_applied}
                              >
                                apply
                              </button>
                            </div>
                          </>
                        )}
                        {memberSlice?.otp && (
                          <>
                            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                              <input
                                type="text"
                                id=""
                                className="form-control"
                                aria-describedby="coupon"
                                onChange={(e) =>
                                  setMemberSHipInput({
                                    ...memberShipInput,
                                    membership_otp: e.target.value,
                                  })
                                }
                                placeholder="Membership Otp"
                              />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                              <button
                                type="button"
                                className="continue-btn w-100"
                                onClick={checkLoyaltyOtp}
                                disabled={
                                  couponSlice?.coupon_applied ||
                                  memberSlice?.membership_applied
                                }
                              >
                                verify
                              </button>
                            </div>
                          </>
                        )}{" "}
                      </div>
                    </fieldset>
                  </div>{" "}
                </>
                <>
                  <div className="common-fieldset-main d-none">
                    <fieldset className="common-fieldset">
                      <legend className="rounded-0">Gift Card</legend>

                      <div className="row g-3 align-items-center">
                        {!giftCardSlice?.otp && (
                          <>
                            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                              <input
                                type="text"
                                id=""
                                className="form-control"
                                aria-describedby="coupon"
                                onChange={(e) =>
                                  setGiftCardInput({
                                    ...giftCardInput,
                                    gift_card_no: e.target.value,
                                  })
                                }
                                placeholder="Gift Card No"
                              />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                              <button
                                type="button"
                                className="continue-btn w-100"
                                onClick={giftCardCheck}
                                disabled={giftCardSlice.gift_card_applied}
                              >
                                apply
                              </button>
                            </div>
                          </>
                        )}
                        {giftCardSlice?.otp && (
                          <>
                            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8 d-none">
                              <input
                                type="text"
                                id=""
                                className="form-control"
                                aria-describedby="coupon"
                                onChange={(e) =>
                                  setGiftCardInput({
                                    ...giftCardInput,
                                    gift_card_otp: e.target.value,
                                  })
                                }
                                placeholder="Gift Card Otp"
                              />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                              <button
                                type="button"
                                className="continue-btn w-100"
                                onClick={giftCardOtp}
                                disabled={
                                  couponSlice?.coupon_applied ||
                                  memberSlice?.membership_applied ||
                                  giftCardSlice?.gift_card_applied
                                }
                              >
                                verify
                              </button>
                            </div>
                          </>
                        )}
                        {hasDigitalProduct && (
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 d-none">
                            <label
                              htmlFor="address-state"
                              className="form-label"
                            >
                              Gift Card Sms Time
                              <span
                                data-required="true"
                                aria-hidden="true"
                              ></span>
                            </label>
                            <input
                              type="datetime-local"
                              id=""
                              name="gift_card_time"
                              value={values?.gift_card_time}
                              className="form-control"
                              aria-describedby="coupon"
                              onChange={handleChange}
                              placeholder="Gift Card Sms Time"
                            />
                          </div>
                        )}
                      </div>
                    </fieldset>
                  </div>{" "}
                </>
                <div className="cart-sidebar-main">
                  <div className="common-fieldset-main">
                    <fieldset className="common-fieldset">
                      <legend className="rounded-0">summary</legend>

                      <div className="table-responsive">
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <td>subtotal </td>
                              <td>{cartCalculation.subTotal.toFixed(3)}</td>
                            </tr>
                            <tr>

                              <td>shipping charge</td>
                              <td>
                                {values.shipping_type == "pickup_point" || coupon.free_shipping ? 0 : parseInt(
                                  getSettingValue(businessSlice?.globalsetting, "free_shipping_status")
                                ) == 1 || (parseInt(getSettingValue(businessSlice?.globalsetting, "free_shipping_limit")) != null &&
                                  parseInt(getSettingValue(businessSlice?.globalsetting, "free_shipping_limit")) > 0 &&
                                  parseInt(getSettingValue(businessSlice?.globalsetting, "free_shipping_limit")) <= parseFloat(subTotal)) ? 0 : deliveryCharge?.shippingCharge ?? 0}
                              </td>
                            </tr>

                            <tr className="d-none">
                              <td>loyalty</td>
                              <td>
                                {memberSlice.membership_applied
                                  ? memberSlice.membership_amount
                                  : 0}
                              </td>
                            </tr>

                            <tr>
                              <td>total discount</td>
                              <td>{cartCalculation?.discount.toFixed(3)}</td>
                            </tr>
                            <tr>
                              <td>VAT</td>
                              <td>{cartCalculation?.tax.toFixed(3)}</td>
                            </tr>
                            {getSettingValue(
                              businessSlice?.globalsetting,
                              "gift_wrap_status"
                            ) == "true" && (
                                <tr>
                                  <td>Wrap Amount</td>
                                  <td>
                                    {cartCalculation?.gift_wrap_amount ?? 0}
                                  </td>
                                </tr>
                              )}
                            <tr className="top-border">
                              <td>total</td>
                              <td className="text-bold">
                                {(cartCalculation.total + (values.shipping_type == "pickup_point" || coupon.free_shipping ? 0 : (parseInt(
                                  getSettingValue(businessSlice?.globalsetting, "free_shipping_status")
                                ) == 1 || (parseInt(getSettingValue(businessSlice?.globalsetting, "free_shipping_limit")) != null && parseInt(getSettingValue(businessSlice?.globalsetting, "free_shipping_limit")) > 0 && parseInt(getSettingValue(businessSlice?.globalsetting, "free_shipping_limit")) <= parseFloat(subTotal)) ? 0 : deliveryCharge?.shippingCharge ?? 0) +
                                  parseInt(
                                    cartCalculation?.gift_wrap_amount ?? 0
                                  )))}
                              </td>
                            </tr>
                            {giftCardSlice?.gift_card_applied && (
                              <>
                                <tr>
                                  <td>Gift Card Payment</td>
                                  <td>
                                    {giftCardSlice?.gift_card_applied &&
                                      giftCardSlice?.gift_card_amount
                                      ? giftCardSlice?.gift_card_amount
                                      : 0}
                                  </td>
                                </tr>
                                <tr className="top-border">
                                  <td>Payable</td>
                                  <td className="text-bold">
                                    {cartCalculation?.payable?.toFixed(3)}
                                  </td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <hr />
                      <br />
                      <div className="common-fieldset-main">
                        <label for="" className="form-label">
                          Select Payment Method
                        </label>

                        {businessSlice?.paymentTypes?.map(
                          ({
                            payment_type,
                            payment_type_key,
                            image,
                            name,
                            title,
                            offline_payment_id,
                          }) => {
                            if (
                              payment_type_key == "cash_on_delivery" &&
                              hasDigitalProduct == true
                            ) {
                              return;
                            }
                            if (
                              payment_type_key == "cash_on_delivery" &&
                              giftCardSlice?.gift_card_applied
                            ) {
                              return;
                            }
                            return (
                              <div className="form-check form-check-inline payment_method_radio">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="payment_type"
                                  id={payment_type_key}
                                  value={payment_type_key}
                                  onClick={handleChange}
                                />
                                <label
                                  className="form-check-label"
                                  for={payment_type_key}
                                >
                                  <img
                                    src={image}
                                    alt={name}
                                    style={{ width: "65px" }}
                                  />
                                </label>
                              </div>
                            );
                          }
                        )}

                        <label className="form__choice-wrapper mt-3">
                          <input
                            id=""
                            className="me-2 form-check-input"
                            type="checkbox"
                            name="privacy_policy"
                            onClick={handleChange}
                            value="1"
                          />
                          <span>
                            Accept the{" "}
                            <Link
                              prefetch={true}
                              href={`/page/${filterPages("Terms & Conditions")?.slug
                                }?info=${filterPages("Terms & Conditions")?.id}`}
                            >
                              Terms & Conditions
                            </Link>
                            ,{" "}
                            <Link
                              prefetch={true}
                              href={`/page/${filterPages("Return and Exchange")?.slug
                                }?info=${filterPages("Return and Exchange")?.id}`}
                            >
                              Return & Refund Policy
                            </Link>{" "}
                            and{" "}
                            <Link
                              prefetch={true}
                              href={`/page/${filterPages("Privacy Policy")?.slug
                                }?info=${filterPages("Privacy Policy")?.id}`}
                            >
                              {" "}
                              Privacy Policy
                            </Link>{" "}
                            of www.redorigin.com.bd
                          </span>
                        </label>
                      </div>

                      {touched.payment_type && errors.payment_type ? (
                        <div className="text-danger">{errors.payment_type}</div>
                      ) : null}
                      {touched.privacy_policy && errors.privacy_policy ? (
                        <div className="text-danger">
                          {errors.privacy_policy}
                        </div>
                      ) : null}
                      {/* <br /> */}
                      <div className="w-100">
                        <button
                          type="submit"
                          className="orderNowButton"
                          id="submit_btn"
                          disabled={isDisabled}
                        >
                          {isDisabled ? "processing" : "order now"}
                        </button>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div className="common-fieldset-main">
                  <fieldset className="common-fieldset">
                    <legend className="rounded-0">payment Options</legend>
                    <label for="" className="form-label">
                      Select Payment Method
                    </label>
                    <br />

                    {businessSlice?.paymentTypes?.map(
                      ({
                        payment_type,
                        payment_type_key,
                        image,
                        name,
                        title,
                        offline_payment_id,
                      }) => {
                        if (
                          payment_type_key == "cash_on_delivery" &&
                          hasDigitalProduct == true
                        ) {
                          return;
                        }
                        if (
                          payment_type_key == "cash_on_delivery" &&
                          giftCardSlice?.gift_card_applied
                        ) {
                          return;
                        }
                        return (
                          <div className="form-check form-check-inline payment_method_radio">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="payment_type"
                              id={payment_type_key}
                              value={payment_type_key}
                              onClick={handleChange}
                            />
                            <label
                              className="form-check-label"
                              for={payment_type_key}
                            >
                              <img
                                src={image}
                                alt={name}
                                style={{ width: "65px" }}
                              />
                            </label>
                          </div>
                        );
                      }
                    )}

                    <label className="form__choice-wrapper mt-3">
                      <input
                        id=""
                        className="me-2 form-check-input"
                        type="checkbox"
                        name="privacy_policy"
                        onClick={handleChange}
                        value="1"
                      />
                      <span>
                        Accept the{" "}
                        <Link
                          prefetch={true}
                          href={`/page/${filterPages("Terms & Conditions")?.slug
                            }?info=${filterPages("Terms & Conditions")?.id}`}
                        >
                          Terms & Conditions
                        </Link>
                        ,{" "}
                        <Link
                          prefetch={true}
                          href={`/page/${filterPages("Return and Exchange")?.slug
                            }?info=${filterPages("Return and Exchange")?.id}`}
                        >
                          Return & Refund Policy
                        </Link>{" "}
                        and{" "}
                        <Link
                          prefetch={true}
                          href={`/page/${filterPages("Privacy Policy")?.slug
                            }?info=${filterPages("Privacy Policy")?.id}`}
                        >
                          {" "}
                          Privacy Policy
                        </Link>{" "}
                        of www.redorigin.com.bd
                      </span>
                    </label>
                  </fieldset>
                </div>
              </div>
            </div> */}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CheckoutFormInterNational;
