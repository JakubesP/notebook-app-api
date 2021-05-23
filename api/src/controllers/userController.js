const User = require("../models/userModel");
const handlerFactory = require("./handlerFactory");
const createResponse = require("../utils/createResponse");

const { catchAsync } = require("../middleware/errors");
const { NotFound } = require("../utils/errors");
const { userSchema } = require("../validation/user");

// ----------------------------------------------------------------------------

exports.beforeWrite = handlerFactory.validate(userSchema);
exports.createOne = handlerFactory.createOne(User);
exports.getAll = handlerFactory.getAll(User);
exports.getOne = handlerFactory.getOne(User);
exports.updateOne = handlerFactory.updateOne(User);
exports.deleteOne = handlerFactory.deleteOne(User);

exports.getMe = catchAsync(async (req, res, next) => {
  const me = await User.findOne({ _id: req.session.userId });
  if (!me) return next(NotFound());
  return res.status(200).json(createResponse(true, { doc: me }));
});
