import React from "react";
import Registration from "../components/auth/registration";
import Login from "../components/auth/login";
import AppleLogin from "react-apple-login";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/router'
import { tAlert } from "../helpers/helper";

const login = () => {
  // const clientSecret = appleSignin.getClientSecret({
  //   clientID: "com.sailor.clothing", // Apple Client ID
  //   teamID: "9CP95N25MZ", // Apple Developer Team ID.
  //   privateKey:
  //     "eyJraWQiOiJEMjJBNVRHNjg4IiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiI5Q1A5NU4yNU1aIiwiaWF0IjoxNjgxMjgyODI0LCJleHAiOjE2OTY4MzQ4MjQsImF1ZCI6Imh0dHBzLy9hcHBsZWlkLmFwcGxlLmNvbSIsInN1YiI6ImNvbS5zYWlsb3IuY2xvdGhpbmcifQ.twV4z9H_RWWfVp4y8FLfA2e53qXFf5_hR7qIVUEBOZWUzrQN96_aiWTxfmKWXPQl6x5tsBBcGEgI9jraKiQlGg",
  //   keyIdentifier: "XXX", // identifier of the private key.
  //   // OPTIONAL
  //   expAfter: 15777000, // Unix time in seconds after which to expire the clientSecret JWT. Default is now+5 minutes.
  // });

  // const options = {
  //   clientID: "", // Apple Client ID
  //   redirectUri: "http://localhost:3000/auth/apple/callback", // use the same value which you passed to authorisation URL.
  //   clientSecret: clientSecret,
  // };

  let authSlice = useSelector((state) => state.authSlice);
  console.log('authSlice: ', authSlice)
  const router = useRouter()
  //if (authSlice?.user) {
    //router.push('/profile');
    // tAlert('You already logged in', 'warning')
  //}

  return (
    <>
      <section className="log-register-main">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="login-reg-tabs">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="login-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#login-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="login-tab-pane"
                      aria-selected="true"
                    >
                      login
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="reg-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#reg-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="reg-tab-pane"
                      aria-selected="false"
                    >
                      registration
                    </button>
                  </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                  <Login />
                  <Registration />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default login;

{
  /* <script src="./assets/js/int-telephone.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js"></script>
    <script src="./assets/js/custom.js"></script>
    <script>
        $("#mobile_code").intlTelInput({
            initialCountry: "bd",
            separateDialCode: true,

        });
    </script> */
}
