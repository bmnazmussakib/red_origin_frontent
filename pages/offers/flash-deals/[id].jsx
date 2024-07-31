import React from "react";
import mainStore from "../../../store";
import { get, tAlert } from "../../../helpers/helper";
import FlashProduct from "../../../components/common/card/FlashProduct";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import { useState } from "react";

const flashDeal = ({ products, wishLists }) => {
  let router = useRouter();
  let [allProducts, setAllProducts] = useState([]);
  let [page, setPage] = useState(0);
  let [totalPage, setTotalPage] = useState(0);
  let changePagination = async (event) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: event.selected + 1 },
    });
  };
  return (
    <>
      <section className="flash-sale-main">
        <div className="container">
          <div className="row">
            {products?.map((product, index) => {
              return (
                <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                  <FlashProduct
                    key={index}
                    name={product.name}
                    thumbnail_image={product.thumbnail_image}
                    id={product.id}
                    price={product.stroked_price}
                    details={product?.links.details}
                    discount_price={product.main_price}
                    discount={product.discount}
                    sale_percentage={product.sales}
                    wishLists={wishLists}
                    slug={product.slug}
                  />
                </div>
              );
            })}
            {/* <nav
              aria-label="Page navigation comments"
              className="page-pagination"
            >
              <ReactPaginate
                previousLabel="«"
                nextLabel="»"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="page-link"
                pageCount={totalPage}
                onPageChange={changePagination}
                containerClassName="pagination justify-content-center"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                activeClassName="active"
                hrefAllControls
                forcePage={page}
                onClick={(clickEvent) => {
                  window.scrollTo(0, 0);
                }}
              />
            </nav> */}

            <PaginationControl
              page={page + 1}
              between={2}
              total={totalPage}
              limit={1}
              changePage={(page) => {
                // setPage(page)
                console.log('page: ', page);
                changePagination
                window.scrollTo(0, 0);
              }}
              ellipsis={1}
              next={true}
              last={true}
            />
          </div>
        </div>
      </section>
    </>
  );
};
export const getServerSideProps = mainStore.getServerSideProps(
  (store) =>
    async ({ query, req }) => {
      let id = query.id;
      let { data } = await get(`/flash-deal-products/${id}?platform=web`).catch(
        (err) => {
          tAlert("error", err.response.data.message || "Something went wrong");
        }
      );
      try {
        return {
          props: {
            products: data.data,
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
export default flashDeal;
