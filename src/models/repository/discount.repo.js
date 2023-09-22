"use strict ";

import productModel from "../product.model.js";

import utils from "../../utils/index.js";
import { model } from "mongoose";

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await productModel.product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(utils.unGetSelectData(unSelect))
    .lean();
  return products;
};

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  Select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await productModel.product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(utils.getSelectData(Select))
    .lean();
  return products;
};
const checkDiscountExists = async (model, filter) => {
  // const foundDiscount = await discountModel
  // .findOne({
  //   discount_code: code,
  //   discount_shopId: utils.converToObjectIdMongodb(shopId),
  // })
  // .lean();
  return await model.findOne(filter).lean();
};
export default {
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExists,
};
