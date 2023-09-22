"use strict";

import shopModel from "../models/shop.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import keytokenModel from "../models/keytoken.model.js";
import { KeyTokenService } from "./keyToken.service.js";
import createTokenPair, { verfifyJWT } from "../auth/authUtils.js";
import { AuthFailureError, BadRequestError, ForbiddenError } from "../core/error.response.js";
import { findByEmail } from "./shop.service.js";
import utils from "../utils/index.js";
const RoleShop = {
  SHOP: "SHOP,",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  // check this token used
  static handleRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happend !! Please login");
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("shop not registeted");
    }
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("shop not registeted");

    // create 1 cap moi
    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);

    // update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });
    return {
      user,
      tokens,
    };
  };
  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    if (foundToken) {
      // decode
      const { userId, email } = await verfifyJWT(refreshToken, foundToken.privateKey);
      // xoa tat ca  token trong keyStore
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happend !! Please login");
    }
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new AuthFailureError("shop not registeted");
    // verirfyToken
    const { userId, email } = await verfifyJWT(refreshToken, foundToken.privateKey);
    // check Userid
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("shop not registeted");

    // create 1 cap moi
    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey);

    // update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });
    return {
      user: { userId, email },
      tokens,
    };
  };
  static logout = async (keyStore) => {
    console.log("keyStore", keyStore._id);
    return await KeyTokenService.removeKeyById(keyStore._id);
  };
  static login = async ({ email, password }) => {
    // step 1 check email exists
    // step 2 check password
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Shop not registered");
    }
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new BadRequestError(" Password not correct");
    }
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    //4 generate tokens
    const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey);
    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId: foundShop._id,
    });
    console.log("login success");
    return {
      metadata: {
        shop: utils.getIntoData({ fileds: ["_id", "name", "email"], object: foundShop }),
        tokens,
      },
    };
  };
  static signUp = async ({ name, email, password }) => {
    // try {
    // step 1 check email exists
    // step 2 check password
    const holderShop = await shopModel.findOne({ email }).lean();
    //
    if (holderShop) {
      throw new BadRequestError("Error: Shop already re");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      email,
      name,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    console.log("🚀 ~ file: access.service.js:34 ~ AccessService ~ signUp= ~ newShop:", newShop);
    if (newShop) {
      // created privateKey ,publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      console.log({ privateKey, publicKey });
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: Shop already re");
      }

      // create token pair
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
      console.log(`Created Token Success::`, tokens);
      return {
        code: 201,
        metadata: {
          shop: utils.getIntoData({ fileds: ["_id", "name", "email"], object: newShop }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
    // } catch (error) {
    return {
      code: "xxx",
      message: error.message,
      status: "error",
    };
  };
}
//}

export default AccessService;
