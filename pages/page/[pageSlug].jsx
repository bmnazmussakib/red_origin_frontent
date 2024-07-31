import React from "react";
import mainStore from "../../store";
import { get } from "../../helpers/helper";
import Banner from "../../components/common/Banner";
import Image from "next/image";

const Page = ({ pageInfo }) => {
  return (
		<>
			{" "}
			<div className="d-none">
				<img className="img-fluid" src={pageInfo?.image} alt="" />
			</div>
			<div className="solasta-page__gap">
				<div className="container">
					<h2>{pageInfo?.title}</h2>
					<div dangerouslySetInnerHTML={{ __html: pageInfo?.content }} />
				</div>
			</div>
		</>
  );
};

export const getServerSideProps = mainStore.getServerSideProps(
  (store) =>
    async ({ query, req }) => {
      try {
        const { pageSlug, info: pageId } = query;

        const { data, status } = await get(`v2/pages?page_slug=${pageSlug}`).catch(
          (err) => {
            //console.log(err);
          }
        );
        //console.log(data?.data);
        if (status == 200) {
          return {
            props: {
              pageInfo: data?.data[0],
            },
          };
        }
      } catch (error) {
        return {
          props: {},
          notFound: true,
        };
      }
    }
);
export default Page;
