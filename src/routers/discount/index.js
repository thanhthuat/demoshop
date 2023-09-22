"use strict";
import express from "express";
import discountController from "../../controllers/discount.controller.js";
import { asynHander } from "../../auth/checkAuth.js";
import { authenticationV2 } from "../../auth/authUtils.js";
const router = express.Router();

// get amount a discount
router.post("/amount", asynHander(discountController.getDiscountAmount));
router.get("/list_product_code", asynHander(discountController.getAllDiscountCodeWithProducts));

// authentication //
router.use(authenticationV2);
// query  //
router.post("", asynHander(discountController.createDiscountCode));

router.get("", asynHander(discountController.getAllDiscountCode));

export default router;
