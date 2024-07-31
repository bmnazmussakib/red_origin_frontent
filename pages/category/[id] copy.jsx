import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import mainStore from "../../store";
import { shop } from "../../utils/route";
import Router, { useRouter } from "next/router";
import ReactPaginate from "react-paginate";
import Banner from "../../components/common/Banner.jsx";
import ShopProduct from "../../components/common/card/ShopProduct.jsx";
import ProductCard from "../../components/common/card/ProductCard.jsx";
import { cookie, get } from "../../helpers/helper";
import { hasCookie } from "cookies-next";
import {PaginationControl} from "react-bootstrap-pagination-control";
import useSearch from "../../hook/useSearch";

const Shop = ({
  products: productData,
  lastPage,
  wishLists,
  // categories,
  // attributes,
  min_price,
  max_price,
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

  useEffect(() => {
    let fetchCategoryAttributes = async () => {
      if (
        localStorage.getItem("categories") == null ||
        localStorage.getItem("attributes") == null
      ) {
        let { data: categories } = await get(shop.CATEGORIES);
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
        console.log(attributes);
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
        localStorage.setItem("attributes", JSON.stringify(attributes)) ?? [];
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

  let { query } = useRouter();
  let router = useRouter();

  const [products, setProducts] = useState(productData);
  console.log("ppp",products);
  let [priceRange, setPriceRage] = useState({
    min_price: min_price,
    max_price: max_price,
  });
  const [search, setSearch] = useState({
    min_price: query.min_price ? parseInt(query.min_price) : priceRange.min_price,
    max_price: query.max_price ? parseInt(query.max_price) : priceRange.max_price,
    cat_id: query.cat_id ? query.cat_id?.split(",") : [],
    brand_id: query.brand_id ? query.brand_id?.split(",") : [],
    size: query.size ? query.size?.split(",") : [],
    color: query.color ? query.color?.split(",") : [],
    fit_id: query.fit_id ? query.fit_id?.split(",") : [],
    embellishment_id: query.embellishment_id
      ? query.embellishment_id?.split(",")
      : [],

    segment_id: query.segment_id ? query.segment_id?.split(",") : [],
    compostion_id: query.compostion_id ? query.compostion_id?.split(",") : [],
    sleevelength_id: query.sleevelength_id
      ? query.sleevelength_id?.split(",")
      : [],
    fabrications_id: query.fabrications_id
      ? query.fabrications_id?.split(",")
      : [],
    stock_available: query.stock_available ? query.stock_available : null,
    order_by: query.order_by ? query.order_by : null,
  });

  let { applyFilter, attributes, changePagination, page } = useSearch()

  const getMoreProducts = async (filter = false) => {
    if (query?.id) {
      query = { ...query, category_slug: query.id };
      delete query.id;
    }
    let { data, status } = await get(
      shop.PRODUCT +
        "?page=" +
        (filter ? (page == 0 ? page + 1 : page) : page + 1),
      new URLSearchParams({ ...query, ...search })
    );

    if (status != 200) return false;

    if (filter) {
      setPage(0);
      setProducts([...data?.data]);
    } else {
      setProducts((post) => [...data?.data]);
    }

    setTotalPage(data?.meta?.last_page);
  };
  let getFilter = (e) => {
    let { name, value, checked } = e.target;
    let page = router?.query?.page ? router.query.page : 1;

    let {
      cat_id = null,
      brand_id = null,
      size = null,
      color = null,
      fit_id = null,
      embellishment_id = null,
      segment_id = null,
      compostion_id = null,
      sleevelength_id = null,
    } = query;
    let values = [];

    if (name == "cat_id") {
      if (checked) {
        values = cat_id ? [...cat_id.split(","), value] : [value];
      } else {
        values = cat_id ? cat_id.split(",").filter((v) => v != value) : [];
      }
    } else if (name == "brand_id") {
      if (checked) {
        values = brand_id ? [...brand_id.split(","), value] : [value];
      } else {
        values = brand_id ? brand_id.split(",").filter((v) => v != value) : [];
      }
    } else if (name == "size") {
      if (checked) {
        values = size ? [...size.split(","), value] : [value];
      } else {
        values = size ? size.split(",").filter((v) => v != value) : [];
      }
    } else if (name == "color") {
      if (checked) {
        values = color ? [...color.split(","), value] : [value];
      } else {
        values = color ? color.split(",").filter((v) => v != value) : [];
      }
    } else if (name == "fit_id") {
      if (checked) {
        values = fit_id ? [...fit_id.split(","), value] : [value];
      } else {
        values = fit_id ? fit_id.split(",").filter((v) => v != value) : [];
      }
    } else if (name == "embellishment_id") {
      if (checked) {
        values = embellishment_id
          ? [...embellishment_id.split(","), value]
          : [value];
      } else {
        values = embellishment_id
          ? embellishment_id.split(",").filter((v) => v != value)
          : [];
      }
    } else if (name == "segment_id") {
      if (checked) {
        values = segment_id ? [...segment_id.split(","), value] : [value];
      } else {
        values = segment_id
          ? segment_id.split(",").filter((v) => v != value)
          : [];
      }
    } else if (name == "compostion_id") {
      if (checked) {
        values = compostion_id ? [...compostion_id.split(","), value] : [value];
      } else {
        values = compostion_id
          ? compostion_id.split(",").filter((v) => v != value)
          : [];
      }
    } else if (name == "sleevelength_id") {
      if (checked) {
        values = sleevelength_id
          ? [...sleevelength_id.split(","), value]
          : [value];
      } else {
        values = sleevelength_id
          ? sleevelength_id.split(",").filter((v) => v != value)
          : [];
      }
    } else if (name == "stock_available") {
      values = checked ? 1 : null;
    } else if (name == "order_by") {
      values = value;
    }
    let newQuery = query;
    if (values.length == 0) {
      delete newQuery[name];
    } else {
      newQuery = { ...newQuery, [name]: values };
    }

    router.push(
      "/category/" +
        router.query.id +
        "?" +
        new URLSearchParams({ ...newQuery })
    );
  };

  useEffect(() => {
    setProducts(productData);
  }, []);
  useEffect(() => {
    document
      .querySelector(".filter-toggle-btn")
      .addEventListener("click", function () {
        document
          .querySelector(".shop-sidebar-parent")
          .classList.toggle("display-none");
      });
  }, []);
  let [categoryInfo, setCategoryInfo] = useState({});
  console.log("sizes",sizes);
  return (
    <>
      <Head>
        <title>Shop | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>

      <Banner type="product_offer_banner" setCategoryInfo={setCategoryInfo} />

      <section className="shop-top-info most-used-tags d-none">
        <div className="container-fluid">
          <div className="row ">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <h4>{categoryInfo?.name}</h4>
              <ul className="nav">
                {/* <li className="nav-item">
                  <Link
                    href={'/category/' + router.query.id + '?today_deal=1'}
                    shallow={false}
                    className="nav-link"
                  >
                    Today Deals
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href={'/category/' + router.query.id + '?home_delivery=1'}
                    shallow={false}
                    className="nav-link"
                  >
                    Home Delivery
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href={'/category/' + router.query.id + '?free_shipping=1'}
                    shallow={false}
                    className="nav-link"
                  >
                    Free Shipping
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href={'/category/' + router.query.id + '?flash_deal=1'}
                    shallow={false}
                    className="nav-link"
                  >
                    Flash Deal
                  </Link>
                </li> */}
                <li className="nav-item">
                  <Link href={
                    '/category/' + router.query.id + '?discount=1'
                  } shallow={false} className="nav-link">
                    Discount
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href={'/category/' + router.query.id + '?top_selling=1'}
                    shallow={false}
                    className="nav-link"
                  >
                    top selling
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href={
                      '/category/' + router.query.id + '?new_arrival=1'
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

      <section className="shop-layout-main">
        <div className="filter-toggle-btn">filter</div>
        <div className="container-fluid">
          <div className="row mb-tweenty sort-by-selection">
            <div className="col-12">
              <div className="row g-3 align-items-center justify-content-end">
                <div className="col-auto">
                  <label htmlFor="inputPassword6" className="col-form-label">
                    sort by
                  </label>
                </div>
                <div className="col-auto">
                  <select
                    className="form-select form-control"
                    aria-label="Default select example"
                    name="order_by"
                    onChange={getFilter}
                    value={query.order_by}
                  >
                    <option value="">Open this select menu</option>
                    <option value="low2high">Price Low to High</option>
                    <option value="high2low">Price High to Low</option>
                    <option value="atoz">Name A to Z</option>
                    <option value="ztoa">Name Z to A</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-2 shop-sidebar-parent display-none">
              <div className="sidebar-main">
                <div className="sidebar-accordion-main">
                  <div className="accordion" id="myAccordion">
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingOne">
                        <button
                          type="button"
                          className="accordion-button "
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                        >
                          Category
                        </button>
                      </h2>
                      <div
                        id="collapseOne"
                        className="accordion-collapse collapse show"
                        data-bs-parent="#myAccordion"
                      >
                        <div className="accordion-body">
                          {categories?.map(({ id, name }) => {
                            return (
                              <div className="form-check" key={id}>
                                <input
                                  className="form-check-input"
                                  checked={
                                    search?.cat_id.includes(id.toString())
                                      ? true
                                      : false
                                  }
                                  type="checkbox"
                                  value={id}
                                  id="flexCheckDefault"
                                  name="cat_id"
                                  onChange={getFilter}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                >
                                  {name}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingTwo">
                        <button
                          type="button"
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseTwo"
                        >
                          Size
                        </button>
                      </h2>
                      <div
                        id="collapseTwo"
                        className="accordion-collapse collapse "
                        data-bs-parent="#myAccordion"
                      >
                        <div
                          className="card-body"
                          style={{
                            height: "10rem",
                            overflowY: "auto",
                            overflowX: "hidden",
                            scrollbarColor: ("#888", "#f1f1f1"),
                            scrollbarWidth: "thin",
                          }}
                        >
                          {sizes?.data?.map(({ id, value }, index) => {
                            return (
                              <div className={"form-check"} key={index}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value={value}
                                  name="size"
                                  id="flexCheckDefault"
                                  onChange={getFilter}
                                  checked={
                                    search?.size.includes(value.toString())
                                      ? true
                                      : false
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                >
                                  {value}
                                </label>
                              </div>
                            );
                          })}

                          {/* <button
                            type="button"
                            className="btn"
                            onClick={() => setShowMore(!showMore)}
                          >
                            {showMore == false ? "Show More" : "Show Less"}
                          </button> */}
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingThree">
                        <button
                          type="button"
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseThree"
                        >
                          Color
                        </button>
                      </h2>
                      <div
                        id="collapseThree"
                        className="accordion-collapse collapse"
                        data-bs-parent="#myAccordion"
                      >
                        <div
                          className="card-body"
                          style={{
                            height: "10rem",
                            overflowY: "auto",
                            overflowX: "hidden",
                            scrollbarColor: ("#888", "#f1f1f1"),
                            scrollbarWidth: "thin",
                          }}
                        >
                          {colors?.map(({ id, name }, index) => {
                            return (
                              <div className={"form-check"} key={index}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value={name}
                                  name="color"
                                  id="flexCheckDefault"
                                  onChange={getFilter}
                                  checked={
                                    search?.color.includes(name.toString())
                                      ? true
                                      : false
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                >
                                  {name}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item d-none">
                      <h2 className="accordion-header" id="headingFour">
                        <button
                          type="button"
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseFour"
                        >
                          Brand
                        </button>
                      </h2>
                      <div
                        id="collapseFour"
                        className="accordion-collapse collapse"
                        data-bs-parent="#myAccordion"
                      >
                        <div
                          className="card-body"
                          style={{
                            height: "10rem",
                            overflowY: "auto",
                            overflowX: "hidden",
                            scrollbarColor: ("#888", "#f1f1f1"),
                            scrollbarWidth: "thin",
                          }}
                        >
                          {brands?.map(({ id, name }, index) => {
                            return (
                              <div className={"form-check"} key={index}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value={id}
                                  name="brand_id"
                                  id="flexCheckDefault"
                                  onChange={getFilter}
                                  checked={
                                    search?.brand_id.includes(id.toString())
                                      ? true
                                      : false
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                >
                                  {name}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item d-none">
                      <h2 className="accordion-header" id="headingFour">
                        <button
                          type="button"
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseFive"
                        >
                          Fits
                        </button>
                      </h2>
                      <div
                        id="collapseFive"
                        className="accordion-collapse collapse"
                        data-bs-parent="#myAccordion"
                      >
                        <div
                          className="card-body"
                          style={{
                            height: "10rem",
                            overflowY: "auto",
                            overflowX: "hidden",
                            scrollbarColor: ("#888", "#f1f1f1"),
                            scrollbarWidth: "thin",
                          }}
                        >
                          {fits?.data?.map(({ id, name }, index) => {
                            return (
                              <div className={"form-check"} key={index}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value={id}
                                  name="fit_id"
                                  id="flexCheckDefault"
                                  onChange={getFilter}
                                  checked={
                                    search?.fit_id.includes(id.toString())
                                      ? true
                                      : false
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                >
                                  {name}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item d-none">
                      <h2 className="accordion-header" id="headingFour">
                        <button
                          type="button"
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseSix"
                        >
                          Fabrication
                        </button>
                      </h2>
                      <div
                        id="collapseSix"
                        className="accordion-collapse collapse"
                        data-bs-parent="#myAccordion"
                      >
                        <div
                          className="card-body"
                          style={{
                            height: "10rem",
                            overflowY: "auto",
                            overflowX: "hidden",
                            scrollbarColor: ("#888", "#f1f1f1"),
                            scrollbarWidth: "thin",
                          }}
                        >
                          {fabrications?.data?.map(({ id, name }, index) => {
                            return (
                              <div className={"form-check"} key={index}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value={id}
                                  name="fabrications_id"
                                  id="flexCheckDefault"
                                  onChange={getFilter}
                                  checked={
                                    search?.fabrications_id.includes(
                                      id.toString()
                                    )
                                      ? true
                                      : false
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                >
                                  {name}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item d-none">
                      <h2 className="accordion-header" id="headingSeven">
                        <button
                          type="button"
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseSeven"
                        >
                          embelishments
                        </button>
                      </h2>
                      <div
                        id="collapseSeven"
                        className="accordion-collapse collapse"
                        data-bs-parent="#myAccordion"
                      >
                        <div
                          className="card-body"
                          style={{
                            height: "10rem",
                            overflowY: "auto",
                            overflowX: "hidden",
                            scrollbarColor: ("#888", "#f1f1f1"),
                            scrollbarWidth: "thin",
                          }}
                        >
                          {embelishments?.data?.map(({ id, name }, index) => {
                            return (
                              <div className={"form-check"} key={index}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value={id}
                                  name="embellishment_id"
                                  id="flexCheckDefault"
                                  onChange={getFilter}
                                  checked={
                                    search?.embellishment_id.includes(
                                      id.toString()
                                    )
                                      ? true
                                      : false
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                >
                                  {name}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item d-none">
                      <h2 className="accordion-header" id="headingFour">
                        <button
                          type="button"
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseEight"
                        >
                          sleeve length
                        </button>
                      </h2>
                      <div
                        id="collapseEight"
                        className="accordion-collapse collapse"
                        data-bs-parent="#myAccordion"
                      >
                        <div
                          className="card-body"
                          style={{
                            height: "10rem",
                            overflowY: "auto",
                            overflowX: "hidden",
                            scrollbarColor: ("#888", "#f1f1f1"),
                            scrollbarWidth: "thin",
                          }}
                        >
                          {sleeve_length?.data?.map(({ id, name }, index) => {
                            return (
                              <div className={"form-check"} key={index}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value={id}
                                  name="sleevelength_id"
                                  id="flexCheckDefault"
                                  onChange={getFilter}
                                  checked={
                                    search?.sleevelength_id.includes(
                                      id.toString()
                                    )
                                      ? true
                                      : false
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                >
                                  {name}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2 className="accordion-header" id="headingFour">
                        <button
                          type="button"
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseStock"
                        >
                          Stock Availability
                        </button>
                      </h2>
                      <div
                        id="collapseStock"
                        className="accordion-collapse collapse"
                        data-bs-parent="#myAccordion"
                      >
                        <div
                          className="card-body"
                          style={{
                            height: "10rem",
                            overflowY: "auto",
                            overflowX: "hidden",
                            scrollbarColor: ("#888", "#f1f1f1"),
                            scrollbarWidth: "thin",
                          }}
                        >
                          <div className={"form-check"}>
                            <input
                              className="form-check-input"
                              type="radio"
                              value="1"
                              name="stock_available"
                              id="stock_yes"
                              onChange={getFilter}
                              checked={parseInt(search?.stock_available) == 1}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="stock_yes"
                            >
                              In Stock
                            </label>
                          </div>
                          <div className={"form-check"}>
                            <input
                              className="form-check-input"
                              type="radio"
                              value="0"
                              name="stock_available"
                              id="stock_no"
                              onChange={getFilter}
                              checked={parseInt(search?.stock_available) == 0}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="stock_no"
                            >
                              Not In Stock
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item d-none">
                      <h2 className="accordion-header" id="headingFour">
                        <button
                          type="button"
                          className="accordion-button collapsed"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseNine"
                        >
                          item segments
                        </button>
                      </h2>
                      <div
                        id="collapseNine"
                        className="accordion-collapse collapse"
                        data-bs-parent="#myAccordion"
                      >
                        <div
                          className="card-body"
                          style={{
                            height: "10rem",
                            overflowY: "auto",
                            overflowX: "hidden",
                            scrollbarColor: ("#888", "#f1f1f1"),
                            scrollbarWidth: "thin",
                          }}
                        >
                          {item_segments?.data?.map(({ id, name }, index) => {
                            return (
                              <div className={"form-check"} key={index}>
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value={id}
                                  name="segment_id"
                                  id="flexCheckDefault"
                                  onChange={getFilter}
                                  checked={
                                    search?.segment_id.includes(id.toString())
                                      ? true
                                      : false
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="flexCheckDefault"
                                >
                                  {name}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Slider
                        value={[search.min_price, search.max_price]}
                        onChangeCommitted={(event, newValue, activeThumb) => {
                          setSearch({
                            ...search,
                            min_price: newValue[0],
                            max_price: newValue[1],
                          }); 
                          let newQuery = query;
                          newQuery = {
                            ...newQuery,
                            min_price: search.min_price,
                            max_price: search.max_price,
                          };
                          setTimeout(() => {
                             router.push(
                            "/category/" +
                              router.query.id +
                              "?" +
                              new URLSearchParams({ ...newQuery })
                          );
                          }, 3000);
                         
                        }}
                        min={priceRange.min_price}
                        max={priceRange.max_price}
                        valueLabelDisplay="auto"
                        getAriaValueText={(value) => `${value}`}
                        color="secondary"
                        disableSwap
                      />
                    </div>

                    <div className="d-flex">
                      <p>{search?.min_price}</p>
                      <p className="ms-auto">{search?.max_price}</p>
                    </div>
                    {Object.keys(query).length > 1 && (
                      <div className="d-block">
                        <button
                          className="btn clear-filter-btn"
                          style={{
                            width: "100% !important",
                            borderRadius: "0rem !important",
                          }}
                          onClick={() => {
                            router.push("/category/" + router.query.id);
                          }}
                        >
                          Clear Filter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-10">
              {products && products?.length > 0 ? (
                // <InfiniteScroll
                //   dataLength={products.length}
                //   next={getMoreProducts}
                //   hasMore={hasMore}
                //   loader={
                //     <div className="m-3 text-center">
                //       <h3> Loading...</h3>
                //     </div>
                //   }
                //   endMessage={null}
                // >
                <div className="shop-grid-main">
                  {products.map(
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
						  base_discounted_price={base_discounted_price}
                          id={id}
                          base_price={base_price}
						  discounted_price={base_discounted_price}
                          wishLists={wishLists}
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
                // </InfiniteScroll>
                <div className="m-3 text-center">
                  <h3> Sorry No Products Found</h3>
                </div>
              )}
            </div>

            <nav
              aria-label="Page navigation comments"
              className="page-pagination"
            >

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
                      changePagination(page, '/category/' + (query?.id ?? ''));
                      window.scrollTo(0, 0);
                    }}
                    ellipsis={1}
                    next={true}
                    last={true}
                />
              </nav>
            </nav>
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
        if (!query?.cat_id) {
          query = { ...query, category_slug: id };
          delete query.id;
        }
      }

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
