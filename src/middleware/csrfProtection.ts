/// <reference path="../types/express/index.d.ts" />
import csurf from "csurf";
import cookieParser from "cookie-parser";
import { Request, Response, NextFunction } from "express";

const COOKIE_DOMAIN =
  process.env.NODE_ENV === "production" ? process.env.BACKEND_URL! : undefined;

// Use this middleware to parse cookies before csurf
export const parseCookies = cookieParser();

// Configure and export CSRF protection middleware
export const csrfProtection = csurf({
  cookie: {
    httpOnly: false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    domain: COOKIE_DOMAIN,
    path: "/",
  },
});

// Middleware to expose CSRF token for frontend (in cookie or header)
export const exposeCsrfToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.cookie("XSRF-TOKEN", req.csrfToken(), {
    httpOnly: false,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    domain: COOKIE_DOMAIN,
    path: "/",
  });
  next();
};

// Error handling middleware for CSRF token errors
export const csrfErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.code === "EBADCSRFTOKEN") {
    return res
      .status(403)
      .json({ status: false, message: "Invalid CSRF token" });
  }
  next(err);
};
