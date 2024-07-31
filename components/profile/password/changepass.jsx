import React, { useState } from "react";
import { post } from "../../../helpers/helper";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../store/slice/AuthSlice";
import { useRouter } from "next/router.js";

const Changepass = ({ redirectIfUpdate }) => {
  const [data, setData] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });
  const router = useRouter();
  const dispatch = useDispatch();
  const authSlice = useSelector((state) => {
    return state.authSlice;
  });
  const [errors, setErrors] = useState();
  const handleChange = (e) => {
    setData((data) => {
      return { ...data, [e.target.name]: e.target.value };
    });
  };

  const updatePassword = (e) => {
    e.preventDefault();
    post("/v2/password/update", "", data)
      .then((res) => {
        if (res.data.result == true) {
          toast(res.data.message, {
            autoClose: 5000,
          });
          setData({
            old_password: "",
            password: "",
            password_confirmation: "",
          });
          setErrors();

          //redirect to main page if password is currently update
          if (redirectIfUpdate == true) {
            //password_update set to 1 in redux
            let newState = {
              ...authSlice,
              user: { ...authSlice.user, password_update: 1 },
            };

            dispatch(setUser(newState));

            router.push("/");
          }
          router.push('/profile')
        } else {
          setErrors(res.data.errors);
        }
      })
      .catch((error) => {
        setErrors(error.response.data.errors);
      });
  };
  return (
    <div>
      <div className="row">
        {/* <div className="col-6">
          <label htmlFor="">Old Password</label>
          <input
            type="password"
            name="old_password"
            value={data?.old_password}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        {errors != undefined && (
          <div className="text-danger">{errors?.old_password}</div>
        )} */}

        <div className="col-6">
          <label htmlFor="">New Password</label>
          <input
            type="password"
            name="password"
            value={data?.password}
            onChange={handleChange}
            className="form-control"
          />
          {errors != undefined && (
            <div className="text-danger">{errors.password}</div>
          )}
        </div>

        <div className="col-6">
          <label htmlFor="">Confirm Password</label>
          <input
            type="password"
            name="password_confirmation"
            value={data?.password_confirmation}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      </div>
      <button className="btn btn-outline-dark mt-3" onClick={updatePassword}>
        Update{" "}
      </button>
    </div>
  );
};

export default Changepass;
