const {
  UPLOAD_BYTES_LIMIT = 2000000,
  UPLOADS_STORAGE = "local",

  // for aws uploads
  AWS_ID,
  AWS_SECRET,
  AWS_BUCKET_NAME,
} = process.env;

// ----------------------------------------------------------------------------

module.exports = {
  UPLOADS_STORAGE,
  UPLOAD_BYTES_LIMIT,
  AWS_UPLOADS: UPLOADS_STORAGE === "aws",
  AWS_ID,
  AWS_SECRET,
  AWS_BUCKET_NAME,
};
