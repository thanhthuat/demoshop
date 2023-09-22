"use strict";
import express from "express";
import accessController from "../../controllers/access.controller.js";
import { asynHander } from "../../auth/checkAuth.js";
import { authentication, authenticationV2 } from "../../auth/authUtils.js";
const router = express.Router();

// singn up
router.post("/shop/signup", asynHander(accessController.signUp));
// singin
router.post("/shop/login", asynHander(accessController.login));

// authentication //
router.use(authenticationV2);
/////
router.post("/shop/logout", asynHander(accessController.logout));
router.post("/shop/handlerRefreshToken", asynHander(accessController.handlerRefresToken));

export default router;
