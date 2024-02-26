const ItemInStock = require("../models/iteminstock");
const asyncHandler = require("express-async-handler");

// Display list of all ItemInStocks.
exports.iteminstock_list = asyncHandler(async (req, res, next) => {
  const allItemsInStock = await ItemInStock.find().populate("item").exec();
  res.render("iteminstock_list", {
    title: "Items in Stock List",
    iteminstock_list: allItemsInStock,
  });
});

// Display detail page for a specific ItemInStock.
exports.iteminstock_detail = asyncHandler(async (req, res, next) => {
  const itemInStock = await ItemInStock.findById(req.params.id)
    .populate("item")
    .exec();

  if (itemInStock === null) {
    const err = new Error("Item is out of stock");
    err.status = 404;
    return next(err);
  }

  res.render("iteminstock_detail", {
    title: "Item",
    iteminstock: itemInStock,
  });
  // res.send(`NOT IMPLEMENTED: ItemInStock detail: ${req.params.id}`);
});

// Display ItemInStock create form on GET.
exports.iteminstock_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: ItemInStock create GET");
});

// Handle ItemInStock create on POST.
exports.iteminstock_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: ItemInStock create POST");
});

// Display ItemInStock delete form on GET.
exports.iteminstock_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: ItemInStock delete GET");
});

// Handle ItemInStock delete on POST.
exports.iteminstock_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: ItemInStock delete POST");
});

// Display ItemInStock update form on GET.
exports.iteminstock_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: ItemInStock update GET");
});

// Handle ItemInStock update on POST.
exports.iteminstock_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: ItemInStock update POST");
});
