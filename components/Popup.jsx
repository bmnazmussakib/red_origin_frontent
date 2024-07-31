import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { cookie, get } from "../helpers/helper";

const Popup = ({
  getSettingValue,
  setEmail,
  submitSubscribe,
  email,
  phone,
  setPhone,
}) => {
  let settings = useSelector((state) => state.globalSetting.globalsetting);
  let [imageLink, setImageLink] = useState(null);
  const submit = (e) => {
    e.preventDefault();
    submitSubscribe();
  };
  let fetchImageLink = async () => {
    let { data, status } = await get(
      "/v2/image-link/" + getSettingValue(settings, "website_popup_content")
    ).catch((err) => {
      //console.log(err);
    });
    if (status == 200) {
      setImageLink(data?.data);
    }
  };
  useEffect(() => {
    var myModal = new bootstrap.Modal(
      document.getElementById("examplePopUpModal")
    );
    myModal.show();
    fetchImageLink();
    return () => {
      myModal.hide();
    };
  }, []);
  return (
    <div
      className="modal fade popup"
      id="examplePopUpModal"
      tabIndex="-1"
      aria-labelledby="examplePopUpModal"
      data-backdrop="static"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <button
            type="button"
            className="btn-close"
            // data-bs-dismiss="modal"
            // aria-label="Close"
            onClick={() => {
              var myModalEl = document.getElementById("examplePopUpModal");
              var modal = bootstrap.Modal.getInstance(myModalEl);
              cookie("popup", "true", "set");

              modal.hide();
              document.querySelector(".modal-backdrop").remove();
            }}
          ></button>
          <div className="modal-body">
            <div className="modal-content-flex">
              <div
                className="left-box"
                style={
                  getSettingValue(settings, "show_subscribe_form") == null
                    ? { flexBasis: "100%" }
                    : { flexBasis: "50%" }
                }
              >
                <img src={imageLink} alt="image" className="img-fluid w-100" />
              </div>

              {getSettingValue(settings, "show_subscribe_form") == "on" && (
                <div className="right-box">
                  <div className="popup-bg">
                    <div
                      className={
                        getSettingValue(settings, "show_subscribe_form") == "on"
                          ? "modal-content-box"
                          : "d-none"
                      }
                    >
                      <div className="newsletter-content">
                        <h3>LET’S STAY IN TOUCH!</h3>
                        <p>
                          Keep yourself updated with the latest Solasta News,
                          Fashion Updates and Blogs! Subscribe here!
                        </p>

                        <div className="form-group">
                          <div>
                            <input
                              type="tel"
                              className="form-control"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              id="exampleFormControlInput1"
                              placeholder="Type your Phone"
                            />
                            <div className="text-center">
                              <p className="text-danger">OR</p>
                            </div>
                            <input
                              type="email"
                              className="form-control mt-0"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              id="exampleFormControlInput1"
                              placeholder="Type your email"
                            />
                          </div>

                          <button
                            className="btn "
                            id="modal_subscribe"
                            onClick={submit}
                          >
                            Subscribe
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
