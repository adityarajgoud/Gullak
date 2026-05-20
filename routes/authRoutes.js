const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validate, schemas } = require("../middleware/validate");

router.post("/register", validate(schemas.register), registerUser);
router.post("/login", validate(schemas.login), loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, validate(schemas.updateProfile), updateProfile);
router.put(
  "/change-password",
  protect,
  validate(schemas.changePassword),
  changePassword,
);

module.exports = router;
