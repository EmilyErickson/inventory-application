const Item = require("../models/item");
const Category = require("../models/category");
const ItemInStock = require("../models/iteminstock");

const asyncHandler = require("express-async-handler");

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
  res.render("item_detail", {
    name: item.name,
    item: item,
    item_in_stock_count: iteminstock[0].item_count,
  });
});

// Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item create GET");
});

// Handle item create on POST.
exports.item_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item create POST");
});

// Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item delete GET");
});

// Handle item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item delete POST");
});

// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item update GET");
});

// Handle item update on POST.
exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item update POST");
});
