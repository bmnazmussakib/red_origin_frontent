import { hasCookie } from "cookies-next";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cookie, getLang, tAlert } from "../../../helpers/helper";
import { removeUser } from "../../../store/slice/AuthSlice";
import {
	clearCart,
	clearCoupon,
	clearMemberShip,
} from "../../../store/slice/CartSlice";
import { clearWishList } from "../../../store/slice/WishListSlice";
function FirstNav() {
	let [lang, setLang] = React.useState(getLang() || "bn");
	const { t, i18n } = useTranslation("common");
	let auth = useSelector((state) => state.authSlice.user);
	let langSet = (language) => {
		setLang(language);
	};
	let router = useRouter();
	useEffect(() => {}, [lang]);
	let settings = useSelector((state) => state.globalSetting.globalsetting);

	const [scrollTop, setScrollTop] = useState(0);
	// //console.log('scrollTop: ', scrollTop);

	useEffect(() => {
		const handleScroll = (event) => {
			setScrollTop(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	let dispatch = useDispatch();
	return (
		<>
			<section
				className={scrollTop > 0 ? `first-nav fix-firstNav` : `first-nav`}
			>
				{/* <section className="first-nav"> */}
				<nav className="navbar navbar-expand-lg bg-white">
					<div className="container">
						<ul className="navbar-nav">
							{/* <li className="nav-item">
                <Link prefetch={true} className="nav-link" href="/profile">
                  my account
                </Link>
              </li> */}
							{/* {auth ? (
                ""
              ) : (
                <li className="nav-item">
                  <Link prefetch={true} className="nav-link" href="/profile">
                  my account
                  </Link>
                </li>
              )} */}

							<li className="nav-item d-none d-lg-block">
								<Link prefetch={true} className="nav-link" href="#">
									Contact
								</Link>
							</li>

							<li className="nav-item d-none d-lg-block">
								<Link prefetch={true} className="nav-link" href="/page/About-Us">
									about us
								</Link>
							</li>
							<li className="nav-item d-none d-lg-none d-lg-block">
								<Link prefetch={true} className="nav-link" href="#">
									blog
								</Link>
							</li>
							<li className="nav-item d-none d-lg-none ">
								<Link
									prefetch={true}
									className="nav-link"
									href="/compare"
								>
									compare(
									{hasCookie("compare")
										? JSON.parse(cookie("compare")).length
										: 0}
									)
								</Link>
							</li>
							{/* {auth ? (
                ""
              ) : (
                <li className="nav-item">navbar-toggler
                  <Link prefetch={true} className="nav-link" href="/login">
                    log in
                  </Link>
                </li>
              )} */}

							{/* <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {lang == "bn" ? "Bangla (BD)" : "English (US)"}
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a
                      onClick={() => langSet("bn")}
                      className={
                        lang == "bn" ? "dropdown-item active" : "dropdown-item"
                      }
                    >
                      Bangla (BD)
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => langSet("en")}
                      className={
                        lang == "en" ? "dropdown-item active" : "dropdown-item"
                      }
                    >
                      English (US)
                    </a>
                  </li>
                </ul>
              </li> */}
						</ul>
						<ul className="navbar-nav">
							{/* <li className="nav-item">
                <Link prefetch={true} className="nav-link" href="/profile">
                  my account
                </Link>
              </li> */}
							{/* {auth ? (
                ""
              ) : (
                <li className="nav-item">
                  <Link prefetch={true} className="nav-link" href="/profile">
                  my account
                  </Link>
                </li>
              )} */}

							<li className="nav-item d-none d-lg-none d-lg-block">
								<Link
									prefetch={true}
									className="nav-link"
									href="/compare"
								>
									compare(
									{hasCookie("compare")
										? JSON.parse(cookie("compare")).length
										: 0}
									)
								</Link>
							</li>
							<li className="nav-item d-none d-lg-block">
								<Link
									prefetch={true}
									className="nav-link"
									href="/login"
								>
									registration
								</Link>
							</li>
							{auth ? (
								<li className="nav-item">
									<a
										onClick={() => {
											dispatch(removeUser());
											dispatch(clearCart());
											dispatch(clearCoupon());
											dispatch(clearWishList({
												logout: true
											}));
											dispatch(clearMemberShip());
											router.push("/");
											tAlert("logout successfully", "success");
										}}
										className="nav-link"
										href="JavaScript:void(0)"
									>
										Logout
									</a>
								</li>
							) : (
								<li className="nav-item">
									<Link
										prefetch={true}
										className="nav-link"
										href="/login"
									>
										log in
									</Link>
								</li>
							)}
							{/* {auth ? (
                ""
              ) : (
                <li className="nav-item">navbar-toggler
                  <Link prefetch={true} className="nav-link" href="/login">
                    log in
                  </Link>
                </li>
              )} */}

							{/* <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {lang == "bn" ? "Bangla (BD)" : "English (US)"}
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a
                      onClick={() => langSet("bn")}
                      className={
                        lang == "bn" ? "dropdown-item active" : "dropdown-item"
                      }
                    >
                      Bangla (BD)
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => langSet("en")}
                      className={
                        lang == "en" ? "dropdown-item active" : "dropdown-item"
                      }
                    >
                      English (US)
                    </a>
                  </li>
                </ul>
              </li> */}
						</ul>
					</div>
				</nav>
			</section>
		</>
	);
}

export default FirstNav;
