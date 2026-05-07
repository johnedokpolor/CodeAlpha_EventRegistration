import { Request, Response } from "express";
import slugify from "slugify";
import { nanoid } from "nanoid";
import ErrorResponse from "../../utils/errorResponse";
import { prisma } from "../../lib/prisma";
import asyncHandler from "../../middlewares/asynchandler";

interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

// CREATE EVENT
export const CreateEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location } = req.body;

  // Generate the slug: "My Awesome Party" -> "my-awesome-party-x1y2z"
  const generatedSlug = `${slugify(title, { lower: true, strict: true })}-${nanoid(5)}`;
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new ErrorResponse("Invalid event date", 400);
  }

  const event = await prisma.event.create({
    data: {
      title,
      description,
      date: new Date(date),
      location,
      slug: generatedSlug,
      organizerId: req.user.id, // Pulled from the 'protect' middleware
    },
  });

  res.status(201).json({ success: true, data: event });
});

// GET ALL EVENTS
export const GetAllEvents = asyncHandler(async (req, res) => {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
  });
  res.status(200).json({ success: true, data: events });
});
// GET SINGLE EVENT BY SLUG
export const GetEvent = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const event = await prisma.event.findFirst({
    where: { slug },
    include: { organizer: { select: { name: true, email: true } } },
  });

  if (!event) {
    throw new ErrorResponse("Event not found", 404);
  }

  res.status(200).json({ success: true, data: event });
});
// UPDATE EVENT
export const UpdateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Find the event

  let event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new ErrorResponse("Event not found", 404);
  }

  // 2. Ownership Check: Only the organizer can update
  if (event.organizerId !== req.user.id) {
    throw new ErrorResponse("User not authorized to update this event", 403);
  }

  // 3. Update the event
  event = await prisma.event.update({
    where: { id },
    data: req.body, // In production, it's safer to destructure specific fields
  });

  res.status(200).json({ success: true, data: event });
});

// DELETE EVENT
export const DeleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new ErrorResponse("Event not found", 404);
  }

  // Ownership Check
  if (event.organizerId !== req.user.id) {
    throw new ErrorResponse("User not authorized to delete this event", 403);
  }

  res.status(200).json({ success: true, message: "Event removed" });
});
