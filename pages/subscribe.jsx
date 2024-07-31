import React from "react";
import ProfileSidebar from "../components/common/ProfileSidebar";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { get, post, tAlert } from "../helpers/helper";
import { subscribe_route } from "../utils/route";
import axios from "axios";
import {use} from "i18next";

const Subscribe = () => {
  let [subscribe, setSubscribe] = React.useState({
    email: "",
    status: true,
  });
  let auth = useSelector((state) => state.authSlice.user);
  let handleChange = (e) => {
    setSubscribe({
      ...subscribe,
      [e.target.name]: e.target.value,
    });
  };
  let subScribeStatus = async (e) => {
    let result = await get(subscribe_route.SUBSCRIBE + "/" + auth?.email).catch(
      (error) => {
        console.error(error);
      }
    );
    if (result?.status == 200) {
      setSubscribe({
        ...subscribe,
        status: true,
      });
    } else {
      setSubscribe({
        email: auth?.email,
        status: false,
      });
    }
  };
  let subscribeNow = async (e) => {
    if (subscribe.email == "" || subscribe.email == null) {
      tAlert("Please enter your email address", "error");
    }
    let result = await post(subscribe_route.SUBSCRIBE, null, {
      email: subscribe.email,
    }).catch((error) => {
      console.error(error);
      tAlert(error.response.data.message)
    });
    if (result?.status == 200) {
      tAlert(
        result?.data?.message ?? "You have successfully subscribed",
        "success"
      );
      setSubscribe({
        ...subscribe,
        status: true,
      });
    }
  };
  const unSubscribe = async () => {
    let result = await  get('subscribe-delete').catch((error) => {
      console.error(error);
    });

    if (result?.status == 200) {
      tAlert(
          result?.data?.message,
          "success"
      );
      setSubscribe({
        email: '',
        status: false,
      });
    }
    if(result?.data?.status == false) {
      tAlert(
          result?.data?.message,
          "error"
      );
      setSubscribe({
        ...subscribe,
        status: false,
      });
    }
  }
  useEffect(() => {
    subScribeStatus();
  }, []);
  useEffect(() => {

  },[subscribe])
  return (
    <>
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
                    <a disabled>Subscribe </a>
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
                    <legend className="rounded-0">Subscribe</legend>
                    <div className="row">
                      {subscribe.status ? (
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                          <h4 className="text-center subscription-status">
                            You Are Already Subscribed
                          </h4>
                          <button className={'btn btn-danger text-center'} onClick={unSubscribe}>unsubscribe</button>
                        </div>
                      ) : (
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
                              name="email"
                              autocomplete="family-name"
                              placeholder="Full Email"
                              value={subscribe.email}
                            />
                          </div>
                          <button
                            type="button"
                            className="continue-btn mr-3"
                            onClick={subscribeNow}
                          >
                            Subscribe Now
                          </button>
                        </div>
                      )}
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

Subscribe.protected=true;
export default Subscribe;
