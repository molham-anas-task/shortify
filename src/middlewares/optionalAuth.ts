import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (
        typeof decoded === "object" &&
        "id" in decoded &&
        "userName" in decoded
      ) {
        req.user = {
          id: (decoded as JwtPayload).id,
          userName: (decoded as JwtPayload).userName,
        };
      }
    } catch (err) {}
  }

  next();
};
