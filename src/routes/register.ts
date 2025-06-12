import { RequestHandler, Router } from "express";
import { authorizeRoles } from "../middleware/authorization";
import { authenticateUser } from "../middleware/authentication";
import { registerEvent } from "../controllers/registrations/registrations";
const registerRoutes: Router = Router();

registerRoutes.post(
  "/",
  authenticateUser as RequestHandler,
  authorizeRoles(["ADMIN", "USER"]) as RequestHandler,
  registerEvent
);
export default registerRoutes;
