import React, { useEffect, useState } from "react";
import ProfileSidebar from "../components/common/ProfileSidebar";
import { get, getToken } from "../helpers/helper";
import AddressForm from "../components/addressbook/addressForm";
import { useSelector } from "react-redux";
import AddressList from "../components/addressbook/addressList";
import EditAddressForm from "../components/addressbook/EditAddressForm";
import Link from "next/link";

const AddressBook = () => {
  const user = useSelector((state) => {
    return state.authSlice.user;
  });
  const [countries, setCountries] = useState();
  const [cityList, setCityList] = useState();
  const [thanaList, setThanaList] = useState();
  const [postalList, setPostalList] = useState();
  const [areaList, setAreaList] = useState();
  const [edit, setEdit] = useState(null);
  let [reload, setReload] = useState(false);
  const [data, setData] = useState({
    city: "",
    thana: "",
    postal: "",
    area: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    id: "",
    user_id: user?.id,
    default: false,
  });

  const fetchCountry = () => {
    get("/v2/countries")
      .then((res) => {
        setCountries(res?.data?.data);
      })
      .catch((error) => {});
  };

  const fetchCityList = (country) => {
    get("/v2/states-by-country/" + country)
      .then((res) => {
        setCityList(res?.data?.data);
        setThanaList();
        setPostalList();
        setAreaList();
      })
      .catch((error) => {});
  };

  const fetchThanaList = (city) => {
    get("/v2/cities?state_id=" + city)
      .then((res) => {
        setThanaList(res?.data?.data);
        setPostalList();
        setAreaList();
      })
      .catch((error) => {});
  };

  const fetchPostalCodeList = (singlecity, singlethana) => {
    get("/v2/postal-code-list/" + singlecity + "/" + singlethana)
      .then((res) => {
        let data = res.data.postcode.map((val) => {
          return val.name;
        });
        setPostalList(data);
        setAreaList();
      })
      .catch((error) => {});
  };

  const fetchAreaList = (code) => {
    get("/v2/area-list/" + code)
      .then((res) => {
        let data = res.data.area.map((val) => {
          return val.name;
        });
        setAreaList(data);
      })
      .catch((error) => {});
  };

  const handleChange = (e) => {
    setData((data) => {
      return { ...data, [e.target.name]: e.target.value };
    });

    if (e.target.name == "default") {
      setData((data) => {
        return { ...data, [e.target.name]: e.target.checked };
      });
    }

    if (e.target.name == "city") {
      fetchThanaList(e.target.value);
    } else if (e.target.name == "country") {
      fetchCityList(e.target.value);
    }
  };

  useEffect(() => {
    fetchCountry();
  }, []);

  useEffect(() => {}, [reload]);

  return (
    <>
      <section className="breadcrum-main mb-0">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link prefetch={true} href="/">
                      Home
                    </Link>
                  </li>

                  <li className="breadcrumb-item">
                    <a disabled>Address </a>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </section>
      <section className="userprofile-main">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3">
              <ProfileSidebar />
            </div>
            <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
              <div className="personal-information">
                <AddressList
                  edit={edit}
                  setEdit={setEdit}
                  data={data}
                  setData={setData}
                  setCityList={setCityList}
                  setThanaList={setThanaList}
                  setPostalList={setPostalList}
                  setAreaList={setAreaList}
                  setReload={setReload}
                  reload={reload}
                />
                {edit == null || edit === "" ? (
                  <AddressForm
                    data={data}
                    setData={setData}
                    setCityList={setCityList}
                    setThanaList={setThanaList}
                    setPostalList={setPostalList}
                    setAreaList={setAreaList}
                    countryList={countries}
                    cityList={cityList}
                    thanaList={thanaList}
                    postalList={postalList}
                    areaList={areaList}
                    handleChange={handleChange}
                    setReload={setReload}
                  />
                ) : (
                  <EditAddressForm
                    edit={edit}
                    data={data}
                    setData={setData}
                    cityList={cityList}
                    countryList={countries}
                    thanaList={thanaList}
                    postalList={postalList}
                    areaList={areaList}
                    handleChange={handleChange}
                    setEdit={setEdit}
                    setReload={setReload}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
AddressBook.protected = true;

export default AddressBook;
