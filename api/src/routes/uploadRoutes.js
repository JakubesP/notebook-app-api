const express = require("express");

const { access } = require("../middleware/auth");

const { AWS_UPLOADS } = require("../config/uploads");
const uploadController = AWS_UPLOADS
  ? require("../controllers/uploadController")
  : require("../controllers/devUploadController");

const {
  queryParams,
  queryMiddleware,
} = require("../validation/queryValidation");

const router = express.Router();

// ----------------------------------------------------------------------------

// CREATE
router.post(
  "/",
  access(["createOwn"], "upload"),
  uploadController.upload,
  uploadController.createOne
);

// GET ALL
router.get(
  "/",
  access(["readOwn"], "upload"),
  queryParams,
  queryMiddleware,
  uploadController.getAll
);

// GET
router.get("/:id", access(["readOwn"], "upload"), uploadController.getOne);

// DELETE
router.delete(
  "/:id",
  access(["deleteOwn"], "upload"),
  uploadController.deleteOne
);

// ----------------------------------------------------------------------------

// GET FILE
router.get(
  "/files/:name",
  access(["readOwn"], "upload"),
  uploadController.getFile
);

module.exports = router;
