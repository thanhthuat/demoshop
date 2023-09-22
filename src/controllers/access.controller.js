"use strict";

import { CREATED, OK, SuccessResponse } from "../core/success.response.js";
import AccessService from "../services/access.service.js";

class AccessController {
  handlerRefresToken = async (req, res, next) => {
    // new SuccessResponse({
    //   message: "Logout success",
    //   metadata: await AccessService.logout(req.body.refreshToken),
    // }).send(res)

    new SuccessResponse({
      message: "Logout success",
      metadata: await AccessService.handleRefreshTokenV2({
      refreshToken :req.refreshToken,
      user:req.user,
      keyStore:req.keyStore
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    console.log("LOGOUT");
    new SuccessResponse({
      message: "Logout success",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    //  console.log(`[P]::signUp::`, req.body);
    // 200 OK
    // 201CREATED
    new CREATED({
      message: "Regiserted ok",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
    // return res.status(201).json({
    //   code: "201",
    // });
  };
}

export default new AccessController();
