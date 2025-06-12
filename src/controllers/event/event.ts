import { Request, Response } from "express";
import { prismaClient } from "../..";
import { createEventSchema } from "../auth/data.validation";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await prismaClient.event.findMany();
    res
      .status(200)
      .json({ events: events, message: "events fetched successfully" });
  } catch (e) {
    res.status(500).json({ error: "server error" });
  }
};

export const creatEvent = async (req: Request, res: Response) => {
  try {
    const validatedInput = createEventSchema.parse(req.body);

    const event = await prismaClient.event.create({
      data: {
        ...validatedInput,
      },
    });
    res
      .status(201)
      .json({ id: event.id, message: "event created successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "error occured while creating a event" });
  }
};
