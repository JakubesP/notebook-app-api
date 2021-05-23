const { REDIS_PORT = 6379, REDIS_HOST, REDIS_PASSWORD } = process.env;

// ----------------------------------------------------------------------------

module.exports = {
  port: REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
};
