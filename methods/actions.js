const User = require('../models/user');
const config = require('../methods/config');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');


let functions = {
    login: (req, res) => {
        User.findOne({ username: req.body.username }, (err, user) => {
            if (err) {
                res.status(500).json({ success: false, message: 'An error occured signing in.' });
            }

            if (!user) {
                return res.json({ success: false, message: 'Authentication failed.' + req.body.username + ' not found.' });
            }

            else {
                let isMatch = bcrypt.compareSync(req.body.password, user.password);

                if (isMatch) {
                    let token = jwt.encode(user, config.secret);
                    return res.json({ success: true, token: token });
                }
                else {
                    return res.json({ success: false, message: 'Authentication failed. Wrong username and/or password.' });
                }
            }
        })
    },
    signup: (req, res, next) => {
        if ((!req.body.username) || (!req.body.password)) {
            return res.json({ success: false, msg: 'Please provide all required information.' });
        }
        else {
            // find a user in mongo with provided username
            User.findOne({ username: req.body.username }, (err, user) => {
                // In case of any error, return using the done method
                if (err) {
                    res.json({ success: false, message: 'An error occured signing up.' });
                    next();
                }

                // already exists
                else if (user) {
                    return res.json({ success: false, message: 'Sorry ' + req.body.username + ' is already taken.' });

                } else {
                    // if there is no user, create the user
                    let newUser = new User();

                    // set up the user details
                    newUser.username = req.body.username;
                    newUser.fullname = req.body.fullname || 'user';
                    newUser.email = req.body.email || 'test.email@test.com';
                    newUser.mobile = req.body.mobile || '0707912063';
                    newUser.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

                    // save the user
                    newUser.save((err, user) => {
                        if (err) {
                            return res.json({ success: false, message: err.message });
                        }
                        return res.json({
                            success: true,
                            message: `Account creation successful for ${req.body.username}.`,
                            id: user._id
                        });
                    });
                }
            });
        }
    },
    getinfo: (req, res) => {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            let token = req.headers.authorization.split(' ')[1];
            let decodedtoken = jwt.decode(token, config.secret);
            req.user = decodedtoken;
            return res.json({
                success: true,
                user: {
                    id: decodedtoken._id,
                    username: decodedtoken.username,
                    name: decodedtoken.fullname,
                    email: decodedtoken.email,
                    mobile: decodedtoken.mobile
                }
            });
        }
        else if (req.headers.authorization == null) {
            return res.status(401).json({ success: false, message: 'Access denied. Authorization is required.' })
        }
        else {
            return res.status(401).json({ success: false, message: 'Access denied. Authorization is required.' })
        }
    }
}

module.exports = functions;
