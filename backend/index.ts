import express from "express";
import "dotenv/config";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 1000;

app.get("/", (req, res) => {
  res.send("Welcome to Snip0 URL Shortener API.");
});

export default app;
