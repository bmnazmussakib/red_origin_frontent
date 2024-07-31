import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { getToken, tAlert } from "../helpers/helper";
import Loader from "../components/common/Loader";
import { useSelector } from "react-redux";
const ProtectedLayout = ({ children }) => {
  let [loader, setLoader] = React.useState(true);
  let authSlice = useSelector((state) => state.authSlice);
  let router = useRouter();

  useEffect(() => {
    if (authSlice?.user === null && authSlice?.tempId) {
      tAlert("You are not authorized to access this page", "info");
      router.replace("/");
    } else {
      setLoader(false);
    }
  }, []);
  return <>
    {
      loader ? 
      // <Loader /> 
      ""
      : children
    }
  </>;
};

export default ProtectedLayout;
