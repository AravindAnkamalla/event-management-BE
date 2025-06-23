import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import { sendPasswordEmail } from "../../utils/mailer";

const prisma = new PrismaClient();

const generateNumericPassword = (length: number = 6): string => {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, "0");
};

export const createUsers = async (req: Request, res: Response) => {
  try {
    const users = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      res
        .status(400)
        .json({ error: "Request body must be a non-empty array of users" });
    }
    const usersToCreate: {
      username: string;
      email: string;
      password: string;
      mobile?: string;
      role: Role;
      createdBy: Role;
      updatedBy: Role;
    }[] = [];

    const emailTasks: Promise<void>[] = [];

    for (const user of users) {
      const password = user.password ?? generateNumericPassword(6);

      usersToCreate.push({
        username: user.username,
        email: user.email,
        password,
        mobile: user.mobile,
        role: user.role ?? Role.USER,
        createdBy: Role.ADMIN,
        updatedBy: Role.ADMIN,
      });
      emailTasks.push(sendPasswordEmail(user.email, user.username, password));
    }

    const result = await prisma.user.createMany({
      data: usersToCreate,
      skipDuplicates: true,
    });
    await Promise.all(emailTasks);

    res.status(201).json({
      message: "Users created and emails sent successfully",
      count: result.count,
    });
  } catch (error) {
    console.error("Error creating users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({});
    const formattedUsers = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res
      .status(200)
      .json({ users: formattedUsers, message: "Users fetched successfully" });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      const { password, ...userWithoutPassword } = user;
      res.status(200).json({
        user: userWithoutPassword,
        message: "User Details fetched successfully",
      });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const upsertUser = async (req: Request, res: Response) => {
  const {
    id,
    username,
    email,
    password,
    mobile,
    role = Role.USER,
  }: {
    id?: number;
    username: string;
    email: string;
    password?: string;
    mobile?: string;
    role?: Role;
  } = req.body;

  try {
    const generatedPassword = password ?? generateNumericPassword(6);
    console.log('request body:', req.body);
    const user = await prisma.user.upsert({
      where: {
        id: id ?? 0,
      },
      update: {
        username,
        email,
        mobile,
        role,
        updatedBy: Role.ADMIN,
      },
      create: {
        username,
        email,
        password: generatedPassword,
        mobile,
        role,
        createdBy: Role.ADMIN,
        updatedBy: Role.ADMIN,
      },
    });

    if (!id) {
      console.log("New user created, sending password email");
      await sendPasswordEmail(email, username, generatedPassword);
    }

    res.status(200).json({
      message: id ? "User updated successfully" : "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Error upserting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
