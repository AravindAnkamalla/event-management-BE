import { RequestHandler, Router } from "express";
import { authorizeRoles } from "../middleware/authorization";
import { authenticateUser } from "../middleware/authentication";
import { creatEvent, getEvents } from "../controllers/event/event";
const eventRoutes: Router = Router();
eventRoutes.get(
  "/",
  authenticateUser as RequestHandler,
  authorizeRoles(["ADMIN", "USER"]) as RequestHandler,
  getEvents
);
eventRoutes.post(
  "/createEvent",
  authenticateUser as RequestHandler,
  authorizeRoles(["ADMIN"]) as RequestHandler,
  creatEvent
);
export default eventRoutes;
