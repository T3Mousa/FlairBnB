import React from 'react';
import { useSelector } from 'react-redux';
import ReviewHeading from '../Reviews/ReviewHeading';
import Review from '../Reviews/Review';
import './Reviews.css'

function Reviews({ spot, reviews }) {
    const sessionUser = useSelector(state => state?.session?.user);
    if (!reviews) return;
    console.log(reviews)
    let reversedReviews = reviews.slice().reverse()
    console.log(reversedReviews)
    // console.log(reviews[0].User.id)
    // console.log(sessionUser.id)
    const spotReviewedByUser = (sessionUser && reviews?.some((rev) => rev?.User?.id === sessionUser?.id))

    const spotOwnedByUser = (sessionUser && spot?.ownerId === sessionUser?.id)

    return (
        <div>
            <ReviewHeading user={sessionUser} reviews={reviews} spot={spot} spotReviewedByUser={spotReviewedByUser} spotOwnedByUser={spotOwnedByUser} />

            {!reversedReviews.length && <div className="noReview">Be the first to post a review!</div>}

            <div className='reviews'>
                {reversedReviews.map((review, i) => <Review key={i} spot={spot} review={review} user={sessionUser} />)}
            </div>
        </div>
    )
}


export default Reviews;
