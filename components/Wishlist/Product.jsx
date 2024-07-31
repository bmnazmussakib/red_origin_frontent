import React, { useEffect, useState } from "react";
import { get, tAlert } from "../../helpers/helper";
import {
  addToWishListBackend,
  removeWishList,
} from "../../store/slice/WishListSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";

const Product = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <div className="single-product">
      <div className="image-box">
        <Link prefetch={true} href={"/details/" + item.slug}>
          <img src={item?.thumbnail_image} alt="" className="img-fluid" />
        </Link>
        <Link
          prefetch={true}
          href="javascript:void(0)"
          onClick={() => dispatch(addToWishListBackend({ id: item.id }))}
          className="btn remove-towish-btn"
        >
          <i className="icofont-close-line"></i>
        </Link>
      </div>
      <div className="product-description">
        <h4 className="product-name">
          <Link prefetch={true} href={"/details/" + item.slug}>
            {item?.name}
          </Link>
        </h4>
        <p className="price">৳ {item?.base_price} + VAT</p>
      </div>
    </div>
  );
};

export default Product;
