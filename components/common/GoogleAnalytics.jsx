import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getSettingValue } from '../../utils/filters';
import Head from "next/head";

const GoogleAnalytics = () => {

    const settings = useSelector((state) => {
        return state.globalSetting.globalsetting;
    });

    useEffect(() => {
        // Initialize Google Analytics
        function initializeGA() {
            window.dataLayer = window.dataLayer || [];
            function gtag() {
                dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', getSettingValue(settings, "google_analytics"));
        }


        // Load Google Tag Manager script asynchronously
        function loadGTMScript() {
            const script = document.createElement('script');
            script.src = `https://www.googletagmanager.com/gtag/js?id=${getSettingValue(settings, "google_analytics")}`
            script.async = true;
            document.body.appendChild(script);
        }

        // Call functions to initialize GA and load GTM script
        initializeGA();
        loadGTMScript();

        // Cleanup on unmount
        return () => {
            // Implement any cleanup logic if necessary
        };
    }, []); // Empty dependency array ensures that this effect runs only once

    return (
        <>
            <Head>
                <script async src={`https://www.googletagmanager.com/gtag/js?id=${getSettingValue(settings, "google_analytics")}`}></script>
            </Head>
        </>
    ); // Since this component is for side-effects only, return null
};

export default GoogleAnalytics;