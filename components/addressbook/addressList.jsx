import React, { useEffect, useState } from 'react';
import { get } from '../../helpers/helper';
import { toast } from 'react-toastify';
import AddressForm from './addressForm';
import { setUserAddress } from '../../store/slice/AuthSlice';
import { useDispatch } from 'react-redux';

const AddressList = ({
  edit,
  setEdit,
  data,
  setData,
  setThanaList,
  setCityList,
  setPostalList,
  setAreaList,
  reload,
  setCountries,
}) => {
  const [addressList, setAddressList] = useState();
  let dispatch = useDispatch();
  const fetchAddresList = () => {
    get('/v2/user/shipping/address').then((res) => {
      if (res.data?.success == true) {
        setAddressList(res.data.data);
        dispatch(
          setUserAddress({
            address: res.data.data,
          })
        );
      }
    });
  };
  const fetchThanaList = (city) => {
    get('/v2/cities?state_id=' + city)
      .then((res) => {
        setThanaList(res?.data?.data);
        setPostalList();
        setAreaList();
      })
      .catch((error) => {});
  };
  const fetchCountry = () => {
    get('/v2/countries')
      .then((res) => {
        setCountries(res?.data?.data);
      })
      .catch((error) => {});
  };
  const fetchPostalCodeList = (singlecity, singlethana) => {
    get('/v2/postal-code-list/' + singlecity + '/' + singlethana)
      .then((res) => {
        let data = res.data.postcode.map((val) => {
          return val.name;
        });
        setPostalList(data);
      })
      .catch((error) => {
        // //console.log(error)
      });
  };

  const fetchAreaList = (code) => {
    get('/v2/area-list/' + code)
      .then((res) => {
        let data = res.data.area.map((val) => {
          return val.name;
        });
        setAreaList(data);
      })
      .catch((error) => {
        // //console.log(error)
      });
  };
  const fetchCityList = (country) => {
    get('/v2/states-by-country/' + country)
      .then((res) => {
        setCityList(res?.data?.data);
        setThanaList();
        setPostalList();
        setAreaList();
      })
      .catch((error) => {});
  };
  const changePage = (e, address) => {
    e.preventDefault();
    setEdit(address.id);
    fetchCountry();
    fetchCityList(address.country_id);
    fetchThanaList(address.state_id);
    // fetchPostalCodeList(address.state_name, address.city_name);
    // fetchAreaList(address.postal_code);
    // if (edit != null) {
    setData({
      city: address.state_id,
      thana: address.city_id,
      postal: address.postal_code,
      country: address.country_id,

      area: address.area_name,
      email: address.email,
      phone: address.phone,
      address: address.address,
      user_id: address.user_id,
      default: address.set_default == 0 ? false : true,
    });
    // }
  };
  const deleteAddress = (id) => {
    get('/v2/user/shipping/delete/' + id).then((res) => {
      if (res.data.result == true) {
        const newList = addressList.filter((item) => item.id !== id);
        setAddressList(newList);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    });
  };
  useEffect(() => {
    fetchAddresList();
  }, [reload]);

  return (
    <div className="common-fieldset-main">
      <fieldset className="common-fieldset">
        <legend className="rounded-0">
          <i className="fa-regular fa-address-book"></i> saved address
        </legend>

        <div className="table-responsive">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Address</th>
                <th>Email</th>
                <th>Phone</th>
                <th>District</th>
                <th>Thana</th>
                <th>Post Code</th>
                <th className="d-none">Area</th>
                <th>Default </th>
                <th>Action</th>
              </tr>
              {addressList != undefined &&
                addressList.map((address) => {
                  return (
                    <tr>
                      <td> {address.address} </td>
                      <td className="text-lowercase"> {address.email} </td>
                      <td> {address.phone} </td>
                      <td> {address.state_name} </td>
                      <td> {address.city_name} </td>
                      <td> {address.postal_code} </td>
                      <td className="d-none"> {address.area_name} </td>
                      <td> {address.set_default == 1 ? 'yes' : 'no'} </td>
                      <td>
                        <a
                          className=""
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => changePage(e, address)}
                        >
                          <i className="icofont-edit-alt"></i>
                        </a>

                        <a
                          className=""
                          style={{ cursor: 'pointer' }}
                          onClick={() => deleteAddress(address.id)}
                        >
                          <i className="icofont-trash"></i>
                        </a>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </fieldset>
    </div>
  );
};

export default AddressList;
