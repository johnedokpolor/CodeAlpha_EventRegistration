import { Request, Response } from "express";
import slugify from "slugify";
import { nanoid } from "nanoid";
import ErrorResponse from "../../utils/errorResponse.js";
import { prisma } from "../../lib/prisma.js";
import asyncHandler from "../../middlewares/asynchandler.js";

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

  // Change role to ORGANIZER if it's the user's first event
  const organizer = await prisma.user.findUnique({
    where: { id: req.user.id },
  });
  if (organizer?.role === "ATTENDEE") {
    await prisma.user.update({
      where: { id: organizer.id },
      data: { role: "ORGANIZER" },
    });
  }

  res.status(201).json({ success: true, data: event });
});

// GET ALL EVENTS BY YOU
export const GetMyEvents = asyncHandler(async (req, res) => {
  const events = await prisma.event.findMany({
    where: { organizerId: req.user.id },
    orderBy: { date: "asc" },
    include: {
      attendees: { select: { user: { select: { name: true, email: true } } } },
      _count: { select: { attendees: true } },
    },
  });
  res.status(200).json({ success: true, data: events });
});
// GET SINGLE EVENT BY ID BY YOU
export const GetMyEvent = asyncHandler(async (req, res) => {
  const id = req.params.id as string;

  const event = await prisma.event.findFirst({
    where: { id, organizerId: req.user.id },
    include: {
      attendees: { select: { user: { select: { name: true, email: true } } } },
      _count: { select: { attendees: true } },
    },
  });

  if (!event) {
    throw new ErrorResponse("Event not found", 404);
  }

  res.status(200).json({ success: true, data: event });
});
// UPDATE EVENT
export const UpdateEvent = asyncHandler(async (req, res) => {
  const id = req.params.id as string;
  const { title } = req.body;

  // 1. Find the event

  let event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new ErrorResponse("Event not found", 404);
  }

  // 2. Ownership Check: Only the organizer can update
  if (event.organizerId !== req.user.id) {
    throw new ErrorResponse("User not authorized to update this event", 403);
  }
  const generatedSlug = `${slugify(title, { lower: true, strict: true })}-${nanoid(5)}`;
  // 3. Update the event
  event = await prisma.event.update({
    where: { id },
    data: { ...req.body, slug: generatedSlug },
  });

  res.status(200).json({ success: true, data: event });
});

// DELETE EVENT
export const DeleteEvent = asyncHandler(async (req, res) => {
  const id = req.params.id as string;

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

export const GetAttendees = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId as string;

  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (event?.organizerId !== req.user.id) {
    throw new ErrorResponse(
      "Only the organizer can see the attendee list",
      403,
    );
  }

  const attendees = await prisma.registration.findMany({
    where: { eventId },
    include: { user: { select: { name: true, email: true } } },
  });

  res.status(200).json({ success: true, data: attendees });
});

// GET ALL EVENTS
export const GetAllEvents = asyncHandler(async (req, res) => {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
    include: {
      organizer: { select: { name: true } },

      _count: { select: { attendees: true } },
    },
  });
  res.status(200).json({ success: true, data: events });
});
// GET SINGLE EVENT BY SLUG
export const GetEvent = asyncHandler(async (req, res) => {
  const slug = req.params.slug as string;

  const event = await prisma.event.findFirst({
    where: { slug },
    include: {
      organizer: { select: { name: true } },

      _count: { select: { attendees: true } },
    },
  });

  if (!event) {
    throw new ErrorResponse("Event not found", 404);
  }

  res.status(200).json({ success: true, data: event });
});
