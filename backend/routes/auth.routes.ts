import express from "express";
import { Register, Login, GetMe } from "../controllers/auth/auth.controller.js";
import Protect from "../middlewares/protect.middleware.js";

const router = express.Router();
router.post("/register", Register);
router.post("/login", Login);
router.get("/me", Protect, GetMe);

export default router;
