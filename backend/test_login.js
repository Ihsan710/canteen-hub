require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  try {
    const email = 'admin@college.edu';
    const password = 'admin'; 
    const user = await User.findOne({ email });
    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey', { expiresIn: '1d' });
    console.log('token:', token);
  } catch (err) {
    console.log("LOGIN ERROR:", err);
  }
  process.exit();
}
test();
