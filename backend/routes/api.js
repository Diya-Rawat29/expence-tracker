const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Expense = require('../models/Expense');
const { Category, Budget, Notification, Income } = require('../models/GenericModels');

const models = {
  users: User,
  expenses: Expense,
  categories: Category,
  budgets: Budget,
  notifications: Notification,
  incomes: Income
};

// Generic GET all
router.get('/:collection', async (req, res) => {
  const Model = models[req.params.collection];
  if (!Model) return res.status(404).json({ error: 'Collection not found' });
  try {
    const data = await Model.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generic POST (Create)
router.post('/:collection', async (req, res) => {
  const Model = models[req.params.collection];
  if (!Model) return res.status(404).json({ error: 'Collection not found' });
  try {
    const newItem = new Model(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Generic PUT (Update)
router.put('/:collection/:id', async (req, res) => {
  const Model = models[req.params.collection];
  if (!Model) return res.status(404).json({ error: 'Collection not found' });
  try {
    const updated = await Model.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Generic DELETE
router.delete('/:collection/:id', async (req, res) => {
  const Model = models[req.params.collection];
  if (!Model) return res.status(404).json({ error: 'Collection not found' });
  try {
    const deleted = await Model.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Special Login Route
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password, isActive: true });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
