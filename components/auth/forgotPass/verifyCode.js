import React, {useState} from 'react';
import {post} from "../../../helpers/helper";
import NewPass from "./newPass";

const VerifyCode = ({user_data,setVerifyModal}) => {
    const [data,setData] = useState({
        send_code_by : user_data.send_code_by,
        email_or_phone : user_data.email_or_phone,
        verification_code : ''
    });
    const [newPassModal, setNewPassModal] = useState(false)
    const handleCode = (e) => {
        setData((data) => {
            return {...data,[e.target.name] : e.target.value}
        })
    }
    const submitVerify = (e) => {
        e.preventDefault()

        post('/v2/auth/password/check_verify','',data).then((res) => {
            if(res.data.result == true) {
                setNewPassModal(true)

            }
        }).catch((error)  => {
            alert('error')
        })
    }
    return (
        <>
            {
                !newPassModal ?
                    <>
                        <div className="modal-body" id="new_pass_modal_body" >
                            <label htmlFor="">Code</label>
                            <input type="text" name="verification_code"
                                   onChange={handleCode} className="form-control"
                                   placeholder="Enter Code"/>
                        </div>

                        <div className="modal-footer" id="new_pass_modal_footer"  >
                            {/*<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>*/}
                            <button type="button" className="btn btn-outline-dark" onClick={submitVerify}>Verify
                            </button>
                        </div>
                    </> :

                    <NewPass userCredential={user_data} setVerifyModal={setVerifyModal}/>
            }

        </>
    );
};

export default VerifyCode;