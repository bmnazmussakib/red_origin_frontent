import React, {useEffect, useState} from 'react';
import { getSettingValue } from '../../utils/filters';
import {useDispatch, useSelector} from "react-redux";
import {get, tAlert} from "../../helpers/helper";
import {common} from "../../utils/route";
import {addToGlobalSetting} from "../../store/slice/GlobalSetting";

const FacebookPixel = () => {
    let settings = useSelector((state) => state.globalSetting.globalsetting);

    let [FBPixel, setFBPixel] = useState("");
    const dispatch = useDispatch();

    const fetchBusinessSettings = async () => {

            if (getSettingValue(settings, "facebook_pixel_id") == undefined) {
                let { data, status } = await get(common.BSETTING);
                console.log("dfdfdf",data)
                if (status === 200) {
                    dispatch(addToGlobalSetting({ business_settings: data?.data ?? [] }));
                    setFBPixel(getSettingValue(data?.data, "facebook_pixel_id"))
                } else {
                    tAlert("Something went wrong");
                }
            }
            else {
                setFBPixel(getSettingValue(settings, "facebook_pixel_id"))

            }

    };
    useEffect(() => {
        if (getSettingValue(settings, "facebook_pixel_id") == undefined) {
            fetchBusinessSettings()
        }
    }, []);







    return (
        <>
            {/* Facebook Pixel Code */}
            {getSettingValue(settings, "facebook_pixel") == 1 && (
                <>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement('script');t.async=!0;
                    t.src=v;s=b.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '${getSettingValue(settings, "facebook_pixel_id")}');
                    fbq('track', 'PageView');
                `,
                        }}
                    />
                    <noscript><img height="1" width="1" style={{display:"none"}}
                                   src={`https://www.facebook.com/tr?id=${getSettingValue(settings, "facebook_pixel_id")}&ev=PageView&noscript=1`}
                    /></noscript>
                </>
            )}

            {/* End Facebook Pixel Code */}
        </>
    );
};

export default FacebookPixel;
