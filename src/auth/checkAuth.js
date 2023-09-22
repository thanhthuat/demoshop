"use strict";

import findById from "../services/apiKey.service.js";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.json({
        message: "Forbidden Error",
      });
    }
    // check objKey
    const objKey = await findById(key);
    if (!objKey) {
      return res.json({
        message: "Forbidden Error",
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

export const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "permisson dinied ",
      });
    }
    const validPermisson = req.objKey.permissions.includes(permission);
    if (!validPermisson) {
      return res.status(403).json({
        message: "permisson dinied Error",
      });
    }
    return next();
  };
};
export const asynHander = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
export default apiKey;
