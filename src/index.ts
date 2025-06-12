import express, { Express, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import rootRouter from "./routes";
const app: Express = express();
app.use(express.json());
app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.listen(8000, () => console.log(`server is running at PORT 8000`));
