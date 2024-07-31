import { useRouter } from "next/router";
import React from "react";
import Loader from "../components/common/Loader";

const sku = () => {
  let router = useRouter();
  let { sku } = router.query;
  if (sku) {
    router.push(`/shop?search=${sku}`);
    return false;
  }
  return (
    <>
      {/* <Loader /> */}
      ""
    </>
  );
};

export default sku;
