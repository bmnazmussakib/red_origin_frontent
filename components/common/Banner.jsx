import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSettingValue } from "../../utils/filters";
import Link from "next/link";
import { get } from "../../helpers/helper";
import { useRouter } from "next/router";
// import ReactImageMagnify from "react-image-magnify";

const Banner = ({ type, setCategoryInfo = null }) => {
  let [bannerLink, setBannerLink] = useState();
  let { query } = useRouter();
  let settings = useSelector((state) => state.globalSetting.globalsetting);

  let fetchImageLink = async () => {
    if (!type) return false;
    if (type != "common") {
      if (query?.cat_id) {
        let { data, status } = await get(
          "/v2/categories?category_id=" + query?.cat_id
        ).catch((err) => {
          //console.log(err);
        });
        if (status == 200 && data?.data) {
          if (setCategoryInfo) {
            setCategoryInfo(data?.data);
          }
          setBannerLink(data?.data?.banner);
        }
        return false;
      } else if (query?.category_slug) {
        let { data, status } = await get(
          "/v2/categories?category_slug=" + query?.category_slug
        ).catch((err) => {
          //console.log(err);
        });
        if (status == 200 && data?.data) {
          if (setCategoryInfo) {
            setCategoryInfo(data?.data);
          }
          setBannerLink(data?.data?.banner);
        }
        return false;
      } else if (query?.id) {
        let { data, status } = await get(
          "/v2/categories?category_slug=" + query?.id
        ).catch((err) => {
          //console.log(err);
        });
        if (status == 200 && data?.data) {
          if (setCategoryInfo) {
            setCategoryInfo(data?.data);
          }
          setBannerLink(data?.data?.banner);
        }
        return false;
      }
      if (getSettingValue(settings, type)) {
        let { data, status } = await get(
          "/v2/image-link/" + getSettingValue(settings, type)
        ).catch((err) => {
          //console.log(err);
        });
        if (status == 200) {
          setBannerLink(data?.data);
        }
        return false;
      }
    }
  };

  const {id} = query;
  useEffect(() => {
    fetchImageLink();
  }, [getSettingValue(settings, type), id]);

  return (
    <>
      {bannerLink &&
        bannerLink !=
          "https://backend.rise-brand.com/assets/img/thimnail.jpg" && 
          (<section
            className="common-banner-main"
            style={
              bannerLink && {
                // background: `url(${bannerLink}) `,
                background: `url('/assets/images/red-origin/banner/category-banner.jfif') `,
              }
            }
          >
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <h2 className="">Summer Sale</h2>
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
        )}
    </>
  );
};

export default Banner;
