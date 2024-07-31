import React, { useEffect, useState } from "react";
import {
  addToCartBackend,
  checkFromWishlist,
  cookie,
  extractVariant,
  extractor,
  filterVariant,
  get,
  post,
  tAlert,
} from "../helpers/helper";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import Slider from "./common/Slider";
import {
  addToCart,
  clearCoupon,
  clearMemberShip,
} from "../store/slice/CartSlice";
import { useDispatch, useSelector } from "react-redux";
import { addToWishList } from "../store/slice/WishListSlice";
import { hasCookie } from "cookies-next";
import AddToCartWish from "./details/AddToCartWish";
export default function QuickVew() {
  const [id, setId] = useState();
  const [details, setDetails] = useState();
  let [variantPrice, setVariantPrice] = useState({
    base_price: 0,
    base_discounted_price: 0,
  });
  let [selectedBarcodeInfo, setSelectedBarcodeInfo] = useState({
    barcode: null,
    hasStock: true,
  });
  let [selectedSize, setSelectedSize] = useState(null);
  const dispatch = useDispatch();
  const wishLists = cookie("wishList");
  const modalId = useSelector((state) => {
    return state.globalSetting.modalId;
  });

  const fetchProductDetails = (id) => {
    get("/v2/products/" + id).then((res) => {
      if (res.data.success == true) {
        setDetails(res.data.data[0]);
        setVariantPrice({
          base_price: res.data.data[0]?.stroked_price,
          base_discounted_price: res.data.data[0]?.main_price,
        });
        setId(id);
      }
    });
  };

  useEffect(() => {
    if (modalId) {
      fetchProductDetails(modalId);
    }
  }, [modalId]);
  async function storeRequestStock() {
    if (!selectedSize) {
      return false;
    }
    let auth = hasCookie("user_data");
    if (!auth) {
      tAlert("Please login first", "error");
      return;
    }
    // try {
    let { data } = await post(`/product-requisition`, null, {
      product_id: details?.id,
      barcode: selectedBarcodeInfo?.barcode,
    });
    if (data?.result) {
      tAlert(data?.message, "success");
      // fetchReview();
    } else {
      tAlert(data?.message, "error");
    }
    // } catch (error) {
    //   tAlert("Something went wrong", "error");
    // }
  }
  useEffect(() => {
    console.log(details)
  }, []);
  let storeCartToBackend = async () => {
    if (!selectedSize) {
      tAlert("Please select size");
      return;
    }
    let selectedVariant = filterVariant(
      details?.variant,
      selectedSize,
      null,
      true
    );
    if (selectedVariant && selectedVariant.length > 0) {
      let {
        barcode,
        variant: variantName,
        stock,
        base_price,
        base_discounted_price,
        base_tax,
      } = selectedVariant[0];
      let { color, size } = extractVariant(variantName);
      if (stock <= 0) {
        tAlert("Stock not available");
        return;
      }
      let { add_status, message: store_message } = await addToCartBackend({
        id: id,
        variant: variantName,
        quantity: 1,
      });
      if (add_status) {
        dispatch(
          addToCart({
            id: details?.id,
            name: details?.name,
            thumbnail_image: details?.thumbnail_image,
            calculable_price: base_discounted_price,
            barcode: details?.barcode || null,
            size: selectedSize,
            color: details?.colors || null,
            variant: variantName,
            discount:
              base_price == base_discounted_price
                ? 0
                : base_price - base_discounted_price,
            stock: stock || 0,
            tax: base_tax || 0,
            shipping_cost: details.shipping_cost || 0,
            slug: details?.slug,
          })
        );
        dispatch(clearCoupon());
        dispatch(clearMemberShip());
      } else {
        tAlert(store_message || "Stock not available");
      }
    }
  };

  return (
    <div
      className="modal fade quick-view"
      id={"productQuickView"}
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          {/* <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div> */}
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>

          <div className="modal-body p-0">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <Slider
                  className="quick-view-slider"
                  perPage={1}
                  // breakpoints={breakPoints}
                  pagination={false}
                >
                  {details?.photos?.map((photo) => {
                    return (
                      <SwiperSlide>
                        <img src={photo?.path} alt="" />
                      </SwiperSlide>
                    );
                  })}
                </Slider>
                {/*<img src="http://sailors3bucket1.s3.ap-southeast-1.amazonaws.com/uploads/all/CQDDW2U5l8uWMJWhtVWktSpmjkAwHRsugwx6TxaC.jpg" alt="" />*/}
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div className="product-info-main">
                  <div className="product-title-flex">
                    <div className="title-box">
                      <h4> {details?.name} </h4>
                      <div className="sku-flex">
                        <div className="sku">STYLE CODE : {details?.sku} </div>
                        <div className="rating">
                          <ul className="nav">
                            {[...Array(details?.rating)].map((e, i) => {
                              return (
                                <li className="nav-item" key={i}>
                                  <a className="nav-link" href="#">
                                    <i className="fa-solid fa-star"></i>
                                  </a>
                                </li>
                              );
                            })}

                            <li className="nav-item">
                              <a className="nav-link disabled">
                                ({details?.rating_count})
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="icon-box d-none">
                      <a href="#">
                        <i className="fa-solid fa-share-nodes"></i>
                      </a>
                      <div className="pop-share-main">
                        <ul className="nav">
                          <li className="nav-item fb">
                            <a className="nav-link" href="#">
                              <i className="fa-brands fa-facebook-f"></i>
                            </a>
                          </li>
                          <li className="nav-item twiter">
                            <a className="nav-link" href="#">
                              <i className="fa-brands fa-twitter"></i>
                            </a>
                          </li>
                          <li className="nav-item printerest">
                            <a className="nav-link" href="#">
                              <i className="fa-brands fa-pinterest-p"></i>
                            </a>
                          </li>
                          <li className="nav-item insta me-0">
                            <a className="nav-link" href="#">
                              <i className="fa-brands fa-instagram"></i>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  {
                    (modalId && details) && <AddToCartWish
                      productInfo={details}
                      choiceOption={details?.choice_options}
                      variant={details?.variant}
                    />
                  }

                  {/* <div className="social-share">
                    <ul class="nav">
                      <li class="nav-item">
                        <a class="nav-link" href="https://www.facebook.com/sharer/sharer.php?u=YOUR_URL" target="_blank">
                          <i class="fa-brands fa-facebook-f"></i> <span>Facebook</span>
                        </a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="https://twitter.com/intent/tweet?url=YOUR_URL&text=YOUR_TEXT" target="_blank">
                          <i class="fa-brands fa-twitter"></i> <span>Twitter</span>
                        </a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="https://pinterest.com/pin/create/button/?url=YOUR_URL&media=YOUR_IMAGE_URL&description=YOUR_DESCRIPTION" target="_blank">
                          <i class="fa-brands fa-pinterest-p"></i> <span>Pinterest</span>
                        </a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="https://wa.me/?text=YOUR_URL" target="_blank">
                          <i class="fa-brands fa-whatsapp"></i> <span>Whatsapp</span>
                        </a>
                      </li>
                    </ul>
                  </div> */}

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
