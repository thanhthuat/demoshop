"use strict";

import productModel from "../models/product.model.js";
import { BadRequestError } from "../core/error.response.js";
import finAllDraftsForShop from "../models/repository/product.repo.js";
import utils from "../utils/index.js";
import inventory from "../models/repository/inventory.pepo.js";
// define Factory class to create product

export class ProductFactoryV2 {
  /*
    type :'Clothing',
    payload
    */
  static productRegistry = {};
  static reisterProductType(type, classRef) {
    ProductFactoryV2.productRegistry[type] = classRef;
  }
  static async createProduct(type, payload) {
    const productClass = ProductFactoryV2.productRegistry[type];
    if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`);
    return new productClass(payload).createProduct();
  }
  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactoryV2.productRegistry[type];
    if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`);
    return new productClass(payload).updateProduct(productId);
  }
  // query
  static async findAllRraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await finAllDraftsForShop.finAllDraftsForShop({ query, limit, skip });
  }
  static async searchProducts({ keySearch }) {
    return await finAllDraftsForShop.searchProductByUser({ keySearch });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await finAllDraftsForShop.findAllPublishForShop({ query, limit, skip });
  }
  static async findAllProducts({ limit = 50, sort = "ctime", page = 1, filter = { isPublished: true } }) {
    return await finAllDraftsForShop.findAllProducts({
      sort,
      limit,
      filter,
      page,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }
  static async findProduct({ product_id }) {
    return await finAllDraftsForShop.findProduct({ product_id, unSelect: ["__v"] });
  }

  // put
  static async publishProductByshop({ product_shop, product_id }) {
    const shop = await finAllDraftsForShop.publishProductByshop({ product_shop, product_id });
    return shop;
  }
  static async unPublishProductByshop({ product_shop, product_id }) {
    const shop = await finAllDraftsForShop.unPublishProductByshop({ product_shop, product_id });
    return shop;
  }

  // end put
}
// {
//     product_name: {
//       type: String,
//       required: true,
//     },
//     product_thumb: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     product_description: String,
//     product_price: {
//       type: Number,
//       required: true,
//     },
//     product_quantity: {
//       type: Number,
//       required: true,
//     },
//     product_type: {
//       type: String,
//       required: true,
//       enum: ["Electronics", "Clothing", "Furniture"],
//     },
//     product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
//     product_attributes: { type: Schema.Types.Mixed, required: true },
//   },
//   {
//     collection: COLLECTION_NAME,
//     timestamps: true,
//   }

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;

    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }
  // create new product
  async createProduct(product_id) {
    const newProduct = await productModel.product.create({ ...this, _id: product_id });
    if (newProduct) {
      await inventory.insertInvetory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }
    return newProduct;
  }

  // update Product
  async updateProduct(productId, bodyUpdate) {
    return await finAllDraftsForShop.updateProductById({
      productId,
      bodyUpdate,
      model: productModel.product,
    });
  }
}

// define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await productModel.clothing.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError("create new Clothing error");
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("create new Product error ");
    return newProduct;
  }
  async updateProduct(productId) {
    /**
     * 1.remove attr has null or underfid
     * 2 check update o cho nao?
     * if (objectParams.product_attribututes){
     * }
     */
    const objectParams = utils.removeUndefinedOnject(this);
    if (objectParams.product_attributes) {
      //update child
      await finAllDraftsForShop.updateProductById({
        productId,
        bodyUpdate: utils.updateNestedObjectParser(objectParams),
        model: productModel.clothing,
      });
    }
    const updateProduct = await super.updateProduct(productId, utils.updateNestedObjectParser(objectParams));
    return updateProduct;
  }
}

// define sub-class for different product types Electronics
class Electronics extends Product {
  async createProduct() {
    const neweEctronics = await productModel.electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!neweEctronics) throw new BadRequestError("create new Electronics error");
    const newProduct = await super.createProduct(neweEctronics._id);
    if (!newProduct) throw new BadRequestError("create new Product error ");
    return newProduct;
  }
}

// define sub-class for different product types Furniture
class Furnitures extends Product {
  async createProduct() {
    const newFurniture = await productModel.electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("create new Electronics error");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("create new Product error ");
    return newProduct;
  }
}

// register product types
ProductFactoryV2.reisterProductType("Electronics", Electronics);
ProductFactoryV2.reisterProductType("Clothing", Clothing);
ProductFactoryV2.reisterProductType("Furnitures", Furnitures);

// ProductFactoryV2.reisterProductType('Electronics',Electronics);
