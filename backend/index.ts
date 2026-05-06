import express from "express";
import "dotenv/config";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";
import { prisma } from "./lib/prisma";
import AuthRoutes from "./routes/auth.routes";
import EventRoutes from "./routes/event.routes";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 1000;

app.get("/", (req, res) => {
  res.send("Welcome to Event Management API.");
});

app.use("/api/auth", AuthRoutes);
app.use("/api/events", EventRoutes);

// Error handler
app.use(errorMiddleware);

// Connect to Database
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log("Server is on port " + PORT);
    });
  } catch (error) {
    console.error("Database connection failed");
    process.exit(1);
  }
};
startServer();
export default app;
