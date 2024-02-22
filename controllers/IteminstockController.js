const ItemInStock = require("../models/iteminstock");
const asyncHandler = require("express-async-handler");

// Display list of all ItemInStocks.
exports.iteminstock_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: ItemInStock list");
});

// Display detail page for a specific ItemInStock.
exports.iteminstock_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: ItemInStock detail: ${req.params.id}`);
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
