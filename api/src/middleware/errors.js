const mongoose = require("mongoose");
const multer = require("multer");
const { BadRequest } = require("../utils/errors");
const createResponse = require("../utils/createResponse");

const { IN_PROD } = require("../config/app");

// ----------------------------------------------------------------------------

exports.catchAsync =
  (handler) =>
  (...args) =>
    handler(...args).catch(args[2]);

// ----------------------------------------------------------------------------

exports.notFound = (_req, res, _next) => {
  return res.status(404).json(createResponse(false, { message: "Not found" }));
};

// ----------------------------------------------------------------------------

exports.catchUnhandledErrors = (err, req, res, next) => {
  if (!err.status) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new BadRequest(`Data validation error. ${err.message}`));
    } else if (err instanceof mongoose.Error.CastError) {
      return next(new BadRequest("Given ID is invalid"));
    } else if (err instanceof multer.MulterError) {
      return next(new BadRequest(err.message));
    }

    // unknown error
    return next(err);
  }

  // operational error
  return next(err);
};

// ----------------------------------------------------------------------------

exports.serverError = (err, _req, res, _next) => {
  if (!IN_PROD) {
    console.log(err.stack);
  }

  if (err.status)
    return res
      .status(err.status)
      .json(createResponse(false, { message: err.message }));
  return res
    .status(500)
    .json(createResponse(false, { message: "Internal server error" }));
};
