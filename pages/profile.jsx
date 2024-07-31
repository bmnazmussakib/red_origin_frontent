import React from "react";
import ProfileSidebar from "../components/common/ProfileSidebar";
import ProtectedLayout from "../layouts/ProtectedLayout";
import { post, tAlert } from "../helpers/helper";
import { profile } from "../utils/route";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setUser } from "../store/slice/AuthSlice";
import produce from "immer";

const Profile = () => {
  let router = useRouter();
  let dispatch = useDispatch();
  let state = useSelector((state) => state?.authSlice?.user);
  let token = useSelector((state) => state?.authSlice?.token);

  let [profileInfo, setProfileInfo] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  let profileUpdate = async () => {
    let result = await post(profile.PROFILE_UPDATE, "", profileInfo).catch(
      (err) => {
        tAlert("please try Again", "error");
        if (err?.response?.status === 401) {
          tAlert("please login again", "error");
          router.push("/login");
        }
        return false;
      }
    );
    if (result.status === 200 && result.data.result == true) {
      let userInfo = {
        ...state,
        name: profileInfo.name,
        email: profileInfo.email,
        phone: profileInfo.phone,
        address: profileInfo.address,
      };

      dispatch(
        setUser({
          user: userInfo,
          token: token,
        })
      );
      tAlert("profile updated", "success");
    }
  };
  useEffect(() => {
    if (state) {
      // //console.log(state);
      let { name, email, phone, address } = state;
      
      setProfileInfo({
        name,
        email,
        phone,
        address,
      });
    }
  }, []);
  let handleChange = (e) => {
    setProfileInfo((profileInfo) => {
      return { ...profileInfo, [e.target.name]: e.target.value };
    });
  };
  return (
    <>
      {/* <ProtectedLayout> */}
      <section className="breadcrum-main mb-0">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">Home</a>
                  </li>

                  <li className="breadcrumb-item">
                    <a disabled>profile </a>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>
      <section className="userprofile-main">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-3">
              <ProfileSidebar />
            </div>
            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-9">
              <div className="personal-information">
                <div className="common-fieldset-main">
                  <fieldset className="common-fieldset">
                    <legend className="rounded-0">Personal Information</legend>
                    <div className="row">
                      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="form-group">
                          <label for="last-name" className="form-label">
                            Name
                          </label>
                          <input
                            onChange={handleChange}
                            id="last-name"
                            className="form-control"
                            type="text"
                            name="name"
                            autocomplete="family-name"
                            placeholder="Full Name"
                            value={profileInfo.name}
                          />
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
                            onChange={handleChange}
                            id="phone-number"
                            className="form-control"
                            type="text"
                            name="phone"
                            autocomplete="tel"
                            inputmode="tel"
                            required=""
                            placeholder="Phone Number"
                            readOnly={profileInfo.phone ? true : false}
                            value={profileInfo.phone}
                          />
                        </div>
                      </div>
                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group">
                          <label for="email-address" className="form-label">
                            Email address
                          </label>
                          <input
                            id="email-address"
                            className="form-control"
                            type="email"
                            name="email-address"
                            autocomplete="email"
                            inputmode="email"
                            readOnly={profileInfo.email ? true : false}
                            placeholder="E-mail Address"
                            value={profileInfo.email}
                          />
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
                            onChange={handleChange}
                            className="form-control"
                            id="address"
                            name="address"
                            autocomplete="shipping address-line1"
                            required=""
                            style={{ height: "100px" }}
                            placeholder="Address Details"
                            value={profileInfo.address}
                          >
                            {profileInfo.address}
                          </textarea>
                        </div>
                      </div>
                      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-md-end text-center">
                        <button
                          type="button"
                          className="continue-btn "
                          onClick={profileUpdate}
                        >
                          update
                        </button>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* </ProtectedLayout> */}
    </>
  );
};
Profile.protected = true;
export default Profile;
