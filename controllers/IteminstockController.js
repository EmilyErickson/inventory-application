const ItemInStock = require("../models/iteminstock");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");

const { body, validationResult } = require("express-validator");

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
});

// Display ItemInStock create form on GET.
exports.iteminstock_create_get = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}, "item_name")
    .sort({ item_name: 1 })
    .exec();

  res.render("iteminstock_form", {
    title: "Create Item Count",
    item_list: allItems,
  });
});

// Handle ItemInStock create on POST.
exports.iteminstock_create_post = [
  body("item", "Item must be specified").trim().isLength({ min: 1 }).escape(),
  body("item_count").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const itemInStock = new ItemInStock({
      item: req.body.item,
      item_count: req.body.item_count,
    });

    if (!errors.isEmpty()) {
      const allItems = await Item.find({}, "item_name")
        .sort({
          item_name: 1,
        })
        .exec();

      res.render("iteminstock_form", {
        title: "Create ItemInStock",
        item_list: allItems,
        selected_item: itemInStock.item._id,
        errors: errors.array(),
        iteminstock: itemInStock,
      });
      return;
    } else {
      await itemInStock.save();
      res.redirect(itemInStock.url);
    }
  }),
];

// Display ItemInStock delete form on GET.
exports.iteminstock_delete_get = asyncHandler(async (req, res, next) => {
  const itemInStock = await ItemInStock.findById(req.params.id).exec();

  if (itemInStock === null) {
    res.redirect("/inventory/itemsinstock");
  }

  res.render("iteminstock_delete", {
    title: "Delete Item Stock",
    iteminstock: itemInStock,
  });
});

// Handle ItemInStock delete on POST.
exports.iteminstock_delete_post = asyncHandler(async (req, res, next) => {
  const itemInStock = await ItemInStock.findById(req.params.id).exec();

  await ItemInStock.findByIdAndDelete(req.body.iteminstockid);
  res.redirect("inventory/itemsinstock");
});

// Display ItemInStock update form on GET.
exports.iteminstock_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: ItemInStock update GET");
});

// Handle ItemInStock update on POST.
exports.iteminstock_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: ItemInStock update POST");
});
