const mongoose = require('mongoose');

const SchemaOptions = {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
    }
  }
};

const UserSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'employee' },
  currency: { type: String, default: 'INR' },
  theme: { type: String, default: 'dark' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}, SchemaOptions);

module.exports = mongoose.model('User', UserSchema);
