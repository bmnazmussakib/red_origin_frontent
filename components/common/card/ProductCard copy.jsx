import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkFromWishlist, tAlert } from "../../../helpers/helper";
import {
  addToWishList,
  addToWishListBackend,
} from "../../../store/slice/WishListSlice";
import QuickVew from "../../QuickVew";
import { setModalId } from "../../../store/slice/GlobalSetting";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import Image from "next/image";

function ProductCard({
  base_discounted_price,
  base_price,
  discount,
  discount_type,
  featured,
  id,
  name,
  photos,
  rating,
  sales,
  thumbnail_image,
  todays_deal,
  unit,
  has_discount,
  key,
  wishLists,
  tags,
  slug,
  hover_image,
  choice_options,
  price
}) {
  let wishListSlice = useSelector(state => state.wishListSlice?.wishlist)
  let [checkListClass, setCheckListClass] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);

  // let checkListClass = "";

  console.log("wishLists: ", wishListSlice);

  console.log("choice_options: ", choice_options);
  console.log("thumbnail_image: ", thumbnail_image);

  // if (checkFromWishlist(wishLists, id)) {
  //   checkListClass = "bg-danger";
  // } else {
  //   checkListClass = "";
  // }

  useEffect(() => {
    if (checkFromWishlist(wishListSlice, id)) {
      setCheckListClass("logo-bg-color text-white");
    }
    else {
      setCheckListClass("");
    }
  }, [id, wishLists, wishListSlice]);

  let router = useRouter();
  let dispatch = useDispatch();

  const handleModal = (id) => {
    dispatch(setModalId({ id }));
  };

  let [cardimages, setCardImages] = useState([
    thumbnail_image
  ]);

  let [hoverImage, sethoverImage] = useState([
    hover_image
  ]);

  let [thumbnailImage, setthumbnailImage] = useState(thumbnail_image);

  let [images, setImages] = useState([

  ]);

  let [colorCode, setColorCode] = useState([

  ]);

  useEffect(() => {
    {
      choice_options?.map((item, index) => {
        Object.entries(item.color_wise_images).map((color_wise_image, index2) => {
          console.log('color_wise_image', color_wise_image);
          color_wise_image?.map((image, indx) => {
            if (indx == 0) {
              setColorCode((prev) => [...prev, image]);
            }
            if (indx == 1) {
              image?.map((img, indx4) => {
                if (indx4 == 0) {
                  setImages((prev) => [...prev, img])
                }
                if (indx4 == 1) {
                  setCardImages(image);
                }
              })
            }
          })
        });
      })
    }
  }, [])

  console.log('cardimages', cardimages);

  console.log('imagesss', images);
  console.log('choice_options', choice_options);
  console.log('colorCode', colorCode);

  const isActive = (index) => {
    return index === activeIndex;
  };

  const handleImage = (event,img, key) => {
    setActiveIndex(key);
    setthumbnailImage(img);
    let Code = colorCode[key];
    choice_options?.map((item, index) => {
      Object.entries(item.color_wise_images).map((color_wise_image, index2) => {
        console.log('color_wise_image', color_wise_image);
        if (color_wise_image[0].includes(Code)) {
          if (color_wise_image[1]) {
            if (color_wise_image[1][1]) {
              let hover_image = color_wise_image[1][1];
              setCardImages((prev) => {
                const updatedCardImages = [...prev];
                updatedCardImages[1] = hover_image;
                return updatedCardImages;
              });
              sethoverImage(hover_image);
            }
            else {
              setCardImages((prev) => {
                const updatedCardImages = [...prev];
                updatedCardImages[1] = '';
                return updatedCardImages;
              });
              sethoverImage('');
            }
          }
        }
      });
    })

  }

  return (
    <>
      <div className="solasta__product-card">
        <Link href={"/details/" + slug} className="solasta__product-image">
          {/* <img className="font__image" src={cardimages && cardimages[1]} alt="solasta-image" /> */}
          <img className="font__image" src={hoverImage} alt="solasta-image" />
          <img className="back__image" src={thumbnailImage} alt="solasta-image" />
        </Link>
        <div className="product__info">
          <ul className="color__swatcher">
            {images?.map((img, key) => {
              return (
                <li className={isActive(key) ? 'active' : ''} onClick={(event) => handleImage(event,img, key)}><img src={img} width={20}  /></li>
              )
            })}
          </ul>

          {/* <ul className="color__swatcher">
            <li>
              <a href="#0"></a>
            </li>
            <li>
              <a className="active" href="#0"></a>
            </li>
            <li>
              <a href="#0"></a>
            </li>
          </ul> */}
          <ul className="cart__info">
            <li>
              <a
                onClick={(e) => {
                  if (!hasCookie("user_data")) {
                    tAlert("Please Login First", "warning");
                    return false;
                  }
                  e.preventDefault();
                  dispatch(addToWishListBackend({ id }));
                  e.currentTarget.className =
                    (e.currentTarget.className.includes("logo-bg-color logo-text-color")
                      ? "bg-transparen"
                      : "logo-bg-color text-white") + " btn add-towish-btn ";
                }}
                className={"btn add-towish-btn " + checkListClass}
              >
                <i class="ri-heart-line"></i>
              </a>
            </li>
            <li>
              {/* <a
                href="javascript:void(0)"
                onClick={(e) => {
                  router.push("/details/" + slug);
                }}
                className="nav-link"
              >
                <i class="ri-shopping-cart-line"></i>
              </a> */}
              <Link
                prefetch={true}
                href={"/details/" + slug}
                className="nav-link"
              >
                <i class="ri-shopping-cart-line"></i>
              </Link>
            </li>
          </ul>
        </div>
        <h4>
          <Link
            prefetch={true}
            href={"/details/" + slug}
            className="nav-link"
          >
            {name ?? ''}
          </Link>
        </h4>
        <span className="solasta-price">
          {price ? price : ''}

          {!price && base_discounted_price && base_price && base_discounted_price != base_price &&
            base_price > base_discounted_price ? (
            <>
              <span className="solasta-price">৳ {base_discounted_price} </span>
              {/* <span className="mr-2">{base_discounted_price}</span>{" "} */}
              <del>{base_price}</del>
            </>
          ) : (
            <>
              ৳ {base_price}
            </>
          )}
          {" "}

        </span>
      </div>

      {/* <div className="single-product">
        <div className="card">
          <div className="product-image">
            <Link prefetch={true} href={"/details/" + slug}>
              <Image fill={true} loading="lazy"
                src={thumbnail_image}
                alt=""
                className="img-fluid primary-image"
              />

            </Link>
            <a
              onClick={(e) => {
                if (!hasCookie("user_data")) {
                  tAlert("Please Login First", "warning");
                  return false;
                }
                e.preventDefault();
                dispatch(addToWishListBackend({ id }));
                e.currentTarget.className =
                  (e.currentTarget.className.includes("bg-danger")
                    ? "bg-light"
                    : "bg-danger") + " btn add-towish-btn ";
              }}
              className={"btn add-towish-btn " + checkListClass}
            >
              <i className="fa-regular fa-heart"></i>
            </a>
            <div className="product-view-sets">
              <ul className="nav">
                <li className="nav-item">
                  <a
                    href="javascript:void(0)"
                    onClick={(e) => {
                      router.push("/details/" + slug);
                    }}
                    className="nav-link"
                  >
                    <i className="icofont-cart-alt"></i>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="javascript:void(0)" className="nav-link">
                    <i
                      className="icofont-eye-alt"
                      data-bs-toggle="modal"
                      data-bs-target={"#productQuickView"}
                      onClick={() => handleModal(id)}
                    ></i>
                  </a>
                </li>
                <li className="nav-item d-none">
                  <a
                    href="javascript:void(0)"
                    onClick={(e) => {
                      addToCompare()
                    }}
                    className="nav-link"
                  >
                    <i class="icofont-law-alt-1"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="product-description">
            <h4 className="product-name">
              <Link prefetch={true} href={"/details/" + slug}>
                {name}
              </Link>
            </h4>
            <p className="price">
              ৳{" "}
              {discounted_price != price ? (
                <>
                  <span>{discounted_price}</span>{" "}
                  <span>
                    <del>{price}</del>
                  </span>
                </>
              ) : (
                <span>{price}</span>
              )}{" "}
            </p>
          </div>
        </div>
      </div> */}

    </>
  );
}

export default ProductCard;
