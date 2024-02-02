// requires
const express = require('express');
const session = require('express-session')
const path = require('path')
const morgan = require('morgan')
var cors = require('cors');
// router

const app = express();          // app uses express
app.use(cors());                // implement CORS flags for browsers
app.use(express.urlencoded({ extended: true }), express.json());    // JSON implement
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')))

app.use(session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: false,
    user: {},
    resave: false
}));

// Routes`
app.use(require(path.join(__dirname, 'src/routes/', 'user.routes')));
app.use(morgan('dev'))
app.use('/admin', require(path.join(__dirname, 'src/routes/', 'admin.routes')));

// views
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views/'));



module.exports = app;             // export configuration