const { query, validationResult } = require("express-validator");
const createResponse = require("../utils/createResponse");

exports.queryParams = [
  query("page").optional().isInt({ gt: 0, lt: 1000 }),
  query("limit").optional().isInt({ gt: 0, lt: 1000 }),
  query("fields").optional().trim().isLength({ min: 1 }).isString(),
  query("sort").optional().trim().isLength({ min: 1 }).isString(),
];

exports.queryMiddleware = (req, res, next) => {
  try {
    validationResult(req).throw();
  } catch ({ errors }) {
    return res.status(201).json(
      createResponse(false, {
        message: "Query validation error",
        details: errors,
      })
    );
  }
  next();
};
