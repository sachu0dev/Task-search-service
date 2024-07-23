import mongoose from "mongoose";

const connectDB = (url: string): void => {
  mongoose
    .connect(url, { dbName: "search-task" })
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((err: Error) => {
      console.error("MongoDB Connection Error: ", err);
      process.exit(1);
    });
};

export { connectDB };
