const Note = require("../models/noteModel");
const handlerFactory = require("./handlerFactory");
const { noteSchema } = require("../validation/note");

// ----------------------------------------------------------------------------

exports.beforeWrite = handlerFactory.validate(noteSchema);
exports.createOne = handlerFactory.createOne(Note);
exports.getAll = handlerFactory.getAll(Note);
exports.getOne = handlerFactory.getOne(Note);
exports.updateOne = handlerFactory.updateOne(Note);
exports.deleteOne = handlerFactory.deleteOne(Note);
