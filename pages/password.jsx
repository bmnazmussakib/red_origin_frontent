import React, { useEffect, useState } from 'react';
import ProfileSidebar from '../components/common/ProfileSidebar';
import { post } from '../helpers/helper';
import { toast } from 'react-toastify';
import Changepass from '../components/profile/password/changepass';

const Password = ({ message, redirectIfUpdate }) => {
  const [firstStep, setFirstStep] = useState(true);
  const [verifyData, setVerifyData] = useState({
    email_or_phone: '',
    send_code_by: '',
  });
  const [errors, setErrors] = useState();
  const [changePass, setChangePass] = useState(false);
  const [verification, setVerification] = useState('');
  const handleSendCode = (e) => {
    e.preventDefault();
    post('v2/auth/password/forget_request', '', verifyData)
      .then((res) => {
        if (res.data.result == true) {
          toast(
            'verification code sent to your email/phone,please check your phone',
            {
              autoClose: 5000,
            }
          );
        }
        setFirstStep(false);
      })
      .catch((error) => {
        setErrors(error.response.data.errors);
      });
  };
  const handleVerify = () => {
    post('v2/auth/password/check_verify', '', {
      send_code_by: verifyData.send_code_by,
      email_or_phone: verifyData.email_or_phone,
      verification_code: verification,
    }).then((res) => {
      if (res.data.result == true) {
        toast("Verified successfully", {
          autoClose: 5000,
        });
        setChangePass(true);
      }
      if (res.data.result == false) {
        setErrors(res.data.message);
      }
    });
  };

  const handleFocusOut = (e) => {
    let numberRegx = /^-?\d+$/;
    // var phoneRegx = /^[1-9]{1}[0-9]{9}$/;
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (e.target.value != '') {
      if (e.target.value.match(validRegex)) {
        setVerifyData((data) => {
          return { ...data, send_code_by: 'email' };
        });
        return;
      } else if (
        !e.target.value.match(validRegex) &&
        !e.target.value.match(numberRegx)
      ) {
        toast.error('please enter a valid email address');
        return;
      } else if (e.target.value.match(numberRegx)) {
        setVerifyData((data) => {
          return { ...data, send_code_by: 'phone' };
        });
        return;
      } else if (!e.target.value.match(numberRegx)) {
        toast.error('please enter a valid phone number');
        return;
      }
    }
  };

  const handleChange = (e) => {
    setVerifyData((data) => {
      return {
        ...data,
        [e.target.name]: e.target.value,
      };
    });
  };
  useEffect(() => {}, []);
  return (
    <>
      <section className="breadcrum-main mb-0">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>

                  <li className="breadcrumb-item">
                    <a disabled>password </a>
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
            <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
              <ProfileSidebar />
            </div>
            <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
              <div className="personal-information">
                <div className="common-fieldset-main">
                  <fieldset className="common-fieldset">
                    <legend className="rounded-0">Password Update</legend>

                    {changePass ? (
                      <Changepass redirectIfUpdate={redirectIfUpdate} />
                    ) : firstStep == true ? (
                      <div>
                        <div className="row">
                          <div className="col-12">
                            <label htmlFor="" className="form-label">
                              Phone/Email
                            </label>
                            <input
                              type="text"
                              name="email_or_phone"
                              className="form-control"
                              onChange={handleChange}
                              onBlur={handleFocusOut}
                              placeholder="Type you phone/email"
                            />
                            <small style={{ color: 'gray' }}>
                              Type your email or password that you use for login
                              here
                            </small>
                            {errors != undefined && (
                              <div className="text-danger">
                                {errors.email_or_phone}
                              </div>
                            )}

                            <button
                              className="continue-btn d-block"
                              onClick={handleSendCode}
                            >
                              Send Code
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 text-danger ">
                          <small>
                            <strong>{message}</strong>
                          </small>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="row">
                          <div className="col-12">
                            <label htmlFor="" className="form-label">
                              Verication Code
                            </label>
                            <input
                              type="number"
                              name="verification_code"
                              value={verification}
                              onChange={(e) => setVerification(e.target.value)}
                              className="form-control"
                            />
                            {errors != undefined && (
                              <div className="text-danger mt-4">{errors}</div>
                            )}
                            <button
                              className="continue-btn d-blocl"
                              onClick={handleVerify}
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/*<Changepass />*/}
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
Password.protected = true;
export default Password;
