import Image from "next/image";
import React from "react";
import { useEffect } from "react";
const blogDetails = () => {
  useEffect(() => {
    document
      .querySelector(".comment-reply-toggle")
      .addEventListener("click", function () {
        document.querySelector(".comment-reply-card").toggleClass("d-none");
      });
  }, []);

  return (
    <>
      <section className=" common-banner-main d-none">
        <div className=" container">
          <div className=" row">
            <div className=" col-12">
              <h4>blogs</h4>
            </div>
          </div>
        </div>
        <section className=" breadcrum-main mb-0">
          <div className=" container">
            <div className=" row">
              <div className=" col-12">
                <nav aria-label="breadcrumb">
                  <ol className=" breadcrumb">
                    <li className=" breadcrumb-item">
                      <a href="#">Home</a>
                    </li>

                    <li className=" breadcrumb-item">
                      <a disabled="">blogs </a>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </section>
      </section>
      <section className="blog-main">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
              <div className="blogdetails-main">
                <div className="single-post">
                  <div className="meta news-post-meta">
                    <ul className="p-0">
                      <li className="news-post-date">10 August 2022</li>
                      <li className="news-post-author">
                        <a href="#">admin</a>
                      </li>
                    </ul>
                  </div>
                  <div className="news-post-title">
                    <h4 className="news-title">
                      How To Get People To Like Industry
                    </h4>
                  </div>
                  <div className="news-post-image">
                    <img
                      src="/assets/images/bd.jpg"
                      className="img-fluid"
                      alt=""
                    />
                  </div>
                  <div className="news-post-text">
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Veniam corporis facilis similique asperiores error fuga
                      nulla amet, dicta provident praesentium quod officiis eum
                      vero ab aperiam ex dolores nostrum sed obcaecati saepe!
                      Aut fugiat nihil corrupti provident asperiores, porro
                      aperiam totam ducimus debitis repellendus dignissimos!
                      Illo voluptate tempora, numquam, perferendis quibusdam
                      enim voluptas quasi ipsum quas tempore ducimus quis!
                      Itaque sequi pariatur, nostrum voluptatibus molestias vero
                      laboriosam fugiat explicabo reprehenderit, mollitia
                      facilis sit suscipit, vitae magni possimus architecto
                      minus ut deserunt debitis veritatis? Doloribus
                      consequuntur cum repellat quo itaque minima assumenda
                      optio id, temporibus quam ipsa nihil quas. Magnam a
                      mollitia temporibus labore exercitationem, numquam harum
                      molestiae incidunt architecto at laudantium provident ad
                      doloremque aliquam similique odit. Porro, fuga cupiditate.
                      Illum dignissimos mollitia aspernatur? Amet soluta, itaque
                      molestiae vero doloribus quaerat explicabo quod vel atque
                      mollitia ratione ipsam inventore magnam ab quae est labore
                      quibusdam, omnis eligendi vitae dignissimos corrupti!
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Esse vitae modi repudiandae reiciendis cupiditate suscipit
                      natus reprehenderit nesciunt ullam pariatur, velit eveniet
                      quos, perspiciatis voluptate omnis. Veritatis vel nam
                      expedita amet quis est fugiat necessitatibus.
                    </p>
                    <blockquote>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Has been the industry's standard
                      text ever since the 1500s, when an unknown printer took a
                      galley of type and scrambled it to make a type
                      specimencenturies.
                    </blockquote>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Molestiae maxime odit eligendi magnam deserunt sapiente,
                      nulla nobis ullam iusto sit, quia veniam? Fuga consectetur
                      hic reprehenderit explicabo autem quas fugiat iusto sed ab
                      quaerat? Cumque natus tempore modi aliquam voluptas.
                    </p>
                  </div>
                  <div className="news-post-tags">
                    <ul className="nav justify-content-start">
                      <li className="nav-item news-tag">
                        <a className="nav-link" href="#">
                          child
                        </a>
                      </li>
                      <li className="nav-item news-tag">
                        <a className="nav-link" href="#">
                          education
                        </a>
                      </li>
                      <li className="nav-item news-tag">
                        <a className="nav-link" href="#">
                          money
                        </a>
                      </li>
                      <li className="nav-item news-tag">
                        <a className="nav-link" href="#">
                          restaurant
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="comment-section">
                  <div className="comment-title">
                    <h4>8 comments</h4>
                  </div>
                  <div className="comments-wrapper">
                    <ul className="comment-list p-0">
                      <li className="comment">
                        <div className="row g-0">
                          <div className="col-2">
                            <div className="user-img">
                              <img
                                src="/assets/images/user.jpg"
                                className="rounded-circle"
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="col-10">
                            <div className="comment-card">
                              <h5 className="comment-title">Oliver</h5>
                              <div className="comment-meta d-flex justify-content-between">
                                <div className="date-time">
                                  <span>
                                    <i className="fa-solid fa-calendar"></i>{" "}
                                    October 6, 2015 At 7:15 am
                                  </span>
                                </div>
                                <div className="reply">
                                  <a
                                    href="javascript:void(0);"
                                    className="comment-reply-toggle"
                                  >
                                    <i className="fa-solid fa-share"></i> Reply
                                  </a>
                                </div>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Minus adipisci, totam
                                praesentium sint qui doloremque repellendus,
                                eum, autem ipsum et quidem tempore asperiores
                                mollitia sit in voluptates neque necessitatibus
                                cumque.
                              </p>
                            </div>
                            <div className="comment-reply-card d-none">
                              <textarea
                                className="form-control"
                                placeholder="Leave a comment here"
                                id=""
                              ></textarea>
                              <div className="w-100 text-end">
                                <button className="btn comment-reply-btn">
                                  post
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <ul className="children comment-list p-0">
                          <li className="comment">
                            <div className="row g-0">
                              <div className="col-2">
                                <div className="user-img">
                                  <img
                                    src="/assets/images/user.jpg"
                                    className="rounded-circle"
                                    alt=""
                                  />
                                </div>
                              </div>
                              <div className="col-10">
                                <div className="comment-card">
                                  <h5 className="comment-title">Oliver</h5>
                                  <div className="comment-meta d-flex justify-content-between">
                                    <div className="date-time">
                                      <span>
                                        <i className="fa-solid fa-calendar"></i>
                                        October 6, 2015 At 7:15 am
                                      </span>
                                    </div>
                                    <div className="reply">
                                      <button>
                                        <i className="fa-solid fa-share"></i>{" "}
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                  <p>
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Minus adipisci, totam
                                    praesentium sint qui doloremque repellendus,
                                    eum, autem ipsum et quidem tempore
                                    asperiores mollitia sit in voluptates neque
                                    necessitatibus cumque.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <ul className="children comment-list p-0">
                              <li className="comment">
                                <div className="row g-0">
                                  <div className="col-2">
                                    <div className="user-img">
                                      <img
                                        src="/assets/images/user.jpg"
                                        className="rounded-circle"
                                        alt=""
                                      />
                                    </div>
                                  </div>
                                  <div className="col-10">
                                    <div className="comment-card">
                                      <h5 className="comment-title">Oliver</h5>
                                      <div className="comment-meta d-flex justify-content-between">
                                        <div className="date-time">
                                          <span>
                                            <i className="fa-solid fa-calendar"></i>
                                            October 6, 2015 At 7:15 am
                                          </span>
                                        </div>
                                        <div className="reply">
                                          <button>
                                            <i className="fa-solid fa-share"></i>{" "}
                                            Reply
                                          </button>
                                        </div>
                                      </div>
                                      <p>
                                        Lorem ipsum dolor sit amet consectetur
                                        adipisicing elit. Minus adipisci, totam
                                        praesentium sint qui doloremque
                                        repellendus, eum, autem ipsum et quidem
                                        tempore asperiores mollitia sit in
                                        voluptates neque necessitatibus cumque.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>
                    <ul className="comment-list p-0">
                      <li className="comment">
                        <div className="row g-0">
                          <div className="col-2">
                            <div className="user-img">
                              <img
                                src="/assets/images/user.jpg"
                                className="rounded-circle"
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="col-10">
                            <div className="comment-card">
                              <h5 className="comment-title">Oliver</h5>
                              <div className="comment-meta d-flex justify-content-between">
                                <div className="date-time">
                                  <span>
                                    <i className="fa-solid fa-calendar"></i>{" "}
                                    October 6, 2015 At 7:15 am
                                  </span>
                                </div>
                                <div className="reply">
                                  <button>
                                    <i className="fa-solid fa-share"></i> Reply
                                  </button>
                                </div>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Minus adipisci, totam
                                praesentium sint qui doloremque repellendus,
                                eum, autem ipsum et quidem tempore asperiores
                                mollitia sit in voluptates neque necessitatibus
                                cumque.
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <ul className="comment-list p-0">
                      <li className="comment">
                        <div className="row g-0">
                          <div className="col-2">
                            <div className="user-img">
                              <img
                                src="/assets/images/user.jpg"
                                className="rounded-circle"
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="col-10">
                            <div className="comment-card">
                              <h5 className="comment-title">Oliver</h5>
                              <div className="comment-meta d-flex justify-content-between">
                                <div className="date-time">
                                  <span>
                                    <i className="fa-solid fa-calendar"></i>{" "}
                                    October 6, 2015 At 7:15 am
                                  </span>
                                </div>
                                <div className="reply">
                                  <button>
                                    <i className="fa-solid fa-share"></i> Reply
                                  </button>
                                </div>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Minus adipisci, totam
                                praesentium sint qui doloremque repellendus,
                                eum, autem ipsum et quidem tempore asperiores
                                mollitia sit in voluptates neque necessitatibus
                                cumque.
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <ul className="comment-list p-0">
                      <li className="comment">
                        <div className="row g-0">
                          <div className="col-2">
                            <div className="user-img">
                              <img
                                src="/assets/images/user.jpg"
                                className="rounded-circle"
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="col-10">
                            <div className="comment-card">
                              <h5 className="comment-title">Oliver</h5>
                              <div className="comment-meta d-flex justify-content-between">
                                <div className="date-time">
                                  <span>
                                    <i className="fa-solid fa-calendar"></i>{" "}
                                    October 6, 2015 At 7:15 am
                                  </span>
                                </div>
                                <div className="reply">
                                  <button>
                                    <i className="fa-solid fa-share"></i> Reply
                                  </button>
                                </div>
                              </div>
                              <p>
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Minus adipisci, totam
                                praesentium sint qui doloremque repellendus,
                                eum, autem ipsum et quidem tempore asperiores
                                mollitia sit in voluptates neque necessitatibus
                                cumque.
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="post-comment">
                    <form className="">
                      <h5 className="form-title">LEAVE A REPLY</h5>
                      <div className="row g-3">
                        <div className="col-4">
                          <div className="input-group">
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              <i className="fa-solid fa-user"></i>
                            </span>

                            <input
                              type="text"
                              className="form-control"
                              placeholder="Author"
                              aria-label="Author"
                              aria-describedby="basic-addon1"
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="input-group">
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              <i className="fa-solid fa-envelope"></i>
                            </span>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Email"
                              aria-label="Email"
                              aria-describedby="basic-addon1"
                            />
                          </div>
                        </div>
                        <div className="col-4">
                          <div className="input-group">
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              <i className="fa-solid fa-globe"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="URL"
                              aria-label="URL"
                              aria-describedby="basic-addon1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-12">
                          <div className="input-group">
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              <i className="fa-solid fa-message"></i>
                            </span>
                            <textarea
                              className="form-control"
                              id="exampleFormControlTextarea1"
                              rows="6"
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      <button className="">post comment</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
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
                        <Image
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
          </div>
        </div>
      </section>
    </>
  );
};

export default blogDetails;
