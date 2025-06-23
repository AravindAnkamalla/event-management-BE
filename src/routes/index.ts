import { Router } from "express";
import authRoutes from "./auth";
import eventRoutes from "./event";
import registerRoutes from "./register";
import adminRoutes from "./admin";

const rootRouter: Router = Router();
rootRouter.use("/auth", authRoutes);
rootRouter.use("/event", eventRoutes);
rootRouter.use("/register", registerRoutes);
rootRouter.use("/admin",adminRoutes)
export default rootRouter;
