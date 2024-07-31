import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProfileSidebar from "../../components/common/ProfileSidebar";
import { orders_routes } from "../../utils/route";
import { extractVariant, formatMoney, get, post } from "../../helpers/helper";
import axios from "axios";
import ReactToPrint, { useReactToPrint } from "react-to-print";

function OrderDetails({ info, products, auth }) {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const currentStatus = (status) => {
    console.log(info);
    let order_status_info = info?.order_status_info?.find((item) => {
      if (item.orders_status_name == status) {
        return item;
      }
    });

    if (info?.delivery_status == status) {
      if (info?.delivery_status == "delivered") {
        return "complete";
      }
      return "is-active";
    }

    if (order_status_info) {
      return "complete";
    }
    return "";
  };
  let address =
    info && info?.default_address && info?.default_address?.length > 0
      ? info?.default_address[0]
      : {
        name: auth?.name,
      };
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
            <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <ProfileSidebar />
            </div>

            <div
              className="col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9"
              ref={componentRef}
            >
              <div className="orders-steps-main">
                <ul className="list-unstyled multi-steps">
                  <li className={currentStatus("pending")}>pending</li>
                  <li className={currentStatus("confirmed")}>confirmed</li>
                  <li className={currentStatus("on_the_way")}>in transit</li>
                  <li className={currentStatus("delivered")}>delivered</li>
                  {info?.delivery_status == "cancelled" && (
                    <li className={currentStatus("cancelled")}>cancelled</li>
                  )}
                  {info?.delivery_status == "returned" && (
                    <li className={currentStatus("returned")}>returned</li>
                  )}
                </ul>
              </div>
              <div className="order-information">
                <div className="order-no">
                  <p>
                    <i className="icofont-cart-alt"></i> Order No: {info?.code}
                  </p>
                </div>
                <div className="order-date">
                  <p>
                    <i className="icofont-calendar"></i> {info?.date}
                  </p>
                </div>
                <div className="order-time">
                  <ReactToPrint
                    trigger={() => {
                      return (
                        <button className="btn btn-info" onClick={handlePrint}>
                          <i className="fa fa-print" aria-hidden="true"></i>
                        </button>
                      );
                    }}
                    content={() => componentRef.current}
                  />
                </div>
              </div>

              <div className="customer-billing-shipping-info">
                <div className="common-fieldset-main">
                  <fieldset className="common-fieldset">
                    <legend className="rounded">Customer Info</legend>
                    <div className="info">
                      <h6 className="name">{auth?.name}</h6>
                      <p className="address">
                        {address && address?.default_address
                          ? address?.default_address[0]?.state_name
                          : ""}
                      </p>
                      <p className="phone">Phone: {auth?.phone ?? "N/A"}</p>
                      <p className="email">E-mail: {auth?.email ?? "N/A"}</p>
                    </div>
                  </fieldset>
                </div>
                <div className="common-fieldset-main">
                  <fieldset className="common-fieldset">
                    <legend className="rounded">Billing Info</legend>
                    <div className="info">
                      <h6 className="name">
                        Name:{info?.billing_address?.billing_name}
                      </h6>
                      <p className="address">
                        Address:{info?.billing_address?.billing_address}
                      </p>
                      <p className="phone">
                        Phone: {info?.billing_address?.billing_phone}
                      </p>
                      <p className="email">
                        E-mail: {info?.billing_address?.billing_email}
                      </p>
                    </div>
                  </fieldset>
                </div>
                <div className="common-fieldset-main">
                  {/* "shipping_address": {
                "shipping_name": " ",
                "shipping_email": null,
                "shipping_district": null,
                "shipping_postal_code": null,
                "shipping_phone": null,
                "shipping_address": null
            }, */}
                  <fieldset className="common-fieldset">
                    <legend className="rounded">Shipping Info</legend>
                    <div className="info">
                      <h6 className="name">
                        Name:{info?.shipping_address?.shipping_name}
                      </h6>
                      <p className="address">
                        Address:
                        {info?.shipping_address?.shipping_address}
                      </p>
                      <p className="phone">
                        Phone: {info?.shipping_address?.shipping_phone}
                      </p>
                      <p className="email">
                        E-mail:
                        {info?.shipping_address?.shipping_email}
                      </p>
                    </div>
                  </fieldset>
                </div>
              </div>

              <div className="personal-information">
                <form action="" method="post" className="common-fieldset-main">
                  <fieldset className="common-fieldset">
                    <legend className="rounded">your order summary</legend>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          <tr className="">
                            <td className="text-center">Sl No.</td>
                            <td className="text-center">Product Name</td>
                            <td className="text-center">Image</td>
                            <td className="text-center">Style Code</td>
                            <td>Quantity</td>
                            <td className="text-center">Size</td>
                            <td className="text-center">Price</td>
                          </tr>
                          {products &&
                            products?.map(
                              (
                                {
                                  id,
                                  product_id,
                                  product_name,
                                  variation,
                                  price,
                                  slug = '#',
                                  tax,
                                  shipping_cost,
                                  coupon_discount,
                                  quantity,
                                  payment_status,
                                  payment_status_string,
                                  delivery_status,
                                  delivery_status_string,
                                  refund_section,
                                  refund_button,
                                  refund_label,
                                  thumbnail_image,
                                  refund_request_status,
                                  sku,
                                },
                                key
                              ) => {
                                return (
                                  <tr key={key}>
                                    <td className="text-center">{key + 1}</td>{" "}
                                    <td className="text-center">
                                      <Link href={`/details/${slug}`} className="link">
                                        {product_name}
                                      </Link>
                                    </td>{" "}
                                    <td className="text-center">
                                      <img
                                        className="img-fluid"
                                        src={thumbnail_image}
                                        alt=""
                                        style={{ maxWidth: "50px" }}
                                      />
                                    </td>
                                    <td className="text-center">
                                      {sku ?? variation}
                                    </td>
                                    <td className="text-center">{quantity}</td>
                                    <td className="text-center">
                                      {variation == null ? '' : extractVariant(variation)?.size}
                                    </td>
                                    <td className="text-center">{price}</td>
                                  </tr>
                                );
                              }
                            )}
                        </tbody>
                      </table>
                    </div>
                  </fieldset>
                </form>

                <div className="price-payment">
                  <div className="payment-info">
                    <p>
                      <span>Payment Method:</span> {info?.payment_type}
                    </p>
                    <p>
                      <span>Payment Status:</span> {info?.payment_status_string}
                    </p>
                  </div>
                  <div className="price-info">
                    <div className="table-responsive">
                      {/* payment_type": "Cash On Delivery", "pickup_point": null,
                      "shipping_type": "home_delivery", "shipping_type_string":
                      "Home Delivery", "payment_status": "unpaid",
                      "payment_status_string": "Unpaid", "delivery_status":
                      "pending", "delivery_status_string": "Order Placed",
                      "grand_total": "৳2,354.25", "plane_grand_total": 2354.25,
                      "coupon_discount": "৳0.00", "shipping_cost": "৳0.00",
                      "subtotal": "৳2,190.00", "tax": "৳164.25", "date":
                      "23-01-2023", "cancel_request": false, "manually_payable":
                      false, */}
                      <table className="table">
                        <tbody>
                          <tr className="">
                            <td className="text-start">Sub Total</td>
                            <td className="text-end">
                              {(info?.subtotal +
                                  info?.coupon_discount +
                                  info?.circular_discount +
                                  info?.loyality_discount +
                                  info?.flash_discount).toFixed(2)} {" "}
                              TK
                            </td>
                          </tr>
                          <tr className="">
                            <td className="text-start">VAT</td>
                            <td className="text-end">{info?.tax} TK</td>
                          </tr>
                          <tr className="">
                            <td className="text-start">Shipping Cost</td>
                            <td className="text-end">
                              {info?.shipping_cost} TK
                            </td>
                          </tr>
                          <tr className="">
                            <td className="text-start">Discount</td>
                            <td className="text-end">
                              {(parseFloat(info?.coupon_discount) +
                                parseFloat(info?.flash_discount) +
                                parseFloat(info?.loyality_discount) +
                                parseFloat(info?.circular_discount)).toFixed(2)} TK
                            </td>
                          </tr>
                          <tr className="">
                            <td className="text-start">Total</td>
                            <td className="text-end">
                              {info?.plane_grand_total} TK
                            </td>
                          </tr>
                          {/* {allOrders &&
                                                        allOrders?.map(
                                                            (
                                                                {
                                                                    id,
                                                                    code,
                                                                    user_id,
                                                                    payment_type,
                                                                    payment_status,
                                                                    payment_status_string,
                                                                    delivery_status,
                                                                    delivery_status_string,
                                                                    grand_total,
                                                                    date,
                                                                    links,
                                                                },
                                                                key
                                                            ) => {
                                                                return (
                                                                    <tr key={key}>
                                                                        <td>{key + 1}</td>
                                                                        <td>{code}</td>
                                                                        <td className="text-center">
                                                                            {date}
                                                                        </td>
                                                                        <td className="text-center">{grand_total}</td>
                                                                        <td className="text-center">
                                                                            <span className="pending">{payment_status}</span>
                                                                        </td>
                                                                        <td className="text-center">
                                                                            <Link prefetch={true} href="order-details" className="">
                                                                                view order
                                                                            </Link>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )} */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="personal-information d-none">
                <form action="" method="post" className="common-fieldset-main">
                  <fieldset className="common-fieldset">
                    <legend className="rounded">order history</legend>
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr className="">
                            <td>#</td>
                            <td>Order ID</td>
                            <td className="text-center">Order date</td>
                            <td className="text-center">Price</td>
                            <td className="text-center">Status</td>
                            <td className="text-center">Details</td>
                          </tr>
                          {/* {allOrders &&
                            allOrders?.map(
                              (
                                {
                                  id,
                                  code,
                                  user_id,
                                  payment_type,
                                  payment_status,
                                  payment_status_string,
                                  delivery_status,
                                  delivery_status_string,
                                  grand_total,
                                  date,
                                  links,
                                },
                                key
                              ) => {
                                return (
                                  <tr key={key}>
                                    <td>{key + 1}</td>
                                    <td>{code}</td>
                                    <td className="text-center">{date}</td>
                                    <td className="text-center">
                                      {grand_total}
                                    </td>
                                    <td className="text-center">
                                      <span className="pending">
                                        {payment_status}
                                      </span>
                                    </td>
                                    <td className="text-center">
                                      <Link prefetch={true} href="order-details" className="">
                                        view order
                                      </Link>
                                    </td>
                                  </tr>
                                );
                              }
                            )} */}
                        </tbody>
                      </table>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export async function getServerSideProps(context) {
  let { id } = context.params;

  if (!id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  try {
    let resultDetails = await axios
      .get(orders_routes.PARCHES_HISTORY_DETAILS + id, {
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
    // //console.log(resultDetails)
    let resultProducts = await axios
      .get(orders_routes.PARCHES_HISTORY_DETAILS_DETAILS + id, {
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
    // //console.log(resultDetails)
    return {
      props: {
        info: resultDetails?.data?.data[0],
        products: resultProducts?.data?.data,
        auth: JSON.parse(context.req.cookies.user_data),
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
export default OrderDetails;
