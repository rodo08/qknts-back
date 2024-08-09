import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/tasks.routes.js";
import cors from "cors";

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://qknts.netlify.app",
      "https://qknts-back.onrender.com",
    ],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.use("/api", authRoutes);
app.use("/api", taskRoutes);

export default app;
