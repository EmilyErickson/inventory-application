const express = require("express");
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");
const category_controller = require("../controllers/categoryController");
const item_in_stock_controller = require("../controllers/iteminstockController");

/// ITEM ROUTES ///

// GET catalog home page.
router.get("/", item_controller.index);

// GET request for creating a Item. NOTE This must come before routes that display Item (uses id).
router.get("/item/create", item_controller.item_create_get);

// POST request for creating Item.
router.post("/item/create", item_controller.item_create_post);

// GET request to delete Item.
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete Item.
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update Item.
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update Item.
router.post("/item/:id/update", item_controller.item_update_post);

// GET request for one Item.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all Item items.
router.get("/items", item_controller.item_list);

/// CATEGORY ROUTES ///

// GET request for creating Category. NOTE This must come before route for id (i.e. display category).
router.get("/category/create", category_controller.category_create_get);

// POST request for creating Category.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Category.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Category.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Category.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Category.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one Category.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all Categories.
router.get("/categories", category_controller.category_list);

/// ITEMINSTOCK ROUTES ///

// GET request for creating a ItemInStock. NOTE This must come before route that displays ItemInStock (uses id).
router.get(
  "/iteminstock/create",
  item_in_stock_controller.iteminstock_create_get
);

// POST request for creating ItemInStock.
router.post(
  "/iteminstock/create",
  item_in_stock_controller.iteminstock_create_post
);

// GET request to delete ItemInStock.
router.get(
  "/iteminstock/:id/delete",
  item_in_stock_controller.iteminstock_delete_get
);

// POST request to delete ItemInStock.
router.post(
  "/iteminstock/:id/delete",
  item_in_stock_controller.iteminstock_delete_post
);

// GET request to update ItemInStock.
router.get(
  "/iteminstock/:id/update",
  item_in_stock_controller.iteminstock_update_get
);

// POST request to update ItemInStock.
router.post(
  "/iteminstock/:id/update",
  item_in_stock_controller.iteminstock_update_post
);

// GET request for one ItemInStock.
router.get("/iteminstock/:id", item_in_stock_controller.iteminstock_detail);

// GET request for list of all ItemsInStock.
router.get("/itemsinstock", item_in_stock_controller.iteminstock_list);

module.exports = router;
