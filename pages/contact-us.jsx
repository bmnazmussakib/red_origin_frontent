import React, { useState } from 'react';
import Banner from '../components/common/Banner';
import { tAlert } from '../helpers/helper';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // You can add your form submission logic here
        tAlert("Thank you")
        setFormData({
            name: '',
            email: '',
            address: ''
        })
    };

    return (
        <section className='contact-us'>
            <Banner type="common" />
            <div className="container py-5">
                <h2 className='text-center'>Contact Us</h2>
                <div className="card m-auto">
                    <div className="card-body p-md-5">
                        <form onSubmit={handleSubmit} >
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Address:</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <button type="submit" className="btn continue-btn">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
