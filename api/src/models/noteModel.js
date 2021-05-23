const mongoose = require("mongoose");

// ----------------------------------------------------------------------------

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Please provide a content"],
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Note have to contain owner"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// ----------------------------------------------------------------------------

noteSchema.set("toJSON", {
  transform: (doc, { __v, owner, ...rest }, options) => rest,
});

// ----------------------------------------------------------------------------

const crudAccessPlugin = require("./crudAccessPlugin");
noteSchema.plugin(crudAccessPlugin);

// ----------------------------------------------------------------------------

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
