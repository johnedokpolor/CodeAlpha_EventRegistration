import express from "express";
import {
  JoinEvent,
  ViewEvent,
  ViewEvents,
  CancelEvent,
} from "../controllers/registration/registration.controller.js";
import Protect from "../middlewares/protect.middleware.js";

const router = express.Router();
// Protected routes (only for organizers)
router.post("/join", Protect, JoinEvent);
router.get("/join", Protect, ViewEvents);
router.get("/join/:eventId", Protect, ViewEvent);
router.delete("/join/:eventId", Protect, CancelEvent);

export default router;
