
import 'dotenv/config';
import { Resend } from 'resend';
import { createAccountCreatedEmailTemplate, createOtpEmailTemplate } from './emailTemplates';


const resend = new Resend(process.env.RESEND_API_KEY);

export const sendAccountCreatedEmail = async (
  to: string,
  username: string,
  email: string,
  password: string
) => {
  const { html, text } = createAccountCreatedEmailTemplate(username, email, password);

  const { error } = await resend.emails.send({
    from: `"Event Team" <${process.env.EMAIL_FROM}>`,
    to,
    subject: '🎉 Your Event Account Has Been Created',
    html,
    text,
  });

  if (error) {
    console.error('Failed to send account created email:', error);
    throw new Error('Account creation email failed');
  }
};

export const sendOtpEmail = async (
  to: string,
  username: string,
  otp: string,
  expirationMinutes = 10
) => {
  const { html, text } = createOtpEmailTemplate(username, otp, expirationMinutes);

  const { error } = await resend.emails.send({
    from: `"Event Team" <${process.env.EMAIL_FROM}>`,
    to,
    subject: '🔐 Your OTP Code',
    html,
    text,
  });

  if (error) {
    console.error('Failed to send OTP email:', error);
    throw new Error('OTP email failed');
  }
};
