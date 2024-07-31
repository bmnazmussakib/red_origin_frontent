import React, {useEffect, useState} from 'react';
import ProfileSidebar from "../components/common/ProfileSidebar";
import {get} from "../helpers/helper";


const Reviews = () => {
    const [reviews,setReviews] = useState([])
   const  fetchReviews = () => {
        get('profile/reviews')
            .then((res) => {
                if(res.data?.result == true) {
                    setReviews(res.data.reviews.data)
                }
            })
    }
    useEffect(() => {
        fetchReviews()
    },[])
    return (
        <>
            <section className="breadcrum-main mb-0">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="#">Home</a>
                                    </li>

                                    <li className="breadcrumb-item">
                                        <a disabled>review </a>
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
                            <ProfileSidebar/>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9">
                            <div className="personal-information">
                                <div className="common-fieldset-main">
                                    <fieldset className="common-fieldset">
                                        <legend className="rounded-0">Reviews </legend>
                                        <table className="table">
                                            <tbody>
                                            <tr className="">
                                                <td>#</td>
                                                <td>Rating</td>
                                                <td className="text-center">Comment</td>
                                                <td className="text-center">Fit</td>
                                                {/*<td className="text-center">Size</td>*/}
                                                <td className="text-center">Image</td>
                                                <td className="text-center">Helpful</td>
                                            </tr>
                                            {
                                                reviews.length > 0 &&
                                                reviews.map((review,key) => {
                                                    return (
                                                        <tr className="">
                                                            <td>{key+1}</td>
                                                            <td>{review.comment}</td>
                                                            <td className="text-center">{review.comment}</td>
                                                            <td className="text-center">{review.overall_fit}</td>
                                                            {/*<td className="text-center">Size</td>*/}
                                                            <td className="text-center">
                                                                <img src={review.image} alt="" width={100} className={'img-fluid'}/>
                                                            </td>
                                                            <td className="text-center">{review.upvote_count}</td>
                                                        </tr>
                                                    )
                                                })
                                            }


                                            </tbody>
                                        </table>



                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
Reviews.protected = true;

export default Reviews;