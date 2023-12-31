"use strict ";
import { mongoose, model, Schema } from "mongoose";
import slugify from "slugify";
const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

// Declare the Schema of the Mongo model
const inventorySchema = new mongoose.Schema(
  {
    inven_productId: { type: Schema.Types.ObjectId, ref: "Product" },
    inven_location: { type: String, default: "unknow" },
    inven_stock: { type: Number, required: true },
    inven_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    inven_reservations: { type: Array, default: [] },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

export default {
 inventory: model(DOCUMENT_NAME,inventorySchema)
};
