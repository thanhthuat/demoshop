"use strict ";
import { mongoose, model, Schema } from "mongoose";
import slugify from "slugify";
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

// Declare the Schema of the Mongo model
const discountSchema = new mongoose.Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" },
    discount_value: { type: Number, required: true }, // 10.000
    discount_code: { type: String, required: true }, // discount Code
    discount_start_date: { type: Date, required: true }, // ngay bat dau
    discount_end_date: { type: Date, required: true }, // ngay ket thuc
    discount_max_users: { type: Number, required: true }, // so luong discount ap dung
    discount_user_count: { type: Number, required: true }, // so discount da su dung
    discount_users_used: { type: Array, default: [] }, // ai da su dung
    discount_max_users_per_user: { type: Number, required: true }, // so luong cho pheo toi da duoc su dung
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, required: true, enum: ["all", "specific"] },
    discount_product_ids: { type: Array, default: [] }, // so san pham dc ap dung
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

export default {
  inventory: model(DOCUMENT_NAME, discountSchema),
};
