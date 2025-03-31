require('dotenv').config();
const mongoose = require('mongoose');

const test = async () => {
    try {
        console.log('🔄 Connecting...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected successfully!');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
};

test();
