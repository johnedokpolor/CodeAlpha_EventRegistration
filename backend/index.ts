import express from "express";
import "dotenv/config";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { prisma } from "./lib/prisma.js";
import AuthRoutes from "./routes/auth.routes.js";
import EventRoutes from "./routes/event.routes.js";
import RegistrationRoutes from "./routes/registration.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 1000;

app.get("/", (req, res) => {
  res.send("Welcome to Event Management API.");
});

app.use("/api/auth", AuthRoutes);
app.use("/api/events", EventRoutes);
app.use("/api/registrations", RegistrationRoutes);

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
    console.error("Database connection failed", error);
    process.exit(1);
  }
};
startServer();
export default app;
