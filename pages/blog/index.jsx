import React, { useEffect } from "react";
import { get } from "../../helpers/helper";
import mainStore from "../../store";
import Link from "next/link";
import Banner from "../../components/common/Banner";
const blogIndex = ({ blogs }) => {
  return (
    <>
      <Banner type="common" />

      <section className="blog-main">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
              <div className="sidebar-single-box category-block">
                <div className="title-block">
                  <span>categories</span>
                </div>
                <div className="block-content">
                  <ul className=" nav flex-column">
                    <li className=" nav-item">
                      <a className=" nav-link" href="#">
                        Computer & Networking
                      </a>
                    </li>
                    <li className=" nav-item">
                      <a className=" nav-link" href="#">
                        laptop & accessories
                      </a>
                    </li>
                    <li className=" nav-item">
                      <a className=" nav-link" href="#">
                        smartphone & tablet
                      </a>
                    </li>
                    <li className=" nav-item">
                      <a className=" nav-link" href="#">
                        home appliance
                      </a>
                    </li>
                    <li className=" nav-item">
                      <a className=" nav-link" href="#">
                        camera & photo
                      </a>
                    </li>
                    <li className=" nav-item">
                      <a className=" nav-link" href="#">
                        Computer & Networking
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="sidebar-single-box recent-post-block">
                <div className="title-block">
                  <span>recent post </span>
                </div>
                <div className="block-content">
                  <div className="single-post-flex">
                    <div className="post-image">
                      <a href="">
                        <img
                          src="/assets/images/blog/blog-6_250x.webp"
                          alt=""
                        />
                      </a>
                    </div>
                    <div className="post-item">
                      <div className="post-title">
                        <a href="">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod{" "}
                        </a>
                      </div>
                      <div className="post-info">
                        <span className="post-date">
                          <i className="icofont-calendar"></i> 06 feb 2023
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="single-post-flex">
                    <div className="post-image">
                      <a href="">
                        <img
                          src="/assets/images/blog/blog-6_250x.webp"
                          alt=""
                        />
                      </a>
                    </div>
                    <div className="post-item">
                      <div className="post-title">
                        <a href="">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod{" "}
                        </a>
                      </div>
                      <div className="post-info">
                        <span className="post-date">
                          <i className="icofont-calendar"></i> 06 feb 2023
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="single-post-flex">
                    <div className="post-image">
                      <a href="">
                        <img
                          src="/assets/images/blog/blog-6_250x.webp"
                          alt=""
                        />
                      </a>
                    </div>
                    <div className="post-item">
                      <div className="post-title">
                        <a href="">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod{" "}
                        </a>
                      </div>
                      <div className="post-info">
                        <span className="post-date">
                          <i className="icofont-calendar"></i> 06 feb 2023
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="single-post-flex">
                    <div className="post-image">
                      <a href="">
                        <img
                          src="/assets/images/blog/blog-6_250x.webp"
                          alt=""
                        />
                      </a>
                    </div>
                    <div className="post-item">
                      <div className="post-title">
                        <a href="">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod{" "}
                        </a>
                      </div>
                      <div className="post-info">
                        <span className="post-date">
                          <i className="icofont-calendar"></i> 06 feb 2023
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sidebar-single-box tags-block">
                <div className="title-block">
                  <span>blog tags </span>
                </div>
                <div className="block-content">
                  <ul className="nav">
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        clothing
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        hot trend
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        jewelary
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        party
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        samsung
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        shirt dresses
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
              {blogs &&
                blogs?.map((blog, index) => {
                  return (
                    <div className="single-blog">
                      <div className="card">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                              <img src={blog?.banner} alt="" />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
                              <div className="content-box">
                                <div className="blog-header">
                                  <h4>
                                    <Link
                                      prefetch={true}
                                      href={"/blog/" + blog?.id}
                                    >
                                      {blog?.title}
                                    </Link>
                                  </h4>
                                  <ul className="nav">
                                    <li className="nav-item">
                                      <a className="nav-link" href="#">
                                        <i className="icofont-calendar"></i> 6
                                        feb 2023
                                      </a>
                                    </li>
                                    <li className="nav-item">
                                      <a className="nav-link" href="#">
                                        <i className="fa-solid fa-user"></i>{" "}
                                        admin
                                      </a>
                                    </li>
                                  </ul>
                                  <div className="blog-short-desc">
                                    <p>{blog?.description}</p>
                                  </div>
                                  <Link
                                    prefetch={true}
                                    href={"/blog/" + blog?.id}
                                    className="view-blog-details"
                                  >
                                    read more
                                  </Link>
                                </div>
                              </div>
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
      </section>
    </>
  );
};

export const getServerSideProps = mainStore.getServerSideProps(
  (store) =>
    async ({ query, req }) => {
      try {
        const { data } = await get(`/blog`);
        console.log(data);
        return {
          props: {
            blogs: data?.data,
          },
        };
      } catch (error) {
        return {
          props: {
            blogs: [],
          },
          notFound: true,
        };
      }
    }
);

export default blogIndex;
