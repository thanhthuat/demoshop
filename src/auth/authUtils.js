"use strict";
import JWT from "jsonwebtoken";
import { asynHander } from "../helpers/asynHandler.js";
import { KeyTokenService } from "../services/keyToken.service.js";
import { AuthFailureError, NotFoundError } from "../core/error.response.js";

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "refreshtoken",
};
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    //
    return { accessToken, refreshToken };
  } catch (error) {}
};
export const authentication = asynHander(async (req, res, next) => {
  // 1 - Check userId missing ??
  // 2- get
  // 2

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  // 2

  const keyStore = await KeyTokenService.findByUserId(userId);

  if (!keyStore) throw new NotFoundError("Not found keyStore");
  //
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");
  console.log("keyTokenService-----------------------", keyStore.privateKey, accessToken);
  console.log("keyTokenService-----------------------", accessToken);
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    console.log("🚀 ~ file: authUtils.js:49 ~ authentication ~ decodeUser:", decodeUser);
    if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid Userid");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    console.log(error);
    throw error;
  }
});
export const authenticationV2 = asynHander(async (req, res, next) => {
  // 1 - Check userId missing ??
  // 2- get
  // 2

  const userId = req.headers[HEADER.CLIENT_ID];
  console.log("🚀 ~ file: authUtils.js:67 ~ authenticationV2 ~ userId:", userId);
  if (!userId) throw new AuthFailureError("Invalid Request");

  // 2

  const keyStore = await KeyTokenService.findByUserId(userId);

  if (!keyStore) throw new NotFoundError("Not found keyStore");
  // 3
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      console.log("🚀 ~ file: authUtils.js:49 ~ authentication ~ decodeUser:", decodeUser);
      if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid Userid");
      req.keyStore = keyStore;
      req.user = decodeUser; // {userId , email}
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  //
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");
  console.log("keyTokenService-----------------------", keyStore.privateKey, accessToken);
  console.log("keyTokenService-----------------------", accessToken);
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    console.log("🚀 ~ file: authUtils.js:49 ~ authentication ~ decodeUser:", decodeUser);
    if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid Userid");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    console.log(error);
    throw error;
  }
});
export const verfifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};
export default createTokenPair;
