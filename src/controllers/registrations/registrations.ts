import { Request, Response } from "express";
import { prismaClient } from "../..";
import { createRegistrationSchema } from "../../validatations.ts/data.validation";

export const registerEvent = async (req: Request, res: Response) => {
  try {
    const validatedInput = createRegistrationSchema.parse(req.body);
    const registeredEvent = await prismaClient.registration.findFirst({
      where: {
        eventId: validatedInput.eventId,
        userId: validatedInput.userId,
        status: validatedInput.status,
      },
    });
    if (registeredEvent) {
      res.status(401).json({ error: "already registered" });
    }
    const registration = await prismaClient.registration.create({
      data: {
        ...validatedInput,
      },
    });
    res
      .status(201)
      .json({ id: registration.id, msg: "register for event successfully" });
  } catch (e) {
    res
      .status(500)
      .json({ error: "error occured while registering the event" });
  }
};
