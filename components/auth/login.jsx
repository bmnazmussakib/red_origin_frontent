"use client";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { post, tAlert } from "../../helpers/helper";
import { removeTemp, setUser } from "../../store/slice/AuthSlice";
import VerifyCode from "./forgotPass/verifyCode";
// import FacebookLogin from "react-facebook-login";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { deleteCookie, hasCookie } from "cookies-next";
import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, facebook } from "../../config/FirebaseConfig";
import { backendCart } from "../../store/slice/CartSlice";
import { getWishListBackend } from "../../store/slice/WishListSlice";
import { getSettingValue } from "../../utils/filters";
import { cart } from "../../utils/route";
import VerifyModal from "./VerifyModal";
// import {
//     LoginSocialGoogle
//   } from 'reactjs-social-login'

const Login = () => {
	const forgotRef = useRef();
	let [loadingLogin, setLoadingLogin] = useState(false);
	let settings = useSelector((state) => state.globalSetting.globalsetting);
	const [data, setData] = useState();
	const [remember, setRemember] = useState(false);
	const [verifyModal, setVerifyModal] = useState(false);
	let [verifyData, setVerifyData] = useState(null);
	const [forgotData, setForgotData] = useState({
		email_or_phone: "",
		send_code_by: "",
	});
	let authSlice = useSelector((state) => state.authSlice);
	let cartSlice = useSelector((state) => state.cartSlice);
	const router = useRouter();
	let dispatch = useDispatch();

	// const [provider, setProvider] = useState('')
	// const [profile, setProfile] = useState(null)
	//
	// const onLoginStart = useCallback(() => {
	//   alert('login start')
	// }, [])
	//
	// const onLogoutSuccess = useCallback(() => {
	//   setProfile(null)
	//   setProvider('')
	//   alert('logout success')
	// }, [])

	// const initApple = () => {
	//   window.AppleID.auth.init({
	//     clientId: "com.sailor.clothing", // This is the service ID we created.
	//     scope: "name email", // To tell apple we want the user name and emails fields in the response it sends us.
	//     redirectURI: "https://backend.rise-brand.com/login", // As registered along with our service ID
	//     state: "origin:web", // Any string of your choice that you may use for some logic. It's optional and you may omit it.
	//     usePopup: true, // Important if we want to capture the data apple sends on the client side.
	//   });
	// };

	const singInApple = async () => {
		const response = await window.AppleID.auth.signIn();

		return response;
	};
	const handleChange = (e) => {
		setData((data) => {
			return { ...data, [e.target.name]: e.target.value };
		});
	};

	let fetchCart = async (access_token) => {
		let { data: carts } = await axios
			.post(
				cart.CARTS,
				{},
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				}
			)
			.catch((error) => {
				console.log(error);
				router.reload();
			});
		if (cart && carts[0] && carts[0].cart_items) {
			dispatch(
				backendCart({
					carts: carts[0]?.cart_items,
				})
			);
			return carts[0]?.cart_items;
		}
	};
	let fetchCartThree = async (access_token) => {
		let { data: carts } = await axios
			.post(
				cart.CARTS,
				{},
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				}
			)
			.catch((error) => {
				console.log(error);
				router.reload();
			});
		if (carts) {
			dispatch(
				backendCart({
					carts: carts,
				})
			);
			return carts;
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		setLoadingLogin(true);
		post("/v2/auth/login", "", {
			...data,
			temp_guest_user_no: authSlice?.tempId,
		})
			.then(async (res) => {
				console.log(res);
				if (res.data.result == true) {
					//? set redux
					let { user, access_token } = res.data;
					dispatch(
						setUser({
							user,
							token: access_token,
							tempId: null,
							remember: remember,
						})
					);
					dispatch(removeTemp());
					let backendCarts = await fetchCartThree(access_token);
					console.log(backendCarts);
					dispatch(getWishListBackend(access_token));
					tAlert("login successfully", "success");
					if (hasCookie("checkout_redirect")) {
						deleteCookie("checkout_redirect");
						router.push("/cart");
						return false;
					}
					if (backendCarts && backendCarts.length > 0) {
						router.push("/cart");
						return false;
					}
					router.push("/profile");
				}
			})
			.catch((error) => {
				console.log(error);
				setLoadingLogin(false);
				if (!error?.response?.data?.verify) {
					var myModal = new bootstrap.Modal(
						document.getElementById("staticBackdroplogin")
					);
					myModal.show();
				}
				setVerifyData(error?.response?.data?.data);
				toast(error.response.data.message);
			});
	};

	const handleFacebookLogin = () => {
		signInWithPopup(auth, facebook)
			.then((result) => {
				console.log(result);
				// This gives you a Facebook Access Token. You can use it to access the Facebook API.
				const credential =
					FacebookAuthProvider.credentialFromResult(result);

				let userInfo = result.user;
				console.log("fffffb", userInfo, credential);
				userInfo.name = result.user.displayName;
				if (credential) {
					socialLoginHandler(
						userInfo,
						"web_facebook",
						result.user.providerData[0].uid
					);
				}
			})
			.catch((err) => {
				toast.error(err?.message || "Something went wrong");
				console.log(err);
			});
	};

	const loginGoogle = useGoogleLogin({
		onSuccess: async (credentialResponse) => {
			console.log(credentialResponse);

			let userInfo = await axios
				.get("https://www.googleapis.com/oauth2/v3/userinfo", {
					headers: {
						Authorization: `Bearer ${credentialResponse.access_token}`,
					},
				})
				.then((res) => res.data);
			console.log(userInfo);
			if (userInfo) {
				socialLoginHandler(userInfo, "web_google", userInfo.sub);
			}
		},
		onError: () => {
			console.log("Login Failed");
		},
	});

	const socialLoginHandler = (
		userInfo,
		social_provider = "web_google",
		provider_id
	) => {
		post("v2/auth/social-login", "", {
			social_provider,
			social_user: userInfo,
			provider: provider_id,
			email: userInfo.email,
			name: userInfo.name,
			temp_guest_user_no: authSlice?.tempId,
		})
			.then(async (res) => {
				console.log(res);
				if (res.data.result == true) {
					//? set redux
					let { user, access_token } = res.data;
					dispatch(
						setUser({
							user,
							token: access_token,
							tempId: null,
							remember: remember,
						})
					);
					dispatch(removeTemp());
					let backendCarts = await fetchCartThree(access_token);
					console.log(backendCarts);
					dispatch(getWishListBackend(access_token));
					tAlert("login successfully", "success");
					if (hasCookie("checkout_redirect")) {
						deleteCookie("checkout_redirect");
						router.push("/cart");
						return false;
					}
					if (backendCarts && backendCarts.length > 0) {
						router.push("/cart");
						return false;
					}
					router.push("/profile");
				}
			})
			.catch((error) => {
				console.log(error);
				setLoadingLogin(false);
				toast(error.response.data.message);
			});
	};
	const socialLogin = (type, data) => {
		if (loadingLogin) return;
		if (type == "") {
			toast("Please select a social login provider");
			return;
		}
		setLoadingLogin(true);

		post("/v2/auth/social-login", "", {
			provider: data?.id,
			social_provider: type,
			social_user: data,
			temp_guest_user_no: authSlice?.tempId,
		})
			.then(async (res) => {
				if (res.data.result == true) {
					//? set redux
					let { user, access_token } = res.data;
					dispatch(
						setUser({
							user,
							token: access_token,
							tempId: null,
							remember: remember,
						})
					);
					dispatch(removeTemp());
					let backendCarts = await fetchCart(access_token);
					dispatch(getWishListBackend(access_token));

					tAlert("login successfull", "success");
					router.push("/");
				}
			})
			.catch((error) => {
				setLoadingLogin(false);
				// // //console.log(error)
				toast("please try again", "error");
			});
	};

	const rememberMe = () => {
		setRemember(!remember);
	};

	const forgetPassModal = () => {
		var myModal = new bootstrap.Modal(
			document.getElementById("staticBackdropForgot")
		);
		myModal.show();
	};

	const handleForgotPass = (e) => {
		setForgotData((data) => {
			return { ...data, [e.target.name]: e.target.value };
		});
	};
	const handleFocusOut = (e) => {
		let numberRegx = /^-?\d+$/;
		// var phoneRegx = /^[1-9]{1}[0-9]{9}$/;
		var validRegex =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

		if (e.target.value != "") {
			if (e.target.value.match(validRegex)) {
				setForgotData((data) => {
					return { ...data, send_code_by: "email" };
				});
				return;
			} else if (
				!e.target.value.match(validRegex) &&
				!e.target.value.match(numberRegx)
			) {
				toast.error("please enter a valid email address");
				return;
			} else if (e.target.value.match(numberRegx)) {
				setForgotData((data) => {
					return { ...data, send_code_by: "phone" };
				});
				return;
			} else if (!e.target.value.match(numberRegx)) {
				toast.error("please enter a valid phone number");
				return;
			}
		}
	};

	const submitForgotCode = (e) => {
		e.preventDefault();
		post("/v2/auth/password/forget_request", "", forgotData)
			.then((res) => {
				// //console.log(res);
				if (res.data.result == true) {
					toast("verification code sent to your email/phone");
					setVerifyModal(true);
				}
			})
			.catch((error) => {
				toast.error(error.response.data.message);
			});
	};

	useEffect(() => {}, [forgotData]);

	return (
		<div
			className="tab-pane fade show active"
			id="login-tab-pane"
			role="tabpanel"
			aria-labelledby="login-tab"
			tabIndex="0"
		>
			<div className="card login-reg-card shadow-sm">
				<div className="card-body">
					<h4 className="card-title text-center mb-4">Login</h4>
					<form onSubmit={handleSubmit}>
						<div className="form-group">
							<input
								type="text"
								name="email"
								onChange={handleChange}
								className="form-control"
								placeholder="Enter email / phone number"
							/>
						</div>
						<div className="form-group">
							<input
								type="password"
								name="password"
								onChange={handleChange}
								className="form-control"
								id=""
								placeholder="Password"
							/>
						</div>
						<input
							type="checkbox"
							name="remember"
							id="remember"
							className=""
							onClick={rememberMe}
						/>{" "}
						&nbsp; Keep me logged in
						<button
							type="submit"
							className="btn btn-primary login-btn logo-bg-color"
							disabled={loadingLogin}
						>
							Login Now
						</button>
						{getSettingValue(settings, "facebook_login") == "1" && (
							<button
								type="button"
								onClick={handleFacebookLogin}
								className="btn btn-primary login-btn fb-login bg-transparent"
								style={{ color: "#d30000", border: "1px solid " }}
							>
								{/*<i class="fa-brands fa-facebook-f"></i>*/}
								Facebook
							</button>
						)}
						{getSettingValue(settings, "google_login") == "1" && (
							<button
								type="button"
								onClick={loginGoogle}
								className="btn btn-primary login-btn google-login bg-transparent mb-2"
								style={{ color: "#d30000", border: "1px solid " }}
							>
								{/*<i class="fa-brands fa-google"></i>*/}
								Google
							</button>
						)}
						<div className="w-100 text-center">
							<a className="forget-pass" onClick={forgetPassModal}>
								Forgot your password?
							</a>
						</div>
					</form>
				</div>
			</div>

			{/*modal*/}
			<div
				className="modal forgot-pass-modal fade"
				id="staticBackdropForgot"
				data-bs-backdrop="static"
				data-bs-keyboard="false"
				tabIndex="-1"
				aria-labelledby="staticBackdropLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="staticBackdropLabel">
								Forgot Password
							</h1>
							{/*<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>*/}
						</div>

						{!verifyModal ? (
							<>
								<div className="modal-body" id="forgot_modal_body">
									<label className="mb-2" htmlFor="">
										Email / Phone
									</label>
									<input
										type="text"
										name="email_or_phone"
										ref={forgotRef}
										onBlur={handleFocusOut}
										onChange={handleForgotPass}
										className="form-control mb-2"
										placeholder="Enter email / phone number"
									/>
									<div className="text-danger">
										{/*{errors != undefined ? errors?.verify_code : ''}*/}
									</div>
									<small>
										please enter the email/phone that register here.
									</small>
								</div>

								<div
									className="modal-footer border-0"
									id="forgot_modal_footer"
								>
									<button
										type="button"
										className="btn btn-danger"
										data-bs-dismiss="modal"
									>
										Close
									</button>
									<button
										type="button"
										className="btn btn-dark"
										onClick={submitForgotCode}
									>
										Send Code
									</button>
								</div>
							</>
						) : (
							verifyModal && (
								<VerifyCode
									user_data={forgotData}
									setVerifyModal={setVerifyModal}
								/>
							)
						)}
					</div>
				</div>
			</div>
			{/*modal*/}
			<VerifyModal verifyData={verifyData} />
			<ul className="nav social-login-nav">
				{/* <li className="nav-item" disabled={loadingLogin}>
          {router?.query?.platform == "ios" ? (
            <></>
          ) : (
            <FacebookLogin
              appId="2443936469172922"
              // autoLoad
              fields="name,email,picture"
              callback={(e) => socialLogin("web_facebook", e)}
              render={(renderProps) => (
                <a
                  href="Javascript:void(0)"
                  onClick={renderProps.onClick}
                  className="nav-link facebook"
                  disabled={loadingLogin}
                >
                  <i className="icofont-facebook"></i>
                </a>
              )}
            />
          )}
        </li> */}
				<li className="nav-item" disabled={loadingLogin}>
					{/* <div
            id="appleid-signin"
            data-color="black"
            data-border="true"
            data-type="sign in"
          ></div> */}

					{/* <button
            onClick={() => {
              initApple();
              singInApple();
            }}
            style={{
              backgroundColor: "white",
              padding: 5,
              border: "1px solid black",
              fontFamily: "none",
              fontSize: "20px",
              borderRadius: "5px",
            }}
          >
            <i className="fa-brands fa-apple px-2 "></i>
          </button> */}
				</li>

				{/* <li className="nav-item " disabled={loadingLogin}>
          <GoogleLogin
            clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
            render={(renderProps) => (
              <a
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                href="Javascript:void(0)"
                className="nav-link google"
              >
                <i className="fa-brands fa-google"></i>
              </a>
            )}
            buttonText="Login"
            onSuccess={(response) => {
              socialLogin("web_facebook", response);
            }}
          />
        </li> */}

				{/* <li className="nav-item">
          <a href="" className="nav-link instagram">
            <i className="icofont-instagram"></i>
          </a>
        </li>

        <li className="nav-item ">
          <a href="" className="nav-link linkedin">
            <i className="fa-brands fa-linkedin"></i>
          </a>
        </li> */}
			</ul>
		</div>
	);
};

export default Login;
