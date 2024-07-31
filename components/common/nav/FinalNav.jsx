import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { cookie, get, tAlert } from "../../../helpers/helper.js";
import { getSettingValue } from "../../../utils/filters.js";
import CartWishAccount from "./micro/CartWishAccount.jsx";
import NestedCategory from "./micro/NestedCategory.jsx";
// const CartWishAccount = dynamic(() => import("./micro/CartWishAccount.jsx"), {
// 	ssr: false,
//   });
let { shop } = require("../../../utils/route");

function FinalNav({ categories }) {
	let cart = useSelector((state) => state?.cartSlice?.cart);
	let wishList = useSelector((state) => {
		return state?.wishListSlice?.wishlist;
	});
	let auth = useSelector((state) => state?.authSlice?.user);
	let token = useSelector((state) => state?.authSlice?.token);
	console.log("user", auth);
	console.log("token", token);
	const [user, setUser] = useState();

	useEffect(() => {
		if (user == undefined) {
			setUser(cookie("user_data"));
		}
	}, [user]);
	let settings = useSelector((state) => state.globalSetting.globalsetting);
	const favIcon = getSettingValue(settings, "site_icon");
	const headerLogo = getSettingValue(settings, "header_logo");

	// //console.log("===========================================")
	// console.warn(categories);
	let screenWidth = screen.width;
	//console.log("screenWidth: ", screenWidth);

	const [scrollTop, setScrollTop] = useState(0);

	useEffect(() => {
		const handleScroll = (event) => {
			setScrollTop(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	function accordion(e) {
		e.stopPropagation();
		if (this.classList.contains("active")) {
			this.classList.remove("active");
			//console.log(1);
		} else if (
			this.parentElement.parentElement.classList.contains("active")
		) {
			if (this.classList[0] == "list") {
				for (i = 0; i < list.length; i++) {
					list[i].classList.remove("active");
				}
			}
			if (this.classList[0] == "list_child") {
				for (i = 0; i < items.length; i++) {
					items[i].classList.remove("active");
				}
			}
			this.classList.add("active");
			//console.log(2);
		} else {
			//console.log(3);
			for (i = 0; i < list.length; i++) {
				list[i].classList.remove("active");
			}
			this.classList.add("active");
		}
	}
	useEffect(() => {
		const list = document.querySelectorAll(".list");
		const items = document.querySelectorAll(".list_child");
		let i = 0;
		for (i = 0; i < list.length; i++) {
			list[i].addEventListener("click", accordion);
		}
		$(".navigation-mobile-container").click(function () {
			//console.log('clicked');
			const list = document.querySelectorAll(".list");
			const items = document.querySelectorAll(".list_child");
			for (i = 0; i < list.length; i++) {
				list[i].classList.remove("active");
			}
			for (i = 0; i < items.length; i++) {
				items[i].classList.remove("active");
			}
			$(".navigation-mobile-container").toggleClass("active");
		});
	}, []);

	// let navbarToggleBtn;

	// if (scrollTop < 100) {
	//   navbarToggleBtn = { top: "-180px" }
	// }else if (scrollTop > 100 && screenWidth <= 575) {
	//   navbarToggleBtn = { position: "fixed", top: "10px" }
	// }

	// if (scrollTop > 100 && screenWidth >= 576 && screenWidth >= 767) {
	//   navbarToggleBtn = { top: "-192px" }
	// }

	// scrollTop < 100 && screenWidth < 575 ? navbarToggleBtn = { top: "-180px" } : navbarToggleBtn = { position: "fixed", top: "10px" }
	// scrollTop < 100 && screenWidth > 576 && screenWidth > 767 ? navbarToggleBtn = { top: "-180px" } : navbarToggleBtn = { position: "fixed", top: "10px" }

	const router = useRouter();
	console.log("routerrouterrouterrouterrouter", router);

	let [products, setProducts] = React.useState([]);
	const [showSearch, setShowSearch] = useState(false);

	const handeShowSearch = () => {
		setShowSearch(!showSearch);
	};

	useEffect(() => {
		setShowSearch(false);
	}, [router]);

	let [search, setSearch] = React.useState({
		search: "",
		cat_id: "",
	});

	let fetchSearchData = async () => {
		let result = await get(shop.PRODUCT, new URLSearchParams(search)).catch(
			(err) => {
				tAlert("please try again", "error");
			}
		);
		if (result.status === 200 && result.data) {
			setProducts(result.data.data);
		} else {
			setProducts([]);
		}
	};

	useEffect(() => {
		if (search.search.length > 3) {
			fetchSearchData();
		}
	}, [search]);

	console.log("productssss: ", products);


	const isOffcanvasRoute = router.route !== '/checkout' && router.route !== '/cart';

	return (
		<>

			<section
				className={scrollTop > 100 ? `final-nav fix-finalNav` : `final-nav `}
			>
				{/* <section className="final-nav"> */}
				<div className="container-fluid p-0">
					<div className="solasta-header__wrp">

						<Link href="/" className="rise__logo  mb-4">
							{/* {!headerLogo ? (
							<Skeleton
								// circle
								height="100%"
								width={300}
								containerClassName="avatar-skeleton"
							/>
						) : (
							<img src={headerLogo} alt="solasta-logo" />
						)} */}
							<img src="/assets/images/red-origin/logo/red-origin-logo.png" />
						</Link>

						<ul className="solasta-header__main-menu d-none d-lg-flex">
							{categories?.map((item, key) => {
								return (
									<NestedCategory
										slug={item.slug}
										key={key}
										id={item.id}
										parent_id={item.parent_id}
										name={item.name}
										banner={item.banner}
										icon={item.icon}
										img1={item.img1}
										img2={item.img2}
										img3={item.img3}
										megamenucategories={item.megamenucategories}
									/>
								);
							})}
						</ul>

						<ul className="solasta-header__info d-lg-flex d-none">
							<li className="position-relative">
								{showSearch && (
									<div className="desktop-search">
										<div className="float-search">
											<div className="search-box mb-2">
												<input
													type="search"
													className="form-control search-input"
													placeholder="Search"
													onChange={(e) =>
														setSearch({
															...search,
															search: e.target.value,
														})
													}
													onBlur={(e) => {
														if (search.search || search.cat_id) {
															setTimeout(() => {
																setProducts([]);
															}, 3000);
														}
													}}
													value={search.search}
												// onBlur={()=>{document.querySelector('.search-result-box').style.display = 'none'}}
												/>
											</div>
											<div
												className={
													search.search && products.length > 0
														? "search-result-box"
														: "d-none"
												}
											>
												{/* <div className='search-result-box'> */}
												{products &&
													products.length > 0 &&
													products?.map((p) => {
														return (
															<Link
																prefetch={true}
																href={`/details/${p.slug}`}
															>
																<div className="search-result">
																	<img
																		src={p.thumbnail_image}
																		alt=""
																	/>
																	<p>{p.name}</p>
																</div>
															</Link>
														);
													})}
											</div>
											<div className="dropdown-box mb-2">
												<select
													className="form-select form-contol"
													aria-label="Default select example"
													onChange={(e) =>
														setSearch({
															...search,
															cat_id: e.target.value,
														})
													}
												>
													<option value="">categories</option>
													{categories?.map(({ name, id }) => {
														return (
															<option key={id} value={id}>
																{name}
															</option>
														);
													})}
												</select>
											</div>
											<div className="search-btn-box">
												<button
													className="btn search-btn"
													onClick={() => {
														if (search.search || search.cat_id) {
															var params = new URLSearchParams([
																["search", search.search],
																["cat_id", search.cat_id],
															]);

															router.push(`/shop?${params}`);
														}
													}}
												>
													Search
												</button>
											</div>
										</div>
									</div>
								)}
								{router.pathname != "/login" && (
									<button
										type="button"
										className="btn desktop-search-btn"
										onClick={() => handeShowSearch()}
									>
										{showSearch ? (
											<i class="fa-solid fa-xmark"></i>
										) : (
											<i class="ri-search-line"></i>
										)}
									</button>
								)}
							</li>

							{/* <li>
								<a href="#0">
									<i class="fa-regular fa-user"></i>
								</a>
							</li> */}

							<li>
								{auth && token ? (
									<Link
										prefetch={true}
										className="nav-link"
										href="/profile"
									>
										<i class="ri-user-line"></i>
									</Link>
								) : (
									<Link
										prefetch={true}
										className="nav-link"
										href="/login"
									>
										<i class="ri-user-line"></i>
										{wishList && wishList?.length > 0 && (
											<span className="" style={{ fontSize: "10px" }}>
												{wishList?.length}
											</span>
										)}
									</Link>
								)}
							</li>

							<li>
								{auth && token ? (
									<Link
										prefetch={true}
										className="nav-link"
										href="/wishlist"
									>
										<i class="ri-heart-line"></i>
										{wishList && wishList?.length > 0 && (
											<span className="" style={{ fontSize: "10px" }}>
												{wishList?.length}
											</span>
										)}
									</Link>
								) : (
									<Link
										prefetch={true}
										className="nav-link"
										href="/login"
									>
										<i class="ri-heart-line"></i>
										{wishList && wishList?.length > 0 && (
											<span className="" style={{ fontSize: "10px" }}>
												{wishList?.length}
											</span>
										)}
									</Link>
								)}
							</li>

							<li style={{ paddingBottom: "30px", marginBottom: "-20px", }}>
								<a prefetch={true}
									className="nav-link"
									href="javascript:void(0)"
									{...(isOffcanvasRoute && {
										'data-bs-toggle': 'offcanvas',
										'data-bs-target': '#cartWishAccount',
										'aria-controls': 'cartWishAccount',
									  })}
								>
									<i class="ri-shopping-bag-4-line"></i>
									{cart && cart?.length > 0 && (
										<span className="" style={{ fontSize: "10px" }}>
											{cart?.length}
										</span>
									)}
								</a>



								{/* {auth && token ? (
								<Link prefetch={true} className="nav-link" href="/cart">
									<i class="ri-shopping-cart-line"></i>
									{cart && cart?.length > 0 && (
										<span className="" style={{ fontSize: "10px" }}>
											{cart?.length}
										</span>
									)}
								</Link>
							) : (
								<Link
									prefetch={true}
									className="nav-link"
									href="/login"
								>	
									<i class="ri-shopping-cart-line"></i>
									{cart && cart?.length > 0 && (
										<span className="" style={{ fontSize: "10px" }}>
											{cart?.length}
										</span>
									)}
								</Link>
							)} */}

								{/* <CartWishAccount /> */}
							</li>

							{/* <li className="nav-item">
                <Link prefetch={true}  href="/cart">
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span className="badge badge-pill bg-danger">
                    <sup>{cart?.length}</sup>
                  </span>
                </Link>
              </li> */}
						</ul>
						<button
							class="solasta__menubar d-inline-block d-lg-none"
							type="button"
							data-bs-toggle="offcanvas"
							data-bs-target="#offcanvasWithBothOptions"
							aria-controls="offcanvasExample"
						>
							<i class="ri-menu-3-line"></i>
						</button>
						<div
							className="offcanvas offcanvas-end"
							data-bs-scroll="true"
							tabIndex="-1"
							id="offcanvasWithBothOptions"
							aria-labelledby="offcanvasWithBothOptionsLabel"
						>
							<div className="MobileMenu-main">
								<div
									class="accordion accordion-flush"
									id="accordionFlushExample"
								>
									{categories?.map((item, key) => {
										return (
											<div class="accordion-item">
												<h2
													class="accordion-header"
													id={"flush-heading" + item?.id}
												>
													<button
														class="accordion-button collapsed"
														type="button"
														data-bs-toggle="collapse"
														data-bs-target={
															"#flush-collapse" + item?.id
														}
														aria-expanded="false"
														aria-controls={
															"flush-collapse" + item?.id
														}
													>
														<Link
															prefetch={true}
															href={
																"/category/" + item?.slug ?? "#"
															}
														>
															{item?.name}
														</Link>
													</button>
												</h2>
												<div
													id={"flush-collapse" + item?.id}
													class="accordion-collapse collapse"
													aria-labelledby={"flush-heading" + item?.id}
													data-bs-parent="#accordionFlushExample"
												>
													<div class="accordion-body">
														<div
															class="accordion accordion-flush"
															id={
																"accordionFlushExample" + item?.id
															}
														>
															{item?.megamenucategories?.map(
																(cat, key) => {
																	return (
																		<div class="accordion-item">
																			<h2
																				class="accordion-header"
																				id={
																					"flush-headingOne" +
																					cat?.id
																				}
																			>
																				<button
																					class="accordion-button collapsed"
																					type="button"
																					data-bs-toggle="collapse"
																					data-bs-target={
																						"#flush-collapseOne" +
																						cat?.id
																					}
																					aria-expanded="false"
																					aria-controls={
																						"flush-collapseOne" +
																						cat?.id
																					}
																				>
																					<Link
																						prefetch={true}
																						href={
																							"/category/" +
																							cat?.slug ??
																							"#"
																						}
																					>
																						{cat?.name}
																					</Link>
																				</button>
																			</h2>
																			<div
																				id={
																					"flush-collapseOne" +
																					cat?.id
																				}
																				class="accordion-collapse collapse"
																				aria-labelledby={
																					"flush-headingOne" +
																					cat?.id
																				}
																				data-bs-parent={
																					"#accordionFlushExample" +
																					item?.id
																				}
																			>
																				<div class="accordion-body">
																					{cat?.megamenucategories?.map(
																						(
																							subcat,
																							key
																						) => {
																							return (
																								<Link
																									prefetch={
																										true
																									}
																									href={
																										"/category/" +
																										subcat?.slug ??
																										"#"
																									}
																									className="child-name"
																								>
																									{
																										subcat?.name
																									}
																								</Link>
																							);
																						}
																					)}
																					<div className="accordion-item">
																						<p className="accordion-header">
																							<Link
																								prefetch={
																									true
																								}
																								className="child-name"
																								href={
																									"/category/" +
																									cat?.slug ??
																									"#"
																								}
																							>
																								ALL{" "}
																								{cat?.name}
																							</Link>
																						</p>
																					</div>
																				</div>
																			</div>
																		</div>
																	);
																}
															)}
															<div className="accordion-item">
																<p className="accordion-header ">
																	<Link
																		prefetch={true}
																		className="child-name"
																		href={
																			"/category/" +
																			item?.slug ?? "#"
																		}
																	>
																		ALL {item?.name}
																	</Link>
																</p>
															</div>
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>


		</>
	);
}

export default FinalNav;
