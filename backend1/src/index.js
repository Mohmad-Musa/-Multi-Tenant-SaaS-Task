import cookieParser from "cookie-parser";

import express from "express";

import dotenv from "dotenv";

import { DBConnection } from "./lib/db.js";

import userRoute from "./routes/user.route.js";

import taskRoute from "./routes/task.route.js"
import orgRoute from "./routes/org.route.js"


const app = express();

app.use(cookieParser());

dotenv.config();
const PORT = process.env.PORT;
app.use(express.json());

app.use("/api/auth", userRoute);
app.use("/api/org", orgRoute);
app.use("/api/task", taskRoute);

app.listen(PORT, () => {
  console.log(`app running on PORT ${PORT}`);
  DBConnection();
});
