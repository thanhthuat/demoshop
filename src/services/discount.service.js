/**
 * Discount Service
 * 1 - Generator discount Code [shop | Admin]
 * 2 - Get discount amount [User]
 * 3 - Get all discount codes [User \shop]
 * 4 - Verify discount code [user]
 * 5 - Delete discount Code [Admin\Shop]
 * 6 - Cancel discount code [user]
 */
import {
  ConflictRequestError,
  BadRequestError,
  NotFoundError,
  AuthFailureError,
  ForbiddenError,
} from "../core/error.response.js";
import discountModel from "../models/discount.model.js";
import productRepo from "../models/repository/product.repo.js";
import discountRepo from "../models/repository/discount.repo.js";
import utils from "../utils/index.js";

export class DiscountSevice {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      users_used,
      max_uses,
      uses_count,
      is_active,
      max_uses_per_user,
    } = payload;
    // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError("Discount code has expried!");
    // }
    if (new Date(start_date) > new Date(end_date)) {
      throw new BadRequestError(" Satrt date must be end date");
    }
    // create index for discount code
    const foundDiscount = await discountModel.inventory
      .findOne({
        discount_code: code,
        discount_shopId: utils.converToObjectIdMongodb(shopId),
      })
      .lean();
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exist!");
    }
    const newDiscount = await discountModel.inventory.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value, // 10.000
      discount_code: code, // discount Code
      discount_start_date: start_date, // ngay bat dau
      discount_end_date: end_date, // ngay ket thuc
      discount_max_users: max_value, // so luong discount ap dung
      discount_user_count: uses_count, // so discount da su dung
      discount_users_used: users_used, // ai da su dung
      discount_max_users_per_user: max_uses_per_user, // so luong cho pheo toi da duoc su dung
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids, // so san pham dc ap dung
    });
  }
  static async updateDiscountCode() {
    //...
  }
  /**
   * get all discount codes available with products
   */
  static async getAllDiscountCOdesWithProduct({ code, shopId, userId, limit, page }) {
    // create index for discount_code
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: utils.converToObjectIdMongodb(shopId),
      })
      .lean();
    if (!foundDiscount || foundDiscount.discount_is_active) {
      throw new NotFoundError("discount not exist!");
    }
    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let product;
    if (discount_applies_to === "all") {
      products = await productRepo.findAllProducts({
        filter: {
          product_shop: converToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime", // time gan day nhat
        select: ["product_name"],
      });
    }
    if (discount_applies_to === "specific") {
      // get the products ids
      products = await productRepo.findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime", // time gan day nhat
        select: ["product_name"],
      });
    }
    return product;
  }
  /**
   * get all discount code of shop
   */
  static async getAllDiscountCodesByShop(payload) {
    const discounts = await discountRepo.findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: utils.converToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
      model: discount,
    });
    return discounts;
  }

  /***
   * Apply discount code
   * products ={
   * productId,
   * shopId,
   * quantity,
   * name,price
   * }
   */
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await discountRepo.checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: utils.converToObjectIdMongodb(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError(` discount doesnt exitst`);

    const {
      discount_is_active,
      discount_max_users,
      discount_min_order_value,
      discount_users_used,
      discount_max_users_per_user,
    } = foundDiscount;

    if (!discount_is_active) throw new NotFoundError(`discount expried!`);
    if (!discount_max_users) throw new NotFoundError(`discount are out !`);
    if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
      throw new NotFoundError(`discount expried! `);
    }
    // check xem co gia tri toi thieu
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      //get totalOrder
      totalOrder = products.reduce((acc, product) => {
        return acc + products.quantity * product.price;
      }, 0);
    }

    if (totalOrder < discount_min_order_value) {
      throw new NotFoundError(` discount require a minium order value of ${discount_min_order_value}`);
    }

    if (discount_max_users_per_user > 0) {
      const userUserDiscount = discount_users_used.find((user) => user.userId === userId);
      if (userUserDiscount) {
      }
    }
    // check dicount la fixed_amount hay %
    const amount = discount_type === "fixed_amount" ? discount_value : totalOrder * (discount_value / 100);
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }
  /**
   *
   */
  static async deleteDiscountCode({ shopId, codeId }) {
    const foundDiscount = "";
    if (foundDiscount) {
    }
    const delected = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: utils.converToObjectIdMongodb(shopId),
    });
    return delected;
  }
  /**
   * Cancel discount Code ()
   */
  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await discountRepo.checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: utils.converToObjectIdMongodb(shopId),
      },
    });
    if (!foundDiscount) throw new NotFoundError(`discount doesnt exitst`);
    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_users: 1,
        discount_user_count: -1,
      },
    });
    return result;
  }
}
