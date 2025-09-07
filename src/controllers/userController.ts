import { Request, Response } from "express";
import * as userService from "../services/userServices";
import { sendResponse } from "../utils/responseHandler";

const COOKIE_DOMAIN =
  process.env.NODE_ENV === "production" ? process.env.BACKEND_URL! : undefined;

export const registerUser = async (req: Request, res: Response) => {
  try {
    await userService.registerUser(req.body);
    res
      .status(201)
      .json({ status: true, message: "User registered successfully" });
  } catch (err: any) {
    res
      .status(err.statusCode || 500)
      .json({ status: false, message: err.message || "Internal Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const tokens = await userService.loginUser(req.body);

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: COOKIE_DOMAIN,
      path: "/",
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: COOKIE_DOMAIN,
      path: "/",
    });

    sendResponse({ res, message: "Login successful" });
  } catch (error: any) {
    sendResponse({
      res,
      statusCode: error.statusCode || 500,
      message: error.message || "Internal Server Error",
    });
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("accessToken", { domain: COOKIE_DOMAIN, path: "/" });
  res.clearCookie("refreshToken", { domain: COOKIE_DOMAIN, path: "/" });
  sendResponse({ res, message: "Logged out successfully" });
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const tokens = await userService.refreshToken(req.cookies.refreshToken);
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: COOKIE_DOMAIN,
      path: "/",
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: COOKIE_DOMAIN,
      path: "/",
    });
    sendResponse({ res, message: "Token refreshed" });
  } catch (error: any) {
    sendResponse({
      res,
      statusCode: error.statusCode || 403,
      message: error.message || "Invalid refresh token",
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserProfile((req as any).userId);
    sendResponse({ res, message: "User profile fetched", data: user });
  } catch (error: any) {
    sendResponse({
      res,
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch user profile",
    });
  }
};
