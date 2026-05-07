import express from "express";
const router = express.Router();

import {
  CreateEvent,
  GetAllEvents,
  GetEvent,
  UpdateEvent,
  DeleteEvent,
} from "../controllers/event/event.controller";
import Protect from "../middlewares/protect.middleware";

router.get("/", GetAllEvents);
router.get("/:slug", GetEvent);
router.post("/", Protect, CreateEvent);
router.put("/:id", Protect, UpdateEvent);
router.delete("/:id", Protect, DeleteEvent);

export default router;
