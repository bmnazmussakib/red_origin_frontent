import Head from "next/head";
import MainLayout from "../layouts/MainLayout";
import "/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "/public/assets/icofont/icofont.min.css";
import "/public/assets/scss/bootstrap.min.css";
import "/public/assets/scss/style.css";
import "/public/assets/scss/responsive.css";
import "/public/assets/scss/jquery.ez-plus.min.css";
import "rc-slider/assets/index.css";
import 'react-loading-skeleton/dist/skeleton.css'
import NextNProgress from 'nextjs-progressbar';

import { ToastContainer } from "react-toastify";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import mainStore from "../store";
import Script from "next/script";
import axios from "axios";
import { cookie, getToken } from "../helpers/helper";
import Router, { useRouter } from "next/router";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "https://backend.karupannya.com/api/";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Authorization"] = `Bearer ${getToken()}`;

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useState } from "react";
import Loader from "../components/common/Loader";
import { useSelector } from "react-redux";
import ProtectedLayout from "../layouts/ProtectedLayout";
import { getSettingValue } from "../utils/filters";
import { GoogleOAuthProvider } from "@react-oauth/google";
import 'remixicon/fonts/remixicon.css'
import CartWishAccount from "../components/common/nav/micro/CartWishAccount";

function MyApp({ Component, pageProps }) {
  let [preload, setPreload] = useState(false);
  let auth = useSelector((state) => state.authSlice.user);
  console.log(process.env.NEXT_PUBLIC_APP_ENV)
  if (process.env.NEXT_PUBLIC_APP_ENV !== "development") {
    console.log = () => { };
  }
  // preloade
  Router.events.on("routeChangeStart", () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${auth?.token || getToken()}`;
    setPreload(true);
  });
  Router.events.on("routeChangeComplete", () => setPreload(false));
  useEffect(() => {
    const itemStr = localStorage.getItem("force-refresh-hard");
    const now = new Date();
    if (!itemStr) {
      localStorage.removeItem("categories");
      localStorage.removeItem("attributes");
      localStorage.setItem(
        "force-refresh",
        now.getTime() + 1000 * 60 * 60 * 6
      );
    } else {
      const item = itemStr;
      if (now.getTime() > parseInt(item)) {
        localStorage.removeItem("categories");
        localStorage.removeItem("attributes");
      }
    }
  }, []);
  // end preloader

  let settings = useSelector((state) => state.globalSetting.globalsetting);
  const favIcon = getSettingValue(settings, "site_icon");

  const router = useRouter();

  console.log('router: ', router.route)

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
        />
        <link rel="stylesheet" href="/assets/fonts/bebas-font.css" />
        <script src="/assets/js/jquery-3.6.1.min.js" defer></script>
        <script src="/assets/js/jquery.ez-plus.js" defer></script>

        <link rel="manifest" href="/manifest.json" />
        <title>{process?.env?.NEXT_PUBLIC_APP_NAME}</title>
        <link rel="icon" href={favIcon} />
      </Head>

      <script
        src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"
        integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3"
        crossorigin="anonymous"
      ></script>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js"
        integrity="sha384-cuYeSxntonz0PPNlHhBs68uyIAVpIIOZZ5JqeqvYYIcEL727kskC66kF92t6Xl2V"
        crossorigin="anonymous"
      ></script>
      <script type="text/javascript" src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"></script>

      <Script src="/assets/js/custom.js" strategy="lazyOnload"></Script>
      <NextNProgress
        color="#f1f1f1"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
      />
      {/*{preload ? (*/}
      {/*  <Loader />*/}
      {/*) :*/}
      {/*    (*/}
      <>
        {Component.protected ? (
          <GoogleOAuthProvider clientId="539250101403-9kabmeshan4cdrd9tl6it7hclfjc64j0.apps.googleusercontent.com">
            <ProtectedLayout>
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </ProtectedLayout>
          </GoogleOAuthProvider>
        ) : (
          <GoogleOAuthProvider clientId="539250101403-9kabmeshan4cdrd9tl6it7hclfjc64j0.apps.googleusercontent.com">
            <MainLayout>
              <Component {...pageProps} />

              
              <CartWishAccount />

            </MainLayout>
          </GoogleOAuthProvider>
        )}
        <ToastContainer autoClose={1000}
        />
      </>
      {/*)*/}
      {/*}*/}
    </>)
}

export default mainStore.withRedux(MyApp);