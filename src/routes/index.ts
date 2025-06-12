import { Router } from "express";
import authRoutes from "./auth";
import eventRoutes from "./event";
import registerRoutes from "./register";

const rootRouter: Router = Router();
rootRouter.use("/auth", authRoutes);
rootRouter.use("/event", eventRoutes);
rootRouter.use("/register", registerRoutes);
export default rootRouter;
