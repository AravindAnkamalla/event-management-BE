import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (allowedRoles: Array<"ADMIN" | "USER">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return res
        .status(403)
        .json({ message: "User role not found. Authentication required." });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        message: "Forbidden: You do not have the necessary permissions",
      });
    }
    next();
  };
};
