const express = require("express");
const session = require("express-session");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const noteRouter = require("./routes/noteRoutes");
const uploadRouter = require("./routes/uploadRoutes");

const sessionConfig = require("./config/session");
const {
  notFound,
  catchUnhandledErrors,
  serverError,
} = require("./middleware/errors");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

// ----------------------------------------------------------------------------

module.exports = async (redisStore) => {
  const app = express();

  app.use(
    rateLimit({
      max: 100,
      windowMs: 60 * 60 * 1000,
      message: "Too many request from this IP, please try again in a hour",
    })
  );

  app.use(express.json());

  app.use(session({ ...sessionConfig, store: redisStore }));

  app.use(helmet());
  app.use(express.json({ limit: "10kb" }));

  app.use(mongoSanitize());

  app.use(xss());

  // api
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/notes", noteRouter);
  app.use("/api/v1/uploads", uploadRouter);

  // errors middlewares
  app.use(notFound);
  app.use(catchUnhandledErrors);
  app.use(serverError);

  return app;
};
