import React, { useCallback } from "react";
// import MiddleNav from "./nav/MiddleNav";
// import FinalNav from "./nav/FinalNav";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { get, post, tAlert } from "../../helpers/helper";
import { setTemp } from "../../store/slice/AuthSlice";
import { addToMegaMenu, setCategory } from "../../store/slice/GlobalSetting";
import { common } from "../../utils/route";
import Footer from "./Footer";
const FirstNav = dynamic(() => import("./nav/FirstNav"), {
	ssr: false,
	loading: () => <Skeleton height={50} />,
});
const MiddleNav = dynamic(() => import("./nav/MiddleNav"), {
	ssr: false,
	loading: () => <Skeleton height={50} />,
});
const FinalNav = dynamic(() => import("./nav/FinalNav"), {
	ssr: false,
	loading: () => (
		<>
			<Skeleton height={50} />
		</>
	),
});
function Header() {
	let [categories, setCategories] = useState(null);
	let [megaMenu, setMegaMenu] = useState(null);
	let allCategories = useSelector((state) => state?.globalSetting?.categories);
	let authSlice = useSelector((state) => state.authSlice);
	let getSetting = useSelector((state) => state.globalSetting.globalsetting);
	let router = useRouter();
	let businessSlice = useSelector((state) => state.globalSetting);
	let dispatch = useDispatch();

	let fetchCategory = async () => {
		if (allCategories && allCategories.length > 0) {
			setCategories(allCategories);
			
		} else {
			let { data, status } = await get(
				"/v2/categories?parent_id=0&platform=web"
			);
			if (status === 200) {
				dispatch(setCategory({ all_categories: data.data }));
			} else {
				tAlert("Something went wrong");
			}
		}
	};

	let fetchMegaMenu = useCallback(async () => {
		if (businessSlice?.megaMenus && businessSlice?.megaMenus?.length > 0) {
			setMegaMenu(businessSlice?.megaMenus);
		} else {
			let { data, status } = await get(common.MEGAMENU);

			if (status === 200) {
				dispatch(addToMegaMenu({ megaMenu: data.result }));
			} else {
				tAlert("Something went wrong");
			}
			setMegaMenu(data?.result ?? []);
		}
	}, []);
	let fetchTempUser = async () => {
		if (!authSlice?.tempId && !authSlice?.user && !authSlice?.token) {
			let { data, status } = await post("/v2/auth/signin-guest-user");
			if (status === 200) {
				let { temp_guest_user_no, access_token } = data;
				dispatch(
					setTemp({ tempId: temp_guest_user_no, token: access_token })
				);
			} else {
				tAlert("Something went wrong");
			}
		}
	};

	useEffect(() => {
		fetchMegaMenu();
		fetchTempUser();
	}, []);

	return (
		<>
			<header className="solasta-header">
				{/* <TopHeader /> */}
				{/* <FirstNav /> */}
				{/* <MiddleNav categories={categories} /> */}
				{/* {router.pathname != "/login" && <FinalNav categories={megaMenu} />} */}
				<FinalNav categories={megaMenu} />

				{/* <div className="container-fluid">
					<div className="solasta-header__wrp">
						<a href="#0" className="solasta__logo mb-4">
							<img
								src="/assets/images/solasta/logo/solasta-logo.png"
								alt="solasta-logo"
							/>
						</a>
						<ul className="solasta-header__main-menu">
							<li>
								<a href="/category/mens-fashion-iaamq,">New In</a>
							</li>
							<li>
								<a href="/category/mens-fashion-iaamq,">Men's</a>
							</li>
							<li>
								<a href="/category/mens-fashion-iaamq,">Women's</a>
							</li>
							<li>
								<a href="/category/mens-fashion-iaamq,">Boys</a>
							</li>
							<li>
								<a href="/category/mens-fashion-iaamq,">Girls</a>
							</li>
							<li>
								<a href="/category/mens-fashion-iaamq,">Campaign</a>
							</li>
							<li>
								<a href="/category/mens-fashion-iaamq,">
									Store Locations
								</a>
							</li>
						</ul>
						<ul className="solasta-header__info">
							<li>
								<a href="#0">
									<i class="fa-solid fa-magnifying-glass"></i>
								</a>
							</li>
							<li>
								<a href="#0">
									<i class="fa-regular fa-user"></i>
								</a>
							</li>
							<li>
								<a href="#0">
									<i class="fa-regular fa-heart"></i>
								</a>
							</li>

							<li>
								<a href="#0">
									<i class="fa-solid fa-cart-shopping"></i>
								</a>
							</li>
						</ul>
					</div>
				</div> */}
			</header>
		</>
	);
}

export default Header;
