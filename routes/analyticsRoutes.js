const express = require("express");
const router = express.Router();
const {
  getFinancialSummary,
  getSpendingBreakdown,
  getMonthOverMonth,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/summary", getFinancialSummary);
router.get("/breakdown", getSpendingBreakdown);
router.get("/month-over-month", getMonthOverMonth);

module.exports = router;
