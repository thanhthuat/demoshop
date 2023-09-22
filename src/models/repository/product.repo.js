"use strict";
import productModel from "../product.model.js";
import { Types } from "mongoose";
import utils from "../../utils/index.js";

const finAllDraftsForShop = async ({ query, limit, skip }) => {
  return await productModel.product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await productModel.product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
const publishProductByshop = async ({ product_shop, product_id }) => {
  const foundShop = await productModel.product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  // modifiedCount is updated true =1
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  console.log("🚀 ~ file: product.repo.js:35 ~ publishProductByshop ~ modifiedCount:", modifiedCount);
  return modifiedCount;
};

const queryProduct = async ({ query, limit, skip }) => {
  return await productModel.product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await productModel.product
    .find(
      {
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return results;
};
const unPublishProductByshop = async () => {
  const foundShop = await productModel.product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};
const findAllProducts = async ({ limit, page, filter, select, sort }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await productModel.product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(utils.getSelectData(select))
    .lean();
  return products;
};
const findProduct = async ({ product_id, unSelect }) => {
  return await productModel.product.findById(product_id).select(unGetSelectData(unSelect));
};
const updateProductById = async ({ productId, bodyUpdate, model, isNew = true }) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew,
  });
};

export default {
  finAllDraftsForShop,
  findAllPublishForShop,
  publishProductByshop,
  unPublishProductByshop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
};
