import express from "express";
const router = express.Router();

import {
  JoinEvent,
  ViewEvent,
  ViewEvents,
  CancelEvent,
} from "../controllers/registration/registration.controller";
import Protect from "../middlewares/protect.middleware";

// Protected routes (only for organizers)
router.post("/join", Protect, JoinEvent);
router.get("/join", Protect, ViewEvents);
router.get("/join/:eventId", Protect, ViewEvent);
router.delete("/join/:eventId", Protect, CancelEvent);

export default router;
