import React, { useCallback } from "react";
const NagadView = ({ url }) => {
  useCallback(() => {
   window.addEventListener(
     "message",
     function (e) {
       console.log(e.origin); // outputs "http://www.example.com/"
       console.log(e.data.msg); // outputs "works!"
       if (e.origin === "https://example1.com") {
         // do something
       } else if (e.origin === "https://example2.com") {
         // do something else
       }
     },
     false
   );
  }, [url]);
  return (
    <>
      {url && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 99,
            background: "rgba(0,0,0,0.5)",
          }}
        >
          <iframe
            id="nagadIframe"
            onLoad={(e) => {
              let iframe = document.getElementById("nagadIframe");
             
            }}
            width="100%"
            height="100%"
            src={url}
            frameborder="0"
          ></iframe>
        </div>
      )}
    </>
  );
};

export default NagadView;
