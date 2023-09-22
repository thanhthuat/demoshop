"use strict";

import { SuccessResponse } from "../core/success.response.js";
import { ProductFactoryV2 } from "../services/product.service.xxx.js";

class ProductController {
  createProduct = async (req, res, next) => {
    // new SuccessResponse({
    //   message: "Create new Product success",
    //   metadata: await ProductFactory.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId,
    //   }),
    // }).send(res);

    new SuccessResponse({
      message: "Create new Product success",
      metadata: await ProductFactoryV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // update Product
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "UPdate Product success",
      metadata: await ProductFactoryV2.updateProduct(req.body.product_type, req.params.productId, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Product success",
      metadata: await ProductFactoryV2.publishProductByshop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "unPublishProductByShop Product success",
      metadata: await ProductFactoryV2.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // QUERY
  /**
   * @desc get all Drafts for shop .
   * @param {Number} limit 
   * @param {Number} skip
   * @return  {JSON} res 
 
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Publish success !",
      metadata: await ProductFactoryV2.findAllRraftForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Publish success !",
      metadata: await ProductFactoryV2.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Publish success !",
      metadata: await ProductFactoryV2.searchProducts(req.params),
    }).send(res);
  };
  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list all products success !",
      metadata: await ProductFactoryV2.findAllProducts(req.query),
    }).send(res);
  };
  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list findproducts success !",
      metadata: await ProductFactoryV2.findProduct({ product_id: req.params.product_id }),
    }).send(res);
  };
}
export default new ProductController();
