import React from "react";

const CheckoutForm = () => {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={orderInfo}
        validationSchema={checkoutSchema}
        onSubmit={async (values, { setSubmitting }) => {
          if (values.privacy_policy === "") {
            tAlert("Please accept privacy policy", "error");
            return false;
          } else {
            await createOrder(values).catch((err) => {
              tAlert("please try Again", "error");
            });
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => (
          <Form id="" className="progress-form" action="" lang="en" novalidate>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div className="common-fieldset-main">
                  <fieldset className="common-fieldset">
                    <legend className="rounded">Billing address</legend>
                    <div className="row">
                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group">
                          <label for="first-name" className="form-label">
                            First name
                            <span
                              data-required="true"
                              aria-hidden="true"
                            ></span>
                          </label>
                          <input
                            id="first-name"
                            className="form-control"
                            type="text"
                            name="billing_first_name"
                            onChange={handleChange}
                            value={values.billing_first_name}
                            placeholder="First name"
                          />
                          {touched.billing_first_name ||
                          errors.billing_first_name ? (
                            <p className="text-danger">
                              {errors.billing_first_name}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group">
                          <label for="last-name" className="form-label">
                            Last name
                          </label>
                          <input
                            id="last-name"
                            className="form-control"
                            type="text"
                            name="billing_last_name"
                            onChange={handleChange}
                            value={values.billing_last_name}
                          />
                          {touched.billing_last_name ||
                          errors.billing_last_name ? (
                            <p className="text-danger">
                              {errors.billing_last_name}
                            </p>
                          ) : null}
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
                            id="phone-number"
                            className="form-control"
                            type="text"
                            name="billing_phone"
                            onChange={handleChange}
                            value={values.billing_phone}
                            placeholder="Phone Number"
                          />

                          {errors.billing_phone || touched.billing_phone ? (
                            <p className="text-danger">
                              {errors.billing_phone}
                            </p>
                          ) : null}
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
                            name="billing_email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.billing_email}
                            autocomplete="email"
                            inputmode="email"
                            placeholder="E-mail Address"
                          />
                          {touched.billing_email || errors.billing_email ? (
                            <p className="text-danger">
                              {errors.billing_email}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group">
                          <label for="address-state" className="form-label">
                            District
                            <span
                              data-required="true"
                              aria-hidden="true"
                            ></span>
                          </label>
                          <select
                            id="address-state"
                            name="billing_district"
                            onChange={(e) => {
                              setFieldValue("billing_district", e.target.value);
                              fetchThanaList(e.target.value);
                            }}
                            onBlur={handleBlur}
                            value={values.billing_district}
                            autocomplete="shipping address-level1"
                            required
                            className="form-control"
                          >
                            <option value="" disabled selected>
                              Please select
                            </option>
                            {cityList != undefined &&
                              cityList.map((val) => {
                                return <option value={val}>{val}</option>;
                              })}
                          </select>
                          {touched.billing_district ||
                          errors.billing_district ? (
                            <p className="text-danger">
                              {errors.billing_district}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group">
                          <label htmlFor="address-state" className="form-label">
                            Thana
                            <span
                              data-required="true"
                              aria-hidden="true"
                            ></span>
                          </label>
                          <select
                            id="address-state"
                            name="billing_thana"
                            autoComplete="shipping address-level1"
                            required=""
                            className="form-control"
                            onChange={(e) => {
                              setFieldValue("billing_thana", e.target.value);
                              fetchPostalCodeList(
                                values.billing_district,
                                e.target.value
                              );
                            }}
                          >
                            <option value="" disabled="" selected="">
                              Please select
                            </option>
                            {thanaList != undefined &&
                              thanaList.map((val) => {
                                return <option value={val}>{val}</option>;
                              })}
                          </select>
                          {touched.billing_thana || errors.billing_thana ? (
                            <p className="text-danger">
                              {errors.billing_thana}
                            </p>
                          ) : null}
                          {errors != undefined && (
                            <div className="text-danger">{errors?.thana}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group">
                          <label htmlFor="address-state" className="form-label">
                            Postal Code
                            <span
                              data-required="true"
                              aria-hidden="true"
                            ></span>
                          </label>
                          <select
                            id="address-state"
                            name="billing_postal_code"
                            autoComplete="shipping address-level1"
                            required=""
                            className="form-control"
                            onChange={(e) => {
                              setFieldValue(
                                "billing_postal_code",
                                e.target.value
                              );
                              fetchAreaList(e.target.value);
                            }}
                            // onChange={handleSelect}
                          >
                            <option value="" disabled="" selected="">
                              Please select
                            </option>
                            {postalList != undefined &&
                              postalList.map((val) => {
                                return <option value={val}>{val}</option>;
                              })}
                          </select>
                          {touched.billing_postal_code ||
                          errors.billing_postal_code ? (
                            <p className="text-danger">
                              {errors.billing_postal_code}
                            </p>
                          ) : null}
                          {errors != undefined && (
                            <div className="text-danger">{errors?.postal}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="form-group">
                          <label htmlFor="address-state" className="form-label">
                            Area
                            <span
                              data-required="true"
                              aria-hidden="true"
                            ></span>
                          </label>
                          <select
                            id="address-state"
                            name="billing_area"
                            autoComplete="shipping address-level1"
                            required=""
                            className="form-control"
                            onChange={handleChange}
                          >
                            <option value="" disabled="" selected="">
                              Please select
                            </option>
                            {areaList != undefined &&
                              areaList.map((val) => {
                                return <option value={val}>{val}</option>;
                              })}
                          </select>
                          {touched.billing_area || errors.billing_area ? (
                            <p className="text-danger">{errors.billing_area}</p>
                          ) : null}
                          {errors != undefined && (
                            <div className="text-danger">{errors?.area}</div>
                          )}
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
                            className="form-control"
                            id="address"
                            name="billing_address"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.billing_address ?? ""}
                            autocomplete="shipping address-line1"
                            required
                            style={{ height: "100px" }}
                            placeholder="Address Details"
                            defaultValue={""}
                          ></textarea>
                          {touched.billing_address || errors.billing_address ? (
                            <p className="text-danger">
                              {errors.billing_address}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="common-fieldset-main">
                  <fieldset className="common-fieldset">
                    <legend className="rounded">Cupon</legend>

                    <div className="row g-3 align-items-center">
                      <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                        <input
                          type="text"
                          id=""
                          className="form-control"
                          aria-describedby="cupon"
                          placeholder="Cupon Code Here"
                          readOnly={coupon.coupon_applied ? true : false}
                          onChange={(e) =>
                            setCoupon({
                              ...coupon,
                              coupon: e.target.value,
                            })
                          }
                          value={coupon.coupon}
                        />
                      </div>
                      <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        {coupon.coupon_applied ? (
                          <button
                            type="button"
                            className="continue-btn w-100 bg-danger"
                            onClick={removeCoupon}
                            disabled={
                              memberSlice?.membership_applied ? true : false
                            }
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="continue-btn w-100"
                            onClick={applyCoupon}
                            disabled={
                              coupon.coupon_applied ||
                              memberSlice?.membership_applied
                                ? true
                                : false
                            }
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    </div>
                  </fieldset>
                </div>
                <>
                  <div className="common-fieldset-main">
                    <fieldset className="common-fieldset">
                      <legend className="rounded">Club points</legend>

                      <div className="row g-3 align-items-center">
                        {!memberSlice?.otp && (
                          <>
                            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                              <input
                                type="text"
                                id=""
                                className="form-control"
                                aria-describedby="cupon"
                                onChange={(e) =>
                                  setMemberSHipInput({
                                    ...memberShipInput,
                                    membership_no: e.target.value,
                                  })
                                }
                                placeholder="Membership Number"
                              />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                              <button
                                type="button"
                                className="continue-btn w-100"
                                onClick={loyaltyMember}
                                disabled={couponSlice?.coupon_applied}
                              >
                                apply
                              </button>
                            </div>
                          </>
                        )}
                        {memberSlice?.otp && (
                          <>
                            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                              <input
                                type="text"
                                id=""
                                className="form-control"
                                aria-describedby="cupon"
                                onChange={(e) =>
                                  setMemberSHipInput({
                                    ...memberShipInput,
                                    membership_otp: e.target.value,
                                  })
                                }
                                placeholder="Membership Otp"
                              />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                              <button
                                type="button"
                                className="continue-btn w-100"
                                onClick={checkLoyaltyOtp}
                                disabled={
                                  couponSlice?.coupon_applied ||
                                  memberSlice?.membership_applied
                                }
                              >
                                verify
                              </button>
                            </div>
                          </>
                        )}{" "}
                      </div>
                    </fieldset>
                  </div>{" "}
                </>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div className="common-fieldset-main">
                  <fieldset className="common-fieldset">
                    <legend className="rounded">shipping address</legend>

                    <div className="row mb-3">
                      <div className="col-4">
                        <label className="form-check-label2 " for="">
                          Select delivery type
                        </label>
                      </div>
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="home_delivery"
                            name="shipping_type"
                            id="pickupStoreChNo"
                            checked={
                              values.shipping_type === "home_delivery" && true
                            }
                            onChange={(e) => {
                              // setOrderInfo({
                              //   ...orderInfo,
                              //   shipping_type: e.target.value,
                              // });
                              setFieldValue("shipping_type", e.target.value);
                            }}
                          />
                          <label
                            className="form-check-label"
                            for="pickupStoreChNo"
                          >
                            Home delivery
                          </label>

                          {touched.shipping_type || errors.shipping_type ? (
                            <p className="text-danger">
                              {errors.shipping_type}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="pickup_point"
                            name="shipping_type"
                            id="pickupStoreChYes"
                            checked={
                              values.shipping_type == "pickup_point" && true
                            }
                            onChange={(e) => {
                              // setOrderInfo({
                              //   ...orderInfo,
                              //   shipping_type: e.target.value,
                              // });
                              setFieldValue("shipping_type", e.target.value);
                            }}
                          />
                          <label
                            className="form-check-label"
                            for="pickupStoreChYes"
                          >
                            Pickup from store
                          </label>
                          {touched.shipping_type || errors.shipping_type ? (
                            <p className="text-danger">
                              {errors.shipping_type}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    {values.shipping_type === "home_delivery" && (
                      <>
                        <div className="row mb-3">
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <label className="form__choice-wrapper">
                              <input
                                id=""
                                type="checkbox"
                                className="me-2"
                                name=""
                                value=""
                                onClick={() =>
                                  sameAsBillingAddress(
                                    event,
                                    values,
                                    setFieldValue
                                  )
                                }
                              />
                              <span>Same as billing address</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="row ">
                      {values.shipping_type === "home_delivery" && (
                        <>
                          {" "}
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <label className="form-check-label2 mb-3" for="">
                              Select from saved address or Enter Your address
                            </label>
                          </div>
                          {auth ? (
                            auth?.default_address?.map((item) => {
                              return (
                                <div
                                  onClick={() => {
                                    if (currentDefaultAddress) {
                                      setCurrentDefaultAddress();
                                    } else {
                                      setCurrentDefaultAddress(item.id);
                                    }
                                    let address = auth?.default_address.filter(
                                      (addr) => item.id === addr.id
                                    );

                                    setFieldValue(
                                      "shipping_first_name",
                                      auth?.name
                                    );
                                    setFieldValue(
                                      "shipping_last_name",
                                      auth?.name
                                    );
                                    setFieldValue(
                                      "shipping_email",
                                      address[0]?.email
                                    );
                                    setFieldValue(
                                      "shipping_district",
                                      address[0]?.state_name
                                    );
                                    fetchThanaList(
                                      address[0]?.state_name,
                                      true
                                    );
                                    setFieldValue(
                                      "shipping_thana",
                                      address[0]?.city_name
                                    );
                                    fetchPostalCodeList(
                                      address[0]?.state_name,
                                      address[0]?.city_name,
                                      true
                                    );
                                    setFieldValue(
                                      "shipping_postal_code",
                                      address[0]?.postal_code
                                    );
                                    fetchAreaList(
                                      address[0]?.postal_code,
                                      true
                                    );

                                    setFieldValue(
                                      "shipping_area",
                                      address[0]?.area_name
                                    );
                                    setFieldValue(
                                      "shipping_phone",
                                      address[0]?.phone
                                    );
                                    setFieldValue(
                                      "shipping_address",
                                      address[0]?.address
                                    );
                                  }}
                                  className="col-xs-12 col-sm-12 col-md-12 col-lg-6"
                                >
                                  <a
                                    href="javascript:void(0)"
                                    className="userAddress"
                                    useraddressattributeid="18"
                                  >
                                    <div
                                      className="address-books"
                                      key={item.id}
                                    >
                                      <address>
                                        <span className="name19">
                                          {auth?.name}
                                        </span>
                                        <br />
                                        District:{" "}
                                        <span className="district">
                                          {item?.state_name}
                                        </span>
                                        <br />
                                        Email:{" "}
                                        <span className="">{auth?.email}</span>
                                        <br />
                                        Phn No:{" "}
                                        <span className="mobile">
                                          {auth?.phone}
                                        </span>
                                        <br />
                                        Postcode:{" "}
                                        <span className="postcode">
                                          {item?.postal_code}
                                        </span>
                                        <br />
                                        Address :{" "}
                                        <span className="address">
                                          {item?.address}
                                        </span>
                                      </address>
                                    </div>
                                  </a>
                                </div>
                              );
                            })
                          ) : (
                            <h1>No Default Address Selected</h1>
                          )}
                        </>
                      )}
                      {values.shipping_type === "pickup_point" && (
                        <>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={handleChange}
                            name="pickup_points_id"
                          >
                            <option selected>Select Store</option>
                            {pickupPointList?.map((item) => {
                              return (
                                <option value={item?.id}>
                                  {item?.name || item?.address}
                                </option>
                              );
                            })}
                          </select>
                          {touched.pickup_points_id ||
                          errors.pickup_points_id ? (
                            <h5 className="text-danger"></h5>
                          ) : null}
                        </>
                      )}
                    </div>
                    {values.shipping_type === "home_delivery" && (
                      <>
                        <div className="row">
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label for="first-name" className="form-label">
                                First name
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <input
                                id="first-name"
                                className="form-control"
                                type="text"
                                name="shipping_first_name"
                                autocomplete="given-name"
                                required
                                value={values.shipping_first_name}
                                onChange={handleChange}
                                placeholder="First Name"
                                disabled={
                                  currentDefaultAddress || sameBilling
                                    ? true
                                    : false
                                }
                              />
                              {touched.shipping_first_name &&
                              errors.shipping_first_name ? (
                                <div className="text-danger">
                                  {errors.shipping_first_name}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label for="last-name" className="form-label">
                                Last name
                              </label>
                              <input
                                id="last-name"
                                className="form-control"
                                type="text"
                                name="shipping_last_name"
                                autocomplete="family-name"
                                value={values.shipping_last_name}
                                onChange={handleChange}
                                placeholder="Last Name"
                                disabled={
                                  currentDefaultAddress || sameBilling
                                    ? true
                                    : false
                                }
                              />
                              {touched.shipping_last_name &&
                              errors.shipping_last_name ? (
                                <div className="text-danger">
                                  {errors.shipping_last_name}
                                </div>
                              ) : null}
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
                                id="phone-number"
                                className="form-control"
                                type="text"
                                name="shipping_phone"
                                autocomplete="tel"
                                inputmode="tel"
                                required
                                placeholder="Phone Number"
                                value={values.shipping_phone}
                                onChange={handleChange}
                                disabled={
                                  currentDefaultAddress || sameBilling
                                    ? true
                                    : false
                                }
                              />
                              {touched.shipping_phone &&
                              errors.shipping_phone ? (
                                <div className="text-danger">
                                  {errors.shipping_phone}
                                </div>
                              ) : null}
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
                                name="shipping_email"
                                autocomplete="email"
                                inputmode="email"
                                placeholder="E-mail Address"
                                value={values.shipping_email}
                                onChange={handleChange}
                                disabled={
                                  currentDefaultAddress || sameBilling
                                    ? true
                                    : false
                                }
                              />
                              {touched.shipping_email &&
                              errors.shipping_email ? (
                                <div className="text-danger">
                                  {errors.shipping_email}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label for="address-state" className="form-label">
                                District
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <select
                                disabled={
                                  currentDefaultAddress || sameBilling
                                    ? true
                                    : false
                                }
                                id="address-state"
                                name="shipping_district"
                                onChange={(e) => {
                                  setFieldValue(
                                    "shipping_district",
                                    e.target.value
                                  );
                                  fetchThanaList(e.target.value, true);
                                }}
                                onBlur={handleBlur}
                                value={values.shipping_district}
                                autocomplete="shipping address-level1"
                                required
                                className="form-control"
                              >
                                <option value="" disabled selected>
                                  Please select
                                </option>
                                {cityList != undefined &&
                                  cityList.map((val) => {
                                    return <option value={val}>{val}</option>;
                                  })}
                              </select>
                              {touched.shipping_district &&
                              errors.shipping_district ? (
                                <div className="text-danger">
                                  {errors.shipping_district}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label
                                htmlFor="address-state"
                                className="form-label"
                              >
                                Thana
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <select
                                disabled={
                                  currentDefaultAddress || sameBilling
                                    ? true
                                    : false
                                }
                                id="address-state"
                                name="shipping_thana"
                                autoComplete="shipping address-level1"
                                required=""
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue(
                                    "shipping_thana",
                                    e.target.value
                                  );
                                  fetchPostalCodeList(
                                    values.shipping_district,
                                    values.shipping_thana,
                                    true
                                  );
                                }}
                              >
                                <option value="" disabled="" selected="">
                                  Please select
                                </option>
                                {shippingThanaList != undefined &&
                                  shippingThanaList.map((val) => {
                                    return val === values.shipping_thana ? (
                                      <option value={val} selected>
                                        {val}
                                      </option>
                                    ) : (
                                      <option value={val}>{val}</option>
                                    );
                                  })}
                              </select>
                              {touched.shipping_thana &&
                              errors.shipping_thana ? (
                                <div className="text-danger">
                                  {errors.shipping_thana}
                                </div>
                              ) : null}
                              {errors != undefined && (
                                <div className="text-danger">
                                  {errors?.thana}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label
                                htmlFor="address-state"
                                className="form-label"
                              >
                                Postal Code
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <select
                                // disabled={
                                //   currentDefaultAddress || sameBilling
                                //     ? true
                                //     : false
                                // }
                                id="address-state"
                                name="shipping_postal_code"
                                autoComplete="shipping address-level1"
                                required=""
                                className="form-control"
                                onChange={(e) => {
                                  setFieldValue(
                                    "shipping_postal_code",
                                    e.target.value
                                  );
                                  fetchAreaList(e.target.value, true);
                                }}
                                // onChange={handleSelect}
                              >
                                <option value="" disabled="" selected="">
                                  Please select
                                </option>
                                {shippingPostalList != undefined &&
                                  shippingPostalList.map((val) => {
                                    return values.shipping_postal_code ==
                                      val ? (
                                      <option value={val} selected>
                                        {val}
                                      </option>
                                    ) : (
                                      <option value={val}>{val}</option>
                                    );
                                  })}
                              </select>
                              {touched.shipping_postal_code &&
                              errors.shipping_postal_code ? (
                                <div className="text-danger">
                                  {errors.shipping_postal_code}
                                </div>
                              ) : null}
                              {errors != undefined && (
                                <div className="text-danger">
                                  {errors?.postal}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="form-group">
                              <label
                                htmlFor="address-state"
                                className="form-label"
                              >
                                Area
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>
                              <select
                                disabled={
                                  currentDefaultAddress || sameBilling
                                    ? true
                                    : false
                                }
                                id="address-state"
                                name="shipping_area"
                                autoComplete="shipping address-level1"
                                required=""
                                className="form-control"
                                onChange={handleChange}
                              >
                                <option value="" disabled="" selected="">
                                  Please select
                                </option>
                                {shippingAreaList != undefined &&
                                  shippingAreaList.map((val) => {
                                    return val == values.shipping_area ? (
                                      <option value={val} selected>
                                        {val}
                                      </option>
                                    ) : (
                                      <option value={val}>{val}</option>
                                    );
                                  })}
                              </select>
                              {touched.shipping_area && errors.shipping_area ? (
                                <div className="text-danger">
                                  {errors.shipping_area}
                                </div>
                              ) : null}
                              {errors != undefined && (
                                <div className="text-danger">
                                  {errors?.area}
                                </div>
                              )}
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
                                readOnly={
                                  currentDefaultAddress || sameBilling
                                    ? true
                                    : false
                                }
                                className="form-control"
                                id="address"
                                name="shipping_address"
                                autocomplete="shipping address-line1"
                                required
                                value={values.shipping_address}
                                style={{ height: "100px" }}
                                placeholder="Address Details"
                                onChange={handleChange}
                                defaultValue={""}
                              ></textarea>
                              {touched.shipping_address &&
                              errors.shipping_address ? (
                                <div className="text-danger">
                                  {errors.shipping_address}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div className="form-group mb-0">
                              <label for="address" className="form-label">
                                Order Note
                                <span
                                  data-required="true"
                                  aria-hidden="true"
                                ></span>
                              </label>

                              <textarea
                                className="form-control"
                                id="address"
                                name="note"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.note ?? ""}
                                autocomplete="note"
                                required
                                style={{ height: "100px" }}
                                placeholder="Note"
                                defaultValue={""}
                              ></textarea>
                              {touched.note || errors.note ? (
                                <p className="text-danger">{errors.note}</p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </fieldset>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                <div className="common-fieldset-main">
                  <fieldset className="common-fieldset">
                    <legend className="rounded">review cart</legend>
                    <div className="table-responsive review-cart-table">
                      <CartComponent carts={inhouseCart[0]?.cart_items} />
                    </div>
                  </fieldset>
                </div>
                <div className="common-fieldset-main">
                  <fieldset className="common-fieldset">
                    <legend className="rounded">payment Options</legend>
                    <label for="" className="form-label">
                      Select payment method
                    </label>
                    <br />

                    {businessSlice?.paymentTypes?.map(
                      ({
                        payment_type,
                        payment_type_key,
                        image,
                        name,
                        title,
                        offline_payment_id,
                      }) => {
                        return (
                          <div className="form-check form-check-inline payment_method_radio">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="payment_type"
                              id="payment_method"
                              value={payment_type_key}
                              onClick={handleChange}
                            />
                            <label className="form-check-label" for="">
                              <img
                                src={image}
                                alt={name}
                                style={{ width: "65px" }}
                              />
                            </label>
                          </div>
                        );
                      }
                    )}

                    <hr />
                    {touched.payment_type && errors.payment_type ? (
                      <div className="text-danger">{errors.payment_type}</div>
                    ) : null}
                    <br />
                    <label className="form__choice-wrapper mt-3">
                      <input
                        id=""
                        className="me-2 form-check-input"
                        type="checkbox"
                        name="privacy_policy"
                        onClick={handleChange}
                        value="1"
                      />
                      <span>
                        I Agree With Terms & Conditions, Return And Refund
                        Policy And Privacy Policy Of www.redorigin.com.bd
                      </span>
                    </label>
                    {touched.privacy_policy && errors.privacy_policy ? (
                      <div className="text-danger">{errors.privacy_policy}</div>
                    ) : null}
                  </fieldset>
                </div>
              </div>
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                <div className="cart-sidebar-main">
                  <div className="common-fieldset-main">
                    <fieldset className="common-fieldset">
                      <legend className="rounded">summary</legend>

                      <div className="table-responsive">
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <td>sub total </td>
                              <td>{cartCalculation.subTotal}</td>
                            </tr>
                            <tr>
                              <td>shipping charge</td>
                              <td>{cartCalculation.shippingCharge}</td>
                            </tr>
                            <tr>
                              <td>discount</td>
                              <td>
                                {coupon.coupon_applied
                                  ? coupon.coupon_amount
                                  : cartCalculation.discount}
                              </td>
                            </tr>
                            <tr>
                              <td>loyalty</td>
                              <td>
                                {memberSlice.membership_applied
                                  ? memberSlice.membership_amount
                                  : cartCalculation.discount}
                              </td>
                            </tr>
                            <tr>
                              <td>VAT</td>
                              <td>{cartCalculation.vat}</td>
                            </tr>
                            <tr className="top-border">
                              <td>total</td>
                              <td className="text-bold">
                                {cartCalculation.grandTotal -
                                  (coupon.coupon_amount ?? 0) -
                                  (memberSlice?.membership_amount ?? 0)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="w-100">
                        <button
                          type="submit"
                          className="orderNowButton"
                          id="submit_btn"
                        >
                          order now
                        </button>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CheckoutForm;
