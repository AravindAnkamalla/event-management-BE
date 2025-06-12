
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: "ADMIN" | "USER";
    }
  }
}

const JWT_SECRET = "event-management";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : undefined;

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }
  console.log(JWT_SECRET);
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded &&
      "role" in decoded
    ) {
      req.userId = decoded.userId as number;
      req.userRole = decoded.role as "ADMIN" | "USER";
      next();
    } else {
      return res.status(403).json({ message: "Invalid token payload" });
    }
  });
};
