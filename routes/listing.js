const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { listingSchema } = require('../schema');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index Route
router.get(
  '/',
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    //console.log(allListings)
    res.render('listings/index.ejs', { allListings });
  })
);

// New Route
router.get(
  '/new',
  wrapAsync(async (req, res) => {
    res.render('listings/new.ejs');
  })
);

// Edit Route
router.get(
  '/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash('error', 'Requested Listing does not Exist!');
      res.redirect('/listings')
    }
    res.render('listings/edit.ejs', { listing });
  })
);

// Show Route
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    if (!listing) {
      req.flash('error', 'Requested Listing does not Exist!');
      res.redirect('/listings')
    }
    // console.log(listing)
    res.render('listings/show.ejs', { listing });
  })
);

// Create Route
router.post(
  '/',
  validateListing,
  wrapAsync(async (req, res, next) => {
    //console.log("Received POST request:", req.body);
    // why /listings not something else =
    // POST /listings says: “I’m sending data to create a new listing in the /listings collection.”

    // type-1
    // let { title, description, image, price, country, location } = req.body;
    // const newListing = new Listing({
    //   title,
    //   description,
    //   image,
    //   price,
    //   country,
    //   location
    // });

    // type-2
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash('success', 'New Listing Created!');
    res.redirect('/listings');
    // res.status(201).send({ message: 'Listing created successfully' });
  })
);

// Update Route
router.put(
  '/:id',
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash('success', 'Listing Updated!');
    res.redirect(`/listings/${id}`);
  })
);

// Delete Route
router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted!');
    res.redirect('/listings');
  })
);

module.exports = router;
