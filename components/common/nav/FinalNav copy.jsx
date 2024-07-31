import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { cookie, get, tAlert } from "../../../helpers/helper.js";
import NestedCategory from "./micro/NestedCategory.jsx";
import { getSettingValue } from "../../../utils/filters.js";
import { useSelector } from "react-redux";
let { shop } = require("../../../utils/route");
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

function FinalNav({ categories }) {
	let cart = useSelector((state) => state?.cartSlice?.cart);
	let wishList = useSelector((state) => {
		return state?.wishListSlice?.wishlist;
	});
	let auth = useSelector((state) => state?.authSlice?.user);
	let token = useSelector((state) => state?.authSlice?.token);
	console.log('user', auth);
	console.log('token', token);
	const [user, setUser] = useState();

	useEffect(() => {
		if (user == undefined) {
			setUser(cookie("user_data"));
		}
	}, [user]);
	let settings = useSelector((state) => state.globalSetting.globalsetting);
	const favIcon = getSettingValue(settings, "site_icon");


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
		} else if (this.parentElement.parentElement.classList.contains("active")) {
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


	let [products, setProducts] = React.useState([]);
	const [showSearch, setShowSearch] = useState(false);

	const handeShowSearch = () => {
		setShowSearch(!showSearch);
	};

	const router = useRouter()
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

	console.log('productssss: ', products)


	return (
		<section
			className={scrollTop > 100 ? `final-nav fix-finalNav` : `final-nav `}
		>
			{/* <section className="final-nav"> */}
			<div className="container-fluid">
				<div className="solasta-header__wrp">
					<Link href="/" className="solasta__logo mb-4">
						{
							!favIcon ?
								<Skeleton
									circle
									height="100%"
									containerClassName="avatar-skeleton"
								/> : <img src={favIcon} alt="solasta-logo" />
						}

					</Link>
					<ul className="solasta-header__main-menu">
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
					<ul className="solasta-header__info">
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

						<li>
							{auth && token ? (
								<Link prefetch={true} className="nav-link" href="/cart">
									{/* <i class="fas fa-cart-shopping"></i> */}
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
									{/* <i class="fas fa-cart-shopping"></i> */}
									<i class="ri-shopping-cart-line"></i>
									{cart && cart?.length > 0 && (
										<span className="" style={{ fontSize: "10px" }}>
											{cart?.length}
										</span>
									)}
								</Link>
							)}
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
				</div>

				
			</div>
			
		</section>
	);
}

export default FinalNav;
