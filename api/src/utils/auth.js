const { SESSION_NAME } = require("../config/session");

exports.isLoggedIn = (req) => !!req.session.userId;

exports.logIn = (req, user) => {
  req.session.userId = user._id;
  req.session.userData = {
    email: user.email,
    name: user.name,
    role: user.role,
  };
};

exports.logOut = (req, res) =>
  new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) reject(err);
      else res.clearCookie(SESSION_NAME);
      resolve();
    });
  });
