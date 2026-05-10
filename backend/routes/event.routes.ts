import express from "express";
const router = express.Router();

import {
  CreateEvent,
  GetAllEvents,
  GetEvent,
  UpdateEvent,
  DeleteEvent,
  GetMyEvents,
  GetMyEvent,
} from "../controllers/event/event.controller";
import Protect from "../middlewares/protect.middleware";
// Public routes
router.get("/", GetAllEvents);
router.get("/public/:slug", GetEvent);

// Protected routes (only for organizers)
router.get("/me", Protect, GetMyEvents);
router.post("/me", Protect, CreateEvent);
router
  .route("/me/:id")
  .get(Protect, GetMyEvent)
  .put(Protect, UpdateEvent)
  .delete(Protect, DeleteEvent);

export default router;
