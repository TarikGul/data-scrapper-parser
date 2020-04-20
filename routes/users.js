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
    
})