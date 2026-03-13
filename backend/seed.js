require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const { Category } = require('./models/GenericModels');
const fs = require('fs');
const path = require('path');

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('Connected to DB for seeding...');
    
    // Seed users
    const usersPath = path.join(__dirname, '../expense-tracker/public/data/users.json');
    if (fs.existsSync(usersPath)) {
      const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      const users = usersData.users || usersData.data || usersData;
      for (const u of users) {
        await User.findOneAndUpdate({ email: u.email }, u, { upsert: true });
      }
      console.log('✅ Users seeded');
    }

    // Seed categories
    const catPath = path.join(__dirname, '../expense-tracker/public/data/categories.json');
    if (fs.existsSync(catPath)) {
      const catData = JSON.parse(fs.readFileSync(catPath, 'utf8'));
      const categories = catData.categories || catData.data || catData;
      for (const c of categories) {
        await Category.findOneAndUpdate({ id: c.id }, c, { upsert: true });
      }
      console.log('✅ Categories seeded');
    }

    console.log('✅ Seeding complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Seeding failed', err);
    process.exit(1);
  });
