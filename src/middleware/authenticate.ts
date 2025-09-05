import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies) {
    return res.status(400).json({ message: "Bad Request: Cookies missing" });
  }

  const token = req.cookies.accessToken;
  if (!token) {
    return res
      .status(400)
      .json({ message: "Bad Request: accessToken cookie missing" });
  }

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as {
      userId: string;
    };
    (req as any).userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
