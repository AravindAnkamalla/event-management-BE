export enum Role {
  ADMIN,
  USER,
}
export interface SendAccountCreatedEmailInput {
  username: string;
  email: string;
  password: string;
}
export interface SendAccountCreatedEmailResponse {
  msg: string;
}
export interface SendOtpEmailInput {
  to: string;
  username: string;
  otp: string;
  expirationMinutes: number;
}
export interface SendOtpEmailResponse {
  msg: string;
}
