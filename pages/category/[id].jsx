import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { PaginationControl } from "react-bootstrap-pagination-control";
import Banner from "../../components/common/Banner.jsx";
import ProductCard from "../../components/common/card/ProductCard.jsx";
import { get } from "../../helpers/helper";
import useSearch from "../../hook/useSearch";
import mainStore from "../../store";
import { shop } from "../../utils/route";
import SearchSidebar from "../../components/common/SearchSidebar.jsx";

const Shop = ({
	products: productData,
	lastPage,
	wishLists,
	min_price,
	max_price,
}) => {
	let { query } = useRouter();
	let router = useRouter();

	let { applyFilter, attributes, changePagination, page } = useSearch();

	let [categoryInfo, setCategoryInfo] = useState({});

	return (
		<>
			<Head>
				<title>Shop | {process.env.NEXT_PUBLIC_APP_NAME}</title>
			</Head>

			<Banner
				type="product_offer_banner"
				setCategoryInfo={setCategoryInfo}
			/>

			<section className="shop-top-info most-used-tags">
				<div className="container-fluid">
					<div className="row ">
						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<h4>{categoryInfo?.name}</h4>
							<ul className="nav d-none">
								<li className="nav-item d-none">
									<Link
										href={
											"/category/" + router.query.id + "?discount=1"
										}
										shallow={false}
										className="nav-link"
									>
										Discount
									</Link>
								</li>
								<li className="nav-item">
									<Link
										href={
											"/category/" +
											router.query.id +
											"?top_selling=1"
										}
										shallow={false}
										className="nav-link"
									>
										top selling
									</Link>
								</li>
								<li className="nav-item">
									<Link
										href={
											"/category/" +
											router.query.id +
											"?new_arrival=1"
										}
										shallow={false}
										className="nav-link"
									>
										New Arrival
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			<section className="shop-layout-main section__padding pb-0">
				<div className="container-fluid p-0">
					<button class="btn rounded-0 filter-btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebar-filter-offcanvas" aria-controls="sidebar-filter-offcanvas">
						Filter & Sort
					</button>
					<div class="offcanvas offcanvas-start sidebar-filter-offcanvas" tabindex="-1" id="sidebar-filter-offcanvas" aria-labelledby="offcanvasExampleLabel">
						<div class="offcanvas-header">
							{/* <h5 class="offcanvas-title" id="offcanvasExampleLabel">Offcanvas</h5> */}
							<button type="button" class="btn close-btn" data-bs-dismiss="offcanvas" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
						</div>
						<div class="offcanvas-body">
							<SearchSidebar
								min_price={min_price}
								max_price={max_price}
								applyFilter={applyFilter}
								query={query}
								attributes={attributes}
								pathName={"/category/" + query?.id}
							/>
						</div>
					</div>
					<div className="row mb-tweenty sort-by-selection d-none">
						<div className="d-flex align-items-center justify-content-between rise__filter-area">
							<div className="rise-category__option-wrp">
								<div className="rs-option__item">
									<label
										htmlFor="inputPassword6"
										className="col-form-label"
									>
										Categories
									</label>
									<select
										className="form-select form-control"
										aria-label="Default select example"
										name="order_by"
										onChange={(event) =>
											applyFilter(event, "/category/" + query?.id)
										}
										value={query.order_by}
									>
										<option value="">Men T-shirt</option>
										<option value="low2high">
											Mens Baseball Jersey
										</option>
										<option value="high2low">Mens Kabli</option>
										<option value="atoz">Mens Panjabi</option>
										<option value="ztoa">Mens Polo Shirt</option>
									</select>
								</div>
								<div className="rs-option__item">
									<label
										htmlFor="inputPassword6"
										className="col-form-label"
									>
										Color
									</label>
									<select
										className="form-select form-control"
										aria-label="Default select example"
										name="order_by"
										onChange={(event) =>
											applyFilter(event, "/category/" + query?.id)
										}
										value={query.order_by}
									>
										<option value="">Select Color</option>
										<option value="low2high">Black</option>
										<option value="high2low">Blue</option>
										<option value="atoz">Red</option>
										<option value="ztoa">Yellow</option>
									</select>
								</div>
								<div className="rs-option__item">
									<label
										htmlFor="inputPassword6"
										className="col-form-label"
									>
										Size
									</label>
									<select
										className="form-select form-control"
										aria-label="Default select example"
										name="order_by"
										onChange={(event) =>
											applyFilter(event, "/category/" + query?.id)
										}
										value={query.order_by}
									>
										<option value="">Select Size</option>
										<option value="low2high">S</option>
										<option value="high2low">M</option>
										<option value="atoz">L</option>
										<option value="ztoa">XL</option>
										<option value="ztoa">XXL</option>
									</select>
								</div>
							</div>
							<div className="rise-category__option-wrp">
								<div className="rs-option__item">
									<label
										htmlFor="inputPassword6"
										className="col-form-label"
									>
										sort
									</label>
									<select
										className="form-select form-control"
										aria-label="Default select example"
										name="order_by"
										onChange={(event) =>
											applyFilter(event, "/category/" + query?.id)
										}
										value={query.order_by}
									>
										<option value="">Open this select menu</option>
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
						{/* <SearchSidebar
							min_price={min_price}
							max_price={max_price}
							applyFilter={applyFilter}
							query={query}
							attributes={attributes}
							pathName={"/category/" + query?.id}
						/> */}

						<div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
							{productData && productData?.length > 0 ? (
								<div className="shop-grid-main">
									{productData.map(
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
											hover_image,
											choice_options,
										}) => {
											return (
												<ProductCard
													name={name}
													slug={slug}
													thumbnail_image={thumbnail_image}
													base_discounted_price={
														base_discounted_price
													}
													id={id}
													base_price={base_price}
													discounted_price={base_discounted_price}
													wishLists={wishLists}
													hover_image={hover_image}
													choice_options={choice_options}
												/>
											);
										}
									)}{" "}
								</div>
							) : (
								// </InfiniteScroll>
								<div className="m-3 text-center">
									<h3> Sorry No Products Found</h3>
								</div>
							)}

							<nav
								aria-label="Page navigation comments"
								className="page-pagination"
							>
								{/* <nav aria-label="Page navigation"> */}
								<PaginationControl
									page={page + 1}
									between={1}
									total={lastPage ?? 1}
									limit={1}
									changePage={(page) => {
										// setPage(page)
										console.log("page: ", page);
										console.log("lastpage: ", lastPage);
										changePagination(
											page,
											"/category/" + (query?.id ?? "")
										);
										window.scrollTo(0, 0);
									}}
									ellipsis={1}
									next={true}
									last={true}
								/>
								{/* </nav> */}
							</nav>
						</div>
					</div>



				</div>
			</section>
		</>
	);
};

export default Shop;
export const getServerSideProps = mainStore.getServerSideProps(
	(store) =>
		async ({ query, req }) => {
			let { id } = query;
			if (id) {
				if (!query?.categories) {
					query = { ...query, category_slug: id };
					delete query.id;
				}
			}

			query = { ...query, limit: 12 };
			try {
				let { data: products } = await get(
					shop.PRODUCT,
					new URLSearchParams(query)
				);

				return {
					props: {
						products: products.data ?? [],
						min_price: products?.min_price,
						max_price: products?.max_price,
						lastPage: products?.meta?.last_page,
						// categories: categories.data,
						// attributes: attributes,
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
