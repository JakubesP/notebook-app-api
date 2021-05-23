const mongoose = require("mongoose");

// ----------------------------------------------------------------------------

const uploadSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Upload have to contain url"],
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Upload have to contain owner"],
    },
  },
  {
    timestamps: true,
  }
);

// ----------------------------------------------------------------------------

uploadSchema.set("toJSON", {
  transform: (doc, { __v, owner, updatedAt, ...rest }, _options) => rest,
});

// ----------------------------------------------------------------------------

const crudAccessPlugin = require("./crudAccessPlugin");
uploadSchema.plugin(crudAccessPlugin);

// ----------------------------------------------------------------------------

const Upload = mongoose.model("Upload", uploadSchema);

module.exports = Upload;
