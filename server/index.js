// requires
const express = require("express");
const session = require("express-session");
const path = require("path");
const morgan = require("morgan");
var cors = require("cors");

const { ROLES } = require("./src/config/consts");

// router

const app = express(); // app uses express
app.use(cors()); // implement CORS flags for browsers
app.use(express.urlencoded({ extended: true }), express.json()); // JSON implement
app.use(
  "/css",
  express.static(path.join(__dirname, "/node_modules/bootstrap/dist/css"))
);
app.use(express.static(__dirname + "/public")); // static files

app.use(
  session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    user: {},
    cart: {},
  })
);

// default settings of user to avoid login while testing
// Middleware to set up a mock session for testing
const mockSessionMiddleware = (req, res, next) => {
  // Check if in testing mode
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    // Set up a mock session object with user information
    req.session.user = {
      id: "SLLS1", // Replace with the actual user ID
      role: ROLES.SELLS, // Replace with the actual user role
      username: "REMOVE ME ON PRODUCTION", // Replace with the actual username
      location: 2
      // Add any other user information needed for testing
    };
  }
  next();
};

// TODO HANDLE SQLINJECTION

// Apply the mock session middleware to your Express app
app.use(mockSessionMiddleware);

// Routes`
app.use(require(path.join(__dirname, 'src/routes/', 'user.routes')));
app.use(morgan('dev'))
app.use('/admin', require(path.join(__dirname, 'src/routes/', 'admin.routes')));
app.use('/production', require(path.join(__dirname, 'src/routes/', 'production.routes')));
app.use('/sells', require(path.join(__dirname, 'src/routes/', 'sells.routes')));

// views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views/"));

// CSS
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
); // <- This will use the contents of 'bootstrap/dist/css' which is placed in your node_modules folder as if it is in your '/styles/css' directory.
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
); // <- This will use the contents of 'bootstrap/dist/css' which is placed in your node_modules folder as if it is in your '/styles/css' directory.

module.exports = app; // export configuration
