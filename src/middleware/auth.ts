import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET || "dev_secret";
    const decoded = jwt.verify(token, secret) as { userId: number };
    (req as any).user = decoded; // attach to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
export function getUserIdFromToken(token: string): number {
  const secret = process.env.JWT_SECRET || "dev_secret";
  const decoded = jwt.verify(token, secret) as { userId: number };
  return decoded.userId;
}

export default authMiddleware;
