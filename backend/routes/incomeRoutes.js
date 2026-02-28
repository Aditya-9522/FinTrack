const express = require("express");
const router = express.Router();
const auth = require("../config/authMiddleware");
const {
  setIncome,
  getIncome
} = require("../controllers/incomeController");

router.post("/set", auth, setIncome);
router.get("/get", auth, getIncome);

module.exports = router;