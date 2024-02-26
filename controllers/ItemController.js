const Item = require("../models/item");
const Category = require("../models/category");
const ItemInStock = require("../models/iteminstock");

const asyncHandler = require("express-async-handler");

const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const [numItems, numItemsInStock, numCategories] = await Promise.all([
    Item.countDocuments({}).exec(),
    ItemInStock.aggregate([
      { $group: { _id: null, total: { $sum: "$item_count" } } },
    ]).exec(),
    Category.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "Store Inventory Home",
    item_count: numItems,
    item_in_stock_count: numItemsInStock,
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
  const [item, iteminstock] = await Promise.all([
    Item.findById(req.params.id).populate("item_category").exec(),
    ItemInStock.find({ item: req.params.id }).exec(),
  ]);
  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }
  let item_in_stock_count = 0;
  if (iteminstock[0] && iteminstock[0].item_count) {
    item_in_stock_count = iteminstock[0].item_count;
  }

  res.render("item_detail", {
    name: item.name,
    item: item,
    item_in_stock_count: item_in_stock_count,
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
  body("item_description", "Description must not be empty.")
    .trim()
    .isLength({ min: 15 })
    .escape(),
  body("item_price", "Price must be a valid number.")
    .trim()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      item_name: req.body.item_name,
      item_category: req.body.item_category,
      item_description: req.body.item_description,
      item_price: req.body.item_price,
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
  const [item, allItemInStock] = await Promise.all([
    Item.findById(req.params.id).exec(),
    ItemInStock.find({ item: req.params.id }).exec(),
  ]);

  if (item === null) {
    // No results.
    res.redirect("/inventory/items");
  }
  let item_in_stock_count = 0;
  if (allItemInStock[0] && allItemInStock[0].item_count) {
    item_in_stock_count = allItemInStock[0].item_count;
  }

  res.render("item_delete", {
    title: "Delete Item",
    item: item,
    iteminstock_count: item_in_stock_count,
  });
});

// Handle item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  const [item, allItemInStock] = await Promise.all([
    Item.findById(req.params.id).exec(),
    ItemInStock.find({ item: req.params.id }).exec(),
  ]);

  if (allItemInStock.length > 0) {
    res.render("item_delete", {
      title: "Delete Item",
      item: item,
      iteminstock_count: allItemInStock[0].item_count,
    });

    return;
  } else {
    await Item.findByIdAndDelete(req.body.itemid);
    res.redirect("/inventory/items");
  }
});

// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item update GET");
});

// Handle item update on POST.
exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item update POST");
});
