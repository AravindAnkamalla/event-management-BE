import { RequestHandler, Router } from "express";
import { authorizeRoles } from "../middleware/authorization";
import { authenticateUser } from "../middleware/authentication";
import {
  getEventDetailsWithUsers,
  getEvents,
  upsertEvent,
  userRegisteredEvents,
} from "../controllers/event/event";
const eventRoutes: Router = Router();
eventRoutes.get(
  "/",
  authenticateUser as RequestHandler,
  authorizeRoles(["ADMIN", "USER"]) as RequestHandler,
  getEvents
);
eventRoutes.post(
  "/upsertEvent",
  authenticateUser as RequestHandler,
  authorizeRoles(["ADMIN"]) as RequestHandler,
  upsertEvent
);
eventRoutes.get(
  "/:eventId/details",
  authenticateUser as RequestHandler,
  authorizeRoles(["ADMIN"]) as RequestHandler,
  getEventDetailsWithUsers
);
eventRoutes.get(
  "/event/:userId/registered",
  authenticateUser as RequestHandler,
  authorizeRoles(["USER"]) as RequestHandler,
  userRegisteredEvents
);


export default eventRoutes;
