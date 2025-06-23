import { Request, Response } from "express";
import { prismaClient } from "../..";
import { createEventSchema } from "../../validatations.ts/data.validation";
import z from "zod";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    let events;
    let total;

    if (req.userRole !== "ADMIN") {
      const allUserEvents = await getEventsForUser(req.userId as number);
      total = allUserEvents.length;

      events = allUserEvents.slice(skip, skip + limit);

      res.status(200).json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        events,
        message: "Events fetched successfully for user",
      });
    } else {
      [events, total] = await Promise.all([
        prismaClient.event.findMany({
          skip,
          take: limit,
          orderBy: { eventDate: "desc" },
        }),
        prismaClient.event.count(),
      ]);

      res.status(200).json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        events,
        message: "Events fetched successfully",
      });
    }
  } catch (e) {
    console.error("Error fetching events:", e);
    res.status(500).json({ error: "Server error" });
  }
};

export const getEventsForUser = async (userId: number) => {
  try {
    const events = await prismaClient.event.findMany({
      include: {
        registrations: {
          where: {
            userId: userId,
          },
          select: {
            status: true,
          },
        },
      },
    });
    if (!events || events.length === 0) {
      return [];
    }
    const formattedEvents = events.map((event) => ({
      ...event,
      registrationStatus: event.registrations[0]?.status ?? "NOT_REGISTERED",
    }));
    return formattedEvents;
  } catch (e) {
    console.error("Error fetching events:", e);
    throw new Error("Error fetching events");
  }
};

export const upsertEventSchema = createEventSchema.extend({
  id: z.number().optional(),
});

export const upsertEvent = async (req: Request, res: Response) => {
  try {
    console.log("Received request to upsert event:", JSON.stringify(req.body, null, 2));
    const validatedInput = upsertEventSchema.parse(req.body);
    console.log("Validated input for upsertEvent:", JSON.stringify(validatedInput, null, 2));
    const { id, ...eventData } = validatedInput;

    if (id) {
      const updatedEvent = await prismaClient.event.update({
        where: { id },
        data: eventData,
      });

      res.status(200).json({
        message: "Event updated successfully",
        event: updatedEvent,
      });
    } else {
      const createdEvent = await prismaClient.event.create({
        data: eventData,
      });

      res.status(201).json({
        message: "Event created successfully",
        id: createdEvent.id,
        event: createdEvent,
      });
    }
  } catch (e) {
    console.error("Error in upsertEvent:", e);

    if (e instanceof z.ZodError) {
      res.status(400).json({ error: e.errors });
    }

     res
      .status(500)
      .json({ error: "An error occurred while upserting the event" });
  }
};

export const getEventDetailsWithUsers = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  console.log("Fetching event details for eventId:", eventId);
  try {
    const event = await prismaClient.event.findUnique({
      where: { id: Number(eventId) },
      include: {
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                mobile: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      res.status(404).json({ message: "Event not found" });
    } else {
      const registeredUsers = event.registrations.map((reg) => ({
        id: reg.user.id,
        username: reg.user.username,
        email: reg.user.email,
        mobile: reg.user.mobile,
        registrationStatus: reg.status,
        registrationDate: reg.registrationDate,
      }));

      const eventDetails = {
        id: event.id,
        name: event.name,
        description: event.description,
        eventDate: event.eventDate,
        startTime: event.startTime,
        endTime: event.endTime,
        address: event.address,
        eventType: event.eventType,
        eventStatus: event.eventStatus,
        organizerName: event.organizerName,
        organizerContact: event.organizerContact,
        imageUrl: event.imageUrl,
        registeredUsers,
      };

      res.status(200).json({
        message: "Event details fetched successfully",
        event: eventDetails,
      });
    }
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userRegisteredEvents = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const registrations = await prismaClient.registration.findMany({
      where: { userId: userId },
      include: {
        event: true,
      },
    });

    if (!registrations || registrations.length === 0) {
      res
        .status(404)
        .json({ message: "No registered events found for this user" });
    } else {
      const registeredEvents = registrations.map((reg) => ({
        ...reg.event,
        registrationStatus: reg.status,
        registrationDate: reg.registrationDate,
      }));

      res.status(200).json({
        message: "Registered events fetched successfully",
        events: registeredEvents,
      });
    }
  } catch (error) {
    console.error("Error fetching registered events:", error);
    res.status(500).json({ error: "Server error" });
  }
};
