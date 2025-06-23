import { Request, Response } from "express";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import {
  loginSchema,
  createUserSchema,
} from "../../validatations.ts/data.validation";
import { prismaClient } from "../..";
import dotenv from "dotenv";
dotenv.config();
export const login = async (req: Request, res: Response) => {
  try {
    const validatedInput = loginSchema.parse(req.body);

    const { email, password } = validatedInput;
    let user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(401).json({ error: "user not found" });
    }
    if (user && !compareSync(password, user?.password)) {
      res.status(400).json({ error: "incorrect password" });
    }
    const token = jwt.sign(
      {
        userId: user?.id,
        role: user?.role,
      },
      process.env.JWT_SECRET as string
    );
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json({ user: userWithoutPassword, token });
    }
  } catch (e) {
    res.status(400).json({ error: e });
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const validatedInput = createUserSchema.parse(req.body);
    const { email, password, username, mobile, role } = validatedInput;
    let user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });
    if (user) {
      console.log("User already exist");
      res.status(400).json({ error: "User already exist" });
    }
    user = await prismaClient.user.create({
      data: {
        username,
        mobile,
        role,
        email,
        password: hashSync(password, 10),
      },
    });
    res.status(201).json(user);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ error });
  }
};
