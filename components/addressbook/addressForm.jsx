import React, { useEffect, useState } from "react";
import { post } from "../../helpers/helper";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setUserAddress } from "../../store/slice/AuthSlice";

const AddressForm = ({
  countryList,
  data,
  setData,
  setCityList,
  setThanaList,
  setPostalList,
  setAreaList,
  cityList,
  thanaList,
  postalList,
  areaList,
  handleChange,
  setEdit,
  setReload,
}) => {
  let dispatch = useDispatch();
  let auth = useSelector((state) => {
    state.authSlice.user;
  });
  const handleSelect = (e) => {
    handleChange(e);
  };
  const [errors, setErrors] = useState();
  const submitAddress = (e) => {
    e.preventDefault();
    post("/v2/user/shipping/create", "", data)
      .then((res) => {
        if (res.data.result == true) {
          toast.success("Address save successfully", {
            autoClose: 5000,
          });
          setData((data) => {
            return {
              ...data,
              thana: "",
              postal: "",
              area: "",
              email: "",
              phone: "",
              address: "",
              country: "",
              default: false,
            };
          });
          setReload(true);
          setCityList();
          setThanaList();
          setPostalList();
          setAreaList();
        }
      })
      .catch((error) => {
        setErrors(error.response.data.errors);
        toast.error(error.response.data.message);
      });
  };

  useEffect(() => {}, [errors, data]);
  return (
    <div className="common-fieldset-main">
      <fieldset className="common-fieldset">
        <legend className="rounded-0">
          <i className="fa-regular fa-address-book"></i> Create address
        </legend>

        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <div className="form-group">
              <label htmlFor="address-state" className="form-label">
                Country
                <span data-required="true" aria-hidden="true"></span>
              </label>
              <select
                id="address-state"
                name="country"
                autoComplete="shipping address-level1"
                required=""
                className="form-control"
                onChange={handleSelect}
              >
                <option value="" disabled="" selected="">
                  Please select
                </option>
                {countryList != undefined &&
                  countryList.map((val) => {
                    return <option value={val?.id}>{val?.name}</option>;
                  })}
              </select>
              {errors != undefined && (
                <div className="text-danger">{errors?.city}</div>
              )}
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <div className="form-group">
              <label htmlFor="address-state" className="form-label">
                District
                <span data-required="true" aria-hidden="true"></span>
              </label>
              <select
                id="address-state"
                name="city"
                autoComplete="shipping address-level1"
                required=""
                className="form-control"
                onChange={handleSelect}
              >
                <option value="" disabled="" selected="">
                  Please select
                </option>
                {cityList != undefined &&
                  cityList.map((val) => {
                    return <option value={val?.id}>{val?.name}</option>;
                  })}
              </select>
              {errors != undefined && (
                <div className="text-danger">{errors?.city}</div>
              )}
            </div>
          </div>

          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <div className="form-group">
              <label htmlFor="address-state" className="form-label">
                Thana
                <span data-required="true" aria-hidden="true"></span>
              </label>
              <select
                id="address-state"
                name="thana"
                autoComplete="shipping address-level1"
                required=""
                className="form-control"
                onChange={handleSelect}
              >
                <option value="" disabled="" selected="">
                  Please select
                </option>
                {thanaList != undefined &&
                  thanaList.map((val) => {
                    return <option value={val?.id}>{val?.name}</option>;
                  })}
              </select>
              {errors != undefined && (
                <div className="text-danger">{errors?.thana}</div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="" className="form-label">
                Postal <span data-required="true" aria-hidden="true"></span>
              </label>
              <input
                type="text"
                name="postal"
                value={data.postal}
                className="form-control"
                onChange={handleSelect}
              />
            </div>
            {errors != undefined && (
              <div className="text-danger">{errors?.postal}</div>
            )}
          </div>
          {/* <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <div className="form-group">
              <label htmlFor="address-state" className="form-label">
                Postal Code
                <span data-required="true" aria-hidden="true"></span>
              </label>
              <select
                id="address-state"
                name="postal"
                autoComplete="shipping address-level1"
                required=""
                className="form-control"
                onChange={handleSelect}
              >
                <option value="" disabled="" selected="">
                  Please select
                </option>
                {postalList != undefined &&
                  postalList.map((val) => {
                    return <option value={val}>{val}</option>;
                  })}
              </select>
              {errors != undefined && (
                <div className="text-danger">{errors?.postal}</div>
              )}
            </div>
          </div> */}

          {/* <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <div className="form-group">
              <label htmlFor="address-state" className="form-label">
                Area
                <span data-required="true" aria-hidden="true"></span>
              </label>
              <select
                id="address-state"
                name="area"
                autoComplete="shipping address-level1"
                required=""
                className="form-control"
                onChange={handleSelect}
              >
                <option value="" disabled="" selected="">
                  Please select
                </option>
                {areaList != undefined &&
                  areaList.map((val) => {
                    return <option value={val}>{val}</option>;
                  })}
              </select>
              {errors != undefined && (
                <div className="text-danger">{errors?.area}</div>
              )}
            </div>
          </div> */}

          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="" className="form-label">
                Email <span data-required="true" aria-hidden="true"></span>
              </label>
              <input
                type="email"
                name="email"
                value={data.email}
                className="form-control"
                onChange={handleSelect}
              />
            </div>
            {errors != undefined && (
              <div className="text-danger">{errors?.email}</div>
            )}
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="" className="form-label">
                Phone <span data-required="true" aria-hidden="true"></span>
              </label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={data.phone}
                onChange={handleSelect}
              />
            </div>
            {errors != undefined && (
              <div className="text-danger">{errors?.phone}</div>
            )}
          </div>

          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div className="form-group ">
              <label htmlFor="address" className="form-label">
                Address
                <span data-required="true" aria-hidden="true"></span>
              </label>

              <textarea
                className="form-control"
                id="address"
                name="address"
                autoComplete="shipping address-line1"
                required=""
                style={{ height: "100px" }}
                placeholder="Address Details"
                onChange={handleSelect}
                value={data.address}
              ></textarea>
            </div>
            {errors != undefined && (
              <div className="text-danger">{errors?.address}</div>
            )}
          </div>
          <div className="col-12">
            <div className="form-check" onChange={handleSelect}>
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckDefault"
                name="default"
              />

              <label className="form-check-label" htmlFor="flexCheckDefault">
                Make default address
              </label>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 text-end">
            <button
              type="button"
              className="continue-btn "
              onClick={submitAddress}
            >
              Save Address
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default AddressForm;
