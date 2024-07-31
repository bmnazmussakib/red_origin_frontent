import React, { useEffect, useState } from "react";
import Link from "next/link";
import ProfileSidebar from "../../components/common/ProfileSidebar";
import { checkoutPage, orders_routes } from "../../utils/route";
import { get, post, tAlert } from "../../helpers/helper";
import Loader from "../../components/common/Loader";
import { useSelector } from "react-redux";
import useBkash from "../../hook/useBkash";
import { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import moment from "moment/moment";
import Image from "next/image";
import { PaginationControl } from "react-bootstrap-pagination-control";

const orders = () => {
  let [allOrders, setAllOrders] = useState([]);
  let [orderInfo, setOrderInfo] = useState({});
  let [paymentList, setPaymentList] = useState([]);
  let [paymentInfo, setPaymentInfo] = useState({});
  let [meta, setMeta] = useState({});
  let { startPayment } = useBkash();
  let router = useRouter();
  let [current_page, setCurrentPage] = useState(0);
  let authSlice = useSelector((state) => state.authSlice);
  let getMyOrders = async () => {
    let page_id = router.query.page ? router.query.page : 1;
    let result = await get(
      orders_routes.PARCHES_HISTORY + "?page=" + page_id,
      {}
    ).catch((err) => {
      tAlert("Something went wrong", "error");
      return false;
    });
    if (result.status === 200) {
      let { data } = result;
      setAllOrders(data?.data);
      setMeta(data?.meta);
    }
  };
  let getPaymentList = async () => {
    let result = await get("/v2/payment-types", {}).catch((err) => {
      tAlert("Something went wrong", "error");
      return false;
    });
    if (result.status === 200) {
      let { data } = result;
      setPaymentList(data);
    }
  };
  let onLinePayment = async () => {
    console.log(orderInfo);
    if (orderInfo?.payment_type == "Nagad") {
      // 19 - 06 - 2023;
      let current_date = moment().format("DD-MM-YYYY");
      if (current_date == orderInfo?.date) {
        tAlert(
          "You can pay again after 24 hours",
          "error"
        );
        return false;
      }
    }

    let args = {
      payment_type: "cart_payment",
      combined_order_id: orderInfo?.combined_order_id,
      amount: orderInfo?.grand_total,
      user_id: authSlice?.user?.id,
      payment_option: paymentInfo?.payment_type_key,
      platform: "web",
      url: window.location.href,
    };
    let { data, status } = await post("/v2/pay", "", args).catch((res) => {
      throw new Error("Something went wrong");
    });

    if (status === 200) {
      if (paymentInfo.payment_type_key == "bkash") {
        window.location.href = data?.url;
      } else if (paymentInfo.payment_type_key == "nagad") {
        window.location.href = data?.url;
      } else if (paymentInfo.payment_type_key == "sslCommerz") {
        window.location.href = data?.url;
      }
    }
  };
  useEffect(() => {
    getMyOrders();
    getPaymentList();
    let search = new URLSearchParams(window.location.search);
    let page_id = 0;
    if (router.query?.page) {
      page_id = router.query.page ? router.query.page - 1 : 0;
    } else {
      page_id = search.get("page") ? search.get("page") - 1 : 0;
    }

    setCurrentPage(page_id);
  }, []);

  useEffect(() => {
    let search = new URLSearchParams(window.location.search);
    if (search.get("message")) {
      tAlert(search.get("message"), "error");
    }
  }, []);

  return (
    <>
      <button
        id="bKash_button"
        style={{
          display: "none",
        }}
      ></button>
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
            <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
              <ProfileSidebar />
            </div>
            <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
              <div className="personal-information">
                <form action="" method="post" className="common-fieldset-main">
                  <fieldset className="common-fieldset">
                    <legend className="rounded-0">
                       my orders
                    </legend>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          <tr className="">
                            <td className="text-center">#</td>
                            <td className="text-center">Order ID</td>
                            <td className="text-center">Order date</td>
                            <td className="text-center">Price</td>
                            <td className="text-center">Payment Method</td>
                            <td className="text-center">Delivery Status</td>
                            <td className="text-center">Status</td>
                            <td className="text-center">Action</td>
                          </tr>
                          {allOrders ? (
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
                                  combined_order_id,
                                },
                                key
                              ) => {
                                return (
                                  <tr key={key}>
                                    <td className="text-center">{key + 1}</td>
                                    <td>{code}</td>
                                    <td className="text-center">{date}</td>
                                    <td className="text-center">
                                      {grand_total}
                                    </td>
                                    <td className="text-center">
                                      <span className="pending">
                                        {payment_type}
                                      </span>
                                    </td>
                                    <td className="text-center">
                                      <span className="bg-info">
                                        {delivery_status_string}
                                      </span>
                                    </td>
                                    <td className="text-center">
                                      <span className="bg-secondary">
                                        {payment_status}
                                      </span>
                                    </td>
                                    <td className="text-center">
                                      <Link
                                        prefetch={true}
                                        href={`orders/${id}`}
                                        className="btn"
                                      >
                                        <i className="icofont-eye"></i>
                                      </Link>
                                      {payment_status == "unpaid" &&
                                        payment_type != "Cash On Delivery" &&
                                        delivery_status_string !=
                                        "Cancelled" && (
                                          <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => {
                                              setOrderInfo({
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
                                                combined_order_id,
                                              });
                                            }}
                                            data-bs-toggle="modal"
                                            data-bs-target="#staticBackdrop"
                                          >
                                            <i className="icofont-pay"></i>
                                          </button>
                                        )}
                                    </td>
                                  </tr>
                                );
                              }
                            )
                          ) : (
                            // <Loader />
                            ""
                          )}
                        </tbody>
                      </table>
                      {/* <nav
                        aria-label="Page navigation comments"
                        className="page-pagination"
                      >
                        <ReactPaginate
                          previousLabel="«"
                          nextLabel="»"
                          breakLabel="..."
                          breakClassName="page-item"
                          breakLinkClassName="page-link"
                          containerClassName="pagination justify-content-center"
                          pageClassName="page-item"
                          pageLinkClassName="page-link"
                          previousClassName="page-item"
                          previousLinkClassName="page-link"
                          nextClassName="page-item"
                          nextLinkClassName="page-link"
                          activeClassName="active"
                          hrefAllControls
                          pageRangeDisplayed={3}
                          onPageChange={(data) => {
                            let page_id = parseFloat(data?.selected) + 1;
                            router.push("?page=" + page_id);
                          }}
                          pageCount={meta?.last_page}
                          forcePage={current_page}
                        />
                      </nav> */}

                      <PaginationControl
                        page={current_page + 1}
                        between={2}
                        total={meta?.last_page ?? 1}
                        limit={1}
                        changePage={(page) => {
                          let page_id = page - 1;
                          router.push("?page=" + page);
                        }}
                        ellipsis={1}
                        next={true}
                        last={true}
                      />
                      
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Pay Now
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="input-group mb-3 ">
                <label
                  className="input-group-text w-25 "
                  for="inputGroupSelect01"
                >
                  {paymentInfo?.image ? (
                    <Image
                      src={paymentInfo?.image}
                      alt=""
                      className="img-fluid"
                      
                    />
                  ) : (
                    "Pay"
                  )}
                </label>
                <select
                  className="form-select"
                  id="inputGroupSelect01"
                  onChange={(e) => {
                    let payment = paymentList?.find(
                      (item) => item?.payment_type_key == e.target.value
                    );
                    setPaymentInfo(payment);
                  }}
                >
                  <option selected disabled>
                    Choose Payment
                  </option>
                  {paymentList?.map((item, key) => {
                    if (item?.payment_type_key != "cash_on_delivery") {
                      return (
                        <option value={item?.payment_type_key}>
                          {item?.name}
                        </option>
                      );
                    }
                  })}
                </select>
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onLinePayment()}
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
orders.protected = true;
export default orders;
