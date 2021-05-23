const multer = require("multer");
const uuid = require("uuid").v4;
const AWS = require("aws-sdk");

const {
  UPLOAD_BYTES_LIMIT,
  AWS_ID,
  AWS_SECRET,
  AWS_BUCKET_NAME,
} = require("../config/uploads");
const Upload = require("../models/uploadModel");
const handlerFactory = require("./handlerFactory");
const { catchAsync } = require("../middleware/errors");
const { NotFound, BadRequest, ServerError } = require("../utils/errors");
const createResponse = require("../utils/createResponse");
const getEndpointURL = require("../utils/getEndpointURL");

// ----------------------------------------------------------------------------

const s3 = new AWS.S3({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_SECRET,
});

// ----------------------------------------------------------------------------

const storage = multer.memoryStorage({
  destination: (_req, _file, _cb) => {
    db(null, "");
  },
});

exports.upload = multer({
  storage,
  limits: { fileSize: UPLOAD_BYTES_LIMIT },
}).single("file");

// ----------------------------------------------------------------------------

exports.createOne = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new BadRequest("No file given"));
  }

  let myFile = req.file.originalname.split(".");
  const fileType = myFile[myFile.length - 1];

  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: `${req.session.userId}/${uuid()}.${fileType}`,
    Body: req.file.buffer,
  };

  s3.upload(params, async (error, data) => {
    if (error) res.status(500).send(error);

    req.body = {};

    const file = data.Key.split("/")[1];
    req.body.url = getEndpointURL(req, `api/v1/uploads/files/${file}`);
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
});

// ----------------------------------------------------------------------------

exports.getAll = handlerFactory.getAll(Upload);
exports.getOne = handlerFactory.getOne(Upload);

// ----------------------------------------------------------------------------

exports.getFile = catchAsync(async (req, res, next) => {
  const fileDirectory = req.session.userId;
  const fileName = req.params.name;
  const key = `${fileDirectory}/${fileName}`;

  const downloadParams = {
    Key: key,
    Bucket: AWS_BUCKET_NAME,
  };

  const readStream = s3
    .getObject(downloadParams)
    .createReadStream()
    .on("error", ({ statusCode }) => {
      // network error
      if (!statusCode) {
        return next(new ServerError());
      }
      // not found or access denied
      return next(new NotFound("Resource is unreachable"));
    });

  return readStream.pipe(res);
});

// ----------------------------------------------------------------------------

const deleteObject = (downloadParams) => {
  return new Promise((resolve, reject) => {
    s3.deleteObject(downloadParams, async (error, _data) => {
      if (error) return reject();
      return resolve();
    });
  });
};

exports.deleteOne = catchAsync(async (req, res, next) => {
  const userId = req.session.userId;
  const doc = await Upload.findOne({ _id: req.params.id, owner: userId });
  if (!doc) return next(new NotFound("Resource is unreachable"));

  const url = doc.url.split("/");
  const fileName = url[url.length - 1];
  const key = `${req.session.userId}/${fileName}`;

  const downloadParams = {
    Key: key,
    Bucket: AWS_BUCKET_NAME,
  };

  await deleteObject(downloadParams);
  await doc.deleteOne();
  return res.status(204).json(createResponse(true, { data: null }));
});

// ----------------------------------------------------------------------------
// delete all user uploads

exports.deleteUserUploads = async (userId) => {
  const listParams = {
    Bucket: AWS_BUCKET_NAME,
    Prefix: `${userId}/`,
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (listedObjects.Contents.length === 0) return;

  const deleteParams = {
    Bucket: AWS_BUCKET_NAME,
    Delete: { Objects: [] },
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });

  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await emptyS3Directory(userId);
};
