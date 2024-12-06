import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = function () {
  return mongoose
    .connect(MONGODB_URI!)
    .then(() => console.log(`Connected to MongoDB at ${MONGODB_URI}`))
    .catch((err) => console.log(err));
};
