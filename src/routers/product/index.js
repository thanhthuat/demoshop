"use strict";
import express from "express";
import productController from "../../controllers/product.controller.js";
import { asynHander } from "../../auth/checkAuth.js";
import { authenticationV2 } from "../../auth/authUtils.js";
const router = express.Router();
router.get("/search/:keySearch", asynHander(productController.getAllDraftsForShop));
router.get("", asynHander(productController.findAllProducts));
router.get("/:product_id", asynHander(productController.findProduct));
// authentication //
router.use(authenticationV2);
/////
router.post("", asynHander(productController.createProduct));
/**
 * update voi put la update tat ca
 * update voi patch la update 1 so phan can update 
 */
router.patch("/:productId", asynHander(productController.updateProduct));
router.post("/publish/:id", asynHander(productController.publishProductByShop));
router.post("/unpublish/:id", asynHander(productController.unPublishProductByShop));

// query  //
router.get("/drafts/all", asynHander(productController.getAllDraftsForShop));

router.get("/published/all", asynHander(productController.getAllPublishForShop));

export default router;
