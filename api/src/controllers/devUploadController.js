// NOTE
// Code below was created only for development purposes.

const multer = require("multer");
const uuid = require("uuid").v4;
const fs = require("fs");
const path = require("path");
const rimaf = require("rimraf");

const { UPLOAD_BYTES_LIMIT } = require("../config/uploads");
const Upload = require("../models/uploadModel");
const handlerFactory = require("./handlerFactory");
const { catchAsync } = require("../middleware/errors");
const { NotFound, BadRequest } = require("../utils/errors");
const sendFile = require("../utils/sendFile");
const createResponse = require("../utils/createResponse");
const getEndpointURL = require("../utils/getEndpointURL");

// ----------------------------------------------------------------------------

const UPLOADS_DIR_PATH = path.join(__dirname, "..", "..", "uploads");

// ----------------------------------------------------------------------------

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(UPLOADS_DIR_PATH))
      return cb(new Error("Uploads dir do not exist"), null);

    cb(null, UPLOADS_DIR_PATH);
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    const fparts = originalname.split(".");

    const ext = fparts.lenght === 2 ? fparts[1] : "jpg";
    const dirName = req.session.userId;

    if (!fs.existsSync(path.join(UPLOADS_DIR_PATH, dirName)))
      fs.mkdirSync(path.join(UPLOADS_DIR_PATH, dirName));

    req.filename = `${uuid()}.${ext}`;
    cb(null, `${dirName}/${req.filename}`);
  },
});

// ----------------------------------------------------------------------------

exports.upload = multer({
  storage,
  limits: { fileSize: UPLOAD_BYTES_LIMIT },
}).single("file");

exports.createOne = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new BadRequest("No file given"));

  req.body = {};
  req.body.url = getEndpointURL(req, `api/v1/uploads/files/${req.filename}`);

  req.body.owner = req.session.userId;

  const doc = await Upload.create(req.body);

  return res.status(201).json(
    createResponse(true, {
      file: {
        url: doc.url,
      },
    })
  );
});

// ----------------------------------------------------------------------------

exports.getAll = handlerFactory.getAll(Upload);
exports.getOne = handlerFactory.getOne(Upload);

exports.getFile = catchAsync(async (req, res, next) => {
  try {
    const fileDirectory = path.join(UPLOADS_DIR_PATH, req.session.userId);
    await sendFile(req.params.name, fileDirectory, res);
  } catch (e) {
    return next(new NotFound("Resource is unreachable"));
  }
});

// ----------------------------------------------------------------------------

exports.deleteOne = catchAsync(async (req, res, next) => {
  const userId = req.session.userId;
  const doc = await Upload.findOne({ _id: req.params.id, owner: userId });
  if (!doc) return next(new NotFound("Resource is unreachable"));

  const url = doc.url.split("/");
  const file = url[url.length - 1];

  const fullPath = path.join(UPLOADS_DIR_PATH, userId, file);

  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

  await doc.deleteOne();

  return res.status(204).json(createResponse(true, { data: null }));
});

// ----------------------------------------------------------------------------
// delete all user uploads

exports.deleteUserUploads = (userId) => {
  const dir = path.join(UPLOADS_DIR_PATH, userId);
  if (fs.existsSync(dir)) fs.rmdirSync(dir, { recursive: true });
};
