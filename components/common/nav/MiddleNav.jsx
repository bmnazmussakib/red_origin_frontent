import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { cookie, get, tAlert } from "../../../helpers/helper";
import { useRouter } from "next/router";
import Loader from "../Loader";
import AnimLogo from "../../AnimLogo";
import { useState } from "react";
import { getSetting } from "../../../store/slice/GlobalSetting";
import { useSelector } from "react-redux";
import { getSettingValue } from "../../../utils/filters";
import Skeleton from "react-loading-skeleton";
// import CartWishAccount from "./micro/CartWishAccount";
let { shop } = require("../../../utils/route");
const CartWishAccount = dynamic(() => import("./micro/CartWishAccount"), {
  ssr: false,
});

function MiddleNav({ categories }) {
  let settings = useSelector((state) => state.globalSetting.globalsetting);
  let [search, setSearch] = React.useState({
    search: "",
    cat_id: "",
  });
  let [products, setProducts] = React.useState([]);
  let [allCategories, setCategories] = React.useState(categories ?? []);
  //console.log("products: ", products);

  let router = useRouter();

  useEffect(() => {
    $(".dropdown-toggle , .megamenu").hover(function () {
      $(".megamenu").toggleClass("show");
    });
  }, []);

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

  const [scrollTop, setScrollTop] = useState(0);
  //console.log("scrollTop: ", scrollTop);

  useEffect(() => {
    const handleScroll = (event) => {
      setScrollTop(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  let fixMenuStyle = {
    boxShadow: "1px 4px 5px -3px rgba(0,0,0,0.75)",
  };

  const [showSearch, setShowSearch] = useState(false);

  const handeShowSearch = () => {
    setShowSearch(!showSearch);
  };

  //console.log("showSearch: ", showSearch);

  const headerLogo = getSettingValue(settings, "header_logo");

  return (
    <>
      {/* <section className="middle-nav"> */}
      <section
        className={scrollTop > 100 ? `middle-nav fix-middleNav` : `middle-nav `}
      // style={
      //   scrollTop > 100
      //     ? { boxShadow: "rgb(0, 0, 0, 0.50) 0px -4px 10px 0px" }
      //     : { boxShadow: "none" }
      // }
      >
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasWithBothOptions"
            aria-controls="offcanvasWithBothOptions"
          // style={navbarToggleBtn}
          >
            {router.pathname != "/login" && (
              <i className="fa-solid fa-bars"></i>
            )}
            {/* <i className="fa-solid fa-ellipsis-vertical"></i> */}
          </button>
          <div className="row align-items-center">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-2">
              <Link prefetch={true} href={"/"}>
                <div className="logo-box">
                  {/* <AnimLogo /> */}
                  {/* {headerLogo ? <img
                      src={headerLogo}
                      alt="logo"
                      className="img-fluid"
                  />:  <Skeleton width={200} height={60} />} */}

                </div>
                <a href="#0" className="solasta__logo mb-4">
                  <img
                    src="/assets/images/solasta/logo/solasta-logo.png"
                    alt="solasta-logo"
                  />
                </a>
              </Link>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-5">
              <div className="search-box-flex">
                <div className="search-box">
                  <input
                    type="search"
                    className="form-control search-input"
                    placeholder="Search"
                    onChange={(e) =>
                      setSearch({ ...search, search: e.target.value })
                    }
                    onKeyPress={(e) => {
                      if (
                        e.key === "Enter" &&
                        (search.search || search.cat_id)
                      ) {
                        var params = new URLSearchParams([
                          ["search", search.search],
                          ["cat_id", search.cat_id],
                        ]);

                        router.push(`/shop?${params}`);
                      }
                    }}
                    onBlur={(e) => {
                      if (search.search || search.cat_id) {
                        setTimeout(() => {
                          setProducts([]);
                        }, 500);
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
                        <Link prefetch={true} href={`/details/${p.slug}`}>
                          <div className="search-result">
                            <img src={p.thumbnail_image} alt="" />
                            <p>{p.name}</p>
                          </div>
                        </Link>
                      );
                    })}
                </div>
                <div className="dropdown-box">
                  <select
                    className="form-select form-contol"
                    aria-label="Default select example"
                    onChange={(e) =>
                      setSearch({ ...search, cat_id: e.target.value })
                    }
                  >
                    <option value="">categories</option>
                    {Array.isArray(categories) ? (
                      categories
                        .slice() // Create a shallow copy of the array to avoid mutation
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(({ name, id }) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))
                    ) : (
                      <option value="">No categories available</option>
                    )}
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
                    <i className="icofont-search"></i>
                  </button>
                </div>
              </div>

              {showSearch && (
                <div className="mobile-search">
                  <div className="float-search">
                    <div className="search-box mb-2">
                      <input
                        type="search"
                        className="form-control search-input"
                        placeholder="Search"
                        onChange={(e) =>
                          setSearch({ ...search, search: e.target.value })
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
                            <Link prefetch={true} href={`/details/${p.slug}`}>
                              <div className="search-result">
                                <img src={p.thumbnail_image} alt="" />
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
                          setSearch({ ...search, cat_id: e.target.value })
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
                  className="btn mobile-search-btn"
                  onClick={() => handeShowSearch()}
                >
                  {showSearch ? (
                    <i className="fa-solid fa-times"></i>
                  ) : (
                    <i className="fa-solid fa-magnifying-glass"></i>
                  )}
                </button>
              )}

              {/* <button type="button" className="btn search-btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button> */}
            </div>
            <div className="col-xs-6 col-sm-6 col-md-6 col-lg-2">
              <div className="support-icon-flex">
                <div className="icon">
                  <i className="icofont-ui-call"></i>
                </div>
                <div className="text">
                  <p>call us now</p>

                  {getSettingValue(settings, "helpline_number")?.split(",")?.map((item, index) => <h5>{item}</h5>)}
                </div>
              </div>
            </div>

            <CartWishAccount />
          </div>
        </div>
      </section>

      <div
        className="modal fade search-modal d-none"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="text-center">Search Box</h4>
            </div>
            <div className="modal-body">
              <div className="search-box-flex">
                <div className="mb-3">
                  <div className="search-box">
                    <input
                      type="search"
                      className="form-control search-input"
                      placeholder="Search"
                      onChange={(e) =>
                        setSearch({ ...search, search: e.target.value })
                      }
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
                    {products && products.length > 0 ? (
                      products?.map((p) => {
                        return (
                          <Link prefetch={true} href={`/details/${p.id}`}>
                            <div className="search-result">
                              <img src={p.thumbnail_image} alt="" />
                              <p>{p.name}</p>
                            </div>
                          </Link>
                        );
                      })
                    ) : (
                      <h5>No Product Found</h5>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="dropdown-box">
                    <select
                      className="form-select form-contol"
                      aria-label="Default select example"
                      onChange={(e) =>
                        setSearch({ ...search, cat_id: e.target.value })
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
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="search-btn-box">
                <button className="btn search-btn" onClick={fetchSearchData}>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MiddleNav;
