import React, {useRef, useState} from 'react';
import {post} from "../../helpers/helper";
import {toast} from "react-toastify";
import {removeTemp, setUser} from "../../store/slice/AuthSlice";
import {useSelector} from "react-redux";
import {useRouter} from "next/router";

function VerifyModal({verifyData}) {

    const modalRef = useRef();
    const [errors, setErrors] = useState();
    const [verification_code, setVerification_code] = useState("");
    let authSlice = useSelector((state) => state.authSlice);
    const router = useRouter();

    const handleCode = (e) => {
       setVerification_code(e.target.value);
    };

    const resendCode = async () => {
        await post("/v2/auth/resend_code", "", {
            user_id: verifyData.user_id,
            register_by: verifyData.country_code == "BD" ? "phone" : "email",
        })
            .then((res) => {
                toast(res.data.message, {
                    autoClose: 5000,
                });
            })
            .catch((error) => {});
    };
    const verifyCode = async () => {
        await post("/v2/auth/confirm_code", "", {
            ...verifyData,
            temp_guest_user_no: authSlice?.tempId,
            verification_code: verification_code
        })
            .then((res) => {
                if (res.data.result == true) {
                    var genericModalEl = document.getElementById("staticBackdroplogin");
                    var modal = bootstrap.Modal.getInstance(genericModalEl);
                    modal.hide();

                    setErrors(); // empty verify error message
                    toast("Verification successful", {
                        autoClose: 5000,
                    });
                    //router.push("/");
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

    return (
        <>
            {/*modal*/}
            <div
                className="modal fade"
                id="staticBackdroplogin"
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
                            <small>
                                please check your number for the verification code.
                            </small>
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
        </>
    );
}

export default VerifyModal;