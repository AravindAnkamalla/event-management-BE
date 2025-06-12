import { Router } from "express";
import { login, signUp } from "../controllers/auth/auth";
const authRoutes: Router = Router();
authRoutes.post("/login", login);
authRoutes.post("/signup", signUp);

export default authRoutes;
