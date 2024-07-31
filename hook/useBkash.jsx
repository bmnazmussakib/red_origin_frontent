import axios from "axios";
import React from "react";

const useBkash = () => {
  const init = ({}) => {};
  const startPayment = ({
    payAmount,
    paymentType,
    token,
    checkOutUrl,
    executeUrl,
    onSuccess = (data) => {},
    onError = (err) => {},
    intent = "sale",
  }) => {
    var paymentID = "";
    bKash.init({
      paymentMode: "checkout", //fixed value ‘checkout’
      //paymentRequest format: {amount: AMOUNT, intent: INTENT}
      //intent options
      //1) ‘sale’ – immediate transaction (2 API calls)
      //2) ‘authorization’ – deferred transaction (3 API calls)
      paymentRequest: {
        amount: payAmount, //max two decimal points allowed
        intent: intent, //fixed value ‘sale’
      },
      createRequest: function (request) {
        //request object is basically the paymentRequest object, automatically pushed by the script in createRequest method
        axios
          .post(`${checkOutUrl}/${token}/${payAmount}`)
          .then((res) => {
            const data = res.data;
            if (data.paymentID == null) {
              bKash.create().onError();
              onerror("Payment ID is null");
              return false;
            }
            paymentID = data.paymentID;

            bKash.create().onSuccess(data);
          })
          .catch((err) => {
            bKash.create().onError();
            onError(err);
            return false;
          });
      },
      executeRequestOnAuthorization: function () {
        axios
          .post(`${executeUrl}/${token}`, {
            paymentID: paymentID,
          })
          .then(({ data, status }) => {
            if (data && data.paymentID != null) {
              onSuccess(data);
              return data;
            } else {
              bKash.execute().onError();
              onError(err);
              return false;
            }
          })
          .catch((err) => {
            bKash.execute().onError();
            onError(err);
            return false;
          });
      },
    });
    document.getElementById("bKash_button").click();
  };
  return {
    init,
    startPayment,
  };
};

export default useBkash;
