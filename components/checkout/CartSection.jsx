import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { post } from "../../helpers/helper";
import { cart as cartRoute } from "../../utils/route";
import { makeInteger } from "../../utils/utils";
import Link from "next/link";

const CartSection = ({ carts: cartProduct, getProducts }) => {
  console.log("======================", cartProduct);
  console.log("======================")
  return (
    <>
      <div className="table-responsive">
        <table className="table mb-0">
          <thead>
            <tr>
              <td className="text-center td-image">Image</td>
              <td className="text-left td-name text-center">Product Info</td>
              <td className="text-center td-price">Price</td>
              {/*<td className="text-center">VAT</td>*/}
              <td className="text-center td-price text-danger">
                Discount
              </td>
              <td className="text-center td-total">Total</td>
            </tr>
          </thead>
          <tbody>
            {cartProduct[0]?.cart_items?.map(
              (
                {
                  id,
                  slug,
                  owner_id,
                  user_id,
                  product_id,
                  product_name,
                  sku,
                  stock,
                  barcode,
                  product_thumbnail_image,
                  variation,
                  price,
                  circular_discount,
                  flash_discount,
                  discount,
                  loyalty_discount,
                  currency_symbol,
                  tax,
                  shipping_cost,
                  quantity,
                  lower_limit,
                  upper_limit,
                  original_price,
                },
                index
              ) => {
                return (
                  <tr key={id}>
                    <td>
                      {/* <img
                      src={product_thumbnail_image}
                      alt=""
                      className="img-fluid"
                    /> */}
                      <img
                        src={product_thumbnail_image}
                        alt=""
                        className="img-fluid"
                      />
                    </td>
                    <td>
                      <h3>
                        <Link prefetch={true} href={"/details/" + slug}>
                          {product_name} {variation && "| " + variation.toUpperCase().replace(/_/g, " ")}
                        </Link>
                      </h3>
                      <p className="size">
                        {/* Color :{variation.split("-")[0]}|Size:
                      {variation.split("-")[1]} */}
                      </p>
                      {/* <p className="size">
                      Color :<span className="text-uppercase">{color}</span>
                      |Size:
                      <span className="text-uppercase">{size}</span>
                    </p> */}
                      <p className="size">Qty : {quantity}</p>
                      <p className="size">Model : {sku}</p>

                      {/* <p className="categories">
                      Categories: <a href="#">Mens Casual Shirt</a>
                      <a href="#">MENS TOP WEAR MENS</a>
                    </p> */}
                    </td>

                    <td>
                      <p className="text-center">
                        {/* {flash_discount + circular_discount + discount} */}
                        {price}
                      </p>
                    </td>
                    {/*<td>*/}
                    {/*  <p className="text-center">*/}
                    {/*    /!* {flash_discount + circular_discount + discount} *!/*/}
                    {/*    {tax}*/}
                    {/*  </p>*/}
                    {/*</td>*/}
                    <td>
                      <p className="text-center text-danger">{(flash_discount + circular_discount + discount).toFixed(2)}</p>
                    </td>
                    <td>
                      <p className="price">
                        {/* ({calculable_price} - {discount} + {tax}) * {quantity} = */}
                        {((price * quantity) - (flash_discount + circular_discount + discount) * quantity).toFixed(2)}
                      </p>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
      {getProducts?.length > 0 && (

        <>
          <hr />
          <h4 className="text-center">Buy 1 Get 1</h4>
          <table className="table mb-0">
            <thead>
              <tr>
                <td className="text-center td-image">Image</td>
                <td className="text-left td-name text-center">Product Info</td>
                <td className="text-center td-price">Base Price</td>

                <td className="text-center td-total">Total</td>
              </tr>
            </thead>
            <tbody>
              {getProducts?.map(
                (
                  {
                    id,
                    product_id,
                    variant,
                    barcode,
                    sku,
                    price,
                    qty,
                    image,
                    user_barcode,
                    pending_qty,
                    thumbnail_img,
                    slug,
                    name,
                  },
                  index
                ) => {

                  return (
                    <tr key={id}>
                      <td>
                        {/* <img
                      src={product_thumbnail_image}
                      alt=""
                      className="img-fluid"
                    /> */}
                        <img src={thumbnail_img} alt="" className="img-fluid" />
                      </td>
                      <td>
                        <h3>
                          <Link href={"/details/" + slug}>
                            {name} | {variant}
                          </Link>
                        </h3>
                        <p className="size">
                          Color :{variant.split("-")[0]}|Size:
                          {variant.split("-")[1]}
                        </p>
                        {/* <p className="size">
                      Color :<span className="text-uppercase">{color}</span>
                      |Size:
                      <span className="text-uppercase">{size}</span>
                    </p> */}
                        <p className="size">Qty : {qty}</p>
                        {/* <p className="categories">
                      Categories: <a href="#">Mens Casual Shirt</a>
                      <a href="#">MENS TOP WEAR MENS</a>
                    </p> */}
                      </td>

                      <td className="text-center td-total">
                        <span>{price} </span>
                        <span className="badge bg-success ml-2">Free</span>
                      </td>
                      <td className="text-center td-total">0.00</td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </>
      )}

    </>
  );
};

export default CartSection;
