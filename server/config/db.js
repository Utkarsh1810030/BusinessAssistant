// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('🟡 Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};


module.exports = connectDB;
