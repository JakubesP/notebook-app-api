const { isLoggedIn } = require("../utils/auth");
const { BadRequest, Unauthorized, Forbidden } = require("../utils/errors");
const { catchAsync } = require("./errors");
const { roles } = require("../accessConfig");

// ----------------------------------------------------------------------------

exports.guest = (req, res, next) => {
  if (isLoggedIn(req)) return next(new BadRequest("You are already logged in"));

  next();
};

// ----------------------------------------------------------------------------

exports.auth = (req, res, next) => {
  if (!isLoggedIn(req))
    return next(new Unauthorized("You have to be logged in first"));

  next();
};

// ----------------------------------------------------------------------------

exports.access = (actions, resource) =>
  catchAsync(async (req, _res, next) => {
    const userRole = req.session.userData ? req.session.userData.role : "guest";

    for (action of actions) {
      const permission = roles.can(userRole)[action](resource);
      if (permission.granted) {
        req.accessAttributes = permission.attributes;
        if (action.includes("Own")) req.restrictToOwner = true;
        return next();
      }
    }

    if (userRole === "guest") {
      return next(new Unauthorized("You have to be logged in first"));
    }

    return next(new Forbidden("Access denied"));
  });
