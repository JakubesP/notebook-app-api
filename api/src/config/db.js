const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOST ,
  MONGO_PORT = 27017,
  MONGO_DATABASE,
} = process.env;

// ----------------------------------------------------------------------------

module.exports = {
  DB_URL: `mongodb://${MONGO_USERNAME}:${encodeURIComponent(
    MONGO_PASSWORD
  )}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}?authSource=${MONGO_DATABASE}`,
  DB_SETTINGS: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
};
