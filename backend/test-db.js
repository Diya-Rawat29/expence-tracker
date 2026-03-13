require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');

async function testConnection() {
  let log = '';
  try {
    const mongoUri = process.env.MONGO_URI;
    log += `Attempting to connect to: ${mongoUri.replace(/:([^:@]{3,})@/, ':***@')}\n`;
    await mongoose.connect(mongoUri);
    log += '✅ Successfully connected to MongoDB Database!\n';
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    log += 'Available collections: ' + collections.map(c => c.name).join(', ') + '\n';
    
    // Test fetch users
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    log += `Found ${users.length} users in the database.\n`;
    
    log += 'Database connection is working perfectly.\n';
    
    fs.writeFileSync('db-test-result.txt', log, 'utf8');
    process.exit(0);
  } catch (error) {
    log += '❌ Failed to connect to MongoDB:\n' + error.toString() + '\n';
    fs.writeFileSync('db-test-result.txt', log, 'utf8');
    process.exit(1);
  }
}

testConnection();
