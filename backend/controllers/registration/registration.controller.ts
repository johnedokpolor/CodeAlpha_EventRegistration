import { prisma } from "../../lib/prisma";
import asyncHandler from "../../middlewares/asynchandler";
import ErrorResponse from "../../utils/errorResponse";

export const JoinEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.body;

  // 1. Check if event exists
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new ErrorResponse("Event not found", 404);

  // 2. Create the registration
  // Prisma will automatically fail if the @@unique constraint is hit
  try {
    const registration = await prisma.registration.create({
      data: {
        userId: req.user.id,
        eventId: eventId,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "See you there!", data: registration });
  } catch (error) {
    throw new ErrorResponse("You are already registered for this event", 400);
  }
});
export const ViewEvents = asyncHandler(async (req, res) => {
  // 1. Check if event exists and that the user is registered for it
  const events = await prisma.event.findMany({
    where: { attendees: { some: { userId: req.user.id } } },
  });
  if (!events) throw new ErrorResponse("Events not found", 404);

  res.status(200).json({ success: true, data: events });
});
export const ViewEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.body;

  // 1. Check if event exists and that the user is registered for it
  const event = await prisma.event.findUnique({
    where: { id: eventId, attendees: { some: { userId: req.user.id } } },
  });
  if (!event) throw new ErrorResponse("Event not found", 404);

  res.status(200).json({ success: true, data: event });
});

// CANCEL REGISTRATION
export const CancelEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId as string;

  // We look for a registration that matches BOTH the event and the logged-in user
  // This ensures User A cannot cancel User B's spot.
  const registration = await prisma.registration.findFirst({
    where: {
      eventId: eventId,
      userId: req.user.id,
    },
  });

  if (!registration) {
    throw new ErrorResponse("You are not registered for this event", 404);
  }

  await prisma.registration.delete({
    where: {
      id: registration.id,
    },
  });

  res.status(200).json({
    success: true,
    message: "Registration cancelled successfully",
  });
});
