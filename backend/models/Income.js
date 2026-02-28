const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  year: Number,
  month: Number,
  amount: Number,
});

module.exports = mongoose.model("Income", incomeSchema);