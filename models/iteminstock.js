const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemInStockSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  item_count: { type: Number },
});

ItemInStockSchema.virtual("url").get(function () {
  return `/inventory/iteminstock/${this._id}`;
});

module.exports = mongoose.model("ItemInStock", ItemInStockSchema);
