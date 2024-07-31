import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkFromWishlist, cookie, tAlert } from "../../../helpers/helper";
import {
  addToWishList,
  addToWishListBackend,
} from "../../../store/slice/WishListSlice";
import QuickVew from "../../QuickVew";
import { setModalId } from "../../../store/slice/GlobalSetting";
import { hasCookie } from "cookies-next";
import { useEffect } from "react";
import Image from "next/image";
const ShopProduct = ({
  base_discounted_price,
  base_price,
  discount,
  discount_type,
  featured,
  tags,
  id,
  name,
  photos,
  rating,
  sales,
  thumbnail_image,
  todays_deal,
  unit,
  has_discount,
  wishLists = [],
  hover_image,
  slug,
}) => {
  let [checkListClass, setCheckListClass] = useState("");
  console.log("checkListClass: ", checkListClass)

  let router = useRouter();
  let dispatch = useDispatch();

  const handleModal = (id) => {
    dispatch(setModalId({ id }));
  };
  let wishListSlice = useSelector(state => state.wishListSlice?.wishlist)
  console.log("wishListSlice: ", wishListSlice)


  // useEffect(() => {
  //   if (
  //     checkFromWishlist(
  //       cookie("wishList") ? JSON.parse(cookie("wishList")) : [],
  //       id
  //     )
  //   ) {
  //     setCheckListClass("ri-heart-fill ri-lg");
  //   } else {
  //     setCheckListClass("ri-heart-line ri-lg");
  //   }
  // }, [wishListSlice]);

  // useEffect(() => {
  //   if (checkFromWishlist(wishListSlice, id)) {
  //     setCheckListClass("ri-heart-line ");
  //   }
  //   else {
  //     setCheckListClass("");
  //   }
  // }, [id, wishLists, wishListSlice]);



  useEffect(() => {
    if (checkFromWishlist(wishListSlice, id)) {
      setCheckListClass("logo-bg-color text-white");
    }
    else {
      setCheckListClass("");
    }
  }, [id, wishLists, wishListSlice]);

  return (
    <>
      <div className="single-product d-none">
        <div className="image-box">
          <Link prefetch={true} href={"/details/" + slug}>
            <Image fill={true} loading="lazy"
              src={thumbnail_image}
              alt=""
              className="img-fluid primary-image"
            />
            {/* <Image
              src={thumbnail_image}
              alt="category image"
              fill
              className="img-fluid primary-image"
            />
            <Image
              src={hover_image}
              alt="category image"
              fill
              className="img-fluid secondary-image"
            /> */}
            <Image fill={true} loading="lazy"
              src={hover_image}
              alt=""
              className="img-fluid secondary-image"
            />
            {base_price != base_discounted_price && (
              <div className="flashsale-tag">
                {/* <i className="icofont-flash"></i> */}
                {/* <span className="value">
                  {(
                    ((base_price - base_discounted_price) * 100) /
                    base_price
                  ).toFixed(0)}{" "}
                </span> */}
                <span className="value">
                  {discount}
                </span>
                <span className="percent"> %</span>
                <span className="off">off</span>
              </div>
            )}
          </Link>
          <a
            onClick={(e) => {
              if (!hasCookie("user_data")) {
                tAlert("Please Login First", "warning");
                return false;
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
                <Link
                  prefetch={true}
                  href={"/details/" + slug}
                  className="nav-link"
                >
                  <i className="icofont-cart-alt"></i>
                </Link>
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
        </div>
        <div className="product-description">
          <h4 className="product-name">
            <Link prefetch={true} href={"/details/" + slug}>
              {name}
            </Link>
          </h4>
          <p className="price">
            ৳{" "}
            {base_discounted_price != base_price &&
              base_price > base_discounted_price ? (
              <>
                <span className="mr-2">{base_discounted_price}</span>{" "}
                <del>{base_price}</del>
              </>
            ) : (
              base_price
            )}{" "}
          </p>
        </div>
        <div className="sailor-club-discount d-none">
          <div className="sailor-club-discount-logo">
            {/* <img
              src="./assets/images/membership-discount.png"
              className="d-none"
              alt=""
            /> */}
          </div>
          <div className={has_discount ? "discount" : "d-none discount"}>
            <div>
              {discount}
              {discount_type == "amount" ? null : "%"}
            </div>
          </div>
        </div>
        <div className="product-level-tag-flex">
          {tags &&
            tags.split(",")?.map((tag, index) => {
              return <div className="Sailor-label">{tag}</div>;
            })}
          {/* {featured ? <div className="Sailor-label">Featured</div> : null}
          {todays_deal ? <div className="Sailor-label">Todays deal</div> : null} */}
        </div>
      </div>

      <div className="solasta__product-card">
        <Link href={"/details/" + slug} className="solasta__product-image">
          <Image fill={true} loading="lazy"
            // src={thumbnail_image}
            src="/assets/images/solasta/products/1.png"
            alt="solasta-image"
            className="img-fluid font__image"
          />
          {/* <img
            className="font__image"
            src="/assets/images/solasta/products/1.png"
            alt="solasta-image"
          /> */}

          {/* =================================================== */}

          <Image fill={true} loading="lazy"
            // src={hover_image}
            src="/assets/images/solasta/products/2.png"
            alt="solasta-image"
            className="img-fluid secondary-image"
          />
          <img
            className="back__image"
            src="/assets/images/solasta/products/2.png"
            alt="solasta-image"
          />
        </Link>

        <div className="product__info">
          <ul className="color__swatcher">
            <li>
              <a href="#0"></a>
            </li>
            <li>
              <a className="active" href="#0"></a>
            </li>
            <li>
              <a href="#0"></a>
            </li>
          </ul>
          <ul className="cart__info">
            <li>
              {/* <i class="fa-solid fa-heart"></i> */}
              {/* <i
                onClick={(e) => {
                  if (!hasCookie("user_data")) {
                    tAlert("Please Login First", "warning");
                    return false;
                  }
                  e.preventDefault();
                  dispatch(addToWishListBackend({ id }));

                  e.currentTarget.className =
                    (e.currentTarget.className.includes("ri-heart-line")
                      ? "ri-heart-fill"
                      : "ri-heart-line") + " ri-lg";
                }}
                class="ri-heart-line ri-lg"
              ></i> */}

              {/* <i
                onClick={(e) => {
                  e.preventDefault();
                  if (!hasCookie("user_data")) {
                    tAlert("Please Login First", "warning");
                    return false;
                  }
                  dispatch(addToWishListBackend({ id }));
                  e.currentTarget.className =
                    (e.currentTarget.className.includes("ri-heart-line")
                      ? "ri-heart-fill"
                      : "ri-heart-line") + " ri-lg";

                }}
                class="ri-heart-line ri-lg"
              ></i> */}

              <a
                onClick={(e) => {
                  if (!hasCookie("user_data")) {
                    tAlert("Please Login First", "warning");
                    return false;
                  }
                  e.preventDefault();
                  dispatch(addToWishListBackend({ id }));
                  e.currentTarget.className =
                    (e.currentTarget.className.includes("logo-bg-color logo-text-color")
                      ? "bg-transparen"
                      : "logo-bg-color text-white") + " btn add-towish-btn ";
                }}
                className={"btn add-towish-btn " + checkListClass}
              >
                <i class="ri-heart-line"></i>
              </a>
            </li>
            <li>
              {/* <i class="fas fa-cart-shopping"></i> */}
              <Link
                prefetch={true}
                href={"/details/" + slug}
                className="nav-link"
              >
                <i class="ri-shopping-cart-line"></i>
              </Link>
            </li>
          </ul>
        </div>

        <h4 className="text-truncate">
          <Link prefetch={true} href={"/details/" + slug}>{name}</Link>
        </h4>

        {/* <span className="solasta-price">TK 19,985.00</span> */}
        {base_discounted_price != base_price &&
          base_price > base_discounted_price ? (
          <>
            <span className="solasta-price">TK {base_discounted_price}</span>
            {/* <span className="mr-2">{base_discounted_price}</span>{" "} */}
            <del>{base_price}</del>
          </>
        ) : (
          <>
            TK {base_price}
          </>
        )}{" "}

      </div>

      {/* {id != undefined ? <QuickVew id={id} /> : ""} */}
    </>
  );
};

export default ShopProduct;
