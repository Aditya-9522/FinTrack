const Income = require("../models/Income");
const Budget = require("../models/Income")

exports.setIncome = async (req, res) => {
  try {

    const { year, month, amount } = req.body;
    const userId = req.user;

    if (!year || !month || !amount) {
      return res.status(400).json({ error: "All fields required" });
    }

    // Check if income already exists
    let incomeDoc = await Income.findOne({ userId, year, month });

    if (incomeDoc) {
      // ADD to existing income
      incomeDoc.amount += Number(amount);
      await incomeDoc.save();
    } else {
      // Create new if not exists
      incomeDoc = new Income({
        userId,
        year,
        month,
        amount: Number(amount)
      });

      await incomeDoc.save();
    }

    res.json({ message: "Income updated successfully", amount: incomeDoc.amount });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getIncome = async (req, res) => {
  try {

    const { year, month } = req.query;
    const userId = req.user;

    let incomeDoc = await Income.findOne({ userId, year, month });

    // If already exists, return it
    if (incomeDoc) {
      return res.json({ amount: incomeDoc.amount });
    }

    // Get previous month
    let prevMonth = month - 1;
    let prevYear = year;

    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear = year - 1;
    }

    const prevIncomeDoc = await Income.findOne({
      userId,
      year: prevYear,
      month: prevMonth
    });

    if (!prevIncomeDoc) {
      return res.json({ amount: 0 });
    }

    const prevBudgets = await Budget.find({
      userId,
      year: prevYear,
      month: prevMonth
    });

    const totalAllocated = prevBudgets.reduce(
      (sum, b) => sum + b.allocatedAmount,
      0
    );

    const remaining = prevIncomeDoc.amount - totalAllocated;

    // ONLY carry remaining
    const newIncomeAmount = remaining > 0 ? remaining : 0;

    const newIncome = new Income({
      userId,
      year,
      month,
      amount: newIncomeAmount
    });

    await newIncome.save();

    res.json({ amount: newIncomeAmount });

  } catch (err) {
    console.error("Income Error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};