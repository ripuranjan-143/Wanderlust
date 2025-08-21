const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const listingControler = require('../controllers/listings');
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

router
  .route('/')
  .get(wrapAsync(listingControler.index))
  .post(
    isLoggedIn,
    
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingControler.createListing)
  );

// New Route
router.get('/new', isLoggedIn, listingControler.renderNewForm);

router
  .route('/:id')
  .get(wrapAsync(listingControler.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingControler.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingControler.destroyListing));

// Edit Route
router.get(
  '/:id/edit',
  isLoggedIn,
  isOwner,
  wrapAsync(listingControler.renderEditForm)
);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const wrapAsync = require('../utils/wrapAsync');
// const { isLoggedIn, isOwner, validateListing } = require('../middleware');
// const listingControler = require('../controllers/listings');

// // Index Route
// router.get('/', wrapAsync(listingControler.index));

// // New Route
// router.get('/new', isLoggedIn, listingControler.renderNewForm);

// // Edit Route
// router.get(
//   '/:id/edit',
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingControler.renderEditForm)
// );

// // Show Route
// router.get('/:id', wrapAsync(listingControler.showListing));

// // Create Route
// router.post(
//   '/',
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingControler.createListing)
// );

// // Update Route
// router.put(
//   '/:id',
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingControler.updateListing)
// );

// // Delete Route
// router.delete(
//   '/:id',
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingControler.destroyListing)
// );

// module.exports = router;
