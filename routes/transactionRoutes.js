const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");
const { validate, schemas } = require("../middleware/validate");

router.use(protect); // Secure all transaction endpoints

router
  .route("/")
  .post(validate(schemas.transaction), createTransaction)
  .get(getTransactions);

router
  .route("/:id")
  .get(getTransactionById)
  .put(validate(schemas.transaction), updateTransaction)
  .delete(deleteTransaction);

module.exports = router;
