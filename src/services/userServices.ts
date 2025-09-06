import prisma from "../prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "../utils/errors";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/userValidations";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

interface RegisterUserInput {
  firstname?: string;
  lastname?: string;
  username: string;
  email: string;
  password: string;
}

interface LoginUserInput {
  email: string;
  password: string;
}

export const registerUser = async (data: unknown) => {
  // Validate data with Zod schema
  const parsedData = registerUserSchema.safeParse(data);
  if (!parsedData.success) {
    const messages = parsedData.error.issues.map((e) => e.message).join(", ");
    throw new BadRequestError(messages);
  }
  // Extract validated fields
  const { firstname, lastname, username, email, password } = parsedData.data;

  // Check if email already exists
  const existingEmailUser = await prisma.user.findUnique({ where: { email } });
  if (existingEmailUser) {
    throw new BadRequestError("Email already registered");
  }

  // Check if username already exists
  const existingUsernameUser = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUsernameUser) {
    throw new BadRequestError("Username already taken");
  }

  // Hash the password securely
  const passwordHash = await bcrypt.hash(password, 10);

  // Create the new user record in the database
  await prisma.user.create({
    data: {
      firstname,
      lastname,
      username,
      email,
      passwordHash,
    },
  });
};

export const loginUser = async (data: unknown) => {
  // Validate input using Zod
  const parsedData = loginUserSchema.safeParse(data);
  if (!parsedData.success) {
    const messages = parsedData.error.issues.map((i) => i.message).join(", ");
    throw new BadRequestError(messages);
  }

  const { email, password } = parsedData.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const accessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const refreshToken = async (token: string | undefined) => {
  if (!token) {
    throw new UnauthorizedError("Refresh token missing");
  }

  try {
    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as {
      userId: string;
    };

    const newAccessToken = jwt.sign(
      { userId: payload.userId },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const newRefreshToken = jwt.sign(
      { userId: payload.userId },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch {
    throw new UnauthorizedError("Invalid refresh token");
  }
};

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new BadRequestError("User not found");
  }

  return user;
};
