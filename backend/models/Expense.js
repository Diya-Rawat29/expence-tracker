const mongoose = require('mongoose');
const SchemaOptions = {
  toJSON: { virtuals: true, transform: (doc, ret) => { delete ret._id; delete ret.__v; } }
};

const ExpenseSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  time: String,
  category: String,
  paymentMode: String,
  receipt: String,
  isRecurring: Boolean,
  frequency: String,
  status: { type: String, default: 'Pending' },
  userId: String,
  notes: String,
  createdAt: String,
  updatedAt: String
}, SchemaOptions);

module.exports = mongoose.model('Expense', ExpenseSchema);
