import React from "react";
import { useEffect } from "react";
import { get } from "../helpers/helper";
import { orders_routes } from "../utils/route";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import mainStore from "../store";
import axios from "axios";
import { useSelector } from "react-redux";
import Image from "next/image";

const ThankYou = ({ info, products }) => {
  // //console.log("========================================")
  // //console.log(info)
  // //console.log(products)
  // //console.log("========================================")

  console.log(info)

  const user = useSelector((state) => {
    return state.authSlice.user;
  });
  return (
    <>
      <section className="breadcrum-main mb-0">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link prefetch={true} href="/">
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#" disabled>
                      cart
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#" disabled>
                      checkout
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a disabled>order complete </a>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>
      <section className="thanks-main">
        <div className="wrap">
          <div className="left-box">
            <div className="order-header">
              <div className="icon">
                <img src="./assets/images/icon/check2.svg" alt="" />
              </div>
              <div className="number-main">
                <p>Order {info?.code} </p>
                <h4>
                  Thank you <strong>{user?.name}</strong>{" "}
                </h4>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h4>Your order is confirmed</h4>
                <p>
                  You’ll receive a confirmation email with your order number
                  shortly.{" "}
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h4>Order updates</h4>
                <p>You’ll get shipping and delivery updates by email. </p>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-12">
                    <h4>Customer information</h4>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <div className="info-box">
                      <h5>Contact info</h5>
                      <p>Mobile No: {info?.shipping_address?.shipping_phone}</p>
                      <p>Email: {info?.shipping_address?.shipping_email}</p>
                    </div>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <div className="info-box">
                      <h5>Payment method</h5>
                      <p>
                        {info?.payment_type}: {info?.plane_grand_total}{" "}
                        BDT
                      </p>
                    </div>
                  </div>
                  {info?.shipping_type != "pickup_point" && (
                    <>
                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="info-box">
                          <h5>Shipping address</h5>

                          <p>
                            <strong>Name: </strong>{" "}
                            {info?.shipping_address?.shipping_name}
                          </p>
                          <p>
                            <strong>State: </strong>
                            {info?.shipping_address?.shipping_state}{" "}
                          </p>
                          <p>
                            <strong>Email: </strong>
                            {info?.shipping_address?.shipping_email}{" "}
                          </p>
                          <p>
                            <strong>Phone: </strong>
                            {info?.shipping_address?.shipping_phone}{" "}
                          </p>
                          <p>
                            <strong>Postal Code: </strong>
                            {info?.shipping_address?.shipping_postal_code}{" "}
                          </p>
                          <p>
                            <strong>Address: </strong>
                            {info?.shipping_address?.shipping_address}
                          </p>
                        </div>
                      </div>
                      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <div className="info-box">
                          <h5>Billing address</h5>
                          <p>
                            <strong>Name: </strong>{" "}
                            {info?.billing_address?.billing_name}
                          </p>
                          <p>
                            <strong>State: </strong>
                            {info?.billing_address?.billing_state}{" "}
                          </p>
                          <p>
                            <strong>Email: </strong>
                            {info?.billing_address?.billing_email}{" "}
                          </p>
                          <p>
                            <strong>Phone: </strong>
                            {info?.billing_address?.billing_phone}{" "}
                          </p>
                          <p>
                            <strong>Postal Code: </strong>
                            {info?.billing_address?.billing_postal_code}{" "}
                          </p>
                          <p>
                            <strong>Address: </strong>
                            {info?.billing_address?.billing_address}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <div className="info-box">
                      <h5>Shipping method</h5>
                      <p>{info?.shipping_type}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="continue-flex mb-4">
              <p>
                Need help?{" "}
                <a href="#" className="logo-text-color">
                  Contact us
                </a>
              </p>
              <Link prefetch={true} href="/shop" className="btn continue-btn">
                Continue shopping
              </Link>
            </div>
          </div>
          <div className="right-box">
            <div className="order-summary">
              <div className="table-responsive">
                <table className="table product-table">
                  <thead className="">
                    <tr>
                      <th scope="col">
                        <span className="visually-hidden">Product image</span>
                      </th>
                      <th scope="col">
                        <span className="visually-hidden">Description</span>
                      </th>
                      <th scope="col">
                        <span className="visually-hidden">Quantity</span>
                      </th>
                      <th scope="col">
                        <span className="visually-hidden">Price</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products &&
                      products.map((item, index) => (
                        <tr>
                          <td className="product-image">
                            <div className="thumbnail">
                              <div className="thumbnail-wrapper">
                                <img src={item?.thumbnail_image} alt="" />
                              </div>
                              <span className="thumbnail-quantity">
                                {item.quantity}
                              </span>
                            </div>
                          </td>
                          <td className="product-description">
                            <span className="">{item.product_name}</span>
                          </td>
                          <td className="product-quantity">
                            <span className="visually-hidden">
                              {item.quantity}
                            </span>
                          </td>
                          <td className="product-price">
                            <span>{item.price} BDT</span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="custom-table-border">
                <div className="table-responsive">
                  <table className="table total-table">
                    <caption className="visually-hidden">Cost summary</caption>
                    <thead>
                      <tr>
                        <th scope="col">
                          <span className="visually-hidden">Description</span>
                        </th>
                        <th scope="col">
                          <span className="visually-hidden">Price</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">Subtotal</th>
                        <td>
                          {" "}
                          <span>
                            {`${(info?.subtotal +
                              info?.coupon_discount +
                              info?.circular_discount +
                              info?.loyality_discount +
                              info?.flash_discount).toFixed(3)} BDT`}

                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Shipping</th>
                        <td>
                          {" "}
                          <span>{info?.shipping_cost} BDT</span>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">Discount</th>
                        <td>
                          {" "}
                          <span>
                            {`${(info?.coupon_discount +
                              info?.circular_discount +
                              info?.loyality_discount +
                              info?.flash_discount).toFixed(3)} BDT`}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">TAX</th>
                        <td>
                          {" "}
                          <span>{`${info?.tax.toFixed(3)} BDT`}</span>
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="table-footer">
                      <tr>
                        <th scope="row">Total</th>
                        <td> {info?.plane_grand_total} BDT</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export async function getServerSideProps(context) {
  let query = context.query;

  try {
    if (!query.order_code) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    let resultDetails = await axios
      .get(orders_routes.PARCHES_HISTORY_DETAILS + query.order_code, {
        headers: {
          Authorization: `Bearer ${context.req.cookies.token}`,
        },
      })
      .catch((err) => {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      });
    console.log(resultDetails.data)
    let resultProducts = await axios
      .get(orders_routes.PARCHES_HISTORY_DETAILS_DETAILS + query.order_code, {
        headers: {
          Authorization: `Bearer ${context.req.cookies.token}`,
        },
      })
      .catch((err) => {
        return {
          redirect: {
            destination: "/",
            permanent: false,
          },
        };
      });
  console.log(resultDetails.data)
    return {
      props: {
        info: resultDetails?.data?.data[0],
        products: resultProducts?.data?.data,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}

export default ThankYou;
