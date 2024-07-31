import React, { use } from "react";
import { get, post, tAlert } from "../../helpers/helper";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { detail } from "../../utils/route";

const ReviewForm = ({ productInfo: { id, slug }, reviews, setReviews }) => {
  let [reviewForm, setReviewForm] = useState({
    comment: "",
    rating: 0,
    image: "",
    overall_fit: "",
  });
  let [reviewShow, setReviewShow] = useState(null);
  let authInfo = useSelector((state) => state?.authSlice?.user);
  let fetchReview = async () => {
    try {
      let { data } = await get(detail.REVIEW + id);
      if (data?.success === true) {
        setReviews(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const submitReview = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("comment", reviewForm.comment);
    formData.append("rating", reviewForm.rating);
    formData.append("image", reviewForm.image);
    formData.append("overall_fit", reviewForm.overall_fit);
    formData.append("product_id", id);
    formData.append("user_id", authInfo?.id);
    try {
      let { data } = await axios.post("reviews/submit", formData);
      if (data?.result === true) {
        tAlert("Review Submitted Successfully", "success");
        fetchReview();
      } else {
        tAlert(data?.message || "Already Reviewed", "error");
      }
    } catch (error) {
      console.log(error);
    }
    setReviewShow(false);
  };
  useEffect(() => {
    const getReview = async () => {
      try {
        let { data } = await get("/purchase-check/" + id);
        if (data.success === true) {
          if (reviews?.length === 0) {
            setReviewShow(true);
          } else {
            let reviewed = reviews?.filter(
              (review) => review?.user_id === authInfo?.id
            );
            reviewed.length > 0 ? setReviewShow(false) : setReviewShow(true);
          }
        } else {
          setReviewShow(false);
        }
      } catch (error) {
        setReviewShow(false);
      }
    };
    getReview();
  }, []);
  return (
    <>
      {reviewShow === null && <Skeleton count={5} />}
      {reviewShow && (
        <form onSubmit={submitReview}>
          <div className="form-group">
            <label htmlFor="comment">Comment</label>
            <textarea
              className="form-control"
              id="comment"
              rows="3"
              onChange={(e) =>
                setReviewForm({ ...reviewForm, comment: e.target.value })
              }
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <input
              type="number"
              className="form-control"
              id="rating"
              min="0"
              max="5"
              onChange={(e) =>
                setReviewForm({ ...reviewForm, rating: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              className="form-control-file"
              id="image"
              onChange={(e) =>
                setReviewForm({ ...reviewForm, image: e.target.files[0] })
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="overall_fit">Overall Fit</label>
            <select
              className="form-control"
              id="overall_fit"
              onChange={(e) =>
                setReviewForm({ ...reviewForm, overall_fit: e.target.value })
              }
            >
              <option value="True To Size">True to Size</option>
              <option value="False To Size">Not True to Size</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Submit
          </button>
        </form>
      )}
    </>
  );
};

export default ReviewForm;
