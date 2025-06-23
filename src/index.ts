import express, { Express } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from 'dotenv';
import rootRouter from "./routes";
const app: Express = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/api", rootRouter);
const PORT = process.env.PORT || 5000;
export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.listen(PORT, () => console.log(`server is running at PORT ${PORT}`));
