const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kadalai_mittai_db';
  const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
  console.log(` Connecting to MongoDB at: ${maskedUri}`);
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` Primary MongoDB Connection Failed (${maskedUri}): ${error.message}`);
    // If Atlas connection fails (e.g. IP whitelist / timeout), fallback to local MongoDB if available
    if (uri.includes('mongodb+srv')) {
      console.log(' Attempting fallback to local MongoDB (mongodb://127.0.0.1:27017/kadalai_mittai_db)...');
      try {
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/kadalai_mittai_db', {
          serverSelectionTimeoutMS: 4000,
        });
        console.log(` Connected to fallback local MongoDB: ${localConn.connection.host}`);
        return;
      } catch (localErr) {
        console.error(` Local fallback failed: ${localErr.message}`);
      }
    }
    console.warn('⚠️ Running server in resilient mode; MongoDB will continue attempting connection in the background.');
  }
};

module.exports = connectDB;
