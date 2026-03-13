const mongoose = require('mongoose');

// Dynamic model generator for MVP generic data structures
const createGenericModel = (modelName) => {
  const schema = new mongoose.Schema({
    id: { type: String, unique: true, required: true }
  }, { 
    strict: false, // Allow any fields (since it's replacing localStorage JSON)
    toJSON: { 
      virtuals: true, 
      transform: (doc, ret) => { 
        delete ret._id; 
        delete ret.__v; 
      } 
    }
  });

  return mongoose.models[modelName] || mongoose.model(modelName, schema);
};

module.exports = {
  Category: createGenericModel('Category'),
  Budget: createGenericModel('Budget'),
  Income: createGenericModel('Income'),
  Approval: createGenericModel('Approval'),
  Notification: createGenericModel('Notification'),
  Settings: createGenericModel('Settings')
};
