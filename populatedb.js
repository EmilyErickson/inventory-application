#! /usr/bin/env node

console.log(
  'This script populates some test items and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(index, category_name, category_description) {
  const categorydetail = {
    category_name: category_name,
    category_description: category_description,
  };

  const category = new Category(categorydetail);

  await category.save();
  categories[index] = category;
  console.log(`Added category: ${category_name}`);
}

async function itemCreate(
  index,
  item_name,
  item_category,
  item_description,
  item_price,
  item_count
) {
  const itemdetail = {
    item_name: item_name,
    item_category: item_category,
    item_description: item_description,
    item_price: item_price,
    item_count: item_count,
  };

  const item = new Item(itemdetail);
  await item.save();
  items[index] = item;
  console.log(`Added Item: ${item_name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      0,
      "Scented Candles",
      "Explore a variety of scented candles to suit different preferences, including floral, fruity, woody, spicy, and citrus aromas."
    ),
    categoryCreate(
      1,
      "Seasonal Collection",
      "Immerse yourself in the essence of each season with specially curated collections, featuring scents and designs that capture the spirit of spring, summer, fall, and winter."
    ),
    categoryCreate(
      2,
      "Luxury Collection",
      "Experience the epitome of candle luxury with our premium collection, featuring candles crafted from high-quality materials, intricate designs, and limited-edition releases."
    ),
    categoryCreate(
      3,
      "Special Occasions",
      "Celebrate special moments with candles designed for weddings, birthdays, anniversaries, and other occasions, adding a touch of warmth and elegance to your events."
    ),
  ]);
}

async function createItems() {
  console.log("Adding Items");
  const existingCategories = await Category.find().exec();

  await Promise.all([
    itemCreate(
      0,
      "Tranquil Lavender Bliss",
      existingCategories[0],
      "Immerse yourself in the soothing aroma of lavender fields with our Tranquil Lavender Bliss scented candle. This hand-poured soy candle brings a sense of calm and relaxation to any space, making it perfect for winding down after a long day. Enjoy the gentle, floral fragrance that lingers delicately in the air.",
      24.99,
      15
    ),
    itemCreate(
      1,
      "Citrus Burst Delight",
      existingCategories[0],
      "Energize your surroundings with the refreshing Citrus Burst Delight scented candle. The zesty combination of citrus fruits creates a lively and invigorating atmosphere. Whether you're working, entertaining guests, or simply enjoying a quiet moment, this candle will add a burst of freshness to your space.",
      29.99,
      28
    ),
    itemCreate(
      2,
      "Autumn Harvest Spice",
      existingCategories[1],
      "Embrace the warmth and coziness of fall with our Autumn Harvest Spice candle. This seasonal delight combines notes of cinnamon, nutmeg, and cloves to evoke the comforting scents of autumn. Perfect for creating a welcoming ambiance during chilly evenings or festive gatherings.",
      28.99,
      23
    ),
    itemCreate(
      3,
      "Winter Wonderland Frost",
      existingCategories[1],
      "Transform your home into a winter wonderland with our Winter Wonderland Frost candle. The crisp scent of fresh snow paired with hints of pine and mint captures the magic of a snowy landscape. Light this candle to bring the enchantment of winter indoors during the holiday season",
      32.99,
      15
    ),
    itemCreate(
      4,
      "Royal Velvet Vanilla Orchid",
      existingCategories[2],
      "Immerse yourself in luxury with our Royal Velvet Vanilla Orchid candle. The velvety smoothness of Madagascar vanilla blends seamlessly with the exotic allure of orchid blossoms, creating a fragrance that is both opulent and inviting. Elevate your space with the sophistication of this indulgent aroma",
      59.99,
      12
    ),
    itemCreate(
      5,
      "Majestic Sandalwood Serenity",
      existingCategories[2],
      "Experience the regal allure of Majestic Sandalwood Serenity. This luxurious candle features the warm and woody notes of premium sandalwood, complemented by hints of jasmine and musk. Let the sophisticated fragrance envelop your senses and transport you to a realm of tranquility and refinement",
      64.99,
      21
    ),
    itemCreate(
      6,
      "Blissful Birthday Cake Celebration",
      existingCategories[3],
      "Make birthdays even more special with our Blissful Birthday Cake Celebration candle. The sweet aroma of freshly baked vanilla cake, topped with sugary frosting, fills the air with delightful nostalgia. Create a festive ambiance and add a touch of sweetness to the birthday celebration.",
      35.99,
      9
    ),
    itemCreate(
      7,
      "Enchanting Anniversary Elegance",
      existingCategories[3],
      "Celebrate enduring love with our Enchanting Anniversary Elegance candle. The romantic blend of rose petals, sweet vanilla, and a touch of cedarwood creates an enchanting fragrance that captures the essence of a lasting commitment. Light this candle to commemorate the joyous journey of love.",
      44.99,
      7
    ),
  ]);
}
