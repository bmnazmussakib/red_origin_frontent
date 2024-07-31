// pages/maintenance.js
import Head from 'next/head';
import Image from 'next/image'

const MaintenancePage = () => {
  return (
    <>
      <Head>
        <title>Under Maintenance | {process.env.NEXT_PUBLIC_APP_NAME}</title>
      </Head>
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="text-center">
          <img src="/assets/images/construction.png" alt="Maintenance Image" className="img-fluid mb-4" width={550} />
         
          <h1 className="display-4">Under Maintenance</h1>
          <p className="lead">Sorry, the website is currently undergoing maintenance. Please check back later.</p>
        </div>
      </div>
    </>
  );
};

export default MaintenancePage;
