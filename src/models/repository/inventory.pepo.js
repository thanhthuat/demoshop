import inventoryModel from "../inventory.model.js";
import { Types } from "mongoose";
const insertInvetory = async ({ productId, shopId, stock, location = "unknown" }) => {
  return await inventoryModel.inventory.create({
    inven_productId: productId,
    inven_stock: stock,
    inven_loaction: location,
    inven_shopId: shopId,
  });
};

export default {
  insertInvetory,
};
