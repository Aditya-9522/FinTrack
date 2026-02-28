const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  parentCategory: { type: String, required: true },   // Kid-1, Wife
  subCategory: { type: String, required: true },      // Fees, Shopping

  allocatedAmount: { type: Number, required: true },

  year: Number,
  month: Number,
}, { timestamps: true });

module.exports = mongoose.model("Budget", budgetSchema);