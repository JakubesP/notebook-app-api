const {
  RESET_PASSWORD_SECRET = "secret",
} = process.env;

// ----------------------------------------------------------------------------

module.exports = {
  BCRYPT_WORK_FACTOR: 12,
  BCRYPT_MAX_BYTES: 72,
  RESET_PASSWORD_SECRET,
  RESET_PASSWORD_SECRET_LIFETIME: 60 * 10
};
