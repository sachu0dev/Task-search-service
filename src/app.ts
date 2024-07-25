import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import { errorMiddleware } from "./middlewares/error";
import userRouter from "./routes/user";
import { connectDB } from "./utils/features";

const app = express();
const port = 3000;

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later after 15 mins."
});

app.use(limiter);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.CLIENT_URL as string],
    credentials: true,
  })
);

connectDB(process.env.MONGO_URI as string);

// Routes
app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/v1/user", userRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
