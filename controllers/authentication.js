const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function (req, res, next) {
    //gives our user their token
    res.send({ token: tokenForUser(req.user) });
}

exports.signup = function (req, res, next) {

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(422).send({ error: 'Provide email and password' });
    }

    // See if user exists
    User.findOne({ email: email }, function (err, existingUser) {
        if (err) {
            console.log(err);
            return next(err)
        }
        // If user with email exists, return error
        if (existingUser)
            return res.status(422).send({ error: 'email is in use' });

        // If user does not exist, create it and save it
        const user = new User({
            email: email,
            password: password
        })

        user.save(function (err) {
            if (err) {
                return next(err);
            }

            // Respond to request with created user
            res.json({ token: tokenForUser(user) });
        });
    });

}