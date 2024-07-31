import React from "react";
import { detail } from "../utils/route";
import mainStore from "../store";
import { get } from "../helpers/helper";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import Skeleton from "react-loading-skeleton";

const compare = () => {
  let [products, setProducts] = useState(null);
  let fetchProduct = async () => {
    try {
      let compare_product = hasCookie("compare")
        ? JSON.parse(getCookie("compare"))
        : [];
      if (compare_product.length === 0) {
        setProducts([]);
        return;
      }
      let { data } = await get(
        detail.PRODUCT + "?" + new URLSearchParams({ compare: compare_product })
      );
      if (data?.success === true) {
        setProducts(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);
  return (
    <>
      <div class="container">
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <td colspan="3">
                  <strong>Product Details</strong>
                </td>
              </tr>
            </thead>
            {products == null && <Skeleton count={10} />}
            {products?.length === 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "300px",
                }}
              >
                <div className="text-center">
                  <h1>😇</h1>
                  <h6>
                    <strong>Please Add Product To Compare List</strong>
                  </h6>
                </div>
              </div>
            )}
            {products && products.length > 0 && (
              <tbody>
                <tr class="compare-name">
                  <td>Product</td>

                  {products?.map((product) => {
                    return (
                      <td>
                        <div className="d-flex justify-content-between">
                          <Link href={"/details/" + product?.slug}>
                            <strong>{product?.name}</strong>
                          </Link>
                          <span
                            className="btn btn-danger"
                            onClick={() => {
                              let compare_product = hasCookie("compare")
                                ? JSON.parse(getCookie("compare"))
                                : [];
                              compare_product = compare_product.filter(
                                (item) => item != product?.id
                              );
                              setCookie(
                                "compare",
                                JSON.stringify(compare_product)
                              );
                              fetchProduct();
                            }}
                          >
                            <i class="fa fa-times" aria-hidden="true"></i>
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
                <tr class="compare-image">
                  <td>Image</td>
                  {products?.map((product) => {
                    return (
                      <td class="text-left">
                        {" "}
                        <img
                          height="100px"
                          width="100px"
                          src={product?.thumbnail_image}
                          alt={product?.name}
                          title={product?.name}
                          class="img-thumbnail"
                        />{" "}
                      </td>
                    );
                  })}
                </tr>
                <tr class="compare-price">
                  <td>Price</td>
                  {products?.map((product) => {
                    return (
                      <td class="price">
                        <span class="price-new">
                          {product?.stroked_price != product?.calculable_price
                            ? product?.main_price
                            : product?.stroked_price}
                        </span>{" "}
                        <span class="price-old">
                          {product?.main_price != product?.stroked_price
                            ? product?.stroked_price
                            : ""}
                        </span>{" "}
                      </td>
                    );
                  })}
                </tr>
                <tr class="compare-model">
                  <td>Model</td>
                  {products?.map((product) => {
                    return <td>{product?.sku}</td>;
                  })}
                </tr>
                <tr class="compare-manufacturer">
                  <td>Brand</td>
                  {products?.map((product) => {
                    return <td>Solasta</td>;
                  })}
                </tr>
                <tr class="compare-availability">
                  <td>Availability</td>
                  {products?.map((product) => {
                    return (
                      <td class="stock">
                        <span class="status-stock">
                          {product?.quantity > 0 ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
                <tr class="compare-rating">
                  <td>Rating</td>
                  {products?.map((product) => {
                    return <td class="rating">{product?.rating}</td>;
                  })}
                </tr>
                <tr class="compare-summary">
                  <td>Summary</td>
                  {products?.map((product) => {
                    return (
                      <td class="description">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: product?.description,
                          }}
                        ></div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default compare;
