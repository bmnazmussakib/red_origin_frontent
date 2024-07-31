import React, { useEffect, useRef, useState } from "react";
import { get, post } from "../../helpers/helper";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { removeTemp, setUser } from "../../store/slice/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { getWishListBackend } from "../../store/slice/WishListSlice";
import Link from "next/link";
import { getSettingValue } from "../../utils/filters";
const countryCodes = require("country-codes-list");
const myCountryCodesObject = countryCodes.customList(
  "countryCode",
  "{countryCallingCode}"
);

const Registration = () => {
  const router = useRouter();
  const modalRef = useRef();
  let dispatch = useDispatch();
  let authSlice = useSelector((state) => state.authSlice);
  let settings = useSelector((state) => state.globalSetting.globalsetting);
  // const [countryList, setCountryList] = useState([]);
  const [user_data, setUserData] = useState({
    user_id: "",
    verification_code: "",
  });
  const [regData, setRegData] = useState({
    country_code: "BD",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState();
  const fetchCountryList = async () => {
    let { data } = await get("/v2/countries");
    // setCountryList(data.data)
  };
  const handleChange = (e) => {


    if (e.target.name == "country_code" && e.target.value == "BD") {
      setRegData({
        ...regData,
        [e.target.name]: e.target.value,
      });
    } else if (e.target.name == "country_code" && e.target.value != "BD") {
      // console.log("en");
      // let phone_code = document.getElementById("phone-code");
      // let emailTag = document.getElementById("email");
      // emailTag.classList.remove("d-none");
      // phone_code.classList.add("d-none");
      setRegData({
        ...regData,
        [e.target.name]: e.target.value,
      });
    } else {
      setRegData({
        ...regData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // let dataObj;
    // if (regData.country_code == "BD") {
    //     dataObj = {
    //         country_code: regData.country_code,
    //         phone: regData.phone,
    //         email: regData.email,
    //         password: regData.password,
    //         password_confirmation: regData.password_confirmation,
    //     };
    // } else {
    //     dataObj = regData;
    // }

    let token = await axios
      .get(
        (process.env.NEXT_PUBLIC_SERVER_MAIN_URL ??
          "https://backend.rise-brand.com/") + "sanctum/csrf-cookie"
      )
      .then(async () => {
        let data = await post("/v2/auth/signup", "", regData)
          .then((res) => {

            let { user, access_token, user_id, message } = res.data;
            console.log('res.data: ', res.data)

            setUserData((data) => {
              return { ...data, user_id: user_id };
            });
            toast(message, {
              autoClose: 5000,
            }); // success message

            if (getSettingValue(settings, 'otp_login') != undefined && getSettingValue(settings, 'otp_login') == 0) {
              dispatch(
                  setUser({
                    user,
                    token: access_token,
                    tempId: null,
                    remember: false,
                  })
              );
              dispatch(removeTemp());
              router.push("/profile");
            }
            else {
              modalRef.current.value = ""; //empty modal input when its show first
              var myModal = new bootstrap.Modal(
                  document.getElementById("staticBackdrop")
              );
              myModal.show();
              setErrors(); //empty error when registration is successful
            }
          })
          .catch((error) => {
            // //console.log(error.response.data.errors)
            setErrors(error.response.data.errors);
          });
      });
  };

  const handleCode = (e) => {
    setUserData((data) => {
      return { ...data, verification_code: e.target.value };
    });
  };

  const resendCode = async () => {
    await post("/v2/auth/resend_code", "", {
      user_id: user_data.user_id,
      register_by: regData.country_code == "BD" ? "phone" : "email",
    })
      .then((res) => {
        toast(res.data.message, {
          autoClose: 5000,
        });
      })
      .catch((error) => { });
  };
  const verifyCode = async () => {
    await post("/v2/auth/confirm_code", "", {
      ...user_data,
      temp_guest_user_no: authSlice?.tempId,
    })
      .then((res) => {
        if (res.data.result == true) {
          var genericModalEl = document.getElementById("staticBackdrop");
          var modal = bootstrap.Modal.getInstance(genericModalEl);
          modal.hide();

          setErrors(); // empty verify error message
          toast("Verification successful, You're now logged in", {
            autoClose: 5000,
          });
          // const triggerEl = document.querySelector(
          //     '#myTab button[data-bs-target="#login-tab-pane"]'
          // );
          // bootstrap.Tab.getInstance(triggerEl).show(); // Select tab by name

          let { user, access_token } = res.data;

          dispatch(
            setUser({
              user,
              token: access_token,
              tempId: null,
              remember: false,
            })
          );

          dispatch(removeTemp());

          router.push("/profile");
        }
        if (res.data.result == false) {
          setErrors({
            verify_code: "verify code not match",
          });
        }
      })
      .catch((error) => {
        // //console.log(error);
      });
  };

  // const resendCode = () => {
  //    post('auth/resend_code','',{
  //        user_id : user_data.user_id,
  //        verify_by : regData.country_code == 'BD' ? 'phone' : 'email'
  //    }).then((res) => {
  //
  //    }).catch((error) => {
  //
  //     })
  // }

  useEffect(() => {
    fetchCountryList();
  }, []);

  useEffect(() => {
    // if(countryList.length > 0){
    //     setRegData((data) => {
    //         return {...data,country_code: countryList[0].code}
    //     })
    // }
  }, []);

  return (
    <div
      className="tab-pane fade"
      id="reg-tab-pane"
      role="tabpanel"
      aria-labelledby="reg-tab"
      tabIndex="0"
    >
      <div className="card login-reg-card shadow-sm">
        <div className="card-body">
          <h4 className="card-title text-center mb-4">Registration</h4>
          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-0">
              <div className="col-xs-12 col-sm-3 col-md-3 col-lg-3 ">
                <select
                  name="country_code"
                  onChange={handleChange}
                  className="form-control mb-0 mb-sm-20"
                  id=""
                >
                  {Object.keys(myCountryCodesObject).length > 0 &&
                    Object.entries(myCountryCodesObject).map((country) => {
                      return (
                        <option
                          selected={country[0] === "BD" ? true : false}
                          value={country[0]}
                          data-dial={country[1]}
                        >
                          {country[0]}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div
                className="col-xs-12 col-sm-9 col-md-9 col-lg-9 "
                id="phone-code"
              >
                <input
                  type="text"
                  onChange={handleChange}
                  className="form-control mb-0"
                  placeholder="01XXXXXXXXX"
                  name="phone"
                />
              </div>
              <div className="text-danger mb-3">
                {errors != undefined ? errors?.phone : ""}
              </div>

              <div className="col-md-12 " id="email">
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  className="form-control "
                  placeholder="Enter email address (example@example.com)"
                />

                <div className="text-danger mb-3">
                  {errors != undefined ? errors?.email : ""}
                </div>
              </div>
              <div className="text-danger">
                {errors != undefined ? errors?.country_code : ""}
              </div>
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="form-control"
                id=""
                placeholder="Enter Password"
              />
              <div className="text-danger mb-3">
                {errors != undefined ? errors?.password : ""}
              </div>
            </div>
            <div className="form-group">
              <input
                type="password"
                name="password_confirmation"
                onBlur={handleChange}
                className="form-control"
                id=""
                placeholder="Enter confirm-password"
              />
            </div>
            <button type="submit" className="btn btn-primary login-btn mt-0 mb-3">
              create account
            </button>
            <div className="terms">
              <p>
                By continuing we will process your data, obtained through your
                browsing on the website, to offer you content related to your
                tastes, based on your interactions with the brand. Bear in mind that
                you can oppose this treatment. You should accept
                <Link href="/page/Terms-and-Conditions" className="logo-text-color"> terms and policy</Link> of
                www.redorigin.com.bd
              </p>
            </div>
          </form>
        </div>
      </div>

      {/*modal*/}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Verification Code
              </h1>
              {/*<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>*/}
            </div>
            <div className="modal-body">
              <label htmlFor="">Code</label>
              <input
                type="text"
                ref={modalRef}
                className="form-control"
                onChange={handleCode}
                placeholder="verification code"
              />
              {/*<button onClick={resendCode} className='btn btn-outline-dark btn-sm'>resend code</button>*/}
              <div className="text-danger">
                {errors != undefined ? errors?.verify_code : ""}
              </div>
              <small>please check your number for the verification code.</small>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={resendCode}
              >
                Resend
              </button>
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={verifyCode}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
