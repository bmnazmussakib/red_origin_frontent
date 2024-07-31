import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearWishList, removeWishList } from "../../store/slice/WishListSlice";
import Link from "next/link";
import { get, post, tAlert } from "../../helpers/helper";
import RequestProduct from "./RequestProduct";

const RequestStockList = () => {
  let dispatch = useDispatch();
  let wishLists = useSelector((state) => {
    return state?.wishListSlice?.wishlist;
  });

  const [products, setProduct] = useState();
  const fetchRStockProduct = async () => {
    try {
      let res = await get("/product-requisition");
      console.log(res?.data)
      setProduct(res.data.data);
    } catch (e) {
      tAlert("something wrong");
    }
  };

  let removerUserAllWishlist = async () => {
    let { data, status } = await post("/v2/remove-user-wishlist");
    if (status != 200) {
      tAlert("something wrong");
      return false;
    } else {
      dispatch(clearWishList());
      setProduct([]);
    }
  };
  useEffect(() => {
    // if (products?.length > 0) {
      fetchRStockProduct();
    // } else {
    //   setProduct([]);
    // }
  }, []);

  return (
    <>
      <div className="personal-information">
        <div className="common-fieldset-main">
          <fieldset className="common-fieldset">
            <legend className="rounded">
              <i className="fas fa-heart"></i> my Request Stock (
              {products?.length ||0})
            </legend>
            <div className="wishlist-grid-main">
              {products?.map((item, index) => {
                return (
                  <>
                    <RequestProduct
                      item={item}
                      fetchRStockProduct={fetchRStockProduct}
                    />
                  </>
                );
              })}
            </div>

            <div className="double-btns">
              {/* {products?.length > 0 && (
                <Link
                  prefetch={true}
                  href="javascript:void(0)"
                  onClick={removerUserAllWishlist}
                  type="button"
                  className="continue-btn "
                >
                  clear
                </Link>
              )} */}

              <Link
                prefetch={true}
                href="/shop"
                type="button"
                className="continue-btn "
              >
                continue shopping
              </Link>
            </div>
          </fieldset>
        </div>
      </div>
    </>
  );
};

export default RequestStockList;
