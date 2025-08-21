const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/users.js');


router.
  route('/signup')
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

router.
  route('/login')
  .get(userController.renderLoginForm)
  .post(
  saveRedirectUrl,
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  userController.login
);

router.get('/logout', userController.logout);

module.exports = router;

//           ┌──────────────┐
//           │ User visits  │
//           │  /login      │
//           └─────┬────────┘
//                 │
//                 ▼
//        POST /login route
//                 │
//                 ▼
//  passport.authenticate('local')
//    ┌─────────┴─────────┐
//    │                   │
// Credentials valid?     Invalid
//    │                   │
//    ▼                   ▼
// Automatically logs     Redirect to /login
// user in (req.user set) with failureFlash
//    │
//    ▼
// Next route handler
//    │
//    ▼
// res.redirect(redirectUrl)

// ──────────────────────────────────────────────

//           ┌──────────────┐
//           │ User visits  │
//           │  /signup     │
//           └─────┬────────┘
//                 │
//                 ▼
//       POST /signup route
//                 │
//                 ▼
// User.register(newUser, password)
//    │
//    ▼
// User created in DB (hash + salt stored)
//    │
//    ▼
// req.login(registerUser)   <-- Manual login
//    │
//    ▼
// req.user now set
//    │
//    ▼
// res.redirect('/listings')
