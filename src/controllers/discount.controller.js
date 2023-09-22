"use strict";
import { SuccessResponse } from "../core/success.response.js";
import { DiscountSevice } from "../services/discount.service.js";

export class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: " Successful Code Generations",
      metadata: await DiscountSevice.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: " Successful Code Found",
      metadata: await DiscountSevice.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    });
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: " Successful Code Found",
      metadata: await DiscountSevice.getDiscountAmount({
        ...req.body,
      }),
    });
  };
  getAllDiscountCodeWithProducts = async (req, res, next) => {
    new SuccessResponse({
      message: " Successful Code Found",
      metadata: await DiscountSevice.getAllDiscountCodeWithProducts({
        ...req.body,
      }),
    });
  };
}
export default new DiscountController();
