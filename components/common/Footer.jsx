import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { post } from "../../helpers/helper";
import { subscribe_route } from "../../utils/route";

function Footer() {
	let settings = useSelector((state) => state.globalSetting.globalsetting);
	let businessSlice = useSelector((state) => state.globalSetting);
	let auth = useSelector((state) => state?.authSlice?.user);
	let token = useSelector((state) => state?.authSlice?.token);
	let [pages, setPageList] = useState([]);
	let [email, setEmail] = useState("");
	console.log("Settings", settings);
	const submitSubscribe = (e) => {
		post(subscribe_route.SUBSCRIBE, null, {
			email: email,
		})
			.then((res) => {
				if (res.data.status == "success") {
					toast.success("Subscribed successfully");
					setEmail("");
				}
			})
			.catch((error) => {
				toast.error(error?.response?.data?.message || "Already Subscribed");
				console.error(error);
			});
	};
	useEffect(() => {
		setPageList(businessSlice?.pages);
	}, [businessSlice?.pages]);

	let filterPages = (type) => {
		//console.log(pages);
		//console.log(type);
		//console.log(pages.filter((page) => page.title == type));
		let tempPages = pages.filter((page) => page.title == type);

		if (tempPages.length > 0) {
			return tempPages[0];
		} else {
			return {
				slug: "#",
				id: "#",
			};
		}
	};

	console.log("Pages", pages);

	return (
		<>
			{/* Rise Footer area start here */}
			<footer className="rise-footer-area">
				<div className="container">
					<div className="rise-footer-top">
						<div className="row align-items-center">
							<div className="col-lg-9">
								<h2 className="mb__40">
									Keep <i>in </i>Touch
								</h2>
								<div className="row mb__30">
									<div className="col-lg-6">
										<form>
											<div class="mb-3">
												<input
													type="email"
													class="form-control mb__30"
													id="exampleInputEmail1"
													placeholder="Enter Your Email Address"
												/>
											</div>
											<button
												type="submit"
												class="btn subscription-btn "
											>
												Sign up for emails
											</button>
										</form>
									</div>
									<div className="col-lg-6">
										<form>
											<div class="mb-3">
												<input
													type="email"
													class="form-control mb__30"
													id="exampleInputEmail1"
													placeholder="Enter Your Phone Number"
												/>
												{/* <TextField id="standard-basic" label="Standard" variant="standard" /> */}
											</div>
											<button
												type="submit"
												class="btn subscription-btn "
											>
												Sign up for texts
											</button>
										</form>
									</div>
								</div>
								<p className="text">
									By signing up via text, you consent to recurring
									automated personalized (e.g. cart reminders) and
									marketing texts from Banana Republic at the number
									used to sign-up. Terms & Conditions apply. Check our
									Privacy Policy to learn how we handle your personal
									information. Consent not req’d for purchase. Reply
									HELP for help, STOP to end. Msg frequency varies. Msg
									& data rates apply.
								</p>
							</div>
							{/* <div className="col-lg-3 d-none">
								<ul class="nav flex-column redOrigin__footerInfo">
									<li class="nav-item">
										<a class="nav-link" href="#">
											<i class="ri-map-2-line"></i>
											<span>Find a store</span>
										</a>
									</li>
									<li class="nav-item">
										<a class="nav-link" href="#">
											<i class="ri-gift-2-line"></i>
											<span>Gift Card</span>
										</a>
									</li>
									<li class="nav-item">
										<a class="nav-link" href="#">
											<i class="ri-bank-card-line"></i>
											<span>Credit Card</span>
										</a>
									</li>
								</ul>
							</div> */}
						</div>
					</div>
				</div>
				<div className="RedOrigin__copytext">
					<div className="container">
						<div className="rise-footer__wrp">
							<div className="row g-4 g-sm-5 justify-content-between">
								<div className="col-lg-3 px-0">
									<div className="rise-footer__item">
										<a href="#0" className="rise__logo">
											<img src="/assets/images/redOrigin/logo/red-origin-logo.png" />
										</a>
										<p>
											Red Origin is a fashion forward retailer that
											blends local culture with global trends
											creating a unique spin on fashion. Pioneering
											Streetwear into the Bangladesh market, Red Origin offers a wide array of clothing and
											accessories.
										</p>
										<p className="">Connect with Us :</p>
										<div className="rs__solcial">
											<a href="#0">
												<i class="ri-facebook-line"></i>
											</a>
											<a href="#0">
												<i class="ri-twitter-x-line"></i>
											</a>
											<a href="#0">
												<i class="ri-linkedin-line"></i>
											</a>
											<a href="#0">
												<i class="ri-instagram-line"></i>
											</a>
										</div>
									</div>
								</div>
								<div className="col-lg-2 px-0">
									<div className="rise-footer__item">
										<h4>Need Help ?</h4>
										<ul className="rs__link rs__help">
											<li>
												<i class="ri-phone-line"></i>{" "}
												<a href="#0">01708156699</a>
											</li>
											<li>
												<i class="ri-time-line"></i>{" "}
												<span>
													10 AM – 6 PM <br /> (Except Weekend/Govt.
													Holidays)
												</span>
											</li>
											<li>
												<i class="ri-mail-send-line"></i>{" "}
												<a href="#0">red@partex.net</a>
											</li>
										</ul>
									</div>
								</div>
								<div className="col-lg-2 px-0">
									<div className="rise-footer__item">
										<h4>INFORMATION</h4>
										<ul className="rs__link">
											<li>
												<a href="#0">About Us</a>
											</li>
											<li>
												<a href="#0">Contact Us</a>
											</li>
											<li>
												<a href="#0">Store Locator</a>
											</li>
											<li>
												<a href="#0">Loyalty Club Card</a>
											</li>
											<li>
												<a href="#0">Join Us</a>
											</li>
											<li>
												<a href="#0">Fit Guide</a>
											</li>
										</ul>
									</div>
								</div>
								<div className="col-lg-2 px-0">
									<div className="rise-footer__item">
										<h4>SERVICE AND SHOPPING</h4>
										<ul className="rs__link">
											<li>
												<a href="#0">Customer Service</a>
											</li>
											<li>
												<a href="#0">Privacy Policy</a>
											</li>
											<li>
												<a href="#0">Terms and Condition</a>
											</li>
											<li>
												<a href="#0">Billing and Shipping Policy</a>
											</li>
											<li>
												<a href="#0">Return and Exchange Policy</a>
											</li>
											<li>
												<a href="#0">Track Your Order</a>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="">
					<div className="container">
						<div className="rise-footer__copytext">
							<p>
								&copy; 2024 <a href="https://www.redorigin.com.bd/" target="_blank"> RedOrigin. </a> All
								Rights Reserved.
							</p>
							<p>
								Design & Developed by
								<a href="https://mediasoftbd.com/" target="_blank"> Mediasoft Data Systems Limited. </a>
							</p>
						</div>
					</div>
				</div>
			</footer>
			{/* Rise Footer area end here */}

			{/* <footer className="footer-main">
				<div className="container-fluid">
					<div className="row">
						<div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 footer-col">
							<div className="footer-title">
								<h3>CONTACT INFO </h3>
							</div>
							<div className="footer-navs">
								<ul className="nav flex-column">
									<li className="nav-item">
										<a
											className="nav-link "
											href="#"
											dangerouslySetInnerHTML={{
												__html: getSettingValue(
													settings,
													"contact_address"
												),
											}}
										></a>
									</li>
									<li className="nav-item">
										<a className="nav-link" href="#">
											{getSettingValue(settings, "contact_phone")}
										</a>
									</li>
									<li className="nav-item">
										<a className="nav-link text-lowercase" href="#">
											{getSettingValue(settings, "contact_email")}
										</a>
									</li>
								</ul>
								<div className="footer-social-icons">
									<ul>
										{getSettingValue(settings, "facebook_link") !=
											null && (
											<li className="nav-item first-nav-social-icon">
												<a
													className="nav-link"
													href={getSettingValue(
														settings,
														"facebook_link"
													)}
												>
													<i className="icofont-facebook"></i>
												</a>
											</li>
										)}

										{getSettingValue(settings, "twitter_link") !=
											null && (
											<li className="nav-item first-nav-social-icon">
												<a
													className="nav-link"
													href={getSettingValue(
														settings,
														"twitter_link"
													)}
												>
													<i className="icofont-twitter"></i>
												</a>
											</li>
										)}
										{getSettingValue(settings, "instagram_link") !=
											null && (
											<li className="nav-item first-nav-social-icon">
												<a
													className="nav-link"
													href={getSettingValue(
														settings,
														"instagram_link"
													)}
												>
													<i className="icofont-instagram"></i>
												</a>
											</li>
										)}
										{getSettingValue(settings, "youtube_link") !=
											null && (
											<li className="nav-item first-nav-social-icon">
												<a
													className="nav-link"
													href={getSettingValue(
														settings,
														"youtube_link"
													)}
												>
													<i className="icofont-youtube"></i>
												</a>
											</li>
										)}
										{getSettingValue(settings, "linkedin_link") !=
											null && (
											<li className="nav-item first-nav-social-icon">
												<a
													className="nav-link"
													href={getSettingValue(
														settings,
														"linkedin_link"
													)}
												>
													<i className="icofont-linkedin"></i>
												</a>
											</li>
										)}
									</ul>
								</div>
							</div>
						</div>
						<div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 footer-col">
							<div className="footer-title">
								<h3 className="text-uppercase">Help</h3>
							</div>
							<div className="footer-navs">
								<ul className="nav flex-column">
									{pages?.map((page) => {
										return (
											page.page_link_position === "KNOW US" && (
												<li className="nav-item">
													<Link
														prefetch={true}
														className="nav-link "
														href={`/page/${page.slug}`}
														key={page.id}
													>
														{page.title}
													</Link>
												</li>
											)
										);
									})}
								</ul>
							</div>
						</div>
						<div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 footer-col">
							<div className="footer-title">
								<h3>ABOUT</h3>
							</div>
							<div className="footer-navs">
								<ul className="nav flex-column">
									{pages?.map((page) => {
										return (
											page.page_link_position ===
												"SHOPPING INFORMATION" && (
												<li className="nav-item">
													<Link
														prefetch={true}
														className="nav-link "
														href={`/page/${page.slug}`}
														key={page.id}
													>
														{page.title}
													</Link>
												</li>
											)
										);
									})}
								</ul>
							</div>
						</div>
						<div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 footer-col">
							<div className="footer-title">
								<h3>Contact </h3>
							</div>
							<div className="footer-navs">
								<ul className="nav flex-column">
									{pages?.map((page) => {
										return (
											page.page_link_position ===
												"SERVICE INFORMATION" && (
												<li className="nav-item">
													<Link
														prefetch={true}
														className="nav-link "
														href={`/page/${page.slug}`}
														key={page.id}
													>
														{page.title}
													</Link>
												</li>
											)
										);
									})}
									<li className="nav-item">
										<Link
											prefetch={true}
											className="nav-link "
											href={`/store-locator`}
										>
											Store Locator
										</Link>
									</li>
								</ul>
							</div>
						</div>
						<div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 footer-col">
							<div className="footer-title">
								<h3>Contact </h3>
							</div>
							<div className="footer-navs">
								<ul className="nav flex-column">
									{pages?.map((page) => {
										return (
											page.page_link_position ===
												"SERVICE INFORMATION" && (
												<li className="nav-item">
													<Link
														prefetch={true}
														className="nav-link "
														href={`/page/${page.slug}`}
														key={page.id}
													>
														{page.title}
													</Link>
												</li>
											)
										);
									})}
									<li className="nav-item">
										<Link
											prefetch={true}
											className="nav-link "
											href={`/store-locator`}
										>
											Store Locator
										</Link>
									</li>
								</ul>
							</div>
						</div>
						<div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 footer-col d-none">
							<div className="footer-title">
								<h3>category</h3>
							</div>
							<div className="footer-navs">
								<ul className="nav flex-column">
									{businessSlice?.categories?.map((category, key) => {
										return (
											key <= 5 && (
												<li className="nav-item">
													<Link
														prefetch={true}
														className="nav-link "
														href={`/category/${category.slug}`}
														key={category.id}
													>
														{category.name}
													</Link>
												</li>
											)
										);
									})}
								</ul>
							</div>
						</div>
						<div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 footer-col d-none  ">
							<div className="footer-title">
								<h3>subscribe us</h3>
							</div>
							<div className="footer-navs">
								<div className="form-group">
									<p className="mb-3">
										Keep yourself updated with the latest Solasta
										News, Fashion Updates and Blogs! Subscribe here!
									</p>
									<input
										type="email"
										className="form-control"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										id="exampleFormControlInput1"
										placeholder="Type your email"
									/>
									<button
										className="btn text-white btn-outline-secondary mt-2"
										onClick={submitSubscribe}
									>
										Follow Us
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer> */}
			{/*
			<footer className="solasta-footer-area border-top d-none">
				<div className="container-fulid">
					<div className="solasta-footer__wrp">
						<div className="solasta-footer__item footer-item-one">
							{getSettingValue(settings, "footer_logo") !== null && (
								<>
									<Link href="/" className="solasta__logo mb-4">
										<img
											src={getSettingValue(settings, "footer_logo")}
											alt="solasta-logo"
										/>
									</Link>
								</>
							)}

							<h5 className="solasta-footer-title mb-2 mt-4">
								FOLLOW US
							</h5>
							<div className="solasta__social mt-2">
								{getSettingValue(settings, "facebook_link") != null && (
									<a href={getSettingValue(settings, "facebook_link")}>
										<i className="fab fa-facebook-f"></i>
									</a>
								)}
								{getSettingValue(settings, "instagram_link") !=
									null && (
									<a
										href={getSettingValue(settings, "instagram_link")}
									>
										<i className="fab fa-instagram"></i>
									</a>
								)}
								{getSettingValue(settings, "linkedin_link") != null && (
									<a href={getSettingValue(settings, "linkedin_link")}>
										<i className="fab fa-linkedin-in"></i>
									</a>
								)}
								{getSettingValue(settings, "youtube_link") != null && (
									<a href={getSettingValue(settings, "youtube_link")}>
										<i className="fab fa-youtube"></i>
									</a>
								)}
								{/* <a href="#0">
									<i className="fab fa-facebook-f"></i>
								</a>
								<a href="#0">
									<i className="fab fa-instagram"></i>
								</a>
								<a href="#0">
									<i class="fab fa-linkedin-in"></i>
								</a>
								<a href="#0">
									<i className="fab fa-youtube"></i>
								</a> */}
			{/*
							</div>
							<p className="d-none">TRAD/NCC/2380/2019</p>
						</div>
						<div className="solasta-footer__item footer-item-two">
							<h5 className="solasta-footer-title">HELP</h5>
							<ul>
								{pages?.map((page) => {
									return (
										page.page_link_position ===
											"SERVICE INFORMATION" && (
											<li>
												{page.custom_link ? (
													<>
														<a href={page.custom_link}>
															{page.title}
														</a>
													</>
												) : (
													<Link
														prefetch={true}
														className="nav-link "
														href={`/page/${page.slug}`}
														key={page.id}
													>
														{page.title}
													</Link>
												)}
											</li>
										)
									);
								})}
							</ul>
						</div>
						<div className="solasta-footer__item footer-item-two">
							<h5 className="solasta-footer-title">ABOUT</h5>
							<ul>
								{pages?.map((page) => {
									return (
										page.page_link_position === "KNOW US" && (
											<li>
												{page.custom_link ? (
													<>
														<a href={page.custom_link}>
															{page.title}
														</a>
													</>
												) : (
													<Link
														prefetch={true}
														className="nav-link "
														href={`/page/${page.slug}`}
														key={page.id}
													>
														{page.title}
													</Link>
												)}
											</li>
										)
									);
								})}
							</ul>
							{auth == null && (
								<>
									<h5 className="solasta-footer-title mt-4">
										ACCOUNT
									</h5>
									<ul>
										<li>
											<Link prefetch={true} href={`/login`}>
												Login
											</Link>
										</li>
									</ul>
								</>
							)}
						</div>
						<div className="solasta-footer__item footer-contact-item">
							<h5 className="solasta-footer-title">CONTACT</h5>
							<ul>
								<li>
									<div
										dangerouslySetInnerHTML={{
											__html: getSettingValue(
												settings,
												"contact_address"
											),
										}}
									></div>
								</li>
							</ul>
						</div>
						<div className="solasta-footer__item footer-subscribe-item">
							<h5 className="solasta-footer-title">SUBSCRIBE</h5>
							<p>
								Be the first to know about special offers and new
								products
							</p>
							<div className="subscribe__feild">
								<input
									type="email"
									placeholder="Your Email Address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								<button onClick={submitSubscribe}>Subscribe</button>
							</div>
						</div>
					</div>
					<div className="solasta-footer__payment">
						<img
							className="w-100 d-none d-md-block"
							src="/assets/images/solasta/payment/payment.png"
							alt="solasta-payment-image"
						/>
						<img
							className="w-100 d-block d-md-none"
							src="/assets/images/solasta/payment/payment-mobile.png"
							alt="solasta-payment-image"
						/>
					</div>
				</div>
			</footer>
			<section className="solasta-footer__copyright border-top d-none">
				<div className="container-fluid">
					<div className="row">
						<div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
							<p>
								Copyright ©{new Date().getFullYear()}{" "}
								<span>Solasta</span>. All rights reserved
							</p>
						</div>
						<div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
							<p
								style={{
									textAlign: "end",
								}}
							>
								system design & developed by :
								<a href="https://mediasoftbd.com/" target="_blank">
									&nbsp; Mediasoft Data Systems Ltd.
								</a>
							</p>
						</div>
					</div>
				</div>
			</section>
			*/}
		</>
	);
}

export default Footer;
