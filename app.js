const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

// Dont forget to add an ssl path
// ------------------------------

// ------------------------------


// add the route paths
// -------------------

// -------------------

const port = process.env.PORT || 5000;

const app = express();

//Load static build folder in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));
    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

const db = require('./config/keys').mongoURI;
// Connect the databse using mongoose
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((err) => console.log(err));

// Setup middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
require('./config/passport')(passport);

// Setup base routes
app.get('/', (req, res) => res.send('The dolphin has landed'));


// Setup the server
app.listen(port, () => console.log(`Server is running on ${port}`))