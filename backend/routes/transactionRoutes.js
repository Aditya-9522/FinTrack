const express = require("express");
const router = express.Router();
const auth = require("../config/authMiddleware");
const { addTransaction, getTransactions, getAnalytics, getCategoryAnalytics, getMonthlyAnalytics} = require("../controllers/transactionController");

router.post("/add", auth, addTransaction);
router.get("/all", auth, getTransactions);
router.get("/analytics", auth, getAnalytics);
router.get("/category", auth, getCategoryAnalytics);
router.get("/monthly", auth, getMonthlyAnalytics);

module.exports = router;
