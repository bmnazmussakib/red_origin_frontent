import axios from "axios";
import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	addToCartBackend,
	extractVariant,
	get,
	post,
	removeFromCartBackend,
	tAlert,
} from "../../helpers/helper";
import {
	addToCart,
	applyCoupon as applyCouponAction,
	clearCoupon,
	clearMemberShip,
	removeFromCart,
} from "../../store/slice/CartSlice";
import { getSettingValue } from "../../utils/filters";
import { cart, checkoutPage } from "../../utils/route";

const CartSection = ({ backendCart, getProducts }) => {
	let dispatch = useDispatch();
	let businessSlice = useSelector((state) => state.globalSetting);
	let carts = useSelector((state) => state?.cartSlice?.cart);
	let couponSlice = useSelector((state) => state?.cartSlice?.coupon);
	let auth = useSelector((state) => state?.authSlice?.user);
	let tempId = useSelector((state) => state?.authSlice?.tempId);
	let [selectedDistrict, setSelectedDistrict] = useState(null);
	let [countryList, setCountryList] = useState([]);
	let [districtList, setDistrictList] = useState([]);
	let [thanaList, setThanaList] = useState([]);
	let [deliveryCharge, setDeliveryCharge] = useState({
		insideDhaka: {},
		outsideDhaka: {},
		shippingCharge: null,
	});
	let fetchShippingCharge = async () => {
		let { data, status } = await get(checkoutPage.DELIVERY_CHARGE).catch(
			(err) => {
				return false;
			}
		);
		if (status === 200) {
			setDeliveryCharge({
				...deliveryCharge,
				insideDhaka: data.insideDhaka,
				outsideDhaka: data.outsideDhaka,
			});
		}
	};
	let getCartSummary = async () => {
		let { data, status } = await get(cart.CART_SUMMARY).catch((err) => {
			return false;
		});

		if (status === 200) {
			console.log(data);
			const {
				coupon_applied,
				coupon_code,
				discount,
				grand_total,
				grand_total_value,
				loyality_applied,
				shipping_cost,
				sub_total,
				tax,
			} = data;

			console.log("datadata", tax);
			setCartCalculation({
				subTotal: parseFloat(sub_total),
				discount: parseFloat(discount),
				tax: tax,
				shipping: parseFloat(shipping_cost),
				total: parseFloat(grand_total),
			});
		}
	};
	let [coupon, setCoupon] = useState({
		coupon: "",
		coupon_applied: false,
		coupon_amount: 0,
		tax: 0,
		free_shipping: false,
	});
	let [cartCalculation, setCartCalculation] = useState({
		subTotal: 0,
		discount: 0,
		tax: 0,
		shipping: 0,
		total: 0,
	});

	console.log("cartCalculation", cartCalculation);
	useEffect(() => {
		if (carts?.length > 0) {
			getCartSummary();
		} else if (!hasShownAlert.current) {
			Router.push("/shop");
			tAlert("Cart is Empty", "error");
			hasShownAlert.current = true; // Set a flag to indicate alert has been shown
		}

		setCoupon({
			...coupon,
			coupon_applied: couponSlice.coupon_applied,
			coupon_amount: couponSlice.coupon_amount,
			coupon: couponSlice.coupon,
			tax: couponSlice.tax,
			free_shipping: couponSlice.free_shipping,
		});
	}, [carts, couponSlice]);

	const hasShownAlert = useRef(false);

	const applyCoupon = async (e) => {
		await axios.get(
			(process.env.NEXT_PUBLIC_SERVER_MAIN_URL ??
				"https://backend.rise-brand.com/") + "sanctum/csrf-cookie"
		);

		let result = await post(checkoutPage.APPLY_COUPON, "", {
			user_id: auth?.id,
			coupon_code: coupon.coupon,
		}).catch((err) => {
			if (err.response.status === 401) {
				tAlert("Please Login", "error");
				Router.push("/login");
			} else {
				tAlert("please try Again", "error");
			}
			return false;
		});
		if (result.status === 200 && result?.data?.result === true) {
			tAlert("Coupon Applied", "success");
			setCoupon({
				...coupon,
				coupon_applied: true,
				coupon_amount: result?.data?.discount,
				tax: result?.data?.tax,
				free_shipping: result?.data?.free_shipping,
			});
			dispatch(
				applyCouponAction({
					coupon_applied: true,
					coupon_amount: result?.data?.discount,
					coupon: coupon.coupon,
					tax: result?.data?.tax,
					free_shipping: result?.data?.free_shipping,
				})
			);
		} else {
			tAlert(result.data.message, "error");
		}
	};

	const removeCoupon = async (e) => {
		let result = await post(checkoutPage.REMOVE_COUPON, "", {
			user_id: auth?.id,
		}).catch((err) => {
			if (err.response.status === 401) {
				tAlert("Please Login", "error");
				Router.push("/login");
			} else {
				tAlert("please try Again", "error");
			}
			return false;
		});
		if (result.status === 200 && result?.data?.result === true) {
			tAlert("Coupon Removed", "success");
			setCoupon({
				coupon: "",
				coupon_applied: false,
				coupon_amount: 0,
				tax: 0,
				free_shipping: false,
			});
			dispatch(
				applyCouponAction({
					coupon: "",
					coupon_applied: false,
					coupon_amount: 0,
					tax: 0,
					free_shipping: false,
				})
			);
		} else {
			tAlert("Coupon not Removed", "error");
		}
	};
	const fetchCountry = async () => {
		let { data, status } = await get(checkoutPage.COUNTRIES).catch(
			(error) => {}
		);
		if (status === 200) {
			setCountryList(data?.data || []);
		}
	};

	const fetchDistrictList = (country, shipping = false) => {
		get(checkoutPage.STATES + "/" + country)
			.then((res) => {
				setDistrictList(res?.data?.data || []);
			})
			.catch((error) => {});
	};

	const fetchThanaList = (stateId) => {
		get(checkoutPage.CITIES + "?state_id=" + stateId)
			.then(async (res) => {
				setDeliveryCharge({
					...deliveryCharge,
					shippingCharge: null,
				});
				setThanaList(res?.data?.data || []);
			})
			.catch((error) => {});
	};
	let [deliveryExpressCharge, setDeliveryExpressCharge] = useState({
		insideDhaka: {},
		outsideDhaka: {},
	});
	let expressDelivery = async () => {
		console.log(checkoutPage.DELIVERY_EXPRESS_CHARGE);
		let { data, status } = await get(
			checkoutPage.DELIVERY_EXPRESS_CHARGE
		).catch((err) => {
			return false;
		});
		console.log(data);
		if (status === 200) {
			console.log(data);
			setDeliveryExpressCharge({
				insideDhaka: data.insideDhaka ?? {},
				outsideDhaka: data.outsideDhaka ?? {},
			});
		}
	};
	const estiMatedShipping = async (e) => {
		//! shipping charge
		let shippingPlaceName = [];
		console.log(districtList);
		shippingPlaceName = districtList?.filter((item) => {
			if (item.id == selectedDistrict) {
				return item;
			}
		});

		let default_inside_dhaka = parseFloat(
			getSettingValue(businessSlice?.globalsetting, "default_inside_dhaka")
		);
		let default_outside_dhaka = parseFloat(
			getSettingValue(businessSlice?.globalsetting, "default_outside_dhaka")
		);
		console.log(
			default_inside_dhaka,
			default_outside_dhaka,
			deliveryExpressCharge
		);
		let shippingChargeTemp = null;
		let totalCartItem = 0;

		carts?.forEach((item) => {
			totalCartItem += item?.quantity;
		});
		if (
			shippingPlaceName?.length > 0 &&
			shippingPlaceName[0]?.name == "Dhaka"
		) {
			for (const [key, value] of Object.entries(
				deliveryExpressCharge?.insideDhaka
			)) {
				console.log(key, value);
				if (parseInt(key) == parseInt(totalCartItem)) {
					shippingChargeTemp = parseFloat(value);
					break;
				}
			}
			console.log(shippingChargeTemp);
			if (shippingChargeTemp == null) {
				shippingChargeTemp = default_inside_dhaka;
			}
		} else {
			for (const [key, value] of Object.entries(
				deliveryExpressCharge?.outsideDhaka
			)) {
				if (parseInt(key) === parseInt(totalCartItem)) {
					shippingChargeTemp = parseFloat(value);
					break;
				}
			}
			console.log(shippingChargeTemp);
			if (shippingChargeTemp == null) {
				shippingChargeTemp = default_outside_dhaka;
			}
		}
		setDeliveryCharge({
			...deliveryCharge,
			shippingCharge: shippingChargeTemp,
		});
		//! shipping charge
	};
	useEffect(() => {
		fetchCountry();
		fetchShippingCharge();
		expressDelivery();
	}, []);
	return (
		<>
			<section className="cart-main">
				<div className="container-fluid">
					<div className="row">
						<div className="col-xs-12 col-sm-12 col-md-7 col-lg-8 col-xl-8">
							<div className="table-responsive">
								<table className="table table-bordered">
									<thead>
										<tr>
											<td className="text-center td-image">Image</td>
											<td className="text-center td-name">
												Product Name
											</td>
											{/*<td className="text-center td-model">Model</td>*/}
											<td className="text-center td-model">Size</td>
											<td className="text-center td-model">Color</td>
											<td className="text-center td-price">
												Base Price
											</td>
											<td className="text-center td-price">
												Discount (Per Product)
											</td>
											<td className="text-center td-qty">
												Quantity
											</td>
											<td className="text-center td-total">Total</td>
										</tr>
									</thead>
									<tbody>
										{console.log("carts: ", carts)}
										{carts?.map(
											({
												id,
												name,
												thumbnail_image,
												variant,
												quantity,
												main_price,
												main_price_discount,
												color,
												size,
												discount,
												barcode,
												stock,
												sku,
												slug,
												tax,
												product_id,
											}) => {
												let variantArray = variant.split("-");

												let variantSize = variantArray[0];
												let variantColor = variantArray[1];

												console.log("variants: ", variantSize);
												return (
													<tr>
														<td className="text-center td-image">
															<a href="#">
																<img
																	src={thumbnail_image}
																	alt=""
																	title=""
																/>
															</a>
														</td>
														<td className="text-left td-name">
															<Link
																prefetch={true}
																href={"/details/" + slug}
															>
																{name}
															</Link>{" "}
															<br />
															{/* <small>Size: {size}</small> <br /> */}
															<small>
																{/* Color: {extractor(color, "_", " ", true)} */}
															</small>
														</td>
														{/*<td className="text-center td-model">*/}
														{/*  {sku}*/}
														{/*</td>*/}
														<td className="text-center">
															{variant
																? extractVariant(
																		variant
																  )?.size.toUpperCase()
																: "N/A"}
														</td>
														<td className="text-center">
															{variant
																? extractVariant(
																		variant
																  )?.color.toUpperCase()
																: "N/A"}
														</td>
														<td className="text-center td-price">
															{main_price_discount}
														</td>
														<td className="text-center td-price">
															{/* {discount * quantity} */}
															{discount.toFixed(2)}
														</td>{" "}
														<td className="text-center td-qty">
															<div className="input-groups btn-block">
																<div className="stepper">
																	<input
																		type="text"
																		value={quantity}
																		className="form-control"
																	/>
																	<span>
																		<i
																			className="fa fa-angle-up"
																			onClick={async (e) => {
																				let addedStatus =
																					await addToCartBackend(
																						{
																							id: product_id,
																							variant,
																							barcode,
																							quantity:
																								quantity +
																								1,
																						}
																					);

																				if (
																					addedStatus.add_status
																				) {
																					// let color =
																					//   extractVariant(variation).color;
																					// let size =
																					//   extractVariant(variation).size;
																					dispatch(
																						addToCart({
																							id,
																							name,
																							thumbnail_image,
																							variant,
																							// calculable_price,
																							color,
																							size,
																							discount,
																							barcode,
																							stock,
																						})
																					);
																					if (
																						couponSlice?.coupon_applied
																					) {
																						removeCoupon();
																					}
																				} else {
																					tAlert(
																						"Product not available in stock",
																						"error"
																					);
																				}
																			}}
																		></i>

																		<i
																			className="fa fa-angle-down"
																			onClick={async (e) => {
																				if (
																					quantity === 1
																				) {
																					tAlert(
																						"Quantity can not be less than 1",
																						"error"
																					);
																					return;
																				}
																				let addedStatus =
																					await addToCartBackend(
																						{
																							id: product_id,
																							variant,
																							barcode,
																							quantity:
																								quantity -
																								1,
																						}
																					);
																				if (
																					addedStatus.add_status
																				) {
																					dispatch(
																						removeFromCart(
																							{
																								product_id,
																								size,
																								color,
																								barcode,
																							}
																						)
																					);
																					if (
																						couponSlice?.coupon_applied
																					) {
																						removeCoupon();
																					}
																				} else {
																					tAlert(
																						"Out of Stock",
																						"error"
																					);
																				}
																			}}
																		></i>
																	</span>
																</div>
																<span className="input-group-btn">
																	<button
																		type="button"
																		className="btn btn-remove"
																		onClick={async () => {
																			let removeStatus =
																				await removeFromCartBackend(
																					product_id,
																					barcode
																				);
																			if (
																				removeStatus.remove_status
																			) {
																				dispatch(
																					removeFromCart({
																						product_id,
																						size,
																						color,
																						barcode,
																						removeFromCart: true,
																					})
																				);
																				dispatch(
																					clearCoupon()
																				);
																				dispatch(
																					clearMemberShip()
																				);
																			}
																		}}
																	>
																		<i className="fa fa-times"></i>
																	</button>
																</span>
															</div>
														</td>
														<td className="text-center td-total">
															{/* {calculable_price * quantity} */}
															{(
																main_price * quantity -
																discount * quantity
															).toFixed(2)}
														</td>
													</tr>
												);
											}
										)}
									</tbody>
								</table>
							</div>
							<small className="text-danger">
								<i>
									<b>N.B: Product Price + VAT</b>
								</i>
							</small>
							{getProducts && getProducts?.length > 0 && (
								<>
									<hr />
									<h5 className="text-center">Free Items</h5>
									<div className="table-responsive">
										<table className="table table-bordered">
											<thead>
												<tr>
													<td className="text-center td-image">
														Image
													</td>
													<td className="text-left td-name">
														Product Name
													</td>
													<td className="text-center td-model">
														Model
													</td>
													<td className="text-center td-price">
														Base Price
													</td>
													<td className="text-center td-total">
														Total
													</td>
												</tr>
											</thead>
											<tbody>
												{console.log(getProducts)}
												{getProducts?.map(
													({
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
													}) => {
														return (
															<tr>
																<td className="text-center td-image">
																	<a href="#">
																		<img
																			src={thumbnail_img}
																			alt=""
																			title=""
																		/>
																	</a>
																</td>
																<td className="text-left td-name">
																	<Link
																		href={"/details/" + slug}
																	>
																		{name}
																	</Link>{" "}
																	<br />
																	<small>
																		Size:{" "}
																		{
																			extractVariant(variant)
																				.size
																		}
																	</small>{" "}
																	<br />
																	<small>
																		Color:{" "}
																		{
																			extractVariant(variant)
																				.color
																		}
																	</small>
																</td>
																<td className="text-center td-model">
																	{sku
																		? sku
																		: extractVariant(variant)
																				.color}
																</td>

																<td className="text-center td-total">
																	<span>{price} </span>
																	<span className="badge bg-success ml-2">
																		Free
																	</span>
																</td>
																<td className="text-center td-total">
																	0.00
																</td>
															</tr>
														);
													}
												)}
											</tbody>
										</table>
									</div>
								</>
							)}
						</div>
						<div className="col-xs-12 col-sm-12 col-md-5 col-lg-4 col-xl-4">
							<div className="cart-sidebar">
								<h2 className="title">
									What would you like to do next?
								</h2>
								<div
									className="accordion accordion-flush d-none"
									id="accordionFlushExample"
								>
									<div className="accordion-item">
										<h2
											className="accordion-header"
											id="flush-headingOne"
										>
											<button
												className="accordion-button collapsed"
												type="button"
												data-bs-toggle="collapse"
												data-bs-target="#flush-collapseOne"
												aria-expanded="false"
												aria-controls="flush-collapseOne"
											>
												Use Coupon Code
											</button>
										</h2>
										<div
											id="flush-collapseOne"
											className="accordion-collapse collapse show"
											aria-labelledby="flush-headingOne"
											data-bs-parent="#accordionFlushExample"
										>
											<div className="accordion-body">
												<div className="row g-3 align-items-center">
													<div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
														<input
															type="text"
															id=""
															className="form-control"
															aria-describedby="coupon"
															placeholder="Coupon Code Here"
															onChange={(e) =>
																setCoupon({
																	...coupon,
																	coupon: e.target.value,
																})
															}
															value={
																couponSlice.coupon_applied
																	? couponSlice.coupon
																	: coupon.coupon
															}
														/>
													</div>
													<div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
														{couponSlice.coupon_applied ? (
															<button
																type="button"
																className="continue-btn w-100 bg-danger"
																onClick={removeCoupon}
															>
																remove
															</button>
														) : (
															<button
																type="button"
																className="continue-btn w-100"
																onClick={applyCoupon}
															>
																apply
															</button>
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="accordion-item d-none">
										<h2
											className="accordion-header"
											id="flush-headingTwo"
										>
											<button
												className="accordion-button collapsed"
												type="button"
												data-bs-toggle="collapse"
												data-bs-target="#flush-collapseTwo"
												aria-expanded="false"
												aria-controls="flush-collapseTwo"
											>
												estimate shipping & taxes
											</button>
										</h2>
										<div
											id="flush-collapseTwo"
											className="accordion-collapse collapse"
											aria-labelledby="flush-headingTwo"
											data-bs-parent="#accordionFlushExample"
										>
											<div className="accordion-body">
												<div className="form-group">
													<label
														for="address-Country"
														className="form-label"
													>
														Country
														<span
															data-required="true"
															aria-hidden="true"
														></span>
													</label>
													<select
														id="address-Country"
														name="address-Country"
														autocomplete="shipping address-level1"
														required=""
														className="form-control"
														onChange={(e) => {
															fetchDistrictList(e.target.value);
														}}
													>
														<option
															value=""
															disabled=""
															selected=""
														>
															Please select
														</option>
														{countryList?.map((cn, index) => {
															return (
																<option value={cn.id}>
																	{cn.name}
																</option>
															);
														})}
													</select>
												</div>
												<div className="form-group">
													<label
														for="address-state"
														className="form-label"
													>
														region/state
														<span
															data-required="true"
															aria-hidden="true"
														></span>
													</label>
													<select
														id="address-state"
														name="address-state"
														autocomplete="shipping address-level1"
														required=""
														className="form-control"
														onChange={(e) => {
															fetchThanaList(e.target.value);
															setSelectedDistrict(
																e.target.value
															);
														}}
													>
														<option
															value=""
															disabled=""
															selected=""
														>
															Please select
														</option>
														{districtList?.map((dl, index) => {
															return (
																<option value={dl.id}>
																	{dl.name}
																</option>
															);
														})}
													</select>
												</div>
												<div className="form-group">
													<label
														for="address-state"
														className="form-label"
													>
														city
														<span
															data-required="true"
															aria-hidden="true"
														></span>
													</label>
													<select
														id="address-state"
														name="address-state"
														autocomplete="shipping address-level1"
														required=""
														className="form-control"
													>
														<option
															value=""
															disabled=""
															selected=""
														>
															Please select
														</option>
														{thanaList?.map((dl, index) => {
															return (
																<option value={dl.id}>
																	{dl.name}
																</option>
															);
														})}
													</select>
												</div>
												<div>
													{deliveryCharge?.shippingCharge ? (
														<p className="text-danger">
															Delivery Charge{" "}
															{deliveryCharge?.shippingCharge}
														</p>
													) : (
														""
													)}
												</div>
												<button
													type="button"
													className="continue-btn w-100"
													onClick={estiMatedShipping}
												>
													Show delivery charge
												</button>
											</div>
										</div>
									</div>
									<div className="accordion-item d-none">
										<h2
											className="accordion-header"
											id="flush-headingThree"
										>
											<button
												className="accordion-button collapsed"
												type="button"
												data-bs-toggle="collapse"
												data-bs-target="#flush-collapseThree"
												aria-expanded="false"
												aria-controls="flush-collapseThree"
											>
												use gift card
											</button>
										</h2>
										<div
											id="flush-collapseThree"
											className="accordion-collapse collapse"
											aria-labelledby="flush-headingThree"
											data-bs-parent="#accordionFlushExample"
										>
											<div className="accordion-body">
												<div className="row g-3 align-items-center">
													<div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
														<input
															type="text"
															id=""
															className="form-control"
															aria-describedby="coupon"
															placeholder="Gift card Code Here"
														/>
													</div>
													<div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
														<button
															type="button"
															className="continue-btn w-100"
														>
															apply
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
									{/* info here */}
									{cartCalculation?.invoice_text && (
										<div class="alert alert-info" role="alert">
											{cartCalculation?.invoice_text}
										</div>
									)}
									{/* {cartCalculation?.nearest_text && (
                    <div class="alert alert-info" role="alert">
                      {cartCalculation?.nearest_text}
                    </div>
                  )} */}
								</div>
								<table className="table table-bordered total-price-table">
									<tbody>
										<tr>
											<td className="text-end">
												<strong>Sub-Total:</strong>
											</td>
											<td className="text-end">
												{cartCalculation.subTotal.toFixed(3)} BDT
											</td>
										</tr>
										<tr>
											<td className="text-end">
												<strong>Discount:</strong>
											</td>
											<td className="text-end">
												{cartCalculation.discount.toFixed(3)} BDT
											</td>
										</tr>
										<tr>
											<td className="text-end">
												<strong>VAT:</strong>
											</td>
											<td className="text-end">
												{cartCalculation?.tax.toFixed(3)} BDT
											</td>
										</tr>
										<tr>
											<td className="text-end">
												<strong>Total:</strong>
											</td>
											<td className="text-end">
												{/* {(
                          cartCalculation.subTotal -
                          cartCalculation?.discount +
                          cartCalculation?.tax
                        ).toFixed(2)}{" "} */}
												{cartCalculation.total} BDT
											</td>
										</tr>
									</tbody>
								</table>
								<div className="button-flex">
									<Link
										prefetch={true}
										href="/shop"
										className="continue-btn"
										type="button"
									>
										continue shopping
									</Link>
									<Link
										prefetch={true}
										href={auth ? "/checkout" : "/login"}
										type="button"
										className="continue-btn"
										style={{ backgroundColor: "#EC1F27" }}
									>
										checkout
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default CartSection;
