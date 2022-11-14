// Import required modules
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Initialize express app
var app = express();

// Load env and set PORT
dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Passport config
require('./config/passport')(passport);

// Middleware
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'Mess Portal',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Check authentication for admin endpoints
app.use('/api/admin/:all', (req, res, next) => {
    if (req.isAuthenticated() && req.user?.email === process.env.ADMIN) next();
    else res.sendStatus(401);
});

// Check authentication for user endpoints
app.use('/api/user/:all', (req, res, next) => {
    if (req.isAuthenticated()) next();
    else res.sendStatus(401);
})

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/data', require('./routes/data'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));

// Frontend site
app.use(express.static(__dirname + '/frontend/build'));
app.get('*', (req, res) => res.sendFile(__dirname + '/frontend/build/index.html'));

// Start server
app.listen(PORT, console.log(`Server started on port ${PORT}`));
