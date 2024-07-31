import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculationFromCart, cookie, extractVariant, removeFromCartBackend, tAlert } from "../../../../helpers/helper";
import { clearCoupon, clearMemberShip, removeFromCart } from "../../../../store/slice/CartSlice";
import { useRouter } from "next/router";

const CartWishAccount = () => {
  let carts = useSelector((state) => state?.cartSlice?.cart);
  let auth = useSelector((state) => state?.authSlice?.user);
  let token = useSelector((state) => state?.authSlice?.token);

  let wishList = useSelector((state) => {
    return state?.wishListSlice?.wishlist;
  });
  let [cartCalculation, setCartCalculation] = useState({
    subTotal: 0,
    discount: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  });
  let dispatch = useDispatch();
  let router = useRouter();
  useEffect(() => {
    if (carts.length > 0) {
      let cartCalculation = calculationFromCart(carts);
      setCartCalculation(cartCalculation);
    } else {
      setCartCalculation({
        subTotal: 0,
        discount: 0,
        tax: 0,
        shipping: 0,
        total: 0,
      });
    }
  }, [carts]);

  const offcanvasRef = useRef(null);

  useEffect(() => {
    const handleRouteChange = () => {
      const offcanvasElement = offcanvasRef.current;
      if (offcanvasElement) {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <div class={`offcanvas offcanvas-end cart-wish-account`} tabindex="-1" id="cartWishAccount" aria-labelledby="cartWishAccountLabel" ref={offcanvasRef}>
        <div class="offcanvas-header">
          <h5 class="offcanvas-title shopping-title" id="cartWishAccountLabel">Shopping bag ({carts?.length})</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <div className="shopping-bag-main">
            <div className="shopping-scrol" data-simplebar>
              {carts && carts.length > 0 ? (
                carts.map(
                  (
                    {
                      id,
                      name,
                      thumbnail_image,
                      variant,
                      quantity,
                      main_price,
                      main_price_discount,
                      discount,
                      barcode,
                      slug, product_id,
                      sku
                    },
                    key
                  ) => {
                    return (
                      <div className="card mb-3" key={key}>
                        <div className="row g-0">
                          <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                            <img
                              src={thumbnail_image}
                              className="img-fluid"
                              alt=""
                            />
                          </div>
                          <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
                            <div className="card-body">
                              <div className="products-namebox">
                                <h3 className="name">
                                  <Link
                                    prefetch={true}
                                    href={"/details/" + slug}
                                  >
                                    {name}
                                  </Link>
                                </h3>
                                <h3 className="price">
                                  ৳ {main_price_discount}{" "}
                                </h3>
                              </div>
                              <div className="price-description">
                                <h3>Qty: {quantity}</h3>
                                <h3>
                                  Color : {variant == null ? '' : extractVariant(variant)?.color}
                                </h3>
                              </div>
                              <div className="remove-product w-100">
                                <a
                                  href="javascript:void(0);"
                                  className="remove-item"
                                  onClick={async () => {
                                    let removeStatus =
                                      await removeFromCartBackend(
                                        product_id,
                                        barcode
                                      );
                                    if (removeStatus.remove_status) {
                                      dispatch(
                                        removeFromCart({
                                          id,
                                          barcode,
                                          removeFromCart: true,
                                        })
                                      );
                                      dispatch(clearCoupon());
                                      dispatch(clearMemberShip());
                                    }

                                    if (router.pathname == "/checkout") {
                                      router.push(router.pathname, null, {
                                        shallow: false,
                                      });
                                    }
                                  }}
                                >
                                  <i className="fa-regular fa-trash-can"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <h6>Add Something to Cart</h6>
              )}
            </div>

          </div>
        </div>
        <div className="offcanvas-footer">
          <div className="amount-box">
            <h3 className="text-start"> subtotal </h3>
            <h3 className="text-end">৳ {(cartCalculation.subTotal).toFixed(2)}</h3>
          </div>
          <div className="button-sets">
            <Link
              prefetch={true}
              href="/cart"
              className="btn btn-outline-primary view-shopping"
              
            >
              view shopping bag
            </Link>
            <Link
              prefetch={true}
              href={auth ? "/checkout" : "/login"}
              className="btn btn-secondary checkout"
              
            >
              checkout
            </Link>
          </div>
        </div>
      </div>


      {/* <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2">
        <div className="icon-sets">
          <ul className="nav justify-content-end">
            <li className="nav-item">
              <a className="nav-link" href="login.html"><i className="icofont-user-alt-7"></i></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fa-regular fa-heart"></i>
              </a>
            </li>
            <li className="nav-item position-relative">
              <a className="nav-link" href="#"><i className="icofont-cart-alt"></i></a>
              <div className="shopping-bag-main">
                <div className="shopping-title">
                  <h3>Shopping bag (5)</h3>
                </div>
                <div className="shopping-scrol" data-simplebar>
                  <div className="card mb-3">
                    <div className="row g-0">
                      <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <img src="./assets/images/products/1.jpg" className="img-fluid" alt=""/>
                      </div>
                      <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
                        <div className="card-body">
                          <div className="products-namebox">
                            <h3 className="name">mens shirt s/sleeve executive</h3>
                            <h3 className="price">৳ 1250 </h3>
                          </div>
                          <div className="price-description">
                            <h3>Qty: 1</h3>
                            <h3>Color: TEAL,size: 15</h3>
                          </div>
                          <div className="remove-product w-100">
                            <a href="#" className="remove-item">
                              <i className="fa-regular fa-trash-can"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card mb-3">
                    <div className="row g-0">
                      <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <img src="./assets/images/products/1.jpg" className="img-fluid" alt=""/>
                      </div>
                      <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
                        <div className="card-body">
                          <div className="products-namebox">
                            <h3 className="name">mens shirt s/sleeve executive</h3>
                            <h3 className="price">৳ 1250 </h3>
                          </div>
                          <div className="price-description">
                            <h3>Qty: 1</h3>
                            <h3>Color: TEAL,size: 15</h3>
                          </div>
                          <div className="remove-product w-100">
                            <a href="#" className="remove-item">
                              <i className="fa-regular fa-trash-can"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card mb-3">
                    <div className="row g-0">
                      <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <img src="./assets/images/products/1.jpg" className="img-fluid" alt=""/>
                      </div>
                      <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
                        <div className="card-body">
                          <div className="products-namebox">
                            <h3 className="name">mens shirt s/sleeve executive</h3>
                            <h3 className="price">৳ 1250 </h3>
                          </div>
                          <div className="price-description">
                            <h3>Qty: 1</h3>
                            <h3>Color: TEAL,size: 15</h3>
                          </div>
                          <div className="remove-product w-100">
                            <a href="#" className="remove-item">
                              <i className="fa-regular fa-trash-can"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="amount-box">
                  <h3 className="text-start"> subtotal </h3>
                  <h3 className="text-end">৳ 1250 </h3>
                </div>
                <div className="button-sets">
                  <a href="#" className="btn btn-outline-primary view-shopping">view shopping bag</a>
                  <a href="#" className="btn btn-secondary checkout">checkout</a>
                </div>
              </div>
            </li>

          </ul>
        </div>
      </div> */}
    </>
  );
};
export default CartWishAccount;
