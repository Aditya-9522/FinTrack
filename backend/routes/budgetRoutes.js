const express = require("express");
const router = express.Router();
const auth = require("../config/authMiddleware");
const {
  setBudget,
  getBudgets
} = require("../controllers/budgetController");

router.post("/set", auth, setBudget);
router.get("/all", auth, getBudgets);

module.exports = router;