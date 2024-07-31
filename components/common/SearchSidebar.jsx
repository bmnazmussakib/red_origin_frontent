import Slider from "@mui/material/Slider";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { formatUnderscoreToWords, get } from "../../helpers/helper";
import { shop } from "../../utils/route";
const SearchSidebar = ({
	productData,
	min_price,
	max_price,
	attributes = {},
	applyFilter,
	pathName,
	query,
}) => {
	let [colors, setColors] = useState([]);
	let [sizes, setSizes] = useState([]);
	let [fits, setFits] = useState([]);
	let [fabrications, setFabrications] = useState([]);
	let [embelishments, setEmbelishments] = useState([]);
	let [sleeve_length, setSleeveLength] = useState([]);
	let [item_segments, setItemSegments] = useState([]);
	let [brands, setBrands] = useState([]);
	let [categories, setCategories] = useState([]);
	let [priceRange, setPriceRage] = useState({});

	let router = useRouter();

	useEffect(() => {
		setPriceRage({
			min_price: query?.min_price ?? min_price,
			max_price: query?.max_price ?? max_price,
		});
	}, [router?.query]);

	useEffect(() => {
		let fetchCategoryAttributes = async () => {
			if (
				localStorage.getItem("categories") == null ||
				localStorage.getItem("attributes") == null
			) {
				let { data: categories } = await get(shop.FILTERCATEGORY);
				let { data: attributes } = await get(shop.ATTRIBUTE);
				let {
					colors,
					size,
					fits,
					fabrications,
					embelishments,
					sleeve_length,
					item_segments,
					brands,
				} = attributes;
				setCategories(categories.data);
				setColors(colors);
				setSizes(size);
				setFits(fits);
				setFabrications(fabrications);
				setEmbelishments(embelishments);
				setSleeveLength(sleeve_length);
				setItemSegments(item_segments);
				setBrands(brands);

				localStorage.setItem(
					"categories",
					JSON.stringify(categories.data) ?? []
				);
				localStorage.setItem("attributes", JSON.stringify(attributes)) ??
					[];
			} else {
				let {
					colors = [],
					size = [],
					fits = [],
					fabrications = [],
					embelishments = [],
					sleeve_length = [],
					item_segments = [],
					brands = [],
				} = JSON.parse(localStorage.getItem("attributes"));
				setCategories(JSON.parse(localStorage.getItem("categories")) ?? []);
				setColors(colors);
				setSizes(size);
				setFits(fits);
				setFabrications(fabrications);
				setEmbelishments(embelishments);
				setSleeveLength(sleeve_length);
				setItemSegments(item_segments);
				setBrands(brands);
			}
		};
		fetchCategoryAttributes();
	}, []);

	const handleRangeSlider = (event, newValue, activeThumb) => {
		setPriceRage({
			...priceRange,
			min_price: parseFloat(newValue[0]),
			max_price: parseFloat(newValue[1]),
		});
		let newQuery = query;
		newQuery = {
			...newQuery,
			min_price: newValue[0] ?? query.min_price,
			max_price: newValue[1] ?? query.max_price,
		};
		//return false;
		console.log(newValue);
		setTimeout(() => {
			router.push(pathName + "?" + new URLSearchParams({ ...newQuery }));
		}, 2000);
	};

	console.log("attributes", attributes);
	return (
		<>
			<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 shop-sidebar-parent display-none">
				<div className="sidebar-main">
					{Object.keys(query).length > 1 && (
						<div className="d-flex justify-content-end">
							<Link
								href={pathName}
								className="clear-filter-btn"
							>
								Clear Filters
							</Link>
						</div>
					)}
					<div className="sidebar-accordion-main">
						<form>
							<div className="accordion" id="myAccordion">
								{Object.entries(attributes)?.map(
									([key, value], index) => {
										if (key !== "price_range")
											return (
												<div className="accordion-item">
													<h2
														className="accordion-header"
														id={"#headingOne" + index}
													>
														<button
															type="button"
															className={`${key == "categories"
																? "accordion-button"
																: "accordion-button collapsed"
																}`}
															data-bs-toggle="collapse"
															data-bs-target={
																"#collapseOne" + index
															}
														>
															{formatUnderscoreToWords(key, "_")}
														</button>
													</h2>
													<div
														id={"collapseOne" + index}
														className={`accordion-collapse collapse ${key == "categories" ? "show" : ""
															}`}
														data-bs-parent="#myAccordion"
													>
														<div className="accordion-body">
															{value?.map(
																({ id, name, alias_value }) => {
																	return (
																		<div
																			className="form-check"
																			key={id}
																		>
																			<input
																				className="form-check-input"
																				checked={
																					query[key]
																						?.split(",")
																						?.includes(
																							id.toString()
																						)
																						? true
																						: false
																				}
																				defaultChecked={
																					query[key]
																						?.split(",")
																						?.includes(
																							id.toString()
																						)
																						? true
																						: false
																				}
																				type="checkbox"
																				value={id}
																				htmlFor={
																					"flexCheckDefault" +
																					key?.replace(
																						" ",
																						"_"
																					) +
																					id
																				}
																				name={key?.replace(
																					" ",
																					"_"
																				)}
																				onChange={(event) =>
																					applyFilter(
																						event,
																						pathName
																					)
																				}
																			/>
																			{key !== "size" ? (
																				<label
																					className="form-check-label"
																					htmlFor={
																						"flexCheckDefault" +
																						(key?.replace(
																							" ",
																							"_"
																						) || "") +
																						id
																					}
																				>
																					{name}
																				</label>
																			) : (
																				<label
																					className="form-check-label"
																					htmlFor={
																						"flexCheckDefault" +
																						(key?.replace(
																							" ",
																							"_"
																						) || "") +
																						id
																					}
																				>
																					{alias_value}
																				</label>
																			)}
																		</div>
																	);
																}
															)}
														</div>
													</div>
												</div>
											);
									}
								)}

								<div class="accordion-item">
									<h2 class="accordion-header">
										<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
											Sort
										</button>
									</h2>
									<div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#myAccordion">
										<div class="accordion-body ps-0">
											<div class="form-check">
												{/* <label>
													<input
														type="radio"
														name="order_by"
														value=""
														checked={query.order_by === ""}
														onChange={(event) =>
															applyFilter(event, "/category/" + query?.id)
														}
													/>
													Open this select menu
												</label>
												<br /> */}
												<label className="form-check-label mb-2">
													<input
														type="radio"
														name="order_by"
														value="low2high"
														checked={query.order_by === "low2high"}
														onChange={(event) =>
															applyFilter(event, "/category/" + query?.id)
														}
														className="form-check-input radio-input"
													/>
													Price: Low to High
												</label>
												<br />
												<label className="form-check-label mb-2">
													<input
														type="radio"
														name="order_by"
														value="high2low"
														checked={query.order_by === "high2low"}
														onChange={(event) =>
															applyFilter(event, "/category/" + query?.id)
														}
														className="form-check-input radio-input"
													/>
													Price: High to Low
												</label>
												<br />
												<label className="form-check-label mb-2">
													<input
														type="radio"
														name="order_by"
														value="atoz"
														checked={query.order_by === "atoz"}
														onChange={(event) =>
															applyFilter(event, "/category/" + query?.id)
														}
														className="form-check-input radio-input"
													/>
													Name: A to Z
												</label>
												<br />
												<label className="form-check-label mb-2">
													<input
														type="radio"
														name="order_by"
														value="ztoa"
														checked={query.order_by === "ztoa"}
														onChange={(event) =>
															applyFilter(event, "/category/" + query?.id)
														}
														className="form-check-input radio-input"
													/>
													Name: Z to A
												</label>
											</div>

										</div>
									</div>
								</div>

								<div class="accordion-item">
									<h2 class="accordion-header">
										<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
											Price Range
										</button>
									</h2>
									<div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#myAccordion">
										<div class="accordion-body">
											<div>
												<Slider
													value={[
														priceRange?.min_price,
														priceRange?.max_price,
													]}
													onChangeCommitted={handleRangeSlider}
													min={min_price}
													max={max_price}
													getAriaValueText={(value) => `${value}`}
													// color="secondary"
													className="mt-3"
													disableSwap
													backgroundColor="#CC9933"
												/>
											</div>

											<div className="d-flex">
												<p>{query?.min_price ?? min_price}</p>
												<p className="ms-auto">
													{query?.max_price ?? max_price}
												</p>
											</div>
										</div>
									</div>
								</div>

								{Object.keys(attributes)?.length == 0 && (
									<>
										<Skeleton height={30} />
										<Skeleton height={30} />
										<Skeleton height={30} />
										<Skeleton height={30} />
										<Skeleton height={30} />
									</>
								)}


								{/* {Object.keys(query).length > 1 && (
									<div className="d-block">
										<Link
											href={pathName}
											className="btn clear-filter-btn d-block w-100"
											style={{
												width: "100% !important",
												borderRadius: "0rem !important",
											}}
										>
											Clear Filter
										</Link>
									</div>
								)} */}
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default SearchSidebar;
