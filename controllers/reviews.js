const Listing = require('../models/listing');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
  // Way 1
  // let { id } = req.params;
  // let listing = await Listing.findById(id);
  // Way 2
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
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
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review Deleted!');
  res.redirect(`/listings/${id}`);
};