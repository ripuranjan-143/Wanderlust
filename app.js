const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const app = express();

const MONGO_URL = 'mongodb://127.0.0.1:27017/Wanderlust';

main()
  .then(() => {
    console.log('Connected to Wanderlust DB...');
  })
  .catch((e) => {
    console.log(e);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  res.send('Hi, I am groot...');
});

// Index Route
app.get('/listings', async (req, res) => {
  let allListings = await Listing.find({});
  //console.log(allListings)
  res.render('listings/index.ejs', { allListings });
});

// New Route
app.get('/listings/new', async (req, res) => {
  res.render('listings/new.ejs');
});

// Edit Route
app.get('/listings/:id/edit', async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', { listing });
});

// Show Route
app.get('/listings/:id', async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  // console.log(listing)
  res.render('listings/show.ejs', { listing });
});

// Create Route
app.post('/listings', async (req, res) => {
  // why /listings not something else =
  // POST /listings says: “I’m sending data to create a new listing in the /listings collection.”
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect('/listings');
});

// Update Route
app.put('/listings/:id', async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

// Delete Route
app.delete('/listings/:id', async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect('/listings');
});
// app.get('/testlisting', async(req, res) => {
//   let samplelisting = new Listing({
//     title: 'My new villa',
//     description: 'By the Beach',
//     price: 1200,
//     location: 'Calangute, Goa',
//     country: 'India',
//   });
//   await samplelisting.save()
//   console.log('sample was saved');
//   res.send('successful testing')
// });

const PORT = 8080;
app.listen(PORT, () => {
  console.log('Server running at http://localhost:3000...');
});
