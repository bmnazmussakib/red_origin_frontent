import Link from "next/link";
import { useRouter } from "next/router.js";
import React, { useState, useEffect } from "react";
import { cookie, get, tAlert } from "../../../helpers/helper.js";
import NestedCategory from "./micro/NestedCategory.jsx";

function FinalNav({ categories }) {
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

  return (
    <section
      className={scrollTop > 100 ? `final-nav fix-finalNav` : `final-nav `}
    >
      {/* <section className="final-nav"> */}
      <nav className="navbar navbar-expand-lg ">
        <div className="container">
          <div
            className="offcanvas offcanvas-start"
            data-bs-scroll="true"
            tabIndex="-1"
            id="offcanvasWithBothOptions"
            aria-labelledby="offcanvasWithBothOptionsLabel"
          >
            <ul className="navbar-nav show-lg">
              {/* <li className="nav-item active">
                <Link prefetch={true} className="nav-link" href="?cat_id=">
                  Crazy Deals
                </Link>
              </li> */}
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

              {/* <li className="nav-item">
                <Link prefetch={true} className="nav-link special" href="#">
                  special offer
                </Link>
              </li> */}
              <li className="nav-item d-xl-none d-lg-none d-md-block d-sm-block d-xs-block">
                <Link prefetch={true} className="nav-link" href="?cat_id=">
                  About Us
                </Link>
              </li>
              <li className="nav-item d-xl-none d-lg-none d-md-block d-sm-block d-xs-block">
                <Link prefetch={true} className="nav-link" href="/blog">
                  Blog
                </Link>
              </li>
            </ul>

            <div className="MobileMenu-main">
              <div class="accordion accordion-flush" id="accordionFlushExample">
                {categories?.map((item, key) => {
                  return (
                    <div class="accordion-item">
                      <h2
                        class="accordion-header"
                        id={"flush-heading" + item?.id}
                      >
                        <button
                          class="accordion-button collapsed"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={"#flush-collapse" + item?.id}
                          aria-expanded="false"
                          aria-controls={"flush-collapse" + item?.id}
                        >
                          <Link
                            prefetch={true}
                            href={"/category/" + item?.slug ?? "#"}
                          >
                            {item?.name}
                          </Link>
                        </button>
                      </h2>
                      <div
                        id={"flush-collapse" + item?.id}
                        class="accordion-collapse collapse"
                        aria-labelledby={"flush-heading" + item?.id}
                        data-bs-parent="#accordionFlushExample"
                      >
                        <div class="accordion-body">
                          <div
                            class="accordion accordion-flush"
                            id={"accordionFlushExample" + item?.id}
                          >
                            {item?.megamenucategories?.map((cat, key) => {
                              return (
                                <div class="accordion-item">
                                  <h2
                                    class="accordion-header"
                                    id={"flush-headingOne" + cat?.id}
                                  >
                                    <button
                                      class="accordion-button collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target={
                                        "#flush-collapseOne" + cat?.id
                                      }
                                      aria-expanded="false"
                                      aria-controls={
                                        "flush-collapseOne" + cat?.id
                                      }
                                    >
                                      <Link
                                        prefetch={true}
                                        href={"/category/" + cat?.slug ?? "#"}
                                      >
                                        {cat?.name}
                                      </Link>
                                    </button>
                                  </h2>
                                  <div
                                    id={"flush-collapseOne" + cat?.id}
                                    class="accordion-collapse collapse"
                                    aria-labelledby={
                                      "flush-headingOne" + cat?.id
                                    }
                                    data-bs-parent={
                                      "#accordionFlushExample" + item?.id
                                    }
                                  >
                                    <div class="accordion-body">
                                      {cat?.megamenucategories?.map(
                                        (subcat, key) => {
                                          return (
                                            <Link
                                              prefetch={true}
                                              href={
                                                "/category/" + subcat?.slug ??
                                                "#"
                                              }
                                              className="child-name"
                                            >
                                              {subcat?.name}
                                            </Link>
                                          );
                                        }
                                      )}
                                      <div className="accordion-item">
                                        <p className="accordion-header">
                                          <Link
                                            prefetch={true}
                                            className="child-name"
                                            href={
                                              "/category/" + cat?.slug ?? "#"
                                            }
                                          >
                                            ALL {cat?.name}
                                          </Link>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            <div className="accordion-item">
                              <p className="accordion-header ">
                                <Link
                                  prefetch={true}
                                  className="child-name"
                                  href={"/category/" + item?.slug ?? "#"}
                                >
                                  ALL {item?.name}
                                </Link>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </section>
  );
}

export default FinalNav;
