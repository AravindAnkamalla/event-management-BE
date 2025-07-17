import "dotenv/config";
import { Resend } from "resend";
import {
  createAccountCreatedEmailTemplate,
  createOtpEmailTemplate,
} from "./emailTemplates";
import {
  SendAccountCreatedEmailInput,
  SendAccountCreatedEmailResponse,
  SendOtpEmailInput,
  SendOtpEmailResponse,
} from "../types";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendAccountCreatedEmail = async (
  input: SendAccountCreatedEmailInput
): Promise<SendAccountCreatedEmailResponse> => {
  const { username, email, password } = input;

  const { html, text } = createAccountCreatedEmailTemplate(
    username,
    email,
    password
  );

  const { error } = await resend.emails.send({
    from: `"Event Team" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "🎉 Your Event Account Has Been Created",
    html,
    text,
  });

  if (error) {
    console.error("Failed to send account created email:", error);
    throw new Error("Account creation email failed");
  }

  return { msg: "Email sent successfully" };
};

export const sendOtpEmail = async (
  input: SendOtpEmailInput
): Promise<SendOtpEmailResponse> => {
  const { to, username, otp, expirationMinutes } = input;
  const { html, text } = createOtpEmailTemplate(
    username,
    otp,
    expirationMinutes
  );

  const { error } = await resend.emails.send({
    from: `"Event Team" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "🔐 Your OTP Code",
    html,
    text,
  });

  if (error) {
    console.error("Failed to send OTP email:", error);
    throw new Error("OTP email failed");
  }
  return { msg: "Otp sent successfully" };
};
