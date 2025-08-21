const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

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

const sessionOptions = {
  secret: 'mysupersecretcode',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get('/', (req, res) => {
  res.send('Hi, I am groot...');
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  console.log(res.locals.currUser)
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student"
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld")
//   res.send(registeredUser)
// })

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);

app.all('*', (req, res, next) => {
  next(
    new ExpressError(
      404,
      '404 - Page Not Found Sorry, The page you are looking for does not exist.'
    )
  );
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = 'Something Went Wrong!' } = err;
  res.status(statusCode).render('error.ejs', { message });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log('Server running at http://localhost:8080...');
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
