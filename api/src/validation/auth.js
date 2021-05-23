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

const password = Joi.string()
  .min(8)
  .max(BCRYPT_MAX_BYTES, "utf8")
  .regex(/^(?=.*?[\p{Lu}])(?=.*?[\p{Ll}])(?=.*?\d).*$/u)
  .message(
    '"{#label}" must contain one uppercase letter, one lowercase letter, and one digit'
  )
  .required();

const passwordConfirmation = Joi.valid(Joi.ref("password")).required();

// ----------------------------------------------------------------------------

exports.registerSchema = Joi.object({
  email,
  password,
  passwordConfirmation,
});

exports.loginSchema = Joi.object({
  email,
  password,
});

exports.updatePasswordSchema = Joi.object({
  currentPassword: password,
  password,
  passwordConfirmation,
});

exports.resetPasswordSchema = Joi.object({
  password,
  passwordConfirmation,
});
