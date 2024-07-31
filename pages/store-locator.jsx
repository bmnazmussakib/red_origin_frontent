import Link from "next/link";
import { useRouter } from "next/router.js";
import React, { useEffect } from "react";
import Banner from "../components/common/Banner.jsx";
import StoreLocatorCard from "../components/storeLocator/StoreLocatorCard.jsx";
import { get } from "../helpers/helper.js";
import mainStore from "../store/index.js";
import { STORE_LOCATOR, detail } from "../utils/route.js";

const storeLocator = ({ firstHalf, secondHalf }) => {
	let [productInfo, setProductInfo] = React.useState(null);
	let router = useRouter();
	let { p } = router.query;
	useEffect(() => {
		if (!p) return;
		get(detail?.PRODUCT_BY_SLUG + "/" + p).then((res) => {
			setProductInfo(res?.data?.data[0]);
		});
	}, []);
	return (
		<>
			{productInfo ? (
				<>
					<section
						className="common-banner-main"
						style={
							productInfo?.thumbnail_image && {
								background: `url(${productInfo?.thumbnail_image}) `,
							}
						}
					>
						<div className="container">
							<div className="row">
								<div className="col-12">
									<h4 className="d-none">view cart</h4>
								</div>
							</div>
						</div>

						<section className="breadcrum-main mb-0">
							<div className="container">
								<div className="row">
									<div className="col-12">
										<nav aria-label="breadcrumb">
											<ol className="breadcrumb d-none">
												<li className="breadcrumb-item">
													<Link prefetch={true} href="/">
														Home
													</Link>
												</li>

												<li className="breadcrumb-item">
													<a disabled="">view cart </a>
												</li>
											</ol>
										</nav>
									</div>
								</div>
							</div>
						</section>
					</section>
				</>
			) : (
				<Banner type="product_offer_banner" />
			)}
			<section className="store-locator-main">
				<div className="container">
					<div className="row">
						<div className="col-12">
							<div className="store-list">
								{firstHalf?.map((store, index) => {
									return (
										<StoreLocatorCard
											key={index}
											id={store.id}
											title={store.title}
											address={store.address}
											business_hour={store.business_hour}
											contact={store.contact}
											image={store.image}
											mdirection={store.mdirection}
											status={store.status}
											store_code={store.store_code}
										/>
									);
								})}
							</div>
						</div>
						<div className="col-12">
							<div className="store-list">
								{secondHalf?.map((store, index) => {
									return (
										<StoreLocatorCard
											key={index}
											id={store.id}
											title={store.title}
											address={store.address}
											business_hour={store.business_hour}
											contact={store.contact}
											image={store.image}
											mdirection={store.mdirection}
											status={store.status}
											store_code={store.store_code}
										/>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default storeLocator;
export const getServerSideProps = mainStore.getServerSideProps(
	(store) =>
		async ({ query, req }) => {
			try {
				let { data } = await get(STORE_LOCATOR);

				let stores = data?.data;
				const half = Math.ceil(stores.length / 2);

				const firstHalf = stores.splice(0, half);
				const secondHalf = stores.splice(-half);
				return {
					props: {
						firstHalf,
						secondHalf,
					},
				};
			} catch (error) {
				return {
					props: {
						products: [],
					},
					notFound: true,
				};
			}
		}
);
