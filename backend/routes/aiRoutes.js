const express = require("express");
const router = express.Router();

const verifyToken = require("../config/authMiddleware");

const { getAIAdvice } = require("../controllers/aiController");

// GET /ai/advice
router.get("/advice", verifyToken, getAIAdvice);

module.exports = router;