import React, { useEffect } from "react";
import ComboProducts from "./ComboProduct";
import { newarrivalbreakpoints, post, tAlert } from "../../helpers/helper";
import { SwiperSlide } from "swiper/react";
import Slider from "../common/Slider";
import axios from "axios";
import { cart } from "../../utils/route";

const BuyOneGetOne = ({ selectedInfo }) => {
  let [products, setProducts] = React.useState([]);
  useEffect(() => {
    if (selectedInfo.barcode) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_SERVER_MAIN_URL}api/v3/promotionByBarcode/${selectedInfo.barcode}`
        )
        .then((res) => {
          console.log("res", res);
          if (res.data && res.data.data && res.data.data.length > 0) {
            let promotions = res.data.data ?? [];
            let get_products = [];
            promotions.forEach((promotion) => {
              get_products = [...get_products, ...promotion.promotion_get ?? []];
            });
            console.log("get_products", get_products);
            setProducts(get_products);
          } else {
            setProducts([]);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }, [selectedInfo]);
  console.log("selectedInfo", selectedInfo);
  const addBuyProductToCart = async (barcode) => {
    let { data } = await post(
      cart.CART_PROMOTION_ADD + selectedInfo.barcode,
      null,
      {
        barcode: barcode,
      }
    );
    console.log(data);
    if (data?.result == true) {
      tAlert("Product added to cart successfully", "success");
    } else {
      tAlert(data?.message ?? "Server Error", "error");
    }
  };
  return (
    <>
      {products && products.length > 0 && (
        <div className="combo-products">
          <div className="title-box d-flex justify-content-between">
            <h3>buy X get Y offer</h3>
            <h3>
              <a href="">View all</a>
            </h3>
          </div>
          <div className="combo-main">
            <div className="product-box">
              <Slider breakpoints={newarrivalbreakpoints} perPage={4}>
                {products.map((product, index) => (
                  <SwiperSlide key={index}>
                    <ComboProducts
                      product={product}
                      addBuyProductToCart={addBuyProductToCart}
                    />
                  </SwiperSlide>
                ))}{" "}
              </Slider>
            </div>
            <div className="price-box"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default BuyOneGetOne;
