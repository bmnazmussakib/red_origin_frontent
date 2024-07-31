export const filterReviews = (filter, reviews) => {
  if (filter === "") {
    return reviews;
  }
  if (filter === "asc_rating") {
    let sortedReviews = reviews.sort((a, b) =>
      a.rating > b.rating ? 1 : -1
    );
    return sortedReviews;
  }
  if (filter === "desc_rating") {
    let sortedReviews = reviews.sort((a, b) =>
      a.rating > b.rating ? -1 : 1
    );
    return sortedReviews;
  }
  if (filter === "1") {
    let sortedReviews = reviews.filter((review) => review.rating == 1);
    return sortedReviews;
  }
  if (filter === "2") {
    let sortedReviews = reviews.filter((review) => review.rating == 2);
    return sortedReviews;
  }
  if (filter === "3") {
    let sortedReviews = reviews.filter((review) => review.rating == 3);
    return sortedReviews;
  }

  if (filter === "most_helpful") {
    let sortedReviews = reviews.sort((a, b) => {
      return a.upvote_count > b.upvote_count ? -1 : 1;
    });
    return sortedReviews;
  }
  if (filter === "older") {
    let sortedReviews = reviews.sort((a, b) => {
      return (
        Number(new Date(a.time_date).getTime()) -
        Number(new Date(b.time_date).getTime())
      );
    });

    return sortedReviews;
  }
  if (filter === "recent") {
    let sortedReviews = reviews.sort((a, b) => {
      return (
        Number(new Date(b.time_date).getTime()) -
        Number(new Date(a.time_date).getTime())
      );
    });
    return sortedReviews;
  }
};





export const getSettingValue = (settings, type) => {
  let data = settings.filter((setting, key) => {
    if (setting.type == type) {
      return setting;
    }
  });
  return data[0]?.value;
};