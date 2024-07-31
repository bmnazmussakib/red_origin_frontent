import axios from "axios";
import React, { useCallback, useEffect, useRef } from "react";
import { useBkash } from "react-bkash";
import { getToken } from "../../helpers/helper";

const BkashComponent = ({ paymentInfo }) => {
  let bkashButton = useRef(null);
  const { error, loading, triggerBkash } = useBkash({
    onSuccess: (data) => {
      console.log(data + "prantho"); // this contains data from api response from onExecutePayment
    },
    onClose: () => {
      console.log("Bkash iFrame closed");
    },
    bkashScriptURL:
      "https://scripts.sandbox.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout-sandbox.js", // https://scripts.sandbox.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout-sandbox.js
    amount: paymentInfo?.amount,
    onCreatePayment: async (paymentRequest) => {
      // call your API with the payment request here
      return await fetch(
        `http://sailorback-env.eba-xhy5mgrh.ap-southeast-1.elasticbeanstalk.com/api/v2/bkash/api/checkout/${paymentInfo?.token}/${paymentInfo?.amount}`,
        {
          method: "POST",
          body: JSON.stringify(paymentRequest),
        }
      ).then((res) => res.json());

      // must return the following object:
      // {
      // 	paymentID: string;
      // 	createTime: string;
      // 	orgLogo: string;
      // 	orgName: string;
      // 	transactionStatus: string;
      // 	amount: string;
      // 	currency: string;
      // 	intent: string;
      // 	merchantInvoiceNumber: string;
      // }
    },
    onExecutePayment: async (paymentID) => {
      // call your executePayment API here
      return await fetch(
        `http://sailorback-env.eba-xhy5mgrh.ap-southeast-1.elasticbeanstalk.com/api/v2/bkash/api/execute/${paymentInfo?.token}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        }
      ).then((res) => res.json());

      // it doesn't matter what you return here, any errors thrown here will be available on error return value of the useBkash hook
    },
  });

  useEffect(() => {
    // console.log("==========================================================");
    // console.log(paymentInfo);
    // console.log("==========================================================");
    if (paymentInfo?.token) {
      triggerBkashCustom()
    }
  }, [paymentInfo.token]);

  function triggerBkashCustom() {
    if (triggerBkash()) {
      triggerBkash()
    }
  }
  return (
    <>
      {paymentInfo?.token && (
        <button id="bkash" onClick={() => triggerBkash()}>
          pay now
        </button>
      )}
    </>
  );
};

export default BkashComponent;
