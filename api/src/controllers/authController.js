const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const { catchAsync } = require("../middleware/errors");
const { validate } = require("../validation/joi");
const createResponse = require("../utils/createResponse");
const getEndpointURL = require("../utils/getEndpointURL");

const {
  registerSchema,
  loginSchema,
  updatePasswordSchema,
  resetPasswordSchema,
} = require("../validation/auth");

const {
  BadRequest,
  Unauthorized,
  NotFound,
  ServerError,
} = require("../utils/errors");
const { logIn, logOut } = require("../utils/auth");
const sendEmail = require("../utils/sendEmail");

const {
  RESET_PASSWORD_SECRET,
  RESET_PASSWORD_SECRET_LIFETIME,
} = require("../config/auth");

// ----------------------------------------------------------------------------

exports.signup = catchAsync(async (req, res, next) => {
  await validate(registerSchema, req.body);
  const { email, name, password } = req.body;
  const found = await User.exists({ email });

  if (found) throw new BadRequest("Invalid email");

  const user = await User.create({ email, name, password });

  logIn(req, user);

  res.status(201).json(createResponse(true, { data: { user } }));
});

// ----------------------------------------------------------------------------

exports.signin = catchAsync(async (req, res, next) => {
  await validate(loginSchema, req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchesPassword(password)))
    throw new Unauthorized("Incorrect email or password");

  logIn(req, user);

  res.status(200).json(createResponse(true, { data: { user } }));
});

// ----------------------------------------------------------------------------

exports.logout = catchAsync(async (req, res, next) => {
  await logOut(req, res);

  res.status(200).json(createResponse(true));
});

// ----------------------------------------------------------------------------

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new NotFound("Invalid email"));

  const resetToken = user.generatePasswordResetToken();
  const resetURL = getEndpointURL(
    req,
    `api/v1/auth/resetPassword/${resetToken}`
  );
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to:\n${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token (valid for ${
        RESET_PASSWORD_SECRET_LIFETIME / 60
      } min)`,
      message,
    });
  } catch (e) {
    return next(new ServerError("Cannot send email. Try again later"));
  }

  return res.status(200).json(
    createResponse(true, {
      message: "Refresh token sent to your email address",
    })
  );
});

// ----------------------------------------------------------------------------

exports.resetPassword = catchAsync(async (req, res, next) => {
  const errorMsg = "Incorrect or expired refresh token";

  const token = req.params.token;

  let data;
  try {
    data = await promisify(jwt.verify)(token, RESET_PASSWORD_SECRET);
  } catch (e) {
    return next(new BadRequest(errorMsg));
  }

  const user = await User.findById(data.id);

  if (!user) return next(new BadRequest(errorMsg));

  await validate(resetPasswordSchema, req.body);

  if (user.changedPasswordAfter(data.iat))
    return next(new BadRequest(errorMsg));

  user.password = req.body.password;
  await user.save();

  return res
    .status(200)
    .json(createResponse(true, { message: "Password updated successfully" }));
});

// ----------------------------------------------------------------------------

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.session.userId);

  await validate(updatePasswordSchema, req.body);

  if (!(await user.matchesPassword(req.body.currentPassword)))
    return next(new Unauthorized("Incorrect password"));

  user.password = req.body.password;
  await user.save();

  return res.status(200).json(createResponse(true));
});
