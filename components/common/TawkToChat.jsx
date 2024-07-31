import React, { useEffect } from 'react';
import { getSettingValue } from '../../utils/filters';
import { useSelector } from "react-redux";

const TawkToChat = () => {

  const settings = useSelector((state) => {
    return state.globalSetting.globalsetting;
  });

  useEffect(() => {
    const loadScript = () => {
      // Create a script element
      const script = document.createElement('script');
      script.src = getSettingValue(settings, "tawk_id");
      // script.src = 'https://embed.tawk.to/646a01d2ad80445890ee32ca/1h0v1e7qq';
      script.async = true;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');

      // Append the script to the document body
      document.body.appendChild(script);

      // Cleanup function to remove the script on component unmount
      return () => (
        <>
          {
            
            document.body.removeChild(script)
          }
        </>
      );
    };

    {getSettingValue(settings, "tawk_to_status") == 1 && loadScript()}

    
  }, []);

  return null; // Since this component is for side-effects only, return null
};

export default TawkToChat;
