const Transaction = require("../models/Transaction");

exports.createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json({ status: "success", data: transaction });
  } catch (err) {
    next(err);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = "date",
      order = "desc",
    } = req.query;

    // Data Isolation Query Building
    let query = { user: req.user._id };

    if (type) query.type = type;
    if (category) query.category = { $regex: new RegExp(`^${category}$`, "i") };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Sorting & Pagination
    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      status: "success",
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      data: transactions,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!transaction)
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    res.json({ status: "success", data: transaction });
  } catch (err) {
    next(err);
  }
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true },
    );
    if (!transaction)
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    res.json({ status: "success", data: transaction });
  } catch (err) {
    next(err);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!transaction)
      return res
        .status(404)
        .json({ status: "error", message: "Transaction not found" });
    res.json({
      status: "success",
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
