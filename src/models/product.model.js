"use strict ";
import { mongoose, model, Schema } from "mongoose";
import slugify from "slugify";
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
      unique: true,
    },
    product_description: String,
    product_slug: String,
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    // more
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating mus be above 1.0"],
      max: [5, "Rating must be above 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
// create index for search 
productSchema.index({product_name:'text',product_description:'text'})
// Document middleware  run before .save(0) and .create ();

productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

// define the product type = clothing
const clothingSche = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    collection: "clothes",
    timestamps: true,
  }
);
// define the product type = electronic
const electronicSche = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    collection: "electronics",
    timestamps: true,
  }
);
// define the product type = electronic
const furnitureSche = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    collection: "furniture",
    timestamps: true,
  }
);
//Export the model
export default {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSche),
  electronic: model("Electronics", electronicSche),
  furnitureSche: model("FurnitureSche", furnitureSche),
};
