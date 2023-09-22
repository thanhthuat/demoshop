"use strict";
import express from "express";
import routerSignUp from "./access/index.js";
import routerProduct from "./product/index.js";
import routerDiscount from "./discount/index.js";
import apiKey, { permission } from "../auth/checkAuth.js";
const router = express.Router();

// check Api key
// check permission
router.use(apiKey);
router.use(permission("0000"));
router.use("/v1/api/product", routerProduct);
router.use("/v1/api/discount", routerDiscount);
router.use("/v1/api", routerSignUp);

export default router;
