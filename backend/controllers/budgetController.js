const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// SET OR UPDATE BUDGET
exports.setBudget = async (req, res) => {
  try {

    const { parentCategory, subCategory, allocatedAmount, year, month } = req.body;

    if (!parentCategory || !subCategory || !allocatedAmount) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newBudget = new Budget({
      userId: req.user,
      parentCategory,
      subCategory,
      allocatedAmount,
      year,
      month
    });

    await newBudget.save();

    res.json({ message: "Budget saved successfully" });

  } catch (err) {
    console.error("SET BUDGET ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getBudgets = async (req, res) => {
  try {

    const { year, month } = req.query;

    const budgets = await Budget.find({
      userId: req.user,
      year,
      month
    });

    res.json(budgets);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};