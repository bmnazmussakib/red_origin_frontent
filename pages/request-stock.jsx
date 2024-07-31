import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
let Loader = dynamic(() => import("../components/common/Loader.jsx"), {
  ssr: false,
});
let RequestStockList = dynamic(
  () => import("../components/request-stock/RequestStockList.jsx"),
  {
    ssr: false,
    loading: () => (
      <p>
        {/* <Loader /> */}
        ""
      </p>
    ),
  }
);
let ProfileSidebar = dynamic(
  () => import("../components/common/ProfileSidebar.jsx"),
  {
    ssr: false,
    loading: () => <div></div>,
  }
);
const RequestStock = () => {
  return (
    <>
      <section className="breadcrum-main mb-0">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link prefetch={true} href="/">
                      Home
                    </Link>
                  </li>

                  <li className="breadcrumb-item">
                    <a disabled>profile </a>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>
      <section className="userprofile-main">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
              <ProfileSidebar />
            </div>
            <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
              <RequestStockList />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

RequestStock.protected = true;
export default RequestStock;
