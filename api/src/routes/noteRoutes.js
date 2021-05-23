const express = require("express");

const { access } = require("../middleware/auth");
const noteController = require("../controllers/noteController");
const {
  queryParams,
  queryMiddleware,
} = require("../validation/queryValidation");

// ----------------------------------------------------------------------------

const router = express.Router();

// CREATE
router.post(
  "/",
  access(["createOwn"], "note"),
  noteController.beforeWrite,
  noteController.createOne
);

// GET ALL
router.get(
  "/",
  access(["readOwn"], "note"),
  queryParams,
  queryMiddleware,
  noteController.getAll
);

// GET
router.get("/:id", access(["readOwn"], "note"), noteController.getOne);

// PATCH
router.patch("/:id", access(["updateOwn"], "note"), noteController.updateOne);

// DELETE
router.delete("/:id", access(["deleteOwn"], "note"), noteController.deleteOne);

module.exports = router;
