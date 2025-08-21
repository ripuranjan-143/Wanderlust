const Listing = require('../models/listing');

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  //console.log(allListings)
  res.render('listings/index.ejs', { allListings });
};

module.exports.renderNewForm = (req, res) => {
  // console.log(req.user)
  res.render('listings/new.ejs');
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('owner');
  if (!listing) {
    req.flash('error', 'Requested Listing does not Exist!');
    res.redirect('/listings');
  }
  // console.log(listing);
  res.render('listings/show.ejs', { listing });
};

module.exports.createListing = async (req, res, next) => {
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
  const url = req.file.path;
  const filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash('success', 'New Listing Created!');
  res.redirect('/listings');
  // res.status(201).send({ message: 'Listing created successfully' });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Requested Listing does not Exist!');
    res.redirect('/listings');
  }
  res.render('listings/edit.ejs', { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash('success', 'Listing Updated!');
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Listing Deleted!');
  res.redirect('/listings');
};
