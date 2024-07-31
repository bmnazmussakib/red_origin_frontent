import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearWishList, removeWishList } from "../../store/slice/WishListSlice";
import Link from "next/link";
import { get, post, tAlert } from "../../helpers/helper";
import Product from "./Product";

const WishlistSection = () => {
  let dispatch = useDispatch();
  let wishLists = useSelector((state) => {
    return state?.wishListSlice?.wishlist;
  });

  const [products, setProduct] = useState();
  const fetchWishlistProduct = async () => {
    try {
      let res = await get("/v2/products?product_ids=" + wishLists);
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
      dispatch(clearWishList({
        logout: false
      }));
      setProduct([]);
    }
  };
  useEffect(() => {
    if (wishLists?.length > 0) {
      fetchWishlistProduct();
    } else {
      setProduct([]);
    }
  }, [wishLists]);

  return (
    <>
      <div className="personal-information">
        <div className="common-fieldset-main">
          <fieldset className="common-fieldset">
            <legend className="rounded-0">
              <i className="fas fa-heart"></i> my wishlist ({wishLists?.length})
            </legend>
            <div className="wishlist-grid-main">
              {products?.map((item, index) => {
                return (
                  <>
                    <Product item={item} />
                  </>
                );
              })}
            </div>

            <div className="double-btns">
              {wishLists?.length > 0 && (
                <Link
                  prefetch={true}
                  href="javascript:void(0)"
                  onClick={removerUserAllWishlist}
                  type="button"
                  className="continue-btn "
                >
                  clear
                </Link>
              )}

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

export default WishlistSection;
