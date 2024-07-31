import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SwiperSlide } from "swiper/react";
import MainSlider from "../components/common/MainSlider.jsx";
import Slider from "../components/common/Slider.jsx";
import ProductCard from "../components/common/card/ProductCard.jsx";
import {
	setCategoryAndProducts,
	setHomeBanner,
	setOfferBanners,
} from "../store/slice/GlobalSetting.js";
import { home } from "../utils/route";
// import Countdown from "react-countdown";
import dynamic from "next/dynamic.js";
let CountdownMain = dynamic(() => import("react-countdown"), { ssr: false });

import axios from "axios";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import { get } from "../helpers/helper";
import VideoBanner from "../components/common/VideoBanner.jsx";
import CategoryCard from "../components/common/CategoryCard.jsx";
import HomeProduct from "../components/common/HomeProduct.jsx";

function Home({ wishLists }) {
	let router = useRouter();
	let settings = useSelector((state) => state.globalSetting.globalsetting);
	let businessSlice = useSelector((state) => state.globalSetting);

	console.log("bsslice:", businessSlice);

	let dispatch = useDispatch();
	let [currentTab, setCurrentTab] = useState(0);
	let [newArrivalCategoryId, setNewArrivalCategoryId] = useState("");
	let [trendingCategories, setTrendingCategories] = useState(
		businessSlice?.trendingCategories ?? []
	);
	let [category, setCategory] = useState(
		businessSlice?.trendingCategories ?? []
	);
	let [newArrivalProducts, setNewArrivalProducts] = useState(
		businessSlice?.newArrivalProducts ?? []
	);
	let [topSellingProducts, setTopSellingProducts] = useState(
		businessSlice?.topSellingProducts ?? []
	);
	let [hotDealProducts, setHotDealProducts] = useState(
		businessSlice?.hotDealProducts ?? []
	);

	let [homeBanner1, setHomeBanner1] = useState(
		businessSlice?.HomeBanner1 ?? null
	);

	let [homeBanner2, setHomeBanner2] = useState(
		businessSlice?.HomeBanner2 ?? []
	);

	let offerBannerRedux = useSelector(
		(state) => state.globalSetting.offerBanners
	);

	let getAllProducts = async () => {
		if (
			businessSlice?.newArrivalProducts == null ||
			businessSlice?.topSellingProducts == null ||
			businessSlice?.hotDealProducts == null
		) {
			let promise = await axios.all([
				await get(`${home.NEW_ARRIVAL_PRODUCT}&limit=10`),
				await get(`${home.TOP_SELLING}&limit=10`),
				await get(`${home.HotDealProduct}`),
			]);

			let { data: newArrivalProductsResp } = promise[0];
			let { data: bestSellingProductsResp } = promise[1];
			let { data: hotDealProductsResp } = promise[2];

			setNewArrivalProducts(newArrivalProductsResp?.data);
			setTopSellingProducts(bestSellingProductsResp?.data);
			setHotDealProducts(hotDealProductsResp?.data);

			dispatch(
				setCategoryAndProducts({
					newArrivalCategories: newArrivalProductsResp?.data,
					topSellingProducts: bestSellingProductsResp?.data,
					hotDealProducts: hotDealProductsResp?.data,
				})
			);
		}

		// setNewArrivalCategoryId(newArrivalCategories[0]?.id);
	};
	useEffect(() => {
		getAllProducts();
	}, []);
	console.log("affgfgoifoig", hotDealProducts);
	const setTab = (tab) => {
		setCurrentTab(tab);
	};

	let getBannerAndOffers = async () => {
		if (offerBannerRedux == null) {
			let { data } = await get(home.AD_BANNER);
			dispatch(setOfferBanners({ offer_banners: data?.data }));
		}
	};
	useEffect(() => {
		getBannerAndOffers();
	}, []);

	let getAllSingleBanner = async () => {
		if (
			businessSlice?.homeBanner1 == null ||
			businessSlice?.homeBanner2 == null
		) {
			let promise = await axios.all([
				await get(home.Home_Banner_1),
				await get(home.Home_Banner_2),
			]);
			let { data: homeBanner1Resp } = promise[0];
			let { data: homeBanner2Resp } = promise[1];

			setHomeBanner1(homeBanner1Resp?.data);
			setHomeBanner2(homeBanner2Resp?.data);

			dispatch(
				setHomeBanner({
					HomeBanner1: homeBanner1Resp?.data,
					HomeBanner2: homeBanner2Resp?.data,
				})
			);
		}
	};
	useEffect(() => {
		getAllSingleBanner();
	}, []);

	return (
		<>

			<VideoBanner />

			{/* {offerBannerRedux ? (
				<MainSlider banners={offerBannerRedux["home_main_slider"]} />
			) : (
				<Skeleton height={500} />
			)} */}

			{/* Rise area start here */}
			{/* <div className="rise-marquee">
				<marquee>
					<h3>
						<a href="#0">
							<span></span> Free Shipping On orders over ৳-500
						</a>
					</h3>
					<h3>
						<a href="#0">
							<span></span> Free Shipping On orders over ৳-500
						</a>
					</h3>
					<h3>
						<a href="#0">
							<span></span> Free Shipping On orders over ৳-500
						</a>
					</h3>
					<h3>
						<a href="#0">
							<span></span> Free Shipping On orders over ৳-500
						</a>
					</h3>
					<h3>
						<a href="#0">
							<span></span> Free Shipping On orders over ৳-500
						</a>
					</h3>
					<h3>
						<a href="#0">
							<span></span> Free Shipping On orders over ৳-500
						</a>
					</h3>
					<h3>
						<a href="#0">
							<span></span> Free Shipping On orders over ৳-500
						</a>
					</h3>
					<h3>
						<a href="#0">
							<span></span> Free Shipping On orders over ৳-500
						</a>
					</h3>
					<h3>
						<a href="#0">
							<span></span> Free Shipping On orders over ৳-500
						</a>
					</h3>
					<h3>
						<a href="#0">
							<span></span> Free Shipping On orders over ৳-500
						</a>
					</h3>
				</marquee>
			</div> */}

			<section className="best-sale-main pt__100 pb__100">
				<div className="container">
					<div className="best-sale-content ">
						<div className="row align-items-center">
							<div className="col-xl-4">
								<div className="section__header text-center mb-0">
									<h2 className="">Shop Best of Sale</h2>
								</div>
							</div>
							<div className="col-xl-8">
								<div className="button-wrapper">
									<div className="row g-3">
										<div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
											<Link href="" className="btn best-sale-btn">Womens's top</Link>
										</div>
										<div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
											<Link href="" className="btn best-sale-btn">Womens's sweater</Link>
										</div>
										<div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
											<Link href="" className="btn best-sale-btn">Mens's dress tshirt</Link>
										</div>
										<div className="col-xl-3 col-lg-6 col-md-6 col-sm-6">
											<Link href="" className="btn best-sale-btn">Mens's casual tshirt</Link>
										</div>
									</div>
								</div>
							</div>
						</div>


					</div>
				</div>
			</section>

			<section className="banner" style={{ backgroundImage: 'url("/assets/images/red-origin/banner/banner-1.jfif")' }}>
				<div className="container">
					<div className="banner-content text-center">
						<h2 className="text-center mb__30">An Idyllic Escape</h2>
						<div className="double-btn row">
							<div className="col-6">

								<Link href="" className="btn ">womne's new arrival</Link>
							</div>
							<div className="col-6">

								<Link href="" className="btn ">men's new arrival</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="monthly-collection-main pt__100 pb__50">
				<div className="container">
					<div className="monthly-collection-content">
						<div className="row">
							<div className="col-6">
								<div className="left-content">
									<div className="position-relative">
										<p>summer 2024</p>
										<h2>The July <br /><span>Collection</span></h2>
									</div>
								</div>
							</div>
							<div className="col-6">
								<div className="right-content">
									<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deleniti in porro totam eligendi libero doloremque similique explicabo repellat asperiores illo labore voluptate, dicta quos, enim cupiditate dolor dolorem aliquam incidunt.</p>
									<Link href="" >Shop the Campaign</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="category-slider pt__50 pb__50">
				<div className="container-fluid">
					<div className="rise-collection__right">
						<Slider
							className="solasta-product-slider"
							perPage={2}
							navigation={false}
							pagination={true}
							autoplay={false}
							loop={false}
							spaceBetween={20}
							speed={500}
							breakpoints={{
								768: {
									slidesPerView: 4,
								},
								1200: {
									slidesPerView: 4,
								},
								1600: {
									slidesPerView: 4,
								},
							}}
						>
							<SwiperSlide>
								<CategoryCard img={`/assets/images/red-origin/category-card/category_card_img_1.jpg`} />
							</SwiperSlide>
							<SwiperSlide>
								<CategoryCard img={`/assets/images/red-origin/category-card/category_card_img_2.jpg`} />
							</SwiperSlide>
							<SwiperSlide>
								<CategoryCard img={`/assets/images/red-origin/category-card/category_card_img_3.jpg`} />
							</SwiperSlide>
							<SwiperSlide>
								<CategoryCard img={`/assets/images/red-origin/category-card/category_card_img_4.jpg`} />
							</SwiperSlide>
						</Slider>
					</div>
				</div>
			</section>

			<section className="banner" style={{ backgroundImage: 'url("/assets/images/red-origin/banner/banner-2.jfif")' }}>
				<div className="container">
					<div className="banner-content text-center">
						<h2 className="text-center mb__30">Go-Anywhere Dresses</h2>
						<div className="double-btn row">
							<div className="col-12">
								<Link href="" className="btn ">shop now</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="home-product-silder pt__100 pb__100">
				<div className="conatiner-fluid">
					<h2 className="text-center">Curated for You</h2>
					<div className="rise-collection__right">
						<Slider
							className="solasta-product-slider"
							perPage={2}
							navigation={true}
							pagination={true}
							autoplay={true}
							loop={true}
							spaceBetween={20}
							speed={500}
							breakpoints={{
								768: {
									slidesPerView: 4,
								},
								1200: {
									slidesPerView: 4,
								},
								1600: {
									slidesPerView: 4,
								},
							}}
						>
							<SwiperSlide>
								<HomeProduct img={`/assets/images/red-origin/product/home-product/home-product-1.avif`} />
							</SwiperSlide>
							<SwiperSlide>
								<HomeProduct img={`/assets/images/red-origin/product/home-product/home-product-2.avif`} />
							</SwiperSlide>
							<SwiperSlide>
								<HomeProduct img={`/assets/images/red-origin/product/home-product/home-product-3.avif`} />
							</SwiperSlide>
							<SwiperSlide>
								<HomeProduct img={`/assets/images/red-origin/product/home-product/home-product-4.avif`} />
							</SwiperSlide>
							<SwiperSlide>
								<HomeProduct img={`/assets/images/red-origin/product/home-product/home-product-5.avif`} />
							</SwiperSlide>
							<SwiperSlide>
								<HomeProduct img={`/assets/images/red-origin/product/home-product/home-product-6.avif`} />
							</SwiperSlide>
						</Slider>
					</div>
				</div>
			</section>

			<section className="banner-3" style={{ backgroundImage: 'url("/assets/images/red-origin/banner/banner-3.jfif")' }}>
				<div className="container">
					<div className="banner-text">
						<h2 className="text-center mb__30">An Ode to Summer</h2>
						<p className="text-center text mb__30">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Corporis reprehenderit soluta ipsam culpa facere veniam minima unde accusamus molestias inventore!</p>
					</div>
					<div className="banner-content text-center">
						<div className="double-btn row">
							<div className="col-12">
								<Link href="" className="btn ">shop now</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="double-banner">
				<div className="container-fluid p-0">
					<div className="row g-4">
						<div className="col-lg-6">
							<div className="banner banner-4" style={{ backgroundImage: 'url("/assets/images/red-origin/banner/banner-4.jpg")' }}>
								<div className="banner-content text-center">
									<div className="banner-text ">
										<h2 className="text-center mb__30">Complimentary Styling</h2>
										<p className="mb__40">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi explicabo recusandae consequuntur pariatur soluta repellat!</p>
									</div>
									<div className="double-btn row">
										<div className="col-12">
											<Link href="" className="btn ">Book your Appoinment</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-6">
							<div className="banner banner-5" style={{ backgroundImage: 'url("/assets/images/red-origin/banner/banner-5.jpg")' }}>
								<div className="banner-content text-center">
									<div className="banner-text mb__50">
										<span>New cardmember exclusive</span>
										<h2 className="text-center mb__30">Extra 25% Off</h2>
										<h5 className="mb__30">Your first purchase with your new card.</h5>
										<p>Limited time. Exclisive apply.</p>
									</div>
									<div className="row">
										<div className="col-12 mb__30">
											<Link href="" className="btn apply-btn">apply now</Link>
										</div>
										<div className="col-12">
											<Link href="" className="details-btn">Details</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="rise-category-area pt__30 pb__30 d-none">
				<div className="container-fluid p-0">
					<div className="section__header text-center">
						<h2>Catagories</h2>
					</div>
					<div className="rise-category__wrp">
						<Slider
							className="rise-category-slider"
							perPage={2}
							navigation={false}
							pagination={true}
							loop={false}
							spaceBetween={0}
							speed={500}
							autoplay={false}
							breakpoints={{
								768: {
									slidesPerView: 3,
								},
								1200: {
									slidesPerView: 3,
								},
								1600: {
									slidesPerView: 3,
								},
							}}
						>
							<SwiperSlide>
								<a href="#0" className="rise-category__item">
									<div className="rise-image">
										<img
											src="/assets/images/rise/category/1.jpg"
											alt=""
										/>
										<h4>
											<a href="#0">T-shirt</a>
										</h4>
									</div>
								</a>
							</SwiperSlide>
							<SwiperSlide>
								<a href="#0" className="rise-category__item">
									<div className="rise-image">
										<img
											src="/assets/images/rise/category/3.jpg"
											alt=""
										/>
										<h4>
											<a href="#0">Ethnic Tops</a>
										</h4>
									</div>
								</a>
							</SwiperSlide>
							<SwiperSlide>
								<a href="#0" className="rise-category__item">
									<div className="rise-image">
										<img
											src="/assets/images/rise/category/2.jpg"
											alt=""
										/>
										<h4>
											<a href="#0">casual tops</a>
										</h4>
									</div>
								</a>
							</SwiperSlide>
						</Slider>
					</div>
				</div>
			</section>

			<section className="rise-countdown-area d-none"
				style={{ backgroundImage: "url(/assets/images/rise/bg/1.jpg)" }}
			>
				<div className="section__header text-center">
					<h2 className="text-white">shop now, save more</h2>
				</div>
				<div className="rise-countdown__wrp">
					<div className="rise-countdown__item">
						<h3>
							<span>157</span>
						</h3>
						<p>Days</p>
					</div>
					<div className="rise-countdown__item">
						<h3>
							<span>12</span>
						</h3>
						<p>Hours</p>
					</div>
					<div className="rise-countdown__item">
						<h3>
							<span>36</span>
						</h3>
						<p>Minutes</p>
					</div>
					<div className="rise-countdown__item">
						<h3>
							<span>55</span>
						</h3>
						<p>Seconds</p>
					</div>
				</div>
				<div className="text-center">
					<a href="#0" className="rise__btn">
						shop sale <i class="ri-arrow-right-line"></i>
					</a>
				</div>
			</section>

			<section className="rise-collection-area pt__30 pb__30 d-none">
				<div className="container-fluid">
					<div className="row g-4 align-items-center">
						<div className="col-lg-4">
							<div className="rise-collection__left">
								<div className="section__header">
									<span>New Collection 2024</span>
									<h2>Our Newest Collection</h2>
									<p>
										Get ready to hit the streets with our new
										collection
										<br />
										of sport and casual wear.
									</p>
								</div>

								<a href="#0" className="rise__btn mt__30">
									shop Collection <i class="ri-arrow-right-line"></i>
								</a>
							</div>
						</div>
						<div className="col-lg-8">
							<div className="rise-collection__right">
								<Slider
									className="solasta-product-slider"
									perPage={2}
									navigation={false}
									pagination={true}
									autoplay={true}
									loop={false}
									spaceBetween={20}
									speed={500}
									breakpoints={{
										768: {
											slidesPerView: 3,
										},
										1200: {
											slidesPerView: 3,
										},
										1600: {
											slidesPerView: 3,
										},
									}}
								>
									{topSellingProducts?.map((product, index) => {
										return (
											<SwiperSlide key={index}>
												<ProductCard
													key={index}
													name={product.name}
													slug={product.slug}
													thumbnail_image={product.thumbnail_image}
													id={product.id}
													base_price={product.base_price}
													base_discounted_price={
														product?.base_discounted_price
													}
													details={product?.links?.details}
													wishLists={wishLists}
													hover_image={product.hover_image}
													choice_options={product.choice_options}
												/>
											</SwiperSlide>
										);
									})}
								</Slider>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="rise-four__ad-banner d-none">
				<div className="container-fluid">
					<div className="row g-1">
						<div className="col-md-8">
							<div className="row g-1">
								<div className="col-12">
									<a
										href="#0"
										className="rise-image rise-hover-overlay"
									>
										<img
											src="/assets/images/rise/ad-banner/adbanner1.jpg"
											alt=""
										/>
									</a>
								</div>
								<div className="col-6">
									<a
										href="#0"
										className="rise-image rise-hover-overlay"
									>
										<img
											src="/assets/images/rise/ad-banner/adbanner2.jpg"
											alt=""
										/>
									</a>
								</div>
								<div className="col-6">
									<a
										href="#0"
										className="rise-image rise-hover-overlay"
									>
										<img
											src="/assets/images/rise/ad-banner/adbanner3.jpg"
											alt=""
										/>
									</a>
								</div>
							</div>
						</div>
						<div className="col-md-4">
							<a href="#0" className="rise-image">
								<img
									src="/assets/images/rise/ad-banner/adbanner4.jpg"
									alt=""
								/>
							</a>
						</div>
					</div>
				</div>
			</section>

			<section className="rise-policy-area pt__30 pb__30 d-none">
				<div className="container-fluid">
					<div className="section__header text-center">
						<h2>We make shopping easy</h2>
					</div>
					<div className="rise-policy__wrp">
						<div className="row g-2">
							<div className="col-md-4">
								<a href="#0" className="rise-image">
									<img src="/assets/images/rise/policy/1.jpg" alt="" />
								</a>
							</div>
							<div className="col-md-4">
								<a href="#0" className="rise-image">
									<img src="/assets/images/rise/policy/2.jpg" alt="" />
								</a>
							</div>
							<div className="col-md-4">
								<a href="#0" className="rise-image">
									<img src="/assets/images/rise/policy/3.jpg" alt="" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="solasta__ad-banner overflow-hidden d-none">
				<div className="container-fluid p-0">
					{homeBanner1 ? (
						<Link
							href={homeBanner1?.link ?? "#"}
							className="solasta__ad-image"
						>
							{
								<Image
									src={homeBanner1?.image}
									loading={"lazy"}
									alt=""
									width={0}
									height={0}
									layout="responsive"
									objectFit="cover"
								/>
							}

							<h4 className="banner__title d-none">
								<a href="#0" className="text-white">
									Discover the collection
								</a>
							</h4>
						</Link>
					) : (
						<Skeleton height={250} />
					)}
				</div>
			</section>

			<section className="solasta-special-area section__padding overflow-hidden d-none">
				<div className="container-fluid p-0">
					<div className="row g-4 align-items-center">
						<div className="col-xl-6">
							<div className="solasta-special__content">
								<h4>Ethnic Wear</h4>
								<div className="special__btn">
									<Link
										href={"category/mens_wear_1709532972"}
										prefetch={true}
									>
										Men's
									</Link>
									<Link
										href={"category/womens_wear_1709532972"}
										prefetch={true}
									>
										Women's
									</Link>
								</div>
							</div>
						</div>
						<div className="col-xl-6">
							<Slider
								className="solasta-product-slider"
								perPage={1}
								navigation={false}
								pagination={true}
								autoplay={{
									disableOnInteraction: false,
									delay: 3000,
									pauseOnMouseEnter: true,
								}}
								loop={false}
								spaceBetween={10}
								speed={300}
							>
								{offerBannerRedux &&
									offerBannerRedux["home_slider_two"]
										?.slice(0, 2)
										?.map((offer, index) => {
											return (
												<SwiperSlide>
													<a
														href={offer?.link}
														className="solasta-special__image d-block"
													>
														<Image
															className="w-100"
															src={offer?.img}
															loading={"lazy"}
															alt=""
															width={0}
															height={0}
															layout="responsive"
															objectFit="cover"
														/>
													</a>
												</SwiperSlide>
											);
										})}
							</Slider>
						</div>
					</div>
				</div>
			</section>

			{hotDealProducts.length > 0 && (
				<section className="solasta-newarrival-area d-none solasta__best-selling section__padding pt-0">
					<div className="container-fluid p-0">
						<div className="section__header mb-4 text-center d-flex justify-content-between align-items-center">
							<h2 className="mb-0">
								hot deals
								<img
									style={{
										width: "20px",
										marginLeft: "5px",
										marginTop: "-2px",
										marginRight: "5px",
									}}
									src="/assets/images/solasta/fire.png"
									alt="icon"
								/>
								!
							</h2>

							<Link href={"/shop?hot_deal=1"} className="view-all-btn">
								View All
							</Link>
						</div>
						<Slider
							className="solasta-product-slider"
							perPage={2}
							navigation={false}
							pagination={true}
							autoplay={true}
							loop={false}
							spaceBetween={20}
							speed={300}
							breakpoints={{
								768: {
									slidesPerView: 3,
								},
								1200: {
									slidesPerView: 4,
								},
								1600: {
									slidesPerView: 5,
								},
							}}
						>
							{hotDealProducts?.map((product, index) => {
								return (
									<SwiperSlide key={index}>
										<ProductCard
											key={index}
											name={product.name}
											slug={product.slug}
											thumbnail_image={product.thumbnail_image}
											id={product.id}
											base_price={product.base_price}
											base_discounted_price={
												product?.base_discounted_price
											}
											details={product?.links?.details}
											wishLists={wishLists}
											hover_image={product.hover_image}
											choice_options={product.choice_options}
										/>
									</SwiperSlide>
								);
							})}
						</Slider>
					</div>
				</section>
			)}

			<section className="solasta__ad-banner overflow-hidden pb__30 d-none">
				<div className="container-fluid p-0">
					<a href="#0" className="solasta__ad-image">
						{homeBanner2 && homeBanner2 !== undefined && (
							<Image
								className="w-100"
								src={homeBanner2.image}
								loading={"lazy"}
								alt=""
								width={0}
								height={0}
								layout="responsive"
								objectFit="cover"
							/>
						)}
						<div className="ad-banner__content-two">
							<h2>Summer Special for Men</h2>
							<Link
								href={"category/mens_wear_1709532972"}
								prefetch={true}
								className="explore-btn"
							>
								Explore Now
							</Link>
						</div>
					</a>
				</div>
			</section>
			{/* {offerBannerRedux ? (
				<MainSlider banners={offerBannerRedux["home_slider_three"]} />
			) : (
				<Skeleton height={500} />
			)} */}
			<section className="solasta-newarrival-area solasta__best-selling section__padding d-none">
				<div className="container-fluid p-0">
					<div className="section__header mb-4 text-center d-flex justify-content-between align-items-center">
						<h2 className="mb-0">Best Selling Products</h2>

						<Link
							href={"/category/" + router.query.id + "?top_selling=1"}
							className="view-all-btn"
						>
							View All
						</Link>
					</div>
					<Slider
						className="solasta-product-slider"
						perPage={2}
						navigation={false}
						pagination={true}
						autoplay={true}
						loop={false}
						spaceBetween={20}
						speed={300}
						breakpoints={{
							768: {
								slidesPerView: 3,
							},
							1200: {
								slidesPerView: 4,
							},
							1600: {
								slidesPerView: 5,
							},
						}}
					>
						{topSellingProducts?.map((product, index) => {
							return (
								<SwiperSlide key={index}>
									<ProductCard
										key={index}
										name={product.name}
										slug={product.slug}
										thumbnail_image={product.thumbnail_image}
										id={product.id}
										base_price={product.base_price}
										base_discounted_price={
											product?.base_discounted_price
										}
										details={product?.links?.details}
										wishLists={wishLists}
										hover_image={product.hover_image}
										choice_options={product.choice_options}
									/>
								</SwiperSlide>
							);
						})}
					</Slider>
				</div>
			</section>
			{/* Rise area end here */}

			
		</>
	);
}

export default Home;
