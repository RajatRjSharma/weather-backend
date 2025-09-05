import prisma from "../prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "../utils/errors";

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

export const registerUser = async (data: RegisterUserInput) => {
  const { firstname, lastname, username, email, password } = data;

  if (!email || !password || !username) {
    throw new BadRequestError("Missing required fields");
  }

  const existingEmailUser = await prisma.user.findUnique({ where: { email } });
  if (existingEmailUser) {
    throw new BadRequestError("Email already registered");
  }

  const existingUsernameUser = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUsernameUser) {
    throw new BadRequestError("Username already taken");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { firstname, lastname, username, email, passwordHash },
  });
};

export const loginUser = async (data: LoginUserInput) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

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
