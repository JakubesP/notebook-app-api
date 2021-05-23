const express = require("express");
const { guest, auth } = require("../middleware/auth");

const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", guest, authController.signup);
router.post("/signin", guest, authController.signin);
router.post("/logout", auth, authController.logout);
router.patch("/updatePassword", auth, authController.updatePassword);
router.post("/forgotPassword", guest, authController.forgotPassword);
router.patch("/resetPassword/:token", guest, authController.resetPassword);

module.exports = router;
