"use trict";
import mongoose from "mongoose";
import countConnect from "../helpers/check.connect.js";
const connectString = `mongodb://127.0.0.1:27017/myapp`;

class Database {
  constructor() {
    this.connect();
  }
  // connect
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, { maxPoolSize: 50 })
      .then((_) => {
        countConnect();
        console.log(`Connected Mongdb Success `);
      })
      .catch((err) => console.log(err));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongodb = Database.getInstance();
export default instanceMongodb;
