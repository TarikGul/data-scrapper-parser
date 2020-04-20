const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const keys = require('../../config/keys');
const User = require('../../models/User');

const router = express.Router();

// Register a new user and create them in DB
router.post('/register', (req, res) => {
    // This will do all validations, including matching password
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                // Email verification
                errors.email = 'Email already taken';
                return res.status(400).json(errors);
            };
            const {
                firstName,
                lastName,
                email,
                password
            } = req.body;

            const newUser = new User({
                firstName,
                lastName,
                email, 
                password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then((user) => {
                            const payload = { id: user.id, handle: user.handle };
                            // Expire token after 12 hours
                            jwt.sign(payload, keys.secretOrKey, { expiresIn: 60 * 60 * 24 },
                                (err, token) => {
                                    if(err) res.json(err);
                                    res.json({
                                        success: true,
                                        token: `Bearer ${token}`,
                                    });
                                });
                        })
                        .catch ((err) => console.log(err));
                });
            });
        });
});

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    };

    const { email, password } = req.body;

    User.findOne({ email })
        .then((user) => {
            if(!user) {
                errors.email = 'User with that email not found';
                return res.status(404).json(errors);
            };

            bcrypt.compare(password, user.password)
                .then((isMatch) => {
                    if(isMatch) {
                        // Add any fields of the user we want in the payload
                        const {
                            id,
                            email,
                            firstName, 
                            lastName
                        } = user;
                        const payload = {
                            id,
                            email, 
                            firstName,
                            lastName
                        };

                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            // Expires in 12 hours
                            { expiresIn: 60 * 60 * 12 },
                            (err, token) => {
                                if (err) res.json(err);
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            },
                        );
                    } else {
                        errors.password = 'Incorrect password';
                        return res.status(400).json(errors);
                    };
                });
        });
});

// Current user authentication - succesful when header contains correct jwt
// In header key:Authorization value:Bearer+' '+jwt
router.get('/current',
    passport.authenticate('jwt', { session: false }), (req, res) => {
        const {
            id, 
            email, 
            firstName, 
            lastName
        } = req.user;
        res.json({
            id,
            email,
            firstName,
            lastName
        });
    });


module.exports = router;