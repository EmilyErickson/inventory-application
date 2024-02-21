const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  item_name: { type: String, required: true, maxLength: 100 },
  item_category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  item_description: { type: String, minLength: 15 },
  item_price: { type: Number, required: true, min: 0 },
});

ItemSchema.virtual("url").get(function () {
  return `/inventory/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
