import { Request, Response } from "express";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import {
  loginSchema,
  createUserSchema,
  sendOtpSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from "../../validatations.ts/data.validation";
import { prismaClient } from "../..";
import dotenv from "dotenv";
import { generateNumericPassword } from "../../utils/otp";
import { sendOtpEmail } from "../../utils/mailer";
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
export const sendOtp = async (req: Request, res: Response)=> {
  const validatedInput = sendOtpSchema.parse(req.body);
  const { email } = validatedInput;
  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });
  const existingOtp = await prismaClient.oTP.findFirst({
    where: {
      email,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  let otpCode: string;

  if (existingOtp) {
    otpCode = existingOtp.code;
    console.log(`✅ Reusing existing OTP for ${email}: ${otpCode}`);
  } else {
    otpCode = generateNumericPassword();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prismaClient.oTP.create({
      data: {
        email,
        code: otpCode,
        expiresAt,
      },
    });

    console.log(`📧 New OTP for ${email}: ${otpCode}`);
  }
  await sendOtpEmail({
    to: email,
    otp: otpCode,
    username: user.username,
    expirationMinutes: 5,
  });

  return res.status(200).json({
    message: existingOtp
      ? "OTP already sent. Please check your email."
      : "New OTP sent successfully",
    statusCode: existingOtp ? 208 : 200,
  });
};

export const verifyOtp = async (req: Request, res: Response):Promise<Response> => {
  try {
    const { email, code } = verifyOtpSchema.parse(req.body);
    const otpRecord = await prismaClient.oTP.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    await prismaClient.oTP.delete({
      where: { id: otpRecord.id },
    });

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid request", error });
  }
};

export const resetPassword = async (req: Request, res: Response):Promise<Response> => {
  const { email, otp, newPassword } = resetPasswordSchema.parse(req.body);

  const otpRecord = await prismaClient.oTP.findFirst({
    where: {
      email,
      code: otp,
      expiresAt: { gt: new Date() }, // not expired
    },
  });

  if (!otpRecord) return res.status(400).json({ message: "Invalid or expired OTP" });

  const hashedPassword = await hashSync(newPassword, 10);

  await prismaClient.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  await prismaClient.oTP.deleteMany({ where: { email } }); // remove used OTPs

  return res.status(200).json({ message: "Password reset successful" });
};

