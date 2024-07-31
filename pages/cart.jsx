import dynamic from "next/dynamic";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { post, tAlert } from "../helpers/helper";
import { useRouter } from "next/router";
import { cart } from "../utils/route";
import { backendCart } from "../store/slice/CartSlice";
import mainStore from "../store";
import Banner from "../components/common/Banner";
const CartSection = dynamic(() => import("../components/cart/CartSection"), {
  ssr: false,
});
const Cart = ({ backendCartList ,token }) => {
  let [getProducts, setGetProducts] = useState([]);
  let router = useRouter();
  let dispatch = useDispatch();
  let couponSlice = useSelector((state) => state?.cartSlice?.coupon);
  let fetchCart = async (backendCarts) => {
    if (backendCarts && backendCarts?.length >= 0) {
      dispatch(
          backendCart({
            carts: backendCarts,
          })
      );
    }
    let getItem = [];
    backendCarts.forEach(async (item) => {
      if (item.get_item) getItem.push(item.get_item);
    });
    setGetProducts(getItem);
  };

  const fetchData = async () => {
    try {
      const { data } = await post(
          cart.CARTS,
          null,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          ''
      );
      fetchCart(data)
    } catch (error) {
      // Handle error
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (backendCartList && backendCartList?.length === 0) {
      // tAlert("Your cart is empty", "error");
      router.push("/shop");
    }
    fetchCart(backendCartList);
  }, [backendCartList]);

  useEffect(() => {
    fetchData()
  }, [couponSlice]);

  console.log('getProducts: ', getProducts)
  console.log('backendCartList: ', backendCartList)

  return (
    <>
      <Banner type="cart_banner" />
      <CartSection backendCart={backendCartList} getProducts={getProducts} />
    </>
  );
};

export const getServerSideProps = mainStore.getServerSideProps(
  (store) =>
    async ({ query, req }) => {
      try {
        let { data: backendCartList } = await post(
          cart.CARTS,
          null,
          null,
          {
            headers: {
              Authorization: `Bearer ${req.cookies.token}`,
            },
          },
          ""
        );
        return {
          props: {
            backendCartList: backendCartList,
            token: req.cookies.token,
          },
        };
      } catch (error) {
        // //console.log(error);
        return {
          props: {},
          redirect: {
            destination: "/",
          },
        };
      }
    }
);
export default Cart;
