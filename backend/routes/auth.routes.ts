import express from "express";
const router = express.Router();

import { Register, Login, GetMe } from "../controllers/auth/auth.controller";
import Protect from "../middlewares/protect.middleware";

router.post("/register", Register);
router.get("/login", Login);
router.get("/me", Protect, GetMe);

export default router;
