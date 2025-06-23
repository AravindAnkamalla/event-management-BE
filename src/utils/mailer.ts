import 'dotenv/config'; 
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,       
    pass: process.env.EMAIL_PASSWORD,   
  },
});

export const sendPasswordEmail = async (to: string, username: string, password: string) => {
  console.log(`Sending password email to ${to} for user ${username}`);
  if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
    throw new Error('Email configuration is not set in environment variables');
  }
  await transporter.sendMail({
    from: `"Event Team" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Your Account Password',
    text: `Hello ${username},\n\nYour account has been created. Your login password is: ${password}\n\nPlease change it after login.`,
  });
};
