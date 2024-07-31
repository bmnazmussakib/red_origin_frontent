import Link from "next/link";
import React from "react";
import { isActive, post, tAlert } from "../../helpers/helper";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../../store/slice/AuthSlice";
import { useRouter } from "next/router";
import { clearCart, clearCoupon } from "../../store/slice/CartSlice";
import { clearWishList } from "../../store/slice/WishListSlice";

const ProfileSidebar = () => {
  let router = useRouter();
  let dispatch = useDispatch();
  let auth = useSelector((state) => state.authSlice.user);
  const accountDelete = async () => {
    let userDecision = confirm("Are you sure you want to delete your account?");
    if (userDecision) {
      let res = await post("/v2/customer/delete");
      console.log(res);
      if (res.data?.status == true) {
        dispatch(removeUser());
        dispatch(clearCart());
        dispatch(clearCoupon());
        dispatch(clearWishList({
          logout: false
        }));
        tAlert("Account deleted successfully", "success");
        router.replace("/");
      }
    }
  };
  return (
    <>
      <div className="profile-sidebar shadow-sm">
        <h2>Hello, {auth?.name}</h2>
        <div className="profile-menubox">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link
                prefetch={true}
                href="/profile"
                className={
                  isActive("/profile") ? "active nav-link" : "nav-link"
                }
                passHref
              >
                <>
                <i class="ri-user-line"></i>
                  profile
                </>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                prefetch={true}
                className={isActive("/orders") ? "active nav-link" : "nav-link"}
                passHref
                href="/orders"
              >
                <i class="ri-shopping-cart-line"></i>
                orders
              </Link>
            </li>
            <li className="nav-item">
              <Link
                prefetch={true}
                className={isActive("/cart") ? "active nav-link" : "nav-link"}
                passHref
                href="/cart"
              >
                <i class="fa fa-cart-plus" aria-hidden="true"></i>
                cart
              </Link>
            </li>
            <li className="nav-item">
              <Link
                prefetch={true}
                className={
                  isActive("/wishlist") ? "active nav-link" : "nav-link"
                }
                passHref
                href="/wishlist"
              >
                <i class="ri-heart-fill"></i>
                wishlist
              </Link>
            </li>
            <li className="nav-item d-none">
              <Link
                prefetch={true}
                className={
                  isActive("/request-stock") ? "active nav-link" : "nav-link"
                }
                passHref
                href="/request-stock"
              >
                <i class="ri-compass-3-line"></i>
                request stock
              </Link>
            </li>
            <li className="nav-item">
              <Link
                prefetch={true}
                className={
                  isActive("/address-book") ? "active nav-link" : "nav-link"
                }
                passHref
                href="/address-book"
              >
                <i class="ri-contacts-book-line"></i>
                Address Book
              </Link>
            </li>

            <li className="nav-item">
              <Link
                prefetch={true}
                className={
                  isActive("/reviews") ? "active nav-link" : "nav-link"
                }
                passHref
                href="/reviews"
              >
                <i class="ri-message-2-line"></i>
                reviews
              </Link>
            </li>

            <li className="nav-item">
              <Link
                prefetch={true}
                className={
                  isActive("/subscribe") ? "active nav-link" : "nav-link"
                }
                passHref
                href="/subscribe"
              >
                <i class="ri-file-list-3-line"></i>
                Subscribe
              </Link>
            </li>

            <li className="nav-item">
              <Link
                prefetch={true}
                className={
                  isActive("/password") ? "active nav-link" : "nav-link"
                }
                passHref
                href="/password"
              >
                <i class="ri-lock-unlock-line"></i>
                change password
              </Link>
            </li>
            <li className="nav-item">
              <a
                className={isActive("/logout") ? "active nav-link" : "nav-link"}
                passHref
                href="Javascript:void(0)"
                onClick={accountDelete}
              >
                <i class="ri-user-forbid-line"></i>
                Account Delete
              </a>
            </li>
            <li className="nav-item">
              <a
                className={isActive("/logout") ? "active nav-link" : "nav-link"}
                passHref
                href="Javascript:void(0)"
                onClick={() => {
                  dispatch(removeUser());
                  dispatch(clearCart());
                  dispatch(clearCoupon());
                  dispatch(clearWishList({
                    logout: true
                  }));
                  tAlert("logout successfully", "success");
                  router.push("/");
                }}
              >
                <i class="ri-shut-down-line"></i>
                logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;
