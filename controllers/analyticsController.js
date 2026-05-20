const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

exports.getFinancialSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    let matchStage = { user: new mongoose.Types.ObjectId(req.user._id) };

    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    const summary = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          totalExpenses: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
    ]);

    const data = summary[0] || { totalIncome: 0, totalExpenses: 0 };
    res.json({
      status: "success",
      data: {
        totalIncome: data.totalIncome,
        totalExpenses: data.totalExpenses,
        netBalance: data.totalIncome - data.totalExpenses,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getSpendingBreakdown = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    let matchStage = {
      user: new mongoose.Types.ObjectId(req.user._id),
      type: "expense",
    };

    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    const breakdown = await Transaction.aggregate([
      { $match: matchStage },
      { $group: { _id: "$category", amount: { $sum: "$amount" } } },
    ]);

    const totalExpenseResult = await Transaction.aggregate([
      { $match: matchStage },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpense = totalExpenseResult[0]?.total || 0;

    const data = breakdown.map((item) => ({
      category: item._id,
      amount: item.amount,
      percentage:
        totalExpense > 0
          ? parseFloat(((item.amount / totalExpense) * 100).toFixed(2))
          : 0,
    }));

    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
};

exports.getMonthOverMonth = async (req, res, next) => {
  try {
    const monthsConfig = parseInt(req.query.months) || 6;
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsConfig);

    const history = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          date: { $gte: cutoffDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          income: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] },
          },
          expenses: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] },
          },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    const formattedData = history.map((item) => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      income: item.income,
      expenses: item.expenses,
    }));

    res.json({ status: "success", data: formattedData });
  } catch (err) {
    next(err);
  }
};
