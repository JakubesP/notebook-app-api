if (process.env.TEST === "true") {
  console.log = () => {};
}

const mongoose = require("mongoose");
const Redis = require("ioredis");
const session = require("express-session");
const connectRedis = require("connect-redis");

// env
const dbConfig = require("./config/db");
const cacheConfig = require("./config/cache");

// app
const createApp = require("./app");

module.exports = async () => {
  // mongodb
  await mongoose.connect(dbConfig.DB_URL, dbConfig.DB_SETTINGS);

  // redis
  const client = new Redis({
    port: cacheConfig.port,
    host: cacheConfig.host,
    password: cacheConfig.password,
  });
  const RedisStore = connectRedis(session);
  const store = new RedisStore({ client });

  // express app & resources
  const app = await createApp(store);

  return app;
};
