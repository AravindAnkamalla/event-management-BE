import { RequestHandler, Router } from "express";
import {
  createUsers,
  getUserById,
  getUsers,
  upsertUser,
} from "../controllers/admin/admin";
import { authorizeRoles } from "../middleware/authorization";
import { authenticateUser } from "../middleware/authentication";
const adminRoutes: Router = Router();
adminRoutes.post(
  "/create-user",
  authenticateUser as RequestHandler,
  authorizeRoles(["ADMIN"]) as RequestHandler,
  createUsers
);
adminRoutes.get(
  "/users",
  authenticateUser as RequestHandler,
  authorizeRoles(["ADMIN"]) as RequestHandler,
  getUsers
);
adminRoutes.get(
  "/users/:userId/details",
  authenticateUser as RequestHandler,
  authorizeRoles(["ADMIN"]) as RequestHandler,
  getUserById
);
adminRoutes.post(
  "/users/upsert",
  authenticateUser as RequestHandler,
  authorizeRoles(["ADMIN"]) as RequestHandler,
  upsertUser
);

export default adminRoutes;
