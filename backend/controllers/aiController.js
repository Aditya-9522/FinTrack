console.log("RULE BASED AI CONTROLLER LOADED");

const Budget = require("../models/Budget");
const Income = require("../models/Income");

// Rule-based financial advice engine
function generateFinancialAdvice(income, budgets, remaining) {

  const advice = [];

  // Calculate key metrics
  const totalAllocated = budgets.reduce(
    (sum, b) => sum + (b.allocatedAmount || 0),
    0
  );

  const savingsRate = income > 0 ? (remaining / income) * 100 : 0;
  const allocationRate = income > 0 ? (totalAllocated / income) * 100 : 0;

  // Define categories
  const essentialCategories = ['food','rent','utilities','transportation','healthcare','fees'];
  const lifestyleCategories = ['entertainment','shopping','dining','travel'];

  // 🔥 Use subCategory safely
  const essentialBudgets = budgets.filter(b =>
    essentialCategories.some(cat =>
      (b.subCategory || "").toLowerCase().includes(cat)
    )
  );

  const lifestyleBudgets = budgets.filter(b =>
    lifestyleCategories.some(cat =>
      (b.subCategory || "").toLowerCase().includes(cat)
    )
  );

  const essentialTotal = essentialBudgets.reduce(
    (sum, b) => sum + (b.allocatedAmount || 0),
    0
  );

  const lifestyleTotal = lifestyleBudgets.reduce(
    (sum, b) => sum + (b.allocatedAmount || 0),
    0
  );

  /* ---------------- RULES ---------------- */

  // Rule 1: Savings Rate
  if (savingsRate < 10) {
    advice.push("• Save at least 10-20% of your income. Build an emergency fund covering 3-6 months of expenses.");
  } else if (savingsRate > 30) {
    advice.push("• Excellent savings rate! Consider investing excess savings in mutual funds, PPF, or index funds.");
  } else {
    advice.push("• Good savings discipline! Continue building long-term investments steadily.");
  }

  // Rule 2: Allocation Rate
  if (allocationRate < 70) {
    advice.push(`• You're budgeting only ${Math.round(allocationRate)}% of your income. Allocate the remaining balance strategically.`);
  } else if (allocationRate > 95) {
    advice.push("• Your budget is very tight. Reduce non-essential allocations or explore income growth opportunities.");
  }

  // Rule 3: Essential vs Lifestyle
  const essentialRate = income > 0 ? (essentialTotal / income) * 100 : 0;

  if (essentialRate > 60) {
    advice.push(`• Essential expenses are high (${Math.round(essentialRate)}%). Review fixed costs like rent or utilities.`);
  } else if (lifestyleTotal > essentialTotal * 0.5) {
    advice.push("• Lifestyle spending is significant. Consider following the 50/30/20 budgeting rule.");
  }

  // Rule 4: High Spending Subcategory
  const highSpending = budgets.filter(
    b => b.allocatedAmount > income * 0.15
  );

  if (highSpending.length > 0) {
    const category =
      highSpending[0].subCategory ||
      highSpending[0].parentCategory ||
      "One category";

    advice.push(`• ${category} allocation is relatively high. Review if you can optimize this spending.`);
  }

  // Rule 5: Overall Health
  if (remaining < 0) {
    advice.push("• You are overspending. Reduce non-essential budgets immediately.");
  } else if (remaining > income * 0.3) {
    advice.push("• You have surplus funds. Consider investments, debt repayment, or retirement planning.");
  } else {
    advice.push("• Balanced budgeting! Monitor actual expenses to stay within allocations.");
  }

  // Ensure minimum 3 suggestions
  while (advice.length < 3) {
    advice.push("• Track weekly spending to improve financial awareness.");
  }

  return advice.slice(0, 5);
}

exports.getAIAdvice = async (req, res) => {
  try {
    const { year, month } = req.query;
    const userId = req.user;

    if (!year || !month) {
      return res.status(400).json({ error: "Year and month are required" });
    }

    const incomeDoc = await Income.findOne({ userId, year, month });
    const budgets = await Budget.find({ userId, year, month });

    const income = incomeDoc ? incomeDoc.amount : 0;

    if (income === 0) {
      return res.json({
        advice: "• Please set your monthly income first to receive financial advice."
      });
    }

    const totalAllocated = budgets.reduce(
      (sum, b) => sum + (b.allocatedAmount || 0),
      0
    );

    const remaining = income - totalAllocated;

    const advice = generateFinancialAdvice(income, budgets, remaining);

    res.json({ advice: advice.join("\n") });

  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(500).json({
      error: "Failed to generate financial advice. Please try again later."
    });
  }
};