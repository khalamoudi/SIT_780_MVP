const router = require('express').Router()
const passport = require('passport');
const userService = require('../services/userService')
const departmentModel = require('../models/department')

//  Signup ====================================================================
router.get('/signup', async (req, res) => {
  let dep = await departmentModel.find().lean()
  res.render('registration.ejs', { data: { department: dep } })
});


router.post('/signup', passport.authenticate('local-signup', {
	failureRedirect : '/auth/signup',
	failureFlash : false // allow flash messages
}), function(req, res, next)  {
	// TODO: redirect to /manager or /member
	res.redirect('/home/')
});

// Login ====================================================================
router.get('/login', function(req, res, next)  {
	// if user logged in
	if (req.user) {
		res.redirect('/home/')
	} else {
		res.render('login')
	}
})

router.post('/login', passport.authenticate('local-login', {
	failureRedirect : '/auth/login',
	failureFlash : false // allow flash messages
}), function(req, res, next)  {
       res.redirect('/home/')
});
// LOGOUT ==============================
router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/');
});




module.exports = router;