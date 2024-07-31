import { post } from "axios";
import { hasCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	addToCartBackend,
	checkFromWishlist,
	extractor,
	filterStockVariant,
	filterVariant,
	membership,
	tAlert,
} from "../../helpers/helper";
import {
	addToCart,
	clearCoupon,
	clearMemberShip,
	removeFromCart,
} from "../../store/slice/CartSlice";
import { addToWishListBackend } from "../../store/slice/WishListSlice";

const AddToCartWish = ({
	productInfo,
	wishListsAll = null,
	choiceOption,
	variant,
	setVariantOutside = null,
	setAllPhotos = null,
	setForceUpdate = null,
	photos,
	allPhotos,
	originalImage,
	backendCartList
}) => {
	let [selectedVariant, setSelectedVariant] = React.useState({});
	let [variantInfo, setVariantInfo] = React.useState(null);
	let [variantStock, setVariantStock] = React.useState(null);
	let [wishLists, setWishList] = React.useState(wishListsAll);
	let [colorSize, setColorSize] = React.useState({
		color: null,
		size: null,
	});
	let dispatch = useDispatch();
	let carts = useSelector((state) => state?.cartSlice?.cart);
	let couponSlice = useSelector((state) => state?.cartSlice?.coupon);
	const [activeIndex, setActiveIndex] = useState(0);

	let [changeQunatity, setChangeQuantity] = useState(1);

	let funcCheckSelectVariant = (name, value) => {
		if (selectedVariant[name] == value) {
			return true;
		}
	};

	console.log("colorSize", colorSize);
	console.log("variantStock", variantStock);
	console.log("variantInfo::::::::", variantInfo);
	console.log("productInfo::::::::", productInfo);
	console.log('backendCartList: ', backendCartList)
	console.log('carts: ', carts)

	useEffect(() => {
		setChangeQuantity(1);
		setColorSize({
			color: null,
			size: null,
		});
	}, [productInfo]);

	const [barCodeFound, setBarCodeFound] = useState(null);
	let funcSelectVariant = (name, value, variantWiseImage) => {
		// console.log('name',name);
		// console.log('value',value);
		// console.log('variantWiseImage',variantWiseImage);
		//  alert('Hello')
		let temp = { ...selectedVariant };
		console.log("selectedVariant", selectedVariant);

		temp[name] = value;
		setSelectedVariant(temp);
		console.log("temp: ", temp);
		let aa = findBarCode(variant, temp);
		// console.log('variantWiseImage: ', variantWiseImage)

		if (typeof variantWiseImage == "object") {
			let all_variant_wise_image = imgFunction(
				variantWiseImage,
				value,
				true
			);
			console.log("all_variant_wise_image: ", all_variant_wise_image);
			let filter_all_variant_image = all_variant_wise_image.map((val) => {
				return {
					varaint: value,
					path: val,
				};
			});
			console.log("filter_all_variant_image: ", filter_all_variant_image);

			console.log("variantWise: ", originalImage);
			console.log("variantWise: ", variantWiseImage);

			let uniqueItem = originalImage.filter((item) => {
				console.log("variantWise: ", item);
				return item.variant != value;
			});
			console.log("variantWise: ", uniqueItem);
			console.log("variantWise: ", value);
			setAllPhotos([...filter_all_variant_image, ...uniqueItem]);
			setForceUpdate((val) => val + 1);
		}
		// if (!aa) {
		// 	alert("Not Found")
		// } else {
		// 	alert("Found")
		// }
		// console.log('value: ', value)
	};
	let findBarCode = (variant, temp = null) => {
		console.log(temp);
		let variant_name = "";
		let selectVariantInfo = temp ?? selectedVariant;
		// console.log('+++++++', selectVariantInfo)
		Object.keys(selectVariantInfo).forEach((key, index) => {
			if (selectVariantInfo[key] == null) {
				return false;
			}
			variant_name +=
				selectVariantInfo[key] +
				(index == Object.keys(selectVariantInfo).length - 1 ? "" : "-");
		});
		variant_name = variant_name;
		console.log(variant_name);
		console.log("=============================");
		let result = filterVariant(variant, variant_name, true);

		if (result) {
			setVariantInfo(result);
		} else {
			setVariantInfo(null);
		}

		// if (result) {
		// 	setVariantInfo(result);
		// 	console.log('result: ', result.image);
		// 	setAllPhotos((val) => {
		// 		const uniqueItem = val.filter((item) => item.path == variant.path)
		// 		console.log('uniqueItem: ', uniqueItem)
		// 		return [...new Set([{ variant: uniqueItem[0]?.variant, path: result.image }])]

		// 	})

		// 	// setAllPhotos((val) =>
		// 	// 	[{ variant: variant?.variant, path: result.image }, ...val]
		// 	// )
		// } else {
		// 	setVariantInfo(null);
		// }

		setBarCodeFound(selectVariantInfo);
		console.log("+++++++", variant);
		console.log(variant_name);
		console.log(result);
	};
	async function storeRequestStock() {
		if (!variantInfo) {
			return false;
		}
		let auth = hasCookie("user_data");
		if (!auth) {
			tAlert("Please login first", "error");
			return;
		}
		try {
			let { data } = await post(`/v2/product-requisition`, null, {
				product_id: productInfo?.id,
				barcode: variantInfo?.barcode,
			});
			if (data?.result) {
				tAlert(data?.message, "success");
			} else {
				tAlert(data?.message, "error");
			}
		} catch (error) {
			tAlert("Something went wrong", "error");
		}
	}

	let storeCartToBackend = async () => {
		//console.log("variantInfo",variantInfo)
		if (variantInfo == null) {
			let { color, size } = colorSize;
			if (color == null) {
				tAlert("Please select Color & Size");
				return false;
			} else {
				tAlert("Please select Size");
				return false;
			}
			tAlert("Please select Variant");
			return false;
		}
		console.log("productInfo: ", productInfo);
		console.log(variantInfo);
		if (variantInfo?.stock <= 0) {
			tAlert("Out of Stock");
			return false;
		}
		const product = carts.filter(
			(item) => item.barcode == variantInfo?.barcode
		);

		let quantity = changeQunatity;
		if (product?.length > 0) {
			quantity = product[0]?.quantity + changeQunatity;
		}
		// else {
		// 	quantity = 1;
		// }
		let { add_status, message: store_message } = await addToCartBackend({
			id: productInfo?.id,
			variant: variantInfo?.variant,
			barcode: variantInfo?.barcode,
			quantity: quantity,
		});

		if (add_status) {
			dispatch(
				addToCart({
					id: productInfo?.id,
					name: productInfo?.name,
					thumbnail_image: productInfo?.thumbnail_image,
					main_price: variantInfo?.base_price,
					main_price_discount: variantInfo?.base_discounted_price,
					barcode: variantInfo?.barcode || null,
					variant: variantInfo?.variant,
					discount: productInfo?.discount || 0,
					tax: productInfo?.base_tax || 0,
					shipping_cost: productInfo?.shipping_cost || 0,
					slug: productInfo?.slug,
					sku: variantInfo?.sku,
					product_id: productInfo?.id,
					quantity: quantity,
				})
			);
			dispatch(clearCoupon());
			dispatch(clearMemberShip());
			tAlert(store_message ?? "Product added to cart", "success");
			console.log("store_message: ", store_message);
		} else {
			tAlert(store_message || "Something went wrong");
		}
	};

	let wishListSlice = useSelector((state) => state.wishListSlice);
	console.log("productInfo: ", productInfo);
	let [checkListClass, setCheckListClass] = useState("");

	function productAvailibility(params) { }

	useEffect(() => {
		let variantString = "";
		choiceOption?.forEach((choice, index) => {
			if (choice?.options && choice.options.length > 0) {
				if (index > 0) {
					variantString += "-";
				}
				variantString += choice.options[0];
			}
		});
		const spltVarnt = variantString.split("-");

		const filterAvailableStock = productInfo?.variant.filter((product) => {
			return product.variant.includes(spltVarnt[1]) && product.stock > 0;
		});

		const availableStock =
			filterAvailableStock.length > 0
				? filterAvailableStock
				: productInfo?.variant;

		if (variantString) {
			if (availableStock) {
				setVariantInfo(availableStock[0] ?? null);
				let variantProducts = availableStock[0]?.variant?.split("-");
				let choiceSelectTempTitle = [];
				choiceOption?.forEach((choice, index) => {
					choiceSelectTempTitle.push(choice.title);
				});
				const keyValuePair = Object.fromEntries(
					choiceSelectTempTitle.map((key, index) => [
						key,
						variantProducts[index],
					])
				);
				setSelectedVariant(keyValuePair);
			}
		}
		setWishList(wishListSlice.wishlist);
	}, [productInfo, wishListSlice, variant]);

	//console.log('barCodeFound: ', selectedVariant)

	const imgFunction = (sizeWiseColor, options, needAll = false) => {
		// let imageWiseColor = []
		// let filteredSizeWiseColor = sizeWiseColor?.forEach(item => {
		// 	const key = Object.keys(item)[0]; // Extracting the key from the object
		// 	if (key == options) {
		// 		imageWiseColor.push(item[key])
		// 	}
		// });
		// console.log(imageWiseColor, "karniz bubu")

		// if (needAll) {
		// 	return imageWiseColor;
		// }
		// return imageWiseColor[0]

		// =======================
		// let imageUrls = [];

		// if (Array.isArray(options)) {
		// 	options.forEach(colorKey => {
		// 		if (sizeWiseColor[colorKey]) {
		// 			imageUrls = imageUrls.concat(sizeWiseColor[colorKey]);
		// 		}
		// 	});
		// } else if (typeof options === 'string') {
		// 	if (sizeWiseColor[options]) {
		// 		imageUrls = sizeWiseColor[options];
		// 	}
		// }

		// return imageUrls;

		// ========================================
		// let firstImageUrls = [];

		// for (const colorKey in sizeWiseColor) {
		// 	const images = sizeWiseColor[colorKey];
		// 	if (images.length > 0) {
		// 		firstImageUrls.push(images[0]);
		// 	}
		// }
		// console.log('firstImageUrls: ', firstImageUrls)
		// return firstImageUrls;

		// =======================================
		let imageUrls = sizeWiseColor[options] || []; // Accessing the array corresponding to the provided color key
		if (needAll) {
			console.log(imageUrls, "uniqueItem");
			return imageUrls;
		}
		return imageUrls.length > 0 ? imageUrls[0] : "/thimnail.jpg";
	};

	console.log("variantInfo", variantInfo);
	const [showColorName, setShowColorName] = useState(null);
	console.log("showColorName: ", showColorName);
	console.log("choiceOption: ", choiceOption);

	useEffect(() => {
		let stockVariantSet = false; // Flag to keep track of whether stock variant has been set

		choiceOption?.forEach((choice) => {
			if (choice?.title === "COLOR") {
				if (choice && choice.options) {
					choice.options.forEach((data, index) => {
						if (!stockVariantSet) {
							// Check if stock variant has not been set yet
							console.log("selectedVariant", data);
							let tselectedVariant = filterStockVariant(
								variant,
								null,
								data,
								true
							);
							console.log("selectedVariant", tselectedVariant);
							setVariantStock(tselectedVariant);
							stockVariantSet = true; // Set flag to true after setting stock variant
						}
					});
				}
			}
		});
	}, [choiceOption]);


	let [quantity, setQuantity] = useState(0)
	let [productInCart, setProductInCart] = useState(null)

	useEffect(() => {
		const result = carts?.find(item => {
			return item.product_id == productInfo?.id;
		});
		setProductInCart(result)
		setQuantity(result?.quantity)

	}, [carts])

	console.log('productInCart: ', productInCart)


	return (
		<>
			<div className="price d-none">
				<>
					৳{variantInfo?.base_discounted_price}
					{variantInfo?.base_price !=
						variantInfo?.base_discounted_price && (
							<del className="text-danger mx-2">
								{variantInfo?.base_price}
							</del>
						)}
				</>
				{variantInfo?.base_price != variantInfo?.base_discounted_price &&
					productInfo?.has_discount && (
						<span>({productInfo.discount}%)</span>
					)}
			</div>

			<div className="sailor-membership d-none">
				<div className="membership-bg"></div>
				<div className="membership-content-flex">
					<div className="club-price">
						&#2547;{membership(variantInfo?.stroked_price)}
					</div>
					<div className="separator"></div>
					{/* <img
                        src="/assets/images/membership-discount.png"
                        alt=""
                      /> */}
					<div className="membership-tips">
						<a href="javascript:void(0)">join for exclusive 20% off</a>
					</div>
				</div>
			</div>

			<div className="mc__price">
				<span className="mc-taka">
					<span className="mc-taka">
						<>
							{variantInfo == null ? (
								<>৳ {(productInfo?.main_price).toFixed(2)}</>
							) : variantInfo?.base_discounted_price ? (
								<>
									৳ {(variantInfo?.base_discounted_price).toFixed(2)}{" "}
								</>
							) : (
								<></>
							)}
						</>
					</span>
					{variantInfo?.base_price !=
						variantInfo?.base_discounted_price && (
							<del className="mc-discount-taka">
								{(variantInfo?.base_price).toFixed(2)}
							</del>
						)}
					{!variantInfo &&
						productInfo?.main_price != productInfo?.stroked_price && (
							<del className="mc-discount-taka ms-2">
								{(productInfo?.stroked_price).toFixed(2)}
							</del>
						)}
				</span>
				<span className="mc-discount-count">
					{variantInfo?.base_price != variantInfo?.base_discounted_price &&
						productInfo?.has_discount && (
							<span>{` (${productInfo.discount} %)`}</span>
						)}
					{!variantInfo &&
						productInfo?.main_price != productInfo?.stroked_price && (
							<span className="mc-discount-taka ms-2">
								({productInfo.discount}%)
							</span>
						)}
				</span>
				<span> + VAT</span>

				<div className="stock-availability">
					{variantInfo ? (
						<div>
							{variantInfo?.stock <= 0 ? (
								"Out of Stock"
							) : (
								<div className="text-success"><span>Stock Available</span></div>
							)}
						</div>
					) : productInfo?.current_stock == 0 ? (
						<div className="text-danger"><span>Out of Stock</span></div>
					) : (
						<div className="text-success"><span>Stock Available</span></div>
					)}
				</div>
			</div>

			{choiceOption?.map((choice, index) => {
				if (choice?.title == "COLOR") {
					return (
						<div
							className={
								"size-lists align-items-center gap-2 mt-3" +
								choice?.options?.length +
								(choice?.options?.length < 1 ? " d-none" : "")
							}
						>
							<h5>
								{choice?.title == "COLOR" &&
									selectedVariant &&
									selectedVariant?.COLOR ? (
									<span>
										{"Color" + ": " + selectedVariant?.COLOR}
									</span>
								) : (
									""
								)}{" "}
							</h5>

							<ul className="nav">
								{choice?.options?.map((data, index) => {
									let selectedVariant = filterStockVariant(
										variant,
										null,
										data,
										true
									);
									//setVariantStock(selectedVariant[0])

									return (
										<li
											className={"nav-item text-center text-center"}
											key={index}
											onClick={() => {
												if (choice?.title === "COLOR") {
													setShowColorName(data);
												}
											}}
										>
											<div>
												<a
													className={
														(funcCheckSelectVariant(
															choice?.title,
															data
														) && choice?.title !== "Color"
															? `logo-bg-color text-white`
															: funcCheckSelectVariant(
																choice?.title,
																data
															) && choice?.title == "Color"
																? `nav-link mc-clr1`
																: ``) +
														`border border-light-subtle solasta__color-nav border-1 nav-link`
													}
													href="javascript:void(0)"
													onClick={() => {
														if (choice?.title == "COLOR") {
															const clickSelectedVariant =
																filterStockVariant(
																	variant,
																	null,
																	data,
																	true
																);
															setVariantStock(
																clickSelectedVariant
															);
															setColorSize({
																...colorSize,
																color: choice?.title,
															});
															funcSelectVariant(
																choice?.title,
																data,
																choice?.color_wise_images
															);
														} else {
															setColorSize({
																...colorSize,
																size: choice?.title,
															});
															funcSelectVariant(
																choice?.title,
																data
															);
														}
													}}
													style={
														choice?.title == "COLOR"
															? {
																padding: "1px",
																border: "none",
															}
															: {}
													}
												>
													<div className="d-flex flex-column">
														{choice?.title == "COLOR" ? (
															<div
																style={
																	choice?.title
																		? {
																			width: "25px",
																			height: "32px",
																			margin: "auto",
																		}
																		: ""
																}
															>
																<img
																	className="img-fluid "
																	src={imgFunction(
																		choice?.color_wise_images,
																		data
																	)}
																	alt=""
																/>
															</div>
														) : (
															extractor(data, "_", " ", true)
														)}
													</div>
												</a>
												{choice?.title == "COLOR" && (
													<div className="custom-tooltips">
														<ul>
															<li>
																<span> {data}</span>
															</li>
														</ul>
													</div>
												)}
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					);
				}
			})}

			{choiceOption?.map((choice, index) => {
				if (choice?.title == "Size" || choice?.title == "SIZE") {
					return (
						<div
							className={
								"size-lists m-0 no-border align-items-center gap-2 pt-0 mt-3" +
								choice?.options?.length +
								(choice?.options?.length < 1 ? " d-none" : "")
							}
						>
							<h5>
								{choice?.title == "Size" &&
									selectedVariant &&
									selectedVariant?.Size
									? choice?.title +
									": " +
									(selectedVariant?.Size).toUpperCase()
									: ""}{" "}
							</h5>

							<ul className="nav">
								{choice?.options?.map((data, index) => {
									const singleVarStock =
										variantStock && variantStock[index];
									console.log("singleVarStock", singleVarStock);
									console.log("choicechoice", choice);

									return (
										<li
											className={
												variantStock && singleVarStock?.stock <= 0
													? "nav-item text-center text-center no-stock"
													: "nav-item text-center text-center"
											}
											key={index}
											onClick={() => {
												if (choice?.title === "COLOR") {
													setShowColorName(data);
												}
												setChangeQuantity(1);
											}}
										>
											<div>
												<a
													className={
														(funcCheckSelectVariant(
															choice?.title,
															data
														) && choice?.title !== "Color"
															? `logo-bg-color text-white`
															: funcCheckSelectVariant(
																choice?.title,
																data
															) && choice?.title == "Color"
																? `nav-link mc-clr1`
																: ``) +
														`border border-secondary-subtle border-1 nav-link`
													}
													href="javascript:void(0)"
													onClick={() => {
														if (choice?.title == "COLOR") {
															setColorSize({
																...colorSize,
																color: choice?.title,
															});
															funcSelectVariant(
																choice?.title,
																data,
																choice?.color_wise_images
															);
														} else {
															setColorSize({
																...colorSize,
																size: choice?.title,
															});
															funcSelectVariant(
																choice?.title,
																data
															);
														}
													}}
													style={
														choice?.title == "COLOR"
															? {
																padding: "1px",
																border: "none",
															}
															: {}
													}
												>
													<div className="d-flex flex-column">
														{choice?.title == "COLOR" ? (
															<div
																style={
																	choice?.title
																		? {
																			width: "35px",
																			height: "45px",
																			margin: "auto",
																		}
																		: ""
																}
															>
																<img
																	className="img-fluid "
																	src={imgFunction(
																		choice?.color_wise_images,
																		data
																	)}
																	alt=""
																/>
															</div>
														) : (
															<span
																className={
																	funcCheckSelectVariant(
																		choice?.title,
																		data
																	) &&
																	choice?.title !== "Color" &&
																	`text-white`
																}
															>
																{extractor(
																	data,
																	"_",
																	" ",
																	true
																)}
															</span>
														)}
													</div>
												</a>
												{choice?.title == "COLOR" && (
													<div className="custom-tooltips">
														<ul>
															<li>
																<span> {data}</span>
															</li>
														</ul>
													</div>
												)}
											</div>
										</li>
									);
								})}
							</ul>
						</div>
					);
				}
			})}

			<div className="size-chart-btn d-none">
				<a
					href="javascript:void(0)"
					data-bs-toggle="modal"
					data-bs-target="#SizechartModal"
				>
					<i className="fa-solid fa-ruler-horizontal"></i> size guid
				</a>
			</div>

			<div className="size-lists mc-color-list no-border d-flex align-items-center gap-2 pt-0 mt-2 d-none">
				<h5 className="mb-0">Color :</h5>
				<ul className="nav">
					<li className="nav-item">
						<a className="nav-link mc-clr1 mb-0" href="#"></a>
					</li>
					<li className="nav-item">
						<a className="nav-link mc-clr2 mb-0" href="#"></a>
					</li>
					<li className="nav-item">
						<a className="nav-link mc-clr3 mb-0" href="#"></a>
					</li>
					<li className="nav-item">
						<a className="nav-link mc-clr4 mb-0" href="#"></a>
					</li>
				</ul>
			</div>

			<div className="size-lists no-border d-flex align-items-center gap-2 pt-0 mt-3 d-none">
				<h5 className="mb-0">Size :</h5>
				<ul className="nav">
					<li className="nav-item">
						<a className="nav-link mb-0" href="#">
							M
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link mb-0" href="#">
							L
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link active mb-0" href="#">
							L
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link mb-0" href="#">
							XL
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link mb-0" href="#">
							XXL
						</a>
					</li>
				</ul>
			</div>

			<div className="add-bag-flex">
				<div className="rs__btn1-area">
					{/* <div className="mc__add-product">
						<button
							onClick={() => {
								if (changeQunatity === 1) {
									tAlert("Quantity can not be less than 1", "error");
									return;
								}
								setChangeQuantity((prev) => prev - 1 || 1);
							}}
						>
							<i class="fa-solid fa-minus"></i>
						</button>
						<input value={changeQunatity || 1} type="number" />
						<button
							onClick={() => {
								if (changeQunatity >= variantInfo?.stock) {
									tAlert(
										variantInfo.stock > 0
											? `Only ${variantInfo?.stock} Items Are Available For ${productInfo?.name}`
											: `Out Of Stock`,
										"error"
									);
									return;
								}
								setChangeQuantity((prev) => prev + 1);
							}}
						// disabled={changeQunatity > variantInfo?.stock}
						>
							<i class="fa-solid fa-plus"></i>
						</button>
					</div> */}



					{/* <button
						className="btn rs__sizeguilde-btn"
						onClick={storeCartToBackend}
					>
						Size Guilde
					</button> */}

					{/* <div className="add-bag">
						{variantInfo && parseInt(variantInfo?.stock) > 0 ? (
							<button
								className="btn add-to-bag-btn"
								onClick={storeCartToBackend}
							>
								add to cart
							</button>
						) : !variantInfo ? (
							<button
								className="btn add-to-bag-btn"
								onClick={storeCartToBackend}
							>
								add to cart
							</button>
						) : variantInfo && parseInt(variantInfo?.stock) <= 0 ? (
							<button className="btn add-to-bag-btn">
								Out of stock
							</button>
						) : (
							<button
								className="btn add-to-bag-btn"
								onClick={storeCartToBackend}
							>
								add to cart
							</button>
						)}
					</div> */}

					{/* <div className="mc__add-product">
						<button
							onClick={() => {
								if (changeQunatity === 1) {
									tAlert("Quantity can not be less than 1", "error");
									return;
								}
								setChangeQuantity((prev) => prev - 1 || 1);
							}}
						>
							<i class="fa-solid fa-minus"></i>
						</button>
						<input value={changeQunatity || 1} type="number" />
						<button
							onClick={() => {
								if (changeQunatity >= variantInfo?.stock) {
									tAlert(
										variantInfo.stock > 0
											? `Only ${variantInfo?.stock} Items Are Available For ${productInfo?.name}`
											: `Out Of Stock`,
										"error"
									);
									return;
								}
								setChangeQuantity((prev) => prev + 1);
							}}
						// disabled={changeQunatity > variantInfo?.stock}
						>
							<i class="fa-solid fa-plus"></i>
						</button>
					</div> */}

					{
						!productInCart && !productInCart?.quantity ?
							<div className="add-bag">
								<button
									className="btn add-to-bag-btn"
									onClick={storeCartToBackend}
								// onClick={() => setQuantity(quantity + 1)}
								>
									add to cart
								</button>
							</div> :
							<div className="mc__add-product">
								<button
									// onClick={() => {
									// 	setQuantity((prev) => prev - 1 || 0);
									// }}
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
													id: productInCart?.product_id,
													variant: productInCart?.variant,
													barcode: productInCart?.barcode,
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
								>
									<i class="fa-solid fa-minus"></i>
								</button>
								<input value={quantity} type="number" />
								<button
									// onClick={() => {

									// 	setQuantity((prev) => prev + 1);
									// }}
									onClick={async (e) => {
										let addedStatus =
											await addToCartBackend(
												{
													id: productInCart.product_id,
													variant: productInCart.variant,
													barcode: productInCart.barcode,
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
													id: productInCart.id,
													name,
													thumbnail_image: productInCart.thumbnail_image,
													variant,
													// calculable_price,
													color: productInCart.color,
													size: productInCart.size,
													discount: productInCart.discount,
													barcode: productInCart.barcode,
													stock: productInCart.stock,
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


								>
									<i class="fa-solid fa-plus"></i>
								</button>
							</div>
					}

					<div className="add-bag">
						<button
							className="btn add-to-bag-btn"
						>
							Buy Now
						</button>
					</div>



					<div>
						<button
							onClick={(e) => {
								if (!hasCookie("user_data")) {
									tAlert("Please Login First", "warning");
									return false;
								}
								e.preventDefault();
								e.stopPropagation();
								dispatch(addToWishListBackend({ id: productInfo?.id }));
								e.currentTarget.className =
									e.currentTarget.className.includes(
										"logo-bg-color text-white"
									)
										? "add-wishlist "
										: "add-wishlist logo-bg-color text-white border border-danger";
							}}
							className={
								(checkFromWishlist(wishLists, productInfo?.id)
									? "logo-bg-color text-danger "
									: "") + " add-wishlist "
							}
						>
							{
								(checkFromWishlist(wishLists, productInfo?.id)
									? <i className="fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>)
							}

						</button>
					</div>
				</div>

				<div className="rs__btn2-area d-none">
					{/* <div className="add-bag">
						{variantInfo && parseInt(variantInfo?.stock) > 0 ? (
							<button
								className="btn add-to-bag-btn"
								onClick={storeCartToBackend}
							>
								add to cart
							</button>
						) : !variantInfo ? (
							<button
								className="btn add-to-bag-btn"
								onClick={storeCartToBackend}
							>
								add to cart
							</button>
						) : variantInfo && parseInt(variantInfo?.stock) <= 0 ? (
							<button className="btn add-to-bag-btn">
								Out of stock
							</button>
						) : (
							<button
								className="btn add-to-bag-btn"
								onClick={storeCartToBackend}
							>
								add to cart
							</button>
						)}
					</div> */}
					<div>
						<button
							onClick={(e) => {
								if (!hasCookie("user_data")) {
									tAlert("Please Login First", "warning");
									return false;
								}
								e.preventDefault();
								e.stopPropagation();
								dispatch(addToWishListBackend({ id: productInfo?.id }));
								e.currentTarget.className =
									e.currentTarget.className.includes(
										"logo-bg-color text-white"
									)
										? "add-wishlist "
										: "add-wishlist logo-bg-color text-white border border-danger";
							}}
							className={
								(checkFromWishlist(wishLists, productInfo?.id)
									? "logo-bg-color text-white "
									: "") + " add-wishlist "
							}
						>
							<i className="fa-regular fa-heart"></i>
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default AddToCartWish;
