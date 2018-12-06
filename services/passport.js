// Passprt configurations
const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwTStrategy = require('passport-jwt').Strategy;
const ExtractJwT = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = {usernameField: 'email'};

const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
    // Verify username and password  
    // call done with user if both are correct
    // call done with false
    User.findOne({ email: email}, function(error, user) {
        if(error)
            return done(error);
        
        if(!user)
            return done(null, false);
        
        // Compare passwords and check if it exists
        user.comparePassword(password, function(err, isMatch) {
            if (error)
                return done(err);
            if(!isMatch)
                return done(null, false);
            
            return done(null, user);
        })
        
    })
});

// Options for JwT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwT.fromHeader('authorization'),
    secretOrKey: config.secret
}

// Create JWT Strategy
const jwtLogin = new JwTStrategy(jwtOptions, function (payload, done) {
    // See if user.id in payload exists in our db
    // if id does, call done with user
    // if it doesn't call done without user
    User.findById(payload.sub, function (error, user) {
        if (error) {
            return done(error, false);
        }
        if (user) {
            return done(null, user);
        } else {
            done(null, false);
        }
    })
})

// Tell Passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
