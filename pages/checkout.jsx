import dynamic from "next/dynamic";
import React from "react";
import mainStore from "../store/index.js";
import Banner from "../components/common/Banner.jsx";
import { post, tAlert } from "../helpers/helper.js";
import { cart } from "../utils/route.js";
import Loader from "../components/common/Loader.jsx";
import { getSettingValue } from "../utils/filters.js";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router.js";
let CheckoutFormInterNational = dynamic(
  () => import("../components/checkout/CheckoutFormInterNational.jsx"),
  {
    ssr: false,
    loading: () => (
      <>
        {/* <Loader /> */}
        ""
      </>
    ),
  }
);
const Checkout = ({ carts, token }) => {
  let router = useRouter();
  let businessSlice = useSelector((state) => state.globalSetting);
  let authSlice = useSelector((state) => state.authSlice);
  let [checkout_form_show, set_checkout_form_show] = React.useState(null);
  let couponSlice = useSelector((state) => state?.cartSlice?.coupon);
  let [cartsAll, setCartsAll] = React.useState(carts);
  let [getProducts, setGetProducts] = React.useState([]);
  useEffect(() => {
    if (authSlice?.user == null) {
      router.push("/login");
    }
  }, []);


  useEffect(() => {
    if (carts?.length == 0) {
      tAlert("Your cart is empty", "error");
      router.push("/shop");
    } 
  }, [carts]);

  useEffect(() => {
    let getItem = [];
    carts.forEach(async (item) => {
      if (item.get_item) getItem.push(item.get_item);
    });
    setGetProducts(getItem);

    set_checkout_form_show(
      getSettingValue(businessSlice?.globalsetting, "checkout_form_show")
    );
  }, [businessSlice?.globalsetting]);

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
      setCartsAll(data)
    } catch (error) {
      // Handle error
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData()
  }, [couponSlice]);

  return (
    <>
      <Banner type="checkout_banner" />
      {checkout_form_show != null ? (
        checkout_form_show == 0 ? (
          <>
            <section className="checkout-main mb-0 mt-0">
              <img
                src=""
                className="img-fluid"
                alt=""
                srcset=""
              />
            </section>
          </>
        ) : (
          <section className="checkout-main">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="checkout-box">
                    <CheckoutFormInterNational
                      carts={cartsAll}
                      getProducts={getProducts}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      ) : (
        // <Loader />
        ""
      )}
    </>
  );
};

export const getServerSideProps = mainStore.getServerSideProps(
  (store) =>
    async ({ query, req }) => {
      try {
        let { data: carts } = await post(
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
            carts: carts,
            token: req.cookies.token,
          },
        };
      } catch (error) {
        return {
          props: {},
          redirect: {
            destination: "/",
          },
        };
      }
    }
);
export default Checkout;
