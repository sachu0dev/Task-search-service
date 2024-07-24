import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { errorMiddleware } from "./middlewares/error";
import userRoter from "./routes/user";
import { connectDB } from "./utils/features";
import createUser from "./seeders/user";

const app = express();
const port = 3000;

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CLIENT_URL as string],
    credentials: true,
  })
);

connectDB(process.env.MONGO_URI as string);

// routes
app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/v1/user", userRoter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
