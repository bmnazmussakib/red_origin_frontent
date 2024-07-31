import React, { useEffect, useState } from "react";
import { get, tAlert } from "../../helpers/helper";
import {
  addToWishListBackend,
  removeWishList,
} from "../../store/slice/WishListSlice";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import axios from "axios";

const RequestProduct = ({ item, fetchRStockProduct }) => {
  let auth = useSelector((state) => state.authSlice);
  const dispatch = useDispatch();
  const removeProduct = async () => {
    axios
      .delete(
        process.env.NEXT_PUBLIC_SERVER_URL + "product-requisition/" + item.id,
        {
          headers: {
            Authorization: "Bearer " + auth?.token,
          },
        }
      )
      .then((res) => {
        console.log(res);
        fetchRStockProduct();
        tAlert("Product removed from wishlist", "success");
      });
  };

  return (
    <div className="single-product">
      <div className="image-box">
        <Link prefetch={true} href={"/details/" + item?.product_id}>
          <img
            src={item?.thumbnail_image}
            alt=""
            className="img-fluid"
          />
        </Link>
        <Link
          prefetch={true}
          href="javascript:void(0)"
          onClick={() => removeProduct()}
          className="btn remove-towish-btn"
        >
          <i className="icofont-close-line"></i>
        </Link>
      </div>
      <div className="product-description">
        <h4 className="product-name">
          <Link prefetch={true} href={"/details/" + item?.slug}>
            {item?.name}
          </Link>
        </h4>
        <p className="price">৳ {item?.unit_price}</p>
      </div>
    </div>
  );
};

export default RequestProduct;
