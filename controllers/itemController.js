const Item = require("../models/item");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");

const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const [numItems, numItemsInStock, numCategories] = await Promise.all([
    Item.countDocuments({}).exec(),
    Item.aggregate([
      { $group: { _id: null, total: { $sum: "$item_count" } } },
    ]).exec(),
    Category.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "Store Inventory Home",
    item_count: numItems,
    item_in_stock_count: numItemsInStock[0] ? numItemsInStock[0].total : 0,
    category_count: numCategories,
  });
});

// Display list of all items.
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}, "item_name item_category")
    .sort({
      item_name: 1,
    })
    .populate("item_category")
    .exec();

  res.render("item_list", { title: "Item List", item_list: allItems });
});

// Display detail page for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id)
    .populate("item_category")
    .exec();

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_detail", {
    name: item.name,
    item: item,
  });
});

// Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ category_name: 1 }).exec();

  res.render("item_form", {
    title: "Create Item",
    categories: allCategories,
  });
});

// Handle item create on POST.
exports.item_create_post = [
  body("item_name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("item_category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("item_description", "Description must be at least 15 characters.")
    .trim()
    .isLength({ min: 15 })
    .escape(),
  body("item_price", "Price must be a valid number.")
    .trim()
    .isFloat({ min: 0 })
    .toFloat()
    .withMessage("Price must be a positive number."),
  body("item_count", "Stock count must be a valid number.")
    .trim()
    .isFloat()
    .withMessage("Stock count cannont be less than 0"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const formattedPrice = parseFloat(req.body.item_price).toFixed(2);

    const item = new Item({
      item_name: req.body.item_name,
      item_category: req.body.item_category,
      item_description: req.body.item_description,
      item_price: formattedPrice,
      item_count: req.body.item_count,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find()
        .sort({ category_name: 1 })
        .exec();
      res.render("item_form", {
        title: "Create Item",
        categories: allCategories,
        item: item,
        errors: errors.array(),
      });
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

// Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  if (item === null) {
    // No results.
    res.redirect("/inventory/items");
  }

  res.render("item_delete", {
    title: "Delete Item",
    item: item,
    passwordMsg: null,
  });
});

// Handle item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("item_name").exec();
  const adminPassword = req.body.adminPassword;

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.render("item_delete", {
      title: "Delete Item",
      item: item,
      passwordMsg: "Incorrect admin password",
      // error: "Incorrect admin password",
    });
  }

  await Item.findByIdAndDelete(req.body.itemid);
  res.redirect("/inventory/items");
});

// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, allCategories] = await Promise.all([
    Item.findById(req.params.id).populate("item_category").exec(),
    Category.find().sort({ category_name: 1 }).exec(),
  ]);

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_form", {
    title: "Update Item",
    categories: allCategories,
    item: item,
  });
});

// Handle item update on POST.
exports.item_update_post = [
  body("item_name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("item_category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("item_description", "Description must not be empty.")
    .trim()
    .isLength({ min: 15 })
    .escape(),
  body("item_price", "Price must be a valid number.")
    .trim()
    .isFloat({ min: 0 })
    .toFloat()
    .withMessage("Price must be a positive number."),
  body("item_count", "Stock count must be a valid number.")
    .trim()
    .isFloat()
    .withMessage("Stock count must be a positive number or 0"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const formattedPrice = parseFloat(req.body.item_price).toFixed(2);

    const updatedItem = new Item({
      item_name: req.body.item_name,
      item_category: req.body.item_category,
      item_description: req.body.item_description,
      item_price: formattedPrice,
      item_count: req.body.item_count,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const item_category = await Category.find()
        .sort({ category_name: 1 })
        .exec();
      res.render("item_form", {
        title: "Create Item",
        item_category: item_category,
        item: updatedItem,
        errors: errors.array(),
      });
    } else {
      await Item.findByIdAndUpdate(req.params.id, updatedItem, {});
      res.redirect(updatedItem.url);
    }
  }),
];
