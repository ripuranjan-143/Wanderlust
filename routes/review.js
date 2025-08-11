const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const { reviewSchema } = require('../schema');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const Review = require('../models/review');


const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Create Reviews Route
router.post(
  '/',
  validateReview,
  wrapAsync(async (req, res) => {
    // Way 1
    // let { id } = req.params;
    // let listing = await Listing.findById(id);
    // Way 2
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    await newReview.save();
    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash('success', 'New Review Created!');

    // let listing = await Listing.findById(req.params.id);
    // let newReview = new Review(req.body.review);
    // listing.reviews.push(newReview);
    // await newReview.save();
    // await listing.save();
    res.redirect(`/listings/${listing._id}`);
  })
);

// Delete Reviews Route
router.delete(
  '/:reviewId',
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review Deleted!');
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;