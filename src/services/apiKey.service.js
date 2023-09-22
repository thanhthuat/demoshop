"use strict";

import apiKeyModal from "../models/apikey.model.js";
import crypto from "crypto";
const findById = async (key) => {
  const newKey = await apiKeyModal.create({
    key: crypto.randomBytes(64).toString("hex"),
    permissions: ["0000"],
  });
  
  const objKey = await apiKeyModal.findOne({ key, status: true }).lean();

  return objKey;
};

export default findById;
