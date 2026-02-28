const Transaction = require("../models/Transaction");

//generate month filter
const getMonthFilter = (month) => {
  if (!month) return {};

  const startDate = new Date(month + "-01");
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  return {
    date: {
      $gte: startDate,
      $lt: endDate
    }
  };
};

// ADD TRANSACTION
exports.addTransaction = async (req, res) => {
  try {
    const { type, category, amount } = req.body;

    const newTransaction = new Transaction({
      userId: req.user,
      type,
      category,
      amount,
      date: new Date()
    });

    await newTransaction.save();

    res.status(201).json("Transaction added");

  } catch (err) {
    res.status(500).json(err.message);
  }
};
// GET TRANSACTIONS
exports.getTransactions = async (req, res) => {
  try {
    const { month } = req.query;

    const filter = {
      userId: req.user,
      ...getMonthFilter(month)
    };

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 });

    res.json(transactions);

  } catch (err) {
    res.status(500).json(err.message);
  }
};

// DASHBOARD ANALYTICS
exports.getAnalytics = async (req, res) => {
  try {
    const { month } = req.query;

    const filter = {
      userId: req.user,
      ...getMonthFilter(month)
    };

    const transactions = await Transaction.find(filter);

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      if (t.type === "income") totalIncome += t.amount;
      else totalExpense += t.amount;
    });

    const balance = totalIncome - totalExpense;

    res.json({
      totalIncome,
      totalExpense,
      balance,
      totalTransactions: transactions.length
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
};

// CATEGORY ANALYTICS
exports.getCategoryAnalytics = async (req, res) => {
  try {
    const { month } = req.query;

    const filter = {
      userId: req.user,
      ...getMonthFilter(month)
    };

    const transactions = await Transaction.find(filter);

    const categories = {};

    transactions.forEach(t => {
      if (t.type === "expense") {
        if (categories[t.category]) {
          categories[t.category] += t.amount;
        } else {
          categories[t.category] = t.amount;
        }
      }
    });

    res.json(categories);

  } catch (err) {
    res.status(500).json(err.message);
  }
};

// MONTHLY ANALYTICS (all months)
exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user });

    const monthlyData = {};

    transactions.forEach(t => {
      const date = new Date(t.date);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      if (!monthlyData[key]) {
        monthlyData[key] = { income: 0, expense: 0 };
      }

      if (t.type === "income") {
        monthlyData[key].income += t.amount;
      } else {
        monthlyData[key].expense += t.amount;
      }
    });

    res.json(monthlyData);

  } catch (err) {
    res.status(500).json(err.message);
  }
};