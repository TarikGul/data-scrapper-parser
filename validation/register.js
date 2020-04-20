const Validator = require('validator');
const validText = require('./valid_text');

module.exports = validateRegisterInput = userData => {
    const errors = {};
    const data = { ...userData };

    data.firstName = validText(data.firstName) ? data.firstName : '';
    data.lastName = validText(data.lastName) ? data.lastName : '';
    data.email = validText(data.email) ? data.email : '';
    data.password = validText(data.password) ? data.password : '';
    data.password2 = validText(data.password2) ? data.password2 : '';

    if(!Validator.isLength(data.firstName, { min: 2, max: 30 })) {
        errors.firstName = 'First name must be between 2 and 30 characters';
    };

    if(!Validator.isEmpty(data.firstName)) {
        errors.firstName = 'First name field is required';
    };

    if (!Validator.isLength(data.lastName, { min: 2, max: 30 })) {
        errors.lastName = 'First name must be between 2 and 30 characters';
    };

    if (!Validator.isEmpty(data.lastName)) {
        errors.lastName = 'First name field is required';
    };

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    };

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    };

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    };

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Password must be at least 6 characters';
    };

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm Password field is required';
    };

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords must match';
    };
}