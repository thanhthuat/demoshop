import _ from "lodash";
import { Types } from "mongoose";

const converToObjectIdMongodb = (id) => new Types.ObjectId(id);
const getIntoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};
const removeUndefinedOnject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k];
    }
  });
  return obj;
};
/**
 *
 * @param {*} obj
 * const a ={
 *  c:{
 *  d:1
 *  e:2
 * }
 * db.collection.updateOne({
 *
 * `a.d`:1
 * `a.e`:2
 * })
 * }
 */
const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "Object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = res[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
};
export default {
  getIntoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedOnject,
  updateNestedObjectParser,
  converToObjectIdMongodb,
};
