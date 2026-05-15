require('dotenv').config();
const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');

async function updateTags() {
  await mongoose.connect(process.env.MONGO_URI);
  
  await FoodItem.updateMany({ name: /Parotta/i }, { $set: { tags: ['Non-Veg', 'Spicy', 'Combo'] } });
  await FoodItem.updateMany({ name: /Biryani/i }, { $set: { tags: ['Non-Veg', 'Combo'] } });
  await FoodItem.updateMany({ name: /Dosa/i }, { $set: { tags: ['Veg', 'Gluten-Free'] } });
  await FoodItem.updateMany({ name: /Burger/i }, { $set: { tags: ['Non-Veg', 'Spicy'] } });

  console.log("Tags updated!");
  process.exit();
}

updateTags();
