import Link from "next/link";
import React from "react";
import { addToCartBackend, post } from "../../helpers/helper";
import { cart } from "../../utils/route";

export default function ComboProducts({ product, addBuyProductToCart }) {
  return (
    <div class="single-product">
      <div class="image-box">
        <Link href={"/details/" + product?.slug} prefetch={true}>
          <img
            src={product?.thumbnail_img}
            alt=""
            class="img-fluid primary-image"
          />
        </Link>
        <div class="product-view-sets">
          <ul class="nav">
            <li class="nav-item">
              <a
                onClick={async () => {
                  console.log(product)
                   addBuyProductToCart(product?.barcode);
                }}
                class="nav-link"
                style={{ cursor: "pointer" }}
              >
                <i class="icofont-cart-alt"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="product-description">
        <h4 class="product-name">
          <Link href={"/details/" + product?.slug} prefetch={true}>
            {product?.name}
          </Link>
        </h4>
        <p class="price">৳ {product?.price}</p>
      </div>
      <div class="sailor-club-discount d-none">
        <div class="sailor-club-discount-logo"></div>
        <div class="d-none discount">
          <div>0</div>
        </div>
      </div>
      <div class="product-level-tag-flex"></div>
    </div>
  );
}
