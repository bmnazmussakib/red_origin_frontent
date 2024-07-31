import React, { useEffect } from 'react';
import { getSettingValue } from '../../utils/filters';
import { useSelector } from "react-redux";

const FacebookPixel = () => {
    const settings = useSelector((state) => {
        return state.globalSetting.globalsetting;
    });

    console.log("facebook_pixel_id",getSettingValue(settings, "facebook_pixel_id"))

    useEffect(() => {

        // Initialize Facebook Pixel
        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement('script');
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(t, s)
        }(window, document, 'script','https://connect.facebook.net/en_US/fbevents.js');

        // Track page view
        fbq('init', getSettingValue(settings, "facebook_pixel_id"));
        fbq('track', 'PageView');


        // Cleanup on unmount
        return () => {
            // Implement any cleanup logic if necessary
        };
    }, []);

    return (
        <>
            <noscript><img height="1" width="1" style={{display:"none"}}
                           src={`https://www.facebook.com/tr?id=${getSettingValue(settings, "facebook_pixel_id")}&ev=PageView&noscript=1`}
            /></noscript>
        </>
    );
};

export default FacebookPixel;