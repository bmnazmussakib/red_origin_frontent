import axios from "axios";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { cookie, filterVariant, get, post, tAlert } from "../../helpers/helper";
import mainStore from "../../store";
import { filterReviews, getSettingValue } from "../../utils/filters";
import { cart, detail } from "../../utils/route";

import dynamic from "next/dynamic";
import Head from "next/head.js";
import Image from "next/image";
import { useRouter } from "next/router.js";
import { SwiperSlide } from "swiper/react";
import SlickSlider from "../../components/common/SlickSlider.jsx";
import Slider from "../../components/common/Slider.jsx";
import ProductCard from "../../components/common/card/ProductCard.jsx";
// import ProductOfferCard from "../../components/common/card/ProductOfferCard";
import AddToCartWish from "../../components/details/AddToCartWish.jsx";

const BuyOneGetOne = dynamic(
	() => import("../../components/details/BuyOneGetOne"),
	{
		ssr: false,
		loading: () => <div></div>,
	}
);
const ProductDetails = ({
	details,
	wishLists,
	viewed_products,
	reviews,
	viewed_product_id,
	offerProduct,
	backendCartList
}) => {
	let {
		added_by,
		brand,
		calculable_price,
		choice_options,
		colors,
		currency_symbol,
		current_stock,
		description,
		discount,
		earn_point,
		has_discount,
		id,
		link,
		main_price,
		name,
		photos,
		price_high_low,
		rating,
		rating_count,
		seller_id,
		shop_id,
		shop_logo,
		shop_name,
		sizes,
		stroked_price,
		tags,
		thumbnail_image,
		unit,
		video_link,
		sku,
		style_code,
		breadCrumb,
		size_fit_link,
		size_chart_link,
		variant,
		stockist,
		meta,
		care_level,
		disclaimer,
		suggestion_cat,
		tax,
		slug,
		shipping_cost,
	} = details;

	console.log("details:=======", details);
	console.log("offerproduct", offerProduct);
	// console.log('backendCartList: ', backendCartList)

	console.log("viewed_products: ", viewed_products);
	let [forceUpdate, setForceUpdate] = useState(0);
	let globalSetting = useSelector((state) => state.globalSetting);
	let [selectedSize, setSelectedSize] = useState(null);
	let [variantPrice, setVariantPrice] = useState({
		base_price: stroked_price,
		base_discounted_price: main_price,
	});
	let [selectedInfo, setSelectedInfo] = useState({
		barcode: null,
		selectedMainSize: null,
	});
	let [selectSizeStockList, setSelectSizeStockList] = useState([]);
	let [allReviews, setAllReviews] = useState(reviews);
	let [stockAlert, setStockAlert] = useState(null);
	let dispatch = useDispatch();
	let router = useRouter();
	let [imageLink, setImageLink] = useState(null);
	let [selectedBarcodeInfo, setSelectedBarcodeInfo] = useState({
		barcode: null,
		hasStock: true,
	});
	let fetchImageLink = async () => {
		let { data, status } = await get("/v2/offer1/banner").catch((err) => {
			//console.log(err);
		});
		if (status == 200) {
			setImageLink(data);
		}
	};
	console.log("imageLink: ", imageLink);

	let fetchReview = async () => {
		try {
			let { data } = await get(detail.REVIEW + id);
			if (data?.success === true) {
				setAllReviews(data?.data);
			}
		} catch (error) {
			console.log(error);
		}
	};

	let getStockListData = async () => {
		if (!selectedSize) {
			return false;
		}
		let barcode = filterVariant(variant, selectedSize);

		let token = "ms:ng+zFcLPLxO2OTlgiu2GbA==";
		let cloud_pos_api =
			// "https://cloudpos.epylliongroup.com/Sailor/api/GetStoreWiseProductStockData";
			"";
		let { data } = await axios.post(
			cloud_pos_api,
			{ COMPANY_CODE: "10001", BARCODE: barcode },
			{
				headers: {
					Authorization: token,
					Accept: "application/json",
				},
			}
		);

		if (data && data?.Data && data?.Data?.ProductStockList) {
			let stock = [];
			data?.Data?.ProductStockList?.forEach((item) => {
				stock.push({
					STORE_NAME: item.STORE_NAME,
					SAL_BAL_QTY: item.SAL_BAL_QTY,
				});
			});
			setSelectSizeStockList(stock);
		}
	};

	useEffect(() => {
		cookie("viewed_product", JSON.stringify(viewed_product_id), "set");
	}, []);

	const upVote = async (review_id) => {
		if (!cookie("token")) {
			tAlert("Please login first", "error");
			return;
		}
		try {
			let { data } = await post(`/reviews/vote/${review_id}`);
			if (data?.success) {
				tAlert(data?.message, "success");
				fetchReview();
			} else {
				tAlert(data?.message, "error");
			}
		} catch (error) {
			tAlert("Something went wrong", "error");
		}
	};

	let categoryProducts =
		suggestion_cat &&
			suggestion_cat?.data &&
			suggestion_cat?.data[0] &&
			suggestion_cat?.data[0].products &&
			suggestion_cat?.data[0].products?.data
			? suggestion_cat?.data[0].products?.data
			: [];

	let sliderInner = useRef();

	const bannerImages = imageLink?.path;
	const bannerLinks = imageLink?.link;

	const mergeBannerImageLink =
		bannerImages?.map((image, index) => ({
			image,
			link: bannerLinks?.[index] || "#", // Set a default link if needed
		})) || [];

	console.log("bannerImages: ", imageLink);

	const noVaraint = photos?.filter((item) => item.variant === "");
	const withVaraint = photos?.filter((item) => item.variant !== "");
	console.log("noVaraint: ", noVaraint);
	console.log("withVaraint: ", withVaraint);

	const [allPhotos, setAllPhotos] = useState([]);

	const [colorWiseImg, setColorWiseImg] = useState(null);
	const [TempAllVerImg, setTempAllVerImg] = useState(null);

	useEffect(() => {
		let filter_all_variant_image = [];
		let img = choice_options?.map((item, index) => {
			console.log("choice_optionsss", choice_options);

			if (item?.title == "COLOR") {
				// Object.entries(item?.color_wise_images).map((img) => {
				// 	setColorWiseImg(img)
				// 	console.log('colorWiseImg:=====', urls)
				// })

				Object.entries(item?.color_wise_images).forEach(
					([variant, paths]) => {
						paths.forEach((item) => {
							filter_all_variant_image.push({
								variant: variant,
								path: item,
							});
						});
					}
				);
			}
		});
		setTempAllVerImg(filter_all_variant_image);
		console.log("filter_all_variant_image: ", filter_all_variant_image);
		setAllPhotos(filter_all_variant_image);
		// console.log(img)
	}, [choice_options]);

	return (
		<>
			<Head>
				<title>
					{meta?.title ?? name}|
					{process.env.APP_NAME ||
						" SOLASTA | Your One Stop Shopping Solution"}
				</title>
				<meta name="description" content={meta?.description} />
				<meta name="keywords" content={meta?.image} />
				{/* twitter card */}
				<meta name="twitter:card" content="product" />
				<meta name="twitter:site" content="@publisher_handle" />
				<meta name="twitter:title" content={name} />
				<meta name="twitter:description" content={meta?.description} />
				<meta name="twitter:creator" content="@author_handle" />
				<meta name="twitter:image" content={meta?.image} />
				<meta name="twitter:data1" content={main_price} />
				<meta name="twitter:label1" content="Price" />
				{/* twitter card */}
				{/* Open Graph data */}
				<meta property="og:title" content={name} />
				<meta property="og:type" content="og:product" />
				<meta
					property="og:url"
					content={`${"https://rise-brand.com/"}${router.asPath}`}
				/>
				<meta
					property="og:image"
					content={meta?.image || thumbnail_image}
				/>
				<meta
					property="og:description"
					content={meta?.description ?? process.env.APP_NAME}
				/>
				<meta
					name="keywords"
					content={meta?.description ?? process.env.APP_NAME}
				/>
				<meta property="og:site_name" content={meta?.title} />
				<meta property="og:price:amount" content={main_price} />
				<meta property="og:price:currency" content="BDT" />
				<meta property="product:price:amount" content={main_price} />
				<meta property="product:price:currency" content="BDT" />
				<meta property="product:brand" content="solasta" />
				<meta property="product:availability" content="in stock" />
				<meta property="og:id" content={id} />
				<meta property="og:image_link" content={thumbnail_image} />
				<meta property="og:availability" content="in stock" />
				<meta property="product:condition" content="New" />
				<meta property="product:retailer_item_id" content="solasta" />
				<meta property="product:category" content={suggestion_cat ?? ""} />
				<meta
					property="fb:app_id"
					content={getSettingValue(
						globalSetting?.globalsetting,
						"facebook_pixel_id"
					)}
				></meta>
				{/* Open Graph data */}
			</Head>
			<section className="breadcrum-main">
				<div className="container">
					<div className="row">
						<div className="col-12">
							<nav aria-label="breadcrumb">
								<ol className="breadcrumb">
									<li className="breadcrumb-item">
										<Link prefetch={true} href="/">
											Home
										</Link>
									</li>
									{Object.keys(breadCrumb)?.map((key) => {
										return (
											<li className="breadcrumb-item" key={key}>
												<Link
													prefetch={true}
													href={"/shop?cat_id=" + breadCrumb[key]}
												>
													{key}
												</Link>
											</li>
										);
									})}
								</ol>
							</nav>
						</div>
					</div>
				</div>
			</section>
			<section className="details-main mb-5">
				<div className="container">
					<div className="row">
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<div className="custom-details-slider">
								<div className="product-details rise-product__details-slider">
									<SlickSlider
										forceUpdate={forceUpdate}
										noVaraint={noVaraint}
										withVaraint={withVaraint}
										photos={allPhotos}
										originalImage={TempAllVerImg}
										colorWiseImg={colorWiseImg}
									/>
									{/* <ProductThumSlider /> */}
								</div>
								<div
									className="product-info-main fluid__instructions"
									style={{ position: "relative" }}
								>
									<div className="product-title-flex">
										<div className="title-box">
											<h4> {name} </h4>
											<div className="sku-flex">
												<div className="sku">
													Style Code : {style_code}{" "}
												</div>
												<div className="rating">
													<ul className="nav">
														{[...Array(rating)].map((e, i) => {
															return (
																<li
																	className="nav-item"
																	key={i}
																>
																	<a
																		className="nav-link"
																		href="#"
																	>
																		<i className="fa-solid fa-star"></i>
																	</a>
																</li>
															);
														})}

														<li className="nav-item d-none">
															<a className="nav-link disabled">
																({rating})
															</a>
														</li>
													</ul>
												</div>
											</div>
										</div>
										<div className="icon-box d-none">
											<a href="javascript:void(0)">
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
									<AddToCartWish
										productInfo={details}
										choiceOption={choice_options}
										variant={variant}
										wishListsAll={wishLists}
										setAllPhotos={setAllPhotos}
										photos={photos}
										allPhotos={allPhotos}
										originalImage={TempAllVerImg}
										setForceUpdate={setForceUpdate}
										backendCartList={backendCartList}
									/>

									<div className="shipping-policy d-none">
										<div className="shipping-title-flex">
											{/* <div className="icon">
                        <img src="/assets/images/icon/truck-darkt.svg" alt="" />
                      </div> */}
											{/* <h5>delivery</h5> */}
										</div>
										<div className="shipping-process-flex d-none">
											<div className="box">
												<p
													dangerouslySetInnerHTML={{
														__html: care_level,
													}}
												></p>
											</div>
											<div className="box">
												<p
													className="mb-0"
													dangerouslySetInnerHTML={{
														__html: disclaimer,
													}}
												></p>
											</div>
										</div>
									</div>
									<div className="shipping-policy d-none">
										<div className="shipping-title-flex">
											<div className="icon">
												<img
													src="/assets/images/icon/free-delivery.png"
													alt=""
												/>
											</div>
											<h5>free return & exchange</h5>
										</div>
										<a
											href="javascript:void(0)"
											className="learn-more"
										>
											Learn More
										</a>
									</div>
									<div className="detaiils-description d-none">
										<div className="accordion" id="myAccordion">
											<div className="accordion-item">
												<h2
													className="accordion-header"
													id="headingOne"
												>
													<button
														type="button"
														className="accordion-button collapsed"
														data-bs-toggle="collapse"
														data-bs-target="#collapseOne"
													>
														Product Description
													</button>
												</h2>
												<div
													id="collapseOne"
													className="accordion-collapse collapse"
													data-bs-parent="#myAccordion"
												>
													<div className="accordion-body">
														<p
															dangerouslySetInnerHTML={{
																__html: description,
															}}
														></p>
													</div>
												</div>
											</div>
											{size_chart_link &&
												size_chart_link.match(
													/([^\/]+)\.jpg$/
												)?.[1] != "thimnail" && (
													<div className="accordion-item">
														<h2
															className="accordion-header"
															id="headingTwo"
														>
															<button
																type="button"
																className="accordion-button collapsed"
																data-bs-toggle="modal"
																data-bs-target="#modalInfo"
															>
																size guide
															</button>
														</h2>
														<div
															id="collapseTwo"
															className="accordion-collapse collapse "
															data-bs-parent="#myAccordion"
														>
															<div className="card-body">
																<img
																	src={size_chart_link}
																	alt=""
																	className="img-fluid"
																/>
															</div>
														</div>
													</div>
												)}
											<div className="accordion-item d-none">
												<h2
													className="accordion-header "
													id="headingThree"
												>
													{selectedSize ? (
														<button
															onClick={() => {
																getStockListData();
															}}
															type="button"
															className="accordion-button collapsed"
															data-bs-toggle="modal"
															data-bs-target="#modalAvailability"
														>
															availability in store
														</button>
													) : (
														<button
															onClick={() => {
																if (!selectedSize) {
																	tAlert("Please select size");
																	return;
																}
															}}
															type="button"
															className="accordion-button collapsed"
														>
															availability in store
														</button>
													)}
												</h2>
												<div
													id="collapseThree"
													className="accordion-collapse collapse "
													data-bs-parent="#myAccordion"
												>
													{/* <div className="card-body">
                            {selectedSize ? (
                              <table className="table">
                                <thead className="thead-light">
                                  <tr>
                                    <th scope="col">Place</th>
                                    <th scope="col">Stock</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectSizeStockList &&
                                  selectSizeStockList?.length > 0 ? (
                                    selectSizeStockList?.map(
                                      ({ STORE_NAME, SAL_BAL_QTY }) => {
                                        return (
                                          <tr>
                                            <td>{STORE_NAME}</td>
                                            <td>{SAL_BAL_QTY}</td>
                                          </tr>
                                        );
                                      }
                                    )
                                  ) : (
                                    <tr>
                                      <td colSpan="2">No stock available</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            ) : (
                              <table className="table">
                                <thead className="thead-light">
                                  <tr>
                                    <th scope="col">Place</th>
                                    <th scope="col">Stock</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {stockist && stockist?.length > 0 ? (
                                    stockist?.map(
                                      ({ STORE_NAME, SAL_BAL_QTY }) => {
                                        return (
                                          <tr>
                                            <td>{STORE_NAME}</td>
                                            <td>{SAL_BAL_QTY}</td>
                                          </tr>
                                        );
                                      }
                                    )
                                  ) : (
                                    <tr>
                                      <td colSpan="2">No stock available</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            )}
                          </div> */}
												</div>
											</div>
										</div>
									</div>
									{/* <hr /> */}
									<BuyOneGetOne selectedInfo={selectedInfo} />
									<div className="rise__accordion d-none">
										<div
											class="accordion accordion-flush"
											id="accordionFlushExample"
										>
											<div class="accordion-item">
												<h2
													class="accordion-header"
													id="flush-headingOne"
												>
													<button
														class="accordion-button"
														type="button"
														data-bs-toggle="collapse"
														data-bs-target="#flush-collapseOne"
														aria-expanded="true"
														aria-controls="flush-collapseOne"
													>
														Description
													</button>
												</h2>
												<div
													id="flush-collapseOne"
													class="accordion-collapse collapse show"
													aria-labelledby="flush-headingOne"
													data-bs-parent="#accordionFlushExample"
												>
													<div class="accordion-body">
														Lorem, ipsum dolor sit amet
														consectetur adipisicing elit. Itaque
														officia sed doloremque ducimus
														perspiciatis sequi mollitia quis, vero
														temporibus optio consequuntur porro
														cum pariatur aperiam nostrum
														voluptatem vel accusantium possimus
														est sit fuga quasi. Ad corrupti error
														nostrum iste debitis provident,
														repudiandae voluptates ducimus
														suscipit dignissimos quis voluptate
														quisquam deleniti porro.
													</div>
												</div>
											</div>
											<div class="accordion-item">
												<h2
													class="accordion-header"
													id="flush-headingTwo"
												>
													<button
														class="accordion-button collapsed"
														type="button"
														data-bs-toggle="collapse"
														data-bs-target="#flush-collapseTwo"
														aria-expanded="false"
														aria-controls="flush-collapseTwo"
													>
														Fabric And Care
													</button>
												</h2>
												<div
													id="flush-collapseTwo"
													class="accordion-collapse collapse"
													aria-labelledby="flush-headingTwo"
													data-bs-parent="#accordionFlushExample"
												>
													<div class="accordion-body">
														Lorem, ipsum dolor sit amet
														consectetur adipisicing elit. Itaque
														officia sed doloremque ducimus
														perspiciatis sequi mollitia quis, vero
														temporibus optio consequuntur porro
														cum pariatur aperiam nostrum
														voluptatem vel accusantium possimus
														est sit fuga quasi. Ad corrupti error
														nostrum iste debitis provident,
														repudiandae voluptates ducimus
														suscipit dignissimos quis voluptate
														quisquam deleniti porro.
													</div>
												</div>
											</div>
											<div class="accordion-item">
												<h2
													class="accordion-header"
													id="flush-headingThree"
												>
													<button
														class="accordion-button collapsed"
														type="button"
														data-bs-toggle="collapse"
														data-bs-target="#flush-collapseThree"
														aria-expanded="false"
														aria-controls="flush-collapseThree"
													>
														Availibility in Store
													</button>
												</h2>
												<div
													id="flush-collapseThree"
													class="accordion-collapse collapse"
													aria-labelledby="flush-headingThree"
													data-bs-parent="#accordionFlushExample"
												>
													<div class="accordion-body">
														Lorem, ipsum dolor sit amet
														consectetur adipisicing elit. Itaque
														officia sed doloremque ducimus
														perspiciatis sequi mollitia quis, vero
														temporibus optio consequuntur porro
														cum pariatur aperiam nostrum
														voluptatem vel accusantium possimus
														est sit fuga quasi. Ad corrupti error
														nostrum iste debitis provident,
														repudiandae voluptates ducimus
														suscipit dignissimos quis voluptate
														quisquam deleniti porro.
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="red-origin-tabs">
										<ul class="nav nav-tabs" id="myTab" role="tablist">
											<li class="nav-item" role="presentation">
												<button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Description</button>
											</li>
											<li class="nav-item" role="presentation">
												<button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Facbric and Care</button>
											</li>
											<li class="nav-item" role="presentation">
												<button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Availavility</button>
											</li>
										</ul>
										<div class="tab-content" id="myTabContent">
											<div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
												<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde enim eius veritatis praesentium impedit, laboriosam cumque omnis autem, et cum, exercitationem assumenda. Officia quae, ipsam nisi quis aliquam eveniet? Nobis!</p>
											</div>
											<div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
												<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde enim eius veritatis praesentium impedit, laboriosam cumque omnis autem, et cum, exercitationem assumenda. Officia quae, ipsam nisi quis aliquam eveniet? Nobis!</p>

											</div>
											<div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">
												<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde enim eius veritatis praesentium impedit, laboriosam cumque omnis autem, et cum, exercitationem assumenda. Officia quae, ipsam nisi quis aliquam eveniet? Nobis!</p>

											</div>
										</div>
									</div>

									<div className="social-share">
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
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className="review-main mt-0 d-none">
				<div className="container">
					<div className="row">
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<div className="common-title">
								<h2>reviews ({rating_count})</h2>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<div className="review-overview">
								<div className="left-box">
									<h5>average rating</h5>
									<div className="rating">
										<ul className="nav">
											{[...Array(rating)].map((e, i) => {
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
													{rating}
												</a>
											</li>
										</ul>
									</div>
								</div>
								<div className="right-box">
									<h5>Did the item fit well?</h5>

									<div className="progress-flex">
										<div className="title">small</div>
										<div className="progress-bar-wrap">
											<div className="progress">
												<div
													className="progress-bar"
													role="progressbar"
													aria-label="Basic example"
													aria-valuenow="0"
													aria-valuemin="0"
													aria-valuemax="100"
												></div>
											</div>
										</div>
										<div className="value">0%</div>
									</div>
									<div className="progress-flex">
										<div className="title">true to size</div>
										<div className="progress-bar-wrap">
											<div className="progress">
												<div
													className="progress-bar"
													role="progressbar"
													aria-label="Basic example"
													style={{ width: "100%" }}
													aria-valuenow="100"
													aria-valuemin="0"
													aria-valuemax="100"
												></div>
											</div>
										</div>
										<div className="value">100%</div>
									</div>
									<div className="progress-flex">
										<div className="title">large</div>
										<div className="progress-bar-wrap">
											<div className="progress">
												<div
													className="progress-bar"
													role="progressbar"
													aria-label="Basic example"
													aria-valuenow="0"
													aria-valuemin="0"
													aria-valuemax="100"
												></div>
											</div>
										</div>
										<div className="value">0%</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<div className="review-tabs-main">
								<div className="left-box">
									<ul
										className="nav nav-tabs"
										id="reviewTab"
										role="tablist"
									>
										<li className="nav-item" role="presentation">
											<button
												className="nav-link active"
												id="all-review-tab"
												data-bs-toggle="tab"
												data-bs-target="#all-review-tab-pane"
												type="button"
												role="tab"
												aria-controls="all-review-tab-pane"
												aria-selected="true"
											>
												all reviews ({allReviews.length})
											</button>
										</li>
									</ul>
								</div>
								<div className="right-box">
									<div className="single-sort">
										<div className="row">
											<label
												htmlFor="rating"
												className="col-sm-4 col-form-label"
											>
												rating
											</label>
											<div className="col-sm-8">
												<select
													className="form-select form-control"
													aria-label="Default select example"
													onChange={(e) =>
														setAllReviews([
															...filterReviews(
																e.target.value,
																reviews
															),
														])
													}
												>
													<option value="">all</option>
													<option value="1">One</option>
													<option value="2">Two</option>
													<option value="3">Three</option>
												</select>
											</div>
										</div>
									</div>

									<div className="single-sort">
										<div className="row">
											<label
												for=""
												className="col-sm-4 col-form-label"
											>
												sort by
											</label>
											<div className="col-sm-8">
												<select
													className="form-select form-control"
													aria-label="Default select example"
													onChange={(e) =>
														setAllReviews([
															...filterReviews(
																e.target.value,
																reviews
															),
														])
													}
												>
													<option value={""}>recommend</option>
													<option value="asc_rating"> ASC</option>
													<option value="desc_rating">DESC</option>
													<option value="most_helpful">
														MOST HELP FUL
													</option>
													<option value="recent">Recent</option>
													<option value="older">Older</option>
												</select>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* <ReviewForm
            productInfo={details}
            reviews={allReviews}
            setReviews={setAllReviews}
          /> */}
					<div className="row">
						<div className="col-12">
							<div className="tab-content" id="reviewTabContent">
								<div
									className="tab-pane fade show active"
									id="all-review-tab-pane"
									role="tabpanel"
									aria-labelledby="all-review-tab"
									tabIndex="0"
								>
									{allReviews.map(
										({
											id,
											avatar,
											comment,
											image,
											rating,
											time,
											upvote_count,
											upvote_id,
											user_id,
											user_name,
											overall_fit,
											time_date,
										}) => {
											// //console.log(comment);
											return (
												<div className="single-user-review">
													<div className="user">
														<div className="name">
															{user_name}
														</div>
														<div className="date">{time}</div>
													</div>
													<div className="review">
														<div className="rating">
															<ul className="nav">
																{[...Array(rating)].map(
																	(e, i) => {
																		return (
																			<li className="nav-item">
																				<a
																					className="nav-link"
																					href="#"
																				>
																					<i className="fa-solid fa-star"></i>
																				</a>
																			</li>
																		);
																	}
																)}
															</ul>
														</div>
														<h4>{comment}</h4>
														<div className="tags">
															<span>overall fit :</span>{" "}
															{overall_fit}
														</div>
														<div className="tags">
															<span>size :</span> XL
														</div>
													</div>
													<div className="review-image">
														<div className="image-box">
															<img src={image} alt="" />
														</div>
													</div>
													<div className="helpful">
														<a
															href="javascript:void(0)"
															className="is-helpful-btn"
															onClick={(e) => {
																e.target.className =
																	e.target.className.includes(
																		"text-danger"
																	)
																		? "is-helpful-btn "
																		: "is-helpful-btn text-danger";
																upVote(id);
															}}
														>
															<i className="fa-solid fa-thumbs-up"></i>{" "}
															Helpful ({upvote_count ?? 0})
														</a>
													</div>
												</div>
											);
										}
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="suggested-product-main">
				<div className="container">
					<div className="row">
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<div className="section__header flex">
								<h2 className="">You may also like</h2>
								<a className="show-all" href="#0">
									Shop ALL
								</a>
							</div>
						</div>
					</div>
					<div className="row">
						{viewed_products && viewed_products?.length > 0 ? (
							<Slider
								className="mc-category"
								perPage={3}
								navigation={false}
								pagination={true}
								autoplay={{
									delay: 3000,
									disableOnInteraction: false,
								}}
								loop={false}
								spaceBetween={20}
								speed={500}
								direction={"horizontal"}
								breakpoints={{
									320: {
										slidesPerView: 2,
									},
									575: {
										slidesPerView: 2,
									},
									768: {
										slidesPerView: 3,
									},
								}}
							>
								{viewed_products.map((product, index) => {
									console.log("product:eee ", product);
									return (
										<SwiperSlide key={index}>
											<ProductCard
												key={index}
												name={product.name}
												thumbnail_image={product?.thumbnail_image}
												hover_image={product?.hover_image}
												id={product.id}
												// price={product.base_price}
												base_price={product.base_price}
												base_discounted_price={
													product?.base_discounted_price
												}
												// details={product.links.details}
												wishLists={wishLists}
												slug={product.slug}
												choice_options={product.choice_options}
											/>
										</SwiperSlide>
									);
								})}
							</Slider>
						) : (
							<h3 className="product-not-found">No Product Found</h3>
						)}
					</div>
				</div>
			</section>
			<section className="recentview-product-main d-none">
				<div className="container">
					<div className="row">
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<div className="common-title mt-0">
								<h2>OFFERS</h2>
							</div>
						</div>
					</div>

					<div className="row">
						{offerProduct && offerProduct?.length > 0 ? (
							<Slider
								className="mc-category"
								perPage={5}
								navigation={false}
								pagination={true}
								autoplay={{
									delay: 3000,
									disableOnInteraction: false,
								}}
								loop={false}
								spaceBetween={20}
								speed={500}
								direction={"horizontal"}
								breakpoints={{
									320: {
										slidesPerView: 2,
									},
									575: {
										slidesPerView: 2,
									},
									768: {
										slidesPerView: 3,
									},
									991: {
										slidesPerView: 4,
									},
									1200: {
										slidesPerView: 5,
									},
								}}
							>
								{offerProduct.map((product, index) => {
									console.log("product:eee ", product);
									return (
										<SwiperSlide>
											<ProductOfferCard
												key={index}
												name={product.name}
												thumbnail_image={product?.thumbnail_image}
												hover_image={product?.hover_image}
												id={product.id}
												price={product.base_price}
												discounted_price={
													product.base_discounted_price
												}
												// details={product.links.details}
												wishLists={wishLists}
												slug={product.slug}
											/>
										</SwiperSlide>
									);
								})}
							</Slider>
						) : (
							<h3 className="product-not-found">No Product Found</h3>
						)}
					</div>
				</div>
			</section>

			{/*  size chart modal  */}
			<div
				className="modal fade"
				id="SizechartModal"
				tabIndex="-1"
				aria-labelledby="SizechartModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog  modal-dialog-centered modal-lg">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="SizechartModalLabel">
								Size Chart
							</h1>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div className="modal-body">
							<img src={size_chart_link} alt="" className="img-fluid" />
						</div>
					</div>
				</div>
			</div>
			{/* <section className="related-search-main">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div className="common-title">
                <h2>related searches</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <ul className="nav">
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    midi dress{" "}
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    belted dress
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    best selling dress
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    dresses
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    hotsale
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    midi dress{" "}
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    belted dress
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    best selling dress
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    dresses
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    hotsale
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    midi dress{" "}
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    belted dress
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    best selling dress
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    dresses
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    hotsale
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section> */}

			{/* modal  */}

			<div
				className="modal fade details-modal"
				id="modalInfo"
				tabIndex="-1"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content ">
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>

						<div className="modal-body">
							<div className="common-fieldset-main mb-0">
								<fieldset className="common-fieldset">
									<legend className="rounded"> size chart</legend>
									<img
										// fill={true}
										// loading="lazy"
										src={size_chart_link}
										alt=""
										className="img-fluid"
									/>
								</fieldset>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				className="modal fade"
				id="modalAvailability"
				tabIndex="-1"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog modal-dialog-centered modal-lg">
					<div className="modal-content">
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
						<div className="modal-body">
							<div className="common-fieldset-main">
								<div className="d-flex justify-content-center">
									<Image
										fill={true}
										loading="lazy"
										src={thumbnail_image}
										className=" h-25 w-25 img-fluid mb-3 mx-auto"
									/>
								</div>

								<fieldset className="common-fieldset">
									<legend className="rounded">
										{" "}
										Stock Availability
									</legend>
									<div className="table-responsive">
										{selectedSize && (
											<table className="table table-bordered mb-0">
												<thead className="thead-light">
													<tr>
														<th scope="col">Store</th>
														<th
															scope="col"
															className="text-center"
														>
															Availability
														</th>
													</tr>
												</thead>
												<tbody>
													{selectSizeStockList &&
														selectSizeStockList?.length > 0 ? (
														selectSizeStockList?.map(
															({ STORE_NAME, SAL_BAL_QTY }) => {
																return (
																	SAL_BAL_QTY > 0 && (
																		<tr>
																			<td className="store">
																				SOLASTA {STORE_NAME}
																			</td>
																			<td
																				className={
																					SAL_BAL_QTY > 0
																						? "text-success"
																						: "text-danger"
																				}
																			>
																				{SAL_BAL_QTY > 0
																					? "AVAILABLE"
																					: "NOT AVAILABLE"}
																			</td>
																		</tr>
																	)
																);
															}
														)
													) : (
														<tr>
															<td
																colSpan="2"
																className="text-danger text-center"
															>
																No stock available
															</td>
														</tr>
													)}
												</tbody>
											</table>
										)}
									</div>
								</fieldset>
							</div>
							<div className="w-100 text-center">
								<button
									className="continue-btn "
									onClick={() => {
										var myModalEl =
											document.getElementById("modalAvailability");
										var modal =
											bootstrap.Modal.getInstance(myModalEl);
										modal.hide();
										router.push("/store-locator?p=" + details?.slug);
									}}
								>
									Store Location
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export const getServerSideProps = mainStore.getServerSideProps(
	(store) =>
		async ({ query, req }) => {
			try {
				let { data: product } = await get(
					detail.PRODUCT_BY_SLUG + "/" + query.id
				);
				let { data: offerProduct } = await get(
					detail.DISCOUNT_PRODUCT + "?limit=10"
				);
				let viewed_product = req.cookies.viewed_product
					? JSON.parse(req.cookies.viewed_product)
					: [];
				let productInfo = product?.data[0];
				viewed_product = viewed_product.filter(
					(item) => item !== productInfo.id
				);

				console.log(product);
				let { data: review } = await get(detail.REVIEW + productInfo.id);
				let { data: recently_viewed_products } = await get(
					detail.RECENTLY_VIEWED,
					new URLSearchParams({ recently_viewed: viewed_product })
				);
				// //console.log(new URLSearchParams({ recently_viewed: viewed_product }));

				let { data: backendCartList } = await post(
					cart.CARTS,
					null,
					null,
					{
						headers: {
							Authorization: `Bearer ${req.cookies.token}`,
						},
					},
					""
				);

				return {
					props: {
						details: productInfo,
						offerProduct: offerProduct?.data,
						wishLists: req.cookies.wishList ?? [],
						viewed_products: recently_viewed_products?.data,
						reviews: review?.data,
						viewed_product_id: [...viewed_product, productInfo.id],
						backendCartList: backendCartList,
						token: req.cookies.token,
					},
				};
			} catch (error) {
				console.log(error);
				return {
					props: {
						details: [],
					},
					notFound: true,
				};
			}
		}
);
export default ProductDetails;
