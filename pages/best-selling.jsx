import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import mainStore from "../store";
import { home } from "../utils/route";

import dynamic from "next/dynamic";
import Skeleton from "react-loading-skeleton";
import Banner from "../components/common/Banner.jsx";
import SearchSidebar from "../components/common/SearchSidebar.jsx";
import { get } from "../helpers/helper";
import useSearch from "../hook/useSearch.jsx";
import ProductCard from "../components/common/card/ProductCard.jsx";
import { PaginationControl } from "react-bootstrap-pagination-control";

const ReactPaginate = dynamic(() => import("react-paginate"), {
	ssr: false,
	loading: () => (
		<>
			<Skeleton height={50} />
		</>
	),
});

const BestSelling = ({
	products: productData,
	lastPage,
	wishLists,
	min_price,
	max_price,
}) => {
	let { query } = useRouter();
	let router = useRouter();
	let [categoryInfo, setCategoryInfo] = useState({});
	useEffect(() => {
		document
			.querySelector(".filter-toggle-btn")
			.addEventListener("click", function () {
				document
					.querySelector(".shop-sidebar-parent")
					.classList.toggle("display-none");
			});
	}, []);
	let { applyFilter, attributes, changePagination, page } = useSearch();
	
	return (
		<>
			<Head>
				<title>
					Shop | {process.env.NEXT_PUBLIC_APP_NAME} | Your One Stop
					Shopping Solution
				</title>
			</Head>

			<Banner
				type="product_offer_banner"
				setCategoryInfo={setCategoryInfo}
			/>

			<section className="shop-layout-main">
				<div className="filter-toggle-btn">filter</div>
				<div className="container-fluid">
					<div className="row mb-tweenty sort-by-selection">
						<div className="col-12">
							<div className="row g-3 align-items-center justify-content-end">
								<div className="col-auto">
									<label
										htmlFor="inputPassword6"
										className="col-form-label"
									>
										sort by
									</label>
								</div>
								<div className="col-auto">
									<select
										className="form-select form-control"
										aria-label="Default select example"
										name="order_by"
										onChange={(event) =>{
											applyFilter(event, "/best-selling")
                    }
										}
									>
										<option value="" disabled selected>
											Open this select menu
										</option>
										<option value="low2high">
											Price Low to High
										</option>
										<option value="high2low">
											Price High to Low
										</option>
										<option value="atoz">Name A to Z</option>
										<option value="ztoa">Name Z to A</option>
									</select>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<SearchSidebar
							min_price={min_price}
							max_price={max_price}
							applyFilter={applyFilter}
							query={query}
							attributes={attributes}
							pathName={"/category/" + query?.id}
						/>
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-10">
							{productData && productData?.length > 0 ? (
								<div className="shop-grid-main">
									{productData?.map(
										({
											base_discounted_price,
											base_price,
											discount,
											discount_type,
											featured,
											id,
											name,
											photos,
											rating,
											sales,
											thumbnail_image,
											todays_deal,
											unit,
											has_discount,
											tags,
											slug,
											choice_options,
											hover_image
										}) => {
											return (
												<ProductCard
													base_discounted_price={base_discounted_price}
													base_price={base_price}
													discount={discount}
													discount_type={discount_type}
													featured={featured}
													id={id}
													name={name}
													photos={photos}
													rating={rating}
													sales={sales}
													thumbnail_image={thumbnail_image}
													todays_deal={todays_deal}
													unit={unit}
													has_discount={has_discount}
													key={id}
													wishLists={wishLists}
													tags={tags}
													slug={slug}
													hover_image={hover_image}
													choice_options={
														choice_options
													}
												/>

											);
										}
									)}{" "}
								</div>
							) : (

								<div className="m-3 text-center">
									<h3> Sorry No Products Found</h3>
								</div>
							)}
						</div>
						<nav aria-label="Page navigation">
							<PaginationControl
								page={page + 1}
								between={2}
								total={lastPage ?? 1}
								limit={1}
								changePage={(page) => {
									// setPage(page)
									console.log('page: ', page);
									console.log('lastpage: ', lastPage);
									changePagination(page, '/best-selling/' + (query?.id ?? ''));
									window.scrollTo(0, 0);
								}}
								ellipsis={1}
								next={true}
								last={true}
							/>
						</nav>

					</div>
				</div>
			</section>
		</>
	);
};

export default BestSelling;
export const getServerSideProps = mainStore.getServerSideProps(
	(store) =>
		async ({ query, req, res }) => {
			let { id } = query;

			if (id) {
				if (!query?.categories) {
					query = { ...query, category_slug: id };
					delete query.id;
				}
			}

			try {
				let { data: products } = await get(
					home.TOP_SELLING,
					new URLSearchParams(query)
				);
				//console.log(products)
				return {
					props: {
						products: products.data ?? [],
						min_price: products?.min_price,
						max_price: products?.max_price,
						lastPage: products?.meta?.last_page,
						wishLists: req.cookies.wishList ?? [],
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