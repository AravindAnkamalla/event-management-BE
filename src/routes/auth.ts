import { Router } from "express";
import { login, resetPassword, sendOtp, signUp, verifyOtp } from "../controllers/auth/auth";
const authRoutes: Router = Router();
authRoutes.post("/login", login);
authRoutes.post("/signup", signUp);
authRoutes.post("/send-otp", (req, res, next) => {
  Promise.resolve(sendOtp(req, res)).catch(next);
});
authRoutes.post("/verify-otp", (req, res, next) => {
  Promise.resolve(verifyOtp(req, res)).catch(next);
});
authRoutes.post("/reset-password", (req, res, next) => {
  Promise.resolve(resetPassword(req, res)).catch(next);
});


export default authRoutes;
