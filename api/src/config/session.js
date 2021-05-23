const { IN_PROD } = require("./app");

// ----------------------------------------------------------------------------

const ONE_HOUR = 1000 * 60 * 60;
const HALF_HOUR = ONE_HOUR / 2;

const {
  SESSION_SECRET = "secret",
  SESSION_NAME = "sid",
} = process.env;

// ----------------------------------------------------------------------------

module.exports = {
  secret: SESSION_SECRET,
  name: SESSION_NAME,
  cookie: {
    maxAge: HALF_HOUR,
    secure: IN_PROD,
    sameSite: true,
  },
  rolling: true,
  resave: false,
  saveUninitialized: false,
};
