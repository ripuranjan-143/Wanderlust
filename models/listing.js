// TYPE-1
const mongoose = require('mongoose');
const Review = require('./review');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG9vYXy',
    set: (v) =>
      v === ''
        ? 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG9vYXy'
        : v,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

listingSchema.post('findOneAndDelete', async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;

// // TYPE-1
// const mongoose = require('mongoose');

// const listingSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   image: {
//     type: String,
//     default: 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG9vYXy',
//     set: (v) =>
//       v === ''
//         ? 'https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG9vYXy'
//         : v,
//   },
//   price: Number,
//   location: String,
//   country: String,
// });

// const Listing = mongoose.model('Listing', listingSchema);

// module.exports = Listing;

// anotherFile.js
// const Listing = require('./listing');
// Can export a single value (function, object, class, etc.)

// TYPE-2
// const mongoose = require('mongoose');

// const listingSchema = new mongoose.Schema({
//   title: String,
//   description: String,
// });

// exports.Listing = mongoose.model('Listing', listingSchema);

// anotherFile.js
// const { Listing } = require('./listing');
// Used to export multiple named values

// TYPE-3
// import mongoose from 'mongoose';

// const listingSchema = new mongoose.Schema({
//   title: String,
//   description: String,
// });

// export const Listing = mongoose.model('Listing', listingSchema);
// anotherFile.js
// import { Listing } from './listing.js';
// You can export multiple named values

// TYPE-4
// import mongoose from 'mongoose';

// const listingSchema = new mongoose.Schema({
//   title: String,
//   description: String,
// });

// const Listing = mongoose.model('Listing', listingSchema);

// export default Listing;
// anotherFile.js
// import Listing from './listing.js';
// Only one default export per file
