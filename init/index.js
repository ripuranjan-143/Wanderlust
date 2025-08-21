const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing');

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

const initDB = async () => (
  await Listing.deleteMany({}),
  (initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: '68a6b45ae3ca48990fd06b28',
  }))),
  await Listing.insertMany(initData.data),
  console.log('Data was initialized...')
);

initDB();
