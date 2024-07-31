import React from 'react';
import { useSelector } from 'react-redux';
import { getSettingValue } from '../../utils/filters';

function TopHeader() {
  let settings = useSelector((state) => state.globalSetting.globalsetting);

  return (
    <>
      {getSettingValue(settings, 'topbar_text') && (
        <section
          className="top-header"
          style={{
            background: getSettingValue(settings, 'topbar_background'),
          }}
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col-12 text-center">
                <h3>
                  <a href="" target="_blank">
                    <span>{getSettingValue(settings, 'topbar_text')}</span>
                  </a>
                </h3>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default TopHeader;
