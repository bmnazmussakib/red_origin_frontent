import React, {useEffect, useState} from 'react';
import {post} from "../../../helpers/helper";
import {toast} from "react-toastify";

const NewPass = ({userCredential,setVerifyModal}) => {
    const [data,setData] = useState({
        send_code_by : userCredential.send_code_by,
        email_or_phone : userCredential.email_or_phone,
        password : '',
        password_confirmation : ''
    })
    const [error,setError]  = useState()
    const handleNewPass =(e) => {
        setData((data) => {
            return {...data,[e.target.name] : e.target.value}
        })
    }

    const submitNewPass = (e) => {
        post('/v2/auth/password/new_pass','',data).then((res) => {
            if(res.data.result == true){
                var genericModalEl = document.getElementById('staticBackdropForgot')
                var modal = bootstrap.Modal.getInstance(genericModalEl)
                modal.hide()
                toast('You new password is set,please login now')
                setVerifyModal(false)

            }
            if(res.data.result == false){
                toast.error(res.data.message)
            }
        }).catch((error) => {

            setError(error.response.data.errors)
        })
    }

    useEffect(() => {

    },[error])
    return (
      <>
        <div className="modal-body" id="new_pass_modal_body">
          <label htmlFor="">New Password</label>
          <input
            type="password"
            name="password"
            onChange={handleNewPass}
            className="form-control"
            placeholder="new password"
          />
          <div className="text-danger">
            {error != undefined && error.password}
          </div>

          <label htmlFor="">Confirm Pass</label>
          <input
            type="password"
            name="password_confirmation"
            onChange={handleNewPass}
            className="form-control"
            placeholder="confirm password"
          />

          {/*<small>please enter the email/phone that register here.</small>*/}
        </div>

        <div className="modal-footer" id="new_pass_modal_footer">
          {/*<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>*/}
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={submitNewPass}
          >
            Set New Pass
          </button>
        </div>
      </>
    );
};

export default NewPass;