import mongoose from "mongoose";
import { connectionString, options } from "../../config/mongo";

export default () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(connectionString, { config: options })
      .then(() => {
        const db = mongoose.connection;
        resolve(db);
      })
      .catch((e) => reject(e));
  });
};
