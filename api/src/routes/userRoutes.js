const express = require("express");
const { access } = require("../middleware/auth");
const userController = require("../controllers/userController");
const {
  queryParams,
  queryMiddleware,
} = require("../validation/queryValidation");

// ----------------------------------------------------------------------------

const router = express.Router();

// CREATE
router.post(
  "/",
  access(["createAny"], "user"),
  userController.beforeWrite,
  userController.createOne
);

// GET ALL
router.get(
  "/",
  access(["readAny"], "user"),
  queryParams,
  queryMiddleware,
  userController.getAll
);

// GET
router.get("/:id", access(["readAny"], "user"), userController.getOne);

// PATCH
router.patch(
  "/:id",
  access(["updateAny"], "user"),
  userController.beforeWrite,
  userController.updateOne
);

// DELETE
router.delete("/:id", access(["deleteAny"], "user"), userController.deleteOne);

// ----------------------------------------------------------------------------

// GET CURRENT USER
router.get("/me", access(["readOwn"], "user"), userController.getMe);

module.exports = router;
