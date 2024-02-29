const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");

const { body, validationResult } = require("express-validator");

exports.category_list = asyncHandler(async (req, res, next) => {
  const uniqueCategories = await Category.distinct("category_name").exec();

  // Now, retrieve the full category details for each unique category name
  const allCategories = await Category.find({
    category_name: { $in: uniqueCategories },
  }).exec();

  res.render("category_list", {
    title: "Category List",
    category_list: allCategories,
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find(
      { item_category: req.params.id },
      "item_name item_description"
    ).exec(),
  ]);

  if (category === null) {
    // No results.
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    category_items: allItemsInCategory,
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
});

exports.category_create_post = [
  body("category_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Category name must be specified.")
    .custom((value) => {
      return /^[a-zA-Z0-9\s]+$/.test(value);
    })
    .withMessage(
      "Category name can only contain alphanumeric characters and spaces."
    ),
  body("category_description")
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Category description must be at least 10 characters."),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      category_name: req.body.category_name,
      category_description: req.body.category_description,
      admin_password: process.env.ADMIN_PASSWORD,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      await category.save();
      res.redirect(category.url);
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ item_category: req.params.id }, "item_name").exec(),
  ]);

  if (category === null) {
    // No results.
    res.redirect("/inventory/categories");
  }

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    category_items: allItemsInCategory,
    passwordMsg: null,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, allItemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "item_name").exec(),
  ]);

  if (allItemsInCategory.length > 0) {
    // Category has items. Render in same way as for GET route.
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_items: allItemsInCategory,
      passwordMsg: null,
    });
    return;
  }

  const adminPassword = req.body.admin_password;
  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_items: allItemsInCategory,
      passwordMsg: "Incorrect admin password",
    });
    return;
  }
  // Category has no items. Delete object and redirect to the list of categories.
  await Category.findByIdAndDelete(req.body.categoryid);
  res.redirect("/inventory/categories");
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    // No results.
    res.redirect("/inventory/categories");
  }

  res.render("category_form", {
    title: "Update Category",
    category: category,
  });
});

exports.category_update_post = [
  body("category_name")
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage("Category name must be specified.")
    .custom((value) => {
      return /^[a-zA-Z0-9\s]+$/.test(value);
    })
    .withMessage(
      "Category name can only contain alphanumeric characters and spaces."
    ),
  body("category_description")
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Category description must be at least 10 characters."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      category_name: req.body.category_name,
      category_description: req.body.category_description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      await Category.findByIdAndUpdate(req.params.id, category, {});
      res.redirect(category.url);
    }
  }),
];
