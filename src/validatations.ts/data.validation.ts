import { EventStatus } from "@prisma/client";
import { z } from "zod";

// Zod Schema for User
export const createUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password cannot exceed 64 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  role: z.enum(["ADMIN", "USER"]).default("USER"),
});

export const loginSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password cannot exceed 64 characters"),
  email: z.string().email("Invalid email address"),
});

export const createEventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  eventDate: z.string().transform((str) => new Date(str)),
  startTime: z.string().transform((str) => new Date(str)),
  endTime: z.string().transform((str) => new Date(str)),
  address: z.string().min(1, "Event address is required"),
  eventStatus: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).default("ACTIVE"),
  eventType: z.string().min(1, "Event type is required"),
  organizerName: z.string().min(1, "Organizer name is required"),
  organizerContact: z.string().min(1, "Organizer contact is required"),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

export const createRegistrationSchema = z.object({
  userId: z.number().int("User ID must be an integer"),
  eventId: z.number().int("Event ID must be an integer"),
  status: z.enum(["REGISTERED", "CANCELLED"]).optional(),
});

// Zod Schema for updating a User (example, adjust fields as needed)
export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  mobile: z.string().optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
});

// Zod Schema for updating an Event (example, adjust fields as needed)
export const updateEventSchema = z.object({
  name: z.string().min(1, "Event name is required").optional(),
  description: z.string().optional(),
  eventDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  startTime: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  endTime: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  address: z.string().min(1, "Event address is required").optional(),
  eventType: z.string().min(1, "Event type is required").optional(),
  eventStatus: z.enum(["active", "completed", "cancelled"]).optional(),
  organizerName: z.string().min(1, "Organizer name is required").optional(),
  organizerContact: z
    .string()
    .min(1, "Organizer contact is required")
    .optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

export const updateRegistrationSchema = z.object({
  status: z.enum(["REGISTERED", "CANCELLED"]),
});
