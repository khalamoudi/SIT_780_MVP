const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const UserDetail = require('../models/UserDetail');


module.exports = (passport) => {
    // LOCAL LOGIN 
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email', 
        passwordField : 'password', 
        passReqToCallback : true // check if a user is logged in or not)
    },(req, email, password, done) => {
        
        // we lookup a user with a matching 'email'
        User.findOne({email: email}).then((user) => {
            if (!user) {
                // this means fail the login
                return done(null, false);
            }
        
            // check password validity
            if (!bcrypt.compareSync(password, userPassword)) {
                // this means fail login
                return done(null, false);
            }

            //pass user object -> no errors
            return done(null, user)    
        }).catch(function(err) {done(err, false)});
    }));

   
    // LOCAL SIGNUP 

    passport.use('local-signup', new LocalStrategy({
        //local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // to check if a user is logged in or not
    }, function(req, email, password, done) {

        // if the user is already logged in:
        if (req.user) {
            // pass retrive his data
            return done(null, req.user);
        }

        // we check if no other user has already taken this email
        User.findOne({email : email}).then(function(user) {

            // check if this email is found
            if (user) {
                // fail the signup
                return done(null, false);
            }

            // create user on user Schema in DB
            new User({
                email: email,
                // hash/encrypt password before storing it in the database
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(8), null),
                userName: req.body.userName,
                role: req.body.role,
                Department:req.body.department
            }).save(function(err, savedUser) {
                if (err) {
                    return done(err, false)
                }
            // create user on user Schema in DB
            new UserDetail({
                user_id:savedUser._id,
                email: email,
                userName: req.body.userName,
                role: req.body.role,
                Department:req.body.department
            }).save(function(err, savedUserdetail){
                if (err) {
                    return done(err, false)
                }

            });
                // Success. Pass back savedUser
                return done(null, savedUser);
            })
        }).catch(function(err) {done(err, false)});
    }));

    // passport session setup 
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};

