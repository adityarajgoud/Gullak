const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");
const { validate, schemas } = require("../middleware/validate");

router.use(protect); // Secure all category routes

router
  .route("/")
  .get(getCategories)
  .post(validate(schemas.category), createCategory);

router
  .route("/:id")
  .put(validate(schemas.category), updateCategory)
  .delete(deleteCategory);

module.exports = router;
