require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const FoodItem = require('./models/FoodItem');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const orderRoutes = require('./routes/orders');
const complaintRoutes = require('./routes/complaints');

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/complaints', complaintRoutes);

// Simple health check route
app.get('/', (req, res) => {
  res.send('Canteen API is running...');
});

// Setup Database Connection
async function startDatabase() {
  try {
    if (mongoose.connection.readyState === 1) return; // Already connected
    
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    // Seed default users if this is a fresh database
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const adminPassword = await bcrypt.hash('admin123', salt);
      const studentPassword = await bcrypt.hash('student123', salt);
      const teacherPassword = await bcrypt.hash('teacher123', salt);

      await User.insertMany([
        { name: 'Admin User', email: 'admin@college.edu', password: adminPassword, role: 'Admin', department: 'Administration' },
        { name: 'Student User', email: 'student@college.edu', password: studentPassword, role: 'Student', department: 'Computer Science' },
        { name: 'Teacher User', email: 'teacher@college.edu', password: teacherPassword, role: 'Teacher', department: 'Mathematics' }
      ]);
      console.log('✅ Seeded Default Users');

      await FoodItem.insertMany([
        { name: 'Kerala Parotta with Beef Curry', category: 'Kerala', price: 150, stock: 30, availability: true, image: 'https://www.mcscurry.ca/assets/popular-dishes/kerala-porotta-beef-curry.webp', isSpecial: true, tags: ['Non-Veg', 'Spicy', 'Combo'] },
        { name: 'Malabar Chicken Biryani', category: 'Kerala', price: 180, stock: 25, availability: true, image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&auto=format&fit=crop', tags: ['Non-Veg', 'Combo'] },
        { name: 'Masala Dosa', category: 'Indian', price: 80, stock: 40, availability: true, image: 'https://shop.sresthproducts.com/wp-content/uploads/2024/12/masala-dosa-1200x900.jpg', tags: ['Veg', 'Gluten-Free'] },
        { name: 'Spicy Chicken Burger', category: 'Snacks', price: 130, stock: 20, availability: true, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop', tags: ['Non-Veg', 'Spicy'] }
      ]);
      console.log('✅ Seeded Food Menu');
    }
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
}

// Ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    await startDatabase();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start Express
if (require.main === module) {
  startDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  });
}

// Export for Vercel Serverless
module.exports = app;
