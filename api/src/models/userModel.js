const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  RESET_PASSWORD_SECRET,
  RESET_PASSWORD_SECRET_LIFETIME,
} = require("../config/auth");

const Note = require("./noteModel");
const Upload = require("./uploadModel");

const { IN_PROD } = require("../config/app");
const { AWS_UPLOADS } = require("../config/uploads");
const { deleteUserUploads } = AWS_UPLOADS
  ? require("../controllers/uploadController")
  : require("../controllers/devUploadController");

// ----------------------------------------------------------------------------

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide an email"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please provide an user password"],
      minLength: 8,
    },
    passwordChangedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// ----------------------------------------------------------------------------

userSchema.set("toJSON", {
  transform: (doc, { __v, password, ...rest }, options) => rest,
});

// ----------------------------------------------------------------------------

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function (doc) {
    const userId = doc._id;
    try {
      await Note.deleteMany({ owner: userId });
      await Upload.deleteMany({ owner: userId });
      deleteUserUploads(userId.toString());
    } catch (err) {
      if (!IN_PROD) console.log(`User cascade delete error: ${err}`);
    }
  }
);

// ----------------------------------------------------------------------------

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// ----------------------------------------------------------------------------

userSchema.methods.matchesPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// ----------------------------------------------------------------------------

userSchema.methods.generatePasswordResetToken = function () {
  return jwt.sign({ id: this._id }, RESET_PASSWORD_SECRET, {
    expiresIn: RESET_PASSWORD_SECRET_LIFETIME,
  });
};

// ----------------------------------------------------------------------------

const crudAccessPlugin = require("./crudAccessPlugin");
userSchema.plugin(crudAccessPlugin);

// ----------------------------------------------------------------------------

const User = mongoose.model("User", userSchema);

module.exports = User;
