import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import { checkFromWishlist, tAlert } from "../../../helpers/helper";
import {
  addToWishList,
  addToWishListBackend,
} from "../../../store/slice/WishListSlice";
import { setModalId } from "../../../store/slice/GlobalSetting";
import { hasCookie } from "cookies-next";
import Image from "next/image";

function FlashProduct({
  name,
  slug,
  price,
  id,
  thumbnail_image,
  discount = 0,
  discount_price,
  wishLists,
  sale_percentage = 0,
  hover_image,
}) {
  let checkListClass = "";
  if (checkFromWishlist(wishLists, id)) {
    checkListClass = "bg-danger";
  } else {
    checkListClass = "";
  }
  let router = useRouter();
  let dispatch = useDispatch();
  const handleModal = (id) => {
    dispatch(setModalId({ id }));
  };
  return (
    <>
      <div className="single-product">
        <div className="card">
          <div className="product-image">
            <Link prefetch={true} href={"/details/" + slug}>
              <Image fill={true} loading="lazy"
                src={thumbnail_image}
                alt=""
                className="img-fluid primary-image"
              />
              {/* <img
                src={hover_image}
                alt=""
                className="img-fluid secondary-image"
              /> */}
              {/* <Image
                src={thumbnail_image}
                alt=""
                fill
                className="img-fluid primary-image"
                loading="lazy"
              /> */}
              {/* <Image
                src={hover_image}
                alt=""
                fill
                className="img-fluid secondary-image"
              /> */}
            </Link>
            <a
              onClick={(e) => {
                if (!hasCookie("user_data")) {
                  tAlert("Please login first");
                  return;
                }
                e.preventDefault();
                dispatch(addToWishListBackend({ id }));
                e.currentTarget.className =
                  (e.currentTarget.className.includes("bg-danger")
                    ? "bg-light"
                    : "bg-danger") + " btn add-towish-btn ";
              }}
              className={"btn add-towish-btn " + checkListClass}
            >
              <i className="fa-regular fa-heart"></i>
            </a>
            <div className="product-view-sets">
              <ul className="nav">
                <li className="nav-item">
                  <a
                    href="javascript:void(0)"
                    onClick={(e) => {
                      router.push("/details/" + slug);
                    }}
                    className="nav-link"
                  >
                    <i className="icofont-cart-alt"></i>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="javascript:void(0)" className="nav-link">
                    <i
                      className="icofont-eye-alt"
                      data-bs-toggle="modal"
                      data-bs-target={"#productQuickView"}
                      onClick={() => handleModal(id)}
                    ></i>
                  </a>
                </li>
              </ul>
            </div>
            <div className="flashsale-tag">
              {/* <i className="icofont-flash"></i> */}
              {(((price - discount_price) * 100) / price).toFixed(0)} %
            </div>
          </div>
          <div className="product-description">
            <h4 className="product-name">
              <Link prefetch={true} href={"/details/" + slug}>
                {name}
              </Link>
            </h4>
            <div className="price-flex">
              <p className="curret-price">&#2547; {discount_price}</p>
              <p className="old-price">&#2547; {price}</p>
            </div>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                aria-label="Basic example"
                style={{ width: sale_percentage + "%" }}
                aria-valuenow={sale_percentage}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <p className="sale-status">{sale_percentage}% sold</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default FlashProduct;
