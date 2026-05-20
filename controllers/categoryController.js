const Category = require("../models/Category");

const DEFAULT_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Health",
  "Shopping",
  "Travel",
  "Leisure",
  "Other",
];

exports.getCategories = async (req, res, next) => {
  try {
    const customCategories = await Category.find({ user: req.user._id }).select(
      "name _id",
    );
    const customList = customCategories.map((c) => ({
      id: c._id,
      name: c.name,
      type: "custom",
    }));
    const defaultList = DEFAULT_CATEGORIES.map((c) => ({
      id: null,
      name: c,
      type: "default",
    }));

    res.json({ status: "success", data: [...defaultList, ...customList] });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const trimmedName = name.trim();

    // Check if it hits default categories
    if (
      DEFAULT_CATEGORIES.some(
        (c) => c.toLowerCase() === trimmedName.toLowerCase(),
      )
    ) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Category already exists as a default category",
        });
    }

    // Check if custom category exists for this user
    const exists = await Category.findOne({
      user: req.user._id,
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
    });
    if (exists) {
      return res
        .status(400)
        .json({ status: "error", message: "Custom category already exists" });
    }

    const category = await Category.create({
      name: trimmedName,
      user: req.user._id,
    });
    res
      .status(201)
      .json({
        status: "success",
        data: { id: category._id, name: category.name, type: "custom" },
      });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Custom category not found or unauthorized",
        });
    }

    category.name = name.trim();
    await category.save();
    res.json({
      status: "success",
      data: { id: category._id, name: category.name, type: "custom" },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!category) {
      return res
        .status(404)
        .json({
          status: "error",
          message: "Custom category not found or unauthorized",
        });
    }
    res.json({ status: "success", message: "Category deleted successfully" });
  } catch (err) {
    next(err);
  }
};
