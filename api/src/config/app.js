const { NODE_ENV = "development", PORT = 3000 } = process.env;

// ----------------------------------------------------------------------------

module.exports = {
  NODE_ENV,
  PORT,
  IN_PROD: NODE_ENV === "production",
};
