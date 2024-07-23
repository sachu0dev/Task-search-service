import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoter from "./routes/user";
import { errorMiddleware } from "./middlewares/error";

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

// routes
app.get("/", (req, res) => {
  res.send("Hello");
});

app.use("/api/v1/user", userRoter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
