import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer.jsx";
import Header from "../components/common/Header.jsx";
import { useDispatch, useSelector } from "react-redux";
import Password from "../pages/password";
import { cookie, get, post, tAlert } from "../helpers/helper";
import ReactHtmlParser from "react-html-parser";
import { common, home, subscribe_route } from "../utils/route";
import Head from "next/head";
import Popup from "../components/Popup";
import { toast } from "react-toastify";
import dynamic from "next/dynamic.js";
import QuickVew from "../components/QuickVew";
import { getSettingValue } from "../utils/filters.js";
import Script from "next/script.js";
import { hasCookie } from "cookies-next";
import { useRouter } from "next/router.js";
import { addToGlobalSetting, addToPage } from "../store/slice/GlobalSetting.js";
import MessengerCustomerChat from "react-messenger-customer-chat";
import Link from "next/link.js";
import "remixicon/fonts/remixicon.css";
import GoogleAnalytics from "../components/common/GoogleAnalytics.jsx";
import TawkToChat from "../components/common/TawkToChat.jsx";
import FacebookPixel from "../components/common/FacebookPixel.jsx";
import 'remixicon/fonts/remixicon.css'

let FixMenu = dynamic(() => import("../components/common/FixMenu.jsx"), {
	ssr: false,
	loading: () => <p>Loading...</p>,
});
function MainLayout({ children }) {
	let router = useRouter();
	const user = useSelector((state) => {
		return state.authSlice.user;
	});
	const settings = useSelector((state) => {
		return state.globalSetting.globalsetting;
	});
	const pages = useSelector((state) => {
		return state.globalSetting.pages;
	});
	const [headerScript, setHeaderScript] = useState();
	const [footerScript, setFooterScript] = useState();
	const [beforeBodyTags, setBeforeBodyTags] = useState();
	let [facebookChatId, setFacebookChatId] = useState();
	const [email, setEmail] = useState();
	const [phone, setPhone] = useState();
	const dispatch = useDispatch();
	const fetchBusinessSettings = async () => {
		if (settings && settings?.length > 0) {
		} else {
			let { data, status } = await get(common.BSETTING);
			if (status === 200) {
				dispatch(
					addToGlobalSetting({ business_settings: data?.data ?? [] })
				);
			} else {
				tAlert("Something went wrong");
			}
		}
	};
	const submitSubscribe = (e) => {
		let regexEmail = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
		if (email && email.length > 0 && !regexEmail.test(email)) {
			toast.error("Email is invalid");
			return;
		}
		let regexPhone = /^[0-9]{11}$/;
		if (phone && phone.length > 0 && !regexPhone.test(phone)) {
			toast.error("Phone is invalid");
			return;
		}
		post(
			subscribe_route.SUBSCRIBE,
			null,
			{
				email: email ?? "",
				phone: phone ?? "",
			},
			{
				headers: {
					Authorization: "Bearer " + cookie("token"),
				},
			}
		)
			.then((res) => {
				if (res.data.status == "success") {
					toast.success(res.data.message || "Subscribe successfully");
					setEmail("");
					setPhone("");
					var myModalEl = document.getElementById("examplePopUpModal");
					var modal = bootstrap.Modal.getInstance(myModalEl);
					cookie("popup", "true", "set");

					modal.hide();
					document.querySelector(".modal-backdrop").remove();
				}
			})
			.catch((error) => {
				toast.error(error.response.data.message || "Something went wrong");
				console.error(error);
			});
	};
	useEffect(() => {
		fetchBusinessSettings();
		if (pages && pages.length > 0) {
		} else {
			get(home.PAGE_LIST)
				.then((res) => {
					if (res.data && res.status === 200) {
						dispatch(
							addToPage({
								pages: res.data.data ?? [],
							})
						);
					}
				})
				.catch((error) => { });
		}
	}, []);
	// useEffect(() => {
	//   var chatbox = document.getElementById("fb-customer-chat");
	//   chatbox.setAttribute("page_id", "628231390596952");
	//   chatbox.setAttribute("attribution", "biz_inbox");

	//   window.fbAsyncInit = function () {
	//     FB.init({
	//       xfbml: true,
	//       version: "v16.0",
	//     });
	//   };

	//   (function (d, s, id) {
	//     var js,
	//       fjs = d.getElementsByTagName(s)[0];
	//     if (d.getElementById(id)) return;
	//     js = d.createElement(s);
	//     js.id = id;
	//     js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
	//     fjs.parentNode.insertBefore(js, fjs);
	//   })(document, "script", "facebook-jssdk");
	// }, []);
	useEffect(() => {
		let headerScriptData = getSettingValue(settings, "header_script");
		if (headerScriptData != undefined) {
			setHeaderScript(headerScriptData);
		}
		let footerScriptData = getSettingValue(settings, "footer_script");
		if (footerScriptData != undefined) {
			setFooterScript(footerScriptData);
		}
		let beforeBodyTagsData = getSettingValue(settings, "before_body_tags");
		if (beforeBodyTagsData != undefined) {
			setBeforeBodyTags(beforeBodyTagsData);
		}
		let facebookChatIdRedux = getSettingValue(settings, "facebook_chat_id");
		if (facebookChatIdRedux != undefined) {
			setFacebookChatId(facebookChatIdRedux);
		}
		if (process.env.NEXT_PUBLIC_APP_ENV == "production") {
			// document.addEventListener("contextmenu", (event) =>
			//   event.preventDefault()
			// );
			document.onkeydown = function (e) {
				if (
					e.ctrlKey &&
					(e.keyCode === 67 ||
						e.keyCode === 86 ||
						e.keyCode === 85 ||
						e.keyCode === 117)
				) {
					alert("Not Allowed");
					return false;
				} else {
					return true;
				}
			};
		}
	}, [user, settings]);
	useEffect(() => {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$(".solasta-header").addClass("fixed__header");
			} else {
				$(".solasta-header").removeClass("fixed__header");
			}
		});
	}, []);
	return (
		<>
			{" "}
			<Head>
				<meta
					name="facebook-domain-verification"
					content={getSettingValue(
						settings,
						"facebook_domain_verification"
					)}
				/>
				{/*<meta*/}
				{/*	name="google-site-verification"*/}
				{/*	content={getSettingValue(settings, "google_site_verification")}*/}
				{/*/>*/}
				{headerScript != undefined ? (
					<>
						<script
							strategy="afterInteractive"
							dangerouslySetInnerHTML={{
								__html: `
                      ${getSettingValue(settings, "header_script")}
                  `,
							}}
						></script>
						{ReactHtmlParser(getSettingValue(settings, "header_script"))}
					</>
				) : (
					""
				)}

				<meta name="google-site-verification" content="Af_lPxZKN27trkNwTiwgU2AnGI8Boi0owg-t6c0h2cw" />
			</Head>
			<Header />
			{user?.password_update == 0 ? (
				<main>
					<Password
						redirectIfUpdate={true}
						message={
							"please update your password first as instruct for browsing our website"
						}
					/>
				</main>
			) : (
				<main>{children}</main>
			)}
			{<Footer />}
			<FixMenu />
			{getSettingValue(settings, "show_website_popup") == "on" &&
				!hasCookie("popup") && (
					<Popup
						getSettingValue={getSettingValue}
						submitSubscribe={submitSubscribe}
						setEmail={setEmail}
						email={email}
						phone={phone}
						setPhone={setPhone}
					/>
				)}
			<QuickVew />
			{/* facebook pixel */}
			<noscript>
				<img
					height="1"
					width="1"
					style={{ display: "none" }}
					src={`https://www.facebook.com/tr?id=${getSettingValue(
						settings,
						"facebook_chat_id"
					)}&ev=PageView&noscript=1`}
				/>
			</noscript>
			{/* facebook chat */}
			{/* <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-N833ZV3"
          height="0"
          width="0"
          style={{ display: "none", width: "1px", height: "1px" }}
        ></iframe>
      </noscript> */}
			<div id="fb-root"></div>
			<div
				class="fb-customerchat"
				attribution="setup_tool"
				page_id={`${getSettingValue(settings, "facebook_chat_id")}`}
			></div>
			{/* {facebookChatId != undefined && (
        <>
          <MessengerChat
            pageId={facebookChatId}
            loggedInGreeting="loggedInGreeting"
            loggedOutGreeting="loggedOutGreeting"
            greetingDialogDisplay={"show"}
            debugMode={true}
            onMessengerShow={() => {
              console.log("onMessengerShow");
            }}
            onMessengerHide={() => {
              console.log("onMessengerHide");
            }}
            onMessengerDialogShow={() => {
              console.log("onMessengerDialogShow");
            }}
            onMessengerDialogHide={() => {
              console.log("onMessengerDialogHide");
            }}
            onMessengerMounted={() => {
              console.log("onMessengerMounted");
            }}
            onMessengerLoad={() => {
              console.log("onMessengerLoad");
            }}
          />
        </>
      )} */}
			{/* messenger chat */}
			{/* footer script */}
			{beforeBodyTags != undefined && (
				<div
					dangerouslySetInnerHTML={{
						__html: `
                ${getSettingValue(settings, "before_body_tags")}
                  `,
					}}
				></div>
			)}
			{/* footer script */}
			{footerScript != undefined && (
				<Script
					strategy="lazyOnload"
					dangerouslySetInnerHTML={{
						__html: `
                ${getSettingValue(settings, "footer_script")}
                  `,
					}}
				></Script>
			)}
			{/* <Script
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            AppleID.auth.init({
                clientId: "com.sailor.serviceid", // This is the service ID we created.
                scope: "name email", // To tell apple we want the user name and emails fields in the response it sends us.
                redirectURI: "https://sailor.clothing/login", // As registered along with our service ID
                state: "origin:web", // Any string of your choice that you may use for some logic. It's optional and you may omit it.
                usePopup : true
            });
       `,
        }}
      ></Script> */}
			<GoogleAnalytics />
			<FacebookPixel />
			{/*<TawkToChat />*/}
			{/* <MessengerCustomerChat
    pageId="169795625950657"
    appId="6134f7ee89d46d6b3a30aaca34e3730b"
  />, */}
		</>
	);
}

export default MainLayout;
