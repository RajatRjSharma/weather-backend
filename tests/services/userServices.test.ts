import prisma from "../../src/prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  registerUser,
  loginUser,
  refreshToken,
} from "../../src/services/userServices";
import { BadRequestError, UnauthorizedError } from "../../src/utils/errors";

jest.mock("../../src/prismaClient");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("User Services", () => {
  beforeEach(() => jest.clearAllMocks());

  it("registerUser throws error on invalid data", async () => {
    await expect(registerUser({})).rejects.toThrow(BadRequestError);
  });

  it("registerUser throws if email exists", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: "1" });
    await expect(
      registerUser({
        username: "user1",
        email: "email@test.com",
        password: "Pass1234",
      })
    ).rejects.toThrow("Email already registered");
  });

  it("loginUser throws on invalid credentials", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(
      loginUser({ email: "wrong@test.com", password: "pass" })
    ).rejects.toThrow(UnauthorizedError);
  });

  it("refreshToken generates new tokens on valid token", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ userId: "user1" });
    (jwt.sign as jest.Mock)
      .mockReturnValueOnce("newAccess")
      .mockReturnValueOnce("newRefresh");
    const tokens = await refreshToken("validtoken");
    expect(tokens.accessToken).toBe("newAccess");
    expect(tokens.refreshToken).toBe("newRefresh");
  });

  it("refreshToken throws unauthorized for missing token", async () => {
    await expect(refreshToken(undefined)).rejects.toThrow(UnauthorizedError);
  });
});
