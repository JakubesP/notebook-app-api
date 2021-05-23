const Joi = require("@hapi/joi");
const { BCRYPT_MAX_BYTES } = require("../config/auth");

// ----------------------------------------------------------------------------

const email = Joi.string()
  .email()
  .min(8)
  .max(254)
  .lowercase()
  .trim()
  .required();
const password = Joi.string().min(3).max(BCRYPT_MAX_BYTES, "utf-8").required();
const role = Joi.string().valid("user", "admin");

// ----------------------------------------------------------------------------

exports.userSchema = Joi.object({
  email,
  password,
  role,
});
